import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  TrendingUp,
  Zap,
  Search,
  BarChart3,
  Star,
  CheckCircle2,
  ArrowRight,
  Bot,
  Globe,
  MessageCircle,
  Shield,
  Smartphone,
  FileText,
  ChevronRight,
  Sparkles,
  IndianRupee,
  Camera,
  Building2,
} from "lucide-react";

function ScoreRingSmall({
  score,
  label,
  color,
}: {
  score: number;
  label: string;
  color: string;
}) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: 56, height: 56 }}>
        <svg width={56} height={56} className="-rotate-90">
          <circle
            cx={28}
            cy={28}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={5}
            className="text-white/10"
          />
          <circle
            cx={28}
            cy={28}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={5}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white">{score}</span>
        </div>
      </div>
      <span className="text-[10px] text-white/50 text-center">{label}</span>
    </div>
  );
}

const features = [
  {
    icon: Search,
    title: "SEO Audit & Keyword Gap",
    desc: "Find exactly which keywords your competitors rank for that you don't. Get a page-by-page fix list.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Zap,
    title: "Conversion Rate Optimisation",
    desc: "AI scans every CTA, lead form, and WhatsApp button. Tells you what's killing your inquiries.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Bot,
    title: "5 Specialised AI Agents",
    desc: "SEO, Conversion, Instagram, Reputation, and Growth agents working in parallel — every audit.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: BarChart3,
    title: "Competitor Benchmarking",
    desc: "Compare your growth score against top travel agencies. Know exactly what gap you need to close.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Funnel Analysis",
    desc: "78% of Indian travel buyers prefer WhatsApp. We audit your entire inquiry-to-booking flow.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: Star,
    title: "Review & Reputation Tracking",
    desc: "Monitor Google, TripAdvisor, and MakeMyTrip reviews. Get alerts when competitors pull ahead.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Smartphone,
    title: "Mobile UX Scoring",
    desc: "Over 70% of travel searches happen on mobile. We score your mobile experience against benchmarks.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    icon: Globe,
    title: "Instagram Growth Intelligence",
    desc: "Track posting frequency, engagement rate, Reels performance, and hashtag effectiveness.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    icon: FileText,
    title: "90-Day Growth Roadmap",
    desc: "Every audit ends with a prioritised action plan. Week 1, Week 2, Month 2 — all mapped out.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Shield,
    title: "Branded PDF Reports",
    desc: "Generate white-labelled reports to share with clients or stakeholders in one click.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
];

const results = [
  {
    stat: "500+",
    label: "Travel Agencies",
    sub: "growing with creator-led leads",
  },
  {
    stat: "1,200+",
    label: "Creator Applications",
    sub: "across 60+ destinations",
  },
  { stat: "₹0", label: "Ad Spend Needed", sub: "creators bring the audience" },
  { stat: "3×", label: "Higher Conversion", sub: "vs traditional lead gen" },
];

const testimonials = [
  {
    name: "Rajesh Mehta",
    role: "Founder, Wanderlust Travel Co.",
    city: "Mumbai",
    quote:
      "GrowthOS found 23 issues in our website I didn't even know existed. Within 6 weeks we doubled our WhatsApp inquiries.",
    score: 62,
    after: 84,
  },
  {
    name: "Priya Nair",
    role: "Owner, Kerala Dream Holidays",
    city: "Kochi",
    quote:
      "The competitor analysis alone was worth it. I could see exactly what Cox & Kings were doing that we weren't. Game changer.",
    score: 51,
    after: 74,
  },
  {
    name: "Amit Sharma",
    role: "Director, Himalayan Escapes",
    city: "Delhi",
    quote:
      "Got my first audit done in 9 minutes. The AI roadmap was more specific than any consultant I'd paid ₹50,000 for.",
    score: 45,
    after: 71,
  },
];

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    desc: "Try your first audit free",
    features: [
      "10 audits per month",
      "Basic growth score",
      "Top 5 recommendations",
      "Competitor snapshot",
      "Email support",
    ],
    cta: "Start Free",
    href: "/auth/signup",
    highlight: false,
    badge: null,
  },
  {
    name: "Pro",
    price: "₹2,999",
    period: "/month",
    desc: "For serious travel businesses",
    features: [
      "Unlimited audits",
      "All 5 AI agents",
      "Full recommendations",
      "Competitor tracking",
      "Branded PDF reports",
      "Priority support",
      "90-day roadmap",
    ],
    cta: "Start Pro Trial",
    href: "/auth/signup",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Agency",
    price: "₹7,999",
    period: "/month",
    desc: "For agencies managing multiple clients",
    features: [
      "Everything in Pro",
      "10 business profiles",
      "White-label reports",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    href: "/auth/signup",
    highlight: false,
    badge: null,
  },
];

