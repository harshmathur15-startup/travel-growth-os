import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createServerSupabase();

  const { data: user } = await db
    .from("users")
    .select("id, plan, audits_this_month, audit_reset_date")
    .eq("clerk_user_id", userId)
    .single();

  if (!user) return NextResponse.json({ onboarding_required: true });

  const { data: business } = await db
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!business) return NextResponse.json({ onboarding_required: true });

  const { data: latestAudit } = await db
    .from("audits")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "complete")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  let dimensions = [];
  if (latestAudit) {
    const { data: dims } = await db
      .from("audit_dimensions")
      .select("*")
      .eq("audit_id", latestAudit.id);
    dimensions = dims ?? [];
  }

  const { data: auditHistory } = await db
    .from("audits")
    .select("id, overall_score, created_at, status")
    .eq("user_id", user.id)
    .eq("status", "complete")
    .order("created_at", { ascending: false })
    .limit(5);

  // Reset counter check
  const today = new Date().toISOString().slice(0, 7);
  const resetMonth = user.audit_reset_date
    ? new Date(user.audit_reset_date).toISOString().slice(0, 7)
    : today;
  const auditsUsed = today === resetMonth ? user.audits_this_month : 0;

  return NextResponse.json({
    user: { plan: user.plan, audits_used: auditsUsed, audit_limit: 2 },
    business,
    latest_audit: latestAudit ? { ...latestAudit, dimensions } : null,
    audit_history: auditHistory ?? [],
  });
}
