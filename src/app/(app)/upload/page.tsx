"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, FileAudio, Check, Loader2, AlertTriangle } from "lucide-react";

type AnalysisStep = {
  label: string;
  status: "pending" | "active" | "complete";
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [trackTitle, setTrackTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const ACCEPTED_TYPES = ["audio/mpeg", "audio/wav", "audio/flac", "audio/x-flac"];
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB

  const handleFile = useCallback((f: File) => {
    setError("");
    if (!ACCEPTED_TYPES.includes(f.type) && !f.name.match(/\.(mp3|wav|flac)$/i)) {
      setError("Please upload an MP3, WAV, or FLAC file.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("File must be under 50MB.");
      return;
    }
    setFile(f);
    if (!trackTitle) {
      setTrackTitle(f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    }
  }, [trackTitle]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError("");

    const steps: AnalysisStep[] = [
      { label: "File received", status: "active" },
      { label: "Audio fingerprinting", status: "pending" },
      { label: "AI pattern detection", status: "pending" },
      { label: "Analysis complete", status: "pending" },
    ];
    setAnalysisSteps(steps);

    try {
      // Step 1 complete — file received
      steps[0].status = "complete";
      steps[1].status = "active";
      setAnalysisSteps([...steps]);

      // Create track record via API (server-side mock store)
      const trackRes = await fetch("/api/tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "mock-user-00000000-0000-0000-0000-000000000001",
          track_title: trackTitle,
          artist_name: artistName,
          file_url: `https://mock-storage.local/${file.name}`,
        }),
      });

      if (!trackRes.ok) throw new Error("Failed to create track");
      const track = await trackRes.json();

      // Step 2: fingerprinting
      await new Promise((r) => setTimeout(r, 1000));
      steps[1].status = "complete";
      steps[2].status = "active";
      setAnalysisSteps([...steps]);

      // Step 3: AI detection — call API
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: track.file_url, trackId: track.id }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      steps[2].status = "complete";
      steps[3].status = "active";
      setAnalysisSteps([...steps]);

      await new Promise((r) => setTimeout(r, 800));
      steps[3].status = "complete";
      setAnalysisSteps([...steps]);

      // Redirect to questionnaire
      await new Promise((r) => setTimeout(r, 1000));
      router.push(`/questionnaire/${track.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      setUploading(false);
      setAnalysisSteps([]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* MVP Banner */}
      <div className="mb-6 p-3 rounded-lg bg-amber-900/30 border border-amber-700/50 flex items-center gap-2 text-amber-200 text-sm">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        MVP: Using simulated forensic analysis — real API integration pending
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Your Track</CardTitle>
          <CardDescription>
            Upload an audio file to analyze for AI involvement and begin the copyright registration process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!uploading ? (
            <form onSubmit={handleUpload} className="space-y-6">
              {/* Drop zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                  dragOver
                    ? "border-gold bg-gold/5"
                    : file
                    ? "border-emerald-600 bg-emerald-900/10"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".mp3,.wav,.flac"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                  className="hidden"
                />
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileAudio className="h-10 w-10 text-emerald-500" />
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                    >
                      Change file
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm font-medium">Drop your audio file here</p>
                    <p className="text-xs text-muted-foreground">
                      MP3, WAV, or FLAC — max 50MB
                    </p>
                  </div>
                )}
              </div>

              {/* Track details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Track Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter track title"
                    value={trackTitle}
                    onChange={(e) => setTrackTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artist">Artist Name</Label>
                  <Input
                    id="artist"
                    placeholder="Enter artist name"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={!file}>
                <Upload className="mr-2 h-4 w-4" />
                Upload & Analyze
              </Button>
            </form>
          ) : (
            /* Analysis progress */
            <div className="space-y-6 py-4">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 animate-pulse-gold">
                  <FileAudio className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-lg font-heading font-semibold">
                  Analyzing your track
                  <span className="inline-flex ml-1">
                    <span className="analyzing-dot">.</span>
                    <span className="analyzing-dot">.</span>
                    <span className="analyzing-dot">.</span>
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{trackTitle}</p>
              </div>

              <div className="space-y-3">
                {analysisSteps.map((step, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      step.status === "complete"
                        ? "bg-emerald-900/20"
                        : step.status === "active"
                        ? "bg-gold/5 border border-gold/20"
                        : "opacity-40"
                    }`}
                  >
                    {step.status === "complete" ? (
                      <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                    ) : step.status === "active" ? (
                      <Loader2 className="h-5 w-5 text-gold animate-spin shrink-0" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-muted-foreground shrink-0" />
                    )}
                    <span className="text-sm">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
