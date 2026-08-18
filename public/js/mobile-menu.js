(function () {
  function getParts() {
    return {
      menu: document.getElementById("mobiletogglemenu"),
      button: document.getElementById("hamburger-button"),
      bars: [
        document.getElementById("burger-bar1"),
        document.getElementById("burger-bar2"),
        document.getElementById("burger-bar3"),
      ],
    };
  }

  function setMenuOpen(open) {
    const { menu, button, bars } = getParts();
    if (!menu || !button || bars.some((bar) => !bar)) {
      return;
    }

    menu.classList.toggle("show-toggle-menu", open);
    document.body.classList.toggle("stopscrolling", open);
    bars[0].classList.toggle("hamburger-animation1", open);
    bars[1].classList.toggle("hamburger-animation2", open);
    bars[2].classList.toggle("hamburger-animation3", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("aria-hidden", String(!open));
  }

  window.hamburgerMenu = function hamburgerMenu() {
    const { menu } = getParts();
    setMenuOpen(Boolean(menu && !menu.classList.contains("show-toggle-menu")));
  };

  window.hidemenubyli = function hidemenubyli() {
    setMenuOpen(false);
  };

  function initMobileMenu() {
    const { menu, button } = getParts();
    if (!menu || !button) {
      return;
    }

    button.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");

    menu.addEventListener("click", function (event) {
      if (event.target === menu || event.target.closest("a")) {
        setMenuOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 998) {
        setMenuOpen(false);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileMenu, { once: true });
  } else {
    initMobileMenu();
  }
})();
