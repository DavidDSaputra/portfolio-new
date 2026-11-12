"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion, type MotionValue } from "motion/react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { cn } from "@/lib/cn";
import { hero } from "@/lib/content";

/* 3D retro CRT monitor (raw three.js). The "screen" mesh is re-skinned with a
   canvas texture we paint ourselves: typed code first, then a cross-fading
   slideshow of project screenshots, under a tiny title bar + CRT scanlines.

   The GLB's screen mesh has clean 0–1 planar UVs in glTF orientation (v = 0 at
   the top edge), so the canvas texture is used with flipY = false. */

interface RetroMacProps {
  className?: string;
  /** Shown (aria-hidden) until the model is ready, and kept if WebGL fails. */
  fallback?: ReactNode;
  /** 0 → 1 scroll progress of the hero; adds a little extra rotation. */
  scrollProgress?: MotionValue<number>;
}

type Status = "loading" | "ready" | "failed";

/* ── Screen painter ──────────────────────────────────────────────────────── */

const SCREEN_W = 768;
const SCREEN_H = 592; // matches the screen mesh aspect (0.614 × 0.474)
const BAR_H = 48;
const CHAR_MS = 28;
const CODE_HOLD_MS = 4400;
const SHOT_HOLD_MS = 3000;
const FADE_MS = 700;
const BLINK_MS = 520;

interface Palette {
  bg: string;
  ink: string;
  inkSoft: string;
  card: string;
  line: string;
  accent: string;
  butter: string;
  mint: string;
  sageInk: string;
}

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const token = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  return {
    bg: token("--color-bg", "#faf6f0"),
    ink: token("--color-ink", "#35322c"),
    inkSoft: token("--color-ink-soft", "#6b665c"),
    card: token("--color-card", "#ffffff"),
    line: token("--color-line", "#eadfd2"),
    accent: token("--color-accent", "#ff9e8f"),
    butter: token("--color-butter", "#fff4c9"),
    mint: token("--color-mint", "#d9efe2"),
    sageInk: token("--color-sage-ink", "#4f6b58"),
  };
}

interface ScreenPainter {
  canvas: HTMLCanvasElement;
  /** Advance the slideshow; returns true when the canvas was repainted. */
  update: (timeMs: number) => boolean;
  /** Paint one static frame (reduced motion); returns true when repainted. */
  paintStatic: () => boolean;
  /** Called whenever async content (image / font) arrives. */
  onContent: (listener: () => void) => void;
  dispose: () => void;
}

