"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type CampaignInfo = {
  title: string;
  destination: string;
  description: string | null;
  price_per_person: number | null;
  departure_date: string | null;
  return_date: string | null;
  seats: number;
  niche: string;
  creator_name: string;
  agency_name: string;
};

export default function JoinPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const [info, setInfo] = useState<CampaignInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    travel_month: "",
    budget: "",
    adults: "2",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/creators/join?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setInvalid(true);
        } else {
          setInfo(d);
        }
        setLoading(false);
      })
      .catch(() => {
        setInvalid(true);
        setLoading(false);
      });
  }, [slug]);

  const submit = async () => {
    if (!form.name || !form.phone) return;
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/creators/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tracking_slug: slug,
        ...form,
        adults: parseInt(form.adults),
      }),
    });
    const data = await res.json();
    if (data.ok) {
      setSubmitted(true);
    } else {
      setError(data.error ?? "Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (invalid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center space-y-3">
          <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
          <p className="text-lg font-semibold text-foreground">
            Link not found
          </p>
          <p className="text-sm text-muted-foreground">
            This trip inquiry link is invalid or no longer active.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-cyan-900 px-6 py-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300 mb-2">
          Trip curated by {info?.creator_name}
        </p>
        <h1 className="text-3xl font-bold text-white mb-2">{info?.title}</h1>
        <div className="flex items-center justify-center gap-4 text-sm text-indigo-200 mt-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" /> {info?.destination}
          </span>
          {info?.departure_date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(info.departure_date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" /> {info?.seats} seats
          </span>
        </div>
        {info?.price_per_person && (
          <p className="mt-4 text-2xl font-bold text-white">
            ₹{info.price_per_person.toLocaleString()}
            <span className="text-base font-normal text-indigo-200">
              {" "}
              / person
            </span>
          </p>
        )}
      </div>

      <div className="mx-auto max-w-lg px-4 py-10 space-y-6">
        {info?.description && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {info.description}
            </p>
          </div>
        )}

        {submitted ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
            <p className="text-lg font-bold text-foreground">
              You&apos;re on the list!
            </p>
            <p className="text-sm text-muted-foreground">
              {info?.agency_name} will reach out within 24 hours to confirm your
              spot.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div>
              <p className="text-base font-bold text-foreground">
                Register Your Interest
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Operated by{" "}
                <span className="text-foreground font-medium">
                  {info?.agency_name}
                </span>
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Your Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Arjun Kapoor"
                    className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="9876543210"
                    type="tel"
                    className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    No. of Adults
                  </label>
                  <select
                    value={form.adults}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, adults: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Budget Range
                  </label>
                  <select
                    value={form.budget}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, budget: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="">Select…</option>
                    <option>Under ₹20,000</option>
                    <option>₹20,000–₹40,000</option>
                    <option>₹40,000–₹80,000</option>
                    <option>₹80,000–₹1,50,000</option>
                    <option>Above ₹1,50,000</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Preferred Travel Month
                </label>
                <input
                  value={form.travel_month}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, travel_month: e.target.value }))
                  }
                  placeholder="August 2025"
                  className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {error}
              </p>
            )}

            <button
              onClick={submit}
              disabled={submitting || !form.name || !form.phone}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Book My Spot →"}
            </button>

            <p className="text-[10px] text-center text-muted-foreground/60">
              No payment now · The agency will confirm availability before
              collecting any amount
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
