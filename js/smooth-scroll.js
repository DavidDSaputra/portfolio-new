// Smooth scrolling: Lenis inertial wheel scroll (vendored lenis.min.js).
// Hash links are routed through lenis.scrollTo so nav clicks glide too.
// Skipped entirely under prefers-reduced-motion (native scroll stays).
(function () {
  "use strict";

  function initSmoothScroll() {
    if (!window.Lenis) { return; }
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return; }
    const lenis = new window.Lenis({ lerp: 0.12, smoothWheel: true });
    const raf = (time) => {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    };
    window.requestAnimationFrame(raf);

    document.addEventListener("click", (event) => {
      const node = event.target;
      const link = node && node.closest ? node.closest('a[href^="#"]') : null;
      if (!link) { return; }
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") { return; }
      let target = null;
      try {
        target = document.querySelector(hash);
      } catch (err) {
        target = null;
      }
      if (!target) { return; }
      event.preventDefault();
      lenis.scrollTo(target, { offset: -88, duration: 1.4 });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSmoothScroll, { once: true });
  } else {
    initSmoothScroll();
  }
})();
