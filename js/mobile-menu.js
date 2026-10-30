// ObsidianUI-style Circle Menu controller. The dark circular trigger parks at
// the top-right corner; opening flies the whole ring to the viewport center
// while the nav items spring out on a circle around the trigger.
(function () {
  "use strict";

  function initCircleMenu() {
    const menu = document.getElementById("circleMenu");
    const trigger = document.getElementById("circleTrigger");
    const scrim = document.getElementById("circleScrim");
    if (!menu || !trigger) {
      return;
    }

    // Closed state parks the 250px ring so the 48px trigger sits top-right
    // with a 16px inset (center at innerWidth - 40, 40)
    const place = () => {
      menu.style.setProperty(
        "--cm-x",
        window.innerWidth - 40 - window.innerWidth / 2 + "px"
      );
      menu.style.setProperty("--cm-y", 40 - window.innerHeight / 2 + "px");
    };

    let isOpen = false;
    const setOpen = (open) => {
      isOpen = open;
      menu.classList.toggle("open", open);
      scrim?.classList.toggle("show", open);
      document.body.classList.toggle("mn-menu-open", open);
      trigger.setAttribute("aria-expanded", String(open));
      trigger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (!open) {
        // one-shot close flourish: ring spins -360 with blur, trigger pulses
        menu.classList.add("closing");
        window.setTimeout(() => menu.classList.remove("closing"), 620);
      }
    };

    trigger.addEventListener("click", () => setOpen(!isOpen));
    scrim?.addEventListener("click", () => setOpen(false));
    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen) {
        setOpen(false);
      }
    });
    window.addEventListener("resize", () => {
      place();
      if (window.innerWidth > 998 && isOpen) {
        setOpen(false);
      }
    });
    place();
  }

  // Legacy inline handlers from the old hamburger markup no-op safely
  window.hamburgerMenu = function hamburgerMenu() {};
  window.hidemenubyli = function hidemenubyli() {};

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCircleMenu, { once: true });
  } else {
    initCircleMenu();
  }
})();