const creatorExamples = [
  {
    handle: "@wanderwithrhea",
    dest: "Spiti Expedition",
    price: "₹24,999",
    seats: 30,
    filled: 18,
    niche: "Adventure",
  },
  {
    handle: "@luxe.with.ankit",
    dest: "Maldives Escape",
    price: "₹89,999",
    seats: 12,
    filled: 9,
    niche: "Luxury",
  },
  {
    handle: "@backpackbynisha",
    dest: "Egypt Explorer",
    price: "₹54,999",
    seats: 20,
    filled: 14,
    niche: "Budget",
  },
];

export default async function HomePage() {
  const { userId } = await auth();
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-foreground">
              GrowthOS<span className="text-indigo-400">.travel</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#for-agencies"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              For Agencies
            </a>
            <a
              href="#for-creators"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              For Creators
            </a>
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {userId ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Go to Dashboard <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hidden text-sm font-medium text-muted-foreground hover:text-foreground transition-colors sm:block"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  Join Free <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-20">
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-indigo-500/8 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-32 h-64 w-64 rounded-full bg-cyan-500/8 blur-[80px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-400">
              <Sparkles className="h-3 w-3" />
              AI growth platform for Indian travel businesses
            </div>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl">
              Grow Your Travel Business.
              <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Without Burning on Ads.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Two growth engines in one platform — an AI audit that fixes
              what&apos;s killing your bookings, and a creator network that
              brings inbound leads to your doorstep.
            </p>
            <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                Agencies: more bookings, zero ad spend
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-pink-400 shrink-0" />
                Creators: earn commission promoting trips you love
              </span>
            </div>
            <p className="mt-6 text-sm font-medium text-muted-foreground">
              I am a…
            </p>

            {/* Dual CTA */}
            <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="#for-agencies"
                className="flex items-center gap-2.5 rounded-2xl border-2 border-indigo-500/40 bg-indigo-500/10 px-8 py-4 text-base font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/60 transition-all group"
              >
                <Building2 className="h-5 w-5" />
                <div className="text-left">
                  <p className="text-sm font-bold text-indigo-300">
                    I&apos;m a Travel Agency
                  </p>
                  <p className="text-[11px] text-indigo-400/70 font-normal">
                    Find creators, get bookings
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#for-creators"
                className="flex items-center gap-2.5 rounded-2xl border-2 border-pink-500/40 bg-pink-500/10 px-8 py-4 text-base font-semibold text-pink-300 hover:bg-pink-500/20 hover:border-pink-500/60 transition-all group"
              >
                <Camera className="h-5 w-5" />
                <div className="text-left">
                  <p className="text-sm font-bold text-pink-300">
                    I&apos;m a Creator
                  </p>
                  <p className="text-[11px] text-pink-400/70 font-normal">
                    Monetise your travel audience
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Live trips preview */}
          <div className="mt-14 mx-auto max-w-4xl">
            <p className="text-center text-xs text-muted-foreground mb-4 uppercase tracking-widest">
              Live creator trips · Open for bookings
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {creatorExamples.map((t) => (
                <div
                  key={t.handle}
                  className="rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-transparent p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-indigo-400">
                      {t.handle}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${t.niche === "Adventure" ? "bg-orange-500/10 text-orange-400" : t.niche === "Luxury" ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"}`}
                    >
                      {t.niche}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground mb-1">
                    {t.dest}
                  </p>
                  <p className="text-lg font-extrabold text-indigo-400 mb-3">
                    {t.price}
                    <span className="text-xs font-normal text-muted-foreground">
                      {" "}
                      /person
                    </span>
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>
                        {t.filled} of {t.seats} seats filled
                      </span>
                      <span className="text-emerald-400">
                        {t.seats - t.filled} left
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                        style={{ width: `${(t.filled / t.seats) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-y border-white/5 bg-white/[0.02] py-5">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground sm:gap-10">
            {[
              "500+ travel agencies",
              "1,200+ creator applications",
              "60+ destinations",
              "₹0 ad spend needed",
              "Made for India",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOR AGENCIES ─── */}
      <section id="for-agencies" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                <Building2 className="h-3 w-3" /> For Travel Agencies
              </div>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-5">
                Stop paying for ads.
                <br />
                <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  Let creators bring the leads.
                </span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Post your packages once. Creators with real audiences —
                adventure travellers, honeymoon planners, luxury seekers — apply
                to promote them. You approve, they share, travellers book. You
                pay only when it works.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Post packages in 2 minutes — destination, dates, seats, price",
                  "AI matches you with creators who have the right audience",
                  "Each creator gets a unique tracking link — you see exactly who brought which booking",
                  "No more Meta ads, Google ads, or cold outreach",
                  "Full dashboard: creator → clicks → leads → bookings",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/auth/signup"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Building2 className="h-4 w-4" />
                  Register as Travel Agency
                </Link>
                <Link
                  href="/creators"
                  className="flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  See Creator Hub <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Agency mockup */}
            <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/60 to-card/80 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-foreground">
                  Campaign: Spiti Expedition
                </p>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5">
                  ● Open
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Creators Applied", value: "8" },
                  { label: "Leads Generated", value: "47" },
                  { label: "Bookings", value: "12" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl bg-white/[0.04] p-3 text-center"
                  >
                    <p className="text-xl font-bold text-foreground">{value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Top Creators
                </p>
                {[
                  {
                    name: "@wanderwithrhea",
                    followers: "45K",
                    leads: 19,
                    status: "approved",
                  },
                  {
                    name: "@hillsandtrails",
                    followers: "28K",
                    leads: 14,
                    status: "approved",
                  },
                  {
                    name: "@trekwithvivek",
                    followers: "12K",
                    leads: 0,
                    status: "pending",
                  },
                ].map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {c.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {c.followers} followers
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {c.leads > 0 && (
                        <span className="text-xs text-emerald-400">
                          {c.leads} leads
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${c.status === "approved" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}
                      >
                        {c.status === "approved" ? "Active" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOR CREATORS ─── */}
      <section
        id="for-creators"
        className="py-24 px-6 bg-gradient-to-b from-pink-950/10 to-transparent"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Creator mockup */}
            <div className="rounded-2xl border border-pink-500/20 bg-gradient-to-b from-pink-950/40 to-card/80 p-5 backdrop-blur-sm order-2 lg:order-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-indigo-500 text-xs font-bold text-white">
                  R
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    @wanderwithrhea
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    45K followers · Adventure & Offbeat
                  </p>
                </div>
                <span className="ml-auto rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5">
                  Verified
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Trips Promoted", value: "4" },
                  { label: "Leads Sent", value: "134" },
                  { label: "Earned", value: "₹24K" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl bg-white/[0.04] p-3 text-center"
                  >
                    <p className="text-xl font-bold text-foreground">{value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Open Campaigns For You
                </p>
                {[
                  {
                    title: "Spiti Expedition",
                    agency: "Himalayan Escapes",
                    price: "₹24,999",
                    seats: 8,
                  },
                  {
                    title: "Ladakh Road Trip",
                    agency: "Adventure India",
                    price: "₹32,999",
                    seats: 12,
                  },
                ].map((camp) => (
                  <div
                    key={camp.title}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
                  >
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {camp.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {camp.agency} · {camp.seats} seats left
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-400">
                        {camp.price}
                      </span>
                      <span className="rounded-lg bg-pink-500/10 text-pink-400 text-[10px] px-2 py-0.5 font-medium">
                        Apply
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-medium text-pink-400">
                <Camera className="h-3 w-3" /> For Travel Creators
              </div>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-5">
                Your audience trusts you.
                <br />
                <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  Turn that into income.
                </span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Stop doing barter stays and DM outreach. Browse curated trip
                packages from verified Indian travel agencies. Apply to promote
                the ones that match your niche. Get a unique link, share it —
                earn commission on every booking.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Browse packages matched to your audience niche (adventure, luxury, honeymoon…)",
                  "Apply to campaigns in 2 minutes — no lengthy contracts",
                  "Your unique tracking link shows exactly how many leads you generated",
                  "Get paid commission per confirmed booking",
                  "No manual follow-ups — the agency handles all operations",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/auth/signup"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Camera className="h-4 w-4" />
                  Join as a Creator
                </Link>
                <Link
                  href="/creators"
                  className="flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  Browse Campaigns <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 border-y border-white/5 bg-white/[0.01]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
              How It Works
            </p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Three sides. One platform.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                emoji: "🏢",
                who: "Travel Agency",
                step: "01",
                title: "Post your package",
                desc: "Add destination, dates, seats, price, and niche. Takes 2 minutes. Creators see it instantly.",
                color: "from-indigo-500 to-cyan-500",
              },
              {
                emoji: "📱",
                who: "Creator",
                step: "02",
                title: "Apply & get your link",
                desc: "Creators browse packages that match their audience, apply, and get a unique shareable tracking URL on approval.",
                color: "from-pink-500 to-indigo-500",
              },
              {
                emoji: "✈️",
                who: "Traveler",
                step: "03",
                title: "Book via the creator",
                desc: "Travelers find the trip through the creator's content, click the link, fill an inquiry. Agency closes the booking.",
                color: "from-cyan-500 to-emerald-500",
              },
            ].map(({ emoji, who, step, title, desc, color }) => (
              <div
                key={step}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-xl`}
                >
                  {emoji}
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  Step {step} · {who}
                </p>
                <h3 className="text-base font-bold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-center">
            <p className="text-sm text-indigo-300">
              <span className="font-bold">Attribution layer:</span> Every
              booking is tracked back to the exact creator — so agencies know
              their CAC, ROAS, and which creator sells which destination.
            </p>
          </div>
        </div>
      </section>

      {/* Results stats */}
      <section className="py-16 px-6 bg-gradient-to-b from-indigo-950/20 to-transparent">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {results.map(({ stat, label, sub }) => (
              <div
                key={label}
                className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 text-center"
              >
                <p className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat}
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Growth tools section */}
      <section id="features" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
              Growth Tools
            </p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Also included: AI audit for agencies
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Not just a marketplace. Every agency gets a full AI growth audit —
              SEO, conversion, competitors, WhatsApp funnel and more.
            </p>
          </div>
          {/* Dashboard preview */}
          <div className="mb-14 mx-auto max-w-4xl">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-indigo-950/80 to-background/60 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                  <span className="ml-3 text-xs text-white/30">
                    growthos.travel/dashboard
                  </span>
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                  ● Live
                </span>
              </div>
              <div className="mb-6 flex flex-wrap justify-center gap-6 sm:gap-10">
                <ScoreRingSmall score={62} label="Overall" color="#f59e0b" />
                <ScoreRingSmall score={54} label="SEO" color="#ef4444" />
                <ScoreRingSmall score={48} label="Conversion" color="#ef4444" />
                <ScoreRingSmall score={71} label="Social" color="#f59e0b" />
                <ScoreRingSmall score={65} label="Trust" color="#f59e0b" />
                <ScoreRingSmall score={58} label="Mobile" color="#f59e0b" />
                <ScoreRingSmall score={43} label="Speed" color="#ef4444" />
              </div>
              <div className="space-y-2">
                {[
                  {
                    tag: "CRITICAL",
                    title: "Add WhatsApp Click-to-Chat on Every Page",
                    impact: "+60–80% inquiries",
                    color: "bg-red-500/10 text-red-400 border-red-500/20",
                  },
                  {
                    tag: "HIGH",
                    title: "Fix Missing Meta Descriptions on 14 Pages",
                    impact: "+25–35% organic traffic",
                    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                  },
                  {
                    tag: "HIGH",
                    title: "Add Google Reviews Widget to Homepage",
                    impact: "+30–40% conversion",
                    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                  },
                ].map((r) => (
                  <div
                    key={r.title}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
                  >
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${r.color}`}
                    >
                      {r.tag}
                    </span>
                    <span className="flex-1 text-xs text-white/70">
                      {r.title}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400">
                      {r.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc, color, bg }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-5 hover:border-indigo-500/30 transition-colors"
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}
                >
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-card/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
              Results
            </p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Travel businesses growing with GrowthOS
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map(({ name, role, city, quote, score, after }) => (
              <div
                key={name}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-5">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-xs font-bold text-white">
                      {name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {role} · {city}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">Score</p>
                    <p className="text-xs font-bold text-emerald-400">
                      {score} → {after}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="py-24 px-6 bg-gradient-to-b from-indigo-950/20 to-transparent"
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
              Pricing
            </p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Start free. Grow with confidence.
            </h2>
            <p className="mt-4 text-muted-foreground">
              No contracts. Cancel anytime.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-6 ${plan.highlight ? "border-indigo-500/50 bg-gradient-to-b from-indigo-500/10 to-card shadow-lg shadow-indigo-500/10" : "border-border bg-card"}`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-3 py-1 text-[10px] font-bold text-white">
                    {plan.badge}
                  </span>
                )}
                <p className="text-sm font-bold text-foreground">{plan.name}</p>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-3xl font-extrabold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground mb-1">
                    {plan.period}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground mb-5">
                  {plan.desc}
                </p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition-opacity ${plan.highlight ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:opacity-90" : "border border-border text-foreground hover:bg-muted/50"}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual CTA footer section */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-cyan-500/5 p-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Travel Agencies
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Post packages. Approve creators. Get bookings — without a single
                rupee in ads.
              </p>
              <Link
                href="/auth/signup"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Register Your Agency <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Free to start · No credit card
              </p>
            </div>

            <div className="rounded-3xl border border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-indigo-500/5 p-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-indigo-500">
                  <Camera className="h-7 w-7 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Travel Creators
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Apply to campaigns that fit your audience. Share your link. Earn
                commission on every booking you drive.
              </p>
              <Link
                href="/auth/signup"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Join as Creator <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Free forever · Earn per booking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500">
                <TrendingUp className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-foreground">
                GrowthOS<span className="text-indigo-400">.travel</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              {[
                { label: "For Agencies", href: "#for-agencies" },
                { label: "For Creators", href: "#for-creators" },
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="hover:text-foreground transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <IndianRupee className="h-3.5 w-3.5" />
              Built for Indian travel · 2026
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
