import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

// GET: list open campaigns for creators to browse
export async function GET() {
  const db = createServerSupabase();

  const { data: campaigns } = await db
    .from("campaigns")
    .select(`*, businesses(name, city)`)
    .eq("status", "open")
    .order("created_at", { ascending: false });

  return NextResponse.json({ campaigns: campaigns ?? [] });
}

// POST: creator applies to a campaign
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    campaign_id,
    message,
    name,
    instagram_handle,
    youtube_handle,
    followers_count,
    niche,
    bio,
  } = body;

  if (!campaign_id)
    return NextResponse.json(
      { error: "campaign_id is required" },
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

  // Upsert creator profile
  const { data: profile, error: profileError } = await db
    .from("creator_profiles")
    .upsert(
      {
        user_id: user.id,
        name: name || "Creator",
        instagram_handle: instagram_handle || null,
        youtube_handle: youtube_handle || null,
        followers_count: followers_count || 0,
        niche: Array.isArray(niche) ? niche : [],
        bio: bio || null,
      },
      { onConflict: "user_id" },
    )
    .select()
    .single();

  if (profileError)
    return NextResponse.json({ error: profileError.message }, { status: 500 });

  const { data: application, error } = await db
    .from("campaign_applications")
    .insert({
      campaign_id,
      creator_id: profile.id,
      message: message || null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505")
      return NextResponse.json(
        { error: "Already applied to this campaign" },
        { status: 409 },
      );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ application });
}
