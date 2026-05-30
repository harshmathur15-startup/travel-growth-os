"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Building2,
  Shield,
  CreditCard,
  Loader2,
  CheckCircle2,
  Crown,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void };
  }
}

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
};

type SettingsData = {
  user: {
    email: string;
    name: string;
    plan: string;
    audits_used: number;
    audit_limit: number;
  };
  business: {
    name: string;
    website_url: string;
    category: string;
    city: string;
    instagram: string | null;
    google_business: string | null;
    competitor_urls: string[] | null;
  } | null;
};

const sections = [
  { id: "business", label: "Business Profile", icon: Building2 },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing & Plan", icon: CreditCard },
];

const categories = [
  "Travel Agency",
  "Tour Operator",
  "Adventure Travel",
  "Luxury Travel",
  "Budget Travel",
  "Honeymoon Specialist",
  "Corporate Travel",
  "Pilgrimage Tours",
  "Wildlife & Safari",
  "Other",
];

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function SettingsPage() {
  const [active, setActive] = useState("business");
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    website_url: "",
    category: "",
    city: "",
    instagram: "",
    google_business: "",
    competitor_urls: ["", "", ""],
  });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">(
    "idle",
  );
  const [paying, setPaying] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d: SettingsData) => {
        setData(d);
        if (d.business) {
          const urls = d.business.competitor_urls ?? [];
          setForm({
            name: d.business.name,
            website_url: d.business.website_url,
            category: d.business.category,
            city: d.business.city,
            instagram: d.business.instagram ?? "",
            google_business: d.business.google_business ?? "",
            competitor_urls: [urls[0] ?? "", urls[1] ?? "", urls[2] ?? ""],
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          competitor_urls: form.competitor_urls.filter((u) => u.trim()),
        }),
      });
      if (res.ok) {
        setSaveStatus("saved");
        setData((prev) =>
          prev
            ? {
                ...prev,
                business: {
                  ...form,
                  instagram: form.instagram || null,
                  google_business: form.google_business || null,
                  competitor_urls: form.competitor_urls.filter((u) => u.trim()),
                },
              }
            : prev,
        );
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = async () => {
    setPaying(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Could not load payment gateway. Please check your connection.");
        return;
      }

      const res = await fetch("/api/payments/create-order", { method: "POST" });
      const order = await res.json();

      if (!res.ok) {
        alert(order.error || "Could not create payment order.");
        return;
      }

      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Travel Growth OS",
        description: "Pro Plan — Unlimited Audits",
        order_id: order.order_id,
        handler: async (response) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (verifyRes.ok) {
            setUpgraded(true);
            setData((prev) =>
              prev ? { ...prev, user: { ...prev.user, plan: "pro" } } : prev,
            );
          }
        },
        prefill: { name: data?.user.name ?? "", email: data?.user.email ?? "" },
        theme: { color: "#6366f1" },
      });
      rzp.open();
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const plan = data?.user.plan ?? "free";
  const isPro = plan === "pro" || upgraded;

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

        {/* Mobile tab bar */}
        <div className="flex lg:hidden gap-2 mb-2 overflow-x-auto">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                active === id
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-4">
          {/* ── Business Profile ── */}
          {active === "business" && (
            <>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-sm font-semibold text-foreground mb-5">
                  Business Information
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      key: "name",
                      label: "Business Name",
                      placeholder: "e.g. Wanderlust Travels",
                    },
                    {
                      key: "website_url",
                      label: "Website URL",
                      placeholder: "https://yourbusiness.in",
                    },
                    {
                      key: "city",
                      label: "City / Location",
                      placeholder: "e.g. Mumbai",
                    },
                    {
                      key: "instagram",
                      label: "Instagram Handle",
                      placeholder: "@yourbusiness",
                    },
                    {
                      key: "google_business",
                      label: "Google Business URL",
                      placeholder: "maps.app.goo.gl/…",
                    },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        {label}
                      </label>
                      <input
                        value={form[key as keyof typeof form] as string}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, [key]: e.target.value }))
                        }
                        placeholder={placeholder}
                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Business Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, category: e.target.value }))
                      }
                      className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Competitor Analysis */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-sm font-semibold text-foreground mb-1">
                  Competitor Analysis
                </h2>
                <p className="text-xs text-muted-foreground mb-5">
                  Add up to 3 competitor websites. The AI audit will benchmark
                  your digital presence against theirs.
                </p>
                <div className="space-y-3">
                  {form.competitor_urls.map((url, i) => (
                    <div key={i}>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Competitor {i + 1}{" "}
                        <span className="text-muted-foreground/50">
                          (optional)
                        </span>
                      </label>
                      <input
                        value={url}
                        onChange={(e) => {
                          const next = [...form.competitor_urls];
                          next[i] = e.target.value;
                          setForm((f) => ({ ...f, competitor_urls: next }));
                        }}
                        placeholder="https://competitor.in"
                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {saveStatus === "error" && (
                <p className="text-sm text-red-400">
                  Failed to save. Please try again.
                </p>
              )}

              <div className="flex items-center justify-end gap-3">
                {saveStatus === "saved" && (
                  <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" /> Saved!
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </>
          )}

          {/* ── Security ── */}
          {active === "security" && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold text-foreground mb-2">
                Security
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                Your account security is managed by Clerk. To change your
                password or enable two-factor authentication, visit your account
                settings.
              </p>
              <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  Signed in as:
                </span>{" "}
                {data?.user.email}
              </div>
            </div>
          )}

          {/* ── Billing ── */}
          {active === "billing" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-sm font-semibold text-foreground mb-4">
                  Current Plan
                </h2>
                <div
                  className={`rounded-xl border p-4 ${isPro ? "border-indigo-500/30 bg-indigo-500/5" : "border-border bg-muted/20"}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-bold text-foreground flex items-center gap-2">
                        {isPro && <Crown className="h-4 w-4 text-amber-400" />}
                        {isPro ? "Pro Plan" : "Free Plan"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isPro
                          ? "Unlimited audits · All features included"
                          : `${data?.user.audits_used ?? 0} / ${data?.user.audit_limit ?? 2} audits used this month`}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${isPro ? "border-indigo-500/30 text-indigo-400" : "border-border text-muted-foreground"}`}
                    >
                      {isPro ? "Pro" : "Free"}
                    </span>
                  </div>
                </div>
              </div>

              {!isPro && (
                <div className="rounded-2xl border border-indigo-500/20 bg-card p-6">
                  <h2 className="text-sm font-semibold text-foreground mb-1">
                    Upgrade to Pro
                  </h2>
                  <p className="text-xs text-muted-foreground mb-5">
                    Everything you need to grow your travel business.
                  </p>
                  <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5 mb-5">
                    <p className="text-3xl font-black text-foreground">
                      ₹999
                      <span className="text-sm font-normal text-muted-foreground">
                        /month
                      </span>
                    </p>
                    <ul className="mt-4 space-y-2">
                      {[
                        "Unlimited AI audits every month",
                        "Full recommendations report",
                        "All 6 growth dimensions",
                        "Competitor benchmarking",
                        "PageSpeed performance data",
                        "Audit history & trend tracking",
                        "Priority support",
                      ].map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={handleUpgrade}
                    disabled={paying}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {paying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Crown className="h-4 w-4" />
                    )}
                    {paying ? "Opening payment…" : "Upgrade to Pro — ₹999/mo"}
                  </button>
                  <p className="text-center text-[11px] text-muted-foreground mt-3">
                    Secure payment via Razorpay · Cancel anytime
                  </p>
                </div>
              )}

              {isPro && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
                  <Crown className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">
                    You&apos;re on Pro!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enjoy unlimited audits and all features.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
