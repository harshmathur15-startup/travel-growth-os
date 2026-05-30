import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET() {
  const checks: Record<string, string> = {};

  try {
    const { userId } = await auth();
    checks.clerk = userId
      ? `ok (userId: ${userId.slice(0, 8)}…)`
      : "no session";

    if (userId) {
      const db = createServerSupabase();

      const { data: user, error: userErr } = await db
        .from("users")
        .select("id, plan")
        .eq("clerk_user_id", userId)
        .single();

      checks.supabase_user = userErr
        ? `error: ${userErr.message}`
        : user
          ? `ok (plan: ${user.plan})`
          : "not found";

      if (user) {
        const { data: business, error: bizErr } = await db
          .from("businesses")
          .select("id, name, website_url")
          .eq("user_id", user.id)
          .single();

        checks.supabase_business = bizErr
          ? `error: ${bizErr.message}`
          : business
            ? `ok (${business.name} — ${business.website_url})`
            : "not found";
      }
    }

    checks.anthropic_key = process.env.ANTHROPIC_API_KEY
      ? `set (${process.env.ANTHROPIC_API_KEY.slice(0, 12)}…)`
      : "MISSING";

    checks.supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? `set (${process.env.NEXT_PUBLIC_SUPABASE_URL})`
      : "MISSING";

    checks.supabase_service_key = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? `set (${process.env.SUPABASE_SERVICE_ROLE_KEY.slice(0, 12)}…)`
      : "MISSING";
  } catch (e) {
    checks.exception = String(e);
  }

  return NextResponse.json(checks);
}
