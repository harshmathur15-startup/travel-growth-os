import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

// PATCH: agency approves or rejects an application
export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { application_id, status } = body;

  if (!application_id || !["approved", "rejected"].includes(status))
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });

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
    return NextResponse.json({ error: "No business" }, { status: 404 });

  // Verify the application belongs to this agency's campaign
  const { data: app } = await db
    .from("campaign_applications")
    .select("id, campaigns(business_id)")
    .eq("id", application_id)
    .single();

  const campaign = app?.campaigns as unknown as { business_id: string } | null;
  if (!app || campaign?.business_id !== business.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { error } = await db
    .from("campaign_applications")
    .update({ status })
    .eq("id", application_id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
