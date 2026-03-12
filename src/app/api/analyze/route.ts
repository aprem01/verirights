import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// MVP STUB — replace with real forensic API call (e.g. AI Music Detector, Suno detector, etc.)
export async function POST(req: Request) {
  try {
    const { trackId } = await req.json();

    if (!trackId) {
      return NextResponse.json({ error: "trackId is required" }, { status: 400 });
    }

    // TODO: Replace stub with real API call:
    // const result = await fetch('https://api.realforensics.com/detect', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${process.env.FORENSIC_API_KEY}` },
    //   body: JSON.stringify({ audio_url: fileUrl })
    // })

    // Simulate processing delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Stub returns realistic mock data for development
    const flagOptions = [
      ["AI_VOCALS", "AI_MELODY"],
      ["AI_PRODUCTION"],
      ["AI_MELODY", "AI_PRODUCTION"],
      ["AI_VOCALS"],
      ["AI_VOCALS", "AI_MELODY", "AI_PRODUCTION"],
      [],
    ];

    const randomFlags = flagOptions[Math.floor(Math.random() * flagOptions.length)];
    const aiProbability = randomFlags.length === 0
      ? Math.random() * 0.15
      : 0.4 + Math.random() * 0.5;

    const mockResult = {
      ai_probability: Math.round(aiProbability * 100) / 100,
      flags: randomFlags,
      confidence: aiProbability > 0.7 ? "high" : aiProbability > 0.4 ? "medium" : "low",
      model_version: "stub-v1",
    };

    // Save to Supabase
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("track_analyses")
      .update({
        forensic_score: mockResult.ai_probability * 100,
        forensic_flags: mockResult.flags,
        status: "questionnaire",
      })
      .eq("id", trackId);

    if (error) {
      console.error("Failed to update track:", error);
      return NextResponse.json({ error: "Failed to save analysis" }, { status: 500 });
    }

    return NextResponse.json(mockResult);
  } catch (err) {
    console.error("Analysis error:", err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
