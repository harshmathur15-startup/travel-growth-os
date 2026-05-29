"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Loader2,
} from "lucide-react";

type Dimension = {
  name: string;
  score: number;
  findings: string[];
  top_recommendation: string;
  impact: string;
};

type DashboardData = {
  user: { plan: string; audits_used: number; audit_limit: number };
  business: {
    name: string;
    website_url: string;
    category: string;
    city: string;
  };
  latest_audit: {
    id: string;
    overall_score: number;
    summary: string;
    created_at: string;
    dimensions: Dimension[];
  } | null;
  audit_history: { id: string; overall_score: number; created_at: string }[];
};

function scoreColor(s: number) {
  if (s >= 80) return "#10b981";
  if (s >= 60) return "#f59e0b";
  return "#ef4444";
}

function scoreLabel(s: number) {
  if (s >= 80) return { text: "Good", cls: "text-emerald-500" };
  if (s >= 60) return { text: "Needs Work", cls: "text-amber-500" };
  return { text: "Critical", cls: "text-red-500" };
}

function ScoreRing({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: 64, md: 80, lg: 120 };
  const strokes = { sm: 6, md: 7, lg: 10 };
  const r = sizes[size] / 2 - strokes[size];
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div
      className="relative"
      style={{ width: sizes[size], height: sizes[size] }}
    >
      <svg width={sizes[size]} height={sizes[size]} className="-rotate-90">
        <circle
          cx={sizes[size] / 2}
          cy={sizes[size] / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokes[size]}
          className="text-muted/30"
        />
        <circle
          cx={sizes[size] / 2}
          cy={sizes[size] / 2}
          r={r}
          fill="none"
          stroke={scoreColor(score)}
          strokeWidth={strokes[size]}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-bold text-foreground ${size === "lg" ? "text-3xl" : size === "md" ? "text-lg" : "text-sm"}`}
        >
          {score}
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        if (d.onboarding_required) {
          router.push("/onboarding");
          return;
        }
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  const { user, business, latest_audit, audit_history } = data;
  const auditsLeft =
    user.plan === "free" ? user.audit_limit - user.audits_used : null;

  // No audit yet — show empty state
  if (!latest_audit) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Growth Overview
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {business.name} · {business.city}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20">
            <Zap className="h-7 w-7 text-indigo-400" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">
            Run your first AI audit
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            Get a full diagnosis of your website, SEO, conversion rate, and
            trust signals — in under 60 seconds.
          </p>
          <Link
            href="/audit"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <Zap className="h-4 w-4" />
            Run Free AI Audit
          </Link>
          {auditsLeft !== null && (
            <p className="mt-3 text-xs text-muted-foreground">
              {auditsLeft} free audit{auditsLeft !== 1 ? "s" : ""} remaining
              this month
            </p>
          )}
        </div>
      </div>
    );
  }

  const sl = scoreLabel(latest_audit.overall_score);
  const criticalDims = latest_audit.dimensions.filter((d) => d.score < 60);
  const auditDate = new Date(latest_audit.created_at).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" },
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Growth Overview
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {business.name} · Last audit: {auditDate}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {auditsLeft !== null && (
            <span className="text-xs text-muted-foreground">
              {auditsLeft} audit{auditsLeft !== 1 ? "s" : ""} left this month
            </span>
          )}
          <Link
            href="/audit"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <Zap className="h-4 w-4" />
            Re-run Audit
          </Link>
        </div>
      </div>

      {/* Critical alert */}
      {criticalDims.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
          <p className="text-sm text-red-300">
            <span className="font-semibold">
              {criticalDims.length} critical area
              {criticalDims.length > 1 ? "s" : ""}
            </span>{" "}
            found — fixing these could significantly increase your bookings.
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
          AI Summary
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          {latest_audit.summary}
        </p>
      </div>

      {/* Score cards */}
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6">
          <ScoreRing score={latest_audit.overall_score} size="lg" />
          <span className={`mt-3 text-sm font-semibold ${sl.cls}`}>
            {sl.text}
          </span>
          <p className="mt-1 text-[11px] text-muted-foreground text-center">
            Overall Growth Score
          </p>
        </div>
        <div className="lg:col-span-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {latest_audit.dimensions.map((dim) => (
            <div
              key={dim.name}
              className="flex flex-col rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">
                  {dim.name}
                </span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${dim.score >= 80 ? "bg-emerald-500/10 text-emerald-400" : dim.score >= 60 ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}
                >
                  {dim.impact}
                </span>
              </div>
              <div className="flex items-end gap-1.5 mb-2">
                <span className="text-2xl font-bold text-foreground">
                  {dim.score}
                </span>
                <span className="mb-0.5 text-xs text-muted-foreground">
                  /100
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${dim.score}%`,
                    backgroundColor: scoreColor(dim.score),
                  }}
                />
              </div>
              <div
                className={`mt-1 text-[10px] font-medium ${scoreLabel(dim.score).cls}`}
              >
                {scoreLabel(dim.score).text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top recommendations */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Top Action Items
          </h3>
          <Link
            href="/recommendations"
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {latest_audit.dimensions
            .sort((a, b) => a.score - b.score)
            .slice(0, 4)
            .map((dim) => (
              <div
                key={dim.name}
                className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/20 p-3"
              >
                <div
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${dim.score < 60 ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}
                >
                  {dim.score < 60 ? "!" : "↑"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {dim.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                    {dim.top_recommendation}
                  </p>
                </div>
                <div className="shrink-0">
                  <span
                    className={`text-xs font-semibold ${dim.score < 60 ? "text-red-400" : "text-amber-400"}`}
                  >
                    Score: {dim.score}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Audit history */}
      {audit_history.length > 1 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Audit History
            </h3>
            <Link
              href="/audit"
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              + New Audit
            </Link>
          </div>
          <div className="space-y-2">
            {audit_history.map((a, i) => {
              const prev = audit_history[i + 1];
              const improved = prev
                ? a.overall_score > prev.overall_score
                : null;
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-4 rounded-xl border border-border/50 px-4 py-3"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {business.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <p
                    className="text-lg font-bold"
                    style={{ color: scoreColor(a.overall_score) }}
                  >
                    {a.overall_score}
                  </p>
                  {improved !== null &&
                    (improved ? (
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upgrade nudge for free users */}
      {user.plan === "free" && (
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-foreground">
              You&apos;re on the Free plan
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {auditsLeft} audit{auditsLeft !== 1 ? "s" : ""} remaining this
              month. Upgrade for unlimited audits + competitor tracking.
            </p>
          </div>
          <Link
            href="/settings"
            className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Upgrade to Pro
          </Link>
        </div>
      )}
    </div>
  );
}
