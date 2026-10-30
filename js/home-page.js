(function () {
  function initAOS() {
    if (window.AOS && typeof window.AOS.init === "function") {
      window.AOS.init({
        duration: 800,
        easing: "ease-out-cubic",
        once: true,
        offset: 50,
      });
      return;
    }

    setTimeout(initAOS, 150);
  }

  initAOS();

  window.openURL = function openURL() {
    window.open("/src/cv/CV_DAVID_SAPUTRA.pdf", "_blank");
  };

  const cursorInner = document.getElementById("cursor-inner");
  const cursorOuter = document.getElementById("cursor-outer");
  const spotlight = document.getElementById("spotlight");
  const canvas = document.getElementById("particleCanvas");
  const progressCircle = document.querySelector(".progress-ring-circle");
  const logo = document.querySelector(".logo");

  if (cursorInner && cursorOuter) {
    const links = document.querySelectorAll("a,label,button");
    const lightTargets = document.querySelectorAll(
      ".letsTalkBtn, .resume-btn, .brew-btn, .google-login-btn, .reactbits-light-button"
    );

    document.addEventListener("mousemove", function (e) {
      const posX = e.clientX;
      const posY = e.clientY;

      cursorInner.style.left = `${posX}px`;
      cursorInner.style.top = `${posY}px`;

      cursorOuter.animate(
        {
          left: `${posX}px`,
          top: `${posY}px`,
        },
        { duration: 500, fill: "forwards" }
      );
    });

    links.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        cursorInner.classList.add("hover");
        cursorOuter.classList.add("hover");
      });
      link.addEventListener("mouseleave", () => {
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

  const titleAura = document.querySelector(".mn-title-aura");
  if (titleAura && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const trackers = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ];
    const speeds = [0.16, 0.1, 0.065];
    const target = { x: 0, y: 0 };
    let primed = false;

    const syncAura = () => {
      trackers.forEach((t, i) => {
        t.x += (target.x - t.x) * speeds[i];
        t.y += (target.y - t.y) * speeds[i];
        titleAura.style.setProperty(`--x${i + 1}`, `${t.x}px`);
        titleAura.style.setProperty(`--y${i + 1}`, `${t.y}px`);
      });
      requestAnimationFrame(syncAura);
    };

    document.addEventListener("mousemove", (e) => {
      const rect = titleAura.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      if (!primed) {
        primed = true;
        trackers.forEach((t) => {
          t.x = rect.width / 2;
          t.y = rect.height / 2;
        });
        requestAnimationFrame(syncAura);
      }
    });
  }

  if (spotlight) {
    document.addEventListener("mousemove", (e) => {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
    });

    document.addEventListener("mouseleave", () => {
      spotlight.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
      spotlight.style.opacity = "1";
    });
  }

  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    const mouse = { x: null, y: null, radius: 150 };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("mousemove", function (event) {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    window.addEventListener("resize", function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    });

    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius + this.size) {
          if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
            this.x += 2;
          }
          if (mouse.x > this.x && this.x > this.size * 10) {
            this.x -= 2;
          }
          if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
            this.y += 2;
          }
          if (mouse.y > this.y && this.y > this.size * 10) {
            this.y -= 2;
          }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function initParticles() {
      particlesArray = [];
      const numberOfParticles = (canvas.height * canvas.width) / 9000;

      for (let i = 0; i < numberOfParticles; i += 1) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (window.innerWidth - size * 4) + size * 2;
        const y = Math.random() * (window.innerHeight - size * 4) + size * 2;
        const directionX = Math.random() * 0.4 - 0.2;
        const directionY = Math.random() * 0.4 - 0.2;
        const color = "rgba(91, 143, 185, 0.8)";

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    function connectParticles() {
      for (let a = 0; a < particlesArray.length; a += 1) {
        for (let b = a; b < particlesArray.length; b += 1) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = dx * dx + dy * dy;

          if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            const opacityValue = 1 - distance / 20000;
            ctx.strokeStyle = `rgba(74, 123, 167,${opacityValue})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      requestAnimationFrame(animateParticles);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particlesArray.forEach((particle) => particle.update());
      connectParticles();
    }

    initParticles();
    animateParticles();
  }

  setTimeout(() => {
    const techBoxes = document.querySelectorAll(".tech-stack-box");
    if (window.VanillaTilt && techBoxes.length) {
      window.VanillaTilt.init(techBoxes, {
        max: 20,
        speed: 300,
        glare: true,
        "max-glare": 0.5,
        scale: 1.1,
      });
    }
  }, 1000);

  const buttons = document.querySelectorAll(".gallery-btn, .cta");
  buttons.forEach((button) => {
    button.addEventListener("mousemove", function (e) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    button.addEventListener("mouseleave", function () {
      button.style.transform = "translate(0px, 0px)";
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(".skills-section, .projects-section, .about-section, .fun-facts-section")
    .forEach((section) => {
      section.classList.add("reveal-element");
      observer.observe(section);
    });

  let coffeeCount = 0;
  window.incrementCoffee = function incrementCoffee() {
    coffeeCount += 1;
    const counter = document.getElementById("coffeeCounter");
    if (!counter) {
      return;
    }

    counter.textContent = coffeeCount;
    counter.style.transform = "scale(1.2)";
    setTimeout(() => {
      counter.style.transform = "scale(1)";
    }, 200);
  };

  const facts = [
    "I debug in my sleep! 😴",
    "Coffee = Code fuel ☕",
    "CSS is my superpower! 🎨",
    "Console.log() is life! 📝",
    "I speak fluent emoji! 😎",
    "Ctrl+Z is my best friend! ⌨️",
    "Dark mode forever! 🌙",
    "Semicolons are optional! 😏",
    "I dream in code! 💭",
    "404: Social life not found! 🤖",
  ];

  window.randomFact = function randomFact() {
    const factElement = document.getElementById("randomFactText");
    if (!factElement) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * facts.length);
    factElement.style.opacity = "0";

    setTimeout(() => {
      factElement.textContent = facts[randomIndex];
      factElement.style.opacity = "1";
    }, 200);
  };

  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = "!<>-_\\/[]{}-=+*^?#________";
      this.update = this.update.bind(this);
    }

    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => {
        this.resolve = resolve;
      });
      this.queue = [];

      for (let i = 0; i < length; i += 1) {
        const from = oldText[i] || "";
        const to = newText[i] || "";
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }

      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }

    update() {
      let output = "";
      let complete = 0;

      for (let i = 0; i < this.queue.length; i += 1) {
        let { from, to, start, end, char } = this.queue[i];

        if (this.frame >= end) {
          complete += 1;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span class="dud">${char}</span>`;
        } else {
          output += from;
        }
      }

      this.el.innerHTML = output;

      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame += 1;
      }
    }

    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  setTimeout(() => {
    const scrambleElements = document.querySelectorAll(".scramble-text");
    scrambleElements.forEach((el) => {
      const fx = new TextScramble(el);
      const originalText = el.textContent;

      el.addEventListener("mouseenter", () => {
        fx.setText(originalText);
      });
    });
  }, 2000);

  function updateProgressCircle() {
    if (!progressCircle) {
      return;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    const offset = 220 - (220 * scrollPercent) / 100;
    progressCircle.style.strokeDashoffset = offset;
  }

  window.addEventListener("scroll", updateProgressCircle);

  document.addEventListener("DOMContentLoaded", function () {
    const pageTransition = document.getElementById("pageTransition");
    if (!pageTransition) {
      return;
    }

    setTimeout(() => {
      pageTransition.classList.remove("active");
    }, 500);

    document.querySelectorAll('a[href^="/"]').forEach((link) => {
      link.addEventListener("click", function (e) {
        const target = this.getAttribute("href");
        if (!target || target.startsWith("/#")) {
          return;
        }

        e.preventDefault();
        pageTransition.classList.add("active");

        setTimeout(() => {
          window.location.href = target;
        }, 500);
      });
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    const lazyImages = document.querySelectorAll("img.lazy");

    const imageObserver = new IntersectionObserver((entries, observerRef) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");
          observerRef.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => imageObserver.observe(img));
  });

  let konamiCode = [];
  const konamiSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];

  document.addEventListener("keydown", function (e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join("") === konamiSequence.join("")) {
      activateEasterEgg();
    }
  });

  function activateEasterEgg() {
    const easterEgg = document.getElementById("easterEgg");
    if (!easterEgg) {
      return;
    }

    easterEgg.classList.add("active");
    createConfetti();

    setTimeout(() => {
      easterEgg.classList.remove("active");
    }, 2000);

    setTimeout(() => {
      window.alert("🎉 You found the secret! You're awesome! 🚀");
    }, 500);
  }

  function createConfetti() {
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];

    for (let i = 0; i < 50; i += 1) {
      setTimeout(() => {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
      }, i * 30);
    }
  }

  let logoClickCount = 0;
  let logoClickTimer = null;
  if (logo) {
    logo.addEventListener("click", function () {
      logoClickCount += 1;

      if (logoClickTimer) {
        clearTimeout(logoClickTimer);
      }

      logoClickTimer = setTimeout(() => {
        logoClickCount = 0;
      }, 1000);

      if (logoClickCount === 3) {
        document.body.classList.toggle("rainbow-mode");
        logoClickCount = 0;

        if (document.body.classList.contains("rainbow-mode")) {
          window.alert("🌈 Rainbow Mode Activated! 🌈");
        } else {
          window.alert("Rainbow Mode Deactivated");
        }
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "s" || e.key === "S") {
      document.body.classList.add("shake");
      setTimeout(() => {
        document.body.classList.remove("shake");
      }, 500);
    }
  });

  // Selected Work hides behind a folder: the section shows a single folder
  // button with an invitation line. Clicking it pops open a file-manager
  // window; the sidebar filters the file grid and clicking a file swaps the
  // window body to a quick-look style preview of that project.
  const folderGate = document.getElementById("folderGate");
  const folderBtn = document.getElementById("folderBtn");
  const workWindow = document.getElementById("workWindow");
  const workClose = document.getElementById("workClose");
  const workFiles = document.getElementById("workFiles");
  const workPreview = document.getElementById("workPreview");
  const previewBack = document.getElementById("previewBack");
  const projectsSection = document.getElementById("projects");
  const sideButtons = workWindow?.querySelectorAll(".mn-side-btn");
  const fileItems = workWindow?.querySelectorAll(".mn-file");
  if (folderBtn && workWindow && workFiles && sideButtons?.length && fileItems?.length) {
    const previewImg = document.getElementById("previewImg");
        const previewMedia = previewImg?.closest(".mn-preview-media");
    const previewTag = document.getElementById("previewTag");
    const previewTitle = document.getElementById("previewTitle");
    const previewDesc = document.getElementById("previewDesc");
    const previewLink = document.getElementById("previewLink");
    const previewLike = document.getElementById("previewLike");
    const previewLikeCount = document.getElementById("previewLikeCount");
    let firstOpen = true;

    // Like badges: one heart pill per design file, built from data-likes.
    // Desktop reveals it on hover/focus; touch reveals it while pressed and
    // again inside the quick-look preview after the tap opens it.
    fileItems.forEach((file) => {
      const likes = file.getAttribute("data-likes");
      const thumb = file.querySelector(".mn-file-thumb");
      if (!likes || !thumb || thumb.querySelector(".mn-file-like")) {
        return;
      }
      const badge = document.createElement("span");
      badge.className = "mn-file-like";
      badge.setAttribute("aria-hidden", "true");
      const heart = document.createElement("i");
      heart.textContent = "\u2665";
      const count = document.createElement("strong");
      count.textContent = likes;
      badge.append(heart, count);
      thumb.appendChild(badge);
    });

    const applyFilter = (filter) => {
      sideButtons.forEach((button) => {
        const isActive = button.getAttribute("data-filter") === filter;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
      fileItems.forEach((file) => {
        // data-category may hold several space-separated categories so one
        // item (e.g. the POS APK) can live under System and Mobile at once
        const categories = (file.getAttribute("data-category") || "").split(/\s+/);
        const matches = filter === "all" || categories.includes(filter);
        file.classList.toggle("is-hidden", !matches);
      });
    };

    const hidePreview = () => {
      workPreview.classList.remove("open");
      document.body.classList.remove("mn-modal-open");
      window.setTimeout(() => {
        workPreview.hidden = true;
        workFiles.hidden = false;
        // Modal closed: park the preview back inside the window body
        if (workPreview.parentElement === document.body) {
          previewHome.appendChild(workPreview);
        }
      }, 260);
    };

    const showPreview = (file) => {
      previewImg.src = file.getAttribute("data-img") || "";
      previewImg.alt = file.getAttribute("data-title") || "";
      previewTag.textContent = file.getAttribute("data-tag") || "";
      previewTitle.textContent = file.getAttribute("data-title") || "";
      previewDesc.textContent = file.getAttribute("data-desc") || "";
      // Items that ship a binary (e.g. the POS APK) turn the primary CTA into
      // a real download; everything else keeps the external "View project" link
      const download = file.getAttribute("data-download");
      if (download) {
        previewLink.hidden = false;
        previewLink.href = download;
        previewLink.setAttribute("download", "");
        previewLink.removeAttribute("target");
        previewLink.removeAttribute("rel");
        previewLink.innerHTML = 'Download APK <span aria-hidden="true">\u2B73</span>';
      } else {
        const href = file.getAttribute("data-href");
        // Showcase-only items (no binary, no live URL) hide the CTA entirely
        previewLink.hidden = !href;
        previewLink.href = href || "#";
        previewLink.removeAttribute("download");
        previewLink.setAttribute("target", "_blank");
        previewLink.setAttribute("rel", "noreferrer");
        previewLink.innerHTML = 'View project <span aria-hidden="true">\u2192</span>';
      }
      // Portrait GFX posters read better uncropped; website shots stay cover-cropped
      previewMedia?.classList.toggle("contain", file.getAttribute("data-fit") === "contain");
      const likes = file.getAttribute("data-likes");
      if (previewLike && previewLikeCount) {
        previewLike.hidden = !likes;
        previewLikeCount.textContent = likes || "";
      }
      // On phones lift the preview onto <body> so no transformed ancestor
      // (the window bounce) can trap the fixed-position modal overlay
      if (mobileMq.matches) {
        if (workPreview.parentElement !== document.body) {
          document.body.appendChild(workPreview);
        }
        document.body.classList.add("mn-modal-open");
      }
      workFiles.hidden = true;
      workPreview.hidden = false;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => workPreview.classList.add("open"));
      });
      previewBack?.focus({ preventScroll: true });
    };

    const setFolderOpen = (open) => {
      folderBtn.setAttribute("aria-expanded", String(open));
      if (open) {
        workWindow.hidden = false;
        folderGate?.classList.add("is-open");
        projectsSection?.classList.add("is-revealed");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => workWindow.classList.add("open"));
        });
        workClose?.focus({ preventScroll: true });
        if (firstOpen) {
          firstOpen = false;
          applyFilter("all");
        }
      } else {
        workWindow.classList.remove("open");
        workPreview.classList.remove("open");
        folderGate?.classList.remove("is-open");
        window.setTimeout(() => {
          workWindow.hidden = true;
          workPreview.hidden = true;
          workFiles.hidden = false;
          folderBtn.focus({ preventScroll: true });
        }, 420);
      }
    };

    folderBtn.addEventListener("click", () => setFolderOpen(true));
    workClose?.addEventListener("click", () => setFolderOpen(false));
    previewBack?.addEventListener("click", hidePreview);
    // On phones the preview is a modal: tapping the scrim dismisses it
    const mobileMq = window.matchMedia("(max-width: 760px)");
    const previewHome = workPreview.parentElement;
    workPreview.addEventListener("click", (event) => {
      if (mobileMq.matches && event.target === workPreview) {
        hidePreview();
      }
    });
    mobileMq.addEventListener("change", (event) => {
      document.body.classList.remove("mn-modal-open");
      if (!event.matches && workPreview.hidden &&
        workPreview.parentElement === document.body) {
        previewHome.appendChild(workPreview);
      }
    });
    fileItems.forEach((file) => {
      file.addEventListener("click", () => showPreview(file));
    });
    sideButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (!workPreview.hidden) {
          hidePreview();
        }
        applyFilter(button.getAttribute("data-filter"));
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || workWindow.hidden) {
        return;
      }
      if (workPreview.hidden) {
        setFolderOpen(false);
      } else {
        hidePreview();
      }
    });
  }

  // About: ObsidianUI-style text fill — the page pins while scrolling scrubs a
  // character-by-character color sweep across the whole About copy; once the
  // last character lands the pin releases and normal scrolling resumes.
  const aboutCopy = document.querySelector(".mn-about-copy");
  const fillZone = document.getElementById("aboutFillZone");
  const pinMedia = window.matchMedia("(min-width: 761px)");
  if (
    aboutCopy &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const chars = [];
    aboutCopy.querySelectorAll("p").forEach((paragraph) => {
      const statement = paragraph.textContent.replace(/\s+/g, " ").trim();
      const hiddenWrap = document.createElement("span");
      hiddenWrap.setAttribute("aria-hidden", "true");
      statement.split(" ").forEach((word, wordIndex) => {
        if (wordIndex > 0) {
          hiddenWrap.append(" ");
        }
        const wordSpan = document.createElement("span");
        wordSpan.className = "wd";
        word.split("").forEach((character) => {
          const charSpan = document.createElement("span");
          charSpan.className = "ch";
          charSpan.textContent = character;
          wordSpan.appendChild(charSpan);
          chars.push(charSpan);
        });
        hiddenWrap.appendChild(wordSpan);
      });
      const srOnly = document.createElement("span");
      srOnly.className = "mn-sr-only";
      srOnly.textContent = statement;
      paragraph.textContent = "";
      paragraph.append(hiddenWrap, srOnly);
    });

    let fillTicking = false;
    const updateFill = () => {
      fillTicking = false;
      let progress;
      if (pinMedia.matches && fillZone) {
        // Pinned scrub: progress tracks the tall zone scrolling past
        const rect = fillZone.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const passed = Math.min(Math.max(-rect.top, 0), Math.max(total, 0));
        progress = total > 0 ? passed / total : 1;
      } else {
        // Unpinned (mobile): the sweep tracks the copy crossing a reading
        // line, so characters light up exactly as they are scrolled into
        // reading position instead of finishing before the text is read
        const rect = aboutCopy.getBoundingClientRect();
        const readLine = window.innerHeight * 0.62;
        const passed = readLine - rect.top;
        progress = rect.height > 0 ? Math.min(Math.max(passed / rect.height, 0), 1) : 1;
      }
      const active = Math.round(progress * chars.length);
      chars.forEach((charSpan, index) => {
        charSpan.classList.toggle("show", index < active);
      });
    };
    const queueFill = () => {
      if (!fillTicking) {
        fillTicking = true;
        window.requestAnimationFrame(updateFill);
      }
    };
    window.addEventListener("scroll", queueFill, { passive: true });
    window.addEventListener("resize", queueFill);
    updateFill();
  }
})();

