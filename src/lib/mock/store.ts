// In-memory mock data store — shared across API routes within a single server process
// Data resets on server restart, which is fine for MVP demo purposes

import type { TrackAnalysis, HumanScore, QuestionnaireResponse, Registration, Profile } from "@/lib/types";

export const MOCK_USER_ID = "mock-user-00000000-0000-0000-0000-000000000001";

export const MOCK_USER = {
  id: MOCK_USER_ID,
  email: "demo@verirights.com",
  user_metadata: {
    account_type: "independent",
    artist_name: "Demo Artist",
  },
};

const mockProfile: Profile = {
  id: MOCK_USER_ID,
  account_type: "independent",
  artist_name: "Demo Artist",
  pro_affiliation: "ASCAP",
  ipi_number: "00123456789",
  country: "US",
  stripe_customer_id: null,
  created_at: new Date().toISOString(),
};

// Persist stores on globalThis so they survive Next.js HMR in dev mode
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;
if (!g.__mockStore) {
  const _tracks = new Map<string, TrackAnalysis>();
  const _scores = new Map<string, HumanScore>();
  const _questionnaires = new Map<string, QuestionnaireResponse>();
  const _registrations = new Map<string, Registration>();

  // Helper: date N days ago
  const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

  // ===================== SEED DATA =====================

  // Track 1: "Golden Hour" — Fully human, registered, happy path
  _tracks.set("seed-track-001", {
    id: "seed-track-001", user_id: MOCK_USER_ID,
    track_title: "Golden Hour", artist_name: "Aria Chen",
    file_url: "https://mock-storage.local/golden_hour.wav",
    forensic_score: 8, forensic_flags: [], status: "registered",
    created_at: daysAgo(7),
  });
  _scores.set("seed-score-001", {
    id: "seed-score-001", track_id: "seed-track-001", overall_score: 95,
    breakdown: { lyrics: 98, melody: 95, vocals: 92, production: 90, arrangement: 96 },
    eligibility: "full", flags: [],
    recommendation: "Excellent! Your track scored 95/100 with strong human authorship across all elements. It qualifies for full copyright registration with all major PROs.",
    created_at: daysAgo(6),
  });
  _questionnaires.set("seed-q-001", {
    id: "seed-q-001", track_id: "seed-track-001",
    responses: { general: { release_date: "2026-02-15", isrc: "USRC17607839", genre: "pop", contributors: [{ name: "Aria Chen", role: "composer", pro: "ASCAP", ipi: "00123456789" }] } },
    attestation_name: "Aria Chen", attested_at: daysAgo(6), created_at: daysAgo(6),
  });
  _registrations.set("seed-reg-001", {
    id: "seed-reg-001", track_id: "seed-track-001",
    cwr_file_url: "https://mock-storage.local/golden_hour.cwr",
    payment_id: null, registered_at: daysAgo(5),
  });

  // Track 2: "Neon Pulse" — Hybrid with AI production, registered
  _tracks.set("seed-track-002", {
    id: "seed-track-002", user_id: MOCK_USER_ID,
    track_title: "Neon Pulse", artist_name: "DJ Vertex",
    file_url: "https://mock-storage.local/neon_pulse.wav",
    forensic_score: 52, forensic_flags: ["AI_PRODUCTION"], status: "registered",
    created_at: daysAgo(6),
  });
  _scores.set("seed-score-002", {
    id: "seed-score-002", track_id: "seed-track-002", overall_score: 68,
    breakdown: { lyrics: 95, melody: 88, vocals: 90, production: 15, arrangement: 45 },
    eligibility: "hybrid", flags: [],
    recommendation: "Your track scored 68/100. It qualifies for hybrid registration. AI-assisted production elements may not be eligible for royalties in some jurisdictions. Human-authored lyrics, melody, and vocals will receive full protection.",
    created_at: daysAgo(5),
  });
  _questionnaires.set("seed-q-002", {
    id: "seed-q-002", track_id: "seed-track-002",
    responses: { general: { release_date: "2026-03-01", genre: "electronic", contributors: [{ name: "DJ Vertex", role: "producer", pro: "BMI", ipi: "" }] }, production: { ai_assisted: "yes", tools: ["Splice AI", "Landr"] } },
    attestation_name: "Marcus Vertex", attested_at: daysAgo(5), created_at: daysAgo(5),
  });
  _registrations.set("seed-reg-002", {
    id: "seed-reg-002", track_id: "seed-track-002",
    cwr_file_url: "https://mock-storage.local/neon_pulse.cwr",
    payment_id: null, registered_at: daysAgo(4),
  });

  // Track 3: "Synthetic Dreams" — Heavily AI, ineligible, scored
  _tracks.set("seed-track-003", {
    id: "seed-track-003", user_id: MOCK_USER_ID,
    track_title: "Synthetic Dreams", artist_name: "AI Collective",
    file_url: "https://mock-storage.local/synthetic_dreams.wav",
    forensic_score: 91, forensic_flags: ["AI_VOCALS", "AI_MELODY", "AI_PRODUCTION"], status: "scored",
    created_at: daysAgo(5),
  });
  _scores.set("seed-score-003", {
    id: "seed-score-003", track_id: "seed-track-003", overall_score: 12,
    breakdown: { lyrics: 40, melody: 5, vocals: 3, production: 5, arrangement: 10 },
    eligibility: "ineligible",
    flags: ["CONFLICT: Forensic detected AI vocals but creator attests fully human"],
    recommendation: "Your track scored 12/100 and does not currently qualify for copyright registration. The high level of AI involvement across vocals, melody, and production means most PROs will not accept this work. Consider increasing human creative contribution to key elements.",
    created_at: daysAgo(4),
  });
  _questionnaires.set("seed-q-003", {
    id: "seed-q-003", track_id: "seed-track-003",
    responses: { general: { release_date: "2026-03-10", genre: "electronic", contributors: [{ name: "Sam Reed", role: "producer", pro: "", ipi: "" }] }, vocals: { ai_generated: "no", human_percentage: 100, ai_tool: "" }, melody: { ai_generated: "no", human_modified: "yes", human_description: "Composed original melody" }, production: { ai_assisted: "partially", tools: ["Amper", "BandLab"] } },
    attestation_name: "Sam Reed", attested_at: daysAgo(4), created_at: daysAgo(4),
  });

  // Track 4: "Midnight Confessions" — Awaiting questionnaire, vocals + melody flags
  _tracks.set("seed-track-004", {
    id: "seed-track-004", user_id: MOCK_USER_ID,
    track_title: "Midnight Confessions", artist_name: "Luna Park",
    file_url: "https://mock-storage.local/midnight_confessions.wav",
    forensic_score: 63, forensic_flags: ["AI_VOCALS", "AI_MELODY"], status: "questionnaire",
    created_at: daysAgo(3),
  });

  // Track 5: "Bassline Theory" — Awaiting questionnaire, production only
  _tracks.set("seed-track-005", {
    id: "seed-track-005", user_id: MOCK_USER_ID,
    track_title: "Bassline Theory", artist_name: "Groove Lab",
    file_url: "https://mock-storage.local/bassline_theory.wav",
    forensic_score: 44, forensic_flags: ["AI_PRODUCTION"], status: "questionnaire",
    created_at: daysAgo(2),
  });

  // Track 6: "Cloudbreaker" — Currently analyzing
  _tracks.set("seed-track-006", {
    id: "seed-track-006", user_id: MOCK_USER_ID,
    track_title: "Cloudbreaker", artist_name: "Sky Atlas",
    file_url: "https://mock-storage.local/cloudbreaker.wav",
    forensic_score: 0, forensic_flags: [], status: "analyzing",
    created_at: daysAgo(1),
  });

  // Track 7: "Velvet Horizon" — Scored, full eligibility but with conflict flag
  _tracks.set("seed-track-007", {
    id: "seed-track-007", user_id: MOCK_USER_ID,
    track_title: "Velvet Horizon", artist_name: "Aria Chen",
    file_url: "https://mock-storage.local/velvet_horizon.wav",
    forensic_score: 38, forensic_flags: ["AI_MELODY"], status: "scored",
    created_at: daysAgo(4),
  });
  _scores.set("seed-score-007", {
    id: "seed-score-007", track_id: "seed-track-007", overall_score: 82,
    breakdown: { lyrics: 95, melody: 60, vocals: 90, production: 85, arrangement: 78 },
    eligibility: "full",
    flags: ["CONFLICT: Forensic detected AI melody but creator attests fully human"],
    recommendation: "Your track scored 82/100 and qualifies for full copyright registration. Note: There are conflicts between forensic analysis and your attestation regarding melody that may require additional review by the PRO.",
    created_at: daysAgo(3),
  });
  _questionnaires.set("seed-q-007", {
    id: "seed-q-007", track_id: "seed-track-007",
    responses: { general: { release_date: "2026-02-20", genre: "r&b", contributors: [{ name: "Aria Chen", role: "composer", pro: "ASCAP", ipi: "00123456789" }, { name: "Jay Monet", role: "producer", pro: "BMI", ipi: "" }] }, melody: { ai_generated: "no", human_modified: "yes", human_description: "Wrote the entire melody and chord progression by hand on piano" } },
    attestation_name: "Aria Chen", attested_at: daysAgo(3), created_at: daysAgo(3),
  });

  g.__mockStore = {
    profiles: new Map<string, Profile>([[MOCK_USER_ID, mockProfile]]),
    tracks: _tracks,
    questionnaires: _questionnaires,
    scores: _scores,
    registrations: _registrations,
  };
}
const profiles: Map<string, Profile> = g.__mockStore.profiles;
const tracks: Map<string, TrackAnalysis> = g.__mockStore.tracks;
const questionnaires: Map<string, QuestionnaireResponse> = g.__mockStore.questionnaires;
const scores: Map<string, HumanScore> = g.__mockStore.scores;
const registrations: Map<string, Registration> = g.__mockStore.registrations;

