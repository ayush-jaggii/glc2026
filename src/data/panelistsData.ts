export interface Panelist {
  id: string
  name: string
  company: string
  designation: string
  linkedin: string
  trackCode: 'IT' | 'FMCG' | 'Auto' | 'BFSI' | 'Media' | 'CGD'
  trackName: string
  photo: string
  tags?: string[]
}

export interface PanelTrack {
  code: 'IT' | 'FMCG' | 'Auto' | 'BFSI' | 'Media' | 'CGD'
  name: string
  shortTitle: string
  color: string
  badgeBg: string
  badgeBorder: string
  badgeText: string
  accentGradient: string
}

export const PANEL_TRACKS: PanelTrack[] = [
  {
    code: 'IT',
    name: 'IT & Digital Acceleration',
    shortTitle: 'IT & Enterprise Tech',
    color: '#3B82F6',
    badgeBg: 'bg-black/60',
    badgeBorder: 'border-white/20',
    badgeText: 'text-white',
    accentGradient: 'from-blue-600 via-indigo-600 to-cyan-500',
  },
  {
    code: 'FMCG',
    name: 'FMCG & Consumer Dynamics',
    shortTitle: 'FMCG & Supply Chain',
    color: '#EBDCD0',
    badgeBg: 'bg-black/60',
    badgeBorder: 'border-white/20',
    badgeText: 'text-white',
    accentGradient: 'from-wine-600 via-wine-700 to-wine-800',
  },
  {
    code: 'Auto',
    name: 'Automobile & EV Mobility',
    shortTitle: 'Automobile & EV',
    color: '#F58232',
    badgeBg: 'bg-black/60',
    badgeBorder: 'border-white/20',
    badgeText: 'text-white',
    accentGradient: 'from-orange-600 via-amber-600 to-yellow-500',
  },
  {
    code: 'BFSI',
    name: 'BFSI & Fintech Architecture',
    shortTitle: 'BFSI & Fintech',
    color: '#8B5CF6',
    badgeBg: 'bg-black/60',
    badgeBorder: 'border-white/20',
    badgeText: 'text-white',
    accentGradient: 'from-purple-600 via-violet-600 to-fuchsia-500',
  },
  {
    code: 'Media',
    name: 'Media, Content & Brand Strategy',
    shortTitle: 'Media & Branding',
    color: '#F45197',
    badgeBg: 'bg-black/60',
    badgeBorder: 'border-white/20',
    badgeText: 'text-white',
    accentGradient: 'from-pink-600 via-rose-600 to-glc-magenta',
  },
  {
    code: 'CGD',
    name: 'Closed Group Discussion',
    shortTitle: 'Executive Roundtable',
    color: '#FFB800',
    badgeBg: 'bg-black/60',
    badgeBorder: 'border-white/20',
    badgeText: 'text-white',
    accentGradient: 'from-amber-600 via-yellow-600 to-orange-500',
  },
]

