import { createBrowserClient } from "@supabase/ssr";
import { createMockClient } from "@/lib/mock/client";

const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createClient(): any {
  if (isMockMode) {
    return createMockClient();
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
