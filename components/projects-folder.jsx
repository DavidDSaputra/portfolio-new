"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Folder from "./reactbits/Folder";
import FlexCarousel from "./reactbits/FlexCarousel";

/* Replaces the legacy 3D folder gate + file-manager work window in #projects.
   The React Bits <Folder /> stays as the interactive centrepiece with six
   featured pages (its MAX_ITEMS), and directly below it a filterable
   FlexCarousel lens-row flows EVERY project so nothing stays hidden inside
   the folder. Both the folder pages and the carousel cards open the same
   quick-look dialog that carries the data the legacy preview sheet showed.
   The legacy markup stays in the DOM (hidden once this mounts) so the
   standalone legacy pages and the no-JS fallback keep working. */

const STAGE_SELECTOR = ".mn-folder-stage";

/* Full catalogue, mirroring the legacy .mn-file entries (name = file-style
   label, categories = legacy sidebar filters, fit/likes = poster previews). */
const PROJECTS = [
  {
    name: "jarwinn-official.website",
    title: "Jarwinn Official Website",
    tag: "Featured · Company",
    categories: ["website"],
    href: "https://jarwinn.co.id/",
    image: "src/webp/jarwinn-hero.jpg",
    desc: "Professional company website presenting services and portfolio with a modern, seamless experience.",
  },
  {
    name: "jarwinn-plts.website",
    title: "Jarwinn.com — PLTS & Energy Storage",
    tag: "Web · Content",
    categories: ["website"],
    href: "https://jarwinn.com/",
    image: "src/webp/jarwinn-com.jpg",
    desc: "Content and consultation site for Jarwinn's solar (PLTS) and battery storage solutions — educational articles, system guides and a consultation funnel.",
  },
  {
    name: "joulwinn-agent.mobile",
    title: "Joulwinn Agent App",
    tag: "Mobile App",
    categories: ["mobile"],
    href: "https://mlm.joulwinn.com/",
    image: "src/webp/joulwinn-app.jpg",
    desc: "Android partner app for Joulwinn's solar (PLTS) business — fingerprint or Google sign-in, customer & SPK project management, commission wallet and referral program.",
  },
  {
    name: "bsa-interior.website",
    title: "BSA Interior",
    tag: "Web · Catalog",
    categories: ["website"],
    href: "https://bsainterior.id/",
    image: "src/webp/bsa-interior.jpg",
    desc: "Catalog website for an interior material & accessories supplier — browsable HPL collections by category, project inspiration and WhatsApp consultation.",
  },
  {
    name: "solis-inverters.website",
    title: "Solis Inverters Indonesia",
    tag: "Energy",
    categories: ["website"],
    href: "https://www.solisinverters.co.id/",
    image: "src/webp/solis.png",
    desc: "Official site for solar energy solutions with a clean interface and clear product information.",
  },
  {
    name: "jarwinn-hr.system",
    title: "Jarwinn HR System",
    tag: "Web App",
    categories: ["system"],
    href: "https://career.jarwinn.co.id/portal-hrd",
    image: "src/webp/hris.png",
    desc: "Centralised HR platform for team workflow, employee data and administration, with a secure admin panel.",
  },
  {
    name: "antbox-storage.website",
    title: "ANTBOX Storage Website",
    tag: "Product",
    categories: ["website"],
    href: "https://antboxindonesia.com/",
    image: "src/webp/antbox.png",
    desc: "Energy-storage product presentation with a premium, corporate tone and detailed showcase.",
  },
  {
    name: "webkarbit-ui.design",
    title: "WebKarbit UI Design",
    tag: "UI Design",
    categories: ["design"],
    href: "https://dav-uiweb.netlify.app/",
    image: "src/webp/webkarbit.png",
    desc: "UI/UX showcase focused on visual composition, detail and usability.",
  },
  {
    name: "sefashion.website",
    title: "SEFashion",
    tag: "Commerce",
    categories: ["website"],
    href: "http://sefashion.my.id/",
    image: "src/webp/sefashion.png",
    desc: "Commerce and payment-flow UI experiment with a bold, considered visual language.",
  },
  {
    name: "social-media.website",
    title: "Personal Social Media",
    tag: "Experiment",
    categories: ["website"],
    href: "https://socialmedia7.netlify.app/",
    image: "src/webp/cardname.png",
    desc: "Social media concept built from scratch with HTML, CSS and JavaScript.",
  },
  {
    name: "yudha-portfolio.website",
    title: "Yudha Bhaskara Portfolio",
    tag: "Web · Portfolio",
    categories: ["website"],
    href: "https://yudhabhas.web.id/",
    image: "src/webp/yudha-portfolio.jpg",
    desc: "Creative producer portfolio with oversized typography and an editorial layout.",
  },
  {
    name: "spyxfamily.poster",
    title: "Spy x Family — Poster GFX",
    tag: "GFX · Poster",
    categories: ["design"],
    href: "https://www.instagram.com/david2470_/",
    image: "src/webp/gfx-spyxfamily.jpg",
    fit: "contain",
    likes: 70,
    desc: "Fan poster edit of Anya, Loid and Yor Forger — sticker info-cards, barcode strips, Japanese type accents and a bold display title.",
  },
  {
    name: "nobara.poster",
    title: "Jujutsu Kaisen — Nobara Kugisaki",
    tag: "GFX · Poster",
    categories: ["design"],
    href: "https://www.instagram.com/david2470_/",
    image: "src/webp/gfx-jujutsu-nobara.jpg",
    fit: "contain",
    likes: 66,
    desc: "Character poster edit for Nobara Kugisaki — speech-bubble notes, cut-out detail stickers and outlined display lettering on a swirl backdrop.",
  },
  {
    name: "raiden.poster",
    title: "Genshin Impact — Raiden Shogun",
    tag: "GFX · Poster",
    categories: ["design"],
    href: "https://www.instagram.com/david2470_/",
    image: "src/webp/gfx-raiden-shogun.jpg",
    fit: "contain",
    desc: "Character poster edit for Raiden Shogun — seigaiha pattern frame, Electro element badge and sticker callouts.",
  },
  {
    name: "kaguya.poster",
    title: "Kaguya-sama — Kaguya Shinomiya",
    tag: "GFX · Poster",
    categories: ["design"],
    href: "https://www.instagram.com/david2470_/",
    image: "src/webp/gfx-kaguya.jpg",
    fit: "contain",
    likes: 47,
    desc: "Character poster edit for Kaguya Shinomiya — repeated outline typography, focus-frame sticker and wave-pattern background.",
  },
  {
    name: "marin.poster",
    title: "My Dress-Up Darling — Kitagawa Marin",
    tag: "GFX · Poster",
    categories: ["design"],
    href: "https://www.instagram.com/david2470_/",
    image: "src/webp/gfx-kitagawa-marin.jpg",
    fit: "contain",
    likes: 55,
    desc: "Character poster edit for Kitagawa Marin — sunburst background, cloud speech bubble and a clean info card.",
  },
  {
    name: "kobo.poster",
    title: "hololive ID — Kobo Kanaeru",
    tag: "GFX · Poster",
    categories: ["design"],
    href: "https://www.instagram.com/david2470_/",
    image: "src/webp/gfx-kobo-kanaeru.jpg",
    fit: "contain",
    likes: 39,
    desc: "Character poster edit for Kobo Kanaeru — UI sticker cards (search bar, follower stats, subscribe bubble) layered over a wave illustration.",
  },
  {
    name: "amelia.poster",
    title: "hololive EN — Watson Amelia",
    tag: "GFX · Poster",
    categories: ["design"],
    href: "https://www.instagram.com/david2470_/",
    image: "src/webp/gfx-amelia-watson.jpg",
    fit: "contain",
    likes: 308,
    desc: "Character poster edit for Watson Amelia — scattered UI stickers, profile cards and a grid-paper background in a warm palette.",
  },
  {
    name: "bakulan-pos.system",
    title: "Bakulan D. Frozen Food POS",
    tag: "System · POS Kasir",
    categories: ["system", "mobile"],
    download: "src/apk/bakulan-pos.apk",
    image: "src/webp/bakulan-pos.jpg",
    desc: "Android POS cashier app for a frozen-food store — cashier login, categorized product catalog, cart & checkout, stock alerts and transaction history. Ships as a ready-to-install APK.",
  },
  {
    name: "solar-monitoring.expo",
    title: "Smart Solar Monitoring",
    tag: "Expo · React Native",
    categories: ["system", "mobile"],
    image: "src/webp/solar-monitoring.jpg",
    desc: "Expo (React Native) monitoring app for solar power plants — daily yield, charge & discharge stats, plant-status donut and a multi-platform picker (SolisCloud, Huawei FusionSolar, Growatt) talking to a shared backend API.",
  },
  {
    name: "tiara-kiani.website",
    title: "Tiara Kiani Portfolio",
    tag: "Web · Portfolio",
    categories: ["website"],
    href: "https://tiarakiani.vercel.app/",
    image: "src/webp/tiara-kiani.jpg",
    desc: "Desktop-OS-style portfolio for a live-stream host and e-commerce presenter — playful pink workspace with widget cards, a live-selling player and folder shortcuts.",
  },
];

