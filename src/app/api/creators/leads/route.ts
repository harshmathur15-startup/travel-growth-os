import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

// POST: traveler submits inquiry via creator's unique link
export async function POST(req: Request) {
  const body = await req.json();
  const { tracking_slug, name, phone, travel_month, budget, adults } = body;

  if (!tracking_slug || !name || !phone)
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );

  const db = createServerSupabase();

  const { data: application } = await db
    .from("campaign_applications")
    .select("id, status")
    .eq("tracking_slug", tracking_slug)
    .single();

  if (!application)
    return NextResponse.json({ error: "Invalid link" }, { status: 404 });

  if (application.status !== "approved")
    return NextResponse.json(
      { error: "Campaign link not active" },
      { status: 403 },
    );

  const { error } = await db.from("creator_leads").insert({
    application_id: application.id,
    name,
    phone,
    travel_month: travel_month || null,
    budget: budget || null,
    adults: adults || 2,
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
