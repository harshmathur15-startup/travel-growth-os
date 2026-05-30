import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabase } from "@/lib/supabase-server";

export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function fetchUrl(url: string, timeoutMs = 10000) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 TravelGrowthOS-Diagnose/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
    });
    const text = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      length: text.length,
      finalUrl: res.url,
    };
  } catch (e) {
    return { ok: false, status: 0, length: 0, finalUrl: url, error: String(e) };
  }
}

export async function GET() {
  const checks: Record<string, unknown> = {};
  const timings: Record<string, number> = {};

  const t = (label: string, start: number) => {
    timings[label] = Math.round(Date.now() - start);
  };

  // 1. Auth
  let t0 = Date.now();
  try {
    const { userId } = await auth();
    checks.auth = userId ? `ok (${userId.slice(0, 8)}…)` : "no session";
    t("auth", t0);
  } catch (e) {
    checks.auth = `error: ${String(e)}`;
    t("auth", t0);
  }

  // 2. Supabase — user + business
  t0 = Date.now();
  let businessUrl = "";
  let instagram: string | null = null;
  try {
    const { userId } = await auth();
    if (userId) {
      const db = createServerSupabase();
      const { data: user, error: ue } = await db
        .from("users")
        .select("id, plan")
        .eq("clerk_user_id", userId)
        .single();
      checks.supabase_user = ue
        ? `error: ${ue.message}`
        : user
          ? `ok (plan: ${user.plan})`
          : "not found";

      if (user) {
        const { data: biz, error: be } = await db
          .from("businesses")
          .select("id, name, website_url, instagram")
          .eq("user_id", user.id)
          .single();
        checks.supabase_business = be
          ? `error: ${be.message}`
          : biz
            ? `ok (${biz.name})`
            : "not found";
        businessUrl = biz?.website_url ?? "";
        instagram = biz?.instagram ?? null;
      }
    }
    t("supabase", t0);
  } catch (e) {
    checks.supabase = `error: ${String(e)}`;
    t("supabase", t0);
  }

  // 3. Website fetch
  if (businessUrl) {
    t0 = Date.now();
    const result = await fetchUrl(businessUrl, 10000);
    checks.website_fetch = result.ok
      ? `ok — ${result.length} bytes, final: ${result.finalUrl}`
      : `failed — status ${result.status}${"error" in result ? ` (${result.error})` : ""}`;
    t("website_fetch", t0);
  } else {
    checks.website_fetch = "skipped — no business URL";
  }

  // 4. PageSpeed (mobile only for speed)
  if (businessUrl) {
    t0 = Date.now();
    try {
      const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
      const params = new URLSearchParams({
        url: businessUrl,
        strategy: "mobile",
        category: "performance",
      });
      if (apiKey) params.set("key", apiKey);
      const res = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`,
        {
          signal: AbortSignal.timeout(20000),
        },
      );
      if (res.ok) {
        const j = await res.json();
        const score = j.lighthouseResult?.categories?.performance?.score;
        checks.pagespeed =
          score != null
            ? `ok — mobile score: ${Math.round(score * 100)}`
            : "ok but no score in response";
      } else {
        const errText = await res.text();
        checks.pagespeed = `failed — HTTP ${res.status}: ${errText.slice(0, 200)}`;
      }
    } catch (e) {
      checks.pagespeed = `error: ${String(e)}`;
    }
    t("pagespeed", t0);
  } else {
    checks.pagespeed = "skipped — no business URL";
  }

  // 5. Claude ping (minimal)
  t0 = Date.now();
  try {
    const msg = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 10,
      messages: [{ role: "user", content: "Reply with the number 1" }],
    });
    checks.claude =
      msg.content[0].type === "text"
        ? `ok — replied: "${msg.content[0].text}"`
        : "ok";
  } catch (e) {
    checks.claude = `error: ${String(e)}`;
  }
  t("claude", t0);

  // 6. Instagram check
  if (instagram) {
    t0 = Date.now();
    const handle = instagram.replace(/^@/, "").trim();
    const r = await fetchUrl(`https://www.instagram.com/${handle}/`, 8000);
    checks.instagram = r.ok
      ? `reachable (${r.length} bytes)`
      : `failed — ${r.status}`;
    t("instagram", t0);
  }

  return NextResponse.json({ checks, timings_ms: timings });
}
