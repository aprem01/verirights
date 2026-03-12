"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Music,
  Shield,
  ShieldAlert,
  Clock,
  Loader2,
  ArrowRight,
  ClipboardList,
  Gauge,
  Download,
  AlertTriangle,
  X,
} from "lucide-react";
import type { TrackAnalysis, HumanScore } from "@/lib/types";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" }> = {
  analyzing: { label: "Analyzing", variant: "secondary" },
  questionnaire: { label: "Questionnaire", variant: "warning" },
  scored: { label: "Scored", variant: "default" },
  registered: { label: "Registered", variant: "success" },
};

const DEMO_SHORTCUTS = [
  {
    label: "Try the Questionnaire",
    description: "Complete an adaptive AI-disclosure form",
    href: "/questionnaire/seed-track-004",
    icon: ClipboardList,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    seedId: "seed-track-004",
  },
  {
    label: "View Score Report",
    description: "See a fully ineligible AI-generated result",
    href: "/score/seed-track-003",
    icon: Gauge,
    color: "text-red-500",
    bg: "bg-red-500/10",
    seedId: "seed-track-003",
  },
  {
    label: "See Hybrid Result",
    description: "Partial AI involvement with mixed eligibility",
    href: "/score/seed-track-002",
    icon: ShieldAlert,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    seedId: "seed-track-002",
  },
  {
    label: "Download CWR File",
    description: "Generate a copyright registration file",
    href: "/register/seed-track-001",
    icon: Download,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    seedId: "seed-track-001",
  },
];

export default function DashboardPage() {
  const [tracks, setTracks] = useState<(TrackAnalysis & { human_scores?: HumanScore[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoBannerDismissed, setDemoBannerDismissed] = useState(false);

  useEffect(() => {
    async function loadTracks() {
      const userId = "mock-user-00000000-0000-0000-0000-000000000001";
      const res = await fetch(`/api/tracks?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setTracks(data);
      }
      setLoading(false);
    }
    loadTracks();
  }, []);

  const hasSeedData = tracks.some((t) => t.id.startsWith("seed-track-"));

  const stats = {
    total: tracks.length,
    fullEligible: tracks.filter((t) =>
      t.human_scores?.[0]?.eligibility === "full"
    ).length,
    hybrid: tracks.filter((t) =>
      t.human_scores?.[0]?.eligibility === "hybrid"
    ).length,
    pending: tracks.filter((t) =>
      ["analyzing", "questionnaire"].includes(t.status)
    ).length,
  };

  function getTrackAction(track: TrackAnalysis) {
    switch (track.status) {
      case "analyzing":
        return { href: `/upload`, label: "Processing..." };
      case "questionnaire":
        return { href: `/questionnaire/${track.id}`, label: "Complete Questionnaire" };
      case "scored":
        return { href: `/score/${track.id}`, label: "View Score" };
      case "registered":
        return { href: `/register/${track.id}`, label: "View Registration" };
      default:
        return { href: "#", label: "—" };
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your tracks and registrations</p>
        </div>
        <Button asChild>
          <Link href="/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Track
          </Link>
        </Button>
      </div>

      {/* Demo Mode Banner */}
      {hasSeedData && !demoBannerDismissed && (
        <div className="mb-6 p-4 rounded-lg bg-gold/10 border border-gold/30 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gold">Demo Mode</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Exploring with 7 sample tracks showcasing every workflow state.
              Upload your own track to start a real analysis.
            </p>
          </div>
          <button
            onClick={() => setDemoBannerDismissed(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Quick-Access Demo Shortcuts */}
      {hasSeedData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {DEMO_SHORTCUTS.map((shortcut) => (
            <Link
              key={shortcut.seedId}
              href={shortcut.href}
              className="group p-3 rounded-lg border border-border/60 hover:border-gold/40 transition-all hover:bg-navy-800/50"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`p-1.5 rounded-md ${shortcut.bg}`}>
                  <shortcut.icon className={`h-3.5 w-3.5 ${shortcut.color}`} />
                </div>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Demo
                </Badge>
              </div>
              <p className="text-sm font-medium group-hover:text-gold transition-colors">
                {shortcut.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {shortcut.description}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gold/10">
              <Music className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="text-2xl font-mono font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Tracks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Shield className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-mono font-bold">{stats.fullEligible}</p>
              <p className="text-xs text-muted-foreground">Fully Eligible</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-mono font-bold">{stats.hybrid}</p>
              <p className="text-xs text-muted-foreground">Hybrid</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-mono font-bold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tracks Table */}
      {tracks.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-lg font-semibold mb-2">No tracks yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Upload your first track to begin the copyright registration process.
            </p>
            <Button asChild>
              <Link href="/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Your First Track
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Tracks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Title</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden sm:table-cell">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden md:table-cell">Human Score</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden md:table-cell">Eligibility</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map((track) => {
                    const score = track.human_scores?.[0];
                    const action = getTrackAction(track);
                    const status = statusConfig[track.status] || statusConfig.analyzing;

                    return (
                      <tr key={track.id} className="border-b border-border/50 hover:bg-navy-800/50">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium">{track.track_title}</p>
                            <p className="text-xs text-muted-foreground">{track.artist_name}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2 hidden sm:table-cell">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell">
                          {score ? (
                            <span className="font-mono font-bold">
                              {score.overall_score}/100
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell">
                          {score ? (
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
                                ? "Full"
                                : score.eligibility === "hybrid"
                                ? "Hybrid"
                                : "Ineligible"}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-3 px-2 hidden lg:table-cell text-muted-foreground">
                          {new Date(track.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={action.href}>
                              {action.label}
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
