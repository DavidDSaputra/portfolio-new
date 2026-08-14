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
  const scrollProgressBar = document.getElementById("scrollProgressBar");
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

  if (scrollProgressBar) {
    window.addEventListener("scroll", () => {
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      scrollProgressBar.style.width = `${scrolled}%`;
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
})();
