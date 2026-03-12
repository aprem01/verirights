// CWR (Common Works Registration) v2.1 simplified generator
// CWR is a fixed-width text format used by royalty organizations globally

import type { HumanScore } from "./types";

interface CWRTrackData {
  trackTitle: string;
  artistName: string;
  releaseDate?: string;
  isrc?: string;
  genre?: string;
  contributors?: {
    name: string;
    role: string;
    pro: string;
    ipi: string;
  }[];
  proAffiliation?: string;
  ipiNumber?: string;
}

function pad(str: string, len: number, char = " "): string {
  return (str || "").slice(0, len).padEnd(len, char);
}

function padNum(num: number, len: number): string {
  return num.toString().slice(0, len).padStart(len, "0");
}

function generateTransactionId(): string {
  return Math.random().toString(36).substring(2, 12).toUpperCase().padEnd(10, "0");
}

export function generateCWR(track: CWRTrackData, score: HumanScore): string {
  const lines: string[] = [];
  const now = new Date();
  const dateStr = `${now.getFullYear()}${padNum(now.getMonth() + 1, 2)}${padNum(now.getDate(), 2)}`;
  const timeStr = `${padNum(now.getHours(), 2)}${padNum(now.getMinutes(), 2)}${padNum(now.getSeconds(), 2)}`;
  const txnId = generateTransactionId();

  // HDR — Header Record
  lines.push(
    "HDR" +
    pad("PB", 2) +                              // Sender type: Publisher
    pad("VERIRIGHTS", 9) +                       // Sender ID
    pad("VERIRIGHTS MVP", 45) +                  // Sender name
    pad("01.10", 5) +                            // EDI Standard version
    pad("02.10", 5) +                            // Character set
    dateStr +                                     // Creation date
    timeStr +                                     // Creation time
    dateStr +                                     // Transmission date
    pad("", 15) +                                 // Character set
    pad("", 20)                                   // Padding
  );

  // GRH — Group Header
  lines.push(
    "GRH" +
    pad("NWR", 3) +                              // Transaction type: New Works Registration
    padNum(1, 5) +                                // Group ID
    pad("02.10", 5) +                             // Version
    pad("", 10)                                    // Batch request
  );

  // NWR — New Works Registration
  lines.push(
    "NWR" +
    pad(txnId, 10) +                              // Transaction sequence #
    padNum(0, 8) +                                // Record sequence #
    pad(track.trackTitle.toUpperCase(), 60) +     // Work title
    pad("", 11) +                                 // Language code + padding
    pad("", 2) +                                  // ISWC indicator
    pad("", 11) +                                 // ISWC
    pad(dateStr, 8) +                             // Copyright date
    pad("", 30) +                                 // Copyright number
    pad(track.genre?.substring(0, 3).toUpperCase() || "POP", 3) + // Musical work distribution category
    pad("ORI", 3) +                               // Version type: Original
    pad("", 40) +                                 // Excerpt type + padding
    pad("MUS", 3) +                                // Work type: Music
    pad("", 1) +                                   // Grand rights indicator
    padNum(0, 3) +                                 // Composite type + count
    pad("", 1) +                                   // Contact + padding
    pad("Y", 1)                                    // Printed edition indicator
  );

  // SWR — Writer Records (contributors)
  const writers = track.contributors?.length ? track.contributors : [
    { name: track.artistName, role: "composer", pro: track.proAffiliation || "", ipi: track.ipiNumber || "" }
  ];

  writers.forEach((writer, index) => {
    const nameParts = writer.name.split(" ");
    const lastName = nameParts.length > 1 ? nameParts.slice(-1)[0] : writer.name;
    const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : "";

    const roleCode = {
      composer: "C ",
      lyricist: "A ",
      performer: "CA",
      producer: "CA",
      arranger: "AR",
    }[writer.role] || "CA";

    lines.push(
      "SWR" +
      pad(txnId, 10) +                            // Transaction sequence
      padNum(index + 1, 8) +                       // Record sequence
      pad(writer.ipi || "", 11) +                   // IP number
      pad(lastName.toUpperCase(), 45) +            // Writer last name
      pad(firstName.toUpperCase(), 30) +           // Writer first name
      pad("", 11) +                                // Writer IPI name #
      pad(roleCode, 2) +                            // Writer designation
      pad("", 1) +                                  // Tax ID
      pad(writer.ipi || "", 13) +                    // Writer IPI base number
      pad("", 20)                                    // Personal number + padding
    );
  });

  // ALT — Alternate Title with Human Score metadata (innovation: embedding AI attestation)
  lines.push(
    "ALT" +
    pad(txnId, 10) +
    padNum(99, 8) +
    pad(`HUMAN_SCORE:${score.overall_score}|ELIGIBILITY:${score.eligibility.toUpperCase()}`, 60) +
    pad("AT", 2) +                                  // Title type: Alternative title
    pad("EN", 2)                                     // Language
  );

  // Add score breakdown as additional ALT record
  const breakdownStr = Object.entries(score.breakdown)
    .map(([k, v]) => `${k.toUpperCase()}:${v}`)
    .join("|");
  lines.push(
    "ALT" +
    pad(txnId, 10) +
    padNum(100, 8) +
    pad(`BREAKDOWN|${breakdownStr}`, 60) +
    pad("AT", 2) +
    pad("EN", 2)
  );

  // GRT — Group Trailer
  lines.push(
    "GRT" +
    padNum(1, 5) +                                // Group ID
    padNum(lines.length - 2, 5) +                  // Transaction count
    padNum(lines.length - 2, 8) +                  // Record count
    pad("", 20)                                     // Padding
  );

  // TRL — Trailer Record
  lines.push(
    "TRL" +
    padNum(1, 5) +                                 // Group count
    padNum(lines.length - 1, 5) +                  // Transaction count
    padNum(lines.length, 8) +                      // Record count
    pad("", 20)                                     // Padding
  );

  return lines.join("\r\n");
}
