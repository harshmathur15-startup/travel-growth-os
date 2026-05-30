import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabase } from "@/lib/supabase-server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const FREE_AUDIT_LIMIT = 2;

type WebsiteSignals = {
  reachable: boolean;
  https: boolean;
  finalUrl: string;
  title: string;
  metaDescription: string;
  h1s: string[];
  h2s: string[];
  hasViewportMeta: boolean;
  hasSchemaMarkup: boolean;
  hasSitemap: boolean;
  hasWhatsApp: boolean;
  hasPhone: boolean;
  hasEmail: boolean;
  hasBookingCTA: boolean;
  hasPricing: boolean;
  hasTestimonials: boolean;
  hasGoogleReviews: boolean;
  hasFacebookPixel: boolean;
  hasGoogleAnalytics: boolean;
  socialLinksFound: string[];
  destinationMentions: string[];
  wordCount: number;
  pageTextExcerpt: string;
  subPagesChecked: string[];
};

type SocialSignals = {
  instagramReachable: boolean;
  instagramHasContent: boolean;
  googleBusinessReachable: boolean;
};

type PageSpeedMetrics = {
  score: number;
  lcp: number;
  cls: number;
  fcp: number;
};

type PageSpeedData = {
  mobile: PageSpeedMetrics | null;
  desktop: PageSpeedMetrics | null;
};

type CompetitorAnalysis = {
  url: string;
  reachable: boolean;
  https: boolean;
  hasWhatsApp: boolean;
  hasPhone: boolean;
  hasEmail: boolean;
  hasTestimonials: boolean;
  hasGoogleAnalytics: boolean;
  hasFacebookPixel: boolean;
  hasBookingCTA: boolean;
  hasPricing: boolean;
  socialLinksFound: string[];
  wordCount: number;
  estimatedScore: number;
  destinationMentions: string[];
};

const BOOKING_KEYWORDS =
  /book\s*now|enquire|enquiry|get\s*quote|request\s*quote|contact\s*us|call\s*us|whatsapp|book\s*tour|plan\s*trip|start\s*planning/i;
const PRICING_KEYWORDS =
  /₹|inr|price|pricing|package|cost|rate|starting\s*from|per\s*person/i;
const TESTIMONIAL_KEYWORDS =
  /testimonial|review|said|rated|stars|feedback|customer|client|traveller/i;
const GOOGLE_REVIEW_KEYWORDS =
  /google\s*review|google\s*rating|maps\.google|goo\.gl/i;
const DESTINATION_KEYWORDS =
  /goa|kerala|rajasthan|himachal|ladakh|kashmir|manali|shimla|jaipur|udaipur|andaman|lakshadweep|bali|thailand|dubai|europe|singapore|maldives|spiti|uttarakhand|sikkim|meghalaya/gi;

async function fetchHtml(
  url: string,
  timeoutMs = 10000,
): Promise<{ html: string; finalUrl: string; ok: boolean }> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; TravelGrowthOS-Audit/2.0; +https://travel-growth-os.vercel.app)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-IN,en;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
    });
    const html = await res.text();
    return { html, finalUrl: res.url, ok: res.ok };
  } catch {
    return { html: "", finalUrl: url, ok: false };
  }
}

