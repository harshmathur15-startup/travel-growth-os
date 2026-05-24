import { Plug, CheckCircle2, AlertCircle } from "lucide-react";

const integrations = [
  {
    name: "Google Business Profile",
    icon: "🔍",
    desc: "Sync reviews, posts, and local ranking data",
    status: "connected",
    category: "SEO",
  },
  {
    name: "Google Analytics 4",
    icon: "📊",
    desc: "Import traffic data, goals, and conversion events",
    status: "disconnected",
    category: "Analytics",
  },
  {
    name: "Google Search Console",
    icon: "🔎",
    desc: "Pull keyword rankings and click-through rates",
    status: "disconnected",
    category: "SEO",
  },
  {
    name: "Instagram Business",
    icon: "📸",
    desc: "Analyse posts, Reels, engagement, and follower growth",
    status: "connected",
    category: "Social",
  },
  {
    name: "WhatsApp Business API",
    icon: "💬",
    desc: "Track inquiry volume, response rates, and conversions",
    status: "disconnected",
    category: "Conversion",
  },
  {
    name: "Facebook Page",
    icon: "👥",
    desc: "Monitor reach, engagement, and ad performance",
    status: "disconnected",
    category: "Social",
  },
  {
    name: "TripAdvisor",
    icon: "✈️",
    desc: "Import review scores and listing performance",
    status: "disconnected",
    category: "Trust",
  },
  {
    name: "MakeMyTrip Partner",
    icon: "🏨",
    desc: "Sync listing data and booking conversion rates",
    status: "disconnected",
    category: "Marketplace",
  },
  {
    name: "Zoho CRM",
    icon: "📋",
    desc: "Push qualified leads directly to your CRM pipeline",
    status: "disconnected",
    category: "CRM",
  },
  {
    name: "HubSpot",
    icon: "🧲",
    desc: "Sync contacts, deals, and automated follow-up sequences",
    status: "disconnected",
    category: "CRM",
  },
  {
    name: "Mailchimp",
    icon: "📧",
    desc: "Trigger email sequences based on audit insights",
    status: "disconnected",
    category: "Email",
  },
  {
    name: "Zapier",
    icon: "⚡",
    desc: "Connect 5,000+ apps with no-code automation",
    status: "disconnected",
    category: "Automation",
  },
];

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

export default function IntegrationsPage() {
  const connected = integrations.filter((i) => i.status === "connected").length;

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

      {/* Connected banner */}
      {connected < integrations.length && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-300">
            Connect Google Analytics and Search Console to unlock keyword
            tracking and traffic intelligence.
          </p>
        </div>
      )}

      {/* Integration grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((intg) => (
          <div
            key={intg.name}
            className={`rounded-2xl border bg-card p-4 hover:border-indigo-500/30 transition-colors ${intg.status === "connected" ? "border-emerald-500/20" : "border-border"}`}
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
              ) : (
                <div className="h-2 w-2 rounded-full bg-muted mt-1 shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              {intg.desc}
            </p>
            <button
              className={`w-full rounded-xl py-2 text-xs font-semibold transition-all ${
                intg.status === "connected"
                  ? "border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  : "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:opacity-90"
              }`}
            >
              {intg.status === "connected" ? "Connected ✓" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
