import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createServerSupabase } from "@/lib/supabase-server";

const PRO_PRICE_PAISE = 99900; // ₹999/month

export async function POST() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Payments not configured" },
      { status: 500 },
    );
  }

  const db = createServerSupabase();
  const { data: user } = await db
    .from("users")
    .select("id, plan")
    .eq("clerk_user_id", userId)
    .single();

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.plan === "pro")
    return NextResponse.json({ error: "Already on Pro plan" }, { status: 400 });

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const order = await razorpay.orders.create({
    amount: PRO_PRICE_PAISE,
    currency: "INR",
    receipt: `upgrade_${user.id}_${Date.now()}`,
    notes: { user_id: user.id, clerk_user_id: userId },
  });

  return NextResponse.json({
    order_id: order.id,
    amount: PRO_PRICE_PAISE,
    currency: "INR",
    key_id: process.env.RAZORPAY_KEY_ID,
  });
}