function createScreenPainter(fontFamily: string): ScreenPainter | null {
  const canvas = document.createElement("canvas");
  canvas.width = SCREEN_W;
  canvas.height = SCREEN_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const palette = readPalette();
  const codeLines: readonly string[] = hero.monitor.code;
  const totalChars = codeLines.reduce((sum, line) => sum + line.length, 0);
  const typingMs = totalChars * CHAR_MS;

  let disposed = false;
  let listener: (() => void) | null = null;
  let dirty = true;

  // Slide 0 is the code screen; 1..n are screenshots (ready once decoded).
  const shots = hero.monitor.screens.map((src) => {
    const img = new Image();
    const shot = { img, ready: false };
    img.decoding = "async";
    img.onload = () => {
      if (disposed) return;
      shot.ready = true;
      dirty = true;
      listener?.();
    };
    img.src = src;
    return shot;
  });
  const slideCount = shots.length + 1;
  const isReady = (index: number) => index === 0 || shots[index - 1].ready;

  if (document.fonts) {
    void document.fonts.ready.then(() => {
      if (disposed) return;
      dirty = true;
      listener?.();
    });
  }

  // Static CRT overlay (scanlines + vignette + glass sheen), painted once.
  const overlay = document.createElement("canvas");
  overlay.width = SCREEN_W;
  overlay.height = SCREEN_H;
  const octx = overlay.getContext("2d");
  if (octx) {
    octx.fillStyle = "rgba(20, 18, 14, 0.07)";
    for (let y = 0; y < SCREEN_H; y += 6) octx.fillRect(0, y, SCREEN_W, 2);
    const vignette = octx.createRadialGradient(
      SCREEN_W / 2,
      SCREEN_H / 2,
      SCREEN_H * 0.38,
      SCREEN_W / 2,
      SCREEN_H / 2,
      SCREEN_W * 0.72,
    );
    vignette.addColorStop(0, "rgba(20, 18, 14, 0)");
    vignette.addColorStop(1, "rgba(20, 18, 14, 0.38)");
    octx.fillStyle = vignette;
    octx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    const sheen = octx.createLinearGradient(0, 0, SCREEN_W * 0.7, SCREEN_H);
    sheen.addColorStop(0, "rgba(255, 255, 255, 0.16)");
    sheen.addColorStop(0.35, "rgba(255, 255, 255, 0)");
    octx.fillStyle = sheen;
    octx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  }

  const drawCode = (chars: number, cursorOn: boolean) => {
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, BAR_H, SCREEN_W, SCREEN_H - BAR_H);
    ctx.font = `500 29px ${fontFamily}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";

    const left = 112;
    const top = BAR_H + 96;
    const lineHeight = 52;
    let remaining = chars;
    let cursorX = left;
    let cursorY = top;

    codeLines.forEach((line, index) => {
      const y = top + index * lineHeight;
      ctx.fillStyle = palette.line;
      ctx.textAlign = "right";
      ctx.fillText(String(index + 1).padStart(2, "0"), left - 30, y);
      ctx.textAlign = "left";
      if (remaining <= 0) return;

      const visible = line.slice(0, remaining);
      const commentAt = visible.indexOf("//");
      const code = commentAt === -1 ? visible : visible.slice(0, commentAt);
      ctx.fillStyle = palette.ink;
      ctx.fillText(code, left, y);
      if (commentAt !== -1) {
        ctx.fillStyle = palette.inkSoft;
        ctx.fillText(visible.slice(commentAt), left + ctx.measureText(code).width, y);
      }
      cursorX = left + ctx.measureText(visible).width;
      cursorY = y;
      remaining -= line.length;
    });

    if (cursorOn) {
      ctx.fillStyle = palette.accent;
      ctx.fillRect(cursorX + 4, cursorY - 17, 15, 34);
    }
  };

  const drawShot = (img: HTMLImageElement) => {
    const areaH = SCREEN_H - BAR_H;
    const scale = Math.max(SCREEN_W / img.naturalWidth, areaH / img.naturalHeight);
    const sw = SCREEN_W / scale;
    const sh = areaH / scale;
    // Cover-fit, anchored to the top (the interesting part of a page shot).
    ctx.drawImage(img, (img.naturalWidth - sw) / 2, 0, sw, sh, 0, BAR_H, SCREEN_W, areaH);
  };

  const drawSlide = (index: number, chars: number, cursorOn: boolean) => {
    if (index === 0) drawCode(chars, cursorOn);
    else drawShot(shots[index - 1].img);
  };

  const drawChrome = () => {
    ctx.globalAlpha = 1;
    ctx.fillStyle = palette.card;
    ctx.fillRect(0, 0, SCREEN_W, BAR_H);
    ctx.fillStyle = palette.line;
    ctx.fillRect(0, BAR_H - 2, SCREEN_W, 2);

    [palette.accent, palette.butter, palette.mint].forEach((color, index) => {
      ctx.beginPath();
      ctx.arc(46 + index * 24, BAR_H / 2 - 1, 7, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(53, 50, 44, 0.22)";
      ctx.stroke();
    });

    ctx.font = `500 21px ${fontFamily}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillStyle = palette.ink;
    ctx.fillText(hero.monitor.fileLabel, 130, BAR_H / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = palette.sageInk;
    ctx.fillText(hero.monitor.statusLabel, SCREEN_W - 40, BAR_H / 2);
    ctx.textAlign = "left";

    ctx.drawImage(overlay, 0, 0);
  };

  let current = 0;
  let previous = -1;
  let slideStart = 0;
  let lastChars = -1;
  let lastBlink = -1;

  const update = (timeMs: number) => {
    let elapsed = timeMs - slideStart;
    const hold = current === 0 ? CODE_HOLD_MS : SHOT_HOLD_MS;

    if (elapsed > hold) {
      let next = current;
      for (let step = 1; step <= slideCount; step++) {
        const candidate = (current + step) % slideCount;
        if (isReady(candidate)) {
          next = candidate;
          break;
        }
      }
      if (next !== current) {
        previous = current;
        current = next;
        slideStart = timeMs;
        elapsed = 0;
        dirty = true;
      }
    }

    const fading = previous !== -1 && elapsed < FADE_MS;
    let chars = totalChars;
    let cursorOn = false;
    if (current === 0) {
      chars = Math.min(totalChars, Math.floor(elapsed / CHAR_MS));
      const blink = Math.floor(timeMs / BLINK_MS);
      cursorOn = elapsed < typingMs || blink % 2 === 0;
      if (chars !== lastChars || blink !== lastBlink) dirty = true;
      lastChars = chars;
      lastBlink = blink;
    }

    if (!dirty && !fading) return false;
    dirty = false;

    ctx.globalAlpha = 1;
    if (fading) {
      drawSlide(previous, totalChars, false);
      const t = elapsed / FADE_MS;
      ctx.globalAlpha = t * t * (3 - 2 * t);
      drawSlide(current, chars, cursorOn);
    } else {
      if (previous !== -1) previous = -1;
      drawSlide(current, chars, cursorOn);
    }
    drawChrome();
    return true;
  };

  const paintStatic = () => {
    if (!dirty) return false;
    dirty = false;
    ctx.globalAlpha = 1;
    const first = shots.findIndex((shot) => shot.ready);
    if (first === -1) drawCode(totalChars, false);
    else drawShot(shots[first].img);
    drawChrome();
    return true;
  };

  return {
    canvas,
    update,
    paintStatic,
    onContent: (next) => {
      listener = next;
    },
    dispose: () => {
      disposed = true;
      listener = null;
      shots.forEach((shot) => {
        shot.img.onload = null;
        shot.img.src = "";
      });
    },
  };
}

