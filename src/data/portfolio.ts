export const profile = {
  name: "Salah-Eddine Lachkar",
  email: "lachkar.salah@outlook.com",
  github: "https://github.com/artpumpkin",
  linkedin: "https://www.linkedin.com/in/salah-eddine-lachkar/",
  location: "Casablanca, Morocco",
  cv: "/Salah_Eddine_Lachkar_CV.pdf",
};
export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  tags: string[];
};
export const experiences: Experience[] = [
  {
    company: "MRPNL",
    role: "Full-Stack Engineer & Project Manager",
    period: "MAY 2026 — PRESENT",
    location: "Side SaaS project · Remote",
    description:
      "Building a trading education and market-monitoring platform. I develop administration, content, and invoice workflows, and coordinate delivery with the team.",
    tags: ["Next.js", "NestJS", "PostgreSQL", "Team delivery"],
  },
  {
    company: "TickTickTrader",
    role: "Technical Lead",
    period: "MAR 2023 — APR 2026",
    location: "Isle of Man-based company · Remote / Abu Dhabi",
    description:
      "Joined as a technical advisor, then led a team of approximately seven. Built administration interfaces, backend integrations, market-monitoring tools, and trading algorithms while keeping delivery moving.",
    tags: ["React", "TypeScript", "Trading systems", "Leadership"],
  },
  {
    company: "Chain Pixel Labs",
    role: "Frontend Developer → Technical Lead",
    period: "OCT 2021 — MAR 2023",
    location: "Samurai Rising & Samurai Legends",
    description:
      "Grew from frontend development into full-stack engineering and leading a team of approximately three. Built dashboards and decentralized applications connecting APIs, wallets, and smart contracts.",
    tags: ["React", "MERN", "Solidity", "Web3"],
  },
  {
    company: "Pink Panda Holdings",
    role: "Independent Software Contractor",
    period: "2021 — 2022",
    location: "PinkPanda / BambooDAO · Contract projects",
    description:
      "Web3 contract engagements covering the wallet public beta, Solidity staking contracts, a React staking interface, tests, and BAM migration tooling. Worked alongside the client team on delivery.",
    tags: ["Solidity", "React", "Hardhat", "Ethers.js"],
  },
  {
    company: "Independent work",
    role: "JavaScript & Web Automation Developer",
    period: "2021",
    location: "Freelance",
    description:
      "Started by turning repetitive tasks into tools: an EVM token-trading bot and automated browser workflows.",
    tags: ["Node.js", "Ethers.js", "Puppeteer"],
  },
];
export type Project = {
  id: string;
  name: string;
  category: string;
  period?: string;
  description: string;
  role: string;
  tags: string[];
  url?: string;
  visual: string;
};
export const projects: Project[] = [
  {
    id: "01",
    name: "MRPNL",
    period: "2026 — PRESENT",
    category: "TRADING EDUCATION & MARKET TOOLS",
    description:
      "A trading education and market-monitoring platform, with administration, content, learning progress, and invoice workflows.",
    role: "Full-stack engineering & project management",
    tags: ["Next.js", "NestJS", "PostgreSQL"],
    url: "https://mrpnl.com",
    visual: "market",
  },
  {
    id: "02",
    name: "TickTickTrader",
    period: "2023 — 2026",
    category: "TRADING OPERATIONS",
    description:
      "Administration interfaces, backend integrations, and market-monitoring tools for trading operations. Combined hands-on engineering with leading a team of approximately seven.",
    role: "Technical lead · Previously technical advisor",
    tags: ["React", "TypeScript", "APIs", "Leadership"],
    visual: "operations",
  },
  {
    id: "03",
    name: "Samurai Rising / Samurai Legends",
    period: "2021 — 2023",
    category: "WEB3 APPLICATIONS",
    description:
      "Dashboards and decentralized applications connecting APIs, wallets, and smart contracts. Progressed from frontend development to full-stack work and leading a team of approximately three.",
    role: "Frontend developer → Technical lead · Chain Pixel Labs",
    tags: ["React", "TypeScript", "MERN", "Solidity"],
    visual: "samurai",
  },
  {
    id: "04",
    name: "Mosaic",
    period: "2026",
    category: "DESKTOP APPLICATION",
    description:
      "A desktop app bringing finance and health tracking together: net worth, budgets, expenses, weight, and calorie logs. Stores records in a local SQLite database, with encrypted backup and transfer.",
    role: "Creator & developer",
    tags: ["Tauri", "Next.js", "TypeScript", "SQLite"],
    visual: "mosaic",
  },
  {
    id: "05",
    name: "Idescape",
    period: "2026",
    category: "DIGITAL AGENCY",
    description:
      "An agency website built alongside MRPNL in 2026. Responsive layouts, restrained motion, accessible interactions, form validation, and deployment.",
    role: "Website development",
    tags: ["Next.js", "Tailwind CSS", "Motion"],
    url: "https://idescape.com",
    visual: "agency",
  },
  {
    id: "06",
    name: "PinkPanda / BambooDAO",
    period: "2021 — 2022",
    category: "WEB3 CONTRACT ENGAGEMENTS",
    description:
      "Independent contractor work for Pink Panda Holdings: wallet beta Web3 components, staking contracts and interface, Hardhat tests, and tooling for the BAM migration to Ethereum.",
    role: "Independent software contractor",
    tags: ["Solidity", "React", "Hardhat", "Ethers.js"],
    visual: "staking",
  },
  {
    id: "07",
    name: "AI agent skills & plugins",
    period: "2026",
    category: "REUSABLE AI WORKFLOWS",
    description:
      "Reusable skills and plugins for MRPNL and everyday tasks: article creation and validation, cover and inline images, social content, Trello cards, and video-to-slides workflows.",
    role: "Workflow design & development",
    tags: ["AI agents", "Skills", "Plugins", "JavaScript"],
    visual: "workflows",
  },
  {
    id: "08",
    name: "Trading strategies & market tools",
    category: "MARKET ANALYSIS & AUTOMATION",
    description:
      "Trading algorithms, backtesting tools, and market-monitoring interfaces using Bookmap, NinjaTrader, and TradingView.",
    role: "Strategy & tooling development",
    tags: ["Java", "C#", "Pine Script"],
    visual: "strategies",
  },
  {
    id: "09",
    name: "SAFAR",
    period: "2019 — 2021",
    category: "ARABIC NLP & RESEARCH",
    description:
      "A React frontend for collaborative Arabic NLP research with EMI. English/Arabic layouts, right-to-left support, data exports, speech input, and progressive web app features.",
    role: "Frontend development & master's research",
    tags: ["React", "Chakra UI", "Python", "RTL"],
    visual: "research",
  },
  {
    id: "10",
    name: "Automation tools",
    category: "WORKFLOW AUTOMATION",
    description:
      "Browser workflows and an EVM token-trading bot built to turn repetitive actions into reusable tools.",
    role: "JavaScript & automation development",
    tags: ["Node.js", "Ethers.js", "Puppeteer", "Selenium"],
    visual: "automation",
  },
  {
    id: "11",
    name: "Creative coding & desktop tools",
    category: "INTERACTIVE EXPERIMENTS",
    description:
      "Three.js and Canvas experiments, small browser games, and desktop media tooling. Exploring interaction, visual systems, and reusable components.",
    role: "Experimentation & tool development",
    tags: ["Three.js", "TypeScript", "Phaser", "Tauri"],
    visual: "creative",
  },
];
export const skills = [
  {
    title: "Interfaces with intention",
    detail:
      "React · Next.js · TypeScript · Tailwind CSS · Chakra UI · shadcn/ui · Figma · Framer Motion",
  },
  {
    title: "The systems underneath",
    detail:
      "Node.js · Express · NestJS · REST APIs · PostgreSQL · MongoDB · Prisma",
  },
  {
    title: "State, quality & delivery",
    detail:
      "Zustand · TanStack Query · React Hook Form · Zod · Vitest · Jest · Docker · GitHub Actions · Caddy · Cloudflare",
  },
];
export const education = [
  {
    period: "2019 — 2021",
    degree: "Master in Data Science & Big Data",
    school: "Faculty of Sciences Ben M’Sik · Hassan II University, Casablanca",
    detail:
      "SAFAR: React frontend, English/Arabic layouts, and collaborative Arabic NLP research in partnership with EMI.",
  },
  {
    period: "2018 — 2019",
    degree: "Bachelor in Mathematics & Computer Science",
    school: "Faculty of Sciences Ben M’Sik · Casablanca",
    detail: "Database specialization · Mention Bien.",
  },
  {
    period: "2016 — 2018",
    degree: "DEUG in Computer Science",
    school: "Faculty of Sciences Ben M’Sik · Casablanca",
    detail:
      "Two-year university diploma in Mathematical Sciences and Applications / Computer Science · Mention Assez Bien.",
  },
  {
    period: "2014 — 2015",
    degree: "Baccalaureate in Mathematical Sciences (B)",
    school: "Al Baida · Casablanca",
    detail: "Secondary education qualification.",
  },
];
