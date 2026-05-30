"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Lightbulb,
  BarChart3,
  Bot,
  FileText,
  Plug,
  Settings,
  TrendingUp,
  Zap,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Run Audit", href: "/audit", icon: Search },
  { label: "Recommendations", href: "/recommendations", icon: Lightbulb },
  { label: "Competitors", href: "/competitors", icon: BarChart3 },
  { label: "AI Agents", href: "/ai-agents", icon: Bot },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Creator Hub", href: "/creators", icon: Sparkles },
  { label: "Integrations", href: "/integrations", icon: Plug },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-5 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500">
          <TrendingUp className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="text-sm font-bold text-sidebar-foreground tracking-tight">
            GrowthOS
          </span>
          <p className="text-[10px] text-sidebar-foreground/40 leading-none">
            Travel AI Platform
          </p>
        </div>
      </div>

      {/* Score pill */}
      <div className="mx-3 mt-4 rounded-xl bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-500/20 p-3">
        <p className="text-[10px] text-sidebar-foreground/50 uppercase tracking-wide mb-1">
          Growth Score
        </p>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold text-white">62</span>
          <span className="text-xs text-amber-400 mb-0.5 font-medium">
            Needs Work
          </span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    active
                      ? "bg-sidebar-accent text-white"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      active
                        ? "text-indigo-400"
                        : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70",
                    )}
                  />
                  <span className="flex-1">{label}</span>
                  {active && (
                    <ChevronRight className="h-3 w-3 text-indigo-400" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Upgrade CTA */}
      <div className="mx-3 mb-3 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-3.5 w-3.5 text-indigo-400" />
          <p className="text-xs font-semibold text-sidebar-foreground">
            Upgrade to Pro
          </p>
        </div>
        <p className="text-[10px] text-sidebar-foreground/50 mb-2">
          Unlock AI agents, PDF reports & competitor tracking
        </p>
        <button className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 py-1.5 text-[11px] font-semibold text-white hover:opacity-90 transition-opacity">
          Upgrade Now
        </button>
      </div>

      {/* User */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 px-1 py-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-xs font-bold text-white">
            WT
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-sidebar-foreground">
              Wanderlust Travel
            </p>
            <p className="truncate text-[10px] text-sidebar-foreground/40">
              Free Plan
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
