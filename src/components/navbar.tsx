"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Music, LayoutDashboard, Upload, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase.auth.getUser().then(({ data }: any) => setUser(data.user));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="border-b border-border bg-navy-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
              <Music className="h-5 w-5 text-navy-900" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">
              Veri<span className="text-gold">Rights</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/pricing">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pricing
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/pricing">Pricing</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Log In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
