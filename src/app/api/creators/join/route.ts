import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug)
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const db = createServerSupabase();

  const { data: app } = await db
    .from("campaign_applications")
    .select(
      `id, status, creator_profiles(name), campaigns(title, destination, description, price_per_person, departure_date, return_date, seats, niche, businesses(name))`,
    )
    .eq("tracking_slug", slug)
    .single();

  if (!app)
    return NextResponse.json({ error: "Invalid link" }, { status: 404 });

  if (app.status !== "approved")
    return NextResponse.json({ error: "Link not active" }, { status: 403 });

  type CampaignRow = {
    title: string;
    destination: string;
    description: string | null;
    price_per_person: number | null;
    departure_date: string | null;
    return_date: string | null;
    seats: number;
    niche: string;
    businesses: { name: string } | null;
  };

  const campaign = app.campaigns as unknown as CampaignRow | null;
  const creator = app.creator_profiles as unknown as { name: string } | null;

  return NextResponse.json({
    title: campaign?.title ?? "",
    destination: campaign?.destination ?? "",
    description: campaign?.description ?? null,
    price_per_person: campaign?.price_per_person ?? null,
    departure_date: campaign?.departure_date ?? null,
    return_date: campaign?.return_date ?? null,
    seats: campaign?.seats ?? 10,
    niche: campaign?.niche ?? "adventure",
    creator_name: creator?.name ?? "Creator",
    agency_name: campaign?.businesses?.name ?? "Travel Agency",
  });
}