/* Folder holds up to 6 items (MAX_ITEMS in Folder.jsx); these indices are the
   featured picks spread across website / system / design / mobile. */
const FEATURED_IDX = [0, 4, 5, 6, 7, 18];

/* Legacy sidebar filters, reborn as chips above the archive grid. */
const FILTERS = [
  { id: "all", label: "All" },
  { id: "website", label: "Website" },
  { id: "mobile", label: "Mobile" },
  { id: "system", label: "System" },
  { id: "design", label: "Design" },
];

/* Monochrome palettes that sit on the sheet in both themes. */
const LIGHT = { color: "#232328", paperColor: "#fdfdfc", theme: "light" };
const DARK = { color: "#2e2e36", paperColor: "#f3f3f0", theme: "dark" };

export default function ProjectsFolder() {
  const [target, setTarget] = useState(null);
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState("all");
  const [vw, setVw] = useState(1200);

  useEffect(() => {
    const measure = () => setVw(window.innerWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const stage = document.querySelector(STAGE_SELECTOR);
    if (!stage) return undefined;

    stage.classList.add("mn-folder-react");
    setTarget(stage);

    return () => {
      stage.classList.remove("mn-folder-react");
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDark(root.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (active === null) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const allFolderItems = useMemo(
    () =>
      FEATURED_IDX.map((index) => {
        const project = PROJECTS[index];
        return (
          <div className="mn-pf-card" key={project.name}>
            <span className="mn-pf-thumb">
              <img src={project.image} alt="" draggable="false" loading="lazy" />
            </span>
            <span className="mn-pf-title">{project.title}</span>
            <span className="mn-pf-tag">{project.tag}</span>
          </div>
        );
      }),
    [],
  );

  /* The spread fan spans ~515px per size unit with six pages (~365px with
     three) and .mn-sheet clips overflow, so measure the sheet's content
     width (same rules as globals.css) and take the largest size whose fan
     stays inside it — no page gets cut by the sheet edge. Phones keep three
     pages: six legible cards cannot fit a narrow sheet, and the carousel
     below already carries the full archive. */
  const narrow = vw < 640;
  const sheetW = vw <= 960 ? vw - 28 : vw * 0.8125;
  const content = Math.min(sheetW, 1120) - 2 * Math.min(48, Math.max(20, vw * 0.05));
  const folderSize = narrow
    ? Math.min(1, Math.max(0.6, (content - 24) / 365))
    : Math.min(1.2, Math.max(0.8, (content - 24) / 515));
  const folderItems = narrow ? allFolderItems.slice(0, 3) : allFolderItems;

  const visible = useMemo(
    () =>
      filter === "all"
        ? PROJECTS
        : PROJECTS.filter((project) => project.categories.includes(filter)),
    [filter],
  );

  /* Carousel cards mirror the visible catalogue; visibleIdx maps a carousel
     index back to the global PROJECTS index for the quick-look dialog. */
  const carouselItems = useMemo(
    () =>
      visible.map((entry) => ({
        src: entry.image,
        alt: entry.title,
        title: entry.title,
        subtitle: entry.tag,
      })),
    [visible],
  );

  const visibleIdx = useMemo(
    () => visible.map((entry) => PROJECTS.indexOf(entry)),
    [visible],
  );

  const counts = useMemo(() => {
    const tally = { all: PROJECTS.length };
    for (const entry of FILTERS.slice(1)) {
      tally[entry.id] = PROJECTS.filter((project) =>
        project.categories.includes(entry.id),
      ).length;
    }
    return tally;
  }, []);

  if (!target) return null;

  const palette = dark ? DARK : LIGHT;
  const project = active === null ? null : PROJECTS[active];

  return (
    <>
      {createPortal(
        <div className="mn-folder-react-wrap">
          <Folder
            label="Selected Work"
            items={folderItems}
            mode="flap"
            variant="glass"
            layout="spread"
            tabPosition="center"
            openOn="click"
            color={palette.color}
            paperColor={palette.paperColor}
            theme={palette.theme}
            size={folderSize}
            zoomOnClick={false}
            draggable
            peek
            intro
            onItemClick={(item, index) => {
              const globalIndex = FEATURED_IDX[index];
              setActive((current) =>
                current === globalIndex ? null : globalIndex,
              );
            }}
          />
          <p className="mn-folder-sub">
            Klik foldernya untuk project unggulan — arsip lengkapnya
            mengalir di carousel bawah (drag atau scroll horizontal).
          </p>

          <div className="mn-pf-archive">
            <div className="mn-pf-archive-head">
              <h3 className="mn-pf-archive-title">All projects</h3>
              <span className="mn-pf-archive-count">
                {PROJECTS.length} items · 23—26
              </span>
            </div>
            <div
              className="mn-pf-filters"
              role="group"
              aria-label="Filter projects by category"
            >
              {FILTERS.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className="mn-pf-chip"
                  aria-pressed={filter === entry.id}
                  onClick={() => setFilter(entry.id)}
                >
                  {entry.label}
                  <span className="mn-pf-chip-count">{counts[entry.id]}</span>
                </button>
              ))}
            </div>
            <div className="mn-pf-carousel">
              <FlexCarousel
                items={carouselItems}
                preset="liquid"
                intro="rise"
                cardHeight={0.62}
                gap={14}
                radius={12}
                fit="natural"
                squeeze={0.2}
                focusOnClick={false}
                autoplay
                interval={4}
                captions
                captureWheel={false}
                onSelect={(index) => setActive(visibleIdx[index])}
              />
            </div>
          </div>
        </div>,
        target,
      )}
      {project
        ? createPortal(
            <div
              className="mn-pf-modal"
              role="dialog"
              aria-modal="true"
              aria-label={project.title}
              onClick={(event) => {
                if (event.target === event.currentTarget) setActive(null);
              }}
            >
              <div className="mn-pf-sheet">
                <button
                  type="button"
                  className="mn-pf-close"
                  aria-label="Tutup preview"
                  onClick={() => setActive(null)}
                >
                  ✕
                </button>
                <div className="mn-pf-media" data-fit={project.fit || "cover"}>
                  <img src={project.image} alt={project.title} />
                </div>
                <div className="mn-pf-info">
                  <div className="mn-pf-modal-meta">
                    <span className="mn-pf-modal-tag">{project.tag}</span>
                    {project.likes ? (
                      <span className="mn-pf-modal-likes">
                        <span aria-hidden="true">♥</span> {project.likes} likes
                      </span>
                    ) : null}
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.desc}</p>
                  {project.download ? (
                    <a className="mn-btn mn-btn-primary" href={project.download} download>
                      Download APK <span aria-hidden="true">⭳</span>
                    </a>
                  ) : project.href ? (
                    <a
                      className="mn-btn mn-btn-primary"
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View project <span aria-hidden="true">→</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
