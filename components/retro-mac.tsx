"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion, type MotionValue } from "motion/react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { cn } from "@/lib/cn";
import { showcase } from "@/lib/content";

/* 3D retro CRT monitor (raw three.js), used as a little TV. The "screen" mesh
   is re-skinned with a canvas texture we paint ourselves: channel 0 types out
   code, every other channel shows a project screenshot that slowly scrolls.
   Switching channels plays a burst of CRT static and a "CH 03" overlay.

   The GLB's screen mesh has clean 0–1 planar UVs in glTF orientation (v = 0 at
   the top edge), so the canvas texture is used with flipY = false. */

export interface MonitorChannel {
  /** Screenshot; leave out for the typed-code channel. */
  src?: string;
  /** Title-bar label, e.g. "jarwinn-official.website". */
  label: string;
  /** Right side of the title bar, e.g. "Live". */
  status: string;
}

interface RetroMacProps {
  channels: readonly MonitorChannel[];
  /** Index into `channels` the monitor is tuned to. */
  active: number;
  className?: string;
  /** Shown (aria-hidden) until the model is ready, and kept if WebGL fails. */
  fallback?: ReactNode;
  /** 0 → 1 scroll progress of the section; adds a little extra rotation. */
  scrollProgress?: MotionValue<number>;
}

type Status = "loading" | "ready" | "failed";

/* ── Screen painter ──────────────────────────────────────────────────────── */

const SCREEN_W = 768;
const SCREEN_H = 592; // matches the screen mesh aspect (0.614 × 0.474)
const BAR_H = 48;
const CHAR_MS = 28;
const BLINK_MS = 520;
/** Length of the static burst between two channels. */
const SWITCH_MS = 560;
/** How long the "CH 03" overlay stays up after a switch. */
const OSD_MS = 1600;
/** Seconds for one top → bottom pass of a scrolling screenshot. */
const PAN_S = 9;
const NOISE_W = 192;
const NOISE_H = 148;

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
    bg: token("--color-bg", "#fdfbe6"),
    ink: token("--color-ink", "#133458"),
    inkSoft: token("--color-ink-soft", "#4a5e78"),
    card: token("--color-card", "#fffef7"),
    line: token("--color-line", "#ebe5c2"),
    accent: token("--color-accent", "#d99b21"),
    butter: token("--color-butter", "#faf7bb"),
    mint: token("--color-mint", "#ecedcc"),
    sageInk: token("--color-sage-ink", "#5a5f14"),
  };
}

