"use client";

import { useState } from "react";
import { Save, Building2, Bell, Shield, CreditCard } from "lucide-react";

const sections = [
  { id: "business", label: "Business Profile", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing & Plan", icon: CreditCard },
];

export default function SettingsPage() {
  const [active, setActive] = useState("business");
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage your account and business profile
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="hidden w-48 shrink-0 lg:block">
          <nav className="space-y-1">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active === id
                    ? "bg-indigo-500/10 text-indigo-400"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 space-y-4">
          {active === "business" && (
            <>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-sm font-semibold text-foreground mb-5">
                  Business Information
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Business Name", value: "Wanderlust Travel Co." },
                    { label: "Website URL", value: "wanderlusttravel.in" },
                    { label: "Instagram Handle", value: "@wanderlust_travel" },
                    { label: "City / Location", value: "Mumbai, Maharashtra" },
                    { label: "Business Category", value: "Travel Agency" },
                    { label: "Phone Number", value: "+91 98765 43210" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        {label}
                      </label>
                      <input
                        defaultValue={value}
                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSaved(true);
                    setTimeout(() => setSaved(false), 2000);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Save className="h-4 w-4" />
                  {saved ? "Saved!" : "Save Changes"}
                </button>
              </div>
            </>
          )}

          {active === "notifications" && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold text-foreground mb-5">
                Notification Preferences
              </h2>
              <div className="space-y-4">
                {[
                  {
                    label: "Weekly audit reminders",
                    desc: "Remind me to re-run my audit every week",
                    on: true,
                  },
                  {
                    label: "New AI recommendations",
                    desc: "Alert when agents find new opportunities",
                    on: true,
                  },
                  {
                    label: "Competitor changes",
                    desc: "Notify when competitors improve significantly",
                    on: false,
                  },
                  {
                    label: "Keyword ranking changes",
                    desc: "Alert on significant ranking movement",
                    on: true,
                  },
                  {
                    label: "Monthly growth digest",
                    desc: "Summary email every month",
                    on: false,
                  },
                ].map(({ label, desc, on }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-1"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {label}
                      </p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <div
                      className={`relative h-5 w-9 cursor-pointer rounded-full transition-colors ${on ? "bg-indigo-500" : "bg-muted"}`}
                    >
                      <div
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === "billing" && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold text-foreground mb-2">
                Current Plan
              </h2>
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 mb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-bold text-foreground">
                      Free Plan
                    </p>
                    <p className="text-xs text-muted-foreground">
                      3 audits/month · Basic recommendations
                    </p>
                  </div>
                  <span className="rounded-full border border-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-400">
                    Free
                  </span>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    name: "Pro",
                    price: "₹2,999/mo",
                    features: [
                      "Unlimited audits",
                      "All AI agents",
                      "PDF reports",
                      "Competitor tracking",
                      "Priority support",
                    ],
                  },
                  {
                    name: "Agency",
                    price: "₹7,999/mo",
                    features: [
                      "Everything in Pro",
                      "10 business profiles",
                      "White-label reports",
                      "API access",
                      "Dedicated manager",
                    ],
                  },
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className="rounded-xl border border-border bg-muted/20 p-4"
                  >
                    <p className="text-sm font-bold text-foreground">
                      {plan.name}
                    </p>
                    <p className="text-lg font-bold text-indigo-400 mt-1">
                      {plan.price}
                    </p>
                    <ul className="mt-3 space-y-1.5 mb-4">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <span className="text-emerald-400">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 py-2 text-xs font-semibold text-white hover:opacity-90">
                      Upgrade to {plan.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === "security" && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold text-foreground mb-5">
                Security
              </h2>
              <div className="space-y-4 max-w-sm">
                {["Current Password", "New Password", "Confirm Password"].map(
                  (label) => (
                    <div key={label}>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        {label}
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  ),
                )}
                <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
