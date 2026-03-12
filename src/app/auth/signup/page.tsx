"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music, Loader2, User, Building2 } from "lucide-react";

type Step = "credentials" | "profile";

export default function SignupPage() {
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"independent" | "label">("independent");
  const [artistName, setArtistName] = useState("");
  const [proAffiliation, setProAffiliation] = useState("");
  const [ipiNumber, setIpiNumber] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === "credentials") {
      setStep("profile");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          account_type: accountType,
          artist_name: artistName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        account_type: accountType,
        artist_name: artistName,
        pro_affiliation: proAffiliation,
        ipi_number: ipiNumber || null,
        country,
      });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
    }

    router.push("/dashboard");
    router.refresh();
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=/auth/onboarding`,
      },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-navy-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-gold flex items-center justify-center">
              <Music className="h-7 w-7 text-navy-900" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            {step === "credentials" ? "Create your account" : "Complete your profile"}
          </CardTitle>
          <CardDescription>
            {step === "credentials"
              ? "Start protecting your music rights today"
              : "Tell us about yourself so we can serve you better"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {step === "credentials" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAccountType("independent")}
                      className={`p-4 rounded-lg border text-center transition-all ${
                        accountType === "independent"
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <User className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Independent</div>
                      <div className="text-xs text-muted-foreground">Solo artist</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType("label")}
                      className={`p-4 rounded-lg border text-center transition-all ${
                        accountType === "label"
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <Building2 className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Label</div>
                      <div className="text-xs text-muted-foreground">Publisher</div>
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Continue
                </Button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignup}>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign up with Google
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="artistName">
                    {accountType === "independent" ? "Artist / Stage Name" : "Label / Publisher Name"}
                  </Label>
                  <Input
                    id="artistName"
                    placeholder={accountType === "independent" ? "Your artist name" : "Label name"}
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pro">PRO Affiliation</Label>
                  <Select value={proAffiliation} onValueChange={setProAffiliation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your PRO" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASCAP">ASCAP</SelectItem>
                      <SelectItem value="BMI">BMI</SelectItem>
                      <SelectItem value="SESAC">SESAC</SelectItem>
                      <SelectItem value="PRS">PRS (UK)</SelectItem>
                      <SelectItem value="GEMA">GEMA (Germany)</SelectItem>
                      <SelectItem value="SACEM">SACEM (France)</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="none">Not affiliated yet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ipi">IPI Number (optional)</Label>
                  <Input
                    id="ipi"
                    placeholder="e.g. 00123456789"
                    value={ipiNumber}
                    onChange={(e) => setIpiNumber(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your Interested Party Information number from your PRO
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="JP">Japan</SelectItem>
                      <SelectItem value="KR">South Korea</SelectItem>
                      <SelectItem value="BR">Brazil</SelectItem>
                      <SelectItem value="NG">Nigeria</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep("credentials")} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
        {step === "credentials" && (
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-gold hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
