import { mockRecommendations } from "@/lib/mock-data";
import { Lightbulb, Filter, TrendingUp } from "lucide-react";

const priorityConfig = {
  critical: {
    label: "Critical",
    cls: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  high: {
    label: "High",
    cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  medium: {
    label: "Medium",
    cls: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  low: {
    label: "Low",
    cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
};

const effortConfig = {
  easy: "bg-emerald-500/10 text-emerald-400",
  medium: "bg-amber-500/10 text-amber-400",
  hard: "bg-red-500/10 text-red-400",
};

const categoryColors: Record<string, string> = {
  SEO: "bg-indigo-500/10 text-indigo-400",
  Conversion: "bg-cyan-500/10 text-cyan-400",
  Trust: "bg-yellow-500/10 text-yellow-400",
  Social: "bg-pink-500/10 text-pink-400",
  Mobile: "bg-purple-500/10 text-purple-400",
};

export default function RecommendationsPage() {
  const critical = mockRecommendations.filter((r) => r.priority === "critical");
  const high = mockRecommendations.filter((r) => r.priority === "high");
  const medium = mockRecommendations.filter((r) => r.priority === "medium");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            AI Recommendations
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {mockRecommendations.length} actionable insights · Sorted by impact
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        {[
          {
            label: `${critical.length} Critical`,
            cls: "bg-red-500/10 text-red-400 border-red-500/20",
          },
          {
            label: `${high.length} High Priority`,
            cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          },
          {
            label: `${medium.length} Medium`,
            cls: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          },
          {
            label: "Est. +180% leads if all fixed",
            cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          },
        ].map(({ label, cls }) => (
          <span
            key={label}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Recommendation cards */}
      <div className="space-y-3">
        {mockRecommendations.map((rec, i) => {
          const p = priorityConfig[rec.priority];
          return (
            <div
              key={rec.id}
              className="rounded-2xl border border-border bg-card p-5 hover:border-indigo-500/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-sm font-bold text-indigo-400">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {rec.title}
                    </h3>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${p.cls}`}
                    >
                      {p.label}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryColors[rec.category] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {rec.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {rec.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                      <span className="font-semibold text-emerald-400">
                        {rec.leadImprovement}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      Impact:{" "}
                      <span className="font-medium text-foreground">
                        {rec.impact}
                      </span>
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 capitalize font-medium ${effortConfig[rec.effort]}`}
                    >
                      {rec.effort} to fix
                    </span>
                    <span className="text-muted-foreground ml-auto text-[10px]">
                      by {rec.agent}
                    </span>
                  </div>
                </div>
                <button className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity">
                  Fix This
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI brief */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-foreground">
            AI Growth Consultant Summary
          </h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Based on your audit, your biggest opportunity is{" "}
          <strong className="text-foreground">
            lead capture and trust signals
          </strong>
          . You have decent social presence but virtually no conversion
          infrastructure — no WhatsApp button, no reviews widget, and no
          destination landing pages. Fix the critical items first (estimated 3–4
          hours of work) and you could see 60–80% more inquiries within 2 weeks.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {[
            { label: "Week 1 focus", value: "WhatsApp + Meta tags" },
            { label: "Week 2 focus", value: "Reviews + Google Business" },
            { label: "Month 2 focus", value: "Landing pages + SEO" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-border/50 bg-card/50 p-3"
            >
              <p className="text-[10px] text-muted-foreground">{label}</p>
              <p className="text-xs font-medium text-foreground mt-0.5">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