/* ── Scene helpers ───────────────────────────────────────────────────────── */

const FOV = 30;
const BASE_YAW = -0.3;
const BASE_PITCH = 0.09;
const MAX_YAW = 0.35;
const MAX_PITCH = 0.2;

function disposeMaterial(material: THREE.Material) {
  for (const value of Object.values(material)) {
    if (value instanceof THREE.Texture) value.dispose();
  }
  material.dispose();
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.geometry.dispose();
    const materials: THREE.Material[] = Array.isArray(child.material)
      ? child.material
      : [child.material];
    materials.forEach(disposeMaterial);
  });
}

/* ── Component ───────────────────────────────────────────────────────────── */

export default function RetroMac({ className, fallback, scrollProgress }: RetroMacProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion() ?? false;
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      setStatus("failed");
      return;
    }

    const painter = createScreenPainter(getComputedStyle(wrap).fontFamily || "monospace");
    if (!painter) {
      renderer.dispose();
      setStatus("failed");
      return;
    }

    let cancelled = false;
    let ready = false;
    let running = false;
    let inView = false;
    let raf = 0;
    let last = 0;
    let clock = 0;
    let radius = 1;
    let intro = reduced ? 0 : 1;
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
    const pivot = new THREE.Group();
    scene.add(pivot);

    // Soft sky/ground fill, warm key from the upper right, cool-pink rim.
    scene.add(new THREE.HemisphereLight(0xffffff, 0xf1d9c9, 1.25));
    const key = new THREE.DirectionalLight(0xfff3e6, 2.3);
    key.position.set(2.6, 3.6, 4.2);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffc9d6, 1.1);
    rim.position.set(-3.5, 2.2, -3);
    scene.add(rim);

    const screenTexture = new THREE.CanvasTexture(painter.canvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    screenTexture.flipY = false;
    screenTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false });

    const applyPose = () => {
      const progress = scrollProgress?.get() ?? 0;
      pivot.rotation.y = BASE_YAW + eased.x * MAX_YAW + progress * 0.55 - intro * 1.15;
      pivot.rotation.x = BASE_PITCH + eased.y * MAX_PITCH - progress * 0.1 + intro * 0.18;
      pivot.rotation.z = reduced ? 0 : Math.sin(clock * 0.7) * 0.012;
      pivot.position.y = reduced ? 0 : Math.sin(clock * 1.15) * 0.028;
    };

    const renderOnce = () => {
      if (!ready || cancelled) return;
      if (reduced ? painter.paintStatic() : painter.update(clock * 1000)) {
        screenTexture.needsUpdate = true;
      }
      applyPose();
      renderer.render(scene, camera);
    };

    const fit = () => {
      const width = wrap.clientWidth;
      const height = wrap.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      const vHalf = THREE.MathUtils.degToRad(FOV / 2);
      const hHalf = Math.atan(Math.tan(vHalf) * camera.aspect);
      camera.position.set(0, 0, (radius / Math.sin(Math.min(vHalf, hHalf))) * 0.95);
      camera.updateProjectionMatrix();
      renderOnce();
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      clock += dt;
      const follow = 1 - Math.exp(-dt * 5);
      eased.x += (pointer.x - eased.x) * follow;
      eased.y += (pointer.y - eased.y) * follow;
      intro += (0 - intro) * (1 - Math.exp(-dt * 2.8));
      if (painter.update(clock * 1000)) screenTexture.needsUpdate = true;
      applyPose();
      renderer.render(scene, camera);
    };

    const sync = () => {
      const shouldRun = ready && !reduced && inView && !document.hidden;
      if (shouldRun && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    painter.onContent(() => {
      if (reduced) renderOnce();
    });

    new GLTFLoader().load(
      hero.monitor.model,
      (gltf) => {
        const model = gltf.scene;
        if (cancelled) {
          disposeObject(model);
          return;
        }
        model.traverse((child) => {
          if (child instanceof THREE.Mesh && child.name === "screen") {
            const original: THREE.Material[] = Array.isArray(child.material)
              ? child.material
              : [child.material];
            original.forEach(disposeMaterial);
            child.material = screenMaterial;
          }
        });

        // Centre the model on the pivot so it spins around its middle.
        const box = new THREE.Box3().setFromObject(model);
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        model.position.sub(sphere.center);
        radius = sphere.radius || 1;
        pivot.add(model);

        ready = true;
        fit();
        renderOnce();
        setStatus("ready");
        sync();
      },
      undefined,
      () => {
        if (!cancelled) setStatus("failed");
      },
    );

    const resizeObserver = new ResizeObserver(fit);
    resizeObserver.observe(wrap);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { rootMargin: "80px" },
    );
    intersectionObserver.observe(wrap);

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = THREE.MathUtils.clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1);
      pointer.y = THREE.MathUtils.clamp((event.clientY / window.innerHeight) * 2 - 1, -1, 1);
    };
    const onPointerReset = () => {
      pointer.x = 0;
      pointer.y = 0;
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      ready = false;
      sync();
      setStatus("failed");
    };

    document.addEventListener("visibilitychange", sync);
    canvas.addEventListener("webglcontextlost", onContextLost);
    if (!reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerReset);
      window.addEventListener("blur", onPointerReset);
    }

    return () => {
      cancelled = true;
      ready = false;
      running = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerReset);
      window.removeEventListener("blur", onPointerReset);
      painter.dispose();
      disposeObject(scene);
      screenTexture.dispose();
      screenMaterial.dispose();
      renderer.dispose();
      setStatus("loading");
    };
  }, [reduced, scrollProgress]);

  const isReady = status === "ready";

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={hero.monitor.alt}
      className={cn("relative size-full font-mono", className)}
    >
      {fallback ? (
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0",
            !reduced && "transition-opacity duration-700 ease-out-expo",
            isReady ? "opacity-0" : "opacity-100",
          )}
        >
          {fallback}
        </div>
      ) : null}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn(
          "absolute inset-0 size-full",
          !reduced && "transition-opacity duration-700 ease-out-expo",
          isReady ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
