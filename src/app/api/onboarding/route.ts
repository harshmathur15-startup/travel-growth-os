import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clerkUser = await currentUser();
  const body = await req.json();
  const {
    businessName,
    websiteUrl,
    instagram,
    googleBusiness,
    city,
    category,
  } = body;

  if (!businessName || !websiteUrl || !category || !city) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const db = createServerSupabase();

  // Upsert user record
  const { data: user, error: userError } = await db
    .from("users")
    .upsert(
      {
        clerk_user_id: userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
        name: clerkUser?.fullName ?? businessName,
        plan: "free",
        audits_this_month: 0,
        audit_reset_date: new Date().toISOString().slice(0, 10),
      },
      { onConflict: "clerk_user_id" },
    )
    .select("id")
    .single();

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  // Create business profile
  const { error: bizError } = await db.from("businesses").upsert(
    {
      user_id: user.id,
      name: businessName,
      website_url: websiteUrl,
      instagram: instagram ?? "",
      google_business: googleBusiness ?? "",
      city,
      category,
    },
    { onConflict: "user_id" },
  );

  if (bizError) {
    return NextResponse.json({ error: bizError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
