import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

type Integration = {
  name: string;
  icon: string;
  desc: string;
  category: string;
  status: "connected" | "disconnected" | "coming_soon";
};

const categoryColors: Record<string, string> = {
  SEO: "bg-indigo-500/10 text-indigo-400",
  Analytics: "bg-blue-500/10 text-blue-400",
  Social: "bg-pink-500/10 text-pink-400",
  Conversion: "bg-emerald-500/10 text-emerald-400",
  Trust: "bg-yellow-500/10 text-yellow-400",
  Marketplace: "bg-orange-500/10 text-orange-400",
  CRM: "bg-purple-500/10 text-purple-400",
  Email: "bg-cyan-500/10 text-cyan-400",
  Automation: "bg-amber-500/10 text-amber-400",
};

export default async function IntegrationsPage() {
  const { userId } = await auth();

  let business: {
    instagram: string | null;
    google_business: string | null;
  } | null = null;

  if (userId) {
    const db = createServerSupabase();
    const { data: user } = await db
      .from("users")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (user) {
      const { data } = await db
        .from("businesses")
        .select("instagram, google_business")
        .eq("user_id", user.id)
        .single();
      business = data ?? null;
    }
  }

  const hasInstagram = !!business?.instagram?.trim();
  const hasGoogleBusiness = !!business?.google_business?.trim();

  const integrations: Integration[] = [
    {
      name: "Google Business Profile",
      icon: "🔍",
      desc: "Sync reviews, posts, and local ranking data",
      status: hasGoogleBusiness ? "connected" : "disconnected",
      category: "SEO",
    },
    {
      name: "Instagram Business",
      icon: "📸",
      desc: "Analyse posts, Reels, engagement, and follower growth",
      status: hasInstagram ? "connected" : "disconnected",
      category: "Social",
    },
    {
      name: "Google Analytics 4",
      icon: "📊",
      desc: "Import traffic data, goals, and conversion events",
      status: "coming_soon",
      category: "Analytics",
    },
    {
      name: "Google Search Console",
      icon: "🔎",
      desc: "Pull keyword rankings and click-through rates",
      status: "coming_soon",
      category: "SEO",
    },
    {
      name: "WhatsApp Business API",
      icon: "💬",
      desc: "Track inquiry volume, response rates, and conversions",
      status: "coming_soon",
      category: "Conversion",
    },
    {
      name: "Facebook Page",
      icon: "👥",
      desc: "Monitor reach, engagement, and ad performance",
      status: "coming_soon",
      category: "Social",
    },
    {
      name: "TripAdvisor",
      icon: "✈️",
      desc: "Import review scores and listing performance",
      status: "coming_soon",
      category: "Trust",
    },
    {
      name: "MakeMyTrip Partner",
      icon: "🏨",
      desc: "Sync listing data and booking conversion rates",
      status: "coming_soon",
      category: "Marketplace",
    },
    {
      name: "Zoho CRM",
      icon: "📋",
      desc: "Push qualified leads directly to your CRM pipeline",
      status: "coming_soon",
      category: "CRM",
    },
    {
      name: "HubSpot",
      icon: "🧲",
      desc: "Sync contacts, deals, and automated follow-up sequences",
      status: "coming_soon",
      category: "CRM",
    },
    {
      name: "Mailchimp",
      icon: "📧",
      desc: "Trigger email sequences based on audit insights",
      status: "coming_soon",
      category: "Email",
    },
    {
      name: "Zapier",
      icon: "⚡",
      desc: "Connect 5,000+ apps with no-code automation",
      status: "coming_soon",
      category: "Automation",
    },
  ];

  const connected = integrations.filter((i) => i.status === "connected").length;
  const disconnected = integrations.filter(
    (i) => i.status === "disconnected",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {connected} of {integrations.length} connected · Connect your tools
            for richer insights
          </p>
        </div>
      </div>

      {disconnected > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-300">
            {!hasGoogleBusiness && !hasInstagram
              ? "Add your Google Business URL and Instagram handle in Settings to connect them."
              : !hasGoogleBusiness
                ? "Add your Google Business URL in Settings to connect Google Business Profile."
                : "Add your Instagram handle in Settings to connect Instagram Business."}
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((intg) => (
          <div
            key={intg.name}
            className={`rounded-2xl border bg-card p-4 transition-colors ${
              intg.status === "connected"
                ? "border-emerald-500/20 hover:border-emerald-500/40"
                : intg.status === "coming_soon"
                  ? "border-border opacity-60"
                  : "border-border hover:border-indigo-500/30"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-xl">
                  {intg.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {intg.name}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryColors[intg.category]}`}
                  >
                    {intg.category}
                  </span>
                </div>
              </div>
              {intg.status === "connected" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : intg.status === "coming_soon" ? (
                <Clock className="h-4 w-4 text-muted-foreground/50 shrink-0" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-muted mt-1 shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              {intg.desc}
            </p>
            {intg.status === "connected" ? (
              <div className="w-full rounded-xl py-2 text-xs font-semibold text-center border border-emerald-500/30 text-emerald-400">
                Connected ✓
              </div>
            ) : intg.status === "coming_soon" ? (
              <div className="w-full rounded-xl py-2 text-xs font-semibold text-center border border-border text-muted-foreground/50">
                Coming Soon
              </div>
            ) : (
              <a
                href="/settings"
                className="block w-full rounded-xl py-2 text-xs font-semibold text-center bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:opacity-90 transition-opacity"
              >
                Connect via Settings
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
