/* Single source of truth for every piece of copy and data on the site.
   Components must read from here — never hardcode text in a component. */

export type Tint = "pink" | "peach" | "mint" | "lilac" | "butter" | "sky";

export const TINTS: Tint[] = ["pink", "peach", "mint", "lilac", "butter", "sky"];

/** CSS custom property for a tint, e.g. tintVar("mint") -> "var(--color-mint)". */
export const tintVar = (tint: Tint) => `var(--color-${tint})`;

export const site = {
  name: "David Saputra",
  firstName: "David",
  lastName: "Saputra",
  initials: "DS",
  url: "https://davidsaputra.my.id/",
  title: "David Saputra | Frontend Developer, Vibe Coder & Prompt Engineer",
  description:
    "David Saputra adalah frontend developer, vibe coder, dan prompt engineer dari Tangerang, Indonesia. Membangun pengalaman web yang bersih, jelas, dan purposeful — dari company profile hingga sistem internal.",
  ogDescription:
    "Clean, purposeful web experiences — company profiles, product sites and internal systems. Based in Tangerang, Indonesia.",
  ogImage: "https://davidsaputra.my.id/src/png/nav-avatar.png",
  twitter: "@David_Saputra07",
  location: "Tangerang, Indonesia",
  locationShort: "Tangerang, ID",
  timeZone: "Asia/Jakarta",
  timeZoneLabel: "WIB",
  availability: "Available for work",
  years: "23—26",
  logo: "/src/opt/logo-david-s.webp",
  avatar: "/src/opt/nav-avatar-s.webp",
  cv: "/src/cv/CV_DAVID_SAPUTRA.pdf",
} as const;

export const contact = {
  email: "davidsaputra2704@gmail.com",
  emailHref: "mailto:davidsaputra2704@gmail.com",
  phone: "+62 895-0463-1048",
  whatsappHref: "https://wa.me/6289504631048",
  website: "davidsaputra.my.id",
  socials: [
    { label: "GitHub", href: "https://github.com/DavidDSaputra", handle: "@DavidDSaputra" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/david-saputra-98b4b823b/",
      handle: "David Saputra",
    },
    { label: "Instagram", href: "https://www.instagram.com/david2470_/", handle: "@david2470_" },
  ],
} as const;

