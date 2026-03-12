export type AccountType = "independent" | "label";

export type TrackStatus = "analyzing" | "questionnaire" | "scored" | "registered";

export type Eligibility = "full" | "hybrid" | "ineligible";

export interface Profile {
  id: string;
  account_type: AccountType;
  artist_name: string;
  pro_affiliation: string;
  ipi_number: string | null;
  country: string;
  stripe_customer_id: string | null;
  created_at: string;
}

export interface TrackAnalysis {
  id: string;
  user_id: string;
  track_title: string;
  artist_name: string;
  file_url: string;
  forensic_score: number;
  forensic_flags: string[];
  status: TrackStatus;
  created_at: string;
}

export interface QuestionnaireResponse {
  id: string;
  track_id: string;
  responses: Record<string, unknown>;
  attestation_name: string | null;
  attested_at: string | null;
  created_at: string;
}

export interface HumanScore {
  id: string;
  track_id: string;
  overall_score: number;
  breakdown: {
    lyrics: number;
    melody: number;
    vocals: number;
    production: number;
    arrangement: number;
  };
  eligibility: Eligibility;
  flags: string[];
  recommendation: string;
  created_at: string;
}

export interface Registration {
  id: string;
  track_id: string;
  cwr_file_url: string;
  payment_id: string | null;
  registered_at: string;
}

export interface ForensicResult {
  ai_probability: number;
  flags: string[];
  confidence: "low" | "medium" | "high";
  model_version: string;
}
