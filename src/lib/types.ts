export type CampName = "AlgoCamp" | "DataCamp" | "RoboCamp" | "StartupCamp";

export type QuizAnswerMap = Record<string, string | string[] | undefined>;

export type Recommendation = {
  primaryCamp: CampName;
  secondaryCamps: CampName[];
  scores: Record<CampName, number>;
  percentages: Record<CampName, number>;
  summary: string;
  confidenceMessage: string;
  nextStep: string;
  copyText: string;
};

export type Registration = {
  id?: string;
  created_at?: string;
  full_name: string;
  phone: string;
  telegram?: string;
  age?: number;
  status: string;
  school_or_work?: string;
  location?: string;
  selected_camps: CampName[];
  primary_recommended_camp?: string;
  quiz_score?: unknown;
  quiz_summary?: string;
  user_pasted_ai_result?: string;
  motivation?: string;
  current_level?: string;
  has_laptop?: boolean;
  preferred_format?: string;
  preferred_time?: string;
  referral_name?: string;
  referral_phone?: string;
  referred_by?: string;
  discount_note?: string;
  consent: boolean;
  status_admin?: string;
  admin_note?: string;
};
