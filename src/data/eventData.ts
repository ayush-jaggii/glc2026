export interface SpeakerSchema {
  id: string;
  name: string;
  role: string;
  organization: string;
  country: string;
  topic?: string;
  image?: string;
  isRevealed: boolean;
}

export interface PanelSchema {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  keyQuestions: string[];
  isRevealed: boolean;
}

export interface ArchiveItem {
  edition: string;
  year: string;
  theme: string;
  summary: string;
  stats: { label: string; value: string }[];
  highlights: string[];
}

export const EVENT_DETAILS = {
  title: "GLC 2026",
  fullTitle: "Global Leadership Conference 4.0",
  theme: "BUSINESS BEYOND BORDERS",
  tagline: "Navigating Enterprise Strategy & Capital Across Geopolitical Fault Lines",
  date: "OCTOBER 10, 2026",
  day: "Saturday",
  targetDateIso: "2026-10-10T09:30:00+05:30",
  revealTargetIso: "2026-09-15T00:00:00+05:30",
  venue: {
    name: "Dr. Ramdas M. Pai Auditorium",
    institution: "Manipal Academy of Higher Education (MAHE)",
    campus: "Bengaluru Campus",
    address: "Thanisandra Main Rd, Chokkanahalli, Bengaluru, Karnataka 560064",
    city: "Bengaluru, India",
    coordinates: "12.9716° N, 77.5946° E"
  },
  organizer: {
    name: "T. A. PAI MANAGEMENT INSTITUTE (TAPMI)",
    committee: "TAPMI - PACE Committee",
    university: "MAHE, Manipal (An Institution of Eminence)",
  },
  contacts: {
    email: "engage.tapmiblr@manipal.edu",
    leads: [
      { name: "Abhishek Singh", phone: "+91 917 955 5441", role: "PACE Committee Lead" },
      { name: "Johnson P", phone: "+91 960 601 3114", role: "Corporate Relations Lead" }
    ]
  },
  registrationUrl: "https://tapmi.edu.in/glc2026/register",
};

export const THEME_PILLARS = [
  {
    code: "01",
    title: "Geopolitical Friction & Corporate Strategy",
    subtitle: "Sanctions, Tech Decoupling & Supply Networks",
    description: "How multinational enterprises restructure cross-border operations when trade corridors are redefined by sovereign statecraft.",
    icon: "Globe2"
  },
  {
    code: "02",
    title: "Capital Flows Without Borders",
    subtitle: "Global Financial Infrastructure & BFSI Resilience",
    description: "Navigating cross-border capital allocation, currency volatility, sovereign fund moves, and regulatory fragmentation.",
    icon: "TrendingUp"
  },
  {
    code: "03",
    title: "GCCs & The Distributed Enterprise",
    subtitle: "Global Capability Centres Driving Core Innovation",
    description: "Transforming regional GCC hubs from cost efficiency nodes into global strategic decision epicenters.",
    icon: "Cpu"
  },
  {
    code: "04",
    title: "Energy Transitions & Automotive EV Shifts",
    subtitle: "Critical Minerals, EV Chains & Geopolitics",
    description: "Managing supply security for battery minerals, rare earths, and clean-tech manufacturing across shifting trade blocs.",
    icon: "Zap"
  }
];

