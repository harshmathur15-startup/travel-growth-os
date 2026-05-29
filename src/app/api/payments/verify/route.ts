import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    await req.json();

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { error: "Missing payment fields" },
      { status: 400 },
    );
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret)
    return NextResponse.json(
      { error: "Payments not configured" },
      { status: 500 },
    );

  // Verify HMAC signature
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return NextResponse.json(
      { error: "Invalid payment signature" },
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

  await db.from("users").update({ plan: "pro" }).eq("id", user.id);

  return NextResponse.json({ ok: true });
}
