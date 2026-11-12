"use client";

import { useEffect, useId, useRef, useState } from "react";
import "./liquid-project-gallery.css";

// A real moving mask: the incoming image is revealed behind an organic,
// illuminated edge. Only SVG paths are updated per frame, not React state.
function wave(progress, direction) {
  const travel = -130 + progress * 1260;
  const amplitude = Math.sin(progress * Math.PI) * 65;
  const points = Array.from({ length: 41 }, (_, i) => {
    const y = i * 15;
    const ripple = Math.sin(i / 40 * Math.PI * 3 + progress * 7)
      + Math.sin(i / 40 * Math.PI * 5 - progress * 4) * 0.35;
    const x = travel + ripple * amplitude;
    return `${direction > 0 ? x : 1000 - x},${y}`;
  });
  const edge = `M${points.join(" L")}`;
  const side = direction > 0 ? -200 : 1200;
  return { edge, mask: `${edge} L${side},600 L${side},0 Z` };
}

export default function LiquidProjectGallery({ slides, onPreview }) {
  const [current, setCurrent] = useState(slides[0]);
  const [incoming, setIncoming] = useState(null);
  const [direction, setDirection] = useState(1);
  const [failedImage, setFailedImage] = useState(null);
  const clipId = `liquid-${useId().replace(/:/g, "")}`;
  const maskRef = useRef(null);
  const glowRef = useRef(null);
  const edgeRef = useRef(null);
  const thumbsRef = useRef(null);
  const gesture = useRef(null);
  const selected = incoming || current;
  const index = Math.max(0, slides.findIndex((slide) => slide.id === selected?.id));

  useEffect(() => {
    setDirection(1);
    setIncoming(slides[0]);
  }, [slides]);

  useEffect(() => {
    if (!incoming) return;
    let cancelled = false;
    let frame = 0;
    const finish = () => {
      if (cancelled) return;
      setCurrent(incoming);
      setIncoming(null);
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPreference = () => {
      if (reduce.matches) {
        cancelAnimationFrame(frame);
        finish();
      }
    };
    reduce.addEventListener("change", onPreference);
    // Decode before wiping so a slow connection never reveals an empty frame.
    const image = new Image();
    image.src = incoming.image;
    image.decode().then(() => {
      if (cancelled) return;
      if (reduce.matches || incoming.id === current.id) return finish();
      const start = performance.now();
      const tick = (time) => {
        if (cancelled) return;
        const elapsed = Math.min(1, (time - start) / 850);
        const eased = elapsed * elapsed * (3 - 2 * elapsed);
        const { edge, mask } = wave(eased, direction);
        maskRef.current?.setAttribute("d", mask);
        glowRef.current?.setAttribute("d", edge);
        edgeRef.current?.setAttribute("d", edge);
        if (elapsed < 1) frame = requestAnimationFrame(tick);
        else finish();
      };
      frame = requestAnimationFrame(tick);
    }).catch(() => {
      if (!cancelled) {
        setFailedImage(incoming.id);
        finish();
      }
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      reduce.removeEventListener("change", onPreference);
    };
  }, [incoming, direction, current.id]);

  // Warm only the next image; the archive can contain many large previews.
  useEffect(() => {
    if (slides.length < 2) return;
    const image = new Image();
    image.src = slides[(index + 1) % slides.length].image;
  }, [index, slides]);

  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.querySelector('[aria-pressed="true"]');
    if (!thumb) return;
    if (thumb.offsetLeft < strip.scrollLeft || thumb.offsetLeft + thumb.offsetWidth > strip.scrollLeft + strip.clientWidth) {
      strip.scrollTo({
        left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
    }
  }, [selected?.id]);

  const select = (nextIndex, nextDirection = 1) => {
    const next = slides[(nextIndex + slides.length) % slides.length];
    if (!next || next.id === selected?.id) return;
    setDirection(nextDirection);
    setIncoming(next);
  };

  if (!current) return null;
  const initial = wave(0, direction);
  return (
    <section className="liquid-gallery" aria-label="All projects" aria-roledescription="carousel"
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const step = event.key === "ArrowLeft" ? -1 : 1;
        select(index + step, step);
      }}>
      <div className="liquid-gallery__stage" tabIndex={0}
        aria-label="Preview project. Geser kiri atau kanan untuk mengganti project."
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          const start = gesture.current;
          gesture.current = null;
          if (!start || start.id !== event.pointerId) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.3) {
            const step = dx < 0 ? 1 : -1;
            select(index + step, step);
          }
        }}
        onPointerCancel={() => { gesture.current = null; }}
        onLostPointerCapture={() => { gesture.current = null; }}>
        <span className="liquid-gallery__fallback">{current.title}</span>
        {failedImage !== current.id && <img className="liquid-gallery__image" src={current.image}
          alt={current.title} draggable="false" style={{ objectFit: current.fit || "cover" }}
          onError={() => setFailedImage(current.id)} />}
        {incoming && <svg key={`${incoming.id}-${direction}`} className="liquid-gallery__wipe"
          viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <defs><clipPath id={clipId}><path ref={maskRef} d={initial.mask} /></clipPath></defs>
          <g clipPath={`url(#${clipId})`}>
            <rect width="1000" height="600" fill="var(--surface, #eee)" />
            <image href={incoming.image} width="1000" height="600"
              preserveAspectRatio={incoming.fit === "contain" ? "xMidYMid meet" : "xMidYMid slice"} />
          </g>
          <path ref={glowRef} d={initial.edge} className="liquid-gallery__glow" />
          <path ref={edgeRef} d={initial.edge} className="liquid-gallery__edge" />
        </svg>}
        <span className="liquid-gallery__badge" aria-hidden="true">{String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
      </div>
      <div className="liquid-gallery__details">
        <div className="liquid-gallery__copy" aria-live="polite" aria-atomic="true">
          <span className="liquid-gallery__tag">{current.tag}</span>
          <h4>{current.title}</h4>
          <p>{current.desc}</p>
          <div className="liquid-gallery__actions">
            <button type="button" onClick={() => onPreview(current.id)}>Detail project <span aria-hidden="true">↗</span></button>
            {current.href && <a href={current.href} target="_blank" rel="noopener noreferrer">
              {current.download ? "Download APK" : "Kunjungi project"} <span aria-hidden="true">↗</span>
            </a>}
          </div>
        </div>
        <div className="liquid-gallery__nav">
          <button type="button" aria-label="Project sebelumnya" disabled={slides.length < 2} onClick={() => select(index - 1, -1)}>←</button>
          <button type="button" aria-label="Project berikutnya" disabled={slides.length < 2} onClick={() => select(index + 1, 1)}>→</button>
        </div>
      </div>
      <div ref={thumbsRef} className="liquid-gallery__thumbs" aria-label="Pilih project" data-lenis-prevent>
        {slides.map((slide, i) => <button key={slide.id} type="button"
          aria-label={`Tampilkan ${slide.title}`} aria-pressed={selected?.id === slide.id}
          onClick={() => select(i, i < index ? -1 : 1)}>
          <img src={slide.thumbnail || slide.image} alt="" loading="lazy" draggable="false" />
          <span>{String(i + 1).padStart(2, "0")}</span>
        </button>)}
      </div>
      <p className="liquid-gallery__hint">Geser preview atau pilih thumbnail untuk menjelajah.</p>
    </section>
  );
}