export const PANELISTS_DATA: Panelist[] = [
  // IT Panel
  {
    id: 'it-1',
    name: 'Amit Bhavnani',
    company: 'Accenture',
    designation: 'Managing Director',
    linkedin: 'https://www.linkedin.com/in/amit-bhavnani/',
    trackCode: 'IT',
    trackName: 'IT & Digital Acceleration',
    photo: '/images/panelists/IT/Amit_Bhavnani_IT.jpeg',
    tags: ['Enterprise Tech', 'Digital Transformation', 'Global Scale'],
  },
  {
    id: 'it-2',
    name: 'Kshitij Agrawal',
    company: 'Salesforce',
    designation: 'Director',
    linkedin: 'https://www.linkedin.com/in/kshitij-agrawal-b5b27610/',
    trackCode: 'IT',
    trackName: 'IT & Digital Acceleration',
    photo: '/images/panelists/IT/KshitijAgrawal_IT.jpeg',
    tags: ['Cloud Architecture', 'SaaS Scale', 'Enterprise AI'],
  },
  {
    id: 'it-3',
    name: 'Mohan Sitharam',
    company: 'Shadowfax',
    designation: 'Chief Human Resources Officer (CHRO)',
    linkedin: 'https://www.linkedin.com/in/mohan-sitharam-87b0624/',
    trackCode: 'IT',
    trackName: 'IT & Digital Acceleration',
    photo: '/images/panelists/IT/MohanSitharam_IT.jpeg',
    tags: ['Tech Talent', 'Organizational Scaling', 'Human Capital'],
  },
  {
    id: 'it-4',
    name: 'Viveksagar Sareen',
    company: 'SAP',
    designation: 'Senior Director',
    linkedin: 'https://www.linkedin.com/in/vivek-sareen/',
    trackCode: 'IT',
    trackName: 'IT & Digital Acceleration',
    photo: '/images/panelists/IT/ViveksagarSareen_IT.jpeg',
    tags: ['Enterprise Software', 'Supply Chain ERP', 'Global Delivery'],
  },
  {
    id: 'it-5',
    name: 'Divya Kumari',
    company: 'Decathlon',
    designation: 'Board Member & Global Executive',
    linkedin: 'https://www.linkedin.com/in/divyakum',
    trackCode: 'IT',
    trackName: 'IT & Digital Acceleration',
    photo: '',
    tags: ['Global Strategy', 'Retail Leadership', 'Board Governance'],
  },

  // FMCG Panel
  {
    id: 'fmcg-1',
    name: 'Satrajit Hui',
    company: 'Britannia Industries',
    designation: 'Head - Supply Chain & Logistics',
    linkedin: 'https://www.linkedin.com/in/satrajithui/',
    trackCode: 'FMCG',
    trackName: 'FMCG & Consumer Dynamics',
    photo: '/images/panelists/FMCG/SatrajitHui_FMCG.png',
    tags: ['Logistics Ops', 'Consumer Goods', 'Distribution Resilience'],
  },
  {
    id: 'fmcg-2',
    name: 'Natesh Bargi',
    company: 'Lotte India',
    designation: 'Vice President - Sales',
    linkedin: 'https://www.linkedin.com/in/natesh-bargi-leader/',
    trackCode: 'FMCG',
    trackName: 'FMCG & Consumer Dynamics',
    photo: '/images/panelists/FMCG/NateshBargI_FMCG.png',
    tags: ['Omnichannel Retail', 'Go-To-Market', 'Brand Expansion'],
  },
  {
    id: 'fmcg-3',
    name: 'Priya Prasad',
    company: 'Grant Thornton',
    designation: 'Partner',
    linkedin: 'https://www.linkedin.com/in/priyaprasad/',
    trackCode: 'FMCG',
    trackName: 'FMCG & Consumer Dynamics',
    photo: '/images/panelists/FMCG/PriyaPrasad_FMCG.jpeg',
    tags: ['Consumer Advisory', 'Market Strategy', 'Value Chains'],
  },
  {
    id: 'fmcg-4',
    name: 'Mohan Sitharam',
    company: 'Shadowfax',
    designation: 'CHRO',
    linkedin: 'https://www.linkedin.com/in/mohan-sitharam-87b0624/',
    trackCode: 'FMCG',
    trackName: 'FMCG & Consumer Dynamics',
    photo: '/images/panelists/FMCG/MohanSitharam_FMCG.jpeg',
    tags: ['Workforce Agility', 'Operations Culture', 'Talent Systems'],
  },

  // Automobile & EV Panel
  {
    id: 'auto-1',
    name: 'Maharana Ray',
    company: 'Bajaj Auto',
    designation: 'President',
    linkedin: 'https://linkedin.com/in/maharana-ray-28b9b714',
    trackCode: 'Auto',
    trackName: 'Automobile & EV Mobility',
    photo: '/images/panelists/Auto/MaharanaRay_Auto.jpeg',
    tags: ['Automotive Leadership', 'Mobility Platforms', 'Global Scale'],
  },
  {
    id: 'auto-2',
    name: 'Anurag B',
    company: 'Ather Energy',
    designation: 'Vice President',
    linkedin: 'https://www.linkedin.com/in/commander-anurag-bhardwaj/',
    trackCode: 'Auto',
    trackName: 'Automobile & EV Mobility',
    photo: '/images/panelists/Auto/AnuragB_Auto.jpeg',
    tags: ['EV Transition', 'Hardware Innovation', 'Clean Mobility'],
  },
  {
    id: 'auto-3',
    name: 'Sridhar Rao',
    company: 'ZF Transmissions',
    designation: 'Director',
    linkedin: 'https://www.linkedin.com/in/shridharraob/',
    trackCode: 'Auto',
    trackName: 'Automobile & EV Mobility',
    photo: '/images/panelists/Auto/SridharRao_Auto.jpeg',
    tags: ['Powertrain Systems', 'Industrial Manufacturing', 'Automotive'],
  },
  {
    id: 'auto-4',
    name: 'Manoj Gupta',
    company: 'JBM Group',
    designation: 'CEO',
    linkedin: 'https://www.linkedin.com/in/manojgu/',
    trackCode: 'Auto',
    trackName: 'Automobile & EV Mobility',
    photo: '/images/panelists/Auto/ManojGupta_Auto.jpeg',
    tags: ['Clean Energy', 'Electric Buses', 'Commercial EV'],
  },

  // BFSI Panel
  {
    id: 'bfsi-1',
    name: 'Kamal Mampilly',
    company: 'Geojit Financial Services',
    designation: 'Chief Human Resources Officer (CHRO)',
    linkedin: 'https://www.linkedin.com/in/kmampilly/',
    trackCode: 'BFSI',
    trackName: 'BFSI & Fintech Architecture',
    photo: '/images/panelists/BFSI/KamalMampilly_BFSI.jpeg',
    tags: ['Wealth Management', 'Fintech Talent', 'Strategic HR'],
  },
  {
    id: 'bfsi-2',
    name: 'Hemant Kumar',
    company: 'IDFC FIRST Bank',
    designation: 'National Head - Supply Chain Finance',
    linkedin: 'https://www.linkedin.com/in/hemantkconnect/',
    trackCode: 'BFSI',
    trackName: 'BFSI & Fintech Architecture',
    photo: '/images/panelists/BFSI/HemantKumar_BFSI.jpeg',
    tags: ['Structured Trade', 'Supply Chain Liquidity', 'Commercial Banking'],
  },
  {
    id: 'bfsi-3',
    name: 'Amiya Tripathy',
    company: 'TATA Insights and Quants',
    designation: 'Chief Financial Officer (CFO)',
    linkedin: 'https://www.linkedin.com/in/amiya-tripathy-4358b117/',
    trackCode: 'BFSI',
    trackName: 'BFSI & Fintech Architecture',
    photo: '/images/panelists/BFSI/AmiyaTripathy_BFSI.jpeg',
    tags: ['Financial Engineering', 'Quantitative Analytics', 'Capital Strategy'],
  },
  {
    id: 'bfsi-4',
    name: 'Rajesh Kumar S',
    company: 'NSDL (National Securities Depository)',
    designation: 'Head of Business',
    linkedin: 'https://www.linkedin.com/in/rajesh-kumar-s-33471325/',
    trackCode: 'BFSI',
    trackName: 'BFSI & Fintech Architecture',
    photo: '/images/panelists/BFSI/RajeshKumarS_BFSI.png',
    tags: ['Market Infrastructure', 'Securities Ecosystem', 'Fintech Rail'],
  },

  // Media & Marketing Panel
  {
    id: 'media-1',
    name: 'Sunder Madaakshira',
    company: 'Sinch',
    designation: 'Chief Marketing Officer (CMO)',
    linkedin: 'https://www.linkedin.com/in/sunder-madaakshira-4612235/',
    trackCode: 'Media',
    trackName: 'Media, Content & Brand Strategy',
    photo: '/images/panelists/Media/SunderMadaakshira_Media.jpeg',
    tags: ['Brand Governance', 'Conversational AI', 'Enterprise Marketing'],
  },
  {
    id: 'media-2',
    name: 'Bhavna Lalchandani',
    company: 'Condé Nast India',
    designation: 'Chief Content & Innovation Strategy Officer',
    linkedin: 'https://www.linkedin.com/in/bhavnalalchandani/',
    trackCode: 'Media',
    trackName: 'Media, Content & Brand Strategy',
    photo: '/images/panelists/Media/BhavnaLalchandani_Media.jpeg',
    tags: ['Luxury Media', 'Content Architecture', 'Cultural Storytelling'],
  },
  {
    id: 'media-3',
    name: 'Anindya Khare',
    company: 'Zee Media Corporation Ltd',
    designation: 'Marketing Head',
    linkedin: 'https://www.linkedin.com/in/anindya-khare-0567984/',
    trackCode: 'Media',
    trackName: 'Media, Content & Brand Strategy',
    photo: '/images/panelists/Media/AnindyaKhare_Media.jpeg',
    tags: ['Broadcast Strategy', 'Audience Growth', 'Digital Media'],
  },
  {
    id: 'media-4',
    name: 'Dr. Jagdish Chandra',
    company: 'Bharat 24',
    designation: 'CEO & Chief Editor',
    linkedin: '',
    trackCode: 'Media',
    trackName: 'Media, Content & Brand Strategy',
    photo: '',
    tags: ['Broadcast Journalism', 'Media Leadership', 'Editorial Vision'],
  },

  // Closed Group Discussion (CGD) Panel
  {
    id: 'cgd-1',
    name: 'Dominic Anto Fernando',
    company: 'Schneider Electric',
    designation: 'League Leader - non-IT & Adjacencies',
    linkedin: 'https://www.linkedin.com/in/dominicfernando/',
    trackCode: 'CGD',
    trackName: 'Closed Group Discussion',
    photo: '/images/panelists/CGD/Dominic_Anto_Fernando_CGD.png',
    tags: ['Industrial Automation', 'Procurement Scale', 'Global Operations'],
  },
  {
    id: 'cgd-2',
    name: 'Madhavan Gururaj',
    company: 'Allegis Group',
    designation: 'Head of Information Services',
    linkedin: 'https://www.linkedin.com/in/madhavangururaj/',
    trackCode: 'CGD',
    trackName: 'Closed Group Discussion',
    photo: '/images/panelists/CGD/Madhavan_Gururaj_CGD.jpeg',
    tags: ['Staffing Ecosystems', 'Workforce Tech', 'IT Infrastructure'],
  },
  {
    id: 'cgd-3',
    name: 'Sidhu Biswal',
    company: 'Buzzlabs',
    designation: 'Founder',
    linkedin: 'https://www.linkedin.com/in/sindhubiswal/',
    trackCode: 'CGD',
    trackName: 'Closed Group Discussion',
    photo: '/images/panelists/CGD/SidhuBiswal_CGD.jpeg',
    tags: ['AI Growth', 'Venture Creation', 'Product Leadership'],
  },
]

