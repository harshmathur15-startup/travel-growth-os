import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

type PageSpeedMetrics = {
  score: number;
  lcp: number;
  cls: number;
  fcp: number;
};

async function runPageSpeed(
  url: string,
  strategy: "mobile" | "desktop",
): Promise<PageSpeedMetrics | null> {
  try {
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    const params = new URLSearchParams({
      url,
      strategy,
      category: "performance",
    });
    if (apiKey) params.set("key", apiKey);
    const res = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`,
      { signal: AbortSignal.timeout(25000) },
    );
    if (!res.ok) return null;
    const j = await res.json();
    const cats = j.lighthouseResult?.categories;
    const audits = j.lighthouseResult?.audits;
    if (!cats?.performance) return null;
    return {
      score: Math.round((cats.performance.score ?? 0) * 100),
      lcp: parseFloat(
        (
          (audits?.["largest-contentful-paint"]?.numericValue ?? 0) / 1000
        ).toFixed(1),
      ),
      cls: parseFloat(
        (audits?.["cumulative-layout-shift"]?.numericValue ?? 0).toFixed(3),
      ),
      fcp: parseFloat(
        (
          (audits?.["first-contentful-paint"]?.numericValue ?? 0) / 1000
        ).toFixed(1),
      ),
    };
  } catch {
    return null;
  }
}

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
    .select("website_url")
    .eq("user_id", user.id)
    .single();

  if (!business?.website_url)
    return NextResponse.json({ error: "No website URL" }, { status: 400 });

  const [mobile, desktop] = await Promise.all([
    runPageSpeed(business.website_url, "mobile"),
    runPageSpeed(business.website_url, "desktop"),
  ]);

  return NextResponse.json({ mobile, desktop });
}
