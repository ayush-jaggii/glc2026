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
  topic: string;
  subtitle: string;
  image: string;
  description: string;
  keyQuestions: string[];
  isRevealed: boolean;
}

export interface ArchiveEdition {
  edition: string;
  year: string;
  theme: string;
  tagline: string;
  summary: string;
  stats: { label: string; value: string }[];
  highlights: string[];
}

export const EVENT_DETAILS = {
  title: "GLC 2026",
  fullTitle: "Global Leadership Conference 4.0",
  colloquiumTitle: "A GLOBAL LEADERSHIP COLLOQUIUM",
  theme: "BUSINESS BEYOND BORDERS",
  tagline: "Different Perspectives. A Brighter Tomorrow.",
  subtext: "Navigating Enterprise Strategy, Geopolitics & Capital Convergence",
  date: "OCTOBER 10, 2026",
  day: "Saturday",
  time: "9:00 AM ONWARDS",
  targetDateIso: "2026-10-10T09:00:00+05:30",
  speakerRevealDateIso: "2026-09-20T00:00:00+05:30",
  venue: {
    name: "Dr. Ramdas M. Pai Auditorium",
    institution: "Manipal Academy of Higher Education (MAHE)",
    campus: "Bengaluru Campus",
    address: "Thanisandra Main Rd, Chokkanahalli, Bengaluru, Karnataka 560064",
    city: "Bengaluru, India",
  },
  organizer: {
    institution: "T. A. PAI MANAGEMENT INSTITUTE (TAPMI)",
    campus: "Bengaluru Campus",
    committee: "TAPMI - PACE Committee",
    parentUniversity: "Manipal Academy of Higher Education (MAHE)",
    accreditations: ["AACSB Accredited", "AMBA Accredited", "NBA Accredited", "Institution of Eminence"],
  },
  contacts: {
    email: "engage.tapmiblr@manipal.edu",
    leads: [
      { name: "Johnson P", phone: "+91 960 601 3114", role: "Corporate Relations & PACE Lead" },
    ],
  },
  registrationSheetId: "1ZS0-TQlBPyBjTMQqOM11M2Yi2lpbiA6RPd0U_PUEtH0",
  youtubeVideoId: "sGkYVVQqLQQ", // Official GLC Recap Video
};

export const PANELS_LIST: PanelSchema[] = [
  {
    id: "panel-1",
    number: "01",
    title: "Ctrl + Alt + Global",
    category: "Information Technology (IT)",
    topic: "Enterprise Tech Decoupling, AI Governance & Sovereign Cloud Infrastructure",
    subtitle: "Cross-Border Digital Architecture & Enterprise Scaling",
    image: "/panels/it-gcc.jpg",
    description: "The restructuring of multinational IT architectures, data sovereignty boundaries, and cross-border AI governance frameworks.",
    keyQuestions: [
      "Navigating cross-border data localization and ethical AI governance.",
      "From infrastructure cost centers to strategic platforms: Driving borderless tech innovation."
    ],
    isRevealed: false,
  },
  {
    id: "panel-2",
    number: "02",
    title: "Aisle Be There",
    category: "Retail & FMCG",
    topic: "Global Supply Networks, Sourcing Agility & Borderless Consumer Resonance",
    subtitle: "Cross-Border FMCG Value Chains & Consumer Demographics",
    image: "/panels/fmcg-retail.jpg",
    description: "Cross-border consumer supply chains, regional sourcing agility, and brand positioning amidst economic nationalism and changing retail landscapes.",
    keyQuestions: [
      "How global FMCG leaders re-engineer sourcing to withstand localized disruptions.",
      "Maintaining universal brand authenticity while adapting to hyper-local cultural nuances."
    ],
    isRevealed: false,
  },
  {
    id: "panel-3",
    number: "03",
    title: "Capital Without Borders",
    category: "Finance & BFSI",
    topic: "Global Liquidity, Sovereign Wealth & Next-Gen International Settlement",
    subtitle: "Cross-Border Capital Flows, Fintech & Alternative Settlement Rails",
    image: "/panels/finance-bfsi.jpg",
    description: "Managing international liquidity, cross-border M&A, digital currency protocols, and shifting institutional capital across emerging market corridors.",
    keyQuestions: [
      "Where institutional capital allocates in response to geopolitical realignments.",
      "The role of next-generation digital settlement rails in bypassing legacy frictions."
    ],
    isRevealed: false,
  },
  {
    id: "panel-4",
    number: "04",
    title: "Shifting Gears",
    category: "Automobile & EV Mobility",
    topic: "Clean-Tech Alliances, Battery Mineral Chains & Trade Tariffs in EV Mobility",
    subtitle: "Clean-Tech Alliances & Automotive Manufacturing",
    image: "/panels/auto-mobility.jpg",
    description: "EV battery supply chains, rare-earth mineral geopolitics, regulatory mandates, and global automotive manufacturing alliances.",
    keyQuestions: [
      "Mitigating critical mineral bottlenecks and battery recycling corridors.",
      "Navigating cross-border tariffs and localized manufacturing incentives in EV adoption."
    ],
    isRevealed: false,
  },
  {
    id: "panel-5",
    number: "05",
    title: "Going Viral, Staying Local",
    category: "Media & Entertainment",
    topic: "Cultural Resonance vs. International Scale: Navigating Borderless Media",
    subtitle: "Balancing Global Brand Trust with Localized Consumer Empathy",
    image: "/panels/media-brands.jpg",
    description: "Balancing universal brand narratives with hyper-localized nuances across fragmented media channels and culturally sensitive global audiences.",
    keyQuestions: [
      "How enterprise marketing teams maintain global brand trust during geopolitical friction.",
      "Leveraging generative media without eroding regional consumer empathy."
    ],
    isRevealed: false,
  },
];

