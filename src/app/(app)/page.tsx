import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileSearch,
  ClipboardCheck,
  BarChart3,
  FileText,
  Shield,
  ArrowRight,
  Music,
  Zap,
  Globe,
} from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Track",
    description: "Drag and drop your audio file. We accept MP3, WAV, and FLAC up to 50MB.",
  },
  {
    icon: FileSearch,
    title: "AI Forensic Analysis",
    description:
      "Our engine analyzes your track for AI-generated elements across vocals, melody, and production.",
  },
  {
    icon: ClipboardCheck,
    title: "Smart Questionnaire",
    description:
      "Answer targeted questions about your creative process, adapted based on what our analysis finds.",
  },
  {
    icon: BarChart3,
    title: "Human Score",
    description:
      "Get a detailed breakdown of human vs. AI contribution with a clear eligibility assessment.",
  },
  {
    icon: FileText,
    title: "CWR Registration",
    description:
      "Generate industry-standard registration files with embedded AI attestation data for your PRO.",
  },
];

const features = [
  {
    icon: Shield,
    title: "Copyright Clarity",
    description:
      "Know exactly where your track stands before you register. No surprises, no rejected claims.",
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description:
      "Get results in minutes, not weeks. Our forensic engine processes tracks faster than any manual review.",
  },
  {
    icon: Globe,
    title: "Global Registration",
    description:
      "CWR files are accepted by PROs worldwide — ASCAP, BMI, SESAC, PRS, GEMA, SACEM, and more.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-6 border-gold/30 text-gold">
              Copyright Registration for the AI Era
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-heading font-bold tracking-tight mb-6">
              Protect Your Music.
              <br />
              <span className="text-gold">Prove Your Rights.</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              VeriRights analyzes your tracks for AI involvement, calculates a human creativity
              score, and generates registration files for global royalty collection.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Start Protecting Your Music
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              Five steps from upload to registered copyright
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center group">
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-navy-700 border border-border flex items-center justify-center mx-auto mb-4 group-hover:border-gold transition-colors">
                    <step.icon className="h-6 w-6 text-gold" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-7 left-[calc(50%+28px)] w-[calc(100%-56px)] h-px bg-border" />
                  )}
                </div>
                <h3 className="font-heading font-semibold text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl border border-border bg-card hover:border-gold/30 transition-colors">
                <feature.icon className="h-8 w-8 text-gold mb-4" />
                <h3 className="font-heading text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gold flex items-center justify-center mx-auto mb-6">
            <Music className="h-9 w-9 text-navy-900" />
          </div>
          <h2 className="text-3xl font-heading font-bold mb-4">
            Ready to protect your music?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of musicians and labels securing their rights in the age of AI.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/signup">
              Create Free Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gold flex items-center justify-center">
              <Music className="h-4 w-4 text-navy-900" />
            </div>
            <span className="font-heading text-sm font-bold">
              Veri<span className="text-gold">Rights</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} VeriRights. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
