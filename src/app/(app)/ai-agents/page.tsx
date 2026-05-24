import { aiAgents } from "@/lib/mock-data";
import { Bot, Zap, TrendingUp, CheckCircle2 } from "lucide-react";

const statusConfig = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  idle: "bg-muted text-muted-foreground border-border",
  running: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function AIAgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Agents</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            5 agents analysing your business 24/7
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
          <Zap className="h-4 w-4" />
          Run All Agents
        </button>
      </div>

      {/* Agent grid */}
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {aiAgents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-2xl border border-border bg-card p-5 hover:border-indigo-500/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 text-xl">
                  {agent.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {agent.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    Last run: {agent.lastRun}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusConfig[agent.status as keyof typeof statusConfig]}`}
              >
                {agent.status}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              {agent.description}
            </p>

            {/* Confidence bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-semibold text-foreground">
                  {agent.confidence}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                  style={{ width: `${agent.confidence}%` }}
                />
              </div>
            </div>

            {/* Top insight */}
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 mb-4">
              <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wide mb-1">
                Top Insight
              </p>
              <p className="text-xs text-foreground leading-relaxed">
                {agent.topInsight}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                {agent.findings} findings
              </div>
              <button className="rounded-lg border border-indigo-500/30 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}

        {/* AI Chat card */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                AI Growth Chat
              </h3>
              <p className="text-[10px] text-muted-foreground">
                Ask anything about your business
              </p>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            {[
              "Why am I losing leads?",
              "How do I rank on Google?",
              "What should I post on Instagram?",
              "How do competitors get more traffic?",
            ].map((q) => (
              <button
                key={q}
                className="w-full rounded-xl border border-border/50 bg-card/50 px-3 py-2 text-left text-xs text-muted-foreground hover:text-foreground hover:border-indigo-500/30 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              placeholder="Ask your AI consultant…"
              className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <button className="rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 px-3 py-2 text-xs font-semibold text-white hover:opacity-90">
              <TrendingUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
