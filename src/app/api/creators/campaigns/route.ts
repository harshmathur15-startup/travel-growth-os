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
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { data: business } = await db
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!business)
    return NextResponse.json({ error: "No business found" }, { status: 404 });

  const { data: campaigns } = await db
    .from("campaigns")
    .select(
      `*, campaign_applications(id, status, tracking_slug, creator_profiles(name, instagram_handle, followers_count), creator_leads(id))`,
    )
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ campaigns: campaigns ?? [] });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    title,
    destination,
    description,
    price_per_person,
    departure_date,
    return_date,
    seats,
    niche,
  } = body;

  if (!title || !destination)
    return NextResponse.json(
      { error: "Title and destination are required" },
      { status: 400 },
    );

  const db = createServerSupabase();

  const { data: user } = await db
    .from("users")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { data: business } = await db
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!business)
    return NextResponse.json({ error: "No business found" }, { status: 404 });

  const { data: campaign, error } = await db
    .from("campaigns")
    .insert({
      business_id: business.id,
      title,
      destination,
      description: description || null,
      price_per_person: price_per_person || null,
      departure_date: departure_date || null,
      return_date: return_date || null,
      seats: seats || 10,
      niche: niche || "adventure",
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ campaign });
}
