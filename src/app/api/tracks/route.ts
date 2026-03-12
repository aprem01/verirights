import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST — create a new track
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("track_analyses")
      .insert({
        user_id: body.user_id,
        track_title: body.track_title,
        artist_name: body.artist_name,
        file_url: body.file_url || "",
        status: "analyzing",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("Create track error:", err);
    return NextResponse.json({ error: "Failed to create track" }, { status: 500 });
  }
}

// GET — list tracks for a user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("track_analyses")
      .select("*, human_scores(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data || []);
  } catch (err) {
    console.error("List tracks error:", err);
    return NextResponse.json({ error: "Failed to list tracks" }, { status: 500 });
  }
}
