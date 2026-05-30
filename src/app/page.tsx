import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
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
  Users,
  ChevronRight,
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

const industries = [
  { icon: "✈️", label: "Travel Agencies" },
  { icon: "🏔️", label: "Tour Operators" },
  { icon: "📋", label: "Visa Consultants" },
  { icon: "💍", label: "Honeymoon Planners" },
  { icon: "🕌", label: "Pilgrimage Operators" },
  { icon: "🧗", label: "Adventure Travel" },
  { icon: "🌍", label: "Destination Experts" },
  { icon: "🏨", label: "DMCs" },
];

const results = [
  {
    stat: "+180%",
    label: "Average lead increase",
    sub: "across 2,400+ businesses in 90 days",
  },
  {
    stat: "9 min",
    label: "First audit result",
    sub: "from sign-up to full growth score",
  },
  {
    stat: "23",
    label: "Issues found on average",
    sub: "per website audit — most fixable in a day",
  },
  {
    stat: "₹0",
    label: "To get started",
    sub: "Free plan — no credit card required",
  },
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
      "3 audits per month",
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

export default function HomePage() {
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
            {["Features", "Pricing", "Industries"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <SignedOut>
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
                Free Audit
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Go to Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-24">
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-indigo-500/8 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-32 h-64 w-64 rounded-full bg-cyan-500/8 blur-[80px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-400">
              <Zap className="h-3 w-3" />
              AI-powered growth for Indian travel businesses
            </div>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl">
              AI Growth Engine for
              <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Travel Businesses
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              5 specialised AI agents audit your website, Instagram, Google
              Business, and competitors — then hand you an exact 90-day plan to
              double your leads.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-7 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20"
              >
                <Zap className="h-4 w-4" />
                Get Free AI Audit
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl border border-border px-7 py-3.5 text-base font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                View Sample Dashboard
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Takes 9 minutes · No credit card required · 2,400+ travel
              businesses growing
            </p>
          </div>

          {/* Dashboard preview */}
          <div className="mt-16 mx-auto max-w-4xl">
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
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-y border-white/5 bg-white/[0.02] py-6">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground sm:gap-10">
            {[
              "2,400+ travel businesses",
              "₹0 to start",
              "9-min first audit",
              "5 AI agents",
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

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
              How It Works
            </p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              From sign-up to growth plan in 9 minutes
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Enter your business details",
                desc: "Add your website URL, Instagram, Google Business profile, and category. Takes 60 seconds.",
                icon: Globe,
                color: "from-indigo-500 to-indigo-600",
              },
              {
                step: "02",
                title: "5 AI agents run your audit",
                desc: "SEO, Conversion, Instagram, Reputation, and Growth agents scan 40+ data points simultaneously.",
                icon: Bot,
                color: "from-violet-500 to-indigo-500",
              },
              {
                step: "03",
                title: "Get your growth roadmap",
                desc: "Receive a prioritised action plan with exact fixes, expected lead impact, and 90-day schedule.",
                icon: TrendingUp,
                color: "from-cyan-500 to-indigo-500",
              },
            ].map(({ step, title, desc, icon: Icon, color }) => (
              <div
                key={step}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-xs font-bold text-indigo-400 mb-2">
                  STEP {step}
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

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
              Features
            </p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Everything your travel business needs to grow
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Built specifically for Indian travel agencies, tour operators, and
              consultants — not a generic SEO tool.
            </p>
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

      {/* Industries */}
      <section id="industries" className="py-20 px-6 bg-card/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
              Industries
            </p>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Built for every corner of travel
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {industries.map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3 hover:border-indigo-500/30 transition-colors"
              >
                <span className="text-xl">{icon}</span>
                <span className="text-sm font-medium text-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
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
                className={`relative rounded-2xl border p-6 ${
                  plan.highlight
                    ? "border-indigo-500/50 bg-gradient-to-b from-indigo-500/10 to-card shadow-lg shadow-indigo-500/10"
                    : "border-border bg-card"
                }`}
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
                  className={`flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition-opacity ${
                    plan.highlight
                      ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:opacity-90"
                      : "border border-border text-foreground hover:bg-muted/50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 p-12">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/30">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Ready to grow your
              <br />
              travel business?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join 2,400+ travel businesses getting smarter with AI.
              <br />
              First audit is completely free.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20"
              >
                <Zap className="h-4 w-4" />
                Get Free AI Audit
              </Link>
              <Link
                href="/auth/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Already have an account? Sign in →
              </Link>
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
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Contact", href: "/auth/signup" },
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
              <Users className="h-3.5 w-3.5" />
              Built for Indian travel businesses · 2026
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
