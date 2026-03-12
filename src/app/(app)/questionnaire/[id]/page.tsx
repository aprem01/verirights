"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronRight, ChevronLeft, AlertTriangle } from "lucide-react";
import type { TrackAnalysis } from "@/lib/types";

interface Contributor {
  name: string;
  role: string;
  pro: string;
  ipi: string;
}

export default function QuestionnairePage() {
  const params = useParams();
  const trackId = params.id as string;
  const router = useRouter();

  const [track, setTrack] = useState<TrackAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);

  // General info
  const [releaseDate, setReleaseDate] = useState("");
  const [isrc, setIsrc] = useState("");
  const [genre, setGenre] = useState("");
  const [contributors, setContributors] = useState<Contributor[]>([
    { name: "", role: "composer", pro: "", ipi: "" },
  ]);

  // AI Vocals
  const [vocalsAI, setVocalsAI] = useState("");
  const [vocalsHumanPct, setVocalsHumanPct] = useState("50");
  const [vocalsAITool, setVocalsAITool] = useState("");

  // AI Melody
  const [melodyAI, setMelodyAI] = useState("");
  const [melodyHumanModified, setMelodyHumanModified] = useState("");
  const [melodyHumanDescription, setMelodyHumanDescription] = useState("");

  // AI Production
  const [productionAI, setProductionAI] = useState("");
  const [productionTools, setProductionTools] = useState<string[]>([]);

  // Attestation
  const [attested, setAttested] = useState(false);
  const [attestationName, setAttestationName] = useState("");

  useEffect(() => {
    async function loadTrack() {
      const res = await fetch(`/api/tracks/${trackId}`);
      if (!res.ok) {
        router.push("/dashboard");
        return;
      }
      const { track: trackData } = await res.json();
      if (!trackData) {
        router.push("/dashboard");
        return;
      }
      setTrack(trackData);
      setLoading(false);
    }
    loadTrack();
  }, [trackId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!track) return null;

  const flags = track.forensic_flags || [];
  const hasVocals = flags.includes("AI_VOCALS");
  const hasMelody = flags.includes("AI_MELODY");
  const hasProduction = flags.includes("AI_PRODUCTION");

  // Build steps dynamically
  const steps: { title: string; id: string }[] = [
    { title: "Track Information", id: "general" },
  ];
  if (hasVocals) steps.push({ title: "Vocals Analysis", id: "vocals" });
  if (hasMelody) steps.push({ title: "Melody Analysis", id: "melody" });
  if (hasProduction) steps.push({ title: "Production Analysis", id: "production" });
  steps.push({ title: "Attestation", id: "attestation" });

  const addContributor = () => {
    setContributors([...contributors, { name: "", role: "performer", pro: "", ipi: "" }]);
  };

  const updateContributor = (index: number, field: keyof Contributor, value: string) => {
    const updated = [...contributors];
    updated[index] = { ...updated[index], [field]: value };
    setContributors(updated);
  };

  const toggleProductionTool = (tool: string) => {
    setProductionTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const responses = {
      general: {
        release_date: releaseDate,
        isrc,
        genre,
        contributors,
      },
      ...(hasVocals && {
        vocals: {
          ai_generated: vocalsAI,
          human_percentage: vocalsAI === "partially" ? parseInt(vocalsHumanPct) : vocalsAI === "no" ? 100 : 0,
          ai_tool: vocalsAITool,
        },
      }),
      ...(hasMelody && {
        melody: {
          ai_generated: melodyAI,
          human_modified: melodyHumanModified,
          human_description: melodyHumanDescription,
        },
      }),
      ...(hasProduction && {
        production: {
          ai_assisted: productionAI,
          tools: productionTools,
        },
      }),
    };

    const saveRes = await fetch("/api/questionnaire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        track_id: trackId,
        responses,
        attestation_name: attestationName,
        attested_at: new Date().toISOString(),
      }),
    });

    if (!saveRes.ok) {
      console.error("Failed to save questionnaire");
      setSubmitting(false);
      return;
    }

    // Calculate score
    const scoreRes = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId, responses, forensicScore: track.forensic_score, flags }),
    });

    if (scoreRes.ok) {
      router.push(`/score/${trackId}`);
    } else {
      setSubmitting(false);
    }
  };

  const currentStepId = steps[step]?.id;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6 p-3 rounded-lg bg-amber-900/30 border border-amber-700/50 flex items-center gap-2 text-amber-200 text-sm">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        MVP: Using simulated forensic analysis — real API integration pending
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-heading text-sm text-muted-foreground">
            {track.track_title} — Questionnaire
          </h2>
          <span className="text-xs text-muted-foreground">
            Step {step + 1} of {steps.length}
          </span>
        </div>
        <div className="flex gap-1">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= step ? "bg-gold" : "bg-secondary"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          {flags.map((flag) => (
            <Badge key={flag} variant="warning" className="text-xs">
              {flag.replace("AI_", "AI ")}
            </Badge>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[step].title}</CardTitle>
          <CardDescription>
            {currentStepId === "general" && "Provide basic information about your track and contributors."}
            {currentStepId === "vocals" && "Our analysis flagged potential AI involvement in vocals. Please clarify."}
            {currentStepId === "melody" && "Our analysis flagged potential AI involvement in melody/composition. Please clarify."}
            {currentStepId === "production" && "Our analysis flagged potential AI involvement in production. Please clarify."}
            {currentStepId === "attestation" && "Review and confirm the accuracy of your responses."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* GENERAL */}
          {currentStepId === "general" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Release Date</Label>
                  <Input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>ISRC (optional)</Label>
                  <Input placeholder="e.g. USRC17607839" value={isrc} onChange={(e) => setIsrc(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Primary Genre</Label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger><SelectValue placeholder="Select genre" /></SelectTrigger>
                  <SelectContent>
                    {["Pop", "Hip-Hop/Rap", "R&B", "Rock", "Electronic", "Country", "Jazz", "Classical", "Latin", "Afrobeats", "Other"].map((g) => (
                      <SelectItem key={g} value={g.toLowerCase()}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Contributors</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={addContributor}>
                    + Add Contributor
                  </Button>
                </div>
                {contributors.map((c, i) => (
                  <div key={i} className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-navy-800 border border-border">
                    <Input placeholder="Name" value={c.name} onChange={(e) => updateContributor(i, "name", e.target.value)} />
                    <Select value={c.role} onValueChange={(v) => updateContributor(i, "role", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="composer">Composer</SelectItem>
                        <SelectItem value="lyricist">Lyricist</SelectItem>
                        <SelectItem value="performer">Performer</SelectItem>
                        <SelectItem value="producer">Producer</SelectItem>
                        <SelectItem value="arranger">Arranger</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="PRO (e.g. ASCAP)" value={c.pro} onChange={(e) => updateContributor(i, "pro", e.target.value)} />
                    <Input placeholder="IPI (optional)" value={c.ipi} onChange={(e) => updateContributor(i, "ipi", e.target.value)} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* VOCALS */}
          {currentStepId === "vocals" && (
            <>
              <div className="space-y-2">
                <Label>Were any vocals generated using AI tools?</Label>
                <Select value={vocalsAI} onValueChange={setVocalsAI}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="partially">Partially</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {vocalsAI === "partially" && (
                <div className="space-y-2">
                  <Label>What % of vocal performance is human?</Label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={vocalsHumanPct}
                      onChange={(e) => setVocalsHumanPct(e.target.value)}
                      className="flex-1 accent-gold"
                    />
                    <span className="font-mono text-sm w-12 text-right">{vocalsHumanPct}%</span>
                  </div>
                </div>
              )}
              {(vocalsAI === "yes" || vocalsAI === "partially") && (
                <div className="space-y-2">
                  <Label>Which AI tool was used?</Label>
                  <Select value={vocalsAITool} onValueChange={setVocalsAITool}>
                    <SelectTrigger><SelectValue placeholder="Select tool" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="suno">Suno</SelectItem>
                      <SelectItem value="udio">Udio</SelectItem>
                      <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="none">None / Not sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {/* MELODY */}
          {currentStepId === "melody" && (
            <>
              <div className="space-y-2">
                <Label>Was the melody/chord progression generated by AI?</Label>
                <Select value={melodyAI} onValueChange={setMelodyAI}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="partially">Partially</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(melodyAI === "yes" || melodyAI === "partially") && (
                <div className="space-y-2">
                  <Label>Did a human composer modify or arrange it?</Label>
                  <Select value={melodyHumanModified} onValueChange={setMelodyHumanModified}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Describe the human creative contribution to melody</Label>
                <Textarea
                  placeholder="e.g., I composed the main hook and bridge melody, then used AI to generate variations on the verse..."
                  value={melodyHumanDescription}
                  onChange={(e) => setMelodyHumanDescription(e.target.value)}
                />
              </div>
            </>
          )}

          {/* PRODUCTION */}
          {currentStepId === "production" && (
            <>
              <div className="space-y-2">
                <Label>Was production/mixing/mastering AI-assisted?</Label>
                <Select value={productionAI} onValueChange={setProductionAI}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="partially">Partially</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(productionAI === "yes" || productionAI === "partially") && (
                <div className="space-y-3">
                  <Label>Which production tools were used?</Label>
                  {["Splice AI", "Landr", "iZotope", "BandLab", "Amper", "Other"].map((tool) => (
                    <label key={tool} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={productionTools.includes(tool)}
                        onCheckedChange={() => toggleProductionTool(tool)}
                      />
                      <span className="text-sm">{tool}</span>
                    </label>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ATTESTATION */}
          {currentStepId === "attestation" && (
            <>
              <div className="p-4 rounded-lg bg-navy-800 border border-border space-y-3">
                <p className="text-sm">
                  By signing below, you confirm that all information provided in this questionnaire
                  is accurate and complete to the best of your knowledge. False attestation may
                  affect your copyright registration and royalty eligibility.
                </p>
                <label className="flex items-start gap-2 cursor-pointer">
                  <Checkbox
                    checked={attested}
                    onCheckedChange={(checked) => setAttested(checked as boolean)}
                    className="mt-0.5"
                  />
                  <span className="text-sm">
                    I confirm the above is accurate and complete to the best of my knowledge
                  </span>
                </label>
              </div>
              <div className="space-y-2">
                <Label>Type your full name as signature</Label>
                <Input
                  placeholder="Your full legal name"
                  value={attestationName}
                  onChange={(e) => setAttestationName(e.target.value)}
                  className="font-mono"
                />
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>

            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(step + 1)}>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!attested || !attestationName || submitting}
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Calculate Human Score
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
