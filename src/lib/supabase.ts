import { createClient } from "@supabase/supabase-js";

// Client-side Supabase (uses anon key — safe to expose)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export type AuditDimension = {
  name: string;
  score: number;
  findings: string[];
  top_recommendation: string;
  impact: "high" | "medium" | "low";
};

export type Audit = {
  id: string;
  business_id: string;
  user_id: string;
  overall_score: number;
  status: "pending" | "complete" | "failed";
  summary: string;
  created_at: string;
  audit_dimensions?: AuditDimension[];
};

export type Business = {
  id: string;
  user_id: string;
  name: string;
  website_url: string;
  instagram: string;
  google_business: string;
  city: string;
  category: string;
  created_at: string;
};

export type UserProfile = {
  id: string;
  clerk_user_id: string;
  email: string;
  name: string;
  plan: "free" | "pro";
  audits_this_month: number;
  audit_reset_date: string;
  created_at: string;
};