export const ARCHIVE_EDITIONS: ArchiveEdition[] = [
  {
    edition: "GLC 3.0",
    year: "2025",
    theme: "LeadXAI — Strategic Intelligence & Transformation",
    tagline: "Reimagining Global Value from India",
    summary: "Explored the transformative integration of enterprise AI across corporate boardrooms, algorithmic finance, and future workforce capabilities.",
    stats: [
      { label: "C-Suite Keynotes", value: "35+" },
      { label: "Executive Delegates", value: "850+" },
      { label: "Participating MNCs", value: "65+" },
    ],
    highlights: [
      "Executive address on Agentic AI as a Strategic Catalyst in Global Enterprises",
      "Roundtables on Enterprise AI Ethics, Cloud Sovereignty & IP Protection",
      "TAPMI Business Excellence Awards honoring trailblazing corporate initiatives"
    ],
  },
  {
    edition: "GLC 2.0",
    year: "2024",
    theme: "Lead AI — Shaping the Future Workforce",
    tagline: "Human-Centric Digital Agility",
    summary: "Conducted deep discourse on organizational agility, cognitive automation, and enterprise capability building amidst rapid disruption.",
    stats: [
      { label: "Global Speakers", value: "28" },
      { label: "Industry Partners", value: "50+" },
      { label: "Delegate Satisfaction", value: "98%" },
    ],
    highlights: [
      "Symposia on executive talent reskilling and leadership succession",
      "High-level benchmarking across BFSI and Healthcare delivery hubs",
      "Student and corporate research colloquiums"
    ],
  },
  {
    edition: "GLC 1.0",
    year: "2023",
    theme: "Resilient Leadership in Unpredictable Economies",
    tagline: "The Inaugural Leadership Summit",
    summary: "The flagship conference that inaugurated TAPMI Bengaluru as a premier national nexus for high-level business leadership.",
    stats: [
      { label: "Corporate Partners", value: "25+" },
      { label: "Delegates & Leaders", value: "600+" },
      { label: "Focus Tracks", value: "4" },
    ],
    highlights: [
      "Inaugural address by TAPMI Academic Senate & Industry Advisory Board",
      "Actionable frameworks for post-pandemic supply chain diversification",
      "Establishment of the annual PACE Executive Dialogue Series"
    ],
  },
];

export const DELEGATE_ADVANTAGES = [
  {
    step: "01",
    title: "C-Suite & Geopolitical Intelligence",
    description: "Direct, off-the-record discussions with multinational CEOs, global managing directors, and enterprise strategists navigating volatile border dynamics.",
    metric: "40+ CXO Speakers",
  },
  {
    step: "02",
    title: "Cross-Industry Synthesis Across 5 Sectors",
    description: "Gain cross-cutting perspectives spanning IT & Enterprise Tech, BFSI, FMCG, Electric Mobility, and Media — breaking through traditional industry echo chambers.",
    metric: "5 High-Impact Panels",
  },
  {
    step: "03",
    title: "MAHE / TAPMI Institutional Credibility",
    description: "Backed by an Institution of Eminence with AACSB and AMBA double accreditation, ensuring scholarly depth, rigorous research, and verified standards.",
    metric: "Top 1% Global B-Schools",
  },
  {
    step: "04",
    title: "Curated Executive Networking Nexus",
    description: "Connect with over 1,000+ senior corporate leaders, academic fellows, innovators, and high-caliber management delegates in an exclusive setting.",
    metric: "1,000+ Decision Makers",
  },
];
