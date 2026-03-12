import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = createServiceRoleClient();

    const { error } = await supabase.from("questionnaire_responses").insert({
      track_id: body.track_id,
      responses: body.responses,
      attestation_name: body.attestation_name,
      attested_at: body.attested_at,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Questionnaire save error:", err);
    return NextResponse.json({ error: "Failed to save questionnaire" }, { status: 500 });
  }
}
