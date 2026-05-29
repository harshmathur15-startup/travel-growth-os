import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabase } from "@/lib/supabase-server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const FREE_AUDIT_LIMIT = 2;

async function fetchWebsiteContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "GrowthOS-Audit-Bot/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    const html = await res.text();
    // Strip tags, collapse whitespace, limit to 4000 chars
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 4000);
    return text;
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createServerSupabase();

  // Get user + business
  const { data: user } = await db
    .from("users")
    .select("id, plan, audits_this_month, audit_reset_date")
    .eq("clerk_user_id", userId)
    .single();

  if (!user)
    return NextResponse.json(
      { error: "Complete onboarding first" },
      { status: 400 },
    );

  // Reset monthly counter if needed
  const today = new Date().toISOString().slice(0, 10);
  const resetDate = user.audit_reset_date ?? today;
  const sameMonth =
    today.slice(0, 7) === new Date(resetDate).toISOString().slice(0, 7);
  const auditsUsed = sameMonth ? user.audits_this_month : 0;

  if (user.plan === "free" && auditsUsed >= FREE_AUDIT_LIMIT) {
    return NextResponse.json(
      {
        error: "limit_reached",
        message: `Free plan allows ${FREE_AUDIT_LIMIT} audits/month. Upgrade to Pro for unlimited audits.`,
      },
      { status: 403 },
    );
  }

  const { data: business } = await db
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!business)
    return NextResponse.json(
      { error: "No business profile found" },
      { status: 400 },
    );

  // Create a pending audit record
  const { data: audit, error: auditErr } = await db
    .from("audits")
    .insert({
      business_id: business.id,
      user_id: user.id,
      status: "pending",
      overall_score: 0,
      summary: "",
    })
    .select("id")
    .single();

  if (auditErr)
    return NextResponse.json({ error: auditErr.message }, { status: 500 });

  // Fetch website content
  const websiteContent = await fetchWebsiteContent(business.website_url);

  // Build Claude prompt
  const prompt = `You are a senior digital marketing consultant specialising in Indian travel businesses.

Analyse the following travel agency and return a structured JSON audit.

Business details:
- Name: ${business.name}
- Website: ${business.website_url}
- Category: ${business.category}
- City: ${business.city}
- Instagram: ${business.instagram || "Not provided"}
- Google Business: ${business.google_business || "Not provided"}

Website content (scraped):
"""
${websiteContent || "Could not fetch website content — base your analysis on the URL and business details provided."}
"""

Return ONLY valid JSON, no extra text, in this exact format:
{
  "overall_score": <number 0-100>,
  "summary": "<2-3 sentence plain-English summary of the biggest opportunities>",
  "dimensions": [
    {
      "name": "SEO",
      "score": <0-100>,
      "findings": ["<finding 1>", "<finding 2>", "<finding 3>"],
      "top_recommendation": "<single most impactful fix>",
      "impact": "high"
    },
    {
      "name": "Conversion",
      "score": <0-100>,
      "findings": ["<finding 1>", "<finding 2>", "<finding 3>"],
      "top_recommendation": "<single most impactful fix>",
      "impact": "high"
    },
    {
      "name": "Trust & Reviews",
      "score": <0-100>,
      "findings": ["<finding 1>", "<finding 2>"],
      "top_recommendation": "<single most impactful fix>",
      "impact": "medium"
    },
    {
      "name": "Mobile & Speed",
      "score": <0-100>,
      "findings": ["<finding 1>", "<finding 2>"],
      "top_recommendation": "<single most impactful fix>",
      "impact": "high"
    },
    {
      "name": "Social Media",
      "score": <0-100>,
      "findings": ["<finding 1>", "<finding 2>"],
      "top_recommendation": "<single most impactful fix>",
      "impact": "medium"
    },
    {
      "name": "Content Quality",
      "score": <0-100>,
      "findings": ["<finding 1>", "<finding 2>"],
      "top_recommendation": "<single most impactful fix>",
      "impact": "medium"
    }
  ]
}

Scoring guide: 80-100 = excellent, 60-79 = needs work, 0-59 = critical issues. Be specific and actionable. Focus on what will generate more bookings and leads for an Indian travel business.`;

  let auditResult: {
    overall_score: number;
    summary: string;
    dimensions: Array<{
      name: string;
      score: number;
      findings: string[];
      top_recommendation: string;
      impact: string;
    }>;
  };

  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    auditResult = JSON.parse(text);
  } catch (err) {
    // Mark audit as failed
    await db.from("audits").update({ status: "failed" }).eq("id", audit.id);
    return NextResponse.json(
      { error: "AI analysis failed. Please try again." },
      { status: 500 },
    );
  }

  // Save dimensions
  const dimensionRows = auditResult.dimensions.map((d) => ({
    audit_id: audit.id,
    name: d.name,
    score: d.score,
    findings: d.findings,
    top_recommendation: d.top_recommendation,
    impact: d.impact,
  }));

  await db.from("audit_dimensions").insert(dimensionRows);

  // Update audit as complete
  await db
    .from("audits")
    .update({
      status: "complete",
      overall_score: auditResult.overall_score,
      summary: auditResult.summary,
    })
    .eq("id", audit.id);

  // Increment monthly counter
  await db
    .from("users")
    .update({
      audits_this_month: auditsUsed + 1,
      audit_reset_date: sameMonth ? user.audit_reset_date : today,
    })
    .eq("id", user.id);

  return NextResponse.json({
    auditId: audit.id,
    overall_score: auditResult.overall_score,
    summary: auditResult.summary,
    dimensions: auditResult.dimensions,
  });
}