/**
 * Active panelists that have verified portrait photos uploaded.
 * Panelists without photos are preserved in PANELISTS_DATA and will automatically
 * be included here once their photos are added.
 * 
 * Interleaved across industries/panels to ensure rich visual diversity
 * and prevent clustering of the same tracks.
 */
export const SHUFFLED_PANELISTS: Panelist[] = (() => {
  // 1. Filter only panelists with valid photo files
  const withPhotos = PANELISTS_DATA.filter((p) => Boolean(p.photo && p.photo.trim().length > 0))

  // 2. Separate CGD and non-CGD tracks for balanced distribution
  const cgd = withPhotos.filter((p) => p.trackCode === 'CGD')
  const nonCgd = withPhotos.filter((p) => p.trackCode !== 'CGD')

  const byTrack: Record<string, Panelist[]> = {}
  for (const p of nonCgd) {
    if (!byTrack[p.trackCode]) byTrack[p.trackCode] = []
    byTrack[p.trackCode].push(p)
  }

  const tracks: Array<'IT' | 'Auto' | 'FMCG' | 'BFSI' | 'Media'> = ['IT', 'Auto', 'FMCG', 'BFSI', 'Media']
  const nonCgdOrdered: Panelist[] = []
  const maxLen = Math.max(...tracks.map((t) => (byTrack[t] ? byTrack[t].length : 0)))

  for (let i = 0; i < maxLen; i++) {
    for (const t of tracks) {
      const items = byTrack[t]
      if (items && i < items.length) {
        nonCgdOrdered.push(items[i])
      }
    }
  }

  // Interleave the CGD panelists smoothly across the list
  const result: Panelist[] = []
  let cgdIdx = 0

  for (let idx = 0; idx < nonCgdOrdered.length; idx++) {
    result.push(nonCgdOrdered[idx])
    if ((idx + 1) % 3 === 0 && cgdIdx < cgd.length) {
      result.push(cgd[cgdIdx])
      cgdIdx++
    }
  }

  while (cgdIdx < cgd.length) {
    result.push(cgd[cgdIdx])
    cgdIdx++
  }

  return result
})()

