/**
 * emotion-styles.js
 * Enhanced visual styles for David Saputra's portfolio
 * using @emotion/css (standalone UMD) loaded via CDN.
 *
 * Effects applied:
 *  1. Global   — enhanced selection colour & scroll-bar glow
 *  2. Hero     — shimmer gradient sweep on title hover
 *  3. Hero     — animated underline on subtitle hover
 *  4. Sections — blinking terminal cursor on heading hover
 *  5. Footer   — animated flowing gradient on CTA text
 *  6. Buttons  — ripple wave on click (brew controls + Let's Talk)
 *  7. Profile  — subtle brightness/scale lift on image hover
 *  8. Tech heading — wobble animation on hover
 *  9. Nav pill  — breathing glow on active tab
 */

(function () {
  'use strict';

  function initEmotionStyles() {
    // @emotion/css UMD exposes itself as window.emotion (not window.emotionCss)
    var lib = window.emotion || window.emotionCss;

    // Retry if CDN hasn't loaded yet
    if (!lib || typeof lib.css !== 'function') {
      setTimeout(initEmotionStyles, 150);
      return;
    }

    var css = lib.css;
    var injectGlobal = lib.injectGlobal;
    var keyframes = lib.keyframes;

    /* ============================================================
       GLOBAL ENHANCEMENTS
       ============================================================ */
    injectGlobal`
      /* Softer, brand-coloured text selection */
      ::selection {
        background: rgba(74, 123, 167, 0.18);
        color: #0c0e0f;
      }

      /* Scroll-progress bar — richer gradient + glow */
      .scroll-progress-bar {
        background: linear-gradient(90deg, #4a7ba7, #c85f6f) !important;
        box-shadow:
          0 0 14px rgba(74, 123, 167, 0.75),
          0 0  6px rgba(200, 95, 111, 0.45) !important;
        height: 3px !important;
      }
    `;

    /* ============================================================
       1. HERO TITLE — shimmer gradient sweep on hover
       ============================================================ */
    var shimmerSweep = keyframes`
      0%   { background-position: 200% center; }
      100% { background-position: -200% center; }
    `;

    var heroTitleStyle = css`
      &:hover {
        background: linear-gradient(
          90deg,
          #0c0e0f 20%,
          #4a7ba7 40%,
          #c85f6f 60%,
          #0c0e0f 80%
        );
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: ${shimmerSweep} 0.9s linear forwards;
      }
    `;

    var heroTitle = document.querySelector('.akito-hero-title');
    if (heroTitle) heroTitle.classList.add(heroTitleStyle);

    /* ============================================================
       2. HERO SUBTITLE — animated underline on hover
       ============================================================ */
    var subtitleStyle = css`
      &::after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 60px;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, #4a7ba7, #c85f6f);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        pointer-events: none;
      }
      &:hover::after {
        transform: scaleX(1);
      }
    `;

    var subtitle = document.querySelector('.akito-hero-subtitle');
    if (subtitle) subtitle.classList.add(subtitleStyle);

    /* ============================================================
       3. SECTION HEADINGS — terminal cursor blink on hover
       ============================================================ */
    var blinkCursor = keyframes`
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    `;

    var sectionHeadingStyle = css`
      &::after {
        content: '█';
        display: inline-block;
        margin-left: 6px;
        font-size: 0.6em;
        vertical-align: middle;
        color: #4a7ba7;
        -webkit-text-fill-color: #4a7ba7;
        opacity: 0;
        animation: none;
        transition: opacity 0.25s ease;
        font-family: 'Fira Code', monospace;
      }
      &:hover::after {
        opacity: 1;
        animation: ${blinkCursor} 0.85s step-end infinite;
      }
    `;

    document.querySelectorAll('.section-heading-article').forEach(function (el) {
      el.classList.add(sectionHeadingStyle);
    });

    /* ============================================================
       4. FOOTER CTA — animated flowing gradient text
       ============================================================ */
    var gradientFlow = keyframes`
      0%   { background-position:   0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position:   0% 50%; }
    `;

    var footerCTAStyle = css`
      background: linear-gradient(
        135deg,
        #ffffff  0%,
        #ffffff 28%,
        #4a7ba7 42%,
        #c85f6f 58%,
        #ffffff 72%,
        #ffffff 100%
      ) !important;
      background-size: 300% 300% !important;
      background-clip: text !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      animation: ${gradientFlow} 5s ease infinite !important;
    `;

    var footerCTA = document.querySelector('.akito-footer .two-words article');
    if (footerCTA) footerCTA.classList.add(footerCTAStyle);

    /* ============================================================
       5. RIPPLE EFFECT — shared animation for buttons
       ============================================================ */
    var rippleExpand = keyframes`
      from {
        transform: translate(-50%, -50%) scale(0);
        opacity: 0.6;
      }
      to {
        transform: translate(-50%, -50%) scale(5);
        opacity: 0;
      }
    `;

    var rippleBaseClass = css`
      position: absolute;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      pointer-events: none;
      animation: ${rippleExpand} 0.65s ease-out forwards;
    `;

    function attachRipple(btn, color) {
      btn.style.overflow = 'hidden';
      btn.addEventListener('click', function (e) {
        var rect = btn.getBoundingClientRect();
        var el = document.createElement('span');
        el.style.left = (e.clientX - rect.left) + 'px';
        el.style.top  = (e.clientY - rect.top)  + 'px';
        el.style.background = color;
        el.classList.add(rippleBaseClass);
        btn.appendChild(el);
        setTimeout(function () { el.remove(); }, 700);
      });
    }

    // Brew slider prev / next
    document.querySelectorAll('.brew-prev, .brew-next').forEach(function (btn) {
      attachRipple(btn, 'rgba(74, 123, 167, 0.5)');
    });

    // "Let's Talk" button
    var letsTalkBtn = document.querySelector('.letsTalkBtn');
    if (letsTalkBtn) attachRipple(letsTalkBtn, 'rgba(255, 255, 255, 0.3)');

    /* ============================================================
       6. PROFILE IMAGE — lift & colour boost on hover
       ============================================================ */
    var dpImgStyle = css`
      transition:
        filter    0.5s ease,
        transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;

      &:hover {
        filter:    brightness(1.07) saturate(1.12) contrast(1.03) !important;
        transform: scale(1.025) !important;
      }
    `;

    var dpImg = document.querySelector('.dp img');
    if (dpImg) dpImg.classList.add(dpImgStyle);

    /* ============================================================
       7. TECH STACK HEADING — wobble on hover
       ============================================================ */
    var wobble = keyframes`
      0%, 100% { transform: rotate(0deg)    scale(1);    }
      15%       { transform: rotate(-1.5deg) scale(1.01); }
      35%       { transform: rotate( 1.5deg) scale(1.01); }
      55%       { transform: rotate(-0.7deg) scale(1);    }
      75%       { transform: rotate( 0.7deg) scale(1);    }
    `;

    var techHeadingStyle = css`
      display: inline-block;
      cursor: default;

      &:hover {
        animation: ${wobble} 0.65s ease-in-out;
      }
    `;

    var techHeading = document.querySelector('.frontend-dev-heading');
    if (techHeading) techHeading.classList.add(techHeadingStyle);

    /* ============================================================
       8. ACTIVE NAV PILL — breathing glow
       ============================================================ */
    var breathe = keyframes`
      0%, 100% {
        box-shadow: 0 2px 8px rgba(12, 14, 15, 0.15);
      }
      50% {
        box-shadow:
          0 4px 22px rgba(12, 14, 15, 0.28),
          0  0   0 3px rgba(74, 123, 167, 0.14);
      }
    `;

    var activeTabStyle = css`
      animation: ${breathe} 3s ease-in-out infinite !important;
    `;

    document.querySelectorAll('.activeThistab').forEach(function (tab) {
      tab.classList.add(activeTabStyle);
    });

    /* ============================================================
       9. ABOUT SECTION — reveal border on scroll via IntersectionObserver
       ============================================================ */
    var borderReveal = keyframes`
      from { opacity: 0; transform: scaleX(0); }
      to   { opacity: 1; transform: scaleX(1); }
    `;

    var aboutBorderStyle = css`
      position: relative;

      &::before {
        content: '';
        position: absolute;
        bottom: -20px;
        left: 0;
        width: 80px;
        height: 2px;
        background: linear-gradient(90deg, #4a7ba7, #c85f6f);
        transform-origin: left;
        opacity: 0;
        transform: scaleX(0);
      }

      &.em-border-visible::before {
        animation: ${borderReveal} 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards;
      }
    `;

    var aboutInfo = document.querySelector('.about-info');
    if (aboutInfo) {
      aboutInfo.classList.add(aboutBorderStyle);

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('em-border-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      observer.observe(aboutInfo);
    }

  } // end initEmotionStyles

  /* ============================================================
     BOOT — run after DOM is ready
     ============================================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmotionStyles);
  } else {
    initEmotionStyles();
  }

})();