export const PANELS_PREVIEW: PanelSchema[] = [
  {
    id: "panel-1",
    number: "01",
    title: "Ctrl + Alt + Global",
    category: "Information Technology & GCCs",
    description: "The restructuring of global IT hubs, cloud sovereignty, cross-border data governance, and AI capability centers.",
    keyQuestions: [
      "How do enterprise tech leaders navigate data localization laws across jurisdictions?",
      "What is the future role of Indian GCCs in global architectural decision-making?"
    ],
    isRevealed: false
  },
  {
    id: "panel-2",
    number: "02",
    title: "Aisle Be There",
    category: "FMCG & Consumer Goods",
    description: "Cross-border consumer supply chains, regional sourcing agility, and brand positioning amidst economic nationalism.",
    keyQuestions: [
      "How are global FMCG giants re-engineering supply routes for raw materials?",
      "Local vs. global brand narratives in volatile international markets."
    ],
    isRevealed: false
  },
  {
    id: "panel-3",
    number: "03",
    title: "Capital Without Borders",
    category: "BFSI & Investment Banking",
    description: "Managing international liquidity, sovereign wealth shifts, regulatory fragmentation, and cross-border M&A.",
    keyQuestions: [
      "Where is global capital moving in response to geopolitical realignments?",
      "The impact of digital currency protocols on international settlement."
    ],
    isRevealed: false
  },
  {
    id: "panel-4",
    number: "04",
    title: "Shifting Gears",
    category: "Automotive & Electric Mobility",
    description: "EV battery supply chains, rare-earth mineral geopolitics, and global automotive manufacturing alliances.",
    keyQuestions: [
      "How auto OEMs are mitigating battery mineral supply chain choke points.",
      "Trade tariffs and global market penetration strategies for next-gen mobility."
    ],
    isRevealed: false
  },
  {
    id: "panel-5",
    number: "05",
    title: "Going Viral, Staying Local",
    category: "Media, Marketing & Global Brands",
    description: "Cultural resonance vs. international scale: navigating brand reputation across hyper-sensitive global platforms.",
    keyQuestions: [
      "How global marketing teams balance universal messaging with localized cultural context.",
      "Managing cross-border crisis communications during geopolitical friction."
    ],
    isRevealed: false
  }
];

export const ARCHIVE_EDITIONS: ArchiveItem[] = [
  {
    edition: "GLC 3.0",
    year: "2025",
    theme: "LeadXAI — Strategic Intelligence & Transformation",
    summary: "Explored the strategic integration of artificial intelligence across corporate boardrooms, financial architecture, and workforce design.",
    stats: [
      { label: "C-Suite Keynotes", value: "35+" },
      { label: "Executive Delegates", value: "850+" },
      { label: "GCC Leadership Hubs", value: "20+" }
    ],
    highlights: [
      "Keynotes from Fortune 500 AI Vice Presidents",
      "Executive roundtables on Enterprise AI Governance",
      "TAPMI Business Excellence Awards 2025"
    ]
  },
  {
    edition: "GLC 2.0",
    year: "2024",
    theme: "Lead AI — Shaping the Future Workforce",
    summary: "Gathered global industry leaders to chart organizational agility, human-AI synergy, and emerging digital workforce competencies.",
    stats: [
      { label: "Global Speakers", value: "28" },
      { label: "Participating Companies", value: "60+" },
      { label: "Delegate Satisfaction", value: "98%" }
    ],
    highlights: [
      "CHRO Symposia on Talent Reskilling",
      "Industry-wide GCC capability benchmarks",
      "Networking summits across Tech & BFSI sectors"
    ]
  },
  {
    edition: "GLC 1.0",
    year: "2023",
    theme: "Resilient Leadership in Unpredictable Economies",
    summary: "The inaugural flagship conference establishing TAPMI Bengaluru as a premier nexus for high-level business discourse.",
    stats: [
      { label: "Industry Partners", value: "25+" },
      { label: "Delegates & Leaders", value: "600+" }
    ],
    highlights: [
      "Inaugural address by TAPMI Academic Senate & Industry Deans",
      "Strategic Panels on Supply Chain Resilience"
    ]
  }
];

export const DELEGATE_ADVANTAGES = [
  {
    num: "01",
    title: "C-Suite & Geopolitical Intelligence",
    description: "Direct engagement with global enterprise leaders, GCC heads, and international strategists sharing high-stakes operational frameworks."
  },
  {
    num: "02",
    title: "Cross-Industry Synthesis",
    description: "Insights spanning IT/GCCs, BFSI, FMCG, Automotive/EV, and Media & Marketing — breaking operational silos."
  },
  {
    num: "03",
    title: "Institutional Credibility",
    description: "Hosted by TAPMI Bengaluru (MAHE, Manipal) — an Institution of Eminence renowned for academic rigor and industry partnerships."
  },
  {
    num: "04",
    title: "Executive Networking Nexus",
    description: "Connect with over 1,000+ senior leaders, CXOs, academic fellows, and high-impact management delegates."
  }
];