interface ScreenPainter {
  canvas: HTMLCanvasElement;
  /** Tune to another channel (applied on the next paint). */
  setTarget: (index: number) => void;
  /** Advance the animation; returns true when the canvas was repainted. */
  update: (timeMs: number) => boolean;
  /** Paint one static frame (reduced motion); returns true when repainted. */
  paintStatic: () => boolean;
  /** Called whenever async content (image / font) arrives. */
  onContent: (listener: () => void) => void;
  dispose: () => void;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

function createScreenPainter(
  fontFamily: string,
  channels: readonly MonitorChannel[],
  initial: number,
): ScreenPainter | null {
  const canvas = document.createElement("canvas");
  canvas.width = SCREEN_W;
  canvas.height = SCREEN_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const palette = readPalette();
  const codeLines: readonly string[] = showcase.monitor.code;
  const totalChars = codeLines.reduce((sum, line) => sum + line.length, 0);
  const typingMs = totalChars * CHAR_MS;

  let disposed = false;
  let listener: (() => void) | null = null;
  let dirty = true;

  const shots = channels.map((channel) => {
    if (!channel.src) return null;
    const img = new Image();
    const shot = { img, ready: false };
    img.decoding = "async";
    img.onload = () => {
      if (disposed) return;
      shot.ready = true;
      dirty = true;
      listener?.();
    };
    img.src = channel.src;
    return shot;
  });

  if (document.fonts) {
    void document.fonts.ready.then(() => {
      if (disposed) return;
      dirty = true;
      listener?.();
    });
  }

  // A few frames of grey snow, drawn scaled up with smoothing off.
  const noiseFrames = Array.from({ length: 4 }, () => {
    const frame = document.createElement("canvas");
    frame.width = NOISE_W;
    frame.height = NOISE_H;
    const nctx = frame.getContext("2d");
    if (nctx) {
      const data = nctx.createImageData(NOISE_W, NOISE_H);
      for (let i = 0; i < data.data.length; i += 4) {
        const v = 40 + Math.random() * 200;
        data.data[i] = v;
        data.data[i + 1] = v;
        data.data[i + 2] = v * 0.96;
        data.data[i + 3] = 255;
      }
      nctx.putImageData(data, 0, 0);
    }
    return frame;
  });

  // Static CRT overlay (scanlines + vignette + glass sheen), painted once.
  const overlay = document.createElement("canvas");
  overlay.width = SCREEN_W;
  overlay.height = SCREEN_H;
  const octx = overlay.getContext("2d");
  if (octx) {
    octx.fillStyle = "rgba(8, 22, 38, 0.07)";
    for (let y = 0; y < SCREEN_H; y += 6) octx.fillRect(0, y, SCREEN_W, 2);
    const vignette = octx.createRadialGradient(
      SCREEN_W / 2,
      SCREEN_H / 2,
      SCREEN_H * 0.38,
      SCREEN_W / 2,
      SCREEN_H / 2,
      SCREEN_W * 0.72,
    );
    vignette.addColorStop(0, "rgba(8, 22, 38, 0)");
    vignette.addColorStop(1, "rgba(8, 22, 38, 0.38)");
    octx.fillStyle = vignette;
    octx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    const sheen = octx.createLinearGradient(0, 0, SCREEN_W * 0.7, SCREEN_H);
    sheen.addColorStop(0, "rgba(255, 255, 255, 0.16)");
    sheen.addColorStop(0.35, "rgba(255, 255, 255, 0)");
    octx.fillStyle = sheen;
    octx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  }

  const areaH = SCREEN_H - BAR_H;

  const drawCode = (chars: number, cursorOn: boolean) => {
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, BAR_H, SCREEN_W, areaH);
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

  const drawNoise = (alpha: number, timeMs: number) => {
    const frame = noiseFrames[Math.floor(timeMs / 40) % noiseFrames.length];
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(frame, 0, BAR_H, SCREEN_W, areaH);
    ctx.restore();
  };

  /* `pan` 0 → 1 scrolls a tall screenshot from its top to its bottom. */
  const drawShot = (img: HTMLImageElement, pan: number) => {
    const scale = Math.max(SCREEN_W / img.naturalWidth, areaH / img.naturalHeight);
    const sw = SCREEN_W / scale;
    const sh = areaH / scale;
    const sy = Math.max(0, img.naturalHeight - sh) * pan;
    ctx.drawImage(img, (img.naturalWidth - sw) / 2, sy, sw, sh, 0, BAR_H, SCREEN_W, areaH);
  };

  /* Ping-pong pan with eased ends, so the page lingers at top and bottom. */
  const panAt = (elapsedMs: number) => {
    const phase = (elapsedMs / 1000 / PAN_S) % 2;
    const t = phase < 1 ? phase : 2 - phase;
    return smooth(Math.min(1, Math.max(0, t * 1.3 - 0.15)));
  };

  const drawChannel = (index: number, elapsedMs: number, timeMs: number) => {
    const shot = shots[index];
    if (!shot) {
      const chars = Math.min(totalChars, Math.floor(elapsedMs / CHAR_MS));
      const blink = Math.floor(timeMs / BLINK_MS);
      drawCode(chars, elapsedMs < typingMs || blink % 2 === 0);
      return;
    }
    if (shot.ready) {
      drawShot(shot.img, panAt(elapsedMs));
    } else {
      // Not decoded yet: keep the snow running until it arrives.
      drawNoise(1, timeMs);
    }
  };

  const drawChrome = (index: number) => {
    const channel = channels[index];
    ctx.globalAlpha = 1;
    ctx.fillStyle = palette.card;
    ctx.fillRect(0, 0, SCREEN_W, BAR_H);
    ctx.fillStyle = palette.line;
    ctx.fillRect(0, BAR_H - 2, SCREEN_W, 2);

    [palette.accent, palette.butter, palette.mint].forEach((color, dot) => {
      ctx.beginPath();
      ctx.arc(46 + dot * 24, BAR_H / 2 - 1, 7, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(19, 52, 88, 0.22)";
      ctx.stroke();
    });

    ctx.font = `500 21px ${fontFamily}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillStyle = palette.ink;
    ctx.fillText(channel?.label ?? "", 130, BAR_H / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = palette.sageInk;
    ctx.fillText(channel?.status ?? "", SCREEN_W - 40, BAR_H / 2);
    ctx.textAlign = "left";
  };

  /* Old-TV on-screen display: big channel number, bottom left. */
  const drawOsd = (index: number, alpha: number) => {
    if (alpha <= 0) return;
    const text = `${showcase.channelPrefix} ${String(index).padStart(2, "0")}`;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = `700 46px ${fontFamily}`;
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    ctx.lineWidth = 8;
    ctx.strokeStyle = "rgba(8, 22, 38, 0.55)";
    ctx.strokeText(text, 40, SCREEN_H - 36);
    ctx.fillStyle = "#faf7bb";
    ctx.fillText(text, 40, SCREEN_H - 36);
    ctx.restore();
  };

  let current = Math.min(Math.max(0, initial), channels.length - 1);
  let previous = -1;
  let pending: number | null = null;
  let switchStart = 0;
  let lastChars = -1;
  let lastBlink = -1;

  const update = (timeMs: number) => {
    if (pending !== null) {
      if (pending !== current) {
        previous = current;
        current = pending;
        switchStart = timeMs;
      }
      pending = null;
    }

    const elapsed = timeMs - switchStart;
    const switching = previous !== -1 && elapsed < SWITCH_MS;
    const osdOn = elapsed < OSD_MS && switchStart > 0;
    const shot = shots[current];
    // Screenshots pan (or wait behind snow), so they repaint every frame.
    const animated = switching || osdOn || Boolean(shot);

    if (!shot) {
      const chars = Math.min(totalChars, Math.floor(elapsed / CHAR_MS));
      const blink = Math.floor(timeMs / BLINK_MS);
      if (chars !== lastChars || blink !== lastBlink) dirty = true;
      lastChars = chars;
      lastBlink = blink;
    }

    if (!dirty && !animated) return false;
    dirty = false;
    ctx.globalAlpha = 1;

    if (switching) {
      const t = elapsed / SWITCH_MS;
      // First half: the old picture dissolves into snow; second half: the new
      // one tunes in out of it.
      if (t < 0.5) drawChannel(previous, SWITCH_MS, timeMs);
      else drawChannel(current, 0, timeMs);
      drawNoise(1 - Math.abs(t - 0.5) * 1.6, timeMs);
      // A bright roll bar sweeping down, like a TV losing vertical hold.
      const barY = BAR_H + ((t * 1.6) % 1) * areaH;
      ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
      ctx.fillRect(0, barY, SCREEN_W, 34);
    } else {
      if (previous !== -1) previous = -1;
      drawChannel(current, Math.max(0, elapsed - SWITCH_MS / 2), timeMs);
    }

    if (osdOn) {
      const fadeOut = 1 - Math.max(0, (elapsed - (OSD_MS - 400)) / 400);
      drawOsd(current, Math.min(1, fadeOut));
    }
    drawChrome(current);
    ctx.drawImage(overlay, 0, 0);
    return true;
  };

  const paintStatic = () => {
    if (pending !== null) {
      if (pending !== current) dirty = true;
      current = pending;
      pending = null;
    }
    if (!dirty) return false;
    dirty = false;
    ctx.globalAlpha = 1;
    const shot = shots[current];
    if (!shot) drawCode(totalChars, false);
    else if (shot.ready) drawShot(shot.img, 0);
    else {
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, BAR_H, SCREEN_W, areaH);
    }
    drawChrome(current);
    ctx.drawImage(overlay, 0, 0);
    return true;
  };

  return {
    canvas,
    setTarget: (index) => {
      pending = Math.min(Math.max(0, index), channels.length - 1);
    },
    update,
    paintStatic,
    onContent: (next) => {
      listener = next;
    },
    dispose: () => {
      disposed = true;
      listener = null;
      shots.forEach((shot) => {
        if (!shot) return;
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

export default function RetroMac({
  channels,
  active,
  className,
  fallback,
  scrollProgress,
}: RetroMacProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion() ?? false;
  const [status, setStatus] = useState<Status>("loading");
  /* The scene is built once; channel changes reach it through these refs. */
  const activeRef = useRef(active);
  const channelsRef = useRef(channels);
  const tuneRef = useRef<((index: number) => void) | null>(null);

  useEffect(() => {
    activeRef.current = active;
    tuneRef.current?.(active);
  }, [active]);

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

    const painter = createScreenPainter(
      getComputedStyle(wrap).fontFamily || "monospace",
      channelsRef.current,
      activeRef.current,
    );
    if (!painter) {
      renderer.dispose();
      setStatus("failed");
      return;
    }

    let cancelled = false;
    let ready = false;
    let loaded = false;
    let contextLost = false;
    let running = false;
    let inView = false;
    let raf = 0;
    let last = 0;
    let clock = 0;
    let radius = 1;
    let intro = reduced ? 0 : 1;
    /* A little jolt of the whole set on every channel change. */
    let kick = 0;
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
      const jolt = reduced ? 0 : Math.sin(kick * 18) * kick * 0.05;
      pivot.rotation.y = BASE_YAW + eased.x * MAX_YAW + (progress - 0.5) * 0.5 - intro * 1.15;
      pivot.rotation.x = BASE_PITCH + eased.y * MAX_PITCH - progress * 0.08 + intro * 0.18;
      pivot.rotation.z = (reduced ? 0 : Math.sin(clock * 0.7) * 0.012) + jolt;
      pivot.position.y = reduced ? 0 : Math.sin(clock * 1.15) * 0.028;
    };

    const renderOnce = () => {
      if (!ready || cancelled) return;
      if (reduced ? painter.paintStatic() : painter.update(performance.now())) {
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
      kick += (0 - kick) * (1 - Math.exp(-dt * 4));
      // Wall-clock time, so a throttled tab still finishes a channel switch on time.
      if (painter.update(now)) screenTexture.needsUpdate = true;
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

    tuneRef.current = (index) => {
      painter.setTarget(index);
      kick = 1;
      if (reduced) renderOnce();
    };

    painter.onContent(() => {
      if (reduced) renderOnce();
    });

    new GLTFLoader().load(
      showcase.monitor.model,
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

        loaded = true;
        // If the context is currently lost, onContextRestored brings it up.
        if (contextLost) return;
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
      contextLost = true;
      ready = false;
      sync();
      setStatus("failed");
    };
    // preventDefault above asks the browser to restore the context; three
    // re-initialises its GL state itself, we only need to resume drawing.
    const onContextRestored = () => {
      contextLost = false;
      if (cancelled || !loaded) return;
      ready = true;
      screenTexture.needsUpdate = true;
      fit();
      setStatus("ready");
      sync();
    };

    document.addEventListener("visibilitychange", sync);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    if (!reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerReset);
      window.addEventListener("blur", onPointerReset);
    }

    return () => {
      cancelled = true;
      ready = false;
      running = false;
      tuneRef.current = null;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
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
      aria-label={showcase.monitor.alt}
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
