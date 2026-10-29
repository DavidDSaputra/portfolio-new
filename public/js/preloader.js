/* Splash preloader — slot-machine greetings, green pixel-grid equalizer,
   odometer percent and curved curtain exit. Vanilla, no dependencies. */
(function () {
  var root = document.getElementById("mnPre");
  if (!root) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    if (root.parentNode) root.parentNode.removeChild(root);
    return;
  }
  document.documentElement.classList.add("pre-lock");

  /* pacing — brief, but greetings stay readable */
  var MIN_SHOW = 2400;   /* minimum splash duration */
  var HARD_CAP = 6000;   /* force exit */
  var WORD_CYCLE = 800;  /* per-greeting reading time */

  var WORDS = ["Hello", "こんにちは", "مرحبا", "Halo!"];
  var FINAL = WORDS.length - 1;

  /* ---- greeting slot machine ---- */
  var wordsBox = document.getElementById("preWords");
  var spans = WORDS.map(function (w) {
    var s = document.createElement("span");
    s.textContent = w;
    s.style.transform = "translateY(110%)";
    wordsBox.appendChild(s);
    return s;
  });
  var wi = -1;
  function showWord(next) {
    if (wi >= 0 && wi !== next) spans[wi].style.transform = "translateY(-110%)";
    var s = spans[next];
    s.style.transition = "none";
    s.style.transform = "translateY(110%)";
    void s.offsetWidth;
    s.style.transition = "";
    s.style.transform = "translateY(0%)";
    wi = next;
  }
  showWord(0);
  var cycler = setInterval(function () {
    if (finished) return;
    if (wi + 1 < FINAL) showWord(wi + 1); /* stop at last greeting; finish() shows "Halo!" */
  }, WORD_CYCLE);

  /* ---- green pixel grid ---- */
  var COLS = 26, ROWS = 6;
  var grid = document.getElementById("preGrid");
  var cells = [];
  for (var x = 0; x < COLS; x++) {
    for (var y = 0; y < ROWS; y++) {
      var c = document.createElement("i");
      var t = Math.random();
      c.style.setProperty("--x", x);
      c.style.setProperty("--od", (x * 2 + y * 4) + "ms");
      c.dataset.th = (0.08 + 0.86 * (0.6 * (x / (COLS - 1)) + 0.4 * t)).toFixed(3);
      grid.appendChild(c);
      cells.push(c);
    }
  }

  /* ---- odometer (3 reels) ---- */
  var count = document.getElementById("preCount");
  var reels = [0, 1, 2].map(function () {
    var col = document.createElement("span");
    col.className = "odo-col";
    var reel = document.createElement("span");
    reel.className = "odo-reel";
    for (var d = 0; d < 10; d++) {
      var b = document.createElement("b");
      b.textContent = d;
      reel.appendChild(b);
    }
    col.appendChild(reel);
    count.appendChild(col);
    return reel;
  });
  function setOdo(v) {
    var s = String(Math.max(0, Math.min(100, Math.round(v))));
    while (s.length < 3) s = "0" + s;
    for (var i = 0; i < 3; i++) reels[i].style.transform = "translateY(-" + Number(s.charAt(i)) + "em)";
  }

  /* ---- asset progress (eager images only; lazy ones never gate the splash) ---- */
  var doneEl = document.getElementById("preDone");
  var totalEl = document.getElementById("preTotal");
  function assets() {
    var imgs = document.images;
    var total = 0;
    var done = 0;
    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].loading === "lazy") continue;
      total++;
      if (imgs[i].complete) done++;
    }
    if (!total) { total = 1; done = loaded ? 1 : 0; }
    return { done: done, total: total };
  }

  var start = performance.now();
  var p = 0;
  var finished = false;
  var loaded = false;
  window.addEventListener("load", function () { loaded = true; });

  function finish() {
    if (finished) return;
    finished = true;
    clearInterval(cycler);
    var a = assets();
    doneEl.textContent = a.total;
    totalEl.textContent = a.total;
    setOdo(100);
    showWord(FINAL);
    grid.classList.add("done");
    setTimeout(function () {
      spans[wi].style.transform = "translateY(-110%)";
      root.classList.add("is-out");
      setTimeout(function () {
        root.classList.add("is-lift");
        document.documentElement.classList.remove("pre-lock");
        setTimeout(function () {
          if (root.parentNode) root.parentNode.removeChild(root);
        }, 700);
      }, 350);
    }, 600);
  }

  function frame() {
    if (finished) return;
    var el = performance.now() - start;
    var a = assets();
    if (doneEl.textContent !== String(a.done)) doneEl.textContent = a.done;
    if (totalEl.textContent !== String(a.total)) totalEl.textContent = a.total;
    var raw = a.done / a.total;
    if (loaded) raw = 1;
    var cap = el < 400 ? 0.9 : 1;
    var target = Math.min(raw, cap) * 100;
    p += (target - p) * 0.14;
    if (target - p < 0.4) p = target;
    setOdo(p);
    var pr = p / 100;
    for (var i = 0; i < cells.length; i++) {
      var c = cells[i];
      if (pr >= Number(c.dataset.th)) {
        if (!c.classList.contains("on")) c.classList.add("on");
      }
    }
    if ((raw >= 1 && el >= MIN_SHOW) || el > HARD_CAP) { finish(); return; }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
