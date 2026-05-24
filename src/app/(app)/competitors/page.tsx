"use client";

import { mockCompetitors, mockKeywords } from "@/lib/mock-data";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ExternalLink,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function scoreColor(s: number) {
  if (s >= 80) return "#10b981";
  if (s >= 60) return "#f59e0b";
  return "#ef4444";
}

export default function CompetitorsPage() {
  const you = mockCompetitors.find((c) => c.name === "Your Business")!;
  const others = mockCompetitors.filter((c) => c.name !== "Your Business");

  const chartData = mockCompetitors.map((c) => ({
    name: c.name === "Your Business" ? "You" : c.name.split(" ")[0],
    score: c.overallScore,
    isYou: c.name === "Your Business",
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Competitor Analysis
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          See how you stack up against top travel businesses
        </p>
      </div>

      {/* Your position */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Your Position
            </p>
            <h2 className="text-xl font-bold text-foreground">
              #4 of 4 tracked competitors
            </h2>
            <p className="text-sm text-amber-400 mt-0.5">
              You have significant room to grow — gap is closable in 90 days
            </p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">
                {you.overallScore}
              </p>
              <p className="text-xs text-muted-foreground">Your Score</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-400">89</p>
              <p className="text-xs text-muted-foreground">Top Competitor</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-400">-27</p>
              <p className="text-xs text-muted-foreground">Gap to Close</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Score comparison chart */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Growth Score Comparison
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={40}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#1e1b4b",
                  border: "1px solid #312e81",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.isYou ? "#f59e0b" : "#6366f1"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic comparison */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Estimated Monthly Traffic
          </h3>
          <div className="space-y-3">
            {mockCompetitors.map((c) => (
              <div key={c.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span
                    className={
                      c.name === "Your Business"
                        ? "font-semibold text-amber-400"
                        : "text-muted-foreground"
                    }
                  >
                    {c.name}
                  </span>
                  <span className="font-medium text-foreground">
                    {c.trafficEstimate}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted/20 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width:
                        c.name === "MakeMyTrip"
                          ? "100%"
                          : c.name === "Cox & Kings"
                            ? "5.3%"
                            : c.name === "Thomas Cook India"
                              ? "4%"
                              : "0.009%",
                      backgroundColor:
                        c.name === "Your Business" ? "#f59e0b" : "#6366f1",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground">
            * Traffic estimates based on keyword rankings and social signals
          </p>
        </div>
      </div>

      {/* Competitor table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            Competitor Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                {[
                  "Business",
                  "Domain",
                  "Growth Score",
                  "SEO Score",
                  "Traffic",
                  "Keywords",
                  "Social",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockCompetitors.map((c) => (
                <tr
                  key={c.name}
                  className={`hover:bg-muted/10 transition-colors ${c.name === "Your Business" ? "bg-amber-500/5" : ""}`}
                >
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-medium ${c.name === "Your Business" ? "text-amber-400" : "text-foreground"}`}
                    >
                      {c.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                      {c.domain}
                      {c.name !== "Your Business" && (
                        <ExternalLink className="h-3 w-3" />
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-sm font-bold"
                      style={{ color: scoreColor(c.overallScore) }}
                    >
                      {c.overallScore}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-foreground">
                      {c.seoScore}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {c.trafficEstimate}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {c.keywords.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {c.socialFollowers}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Keyword gaps */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Keyword Gap Analysis
          </h3>
          <span className="text-xs text-muted-foreground">
            Your rankings vs. top competitors
          </span>
        </div>
        <div className="space-y-2">
          {mockKeywords.map((kw) => (
            <div
              key={kw.keyword}
              className="flex items-center gap-4 rounded-xl border border-border/50 px-4 py-3 hover:bg-muted/10 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {kw.keyword}
                </p>
                <p className="text-xs text-muted-foreground">
                  {kw.volume} monthly searches
                </p>
              </div>
              <div className="text-center shrink-0">
                <p className="text-xs text-muted-foreground">Your rank</p>
                <p
                  className={`text-lg font-bold ${kw.position <= 30 ? "text-emerald-400" : kw.position <= 60 ? "text-amber-400" : "text-red-400"}`}
                >
                  #{kw.position}
                </p>
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${kw.trend === "up" ? "text-emerald-400" : "text-red-400"}`}
              >
                {kw.trend === "up" ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {kw.trend}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
