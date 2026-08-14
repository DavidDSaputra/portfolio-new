"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Card, CardSwap, ClickSpark, CountUp, DecryptedText } from "./reactbits";

const projects = [
  {
    title: "Jarwinn Official Website",
    description: "Company website dengan tampilan profesional untuk layanan dan portfolio.",
    image: "/src/webp/jarwinn.png",
    href: "https://jarwinn.co.id/",
    tag: "Featured",
  },
  {
    title: "Solis Inverters Indonesia",
    description: "Website official untuk solusi solar energy dengan layout yang clean dan informatif.",
    image: "/src/webp/solis.png",
    href: "https://www.solisinverters.co.id/",
    tag: "Energy",
  },
  {
    title: "WebKarbit UI Design",
    description: "Showcase UI/UX modern dengan fokus pada komposisi visual dan usability.",
    image: "/src/webp/webkarbit.png",
    href: "https://dav-uiweb.netlify.app/",
    tag: "UI Design",
  },
  {
    title: "ANTBOX Storage Website",
    description: "Presentasi produk energy storage dengan nuansa korporat yang lebih premium.",
    image: "/src/webp/antbox.png",
    href: "https://antboxindonesia.com/",
    tag: "Product",
  },
  {
    title: "SEFashion",
    description: "Eksperimen UI commerce dan payment flow dengan visual yang berani.",
    image: "/src/webp/sefashion.png",
    href: "http://sefashion.my.id/",
    tag: "Commerce",
  },
  {
    title: "Jarwinn HR System",
    description: "Sistem HR terpusat untuk workflow tim, data karyawan, dan administrasi.",
    image: "/src/webp/hris.png",
    href: "https://career.jarwinn.co.id/portal-hrd",
    tag: "Web App",
  },
  {
    title: "Personal Social Media",
    description: "Social media concept yang dibangun dengan HTML, CSS, dan JavaScript.",
    image: "/src/webp/cardname.png",
    href: "https://socialmedia7.netlify.app/",
    tag: "Experiment",
  },
];

function setCursorState({ hover = false, light = false }) {
  const inner = document.getElementById("cursor-inner");
  const outer = document.getElementById("cursor-outer");

  if (!inner || !outer) {
    return;
  }

  inner.classList.toggle("hover", hover);
  outer.classList.toggle("hover", hover);
  inner.classList.toggle("cursor-on-light", light);
  outer.classList.toggle("cursor-on-light", light);
}

function usePortalTarget(selector, options = {}) {
  const { clear = false, className = "", enabled = true } = options;
  const [target, setTarget] = useState(null);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const element = document.querySelector(selector);

    if (!element) {
      return undefined;
    }

    if (clear) {
      element.innerHTML = "";
    }

    if (className) {
      element.classList.add(className);
    }

    setTarget(element);

    return () => {
      if (className) {
        element.classList.remove(className);
      }
    };
  }, [selector, clear, className, enabled]);

  return target;
}

function hoverHandlers(light = false) {
  return {
    onMouseEnter: () => setCursorState({ hover: true, light }),
    onMouseLeave: () => setCursorState({ hover: false, light: false }),
  };
}

function HeroButton() {
  return (
    <ClickSpark sparkColor="#FE6622" sparkSize={14} sparkRadius={26} sparkCount={10} duration={500}>
      <a href="mailto:davidsaputra2704@gmail.com" className="reactbits-contact-link" {...hoverHandlers(true)}>
        <button type="button" className="letsTalkBtn reactbits-light-button">
          <span className="letsTalkBtn-text">Let&apos;s Talk!</span>
          <span className="letsTalkBtn-BG" />
        </button>
      </a>
    </ClickSpark>
  );
}

function HeroTitle() {
  return (
    <DecryptedText
      text={"DAVID\nSAPUTRA"}
      speed={85}
      maxIterations={18}
      sequential
      revealDirection="center"
      useOriginalCharsOnly
      animateOn="view"
      parentClassName="reactbits-hero-title-wrap"
      className="reactbits-hero-title-char"
      encryptedClassName="reactbits-hero-title-encrypted"
    />
  );
}

