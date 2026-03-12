import { createServiceRoleClient } from "@/lib/supabase/server";
import { generateCWR } from "@/lib/cwr";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { trackId } = await req.json();
    if (!trackId) {
      return NextResponse.json({ error: "trackId required" }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Fetch track, score, and questionnaire data
    const [trackRes, scoreRes, questionnaireRes] = await Promise.all([
      supabase.from("track_analyses").select("*").eq("id", trackId).single(),
      supabase.from("human_scores").select("*").eq("track_id", trackId).single(),
      supabase.from("questionnaire_responses").select("*").eq("track_id", trackId).single(),
    ]);

    if (trackRes.error || scoreRes.error) {
      return NextResponse.json({ error: "Track or score not found" }, { status: 404 });
    }

    const track = trackRes.data;
    const score = scoreRes.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responses = (questionnaireRes.data?.responses || {}) as Record<string, any>;

    const cwrContent = generateCWR(
      {
        trackTitle: track.track_title,
        artistName: track.artist_name,
        releaseDate: responses.general?.release_date as string | undefined,
        isrc: responses.general?.isrc as string | undefined,
        genre: responses.general?.genre as string | undefined,
        contributors: responses.general?.contributors,
      },
      {
        id: score.id,
        track_id: score.track_id,
        overall_score: score.overall_score,
        breakdown: score.breakdown,
        eligibility: score.eligibility,
        flags: score.flags || [],
        recommendation: score.recommendation,
        created_at: score.created_at,
      }
    );

    // Store CWR file in Supabase storage
    const fileName = `cwr/${trackId}/${Date.now()}.cwr`;
    await supabase.storage
      .from("tracks")
      .upload(fileName, new Blob([cwrContent], { type: "text/plain" }), {
        contentType: "text/plain",
      });

    const { data: urlData } = supabase.storage.from("tracks").getPublicUrl(fileName);

    // Create registration record
    await supabase.from("registrations").insert({
      track_id: trackId,
      cwr_file_url: urlData.publicUrl,
    });

    // Update track status
    await supabase
      .from("track_analyses")
      .update({ status: "registered" })
      .eq("id", trackId);

    return new NextResponse(cwrContent, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="${track.track_title.replace(/[^a-zA-Z0-9]/g, "_")}.cwr"`,
      },
    });
  } catch (err) {
    console.error("CWR generation error:", err);
    return NextResponse.json({ error: "CWR generation failed" }, { status: 500 });
  }
}
