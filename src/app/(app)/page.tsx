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
  Scale,
  Brain,
  Lock,
  TrendingUp,
  Users,
  Building2,
  CheckCircle,
  AlertTriangle,
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

const problemPoints = [
  {
    icon: AlertTriangle,
    text: "PROs rejecting registrations with undisclosed AI involvement",
  },
  {
    icon: AlertTriangle,
    text: "No standard way to document human vs. AI contribution",
  },
  {
    icon: AlertTriangle,
    text: "Artists losing royalties because they can't prove authorship",
  },
  {
    icon: AlertTriangle,
    text: "Labels and publishers facing compliance uncertainty",
  },
];

const solutionPoints = [
  {
    icon: CheckCircle,
    text: "Forensic analysis detects AI patterns in vocals, melody, and production",
  },
  {
    icon: CheckCircle,
    text: "Weighted Human Score quantifies creative authorship (0-100)",
  },
  {
    icon: CheckCircle,
    text: "Adaptive questionnaire captures nuanced human-AI collaboration details",
  },
  {
    icon: CheckCircle,
    text: "CWR files with embedded attestation metadata — an industry first",
  },
];

const stats = [
  { value: "100+", label: "PROs Supported", icon: Building2 },
  { value: "95%", label: "Accuracy Rate", icon: Brain },
  { value: "< 5min", label: "Time to Register", icon: TrendingUp },
  { value: "180+", label: "Countries Covered", icon: Globe },
];