function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Generic query builder result type
interface QueryResult<T> {
  data: T | null;
  error: null | { message: string };
}

// ---- Profiles ----
export function getProfile(id: string): QueryResult<Profile> {
  const p = profiles.get(id);
  return p ? { data: p, error: null } : { data: null, error: { message: "Not found" } };
}
export function upsertProfile(profile: Partial<Profile> & { id: string }): QueryResult<Profile> {
  const existing = profiles.get(profile.id) || mockProfile;
  const merged = { ...existing, ...profile };
  profiles.set(profile.id, merged);
  return { data: merged, error: null };
}

// ---- Tracks ----
export function insertTrack(track: Omit<TrackAnalysis, "id" | "created_at">): QueryResult<TrackAnalysis> {
  const full: TrackAnalysis = {
    ...track,
    id: generateId(),
    forensic_score: track.forensic_score ?? 0,
    forensic_flags: track.forensic_flags ?? [],
    created_at: new Date().toISOString(),
  };
  tracks.set(full.id, full);
  return { data: full, error: null };
}
export function getTrack(id: string): QueryResult<TrackAnalysis> {
  const t = tracks.get(id);
  return t ? { data: t, error: null } : { data: null, error: { message: "Not found" } };
}
export function updateTrack(id: string, updates: Partial<TrackAnalysis>): QueryResult<TrackAnalysis> {
  const t = tracks.get(id);
  if (!t) return { data: null, error: { message: "Not found" } };
  const updated = { ...t, ...updates };
  tracks.set(id, updated);
  return { data: updated, error: null };
}
export function getTracksByUser(userId: string): QueryResult<(TrackAnalysis & { human_scores: HumanScore[] })[]> {
  const userTracks = Array.from(tracks.values())
    .filter((t) => t.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((t) => {
      const score = Array.from(scores.values()).find((s) => s.track_id === t.id);
      return { ...t, human_scores: score ? [score] : [] };
    });
  return { data: userTracks, error: null };
}

// ---- Questionnaires ----
export function insertQuestionnaire(q: {
  track_id: string;
  responses: Record<string, unknown>;
  attestation_name: string;
  attested_at: string;
}): QueryResult<QuestionnaireResponse> {
  const full: QuestionnaireResponse = {
    id: generateId(),
    track_id: q.track_id,
    responses: q.responses,
    attestation_name: q.attestation_name,
    attested_at: q.attested_at,
    created_at: new Date().toISOString(),
  };
  questionnaires.set(full.id, full);
  return { data: full, error: null };
}
export function getQuestionnaireByTrack(trackId: string): QueryResult<QuestionnaireResponse> {
  const q = Array.from(questionnaires.values()).find((q) => q.track_id === trackId);
  return q ? { data: q, error: null } : { data: null, error: { message: "Not found" } };
}

// ---- Scores ----
export function insertScore(s: Omit<HumanScore, "id" | "created_at">): QueryResult<HumanScore> {
  const full: HumanScore = {
    ...s,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  scores.set(full.id, full);
  return { data: full, error: null };
}
export function getScoreByTrack(trackId: string): QueryResult<HumanScore> {
  const s = Array.from(scores.values()).find((s) => s.track_id === trackId);
  return s ? { data: s, error: null } : { data: null, error: { message: "Not found" } };
}

// ---- Registrations ----
export function insertRegistration(r: {
  track_id: string;
  cwr_file_url: string;
}): QueryResult<Registration> {
  const full: Registration = {
    id: generateId(),
    track_id: r.track_id,
    cwr_file_url: r.cwr_file_url,
    payment_id: null,
    registered_at: new Date().toISOString(),
  };
  registrations.set(full.id, full);
  return { data: full, error: null };
}