// Prominent keynote/featured selection for the interactive accordion
export const FEATURED_ACCORDION_ITEMS = [
  {
    id: 'cgd-1',
    url: '/images/panelists/CGD/Dominic_Anto_Fernando_CGD.png',
    title: 'Dominic Anto Fernando',
    description: 'Schneider Electric · League Leader',
    company: 'Schneider Electric',
    designation: 'League Leader - non-IT & Adjacencies',
    linkedin: 'https://www.linkedin.com/in/dominicfernando/',
    track: 'Executive Roundtable',
    tags: ['Industrial Automation', 'Procurement Scale', 'Global Operations'],
  },
  {
    id: 'it-1',
    url: '/images/panelists/IT/Amit_Bhavnani_IT.jpeg',
    title: 'Amit Bhavnani',
    description: 'Accenture · Managing Director',
    company: 'Accenture',
    designation: 'Managing Director',
    linkedin: 'https://www.linkedin.com/in/amit-bhavnani/',
    track: 'IT & Enterprise Architecture',
    tags: ['Enterprise Tech', 'Digital Transformation', 'Global Scale'],
  },
  {
    id: 'auto-1',
    url: '/images/panelists/Auto/MaharanaRay_Auto.jpeg',
    title: 'Maharana Ray',
    description: 'Bajaj Auto · President',
    company: 'Bajaj Auto',
    designation: 'President',
    linkedin: 'https://linkedin.com/in/maharana-ray-28b9b714',
    track: 'Automobile & EV Mobility',
    tags: ['Automotive Leadership', 'Mobility Platforms', 'Global Scale'],
  },
  {
    id: 'media-1',
    url: '/images/panelists/Media/SunderMadaakshira_Media.jpeg',
    title: 'Sunder Madaakshira',
    description: 'Sinch · Chief Marketing Officer',
    company: 'Sinch',
    designation: 'Chief Marketing Officer (CMO)',
    linkedin: 'https://www.linkedin.com/in/sunder-madaakshira-4612235/',
    track: 'Media & Brand Strategy',
    tags: ['Brand Governance', 'Conversational AI', 'Enterprise Marketing'],
  },
  {
    id: 'bfsi-4',
    url: '/images/panelists/BFSI/RajeshKumarS_BFSI.png',
    title: 'Rajesh Kumar S',
    description: 'NSDL · Head of Business',
    company: 'NSDL',
    designation: 'Head of Business',
    linkedin: 'https://www.linkedin.com/in/rajesh-kumar-s-33471325/',
    track: 'BFSI & Fintech',
    tags: ['Market Infrastructure', 'Securities Ecosystem', 'Fintech'],
  },
]
