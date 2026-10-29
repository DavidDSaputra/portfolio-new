// Glass pill nav controller: spring thumb, scroll-% badge engine, scrollspy
// with click-lock, pointer glare and the dark-theme toggle. Vanilla, no deps.
(function () {
  "use strict";

  function initGlassNav() {
    const nav = document.querySelector(".gn");
    if (!nav) {
      return;
    }
    const group = nav.querySelector(".gn-seg-group");
    const thumb = nav.querySelector(".gn-thumb");
    const badge = document.getElementById("gnBadge");
    const themeBtn = document.getElementById("gnTheme");
    const menuBtn = document.getElementById("gnMenu");
    const links = group ? Array.prototype.slice.call(group.querySelectorAll(".gn-link")) : [];
    const doc = document.documentElement;

    // Same-page spy targets, cached as absolute tops (measured, never in scroll)
    const spy = links
      .map((link) => {
        const hash = link.getAttribute("href") || "";
        if (hash.charAt(0) !== "#") {
          return null;
        }
        const target = document.getElementById(hash.slice(1));
        return target ? { link: link, top: 0 } : null;
      })
      .filter(Boolean);

    let rects = []; // cached { link, x, w } for thumb placement
    let max = 0;
    let lastPct = -1;
    let endState = false;
    let ticking = false;
    let locked = false;
    let lockTimer = 0;
    let lockDebounce = 0;
    let activeLink = links.filter((l) => l.classList.contains("is-active"))[0] || links[0] || null;

    /* ---------- measuring (layout reads live here, never in scroll) ---------- */

    function measure() {
      max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      spy.forEach((entry) => {
        const hash = entry.link.getAttribute("href").slice(1);
        const target = document.getElementById(hash);
        entry.top = target ? target.getBoundingClientRect().top + y : 0;
      });
      rects = links.map((link) => ({ link: link, x: link.offsetLeft, w: link.offsetWidth }));
      placeThumb(activeLink);
      if (badge) {
        badge.classList.toggle("is-static", max <= 0);
      }
    }

    function placeThumb(link) {
      if (!thumb || !link) {
        return;
      }
      const hit = rects.filter((r) => r.link === link)[0];
      if (!hit) {
        return;
      }
      thumb.style.width = hit.w + "px";
      thumb.style.transform = "translate3d(" + hit.x + "px, 0, 0)";
    }

    function setActive(link) {
      if (!link || link === activeLink) {
        return;
      }
      if (activeLink) {
        activeLink.classList.remove("is-active");
      }
      link.classList.add("is-active");
      activeLink = link;
      placeThumb(link);
    }

    /* ---------- scroll engine: one passive listener, one rAF per frame ---------- */
    // Per frame: read scrollY once, compare against cached max/section tops,
    // then write the badge text, --p, condense class and thumb position.

    function frame() {
      ticking = false;
      const y = window.scrollY;
      let pct;
      if (max <= 0) {
        pct = 100;
      } else {
        pct = Math.round(Math.min(1, Math.max(0, y / max)) * 100);
        if (max - y <= 2) {
          pct = 100; // snap so 100% is actually reachable
        }
      }
      if (badge && pct !== lastPct) {
        lastPct = pct;
        nav.style.setProperty("--p", String(pct));
        badge.setAttribute("aria-valuenow", String(pct));
        if (pct === 100 && max > 0) {
          if (!endState) {
            endState = true;
            badge.textContent = "End";
            badge.classList.add("is-end");
          }
        } else {
          if (endState) {
            endState = false;
            badge.classList.remove("is-end");
          }
          badge.textContent = pct + "%";
        }
      }

      if (!locked && spy.length) {
        const line = y + window.innerHeight * 0.35;
        let current = spy[0].link;
        for (let i = 0; i < spy.length; i += 1) {
          if (spy[i].top <= line) {
            current = spy[i].link;
          }
        }
        setActive(current);
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(frame);
      }
      if (locked) {
        // 160ms-debounced fallback unlock when scrollend is unsupported
        window.clearTimeout(lockDebounce);
        lockDebounce = window.setTimeout(unlock, 160);
      }
    }

    function unlock() {
      locked = false;
      window.clearTimeout(lockTimer);
      window.clearTimeout(lockDebounce);
      frame();
    }

    function lock() {
      locked = true;
      window.clearTimeout(lockTimer);
      lockTimer = window.setTimeout(unlock, 1200); // hard cap
    }

    /* ---------- thumb chase: hover + focus, return on leave ---------- */

    if (group) {
      group.addEventListener("pointerover", (event) => {
        const link = event.target.closest(".gn-link");
        if (link) {
          placeThumb(link);
        }
      });
      group.addEventListener("pointerleave", () => {
        placeThumb(activeLink);
      });
      group.addEventListener("focusin", (event) => {
        const link = event.target.closest(".gn-link");
        if (link) {
          placeThumb(link);
        }
      });
      group.addEventListener("focusout", () => {
        placeThumb(activeLink);
      });
    }

    links.forEach((link) => {
      link.addEventListener("click", () => {
        const hash = link.getAttribute("href") || "";
        setActive(link);
        if (hash.charAt(0) === "#" && document.getElementById(hash.slice(1))) {
          lock(); // hold the spy until the smooth scroll settles
        }
      });
    });

    /* ---------- pointer glare (--mx/--my, rAF-throttled) ---------- */

    let glareX = 0;
    let glareY = 0;
    let glareTick = false;
    nav.addEventListener("pointermove", (event) => {
      glareX = event.clientX;
      glareY = event.clientY;
      if (!glareTick) {
        glareTick = true;
        window.requestAnimationFrame(() => {
          glareTick = false;
          const rect = nav.getBoundingClientRect();
          nav.style.setProperty("--mx", (glareX - rect.left) + "px");
          nav.style.setProperty("--my", (glareY - rect.top) + "px");
        });
      }
    });

    /* ---------- theme toggle ---------- */

    function applyTheme(dark) {
      doc.classList.toggle("dark", dark);
      if (themeBtn) {
        themeBtn.setAttribute("aria-pressed", String(dark));
        themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
      }
      try {
        localStorage.setItem("mn-theme", dark ? "dark" : "light");
      } catch (e) { /* private mode */ }
    }

    if (themeBtn) {
      themeBtn.setAttribute("aria-pressed", String(doc.classList.contains("dark")));
      themeBtn.addEventListener("click", () => {
        applyTheme(!doc.classList.contains("dark"));
      });
    }

    /* ---------- compact menu button forwards to the circle menu ---------- */

    const circleTrigger = document.getElementById("circleTrigger");
    function syncMenuAria() {
      if (!menuBtn || !circleTrigger) {
        return;
      }
      const open = circleTrigger.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (menuBtn && circleTrigger) {
      menuBtn.addEventListener("click", () => {
        circleTrigger.click();
        syncMenuAria();
      });
      if ("MutationObserver" in window) {
        new MutationObserver(syncMenuAria).observe(document.body, {
          attributes: true,
          attributeFilter: ["class"]
        });
      }
    }

    /* ---------- wiring ---------- */

    let measureDebounce = 0;
    function scheduleMeasure() {
      window.clearTimeout(measureDebounce);
      measureDebounce = window.setTimeout(() => {
        measure();
        frame();
      }, 120);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("orientationchange", () => {
      measure();
      frame();
    });
    if ("onscrollend" in window) {
      window.addEventListener("scrollend", () => {
        unlock();
      });
    }
    if ("ResizeObserver" in window) {
      new ResizeObserver(scheduleMeasure).observe(document.body);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        measure();
        frame();
      });
    }
    window.addEventListener("load", () => {
      measure();
      frame();
    });
    if (badge) {
      badge.addEventListener("animationend", () => {
        badge.classList.remove("is-end");
      });
    }

    // First frame must already be correct (deep links, refresh mid-page)
    measure();
    frame();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGlassNav, { once: true });
  } else {
    initGlassNav();
  }
})();
