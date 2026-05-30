"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";

type Lead = { id: string };

type Application = {
  id: string;
  status: "pending" | "approved" | "rejected";
  tracking_slug: string;
  message: string | null;
  created_at: string;
  creator_profiles: {
    name: string;
    instagram_handle: string | null;
    followers_count: number;
  } | null;
  creator_leads: Lead[];
};

type Campaign = {
  id: string;
  title: string;
  destination: string;
  description: string | null;
  price_per_person: number | null;
  departure_date: string | null;
  return_date: string | null;
  seats: number;
  niche: string;
  status: "open" | "closed" | "completed";
  created_at: string;
  campaign_applications: Application[];
};

type OpenCampaign = {
  id: string;
  title: string;
  destination: string;
  description: string | null;
  price_per_person: number | null;
  departure_date: string | null;
  seats: number;
  niche: string;
  businesses: { name: string; city: string } | null;
};

const NICHES = [
  "adventure",
  "luxury",
  "honeymoon",
  "budget",
  "family",
  "solo",
  "wildlife",
  "beach",
];

const nicheColors: Record<string, string> = {
  adventure: "bg-orange-500/10 text-orange-400",
  luxury: "bg-yellow-500/10 text-yellow-400",
  honeymoon: "bg-pink-500/10 text-pink-400",
  budget: "bg-green-500/10 text-green-400",
  family: "bg-blue-500/10 text-blue-400",
  solo: "bg-purple-500/10 text-purple-400",
  wildlife: "bg-emerald-500/10 text-emerald-400",
  beach: "bg-cyan-500/10 text-cyan-400",
};

function StatusBadge({ status }: { status: Application["status"] }) {
  if (status === "approved")
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
        <CheckCircle2 className="h-3 w-3" /> Approved
      </span>
    );
  if (status === "rejected")
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-red-400">
        <XCircle className="h-3 w-3" /> Rejected
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-amber-400">
      <Clock className="h-3 w-3" /> Pending
    </span>
  );
}

function CopyLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const link = `${typeof window !== "undefined" ? window.location.origin : ""}/join/${slug}`;

  const copy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? (
        <Check className="h-3 w-3 text-emerald-400" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}

