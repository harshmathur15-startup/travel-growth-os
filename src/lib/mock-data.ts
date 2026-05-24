export interface AuditScore {
  overall: number;
  seo: number;
  conversion: number;
  social: number;
  trust: number;
  mobile: number;
  speed: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  impact: string;
  leadImprovement: string;
  effort: "easy" | "medium" | "hard";
  category: string;
  agent: string;
}

export interface Competitor {
  name: string;
  domain: string;
  overallScore: number;
  seoScore: number;
  trafficEstimate: string;
  keywords: number;
  socialFollowers: string;
}

export interface AuditHistory {
  id: string;
  businessName: string;
  url: string;
  date: string;
  overallScore: number;
  status: "completed" | "running" | "failed";
  category: string;
}

export const mockAuditScores: AuditScore = {
  overall: 62,
  seo: 54,
  conversion: 48,
  social: 71,
  trust: 65,
  mobile: 58,
  speed: 43,
};

export const mockRecommendations: Recommendation[] = [
  {
    id: "r1",
    title: "Add WhatsApp Click-to-Chat on Every Page",
    description:
      "Your website has no WhatsApp integration. 78% of Indian travel buyers prefer WhatsApp over email. Adding a floating WhatsApp button could 2x your inquiry rate immediately.",
    priority: "critical",
    impact: "High",
    leadImprovement: "+60–80% inquiries",
    effort: "easy",
    category: "Conversion",
    agent: "AI Conversion Agent",
  },
  {
    id: "r2",
    title: "Fix Missing Meta Descriptions on 14 Pages",
    description:
      "14 of your 18 pages are missing meta descriptions. This directly reduces click-through rate from Google search results by up to 30%.",
    priority: "critical",
    impact: "High",
    leadImprovement: "+25–35% organic traffic",
    effort: "easy",
    category: "SEO",
    agent: "AI SEO Agent",
  },
  {
    id: "r3",
    title: "Add Google Reviews Widget to Homepage",
    description:
      "Your homepage has no social proof. Displaying your Google reviews (currently 4.3★ with 87 reviews) above the fold can increase trust and conversion by 40%.",
    priority: "high",
    impact: "High",
    leadImprovement: "+30–40% conversion",
    effort: "easy",
    category: "Trust",
    agent: "AI Reputation Agent",
  },
  {
    id: "r4",
    title: "Optimize Page Speed — Currently 3.8s Load Time",
    description:
      "Your homepage loads in 3.8 seconds on mobile. 53% of users leave if a page takes more than 3 seconds. Compress images and enable caching to reach under 2s.",
    priority: "high",
    impact: "Medium",
    leadImprovement: "+20% mobile conversions",
    effort: "medium",
    category: "Mobile",
    agent: "AI SEO Agent",
  },
  {
    id: "r5",
    title: "Create Destination-Specific Landing Pages",
    description:
      "You rank for 0 destination keywords. Creating pages for 'Bali honeymoon packages', 'Kerala tour packages' etc. could capture high-intent search traffic.",
    priority: "high",
    impact: "Very High",
    leadImprovement: "+100–150% organic leads",
    effort: "hard",
    category: "SEO",
    agent: "AI SEO Agent",
  },
  {
    id: "r6",
    title: "Post Instagram Reels 3x Per Week",
    description:
      "Your last Instagram post was 18 days ago. Reels get 3x more reach than photos. A consistent posting schedule of 3 reels/week can grow followers by 40% in 90 days.",
    priority: "medium",
    impact: "Medium",
    leadImprovement: "+35% Instagram DMs",
    effort: "medium",
    category: "Social",
    agent: "AI Instagram Agent",
  },
  {
    id: "r7",
    title: "Add Inquiry Form with Budget Qualifier",
    description:
      "Your current contact form collects only name and phone. Adding a budget range and travel date qualifier will pre-qualify leads and improve sales conversion by 25%.",
    priority: "medium",
    impact: "Medium",
    leadImprovement: "+25% qualified leads",
    effort: "easy",
    category: "Conversion",
    agent: "AI Conversion Agent",
  },
  {
    id: "r8",
    title: "Claim and Optimize Google Business Profile",
    description:
      "Your Google Business profile is unclaimed. Claiming it, adding photos, responding to reviews, and posting updates can put you in the Google Maps 3-pack for local searches.",
    priority: "medium",
    impact: "High",
    leadImprovement: "+50% local visibility",
    effort: "easy",
    category: "SEO",
    agent: "AI Reputation Agent",
  },
];

