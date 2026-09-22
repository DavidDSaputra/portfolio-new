(function () {
  function initAOS() {
    if (window.AOS && typeof window.AOS.init === "function") {
      window.AOS.init({
        duration: 650,
        easing: "ease-out-cubic",
        once: true,
        offset: 40,
      });
      return;
    }

    setTimeout(initAOS, 150);
  }

  initAOS();

  const scrollBar = document.getElementById("scrollProgressBar");
  if (scrollBar) {
    window.addEventListener("scroll", () => {
      const total =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      scrollBar.style.width = `${(window.scrollY / total) * 100}%`;
    });
  }

  const cursorInner = document.getElementById("cursor-inner");
  const cursorOuter = document.getElementById("cursor-outer");
  if (cursorInner && cursorOuter) {
    const lightTargets = document.querySelectorAll(".blog-footer-back, .blog-modal-close");

    document.addEventListener("mousemove", (e) => {
      cursorInner.style.left = `${e.clientX}px`;
      cursorInner.style.top = `${e.clientY}px`;
      cursorOuter.animate(
        { left: `${e.clientX}px`, top: `${e.clientY}px` },
        { duration: 500, fill: "forwards" }
      );
    });

    document.querySelectorAll("a,button,article").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursorInner.classList.add("hover");
        cursorOuter.classList.add("hover");
      });
      el.addEventListener("mouseleave", () => {
        cursorInner.classList.remove("hover");
        cursorOuter.classList.remove("hover");
      });
    });

    lightTargets.forEach((target) => {
      target.addEventListener("mouseenter", () => {
        cursorInner.classList.add("cursor-on-light");
        cursorOuter.classList.add("cursor-on-light");
      });
      target.addEventListener("mouseleave", () => {
        cursorInner.classList.remove("cursor-on-light");
        cursorOuter.classList.remove("cursor-on-light");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const pageTransition = document.getElementById("pageTransition");
    if (!pageTransition) {
      return;
    }

    setTimeout(() => pageTransition.classList.remove("active"), 500);

    document.querySelectorAll('a[href^="/"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href) {
          return;
        }

        e.preventDefault();
        pageTransition.classList.add("active");
        setTimeout(() => {
          window.location.href = href;
        }, 500);
      });
    });
  });
})();
