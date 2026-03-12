"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight, AlertTriangle, Shield, ShieldAlert, ShieldOff } from "lucide-react";
import type { HumanScore, TrackAnalysis } from "@/lib/types";

function ScoreGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score > 80 ? "#10b981" : score >= 20 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="45" className="score-gauge-track" />
        <circle
          cx="50"
          cy="50"
          r="45"
          className="score-gauge-fill"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.5s ease-out",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-mono font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          Human Score
        </span>
      </div>
    </div>
  );
}

function BreakdownBar({ label, score }: { label: string; score: number }) {
  const color =
    score > 80 ? "bg-emerald-500" : score >= 20 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="capitalize">{label}</span>
        <span className="font-mono">{score}%</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function ScorePage() {
  const params = useParams();
  const trackId = params.id as string;
  const router = useRouter();

  const [score, setScore] = useState<HumanScore | null>(null);
  const [track, setTrack] = useState<TrackAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await fetch(`/api/tracks/${trackId}`);
      if (!res.ok) {
        router.push("/dashboard");
        return;
      }
      const data = await res.json();
      if (!data.track || !data.score) {
        router.push("/dashboard");
        return;
      }
      setTrack(data.track);
      setScore(data.score);
      setLoading(false);
    }
    loadData();
  }, [trackId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!score || !track) return null;

  const EligibilityIcon =
    score.eligibility === "full" ? Shield : score.eligibility === "hybrid" ? ShieldAlert : ShieldOff;

  const eligibilityConfig = {
    full: {
      label: "Full Copyright Eligible",
      variant: "success" as const,
      color: "text-emerald-500",
      bg: "bg-emerald-900/20 border-emerald-700/50",
    },
    hybrid: {
      label: "Hybrid — Partial Registration",
      variant: "warning" as const,
      color: "text-amber-500",
      bg: "bg-amber-900/20 border-amber-700/50",
    },
    ineligible: {
      label: "Not Eligible for Registration",
      variant: "destructive" as const,
      color: "text-red-500",
      bg: "bg-red-900/20 border-red-700/50",
    },
  };

  const config = eligibilityConfig[score.eligibility];
  const breakdown = score.breakdown as Record<string, number>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6 p-3 rounded-lg bg-amber-900/30 border border-amber-700/50 flex items-center gap-2 text-amber-200 text-sm">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        MVP: Using simulated forensic analysis — real API integration pending
      </div>

      <Card className="mb-6">
        <CardHeader className="text-center pb-2">
          <p className="text-sm text-muted-foreground">{track.track_title}</p>
          <CardTitle className="text-2xl">Human Score Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Score gauge */}
          <ScoreGauge score={score.overall_score} />

          {/* Eligibility badge */}
          <div className={`p-4 rounded-lg border text-center ${config.bg}`}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <EligibilityIcon className={`h-5 w-5 ${config.color}`} />
              <Badge variant={config.variant} className="text-sm">
                {config.label}
              </Badge>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Element Breakdown</h3>
            {Object.entries(breakdown).map(([key, value]) => (
              <BreakdownBar key={key} label={key} score={value} />
            ))}
          </div>

          {/* Flags */}
          {score.flags && score.flags.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-heading text-lg font-semibold text-amber-500">Review Flags</h3>
              {score.flags.map((flag, i) => (
                <div key={i} className="p-3 rounded-lg bg-amber-900/20 border border-amber-700/50 text-sm text-amber-200">
                  {flag}
                </div>
              ))}
            </div>
          )}

          {/* Recommendation */}
          <div className="p-4 rounded-lg bg-navy-800 border border-border">
            <h3 className="font-heading text-sm font-semibold mb-2 text-gold">Recommendation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{score.recommendation}</p>
          </div>

          {/* CTA */}
          {score.eligibility !== "ineligible" && (
            <Button className="w-full" size="lg" asChild>
              <Link href={`/register/${trackId}`}>
                Generate Registration Files
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}

          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
