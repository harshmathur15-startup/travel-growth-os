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
    .select("id, email, name, plan, audits_this_month, audit_reset_date")
    .eq("clerk_user_id", userId)
    .single();

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { data: business } = await db
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const today = new Date().toISOString().slice(0, 7);
  const resetMonth = user.audit_reset_date
    ? new Date(user.audit_reset_date).toISOString().slice(0, 7)
    : today;
  const auditsUsed = today === resetMonth ? user.audits_this_month : 0;

  return NextResponse.json({
    user: {
      email: user.email,
      name: user.name,
      plan: user.plan,
      audits_used: auditsUsed,
      audit_limit: 10,
    },
    business,
  });
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, website_url, category, city, instagram, google_business } =
    body;

  if (!name || !website_url || !category || !city) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const db = createServerSupabase();

  const { data: user } = await db
    .from("users")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const competitorUrls: string[] = Array.isArray(body.competitor_urls)
    ? (body.competitor_urls as string[])
        .filter((u: string) => u?.trim())
        .slice(0, 3)
    : [];

  const { error } = await db
    .from("businesses")
    .update({
      name,
      website_url,
      category,
      city,
      instagram: instagram || null,
      google_business: google_business || null,
      competitor_urls: competitorUrls,
    })
    .eq("user_id", user.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
