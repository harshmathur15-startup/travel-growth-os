"use client";

import { useState } from "react";
import { mockAuditScores } from "@/lib/mock-data";
import {
  Search,
  Globe,
  Camera,
  MapPin,
  ChevronDown,
  Zap,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const categories = [
  "Travel Agency",
  "Tour Operator",
  "Visa Consultant",
  "Honeymoon Planner",
  "Pilgrimage Operator",
  "Adventure Travel",
  "Destination Expert",
  "DMC",
];

function ScoreRing({
  score,
  label,
  color,
}: {
  score: number;
  label: string;
  color: string;
}) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
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
            stroke={color}
            strokeWidth={8}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-foreground">{score}</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
    </div>
  );
}

function scoreColor(s: number) {
  if (s >= 80) return "#10b981";
  if (s >= 60) return "#f59e0b";
  return "#ef4444";
}

const auditChecks = [
  { label: "Scanning website structure…", done: true },
  { label: "Analysing SEO & meta tags…", done: true },
  { label: "Testing page speed…", done: true },
  { label: "Checking mobile responsiveness…", done: true },
  { label: "Detecting WhatsApp integration…", done: true },
  { label: "Auditing Instagram profile…", done: true },
  { label: "Reviewing trust signals & reviews…", done: true },
  { label: "Running competitor benchmarks…", done: true },
  { label: "Generating AI recommendations…", done: true },
];

export default function AuditPage() {
  const [step, setStep] = useState<"form" | "running" | "done">("form");
  const [url, setUrl] = useState("");
  const [instagram, setInstagram] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");

  const handleRun = () => {
    if (!url) return;
    setStep("running");
    setTimeout(() => setStep("done"), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Run AI Audit</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Enter your business details and get a full growth analysis in seconds
        </p>
      </div>

      {step === "form" && (
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-5">
              Business Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Website URL *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://yourtravel.com"
                    className="w-full rounded-xl border border-border bg-muted/30 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Instagram Profile URL
                </label>
                <div className="relative">
                  <Camera className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/yourbusiness"
                    className="w-full rounded-xl border border-border bg-muted/30 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Google Business Profile URL
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    placeholder="https://g.co/kgs/..."
                    className="w-full rounded-xl border border-border bg-muted/30 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Business Category
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      <option value="">Select category…</option>
                      {categories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    City / Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai, Delhi, Bangalore…"
                      className="w-full rounded-xl border border-border bg-muted/30 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleRun}
                disabled={!url}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Generate Free AI Audit
              </button>
              <p className="text-center text-[11px] text-muted-foreground">
                Takes ~30 seconds · No credit card required
              </p>
            </div>
          </div>

          {/* What we analyse */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              What We Analyse
            </h3>
            <div className="space-y-2.5">
              {[
                "Website SEO & meta tags",
                "Page speed (Core Web Vitals)",
                "Mobile responsiveness",
                "CTA placement & quality",
                "WhatsApp integration",
                "Lead form effectiveness",
                "Instagram activity & engagement",
                "Google Reviews & trust signals",
                "Keyword visibility",
                "Competitor benchmarking",
                "Brand consistency",
                "Content freshness",
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
            Our AI agents are scanning your digital presence
          </p>
          <div className="max-w-sm mx-auto space-y-2">
            {auditChecks.map((check, i) => (
              <div key={i} className="flex items-center gap-2.5 text-left">
                <Loader2 className="h-3.5 w-3.5 shrink-0 text-indigo-400 animate-spin" />
                <span className="text-xs text-muted-foreground">
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <p className="text-sm text-emerald-300 font-medium">
              Audit complete! Analysed {url || "yourtravel.com"} —{" "}
              {auditChecks.length} checks run
            </p>
          </div>

          {/* Score rings */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-6 text-center">
              Your Growth Scores
            </h3>
            <div className="flex flex-wrap justify-center gap-8">
              <ScoreRing
                score={mockAuditScores.overall}
                label="Overall Growth"
                color={scoreColor(mockAuditScores.overall)}
              />
              <ScoreRing
                score={mockAuditScores.seo}
                label="SEO Score"
                color={scoreColor(mockAuditScores.seo)}
              />
              <ScoreRing
                score={mockAuditScores.conversion}
                label="Conversion"
                color={scoreColor(mockAuditScores.conversion)}
              />
              <ScoreRing
                score={mockAuditScores.social}
                label="Social Media"
                color={scoreColor(mockAuditScores.social)}
              />
              <ScoreRing
                score={mockAuditScores.trust}
                label="Brand Trust"
                color={scoreColor(mockAuditScores.trust)}
              />
              <ScoreRing
                score={mockAuditScores.mobile}
                label="Mobile UX"
                color={scoreColor(mockAuditScores.mobile)}
              />
              <ScoreRing
                score={mockAuditScores.speed}
                label="Page Speed"
                color={scoreColor(mockAuditScores.speed)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Issues Found", value: "23", color: "text-red-400" },
              { label: "Critical", value: "2", color: "text-red-400" },
              {
                label: "Lead Opportunity",
                value: "+180%",
                color: "text-emerald-400",
              },
              {
                label: "Est. Monthly Leads Lost",
                value: "~142",
                color: "text-amber-400",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="rounded-xl border border-border bg-card p-4 text-center"
              >
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
              View Full Recommendations
            </button>
            <button className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              Download PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