const useCases = [
  {
    icon: Music,
    title: "Independent Artists",
    description:
      "You wrote the song, maybe used AI for a beat or vocal effect. VeriRights documents exactly what's human so you keep your royalties.",
    badge: "Most Popular",
  },
  {
    icon: Building2,
    title: "Labels & Publishers",
    description:
      "Audit your catalog at scale. Identify tracks with AI involvement before PROs flag them. Protect your revenue stream.",
    badge: "Enterprise",
  },
  {
    icon: Users,
    title: "Producers & Collaborators",
    description:
      "Working with AI tools like Splice, Suno, or ElevenLabs? Register your work transparently and avoid disputes down the line.",
    badge: "Growing Fast",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-50" />
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
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              VeriRights is the first platform that analyzes tracks for AI involvement,
              calculates a human creativity score, and generates CWR registration files
              with embedded attestation data — so PROs worldwide know exactly what&apos;s human.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Try the Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              No account required for demo. See 7 sample tracks across every workflow.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-navy-800/50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className="h-4 w-4 text-gold" />
                  <span className="text-2xl lg:text-3xl font-mono font-bold">{stat.value}</span>
                </div>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-red-500/30 text-red-400">
                The Problem
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                AI Changed Music.
                <br />
                Copyright Hasn&apos;t Caught Up.
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                In 2024, the U.S. Copyright Office ruled that AI-generated content cannot be
                copyrighted — but human-directed works using AI tools can be. The problem?
                There&apos;s no standard way to prove which parts are human. Artists are losing
                royalties. Labels face compliance risks. PROs are overwhelmed.
              </p>
              <div className="space-y-3">
                {problemPoints.map((point) => (
                  <div key={point.text} className="flex items-start gap-3">
                    <point.icon className="h-4 w-4 text-red-400 shrink-0 mt-1" />
                    <span className="text-sm text-muted-foreground">{point.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Badge variant="outline" className="mb-4 border-emerald-500/30 text-emerald-400">
                The Solution
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                VeriRights Bridges
                <br />
                <span className="text-gold">The Gap.</span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We built the infrastructure the music industry needs: forensic AI detection
                combined with creator attestation, producing a verifiable Human Score that
                travels with your registration file. No more guesswork.
              </p>
              <div className="space-y-3">
                {solutionPoints.map((point) => (
                  <div key={point.text} className="flex items-start gap-3">
                    <point.icon className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />
                    <span className="text-sm text-muted-foreground">{point.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-gold/30 text-gold">
              Simple Process
            </Badge>
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
                <div className="text-xs font-mono text-gold/60 mb-1">Step {i + 1}</div>
                <h3 className="font-heading font-semibold text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Human Score Explainer */}
      <section className="py-20 border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-gold/30 text-gold">
                Our Innovation
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                The Human Score
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                A weighted, multi-dimensional assessment of human creative contribution.
                Unlike a simple yes/no check, the Human Score evaluates five distinct elements
                of your track independently — because a song with AI-assisted production but
                human-written lyrics deserves nuanced treatment.
              </p>
              <div className="space-y-4">
                {[
                  { label: "Lyrics", weight: "25%", desc: "Words, phrasing, storytelling" },
                  { label: "Melody", weight: "25%", desc: "Chord progressions, hooks, motifs" },
                  { label: "Vocals", weight: "20%", desc: "Performance, expression, delivery" },
                  { label: "Production", weight: "15%", desc: "Mixing, mastering, sound design" },
                  { label: "Arrangement", weight: "15%", desc: "Structure, instrumentation, dynamics" },
                ].map((el) => (
                  <div key={el.label} className="flex items-center gap-4 p-3 rounded-lg bg-navy-800 border border-border">
                    <span className="font-mono text-xs text-gold w-10">{el.weight}</span>
                    <div className="flex-1">
                      <span className="text-sm font-medium">{el.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">{el.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-6">
              {/* Score examples */}
              {[
                { score: 95, label: "Full Copyright", color: "#10b981", bg: "bg-emerald-900/20 border-emerald-700/50", desc: "Fully human-authored. Register with confidence." },
                { score: 68, label: "Hybrid Registration", color: "#f59e0b", bg: "bg-amber-900/20 border-amber-700/50", desc: "Mixed human/AI. Some elements may have limited protection." },
                { score: 12, label: "Not Eligible", color: "#ef4444", bg: "bg-red-900/20 border-red-700/50", desc: "Predominantly AI-generated. Cannot register for copyright." },
              ].map((ex) => (
                <div key={ex.score} className={`w-full p-4 rounded-lg border ${ex.bg}`}>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 shrink-0">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-border" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke={ex.color} strokeWidth="6"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - ex.score / 100)}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-mono font-bold" style={{ color: ex.color }}>{ex.score}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{ex.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{ex.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-gold/30 text-gold">
              Who It&apos;s For
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
              Built for Every Creator
            </h2>
            <p className="text-muted-foreground text-lg">
              Whether you&apos;re an indie artist or a major label, VeriRights adapts to your workflow
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((uc) => (
              <div key={uc.title} className="p-6 rounded-xl border border-border bg-card hover:border-gold/30 transition-colors relative">
                <Badge variant="secondary" className="absolute top-4 right-4 text-[10px]">
                  {uc.badge}
                </Badge>
                <uc.icon className="h-8 w-8 text-gold mb-4" />
                <h3 className="font-heading text-lg font-semibold mb-2">{uc.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {uc.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">Why VeriRights</h2>
          </div>
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

      {/* CWR Innovation */}
      <section className="py-20 border-b border-border bg-navy-800/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-gold/30 text-gold">
              Industry Standard + Innovation
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
              CWR Files with AI Attestation
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              The Common Works Registration (CWR) format is used by every major PRO on the planet.
              VeriRights extends it with embedded Human Score metadata — the first time AI attestation
              data has been included directly in a registration file.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-lg bg-navy-800 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-gold" />
                <h3 className="font-heading font-semibold">Standard CWR Records</h3>
              </div>
              <div className="space-y-2 text-xs font-mono text-muted-foreground">
                <div className="p-2 rounded bg-background/50">HDR — File header with sender/receiver</div>
                <div className="p-2 rounded bg-background/50">GRH — Group header for transaction type</div>
                <div className="p-2 rounded bg-background/50">NWR — New work registration details</div>
                <div className="p-2 rounded bg-background/50">SWR — Writer information and shares</div>
              </div>
            </div>
            <div className="p-5 rounded-lg bg-navy-800 border border-gold/30">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="h-5 w-5 text-gold" />
                <h3 className="font-heading font-semibold">VeriRights Extension</h3>
                <Badge className="text-[10px] bg-gold/20 text-gold border-0">New</Badge>
              </div>
              <div className="space-y-2 text-xs font-mono text-muted-foreground">
                <div className="p-2 rounded bg-gold/5 border border-gold/20">ALT — Human Score: 95/100</div>
                <div className="p-2 rounded bg-gold/5 border border-gold/20">ALT — Eligibility: FULL</div>
                <div className="p-2 rounded bg-gold/5 border border-gold/20">ALT — AI Attestation: VERIFIED</div>
                <div className="p-2 rounded bg-gold/5 border border-gold/20">ALT — Element Breakdown: L98/M95/V92/P90/A96</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gold flex items-center justify-center mx-auto mb-6">
            <Scale className="h-9 w-9 text-navy-900" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Ready to protect your music?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Join musicians and labels worldwide who are securing their rights
            with verifiable AI attestation. Try the demo with sample tracks — no
            account required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Explore the Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signup">
                Create Free Account
              </Link>
            </Button>
          </div>
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
