"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Mail, AlertTriangle, FileText, CheckCircle } from "lucide-react";
import type { HumanScore, TrackAnalysis } from "@/lib/types";

export default function RegisterPage() {
  const params = useParams();
  const trackId = params.id as string;
  const router = useRouter();

  const [track, setTrack] = useState<TrackAnalysis | null>(null);
  const [score, setScore] = useState<HumanScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

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
      setGenerated(data.track.status === "registered");
      setLoading(false);
    }
    loadData();
  }, [trackId]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/cwr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${track?.track_title.replace(/[^a-zA-Z0-9]/g, "_") || "track"}.cwr`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setGenerated(true);
    } catch (err) {
      console.error("CWR generation failed:", err);
    }
    setGenerating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!track || !score) return null;

  const breakdown = score.breakdown as Record<string, number>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6 p-3 rounded-lg bg-amber-900/30 border border-amber-700/50 flex items-center gap-2 text-amber-200 text-sm">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        MVP: Using simulated forensic analysis — real API integration pending
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Copyright Registration</CardTitle>
          <CardDescription>
            Generate your CWR (Common Works Registration) file for {track.track_title}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Registration summary */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold">Registration Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-navy-800">
                <p className="text-muted-foreground">Track</p>
                <p className="font-medium">{track.track_title}</p>
              </div>
              <div className="p-3 rounded-lg bg-navy-800">
                <p className="text-muted-foreground">Artist</p>
                <p className="font-medium">{track.artist_name}</p>
              </div>
              <div className="p-3 rounded-lg bg-navy-800">
                <p className="text-muted-foreground">Human Score</p>
                <p className="font-mono font-bold text-lg">{score.overall_score}/100</p>
              </div>
              <div className="p-3 rounded-lg bg-navy-800">
                <p className="text-muted-foreground">Eligibility</p>
                <Badge
                  variant={
                    score.eligibility === "full"
                      ? "success"
                      : score.eligibility === "hybrid"
                      ? "warning"
                      : "destructive"
                  }
                >
                  {score.eligibility === "full"
                    ? "Full Registration"
                    : score.eligibility === "hybrid"
                    ? "Hybrid Registration"
                    : "Not Eligible"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Element scores */}
          <div className="p-4 rounded-lg bg-navy-800 border border-border">
            <h4 className="text-sm font-medium mb-3">Elements Being Registered</h4>
            <div className="space-y-2">
              {Object.entries(breakdown).map(([element, elementScore]) => (
                <div key={element} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{element}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{elementScore}%</span>
                    {elementScore > 50 ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hybrid warning */}
          {score.eligibility === "hybrid" && (
            <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-700/50 text-sm">
              <h4 className="font-medium text-amber-300 mb-1">Hybrid Registration Notice</h4>
              <p className="text-amber-200/80">
                Elements with scores below 50% may not qualify for copyright protection in all
                jurisdictions. The CWR file will include all elements but flag those with
                significant AI involvement. Some PROs may require additional documentation.
              </p>
            </div>
          )}

          {/* CWR info */}
          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-gold" />
              <h4 className="font-medium">CWR File Format</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              The CWR (Common Works Registration) v2.1 file is the global standard for registering
              musical works with performing rights organizations. Your file will include embedded
              human score metadata — a VeriRights innovation that documents AI involvement
              directly in the registration.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : generated ? (
                <Download className="mr-2 h-4 w-4" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              {generating
                ? "Generating..."
                : generated
                ? "Download CWR File Again"
                : "Generate & Download CWR File"}
            </Button>

            <Button variant="outline" className="w-full" disabled>
              <Mail className="mr-2 h-4 w-4" />
              Email to PRO (Coming Soon)
            </Button>
          </div>

          {generated && (
            <div className="p-4 rounded-lg bg-emerald-900/20 border border-emerald-700/50 text-center">
              <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-medium text-emerald-300">Registration file generated!</p>
              <p className="text-sm text-emerald-200/70 mt-1">
                Submit the .cwr file to your PRO to complete registration.
              </p>
            </div>
          )}

          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