export default function CreatorsPage() {
  const [tab, setTab] = useState<"agency" | "creator">("agency");

  // Agency state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Creator state
  const [openCampaigns, setOpenCampaigns] = useState<OpenCampaign[]>([]);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState<OpenCampaign | null>(null);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // New campaign form
  const [form, setForm] = useState({
    title: "",
    destination: "",
    description: "",
    price_per_person: "",
    departure_date: "",
    return_date: "",
    seats: "10",
    niche: "adventure",
  });
  const [saving, setSaving] = useState(false);

  // Creator apply form
  const [applyForm, setApplyForm] = useState({
    name: "",
    instagram_handle: "",
    youtube_handle: "",
    followers_count: "",
    niche: [] as string[],
    bio: "",
    message: "",
  });

  const loadCampaigns = useCallback(async () => {
    setLoadingCampaigns(true);
    const res = await fetch("/api/creators/campaigns");
    const data = await res.json();
    const camps: Campaign[] = data.campaigns ?? [];
    setCampaigns(camps);
    setLoadingCampaigns(false);
    return camps;
  }, []);

  const loadOpenCampaigns = useCallback(async () => {
    setLoadingOpen(true);
    const res = await fetch("/api/creators/apply");
    const data = await res.json();
    setOpenCampaigns(data.campaigns ?? []);
    setLoadingOpen(false);
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  useEffect(() => {
    if (tab === "creator") loadOpenCampaigns();
  }, [tab, loadOpenCampaigns]);

  const createCampaign = async () => {
    if (!form.title || !form.destination) return;
    setSaving(true);
    const res = await fetch("/api/creators/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price_per_person: form.price_per_person
          ? parseInt(form.price_per_person)
          : null,
        seats: parseInt(form.seats),
      }),
    });
    setSaving(false);
    if (!res.ok) return;
    setShowNewCampaign(false);
    setForm({
      title: "",
      destination: "",
      description: "",
      price_per_person: "",
      departure_date: "",
      return_date: "",
      seats: "10",
      niche: "adventure",
    });
    loadCampaigns();
  };

  const updateApplicationStatus = async (
    appId: string,
    status: "approved" | "rejected",
  ) => {
    setApprovingId(appId);
    await fetch("/api/creators/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ application_id: appId, status }),
    });
    setApprovingId(null);
    const camps = await loadCampaigns();
    if (selectedCampaign) {
      const updated = camps.find((c) => c.id === selectedCampaign.id);
      if (updated) setSelectedCampaign(updated);
    }
  };

  const [applyError, setApplyError] = useState("");

  const submitApplication = async () => {
    if (!showApplyForm || !applyForm.name || !applyForm.instagram_handle)
      return;
    setApplying(true);
    setApplyError("");
    const res = await fetch("/api/creators/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaign_id: showApplyForm.id,
        ...applyForm,
        followers_count: applyForm.followers_count
          ? parseInt(applyForm.followers_count)
          : 0,
      }),
    });
    setApplying(false);
    if (!res.ok) {
      const data = await res.json();
      setApplyError(
        res.status === 409
          ? "You've already applied to this campaign."
          : (data.error ?? "Something went wrong. Please try again."),
      );
      return;
    }
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setShowApplyForm(null);
    }, 2000);
  };

  const totalLeads = campaigns.reduce(
    (sum, c) =>
      sum +
      c.campaign_applications.reduce((s, a) => s + a.creator_leads.length, 0),
    0,
  );
  const totalCreators = campaigns.reduce(
    (sum, c) =>
      sum +
      c.campaign_applications.filter((a) => a.status === "approved").length,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Creator Hub</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Influencer-led travel sales — track creator → inquiry → booking
            attribution
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab("agency")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${tab === "agency" ? "bg-indigo-500/20 text-indigo-400" : "text-muted-foreground hover:text-foreground"}`}
          >
            Agency View
          </button>
          <button
            onClick={() => setTab("creator")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${tab === "creator" ? "bg-indigo-500/20 text-indigo-400" : "text-muted-foreground hover:text-foreground"}`}
          >
            Creator View
          </button>
        </div>
      </div>

      {/* ─── AGENCY TAB ─── */}
      {tab === "agency" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Active Campaigns",
                value: campaigns.filter((c) => c.status === "open").length,
                icon: TrendingUp,
                color: "text-indigo-400",
              },
              {
                label: "Creators Active",
                value: totalCreators,
                icon: Users,
                color: "text-cyan-400",
              },
              {
                label: "Leads Generated",
                value: totalLeads,
                icon: MapPin,
                color: "text-emerald-400",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-4 w-4 ${color}`} />
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>

          {/* Campaigns list + detail panel */}
          <div className="flex gap-4">
            {/* List */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">
                  Your Campaigns
                </p>
                <button
                  onClick={() => setShowNewCampaign(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-3.5 w-3.5" /> New Campaign
                </button>
              </div>

              {loadingCampaigns ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-20 rounded-2xl bg-muted/30 animate-pulse"
                    />
                  ))}
                </div>
              ) : campaigns.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No campaigns yet.
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Post a trip to find creators who can promote it.
                  </p>
                </div>
              ) : (
                campaigns.map((c) => {
                  const leads = c.campaign_applications.reduce(
                    (s, a) => s + a.creator_leads.length,
                    0,
                  );
                  const approved = c.campaign_applications.filter(
                    (a) => a.status === "approved",
                  ).length;
                  const pending = c.campaign_applications.filter(
                    (a) => a.status === "pending",
                  ).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() =>
                        setSelectedCampaign(
                          selectedCampaign?.id === c.id ? null : c,
                        )
                      }
                      className={`w-full text-left rounded-2xl border p-4 transition-colors ${selectedCampaign?.id === c.id ? "border-indigo-500/40 bg-indigo-500/5" : "border-border bg-card hover:border-indigo-500/20"}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${nicheColors[c.niche] ?? "bg-muted text-muted-foreground"}`}
                            >
                              {c.niche}
                            </span>
                            <span
                              className={`text-[10px] font-medium ${c.status === "open" ? "text-emerald-400" : "text-muted-foreground"}`}
                            >
                              {c.status}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-foreground">
                            {c.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {c.destination}
                          </p>
                        </div>
                        <ChevronRight
                          className={`h-4 w-4 text-muted-foreground/50 transition-transform ${selectedCampaign?.id === c.id ? "rotate-90" : ""}`}
                        />
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{approved} creators</span>
                        {pending > 0 && (
                          <span className="text-amber-400">
                            {pending} pending
                          </span>
                        )}
                        <span className="text-emerald-400">{leads} leads</span>
                        {c.departure_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(c.departure_date).toLocaleDateString(
                              "en-IN",
                              { day: "numeric", month: "short" },
                            )}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Detail panel */}
            {selectedCampaign && (
              <div className="w-80 shrink-0 rounded-2xl border border-border bg-card p-4 self-start space-y-4">
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {selectedCampaign.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedCampaign.destination}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedCampaign.price_per_person && (
                    <div className="rounded-lg bg-muted/30 px-2 py-1.5">
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-semibold text-foreground">
                        ₹{selectedCampaign.price_per_person.toLocaleString()}
                      </p>
                    </div>
                  )}
                  <div className="rounded-lg bg-muted/30 px-2 py-1.5">
                    <p className="text-muted-foreground">Seats</p>
                    <p className="font-semibold text-foreground">
                      {selectedCampaign.seats}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">
                    Creator Applications
                  </p>
                  {selectedCampaign.campaign_applications.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No applications yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedCampaign.campaign_applications.map((app) => (
                        <div
                          key={app.id}
                          className="rounded-xl border border-border p-3 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-semibold text-foreground">
                                {app.creator_profiles?.name ?? "Creator"}
                              </p>
                              {app.creator_profiles?.instagram_handle && (
                                <p className="text-[10px] text-muted-foreground">
                                  @{app.creator_profiles.instagram_handle} ·{" "}
                                  {(
                                    app.creator_profiles.followers_count / 1000
                                  ).toFixed(0)}
                                  K followers
                                </p>
                              )}
                            </div>
                            <StatusBadge status={app.status} />
                          </div>

                          {app.status === "approved" && (
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-emerald-400">
                                {app.creator_leads.length} leads
                              </span>
                              <CopyLink slug={app.tracking_slug} />
                            </div>
                          )}

                          {app.status === "pending" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  updateApplicationStatus(app.id, "approved")
                                }
                                disabled={approvingId === app.id}
                                className="flex-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold py-1 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  updateApplicationStatus(app.id, "rejected")
                                }
                                disabled={approvingId === app.id}
                                className="flex-1 rounded-lg bg-red-500/10 text-red-400 text-[11px] font-semibold py-1 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* New Campaign Modal */}
          {showNewCampaign && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-foreground">
                    New Creator Campaign
                  </p>
                  <button
                    onClick={() => setShowNewCampaign(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      key: "title",
                      label: "Campaign Title",
                      placeholder: "Spiti Expedition with @wanderer",
                    },
                    {
                      key: "destination",
                      label: "Destination",
                      placeholder: "Spiti Valley, Himachal Pradesh",
                    },
                    {
                      key: "description",
                      label: "Description",
                      placeholder:
                        "8-day road trip through the highest passes…",
                    },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        {label}
                      </label>
                      {key === "description" ? (
                        <textarea
                          value={form[key as keyof typeof form]}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, [key]: e.target.value }))
                          }
                          placeholder={placeholder}
                          rows={2}
                          className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                        />
                      ) : (
                        <input
                          value={form[key as keyof typeof form]}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, [key]: e.target.value }))
                          }
                          placeholder={placeholder}
                          className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      )}
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Price / person (₹)
                      </label>
                      <input
                        type="number"
                        value={form.price_per_person}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            price_per_person: e.target.value,
                          }))
                        }
                        placeholder="24999"
                        className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Seats
                      </label>
                      <input
                        type="number"
                        value={form.seats}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, seats: e.target.value }))
                        }
                        className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Departure
                      </label>
                      <input
                        type="date"
                        value={form.departure_date}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            departure_date: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Return
                      </label>
                      <input
                        type="date"
                        value={form.return_date}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            return_date: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Niche
                    </label>
                    <select
                      value={form.niche}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, niche: e.target.value }))
                      }
                      className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      {NICHES.map((n) => (
                        <option key={n} value={n}>
                          {n.charAt(0).toUpperCase() + n.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setShowNewCampaign(false)}
                    className="flex-1 rounded-xl border border-border py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createCampaign}
                    disabled={saving || !form.title || !form.destination}
                    className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {saving ? "Posting…" : "Post Campaign"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── CREATOR TAB ─── */}
      {tab === "creator" && (
        <>
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 text-sm text-indigo-300">
            You&apos;re browsing as a creator. Apply to campaigns that match
            your audience — once approved, you get a unique tracking link to
            share.
          </div>

          {loadingOpen ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-40 rounded-2xl bg-muted/30 animate-pulse"
                />
              ))}
            </div>
          ) : openCampaigns.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No open campaigns right now.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {openCampaigns.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-border bg-card p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${nicheColors[c.niche] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {c.niche}
                      </span>
                      <p className="text-sm font-semibold text-foreground mt-1">
                        {c.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.destination}
                      </p>
                    </div>
                    {c.price_per_person && (
                      <p className="text-sm font-bold text-indigo-400">
                        ₹{c.price_per_person.toLocaleString()}
                      </p>
                    )}
                  </div>
                  {c.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {c.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {c.departure_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(c.departure_date).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {c.seats} seats
                    </span>
                    {c.businesses?.name && <span>{c.businesses.name}</span>}
                  </div>
                  <button
                    onClick={() => setShowApplyForm(c)}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                  >
                    Apply as Creator
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Apply Modal */}
          {showApplyForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-bold text-foreground">
                      Apply to Campaign
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {showApplyForm.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowApplyForm(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                {applySuccess ? (
                  <div className="py-8 text-center space-y-2">
                    <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                    <p className="text-sm font-semibold text-foreground">
                      Application submitted!
                    </p>
                    <p className="text-xs text-muted-foreground">
                      The agency will review and approve you shortly.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      {
                        key: "name",
                        label: "Your Name",
                        placeholder: "Rhea Sharma",
                      },
                      {
                        key: "instagram_handle",
                        label: "Instagram Handle *",
                        placeholder: "wanderwithrhea",
                      },
                      {
                        key: "youtube_handle",
                        label: "YouTube Channel",
                        placeholder: "WanderWithRhea",
                      },
                      {
                        key: "followers_count",
                        label: "Total Followers",
                        placeholder: "45000",
                        type: "number",
                      },
                      {
                        key: "bio",
                        label: "Bio / Pitch",
                        placeholder:
                          "I create adventure travel content for 25-35 age group…",
                      },
                      {
                        key: "message",
                        label: "Message to Agency",
                        placeholder: "Why do you want to promote this trip?",
                      },
                    ].map(({ key, label, placeholder, type }) => (
                      <div key={key}>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          {label}
                        </label>
                        {key === "bio" || key === "message" ? (
                          <textarea
                            value={
                              applyForm[key as keyof typeof applyForm] as string
                            }
                            onChange={(e) =>
                              setApplyForm((f) => ({
                                ...f,
                                [key]: e.target.value,
                              }))
                            }
                            placeholder={placeholder}
                            rows={2}
                            className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                          />
                        ) : (
                          <input
                            type={type ?? "text"}
                            value={
                              applyForm[key as keyof typeof applyForm] as string
                            }
                            onChange={(e) =>
                              setApplyForm((f) => ({
                                ...f,
                                [key]: e.target.value,
                              }))
                            }
                            placeholder={placeholder}
                            className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                          />
                        )}
                      </div>
                    ))}

                    {applyError && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <XCircle className="h-3 w-3 shrink-0" /> {applyError}
                      </p>
                    )}
                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={() => setShowApplyForm(null)}
                        className="flex-1 rounded-xl border border-border py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={submitApplication}
                        disabled={
                          applying ||
                          !applyForm.name ||
                          !applyForm.instagram_handle
                        }
                        className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {applying ? "Submitting…" : "Submit Application"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