export const nav = {
  aboutPill: { label: "About", href: "/#about" },
  cta: { label: "Let's Talk", href: contact.whatsappHref },
  links: [
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Work", href: "/#work" },
    { label: "Experience", href: "/#experience" },
    { label: "Skills", href: "/#skills" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/#contact" },
  ],
  menuLabel: "Menu",
  closeLabel: "Close",
} as const;

export const roles = [
  "Frontend Developer",
  "Vibe Coder",
  "Prompt Engineer",
  "Web Designer",
  "Problem Solver",
] as const;

export const hero = {
  kicker: "Frontend Developer, Vibe Coder & Prompt Engineer",
  headlineLines: ["David", "Saputra"],
  tagline:
    "Software-engineering graduate and IT professional designing and building clean, purposeful web experiences — from company profiles and product sites to internal HR systems.",
  primaryCta: { label: "View selected work", href: "/#work" },
  secondaryCta: { label: "Download CV", href: site.cv },
  basedIn: "Based in Tangerang, ID",
  scrollHint: "Scroll",
  marquee: roles,
  /* Retro CRT monitor (3D) — the screen cycles through these project shots. */
  monitor: {
    model: "/src/3d/retro-mac.glb",
    alt: "Retro CRT monitor showing David's projects",
    fileLabel: "david.ts",
    statusLabel: "✓ deployed",
    code: [
      "const david = {",
      "  design: true,",
      "  build: true,",
      '  ship: "anywhere",',
      "};",
      "deploy(david); // live",
    ],
    screens: [
      "/src/opt/hris-s.webp",
      "/src/opt/jarwinn-s.webp",
      "/src/opt/webkarbit-s.webp",
      "/src/opt/solis-s.webp",
      "/src/opt/sefashion-s.webp",
      "/src/opt/antbox-s.webp",
    ],
  },
  /* Loose sticker photos scattered around the hero. */
  stickers: ["/src/opt/jarwinn-hero-s.webp", "/src/opt/bsa-interior-s.webp", "/src/opt/joulwinn-app-s.webp"],
} as const;

export const about = {
  fig: "Fig. 01",
  figLabel: "About",
  heading: ["Building things", "on the web."],
  paragraphs: [
    "I'm a vocational software-engineering graduate (Rekayasa Perangkat Lunak) who turned a love of building things on the web into a career shipping real products.",
    "As IT Staff at PT. Jarwinn Felicitas Hotapea I own the web end-to-end: developing and maintaining the company profile website and the internal HR system, managing hosting, domains and SSL, and keeping hardware and software running smoothly.",
    "I care about simple content structure, clean design patterns and thoughtful interactions — interfaces that load fast, read clearly and get out of the way.",
  ],
  traits: ["Clear communication", "Fast adaptation", "Team collaboration"],
  photo: {
    src: "/src/opt/about.webp",
    alt: "David Saputra — Web Developer & Visual Designer",
    caption: "David Saputra — Web Developer & Visual Designer",
  },
  mascots: [
    { src: "/src/opt/mascot-noodle.webp", alt: "" },
    { src: "/src/opt/mascot-runner.webp", alt: "" },
  ],
  meta: [
    { label: "Based in", value: "Tangerang, Indonesia" },
    { label: "Education", value: "SMKN 5 Kab. Tangerang — Software Engineering (RPL)" },
    { label: "Certification", value: "BNSP — Web Programming Competency" },
    { label: "Focus", value: "Web Development · UI/UX · Graphic Design" },
  ],
} as const;

export type JalurIcon = "code" | "layout" | "brush" | "rocket" | "sparkles";

export interface JalurStop {
  /** Two-word giant title; the sticker badge sits between the two words. */
  words: [string, string];
  icon: JalurIcon;
  tint: Tint;
  bubble: string;
}

export const jalur = {
  fig: "Fig. 02",
  figLabel: "What I Do",
  statement:
    "Give me a problem, not a stack. I design it, build it, polish it and ship it to any screen. No handoffs. No excuses. Just products that work.",
  stops: [
    {
      words: ["Web", "Development"],
      icon: "code",
      tint: "peach",
      bubble:
        "HTML, CSS, JavaScript, PHP, React and Next.js — company profiles, product sites and internal systems that load fast and read clearly.",
    },
    {
      words: ["UI/UX", "Design"],
      icon: "layout",
      tint: "lilac",
      bubble:
        "Simple content structure, clean design patterns and thoughtful interactions, shaped in Figma before anything ships.",
    },
    {
      words: ["Graphic", "Design"],
      icon: "brush",
      tint: "pink",
      bubble:
        "Poster edits and GFX with sticker cards, bold display type and layered detail — the playful side of the craft.",
    },
    {
      words: ["Deployment", "& Care"],
      icon: "rocket",
      tint: "mint",
      bubble:
        "Hosting, domains and SSL handled end-to-end, plus the troubleshooting that keeps everything running smoothly.",
    },
    {
      words: ["Vibe", "Coding"],
      icon: "sparkles",
      tint: "butter",
      bubble:
        "Prompt engineering meets frontend taste — a rough brief becomes a working product, fast.",
    },
  ] satisfies JalurStop[],
  endNote: "Just products that work.",
};

export type ProjectCategory = "website" | "mobile" | "system" | "design";

export interface Project {
  slug: string;
  /** File-style label, e.g. "jarwinn-official.website". */
  name: string;
  title: string;
  tag: string;
  categories: ProjectCategory[];
  href?: string;
  download?: string;
  /** 900px WebP. */
  image: string;
  /** 480px WebP. */
  thumb: string;
  /** "contain" for portrait posters that must not be cropped. */
  fit?: "contain";
  likes?: number;
  desc: string;
  role: string;
  status: string;
  featured?: boolean;
}

const ROLE_BUILD = "Design & Development";
const ROLE_GFX = "Graphic Design";

type ProjectSeed = Omit<Project, "slug" | "image" | "thumb" | "status"> & { file: string };

const projectSeeds: ProjectSeed[] = [
  {
    name: "jarwinn-official.website",
    title: "Jarwinn Official Website",
    tag: "Featured · Company",
    categories: ["website"],
    href: "https://jarwinn.co.id/",
    file: "jarwinn-hero",
    desc: "Professional company website presenting services and portfolio with a modern, seamless experience.",
    role: ROLE_BUILD,
    featured: true,
  },
  {
    name: "jarwinn-plts.website",
    title: "Jarwinn.com — PLTS & Energy Storage",
    tag: "Web · Content",
    categories: ["website"],
    href: "https://jarwinn.com/",
    file: "jarwinn-com",
    desc: "Content and consultation site for Jarwinn's solar (PLTS) and battery storage solutions — educational articles, system guides and a consultation funnel.",
    role: ROLE_BUILD,
  },
  {
    name: "joulwinn-agent.mobile",
    title: "Joulwinn Agent App",
    tag: "Mobile App",
    categories: ["mobile"],
    href: "https://mlm.joulwinn.com/",
    file: "joulwinn-app",
    desc: "Android partner app for Joulwinn's solar (PLTS) business — fingerprint or Google sign-in, customer & SPK project management, commission wallet and referral program.",
    role: ROLE_BUILD,
    featured: true,
  },
  {
    name: "bsa-interior.website",
    title: "BSA Interior",
    tag: "Web · Catalog",
    categories: ["website"],
    href: "https://bsainterior.id/",
    file: "bsa-interior",
    desc: "Catalog website for an interior material & accessories supplier — browsable HPL collections by category, project inspiration and WhatsApp consultation.",
    role: ROLE_BUILD,
    featured: true,
  },
  {
    name: "solis-inverters.website",
    title: "Solis Inverters Indonesia",
    tag: "Energy",
    categories: ["website"],
    href: "https://www.solisinverters.co.id/",
    file: "solis",
    desc: "Official site for solar energy solutions with a clean interface and clear product information.",
    role: ROLE_BUILD,
    featured: true,
  },
  {
    name: "jarwinn-hr.system",
    title: "Jarwinn HR System",
    tag: "Web App",
    categories: ["system"],
    href: "https://career.jarwinn.co.id/portal-hrd",
    file: "hris",
    desc: "Centralised HR platform for team workflow, employee data and administration, with a secure admin panel.",
    role: ROLE_BUILD,
    featured: true,
  },
  {
    name: "antbox-storage.website",
    title: "ANTBOX Storage Website",
    tag: "Product",
    categories: ["website"],
    href: "https://antboxindonesia.com/",
    file: "antbox",
    desc: "Energy-storage product presentation with a premium, corporate tone and detailed showcase.",
    role: ROLE_BUILD,
  },
  {
    name: "webkarbit-ui.design",
    title: "WebKarbit UI Design",
    tag: "UI Design",
    categories: ["design"],
    href: "https://dav-uiweb.netlify.app/",
    file: "webkarbit",
    desc: "UI/UX showcase focused on visual composition, detail and usability.",
    role: "UI/UX Design",
  },
  {
    name: "sefashion.website",
    title: "SEFashion",
    tag: "Commerce",
    categories: ["website"],
    href: "http://sefashion.my.id/",
    file: "sefashion",
    desc: "Commerce and payment-flow UI experiment with a bold, considered visual language.",
    role: ROLE_BUILD,
  },
  {
    name: "social-media.website",
    title: "Personal Social Media",
    tag: "Experiment",
    categories: ["website"],
    href: "https://socialmedia7.netlify.app/",
    file: "cardname",
    desc: "Social media concept built from scratch with HTML, CSS and JavaScript.",
    role: ROLE_BUILD,
  },
  {
    name: "yudha-portfolio.website",
    title: "Yudha Bhaskara Portfolio",
    tag: "Web · Portfolio",
    categories: ["website"],
    href: "https://yudhabhas.web.id/",
    file: "yudha-portfolio",
    desc: "Creative producer portfolio with oversized typography and an editorial layout.",
    role: ROLE_BUILD,
  },
  {
    name: "spyxfamily.poster",
    title: "Spy x Family — Poster GFX",
    tag: "GFX · Poster",
    categories: ["design"],
    href: "https://www.instagram.com/david2470_/",
    file: "gfx-spyxfamily",
    fit: "contain",
    likes: 70,
    desc: "Fan poster edit of Anya, Loid and Yor Forger — sticker info-cards, barcode strips, Japanese type accents and a bold display title.",
    role: ROLE_GFX,
  },
  {
    name: "nobara.poster",
    title: "Jujutsu Kaisen — Nobara Kugisaki",
    tag: "GFX · Poster",
    categories: ["design"],
    href: "https://www.instagram.com/david2470_/",
    file: "gfx-jujutsu-nobara",
    fit: "contain",
    likes: 66,
    desc: "Character poster edit for Nobara Kugisaki — speech-bubble notes, cut-out detail stickers and outlined display lettering on a swirl backdrop.",
    role: ROLE_GFX,
  },
  {
    name: "raiden.poster",
    title: "Genshin Impact — Raiden Shogun",
    tag: "GFX · Poster",
    categories: ["design"],
    href: "https://www.instagram.com/david2470_/",
    file: "gfx-raiden-shogun",
    fit: "contain",
    desc: "Character poster edit for Raiden Shogun — seigaiha pattern frame, Electro element badge and sticker callouts.",
    role: ROLE_GFX,
  },
  {
    name: "kaguya.poster",
    title: "Kaguya-sama — Kaguya Shinomiya",
    tag: "GFX · Poster",
    categories: ["design"],
    href: "https://www.instagram.com/david2470_/",
    file: "gfx-kaguya",
    fit: "contain",
    likes: 47,
    desc: "Character poster edit for Kaguya Shinomiya — repeated outline typography, focus-frame sticker and wave-pattern background.",
    role: ROLE_GFX,
  },
  {
    name: "marin.poster",
    title: "My Dress-Up Darling — Kitagawa Marin",
    tag: "GFX · Poster",
    categories: ["design"],
    href: "https://www.instagram.com/david2470_/",
    file: "gfx-kitagawa-marin",
    fit: "contain",
    likes: 55,
    desc: "Character poster edit for Kitagawa Marin — sunburst background, cloud speech bubble and a clean info card.",
    role: ROLE_GFX,
  },
  {
    name: "kobo.poster",
    title: "hololive ID — Kobo Kanaeru",
    tag: "GFX · Poster",
    categories: ["design"],
    href: "https://www.instagram.com/david2470_/",
    file: "gfx-kobo-kanaeru",
    fit: "contain",
    likes: 39,
    desc: "Character poster edit for Kobo Kanaeru — UI sticker cards (search bar, follower stats, subscribe bubble) layered over a wave illustration.",
    role: ROLE_GFX,
  },
  {
    name: "amelia.poster",
    title: "hololive EN — Watson Amelia",
    tag: "GFX · Poster",
    categories: ["design"],
    href: "https://www.instagram.com/david2470_/",
    file: "gfx-amelia-watson",
    fit: "contain",
    likes: 308,
    desc: "Character poster edit for Watson Amelia — scattered UI stickers, profile cards and a grid-paper background in a warm palette.",
    role: ROLE_GFX,
  },
  {
    name: "bakulan-pos.system",
    title: "Bakulan D. Frozen Food POS",
    tag: "System · POS Kasir",
    categories: ["system", "mobile"],
    download: "/src/apk/bakulan-pos.apk",
    file: "bakulan-pos",
    desc: "Android POS cashier app for a frozen-food store — cashier login, categorized product catalog, cart & checkout, stock alerts and transaction history. Ships as a ready-to-install APK.",
    role: ROLE_BUILD,
    featured: true,
  },
  {
    name: "solar-monitoring.expo",
    title: "Smart Solar Monitoring",
    tag: "Expo · React Native",
    categories: ["system", "mobile"],
    file: "solar-monitoring",
    desc: "Expo (React Native) monitoring app for solar power plants — daily yield, charge & discharge stats, plant-status donut and a multi-platform picker (SolisCloud, Huawei FusionSolar, Growatt) talking to a shared backend API.",
    role: ROLE_BUILD,
  },
  {
    name: "tiara-kiani.website",
    title: "Tiara Kiani Portfolio",
    tag: "Web · Portfolio",
    categories: ["website"],
    href: "https://tiarakiani.vercel.app/",
    file: "tiara-kiani",
    desc: "Desktop-OS-style portfolio for a live-stream host and e-commerce presenter — playful pink workspace with widget cards, a live-selling player and folder shortcuts.",
    role: ROLE_BUILD,
  },
];

export const projects: Project[] = projectSeeds.map(({ file, ...seed }) => ({
  ...seed,
  slug: seed.name.replace(/\./g, "-"),
  image: `/src/opt/${file}.webp`,
  thumb: `/src/opt/${file}-s.webp`,
  status: seed.href ? "Live" : seed.download ? "APK download" : "Private build",
}));

export const featuredProjects: Project[] = projects.filter((project) => project.featured);

export const works = {
  fig: "Fig. 03",
  figLabel: "Selected Work",
  heading: ["Selected", "Work"],
  years: site.years,
  intro: "Company profiles, product sites, mobile apps and internal systems — shipped and in use.",
  metaLabels: { role: "Role", status: "Status", type: "Type" },
  viewLabel: "View project",
  downloadLabel: "Download APK",
  privateLabel: "Private build",
  archive: {
    fig: "Fig. 04",
    figLabel: "Archive",
    heading: ["All", "Projects"],
    intro: "Everything in the folder — websites, apps, systems and poster edits.",
    countLabel: "items",
    likesLabel: "likes",
    filters: [
      { key: "all", label: "All" },
      { key: "website", label: "Website" },
      { key: "mobile", label: "Mobile" },
      { key: "system", label: "System" },
      { key: "design", label: "Design" },
    ] as { key: "all" | ProjectCategory; label: string }[],
  },
};

export interface ExperienceItem {
  badge: string;
  role: string;
  company: string;
  bullets: string[];
  /** File tab shown in the sticky visual panel. */
  file: { name: string; kind: "code" | "sheet" | "table" | "doc" };
  tint: Tint;
}

export const experience = {
  fig: "Fig. 05",
  figLabel: "Experience",
  heading: ["Where I've", "Worked"],
  intro: "Four stops so far — from the production floor to owning the web end-to-end.",
  items: [
    {
      badge: "Current",
      role: "Staff IT",
      company: "PT. Jarwinn Felicitas Hotapea",
      bullets: [
        "Develop and maintain the company profile website and the internal HR system.",
        "Manage hosting, domains and SSL certificates.",
        "Handle hardware & software troubleshooting and routine system checks.",
      ],
      file: { name: "hr-system.tsx", kind: "code" },
      tint: "mint",
    },
    {
      badge: "Internship",
      role: "Quality Assurance Intern",
      company: "SDMKITA.com",
      bullets: [
        "Spent a 3-month internship as QA on SDMKITA.com, a recruitment platform built for Perum Peruri.",
        "Executed test cases, documented defects and tracked regressions through to closure.",
        "Verified fixes with developers and stakeholders before release.",
      ],
      file: { name: "test-cases.xlsx", kind: "sheet" },
      tint: "sky",
    },
    {
      badge: "Previous",
      role: "Marketplace Content",
      company: "PT. Indotara Persada",
      bullets: [
        "Published and maintained product listings across Tokopedia, Shopee, Lazada and more.",
        "Wrote promotional product descriptions and kept stock, imagery and ratings up to date.",
        "Protected brand integrity by reporting duplicate or infringing listings.",
      ],
      file: { name: "listings.csv", kind: "table" },
      tint: "peach",
    },
    {
      badge: "Previous",
      role: "Production Support",
      company: "PT. Indoseiki Metalutama",
      bullets: [
        "Prepared monthly production plans as part of the production analysis team.",
        "Consulted on upcoming products and assembled prepared tooling and materials.",
      ],
      file: { name: "production-plan.pdf", kind: "doc" },
      tint: "lilac",
    },
  ] satisfies ExperienceItem[],
  cvFile: { name: "cv.pdf", label: "Download CV", href: site.cv },
};

export const skills = {
  fig: "Fig. 06",
  figLabel: "Skills & Tools",
  heading: ["Skills", "& Tools"],
  groups: [
    {
      title: "Development",
      tint: "peach" as Tint,
      items: ["HTML", "CSS", "JavaScript", "PHP", "CodeIgniter", "MySQL", "React", "Next.js", "Node.js", "C / C++"],
    },
    {
      title: "Design",
      tint: "lilac" as Tint,
      items: ["UI/UX Design", "Figma", "Graphic Design (GFX)", "Design Systems"],
    },
    {
      title: "Practices",
      tint: "mint" as Tint,
      items: ["OOP & MVC", "Responsive Design", "Hosting / Domain / SSL", "Troubleshooting", "Git & GitHub"],
    },
    {
      title: "Soft Skills",
      tint: "butter" as Tint,
      items: ["Communication", "Adaptability", "Teamwork"],
    },
  ],
  marquee: ["HTML", "CSS", "JavaScript", "PHP", "React", "Next.js", "Node.js", "MySQL", "Figma", "Photoshop", "Git"],
};

export const education = {
  fig: "Fig. 07",
  figLabel: "Education & Certification",
  heading: ["Education &", "Certification"],
  items: [
    {
      school: "Global Institute of Technology and Business",
      meta: "Bachelor of Information Technology — 2023 – Present · Semester 7, GPA 3.89 / 4.00",
      bullets: [
        "Web application development with Laravel and mobile application development with Flutter.",
        "Designed and implemented an attendance system and a Point of Sale (POS) system.",
        "Hands-on experience with Cisco networking, database design and systems analysis.",
        "Project-based learning focused on solving real-world business problems; daily tooling across Visual Studio Code, Sublime Text, MySQL DBMS, C++, Kotlin and Java.",
      ],
      tint: "sky" as Tint,
    },
    {
      school: "SMKN 5 Kabupaten Tangerang",
      meta: "Rekayasa Perangkat Lunak (Software Engineering)",
      bullets: [
        "Web programming with HTML, CSS, JavaScript, PHP and CodeIgniter; OOP & MVC for dynamic web apps.",
        "Databases with MySQL; fundamentals in C++ and mobile development (Kotlin, Java).",
        "Awarded the BNSP competency certificate for Software Engineering.",
      ],
      tint: "pink" as Tint,
    },
    {
      school: "BNSP Competency Certificate",
      meta: "Web Programming — Rekayasa Perangkat Lunak",
      bullets: ["National certification validating professional web programming competency."],
      tint: "butter" as Tint,
    },
  ],
};

export const contactCta = {
  fig: "Fig. 08",
  figLabel: "Contact",
  kicker: "Get in touch",
  headingLines: ["Let's build", "something clean", "& useful."],
  cta: { label: "Let's Talk", href: contact.whatsappHref },
  availability: site.availability,
  channels: [
    { label: "Email", value: contact.email, href: contact.emailHref },
    { label: "WhatsApp", value: contact.phone, href: contact.whatsappHref },
    { label: "Instagram", value: "@david2470_", href: "https://www.instagram.com/david2470_/" },
    {
      label: "LinkedIn",
      value: "David Saputra",
      href: "https://www.linkedin.com/in/david-saputra-98b4b823b/",
    },
    { label: "GitHub", value: "@DavidDSaputra", href: "https://github.com/DavidDSaputra" },
  ],
};

export const footer = {
  copyright: "© 2026 David Saputra",
  credit: "Designed & built with care",
  location: site.location,
  website: { label: contact.website, href: site.url },
  localTimeLabel: "Local time",
  backToTop: "Back to top",
  marquee: ["Let's build something clean & useful", "Design it", "Build it", "Polish it", "Ship it"],
};

export const blog = {
  title: "David Saputra | Blog",
  description: "Tutorial seputar Git, GitHub, Laravel, dan web development dari David Saputra.",
  backHome: { label: "Back home", href: "/" },
};