function extractText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMeta(html: string, name: string): string {
  const m =
    html.match(
      new RegExp(
        `<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`,
        "i",
      ),
    ) ||
    html.match(
      new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`,
        "i",
      ),
    );
  return m?.[1]?.trim() ?? "";
}

function extractAll(html: string, pattern: RegExp): string[] {
  return [...html.matchAll(pattern)]
    .map((m) => m[1]?.trim())
    .filter(Boolean) as string[];
}

async function analyzeWebsite(rawUrl: string): Promise<WebsiteSignals> {
  const url = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
  const { html: homeHtml, finalUrl, ok } = await fetchHtml(url);

  if (!ok || !homeHtml) {
    return {
      reachable: false,
      https: url.startsWith("https"),
      finalUrl: url,
      title: "",
      metaDescription: "",
      h1s: [],
      h2s: [],
      hasViewportMeta: false,
      hasSchemaMarkup: false,
      hasSitemap: false,
      hasWhatsApp: false,
      hasPhone: false,
      hasEmail: false,
      hasBookingCTA: false,
      hasPricing: false,
      hasTestimonials: false,
      hasGoogleReviews: false,
      hasFacebookPixel: false,
      hasGoogleAnalytics: false,
      socialLinksFound: [],
      destinationMentions: [],
      wordCount: 0,
      pageTextExcerpt: "",
      subPagesChecked: [],
    };
  }

  const [contactResult, aboutResult, sitemapResult] = await Promise.all([
    fetchHtml(`${new URL(finalUrl).origin}/contact`, 5000),
    fetchHtml(`${new URL(finalUrl).origin}/about`, 5000),
    fetchHtml(`${new URL(finalUrl).origin}/sitemap.xml`, 5000),
  ]);

  const combinedHtml =
    homeHtml +
    (contactResult.ok ? contactResult.html : "") +
    (aboutResult.ok ? aboutResult.html : "");

  const pageText = extractText(combinedHtml);
  const words = pageText.split(/\s+/).filter(Boolean);

  const title =
    homeHtml.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? "";
  const metaDescription = extractMeta(homeHtml, "description");
  const h1s = extractAll(homeHtml, /<h1[^>]*>([^<]{3,100})<\/h1>/gi).slice(
    0,
    5,
  );
  const h2s = extractAll(homeHtml, /<h2[^>]*>([^<]{3,100})<\/h2>/gi).slice(
    0,
    8,
  );

  const socialLinksRaw = [
    ...combinedHtml.matchAll(
      /href=["'](https?:\/\/(?:www\.)?(instagram|facebook|youtube|twitter|linkedin)\.com[^"'\s]*)/gi,
    ),
  ].map((m) => m[1]);
  const socialLinksFound = [...new Set(socialLinksRaw)].slice(0, 6);

  const destinationMatches = pageText.match(DESTINATION_KEYWORDS) ?? [];
  const destinationMentions = [
    ...new Set(destinationMatches.map((d) => d.toLowerCase())),
  ].slice(0, 10);

  const subPagesChecked: string[] = [];
  if (contactResult.ok) subPagesChecked.push("/contact");
  if (aboutResult.ok) subPagesChecked.push("/about");

  return {
    reachable: true,
    https: finalUrl.startsWith("https"),
    finalUrl,
    title,
    metaDescription,
    h1s,
    h2s,
    hasViewportMeta: /name=["']viewport["']/i.test(homeHtml),
    hasSchemaMarkup:
      /application\/ld\+json/i.test(homeHtml) ||
      /itemtype=["']https?:\/\/schema\.org/i.test(homeHtml),
    hasSitemap: sitemapResult.ok && sitemapResult.html.includes("<url>"),
    hasWhatsApp:
      /wa\.me|whatsapp\.com|api\.whatsapp/i.test(combinedHtml) ||
      /whatsapp/i.test(pageText),
    hasPhone: /tel:|(?:\+91|0)[- ]?[6-9]\d{9}|[6-9]\d{9}/i.test(combinedHtml),
    hasEmail: /mailto:|[\w.-]+@[\w.-]+\.\w{2,}/i.test(combinedHtml),
    hasBookingCTA: BOOKING_KEYWORDS.test(pageText),
    hasPricing: PRICING_KEYWORDS.test(pageText),
    hasTestimonials: TESTIMONIAL_KEYWORDS.test(pageText),
    hasGoogleReviews: GOOGLE_REVIEW_KEYWORDS.test(combinedHtml),
    hasFacebookPixel: /fbq\(|facebook\.com\/tr/i.test(combinedHtml),
    hasGoogleAnalytics:
      /gtag\(|google-analytics|GA_MEASUREMENT_ID|googletagmanager/i.test(
        combinedHtml,
      ),
    socialLinksFound,
    destinationMentions,
    wordCount: words.length,
    pageTextExcerpt: words.slice(0, 600).join(" "),
    subPagesChecked,
  };
}

async function checkSocialMedia(
  instagram: string | null,
  googleBusiness: string | null,
): Promise<SocialSignals> {
  const results: SocialSignals = {
    instagramReachable: false,
    instagramHasContent: false,
    googleBusinessReachable: false,
  };

  const checks: Promise<void>[] = [];

  if (instagram) {
    const handle = instagram.replace(/^@/, "").trim();
    checks.push(
      fetchHtml(`https://www.instagram.com/${handle}/`, 6000).then(
        ({ ok, html }) => {
          results.instagramReachable = ok;
          results.instagramHasContent =
            ok && !html.includes("Sorry, this page isn't available");
        },
      ),
    );
  }

  if (googleBusiness) {
    checks.push(
      fetchHtml(googleBusiness, 6000).then(({ ok }) => {
        results.googleBusinessReachable = ok;
      }),
    );
  }

  await Promise.all(checks);
  return results;
}