// Services: statement typography (albertirgi.com-style) — scrolling scrubs a
// word-by-word fill across the sentence; colored tiles pop and the marker
// sweeps once the scrub reaches them. Reduced motion lights all at once.
(function () {
  "use strict";

  function initServiceType() {
    const statement = document.querySelector(".mn-svc-statement");
    if (!statement) { return; }
    const tokens = Array.from(statement.querySelectorAll(".wd"));
    if (!tokens.length) { return; }
    const mark = statement.querySelector(".mn-svc-mark");
    const markAt = mark ? tokens.indexOf(mark.querySelector(".wd")) : -1;

    const light = (progress) => {
      const active = Math.round(progress * tokens.length);
      tokens.forEach((token, index) => {
        token.classList.toggle("on", index < active);
      });
      if (mark) {
        mark.classList.toggle("on", markAt >= 0 && active > markAt);
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      light(1);
      return;
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = statement.getBoundingClientRect();
      const readLine = window.innerHeight * 0.72;
      const span = rect.height + window.innerHeight * 0.25;
      const progress = Math.min(Math.max((readLine - rect.top) / span, 0), 1);
      light(progress);
    };
    const queue = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    update();

    // Category row: an auto-cycling "live" cell (tinted bg, revealed icon and
    // a sweep progress bar) so the row keeps moving like the reference; the
    // cycle pauses while the pointer is over the row so hover stays in charge.
    const row = document.querySelector(".mn-svc-row");
    if (row && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const cells = Array.from(row.children);
      let live = -1;
      let timer = null;
      const step = () => {
        cells.forEach((cell) => cell.classList.remove("is-live"));
        live = (live + 1) % cells.length;
        cells[live].classList.add("is-live");
      };
      const start = () => {
        if (!timer && cells.length) {
          step();
          timer = window.setInterval(step, 2200);
        }
      };
      const stop = () => {
        window.clearInterval(timer);
        timer = null;
      };
      row.addEventListener("mouseenter", stop);
      row.addEventListener("mouseleave", start);
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                start();
              } else {
                stop();
              }
            });
          },
          { threshold: 0.4 }
        );
        io.observe(row);
      } else {
        start();
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initServiceType, { once: true });
  } else {
    initServiceType();
  }
})();

