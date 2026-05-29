"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Lightbulb,
  TrendingUp,
  Loader2,
  Zap,
  AlertTriangle,
} from "lucide-react";

type Dimension = {
  name: string;
  score: number;
  findings: string[];
  top_recommendation: string;
  impact: string;
};

type DashboardData = {
  latest_audit: {
    overall_score: number;
    summary: string;
    dimensions: Dimension[];
  } | null;
};

function priorityFromScore(score: number) {
  if (score < 60)
    return {
      label: "Critical",
      cls: "bg-red-500/10 text-red-400 border-red-500/20",
    };
  if (score < 80)
    return {
      label: "High",
      cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };
  return {
    label: "Medium",
    cls: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };
}

const categoryColors: Record<string, string> = {
  SEO: "bg-indigo-500/10 text-indigo-400",
  Conversion: "bg-cyan-500/10 text-cyan-400",
  "Trust & Reviews": "bg-yellow-500/10 text-yellow-400",
  "Social Media": "bg-pink-500/10 text-pink-400",
  "Mobile & Speed": "bg-purple-500/10 text-purple-400",
  "Content Quality": "bg-emerald-500/10 text-emerald-400",
};

export default function RecommendationsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data?.latest_audit) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            AI Recommendations
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Run an audit first to see your recommendations.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <Zap className="h-8 w-8 text-indigo-400 mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-2">
            No audit yet
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            Run your first AI audit to get personalised recommendations for your
            business.
          </p>
          <Link
            href="/audit"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <Zap className="h-4 w-4" />
            Run Free AI Audit
          </Link>
        </div>
      </div>
    );
  }

  const { dimensions, summary } = data.latest_audit;
  const sorted = [...dimensions].sort((a, b) => a.score - b.score);
  const critical = sorted.filter((d) => d.score < 60);
  const high = sorted.filter((d) => d.score >= 60 && d.score < 80);
  const medium = sorted.filter((d) => d.score >= 80);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          AI Recommendations
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {dimensions.length * 2} actionable insights · Sorted by impact
        </p>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        {critical.length > 0 && (
          <span className="rounded-full border px-3 py-1 text-xs font-semibold bg-red-500/10 text-red-400 border-red-500/20">
            {critical.length} Critical
          </span>
        )}
        {high.length > 0 && (
          <span className="rounded-full border px-3 py-1 text-xs font-semibold bg-amber-500/10 text-amber-400 border-amber-500/20">
            {high.length} High Priority
          </span>
        )}
        {medium.length > 0 && (
          <span className="rounded-full border px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border-blue-500/20">
            {medium.length} Medium
          </span>
        )}
        <span className="rounded-full border px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
          Fix critical items first
        </span>
      </div>

      {/* Recommendation cards — one per dimension, sorted worst first */}
      <div className="space-y-3">
        {sorted.map((dim, i) => {
          const priority = priorityFromScore(dim.score);
          return (
            <div
              key={dim.name}
              className="rounded-2xl border border-border bg-card p-5 hover:border-indigo-500/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-sm font-bold text-indigo-400">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {dim.name}
                    </h3>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${priority.cls}`}
                    >
                      {priority.label}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryColors[dim.name] ?? "bg-muted text-muted-foreground"}`}
                    >
                      Score: {dim.score}/100
                    </span>
                  </div>

                  {/* Top recommendation highlighted */}
                  <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-3 py-2 mb-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 mb-0.5">
                      Top Fix
                    </p>
                    <p className="text-xs text-foreground">
                      {dim.top_recommendation}
                    </p>
                  </div>

                  {/* Individual findings */}
                  <div className="space-y-1.5">
                    {dim.findings.map((finding, fi) => (
                      <div
                        key={fi}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5 text-amber-400" />
                        {finding}
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                      <span className="font-semibold text-emerald-400 capitalize">
                        {dim.impact} impact
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI summary brief */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-foreground">
            AI Growth Consultant Summary
          </h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {summary}
        </p>
        <div className="mt-4">
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <Zap className="h-3.5 w-3.5" />
            Re-run Audit for Fresh Recommendations
          </Link>
        </div>
      </div>
    </div>
  );
}
