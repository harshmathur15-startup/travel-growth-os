import { mockAuditHistory } from "@/lib/mock-data";
import {
  FileText,
  Download,
  Share2,
  Calendar,
  CheckCircle2,
} from "lucide-react";

function scoreColor(s: number) {
  if (s >= 80) return "text-emerald-400";
  if (s >= 60) return "text-amber-400";
  return "text-red-400";
}

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Download and share your growth audit reports
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
          <Download className="h-4 w-4" />
          Export All
        </button>
      </div>

      {/* PDF CTA */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-foreground">
              Branded PDF Growth Report
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate a professional, white-labelled audit report to share with
              clients or stakeholders. Includes all scores, recommendations,
              competitor analysis, and 90-day roadmap.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "All scores & findings",
                "AI recommendations",
                "Competitor benchmarks",
                "90-day roadmap",
                "Your branding",
              ].map((f) => (
                <span
                  key={f}
                  className="flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-medium text-indigo-400"
                >
                  <CheckCircle2 className="h-3 w-3" /> {f}
                </span>
              ))}
            </div>
          </div>
          <button className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors">
            Generate PDF
          </button>
        </div>
      </div>

      {/* Report history */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Audit Reports
        </h3>
        <div className="space-y-3">
          {mockAuditHistory.map((audit) => (
            <div
              key={audit.id}
              className="flex items-center gap-4 rounded-xl border border-border/50 px-4 py-4 hover:bg-muted/10 transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
                <FileText className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {audit.businessName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {audit.url} · {audit.category}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {audit.date}
                </div>
              </div>
              <div className="text-center shrink-0">
                <p
                  className={`text-2xl font-bold ${scoreColor(audit.overallScore)}`}
                >
                  {audit.overallScore}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Growth Score
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors">
                  <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors">
                  <Download className="h-3.5 w-3.5" />
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled reports */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Scheduled Reports
          </h3>
          <button className="text-xs text-indigo-400 hover:text-indigo-300">
            + Schedule
          </button>
        </div>
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <Calendar className="mx-auto h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">
            No scheduled reports yet
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Upgrade to Pro to get weekly or monthly reports emailed
            automatically
          </p>
          <button className="mt-3 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-xs font-semibold text-white hover:opacity-90">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
}