// Work banner: mask-reveal text for section titles.
(function () {
  "use strict";

  // Mask reveal: wrap title content, lift it into the clip once in view
  function initMaskReveal() {
    const targets = document.querySelectorAll("[data-mask]");
    if (!targets.length) { return; }
    targets.forEach((el) => {
      const inner = document.createElement("span");
      inner.className = "mn-mask-i";
      while (el.firstChild) { inner.appendChild(el.firstChild); }
      el.appendChild(inner);
    });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    targets.forEach((el) => io.observe(el));
  }

  function initBannerMotion() {
    initMaskReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBannerMotion, { once: true });
  } else {
    initBannerMotion();
  }
})();

// GridReveal (rareui.com/components/gridreveal) ported to vanilla JS:
// a 180-cell BSP mosaic splits apart with gutters, tints itself with the
// photo's per-cell average colours, then the photo fades in on top.
(function () {
  "use strict";

  const CELLS = 180;
  const OPENING_CELLS = 4;
  const HOLD = 0.9;
  const WAIT_CAP = 0.72;
  const LAST_SPLIT = 0.92;
  const MORPH = 0.055;
  const SAMPLE = 128;
  const COLOR_MS = 420;
  const GUTTER_FROM = 0.35;
  const GUTTER_TO = 0.75;
  const PHOTO_FROM = 0.93;
  // gentler than upstream so the portrait resolves calmly
  const EASE_K = 3.2;
  const SPLIT_K = 1.2;

  const clamp01 = (n) => (n > 0 ? (n < 1 ? n : 1) : 0);
  const mix = (a, b, t) => a + (b - a) * t;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function smoothstep(a, b, x) {
    const t = clamp01((x - a) / (b - a));
    return t * t * (3 - 2 * t);
  }

  function selfPaced(elapsed, duration) {
    const span = duration > 0 ? duration : 1;
    return HOLD * (1 - Math.exp(-elapsed / span));
  }

  function hash(x, y, z) {
    const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
    return n - Math.floor(n);
  }

  function makeCell(x, y, w, h, parent) {
    return {
      x, y, w, h,
      r: 0, g: 0, b: 0,
      tone: hash(x + 3.1, y + 1.7, w * 31.7),
      detail: 0,
      splitAt: 0,
      parent,
      kids: null
    };
  }

  // splitting the biggest cell each time keeps cells square-ish
  function buildTree(aspect) {
    const root = makeCell(0, 0, 1, 1, null);
    const leaves = [root];
    const branches = [];

    while (leaves.length < CELLS) {
      let pick = 0;
      let widest = -1;
      for (let i = 0; i < leaves.length; i++) {
        const c = leaves[i];
        const area = c.w * aspect * c.h * (1 + 0.12 * hash(c.x, c.y, 7.3));
        if (area > widest) {
          widest = area;
          pick = i;
        }
      }
      const parent = leaves.splice(pick, 1)[0];
      const wide = parent.w * aspect >= parent.h;
      const half = wide ? parent.w / 2 : parent.h / 2;
      const a = wide
        ? makeCell(parent.x, parent.y, half, parent.h, parent)
        : makeCell(parent.x, parent.y, parent.w, half, parent);
      const b = wide
        ? makeCell(parent.x + half, parent.y, half, parent.h, parent)
        : makeCell(parent.x, parent.y + half, parent.w, half, parent);
      parent.kids = [a, b];
      branches.push(parent);
      leaves.push(a, b);
    }

    const opening = OPENING_CELLS - 1;
    const rest = Math.max(1, branches.length - opening);
    branches.forEach((cell, i) => {
      cell.splitAt = i < opening ? -MORPH : (LAST_SPLIT * (i - opening + 1)) / rest;
    });
    return { root, branches };
  }

  // average colour per cell + luminance spread that decides split order
  function measureTree(root, pixels, size) {
    const gather = (cell) => {
      let s;
      if (cell.kids) {
        const a = gather(cell.kids[0]);
        const b = gather(cell.kids[1]);
        s = { n: a.n + b.n, r: a.r + b.r, g: a.g + b.g, b: a.b + b.b, l: a.l + b.l, l2: a.l2 + b.l2 };
      } else {
        s = { n: 0, r: 0, g: 0, b: 0, l: 0, l2: 0 };
        const x0 = Math.round(cell.x * size);
        const y0 = Math.round(cell.y * size);
        const x1 = Math.max(x0 + 1, Math.round((cell.x + cell.w) * size));
        const y1 = Math.max(y0 + 1, Math.round((cell.y + cell.h) * size));
        for (let y = y0; y < y1; y++) {
          for (let x = x0; x < x1; x++) {
            const i = (y * size + x) * 4;
            const l = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
            s.n++;
            s.r += pixels[i];
            s.g += pixels[i + 1];
            s.b += pixels[i + 2];
            s.l += l;
            s.l2 += l * l;
          }
        }
      }
      const n = s.n || 1;
      cell.r = s.r / n;
      cell.g = s.g / n;
      cell.b = s.b / n;
      cell.detail = Math.max(0, s.l2 / n - (s.l / n) * (s.l / n));
      return s;
    };
    gather(root);
  }

  // reuse the same time slots so only the order changes
  function orderByDetail(branches, openedBefore) {
    const pending = branches.filter((c) => c.splitAt > openedBefore);
    if (pending.length < 2) { return; }
    const slots = pending.map((c) => c.splitAt).sort((a, b) => a - b);
    const queue = pending.filter((c) => !c.parent || c.parent.splitAt <= openedBefore);
    let next = 0;
    while (queue.length && next < slots.length) {
      let pick = 0;
      for (let i = 1; i < queue.length; i++) {
        if (queue[i].detail > queue[pick].detail) { pick = i; }
      }
      const cell = queue.splice(pick, 1)[0];
      cell.splitAt = slots[next++];
      for (const kid of cell.kids || []) {
        if (kid.kids) { queue.push(kid); }
      }
    }
  }

  function coverRect(iw, ih, w, h) {
    const s = Math.max(w / iw, h / ih);
    return { dx: (w - iw * s) / 2, dy: (h - ih * s) / 2, dw: iw * s, dh: ih * s };
  }

  const greyOf = (tone, dark, clock) =>
    (dark ? 30 : 228) + tone * 13 + Math.sin(clock * 1.5 + tone * 6.28) * 3;

  function drawScene(s) {
    const { ctx, root, width, height, split } = s;
    const tint = s.hasColors ? s.fade : 0;
    const shade = (grey, target) => Math.round(mix(grey, target, tint));
    const base = greyOf(root.tone, s.dark, s.clock);

    ctx.fillStyle = "rgb(" + Math.round(shade(base, root.r) * 0.92) + "," +
      Math.round(shade(base, root.g) * 0.92) + "," + Math.round(shade(base, root.b) * 0.92) + ")";
    ctx.fillRect(0, 0, width, height);

    const soft = 1 - smoothstep(GUTTER_FROM, GUTTER_TO, split);
    const gutter = s.scale * soft;
    const rounded = soft > 0.01 && typeof ctx.roundRect === "function";

    const paint = (p) => {
      const x = Math.round(p.x);
      const y = Math.round(p.y);
      const w = Math.round(p.x + p.w) - x;
      const h = Math.round(p.y + p.h) - y;
      const onLeft = x <= 0;
      const onTop = y <= 0;
      const onRight = x + w >= width;
      const onBottom = y + h >= height;
      const left = onLeft ? 0 : gutter;
      const top = onTop ? 0 : gutter;
      const innerW = w - left - (onRight ? 0 : gutter);
      const innerH = h - top - (onBottom ? 0 : gutter);
      if (innerW <= 0 || innerH <= 0) { return; }
      const grey = greyOf(p.tone, s.dark, s.clock);
      ctx.fillStyle = "rgb(" + shade(grey, p.r) + "," + shade(grey, p.g) + "," + shade(grey, p.b) + ")";
      if (rounded) {
        const radius = Math.min(innerW, innerH) * 0.12 * soft;
        ctx.beginPath();
        ctx.roundRect(x + left, y + top, innerW, innerH, [
          !onLeft && !onTop ? radius : 0,
          !onRight && !onTop ? radius : 0,
          !onRight && !onBottom ? radius : 0,
          !onLeft && !onBottom ? radius : 0
        ]);
        ctx.fill();
      } else {
        ctx.fillRect(x + left, y + top, innerW, innerH);
      }
    };

    const walk = (cell, p) => {
      if (!cell.kids || split < cell.splitAt) {
        paint(p);
        return;
      }
      const t = easeOut(clamp01((split - cell.splitAt) / MORPH));
      for (const kid of cell.kids) {
        walk(kid, {
          x: mix(p.x, kid.x * width, t),
          y: mix(p.y, kid.y * height, t),
          w: mix(p.w, kid.w * width, t),
          h: mix(p.h, kid.h * height, t),
          r: mix(p.r, kid.r, t),
          g: mix(p.g, kid.g, t),
          b: mix(p.b, kid.b, t),
          tone: mix(p.tone, kid.tone, t)
        });
      }
    };

    walk(root, { x: 0, y: 0, w: width, h: height, r: root.r, g: root.g, b: root.b, tone: root.tone });

    if (!s.image) { return; }
    const photo = s.hasColors ? smoothstep(PHOTO_FROM, 1, split) * s.fade : s.fade;
    if (photo <= 0.002) { return; }
    const fit = coverRect(s.image.naturalWidth, s.image.naturalHeight, width, height);
    ctx.globalAlpha = photo;
    ctx.drawImage(s.image, fit.dx, fit.dy, fit.dw, fit.dh);
    ctx.globalAlpha = 1;
  }

  function readAverages(el, root, branches, at) {
    const buffer = document.createElement("canvas");
    buffer.width = SAMPLE;
    buffer.height = SAMPLE;
    const ctx = buffer.getContext("2d", { willReadFrequently: true });
    if (!ctx) { return false; }
    const fit = coverRect(el.naturalWidth, el.naturalHeight, SAMPLE, SAMPLE);
    ctx.drawImage(el, fit.dx, fit.dy, fit.dw, fit.dh);
    try {
      measureTree(root, ctx.getImageData(0, 0, SAMPLE, SAMPLE).data, SAMPLE);
      orderByDetail(branches, at);
      return true;
    } catch (err) {
      return false;
    }
  }

  function initGridReveal(frame) {
    const canvas = frame.querySelector("canvas");
    if (!canvas) { return; }
    const ctx = canvas.getContext("2d");
    if (!ctx) { return; }
    const src = frame.getAttribute("data-src") || "";
    const ratio = parseFloat(frame.getAttribute("data-aspect")) || 1;
    const duration = parseFloat(frame.getAttribute("data-duration")) || 6000;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const genBtn = frame.querySelector(".mn-gr-generate");
    const regenBtn = frame.querySelector(".mn-gr-regen");

    const tree = buildTree(ratio);
    const scene = {
      ctx, root: tree.root, width: 0, height: 0, scale: 1,
      dark: false, clock: 0, split: 0, fade: 0, hasColors: false, image: null
    };
    let loadedAt = -1;
    let cancelled = false;
    let fired = false;
    let loadStarted = false;
    let started = false;

    const finish = () => {
      if (fired) { return; }
      fired = true;
      frame.classList.add("is-done");
    };

    const render = (split, now) => {
      scene.dark = document.documentElement.classList.contains("dark");
      scene.split = split;
      scene.fade = loadedAt < 0 ? 0 : smoothstep(0, COLOR_MS, now - loadedAt);
      drawScene(scene);
    };

    const repaint = () => {
      if (!reduce.matches) {
        render(scene.split, performance.now());
        return;
      }
      const settled = loadedAt < 0 ? performance.now() : loadedAt + COLOR_MS;
      render(scene.image ? 1 : WAIT_CAP, settled);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = frame.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      scene.scale = dpr;
      if (w === scene.width && h === scene.height) { return; }
      scene.width = w;
      scene.height = h;
      canvas.width = w;
      canvas.height = h;
      repaint();
    };
    resize();
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(resize) : null;
    if (observer) { observer.observe(frame); }

    const load = (url, withCors) => {
      const el = new Image();
      if (withCors) { el.crossOrigin = "anonymous"; }
      el.decoding = "async";
      el.onload = () => {
        if (cancelled || !el.naturalWidth || !el.naturalHeight) { return; }
        scene.image = el;
        loadedAt = performance.now();
        scene.hasColors = readAverages(el, tree.root, tree.branches, scene.split);
        if (reduce.matches) {
          repaint();
          finish();
        }
      };
      el.onerror = () => {
        if (cancelled) { return; }
        if (withCors) { load(url, false); }
      };
      el.src = url;
    };
    let frameId = 0;
    let last = 0;
    let elapsed = 0;
    let eased = 0;
    let split = 0;
    let stopped = false;
    let visible = true;

    // the generate trigger: plays the reveal as if the portrait renders live
    function beginGeneration() {
      if (started && !fired) { return; }
      started = true;
      fired = false;
      frame.classList.add("is-running");
      frame.classList.remove("is-done");
      if (reduce.matches) {
        if (!loadStarted && src) {
          loadStarted = true;
          load(src, true);
        } else {
          loadedAt = performance.now();
          repaint();
          finish();
        }
        return;
      }
      elapsed = 0;
      eased = 0;
      split = 0;
      last = 0;
      stopped = false;
      if (!loadStarted && src) {
        loadStarted = true;
        load(src, true);
      } else if (scene.image) {
        // replay: re-key the tint/photo fade to now
        loadedAt = performance.now();
      }
      start();
    }

    if (genBtn) { genBtn.addEventListener("click", beginGeneration); }
    if (regenBtn) { regenBtn.addEventListener("click", beginGeneration); }

    if (reduce.matches) {
      // static outcome: no loop; standby mosaic until generated
      repaint();
      return;
    }

    const tick = (now) => {
      frameId = requestAnimationFrame(tick);
      if (!last) { last = now; }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;
      scene.clock = elapsed;

      const ready = scene.image !== null;
      let target;
      if (!started) {
        // standby: the grey mosaic creeps in like an empty generation canvas
        target = selfPaced(elapsed * 1000, 9000);
      } else if (ready) {
        target = 1;
      } else {
        target = selfPaced(elapsed * 1000, duration);
      }
      eased += (target - eased) * (1 - Math.exp(-dt * EASE_K));
      const wanted = Math.min(eased, ready ? 1 : WAIT_CAP);
      split += (wanted - split) * (1 - Math.exp(-dt * SPLIT_K));
      render(split, now);

      if (!fired && ready && eased > 0.995 && now - loadedAt > COLOR_MS) {
        finish();
      }
      if (fired && split > 0.9995) {
        render(1, now);
        stopped = true;
        cancelAnimationFrame(frameId);
      }
    };

    const start = () => {
      if (stopped) { return; }
      last = 0;
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(tick);
    };

    // no reason to animate a frame nobody is looking at; the image fetch is
    // deferred to first intersection so the reveal plays in view, not off-screen
    const visibility = typeof IntersectionObserver === "function"
      ? new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting === visible) { return; }
          visible = entry.isIntersecting;
          if (visible) { start(); } else { cancelAnimationFrame(frameId); }
        },
        { rootMargin: "150px" }
      )
      : null;
    if (visibility) { visibility.observe(frame); }
    start();
  }

  function bootGridReveals() {
    document.querySelectorAll(".mn-grid-reveal").forEach(initGridReveal);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootGridReveals, { once: true });
  } else {
    bootGridReveals();
  }
})();

