import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const WEIGHTS = {
  lyrics: 0.25,
  melody: 0.25,
  vocals: 0.2,
  production: 0.15,
  arrangement: 0.15,
};

function calculateElementScore(
  forensicAiProb: number,
  flags: string[],
  elementFlag: string,
  questionnaireAnswer: string | undefined,
  humanPercentage?: number
): number {
  const isFlagged = flags.includes(elementFlag);

  if (!isFlagged && !questionnaireAnswer) {
    // Not flagged and no answer — assume fully human
    return 100;
  }

  // Base score from forensics (inverted: higher = more human)
  const forensicHumanScore = isFlagged ? Math.max(0, 100 - forensicAiProb) : 90;

  if (!questionnaireAnswer || questionnaireAnswer === "no") {
    // User says fully human
    if (isFlagged) {
      // Conflict: forensic says AI, user says no — use conservative score
      return Math.min(forensicHumanScore + 15, 85);
    }
    return 95;
  }

  if (questionnaireAnswer === "yes") {
    // User admits full AI
    return Math.max(5, forensicHumanScore - 20);
  }

  if (questionnaireAnswer === "partially") {
    // Partial — use human percentage if provided
    const pct = humanPercentage ?? 50;
    const blended = (pct * 0.6 + forensicHumanScore * 0.4);
    return Math.round(Math.min(100, Math.max(0, blended)));
  }

  return forensicHumanScore;
}

export async function POST(req: Request) {
  try {
    const { trackId, responses, forensicScore, flags } = await req.json();

    if (!trackId) {
      return NextResponse.json({ error: "trackId required" }, { status: 400 });
    }

    const vocalsAnswer = responses?.vocals?.ai_generated;
    const vocalsHumanPct = responses?.vocals?.human_percentage;
    const melodyAnswer = responses?.melody?.ai_generated;
    const productionAnswer = responses?.production?.ai_assisted;

    const breakdown = {
      lyrics: calculateElementScore(forensicScore, flags, "AI_LYRICS", undefined),
      melody: calculateElementScore(forensicScore, flags, "AI_MELODY", melodyAnswer),
      vocals: calculateElementScore(forensicScore, flags, "AI_VOCALS", vocalsAnswer, vocalsHumanPct),
      production: calculateElementScore(forensicScore, flags, "AI_PRODUCTION", productionAnswer),
      arrangement: calculateElementScore(forensicScore, flags, "AI_ARRANGEMENT", undefined),
    };

    const overall = Math.round(
      breakdown.lyrics * WEIGHTS.lyrics +
      breakdown.melody * WEIGHTS.melody +
      breakdown.vocals * WEIGHTS.vocals +
      breakdown.production * WEIGHTS.production +
      breakdown.arrangement * WEIGHTS.arrangement
    );

    const eligibility = overall > 80 ? "full" : overall >= 20 ? "hybrid" : "ineligible";

    // Detect conflicts
    const scoreFlags: string[] = [];
    if (flags.includes("AI_VOCALS") && vocalsAnswer === "no") {
      scoreFlags.push("CONFLICT: Forensic detected AI vocals but creator attests fully human");
    }
    if (flags.includes("AI_MELODY") && melodyAnswer === "no") {
      scoreFlags.push("CONFLICT: Forensic detected AI melody but creator attests fully human");
    }
    if (flags.includes("AI_PRODUCTION") && productionAnswer === "no") {
      scoreFlags.push("CONFLICT: Forensic detected AI production but creator attests fully human");
    }

    let recommendation = "";
    if (eligibility === "full") {
      recommendation = `Your track scored ${overall}/100 on the human creativity scale. This qualifies for full copyright registration and royalty collection across all major territories. All creative elements show strong human authorship.`;
    } else if (eligibility === "hybrid") {
      recommendation = `Your track scored ${overall}/100 on the human creativity scale. This qualifies for hybrid registration — human-authored elements can be registered for copyright protection, but AI-generated portions may not be eligible for royalties in some jurisdictions. We recommend clearly documenting which elements are human-created.`;
    } else {
      recommendation = `Your track scored ${overall}/100 on the human creativity scale. Based on current copyright frameworks, tracks with predominantly AI-generated content may not qualify for copyright registration. Consider increasing human creative involvement or consulting with a music rights attorney.`;
    }

    if (scoreFlags.length > 0) {
      recommendation += " Note: There are conflicts between forensic analysis and your attestation that may require additional review.";
    }

    // Save to database
    const supabase = createServiceRoleClient();
    const { error: scoreError } = await supabase.from("human_scores").insert({
      track_id: trackId,
      overall_score: overall,
      breakdown,
      eligibility,
      flags: scoreFlags,
      recommendation,
    });

    if (scoreError) {
      console.error("Failed to save score:", scoreError);
      return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
    }

    // Update track status
    await supabase
      .from("track_analyses")
      .update({ status: "scored" })
      .eq("id", trackId);

    return NextResponse.json({ overall, breakdown, eligibility, flags: scoreFlags, recommendation });
  } catch (err) {
    console.error("Score calculation error:", err);
    return NextResponse.json({ error: "Score calculation failed" }, { status: 500 });
  }
}
