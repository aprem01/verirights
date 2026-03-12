import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function updateSession(request: NextRequest) {
  // In mock mode, skip all auth checks — everything is accessible
  if (isMockMode) {
    return NextResponse.next({ request: { headers: request.headers } });
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Redirect unauthenticated users trying to access protected routes
  const protectedPaths = ["/dashboard", "/upload", "/questionnaire", "/score", "/register"];
  const isProtected = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (isProtected && !user) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages
  if (request.nextUrl.pathname.startsWith("/auth") && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
