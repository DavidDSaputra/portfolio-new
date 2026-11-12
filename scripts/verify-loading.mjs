// Regression checks for the actual browser scripts using a small DOM/timer
// harness. Run with: node --test scripts/verify-loading.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { test } from "node:test";

const layout = readFileSync(new URL("../app/layout.js", import.meta.url), "utf8");
const head = layout.match(/__html:\s*`([\s\S]*?)`/)[1];
const preloader = readFileSync(new URL("../public/js/preloader.js", import.meta.url), "utf8");
const smooth = readFileSync(new URL("../public/js/smooth-scroll.js", import.meta.url), "utf8");

function harness({ reduce = false, splash = true, loaded = true } = {}) {
  let now = 0, sequence = 0;
  const tasks = new Map(), observers = [], nodes = new Map();
  class Element {
    constructor() {
      const classes = new Set();
      this.classList = {
        add: (name) => { classes.add(name); observers.forEach((cb) => cb()); },
        remove: (name) => { classes.delete(name); observers.forEach((cb) => cb()); },
        contains: (name) => classes.has(name),
      };
      this.style = { setProperty() {} };
      this.dataset = {};
      this.textContent = "";
      this.children = [];
      this.parentNode = { removeChild: () => nodes.delete("mnPre") };
    }
    appendChild(child) { this.children.push(child); }
    remove() { nodes.delete("mnPre"); }
  }
  for (const id of ["mnPre", "preWords", "preGrid", "preCount", "preDone", "preTotal"]) nodes.set(id, new Element());
  if (!splash) nodes.delete("mnPre");
  const root = new Element();
  const document = Object.assign(new EventTarget(), {
    documentElement: root,
    readyState: loaded ? "complete" : "interactive",
    images: [{ loading: "eager", complete: loaded }],
    getElementById: (id) => nodes.get(id),
    createElement: () => new Element(),
    querySelector: () => new Element(),
  });
  const window = Object.assign(new EventTarget(), {
    matchMedia: () => ({ matches: reduce }),
    Lenis: class {
      isStopped = false;
      calls = [];
      stop() { this.isStopped = true; this.calls.push("stop"); }
      start() { this.isStopped = false; this.calls.push("start"); }
      scrollTo() { this.calls.push("scroll"); }
      raf() {}
    },
  });
  const schedule = (cb, delay, repeat = false) => {
    const id = ++sequence;
    tasks.set(id, { cb, time: now + delay, delay, repeat });
    return id;
  };
  const raf = (cb) => schedule(() => cb(now), 16);
  window.requestAnimationFrame = raf;
  const context = vm.createContext({
    window, document, performance: { now: () => now },
    setTimeout: schedule, clearTimeout: (id) => tasks.delete(id),
    setInterval: (cb, delay) => schedule(cb, delay, true), clearInterval: (id) => tasks.delete(id),
    requestAnimationFrame: raf,
    MutationObserver: class { constructor(cb) { this.cb = cb; } observe() { observers.push(this.cb); } },
  });
  return {
    root, document, window, nodes,
    run: (code) => vm.runInContext(code, context),
    until(target) {
      for (let count = 0; count < 10000; count++) {
        const next = [...tasks].sort((a, b) => a[1].time - b[1].time)[0];
        if (!next || next[1].time > target) { now = target; return; }
        const [id, task] = next;
        now = task.time;
        tasks.delete(id);
        if (task.repeat) tasks.set(id, { ...task, time: now + task.delay });
        task.cb();
      }
      throw new Error("Timer harness did not settle");
    },
  };
}

test("scroll inputs and Lenis stay locked through the entire curtain exit", () => {
  const h = harness();
  h.run(head); h.run(smooth); h.run(preloader);
  for (const type of ["wheel", "touchmove", "keydown"]) {
    const event = new Event(type, { cancelable: true });
    Object.defineProperty(event, "key", { value: "PageDown" });
    h.window.dispatchEvent(event);
    assert.equal(event.defaultPrevented, true, type);
  }
  h.until(2800);
  assert.equal(h.nodes.get("mnPre").classList.contains("is-lift"), true);
  assert.equal(h.root.classList.contains("pre-lock"), true);
  assert.equal(h.window.__lenis.isStopped, true);
  h.until(3500);
  assert.equal(h.nodes.has("mnPre"), false);
  assert.equal(h.root.classList.contains("pre-lock"), false);
  assert.deepEqual(h.window.__lenis.calls, ["stop", "start"]);
  const event = new Event("wheel", { cancelable: true });
  h.window.dispatchEvent(event);
  assert.equal(event.defaultPrevented, false);
});

test("late Lenis initialization also observes the splash lock", () => {
  const h = harness();
  h.run(head); h.run(preloader); h.until(2400); h.run(smooth);
  assert.equal(h.window.__lenis.isStopped, true);
  h.until(3500);
  assert.equal(h.window.__lenis.isStopped, false);
  h.run(smooth);
  assert.deepEqual(h.window.__lenis.calls, ["stop", "start"]);
});

test("a stalled asset cannot permanently lock the page", () => {
  const h = harness({ loaded: false });
  h.run(head); h.run(preloader); h.run(smooth);
  h.until(7000);
  assert.equal(h.root.classList.contains("pre-lock"), true);
  h.until(8000);
  assert.equal(h.root.classList.contains("pre-lock"), false);
  assert.equal(h.nodes.has("mnPre"), false);
});

test("the failsafe unlocks even if completion was flagged before a script error", () => {
  const h = harness();
  h.run(head); h.run(smooth);
  h.root.classList.add("pre-done");
  h.until(12001);
  assert.equal(h.root.classList.contains("pre-lock"), false);
  assert.equal(h.nodes.has("mnPre"), false);
  assert.equal(h.window.__lenis.isStopped, false);
});

test("reduced motion and pages without a splash remain usable", () => {
  const reduced = harness({ reduce: true });
  reduced.run(head); reduced.run(preloader); reduced.run(smooth);
  assert.equal(reduced.root.classList.contains("pre-lock"), false);
  assert.equal(reduced.nodes.has("mnPre"), false);
  assert.equal(reduced.window.__lenis, undefined);
  const noSplash = harness({ splash: false });
  noSplash.run(head);
  noSplash.document.dispatchEvent(new Event("DOMContentLoaded"));
  assert.equal(noSplash.root.classList.contains("pre-lock"), false);
});

test("theme changes do not resume Lenis stopped by another interaction", () => {
  const h = harness();
  h.run(smooth);
  h.window.__lenis.stop();
  h.root.classList.add("dark");
  assert.equal(h.window.__lenis.isStopped, true);
});
