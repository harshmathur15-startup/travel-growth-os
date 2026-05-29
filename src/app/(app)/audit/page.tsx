"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

type Dimension = {
  name: string;
  score: number;
  findings: string[];
  top_recommendation: string;
  impact: string;
};

type AuditResult = {
  auditId: string;
  overall_score: number;
  summary: string;
  dimensions: Dimension[];
};

const auditSteps = [
  "Fetching website content…",
  "Analysing SEO & meta tags…",
  "Checking conversion signals…",
  "Reviewing trust & credibility…",
  "Auditing mobile experience…",
  "Evaluating content quality…",
  "Generating AI recommendations…",
];

function scoreColor(s: number) {
  if (s >= 80) return "#10b981";
  if (s >= 60) return "#f59e0b";
  return "#ef4444";
}

function ScoreRing({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative" style={{ width: 88, height: 88 }}>
      <svg width={88} height={88} className="-rotate-90">
        <circle
          cx={44}
          cy={44}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={8}
          className="text-muted/20"
        />
        <circle
          cx={44}
          cy={44}
          r={r}
          fill="none"
          stroke={scoreColor(score)}
          strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-foreground">{score}</span>
      </div>
    </div>
  );
}

export default function AuditPage() {
  const [step, setStep] = useState<"form" | "running" | "done" | "error">(
    "form",
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLimitError, setIsLimitError] = useState(false);

  const handleRun = async () => {
    setStep("running");
    setStepIndex(0);

    // Animate through steps while API call runs
    const interval = setInterval(() => {
      setStepIndex((i) => (i < auditSteps.length - 1 ? i + 1 : i));
    }, 700);

    try {
      const res = await fetch("/api/audit/run", { method: "POST" });
      const data = await res.json();
      clearInterval(interval);

      if (!res.ok) {
        if (data.error === "limit_reached") {
          setIsLimitError(true);
          setErrorMsg(data.message);
        } else {
          setErrorMsg(data.error || "Something went wrong. Please try again.");
        }
        setStep("error");
        return;
      }

      setResult(data);
      setStep("done");
    } catch {
      clearInterval(interval);
      setErrorMsg("Network error. Please check your connection and try again.");
      setStep("error");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Run AI Audit</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          AI will analyse your website and generate a full growth report.
        </p>
      </div>

      {step === "form" && (
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-2">
              Ready to analyse
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Your business profile is saved. Click below to run a full AI audit
              on your website.
            </p>
            <button
              onClick={handleRun}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Generate AI Audit Now
            </button>
            <p className="text-center text-[11px] text-muted-foreground mt-3">
              Takes ~15 seconds · Analyses 6 growth dimensions
            </p>
            <div className="mt-5 border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
                Want to audit a different website?{" "}
                <Link
                  href="/settings"
                  className="text-indigo-400 hover:underline"
                >
                  Update your business profile →
                </Link>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              What We Analyse
            </h3>
            <div className="space-y-2.5">
              {[
                "SEO & meta tags",
                "Conversion & CTAs",
                "Trust & reviews",
                "Mobile & page speed",
                "Social media presence",
                "Content quality",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <span className="text-xs text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === "running" && (
        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 p-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20">
              <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-foreground mb-1">
            Analysing your business…
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Our AI is scanning your digital presence
          </p>
          <div className="max-w-sm mx-auto space-y-2.5">
            {auditSteps.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5 text-left">
                {i < stepIndex ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                ) : i === stepIndex ? (
                  <Loader2 className="h-3.5 w-3.5 shrink-0 text-indigo-400 animate-spin" />
                ) : (
                  <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-border" />
                )}
                <span
                  className={`text-xs ${i <= stepIndex ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === "error" && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-red-400 mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-2">
            {isLimitError ? "Audit limit reached" : "Audit failed"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            {errorMsg}
          </p>
          {isLimitError ? (
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Upgrade to Pro <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <button
              onClick={() => setStep("form")}
              className="text-sm text-indigo-400 hover:underline"
            >
              Try again →
            </button>
          )}
        </div>
      )}

      {step === "done" && result && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <p className="text-sm text-emerald-300 font-medium">
              Audit complete — 6 dimensions analysed
            </p>
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              AI Summary
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Score rings */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-6 text-center">
              Your Growth Scores
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={result.overall_score} />
                <span className="text-xs text-muted-foreground">Overall</span>
              </div>
              {result.dimensions.map((dim) => (
                <div
                  key={dim.name}
                  className="flex flex-col items-center gap-2"
                >
                  <ScoreRing score={dim.score} />
                  <span className="text-xs text-muted-foreground text-center">
                    {dim.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dimension details */}
          <div className="space-y-4">
            {result.dimensions
              .sort((a, b) => a.score - b.score)
              .map((dim) => (
                <div
                  key={dim.name}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      {dim.name}
                    </h3>
                    <span
                      className="text-lg font-black"
                      style={{ color: scoreColor(dim.score) }}
                    >
                      {dim.score}/100
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted/30 mb-4 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${dim.score}%`,
                        backgroundColor: scoreColor(dim.score),
                      }}
                    />
                  </div>
                  <div className="space-y-1.5 mb-4">
                    {dim.findings.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5 text-amber-400" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 mb-1">
                      Top Fix
                    </p>
                    <p className="text-xs text-foreground">
                      {dim.top_recommendation}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity text-center"
            >
              View Full Dashboard
            </Link>
            <button
              onClick={() => setStep("form")}
              className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Run Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
