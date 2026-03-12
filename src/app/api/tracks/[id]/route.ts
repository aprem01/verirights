import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET — get a single track with its score
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServiceRoleClient();

    const [trackRes, scoreRes, questionnaireRes] = await Promise.all([
      supabase.from("track_analyses").select("*").eq("id", params.id).single(),
      supabase.from("human_scores").select("*").eq("track_id", params.id).single(),
      supabase.from("questionnaire_responses").select("*").eq("track_id", params.id).single(),
    ]);

    if (trackRes.error) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    return NextResponse.json({
      track: trackRes.data,
      score: scoreRes.data || null,
      questionnaire: questionnaireRes.data || null,
    });
  } catch (err) {
    console.error("Get track error:", err);
    return NextResponse.json({ error: "Failed to get track" }, { status: 500 });
  }
}