async function fetchPageSpeed(url: string): Promise<PageSpeedData> {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  const base = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

  const run = async (
    strategy: "mobile" | "desktop",
  ): Promise<PageSpeedMetrics | null> => {
    try {
      const params = new URLSearchParams({
        url,
        strategy,
        category: "performance",
      });
      if (apiKey) params.set("key", apiKey);
      const res = await fetch(`${base}?${params}`, {
        signal: AbortSignal.timeout(28000),
      });
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
  };

  const [mobile, desktop] = await Promise.all([run("mobile"), run("desktop")]);
  return { mobile, desktop };
}

function calcEstimatedScore(ws: WebsiteSignals): number {
  let score = 0;
  if (ws.https) score += 10;
  if (ws.hasViewportMeta) score += 10;
  if (ws.metaDescription) score += 5;
  if (ws.hasPhone) score += 10;
  if (ws.hasEmail) score += 5;
  if (ws.hasWhatsApp) score += 15;
  if (ws.hasBookingCTA) score += 15;
  if (ws.hasTestimonials) score += 10;
  if (ws.hasGoogleAnalytics) score += 10;
  score += Math.min(ws.socialLinksFound.length * 3, 10);
  return Math.min(score, 100);
}

async function analyzeCompetitorBasic(
  rawUrl: string,
): Promise<CompetitorAnalysis> {
  const url = rawUrl.trim();
  const ws = await analyzeWebsite(url);
  return {
    url,
    reachable: ws.reachable,
    https: ws.https,
    hasWhatsApp: ws.hasWhatsApp,
    hasPhone: ws.hasPhone,
    hasEmail: ws.hasEmail,
    hasTestimonials: ws.hasTestimonials,
    hasGoogleAnalytics: ws.hasGoogleAnalytics,
    hasFacebookPixel: ws.hasFacebookPixel,
    hasBookingCTA: ws.hasBookingCTA,
    hasPricing: ws.hasPricing,
    socialLinksFound: ws.socialLinksFound,
    wordCount: ws.wordCount,
    estimatedScore: calcEstimatedScore(ws),
    destinationMentions: ws.destinationMentions,
  };
}

function buildPrompt(
  business: {
    name: string;
    website_url: string;
    category: string;
    city: string;
    instagram: string | null;
    google_business: string | null;
  },
  ws: WebsiteSignals,
  social: SocialSignals,
  pagespeed: PageSpeedData,
  competitors: CompetitorAnalysis[],
): string {
  const psSection = `
## Page Speed Performance (Google PageSpeed Insights — Real Measured Data)
Mobile score: ${pagespeed.mobile?.score ?? "Could not fetch"}/100
${pagespeed.mobile ? `  • LCP: ${pagespeed.mobile.lcp}s ${pagespeed.mobile.lcp <= 2.5 ? "(Good ✓)" : pagespeed.mobile.lcp <= 4 ? "(Needs Improvement ⚠)" : "(Poor ✗)"}` : ""}
${pagespeed.mobile ? `  • CLS: ${pagespeed.mobile.cls} ${pagespeed.mobile.cls <= 0.1 ? "(Good ✓)" : pagespeed.mobile.cls <= 0.25 ? "(Needs Improvement ⚠)" : "(Poor ✗)"}` : ""}
${pagespeed.mobile ? `  • FCP: ${pagespeed.mobile.fcp}s` : ""}
Desktop score: ${pagespeed.desktop?.score ?? "Could not fetch"}/100
${pagespeed.desktop ? `  • LCP: ${pagespeed.desktop.lcp}s` : ""}
${pagespeed.desktop ? `  • CLS: ${pagespeed.desktop.cls}` : ""}
(Benchmarks: LCP ≤2.5s = good, CLS ≤0.1 = good)`;

  const compSection =
    competitors.length === 0
      ? "\n## Competitor Benchmarks\nNo competitors configured. Skip comparative recommendations."
      : `\n## Competitor Benchmarks (same signal extraction applied to competitors)
${competitors
  .map(
    (c) => `
Competitor: ${c.url} — Estimated readiness score: ${c.estimatedScore}/100
  • Reachable: ${c.reachable ? "Yes" : "NO"}, HTTPS: ${c.https ? "Yes" : "No"}
  • WhatsApp: ${c.hasWhatsApp ? "Yes ✓" : "No ✗"} | Phone: ${c.hasPhone ? "Yes ✓" : "No ✗"} | Email: ${c.hasEmail ? "Yes ✓" : "No ✗"}
  • Booking CTA: ${c.hasBookingCTA ? "Yes ✓" : "No ✗"} | Pricing: ${c.hasPricing ? "Yes ✓" : "No ✗"} | Testimonials: ${c.hasTestimonials ? "Yes ✓" : "No ✗"}
  • Analytics: ${c.hasGoogleAnalytics ? "Yes ✓" : "No ✗"} | FB Pixel: ${c.hasFacebookPixel ? "Yes ✓" : "No ✗"}
  • Social links: ${c.socialLinksFound.length > 0 ? c.socialLinksFound.join(", ") : "None"}
  • Destinations: ${c.destinationMentions.length > 0 ? c.destinationMentions.join(", ") : "None detected"}
  • Word count: ${c.wordCount}`,
  )
  .join("\n")}

When competitors have a signal that the audited business lacks, name it explicitly in findings (e.g. "Competitors X and Y have WhatsApp buttons — you don't").`;

  return `You are a senior digital growth consultant specialising in Indian travel businesses. Your job is to score and give honest, specific feedback.

## Business Profile
- Name: ${business.name}
- Category: ${business.category}
- City: ${business.city}
- Website: ${business.website_url}
- Instagram handle: ${business.instagram || "Not provided"}
- Google Business URL: ${business.google_business || "Not provided"}

## Website Technical Signals (auto-detected)
- Reachable: ${ws.reachable ? "Yes" : "NO — site could not be fetched"}
- HTTPS/SSL: ${ws.https ? "Yes ✓" : "No ✗"}
- Page title: ${ws.title || "MISSING"}
- Meta description: ${ws.metaDescription || "MISSING"}
- H1 headings found: ${ws.h1s.length > 0 ? ws.h1s.join(" | ") : "NONE"}
- H2 headings: ${ws.h2s.length > 0 ? ws.h2s.slice(0, 5).join(" | ") : "NONE"}
- Mobile viewport meta: ${ws.hasViewportMeta ? "Present ✓" : "MISSING ✗"}
- Schema/structured data: ${ws.hasSchemaMarkup ? "Present ✓" : "Missing ✗"}
- XML Sitemap: ${ws.hasSitemap ? "Found ✓" : "Not found ✗"}
- Word count across pages: ${ws.wordCount} words
- Sub-pages crawled: ${ws.subPagesChecked.length > 0 ? ws.subPagesChecked.join(", ") : "none accessible"}

## Conversion & Contact Signals
- WhatsApp link/button: ${ws.hasWhatsApp ? "Present ✓" : "MISSING ✗"}
- Phone number: ${ws.hasPhone ? "Present ✓" : "MISSING ✗"}
- Email address: ${ws.hasEmail ? "Present ✓" : "MISSING ✗"}
- Booking/enquiry CTA: ${ws.hasBookingCTA ? "Present ✓" : "MISSING ✗"}
- Pricing/package info: ${ws.hasPricing ? "Present ✓" : "MISSING ✗"}

## Trust & Social Proof Signals
- Testimonials/reviews on site: ${ws.hasTestimonials ? "Present ✓" : "MISSING ✗"}
- Google Reviews widget/link: ${ws.hasGoogleReviews ? "Present ✓" : "Missing ✗"}
- Google Analytics: ${ws.hasGoogleAnalytics ? "Installed ✓" : "Not detected ✗"}
- Facebook Pixel: ${ws.hasFacebookPixel ? "Installed ✓" : "Not detected ✗"}

## Social Media Signals
- Social links on website: ${ws.socialLinksFound.length > 0 ? ws.socialLinksFound.join(", ") : "None found"}
- Instagram profile reachable: ${social.instagramReachable ? "Yes ✓" : business.instagram ? "Could not reach ✗" : "Not provided"}
- Instagram has content: ${social.instagramHasContent ? "Yes ✓" : business.instagram ? "Possibly private or empty ✗" : "N/A"}
- Google Business reachable: ${social.googleBusinessReachable ? "Yes ✓" : business.google_business ? "Could not reach ✗" : "Not provided"}

## Content Signals
- Destinations mentioned: ${ws.destinationMentions.length > 0 ? ws.destinationMentions.join(", ") : "None detected"}
- Page text excerpt:
"""
${ws.pageTextExcerpt || "No content could be extracted"}
"""
${psSection}
${compSection}

## Scoring Instructions
Score each dimension 0–100 based ONLY on the signals above. Do not be generous — score what the data shows:
- SEO: title/meta/h1 presence and quality, schema markup, sitemap, HTTPS, word count
- Conversion: WhatsApp, phone, email, booking CTA, pricing info, enquiry forms
- Trust & Reviews: testimonials on site, Google reviews link, analytics tracking, SSL
- Mobile & Speed: USE the Google PageSpeed mobile score as the primary input. If mobile PageSpeed score is available, weight it heavily (70%) alongside viewport meta and HTTPS signals (30%).
- Social Media: social links found, Instagram reachability/content, Google Business
- Content Quality: destinations covered, word count, headings structure, pricing/package detail

Return ONLY valid JSON, no markdown, no extra text:
{
  "overall_score": <weighted average — SEO 20%, Conversion 25%, Trust 15%, Mobile 15%, Social 10%, Content 15%>,
  "summary": "<2-3 sentences naming specific gaps — e.g. missing WhatsApp button, no meta description, Instagram not linked>",
  "dimensions": [
    { "name": "SEO", "score": <0-100>, "findings": ["<specific finding>", "<specific finding>", "<specific finding>"], "top_recommendation": "<single most impactful actionable fix>", "impact": "high" },
    { "name": "Conversion", "score": <0-100>, "findings": ["<specific finding>", "<specific finding>", "<specific finding>"], "top_recommendation": "<single most impactful fix>", "impact": "high" },
    { "name": "Trust & Reviews", "score": <0-100>, "findings": ["<specific finding>", "<specific finding>"], "top_recommendation": "<single most impactful fix>", "impact": "medium" },
    { "name": "Mobile & Speed", "score": <0-100>, "findings": ["<specific finding based on PageSpeed data>", "<specific finding>"], "top_recommendation": "<single most impactful fix>", "impact": "high" },
    { "name": "Social Media", "score": <0-100>, "findings": ["<specific finding>", "<specific finding>"], "top_recommendation": "<single most impactful fix>", "impact": "medium" },
    { "name": "Content Quality", "score": <0-100>, "findings": ["<specific finding>", "<specific finding>"], "top_recommendation": "<single most impactful fix>", "impact": "medium" }
  ]
}`;
}

export async function POST() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createServerSupabase();

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

  const competitorUrls: string[] = (
    (business.competitor_urls as string[] | null) ?? []
  )
    .filter((u: string) => u?.trim())
    .slice(0, 3);

  const [websiteSignals, socialSignals, pageSpeedData, competitorData] =
    await Promise.all([
      analyzeWebsite(business.website_url),
      checkSocialMedia(business.instagram, business.google_business),
      fetchPageSpeed(business.website_url),
      Promise.all(competitorUrls.map(analyzeCompetitorBasic)),
    ]);

  const prompt = buildPrompt(
    business,
    websiteSignals,
    socialSignals,
    pageSpeedData,
    competitorData,
  );

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
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const raw =
      message.content[0].type === "text" ? message.content[0].text : "";
    const text = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    auditResult = JSON.parse(text);
  } catch {
    await db.from("audits").update({ status: "failed" }).eq("id", audit.id);
    return NextResponse.json(
      { error: "AI analysis failed. Please try again." },
      { status: 500 },
    );
  }

  const dimensionRows = auditResult.dimensions.map((d) => ({
    audit_id: audit.id,
    name: d.name,
    score: d.score,
    findings: d.findings,
    top_recommendation: d.top_recommendation,
    impact: d.impact,
  }));

  await db.from("audit_dimensions").insert(dimensionRows);

  await db
    .from("audits")
    .update({
      status: "complete",
      overall_score: auditResult.overall_score,
      summary: auditResult.summary,
    })
    .eq("id", audit.id);

  await db
    .from("users")
    .update({
      audits_this_month: auditsUsed + 1,
      audit_reset_date: sameMonth ? user.audit_reset_date : today,
    })
    .eq("id", user.id);

  const myStats: CompetitorAnalysis = {
    url: business.website_url,
    reachable: websiteSignals.reachable,
    https: websiteSignals.https,
    hasWhatsApp: websiteSignals.hasWhatsApp,
    hasPhone: websiteSignals.hasPhone,
    hasEmail: websiteSignals.hasEmail,
    hasTestimonials: websiteSignals.hasTestimonials,
    hasGoogleAnalytics: websiteSignals.hasGoogleAnalytics,
    hasFacebookPixel: websiteSignals.hasFacebookPixel,
    hasBookingCTA: websiteSignals.hasBookingCTA,
    hasPricing: websiteSignals.hasPricing,
    socialLinksFound: websiteSignals.socialLinksFound,
    wordCount: websiteSignals.wordCount,
    estimatedScore: calcEstimatedScore(websiteSignals),
    destinationMentions: websiteSignals.destinationMentions,
  };

  return NextResponse.json({
    auditId: audit.id,
    overall_score: auditResult.overall_score,
    summary: auditResult.summary,
    dimensions: auditResult.dimensions,
    pagespeed: pageSpeedData,
    competitors: competitorData,
    myStats,
  });
}