export const mockCompetitors: Competitor[] = [
  {
    name: "Cox & Kings",
    domain: "coxandkings.com",
    overallScore: 89,
    seoScore: 92,
    trafficEstimate: "2.4M/mo",
    keywords: 48200,
    socialFollowers: "890K",
  },
  {
    name: "Thomas Cook India",
    domain: "thomascook.in",
    overallScore: 84,
    seoScore: 87,
    trafficEstimate: "1.8M/mo",
    keywords: 32100,
    socialFollowers: "650K",
  },
  {
    name: "MakeMyTrip",
    domain: "makemytrip.com",
    overallScore: 96,
    seoScore: 98,
    trafficEstimate: "45M/mo",
    keywords: 280000,
    socialFollowers: "4.2M",
  },
  {
    name: "Your Business",
    domain: "yourtravel.com",
    overallScore: 62,
    seoScore: 54,
    trafficEstimate: "4.2K/mo",
    keywords: 87,
    socialFollowers: "3.4K",
  },
];

export const mockAuditHistory: AuditHistory[] = [
  {
    id: "a1",
    businessName: "Wanderlust Travel Co.",
    url: "wanderlusttravel.in",
    date: "2026-05-22",
    overallScore: 62,
    status: "completed",
    category: "Travel Agency",
  },
  {
    id: "a2",
    businessName: "Kerala Dream Holidays",
    url: "keraladream.com",
    date: "2026-05-18",
    overallScore: 74,
    status: "completed",
    category: "Tour Operator",
  },
  {
    id: "a3",
    businessName: "Visa Express India",
    url: "visaexpress.in",
    date: "2026-05-12",
    overallScore: 51,
    status: "completed",
    category: "Visa Consultant",
  },
];

export const mockWeeklyTraffic = [
  { day: "Mon", visitors: 124, leads: 8 },
  { day: "Tue", visitors: 189, leads: 14 },
  { day: "Wed", visitors: 143, leads: 11 },
  { day: "Thu", visitors: 221, leads: 18 },
  { day: "Fri", visitors: 198, leads: 16 },
  { day: "Sat", visitors: 267, leads: 24 },
  { day: "Sun", visitors: 312, leads: 29 },
];

export const mockKeywords = [
  {
    keyword: "honeymoon packages bali",
    position: 34,
    volume: "8,100/mo",
    trend: "up",
  },
  {
    keyword: "kerala tour operator",
    position: 67,
    volume: "5,400/mo",
    trend: "down",
  },
  {
    keyword: "europe tour packages india",
    position: 91,
    volume: "14,800/mo",
    trend: "up",
  },
  {
    keyword: "visa consultant near me",
    position: 23,
    volume: "3,200/mo",
    trend: "up",
  },
  {
    keyword: "cheap flight booking india",
    position: 145,
    volume: "40,500/mo",
    trend: "down",
  },
];

export const aiAgents = [
  {
    id: "seo",
    name: "AI SEO Agent",
    icon: "🔍",
    description:
      "Analyzes keyword gaps, meta tags, backlinks, and content freshness",
    status: "active",
    lastRun: "2 hours ago",
    findings: 14,
    confidence: 94,
    topInsight:
      "You're missing destination-specific landing pages — this is costing you ~300 organic leads/month",
  },
  {
    id: "conversion",
    name: "AI Conversion Agent",
    icon: "⚡",
    description:
      "Audits CTA placement, lead forms, WhatsApp funnels, and booking flow",
    status: "active",
    lastRun: "2 hours ago",
    findings: 9,
    confidence: 91,
    topInsight:
      "No WhatsApp button detected. This single fix could double your inquiry rate.",
  },
  {
    id: "instagram",
    name: "AI Instagram Agent",
    icon: "📸",
    description:
      "Tracks posting frequency, engagement rate, hashtag strategy, and Reels performance",
    status: "active",
    lastRun: "3 hours ago",
    findings: 7,
    confidence: 88,
    topInsight:
      "Last post was 18 days ago. Competitors post 4–6x/week. You're losing 35% potential reach.",
  },
  {
    id: "reputation",
    name: "AI Reputation Agent",
    icon: "⭐",
    description:
      "Monitors Google reviews, response rate, sentiment analysis, and trust signals",
    status: "active",
    lastRun: "4 hours ago",
    findings: 5,
    confidence: 96,
    topInsight:
      "You have 87 Google reviews (4.3★) but none displayed on your website. Add a reviews widget.",
  },
  {
    id: "growth",
    name: "AI Growth Consultant",
    icon: "🚀",
    description:
      "Synthesizes all agent insights into a prioritized 90-day growth roadmap",
    status: "active",
    lastRun: "2 hours ago",
    findings: 3,
    confidence: 89,
    topInsight:
      "Focus on WhatsApp + meta descriptions + Google Business in week 1 — estimated +80% leads in 30 days.",
  },
];