// Hero: live WIB wall clock (GMT+7) for the hero footer location block.
(function () {
  "use strict";

  function initHeroClock() {
    const el = document.getElementById("mnClock");
    if (!el) { return; }
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => {
      el.textContent = fmt.format(new Date());
    };
    tick();
    window.setInterval(tick, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroClock, { once: true });
  } else {
    initHeroClock();
  }
})();

// Open Source: render the build-time GitHub snapshot (public/github-stats.json)
// into the dark contribution card — month labels, week columns, count-up stats.
(function () {
  "use strict";

  function initGithubCard() {
    const card = document.getElementById("mnGhCard");
    const graph = document.getElementById("mnGhGraph");
    if (!card || !graph) { return; }
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const countUp = (el, target) => {
      if (!el) { return; }
      if (reduced || !target) { el.textContent = String(target || 0); return; }
      const t0 = performance.now();
      const dur = 900;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) { window.requestAnimationFrame(step); }
      };
      window.requestAnimationFrame(step);
    };

    const reveal = (data) => {
      card.classList.add("on");
      countUp(document.getElementById("mnGhTotal"), data.total);
      countUp(document.getElementById("mnGhBest"), data.best ? data.best.c : 0);
      countUp(document.getElementById("mnGhStreak"), data.streak);
      countUp(document.getElementById("mnGhActive"), data.active);
      const bestDate = document.getElementById("mnGhBestDate");
      if (bestDate && data.best && data.best.c) {
        bestDate.textContent = new Date(data.best.d + "T00:00:00").toLocaleString("en-US", { month: "short", day: "numeric" });
      }
      const span = document.getElementById("mnGhSpan");
      if (span && data.span) { span.textContent = "of " + data.span; }
    };

    const render = (data) => {
      const days = data.days || [];
      if (!days.length) { throw new Error("empty snapshot"); }
      const weeks = [];
      for (let i = 0; i < days.length; i += 7) { weeks.push(days.slice(i, i + 7)); }

      const months = document.createElement("div");
      months.className = "mn-gh-months";
      months.style.gridTemplateColumns = "repeat(" + weeks.length + ", var(--cell))";
      let lastMonth = -1;
      weeks.forEach((week, wi) => {
        const month = new Date(week[0].d + "T00:00:00").getMonth();
        if (month !== lastMonth) {
          lastMonth = month;
          const label = document.createElement("span");
          label.style.gridColumn = String(wi + 1);
          label.textContent = new Date(week[0].d + "T00:00:00").toLocaleString("en-US", { month: "short" });
          months.appendChild(label);
        }
      });
      const inner = document.createElement("div");
      inner.className = "mn-gh-inner";
      inner.appendChild(months);
      const row = document.createElement("div");
      row.className = "mn-gh-weeks";

      weeks.forEach((week, wi) => {
        const col = document.createElement("div");
        col.className = "mn-gh-week";
        week.forEach((day) => {
          const cell = document.createElement("i");
          cell.className = "mn-gh-cell lv" + (day.l || 0);
          cell.style.setProperty("--d", (wi * 14) + "ms");
          const when = new Date(day.d + "T00:00:00").toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
          cell.title = (day.c ? day.c + " contribution" + (day.c === 1 ? "" : "s") : "No contributions") + " on " + when;
          col.appendChild(cell);
        });
        row.appendChild(col);
      });
      inner.appendChild(row);
      const scroll = document.createElement("div");
      scroll.className = "mn-gh-scroll";
      scroll.appendChild(inner);
      graph.appendChild(scroll);

      const user = document.getElementById("mnGhUser");
      if (user && data.user) { user.textContent = "@" + data.user; }

      if (reduced || !("IntersectionObserver" in window)) {
        reveal(data);
        return;
      }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(data);
            io.disconnect();
          }
        });
      }, { threshold: 0.25 });
      io.observe(card);
    };

    fetch("/github-stats.json", { cache: "no-cache" })
      .then((r) => {
        if (!r.ok) { throw new Error("http " + r.status); }
        return r.json();
      })
      .then(render)
      .catch(() => {
        graph.textContent = "";
        const note = document.createElement("p");
        note.className = "mn-gh-empty";
        note.textContent = "Contribution snapshot unavailable right now — see the full graph on GitHub.";
        graph.appendChild(note);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGithubCard, { once: true });
  } else {
    initGithubCard();
  }
})();
