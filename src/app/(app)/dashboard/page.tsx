"use client";

import {
  mockAuditScores,
  mockRecommendations,
  mockWeeklyTraffic,
  mockAuditHistory,
} from "@/lib/mock-data";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Eye,
  MessageSquare,
  Star,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import Link from "next/link";

function ScoreRing({
  score,
  label,
  color,
  size = "md",
}: {
  score: number;
  label: string;
  color: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: 64, md: 80, lg: 120 };
  const strokes = { sm: 6, md: 7, lg: 10 };
  const r = sizes[size] / 2 - strokes[size];
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
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
            stroke={color}
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
      <span className="text-[11px] text-muted-foreground text-center">
        {label}
      </span>
    </div>
  );
}

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

const priorityConfig = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  high: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  medium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function DashboardPage() {
  const criticalCount = mockRecommendations.filter(
    (r) => r.priority === "critical",
  ).length;
  const sl = scoreLabel(mockAuditScores.overall);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Growth Overview
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Wanderlust Travel Co. · Last audit: 22 May 2026
          </p>
        </div>
        <Link
          href="/audit"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          <Zap className="h-4 w-4" />
          Re-run Audit
        </Link>
      </div>

      {/* Alert banner */}
      {criticalCount > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
          <p className="text-sm text-red-300">
            <span className="font-semibold">
              {criticalCount} critical issues
            </span>{" "}
            found — fixing these could increase your leads by 60–80%
            immediately.
          </p>
          <Link
            href="/recommendations"
            className="ml-auto flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-300 shrink-0"
          >
            Fix now <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Score cards */}
      <div className="grid gap-4 lg:grid-cols-4">
        {/* Main score */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 glow-blue">
          <ScoreRing
            score={mockAuditScores.overall}
            label="Overall Growth Score"
            color={scoreColor(mockAuditScores.overall)}
            size="lg"
          />
          <span className={`mt-2 text-sm font-semibold ${sl.cls}`}>
            {sl.text}
          </span>
          <p className="mt-1 text-[11px] text-muted-foreground text-center">
            Top 40% of travel agencies
          </p>
        </div>

        {/* Sub scores grid */}
        <div className="lg:col-span-3 grid grid-cols-3 gap-3">
          {[
            { label: "SEO Score", score: mockAuditScores.seo, icon: "🔍" },
            {
              label: "Conversion",
              score: mockAuditScores.conversion,
              icon: "⚡",
            },
            { label: "Social", score: mockAuditScores.social, icon: "📸" },
            { label: "Trust", score: mockAuditScores.trust, icon: "⭐" },
            { label: "Mobile", score: mockAuditScores.mobile, icon: "📱" },
            { label: "Speed", score: mockAuditScores.speed, icon: "🚀" },
          ].map(({ label, score, icon }) => (
            <div
              key={label}
              className="flex flex-col rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-base">{icon}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {score}
                </span>
                <span className="mb-0.5 text-xs text-muted-foreground">
                  /100
                </span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${score}%`,
                    backgroundColor: scoreColor(score),
                  }}
                />
              </div>
              <div
                className={`mt-1 text-[10px] font-medium ${scoreLabel(score).cls}`}
              >
                {scoreLabel(score).text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts + recommendations */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Traffic chart */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Weekly Traffic & Leads
              </h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                Visitors
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                Leads
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockWeeklyTraffic}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
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
                labelStyle={{ color: "#a5b4fc" }}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#colorVisitors)"
              />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#colorLeads)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick stats */}
        <div className="space-y-3">
          {[
            {
              label: "Est. Monthly Visitors",
              value: "4,200",
              change: "+12%",
              icon: Eye,
              up: true,
            },
            {
              label: "WhatsApp Inquiries",
              value: "0",
              change: "Not set up",
              icon: MessageSquare,
              up: false,
            },
            {
              label: "Google Reviews",
              value: "4.3★",
              change: "87 reviews",
              icon: Star,
              up: true,
            },
            {
              label: "Avg. Page Speed",
              value: "3.8s",
              change: "Too slow",
              icon: Zap,
              up: false,
            },
          ].map(({ label, value, change, icon: Icon, up }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${up ? "bg-emerald-500/10" : "bg-red-500/10"}`}
              >
                <Icon
                  className={`h-4 w-4 ${up ? "text-emerald-400" : "text-red-400"}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-lg font-bold text-foreground">{value}</p>
              </div>
              <div
                className={`flex items-center gap-0.5 text-xs font-medium ${up ? "text-emerald-400" : "text-red-400"}`}
              >
                {up ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {change}
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
          {mockRecommendations.slice(0, 4).map((rec) => (
            <div
              key={rec.id}
              className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/20 p-3"
            >
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${priorityConfig[rec.priority]}`}
              >
                {rec.priority === "critical"
                  ? "!"
                  : rec.priority === "high"
                    ? "↑"
                    : "·"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {rec.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                  {rec.description}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-semibold text-emerald-400">
                  {rec.leadImprovement}
                </p>
                <p className="text-[10px] text-muted-foreground capitalize">
                  {rec.effort} fix
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit history */}
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
          {mockAuditHistory.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-4 rounded-xl border border-border/50 px-4 py-3 hover:bg-muted/20 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {a.businessName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {a.url} · {a.category}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p
                  className="text-lg font-bold"
                  style={{ color: scoreColor(a.overallScore) }}
                >
                  {a.overallScore}
                </p>
                <p className="text-[10px] text-muted-foreground">{a.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