function AboutImage() {
  return (
    <div className="reactbits-about-frame">
      <span className="reactbits-about-sticker">HELLO!</span>
      <img
        src="/src/webp/about.png"
        alt="David Saputra"
        aria-label="image of david"
        className="reactbits-about-image"
      />
    </div>
  );
}

function ProjectsExperience() {
  return (
    <div className="reactbits-projects-shell">
      <div className="reactbits-projects-panel">
        <div className="reactbits-projects-copy">
          <span className="reactbits-projects-kicker">Selected work / 2026</span>
          <h3 className="reactbits-projects-title">Digital products with a loud point of view.</h3>
          <p className="reactbits-projects-desc">
            Website, interface, dan eksperimen visual yang memadukan struktur kuat, warna berani, dan interaksi yang
            terasa hidup.
          </p>

          <div className="reactbits-projects-stats">
            <div className="reactbits-projects-stat">
              <strong>
                <CountUp to={projects.length} duration={1.4} />
              </strong>
              <span>selected projects</span>
            </div>
            <div className="reactbits-projects-stat">
              <strong>
                <CountUp to={4} duration={1.4} />
              </strong>
              <span>creative disciplines</span>
            </div>
          </div>

          <a
            href={projects[0].href}
            target="_blank"
            rel="noreferrer"
            className="reactbits-projects-link reactbits-light-button"
            {...hoverHandlers(true)}
          >
            Explore Featured Project ↗
          </a>
        </div>
      </div>

      <ClickSpark sparkColor="#FEBE0F" sparkSize={18} sparkRadius={30} sparkCount={12} duration={540}>
        <div className="reactbits-projects-stage">
          <CardSwap
            width={360}
            height={430}
            cardDistance={22}
            verticalDistance={28}
            delay={1200}
            transitionScale={0.38}
            pauseOnHover
            skewAmount={2}
            easing="soft"
          >
            {projects.map((project) => (
              <Card
                key={project.title}
                className="reactbits-project-card"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(15, 17, 21, 0.18) 0%, rgba(15, 17, 21, 0.92) 100%), url(${project.image})`,
                }}
              >
                <div className="reactbits-project-cardContent">
                  <span className="reactbits-project-cardTag">{project.tag}</span>
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className="reactbits-project-cardLink reactbits-light-button"
                    {...hoverHandlers(true)}
                  >
                    View Project
                  </a>
                </div>
              </Card>
            ))}
          </CardSwap>
        </div>
      </ClickSpark>
    </div>
  );
}

export default function HomeReactBitsIntegration() {
  const [enhance, setEnhance] = useState(false);

  useEffect(() => {
    let timerId;

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => setEnhance(true), { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    timerId = window.setTimeout(() => setEnhance(true), 180);
    return () => window.clearTimeout(timerId);
  }, []);

  const heroBlobTarget = usePortalTarget(".blob", { className: "reactbits-hero-host", enabled: enhance });
  const contactTarget = usePortalTarget(".contact-btn-div", {
    clear: true,
    className: "reactbits-contact-mounted",
    enabled: enhance,
  });
  const heroTitleTarget = usePortalTarget(".akito-hero-title", {
    clear: true,
    className: "reactbits-hero-title-mounted",
    enabled: enhance,
  });
  const aboutImageTarget = usePortalTarget(".dp", {
    clear: true,
    className: "reactbits-about-mounted",
    enabled: enhance,
  });
  const projectsTarget = usePortalTarget(".brew-slider-container", {
    clear: true,
    className: "reactbits-projects-mounted",
    enabled: enhance,
  });

  return (
    <>
      {heroBlobTarget ? createPortal(<div className="reactbits-hero-aurora" />, heroBlobTarget) : null}

      {heroTitleTarget ? createPortal(<HeroTitle />, heroTitleTarget) : null}
      {contactTarget ? createPortal(<HeroButton />, contactTarget) : null}
      {aboutImageTarget ? createPortal(<AboutImage />, aboutImageTarget) : null}
      {projectsTarget ? createPortal(<ProjectsExperience />, projectsTarget) : null}
    </>
  );
}
