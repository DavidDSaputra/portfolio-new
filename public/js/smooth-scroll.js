// Smooth scrolling: Lenis inertial wheel scroll (vendored lenis.min.js).
// Hash links are routed through lenis.scrollTo so nav clicks glide too.
// Skipped entirely under prefers-reduced-motion (native scroll stays).
(function () {
  "use strict";

  function initSmoothScroll() {
    if (window.__lenis) { return; }
    if (!window.Lenis) { return; }
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return; }
    const lenis = new window.Lenis({ lerp: 0.12, smoothWheel: true });
    // Exposed so React widgets (e.g. the SlingButton scroll-up) can glide
    // through the same instance instead of fighting it with native scroll.
    window.__lenis = lenis;
    // Lenis can move the viewport programmatically even with overflow:hidden.
    // Keep its state tied to the splash lock, including delayed initialization.
    const root = document.documentElement;
    let splashStopped = false;
    const syncLock = () => {
      const locked = root.classList.contains("pre-lock");
      if (locked && !splashStopped) {
        splashStopped = true;
        lenis.stop();
      } else if (!locked && splashStopped) {
        splashStopped = false;
        lenis.start();
      }
    };
    syncLock();
    const lockObserver = new MutationObserver(syncLock);
    lockObserver.observe(root, { attributes: true, attributeFilter: ["class"] });
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
      if (root.classList.contains("pre-lock")) { return; }
      lenis.scrollTo(target, { offset: -88, duration: 1.4 });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSmoothScroll, { once: true });
  } else {
    initSmoothScroll();
  }
})();
