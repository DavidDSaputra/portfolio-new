import "../style.css";
import "./globals.css";
import SiteRippleBackground from "../components/site-ripple-background";
import ScrollSling from "../components/scroll-sling";

export const metadata = {
  title: {
    default: "David Saputra | Portfolio",
    template: "%s | David Saputra",
  },
  description:
    "Portfolio David Saputra — frontend developer, vibe coder & prompt engineer. Project, pengalaman, dan blog seputar development dengan desain yang bersih dan minimalis.",
  icons: {
    icon: "/src/png/nav-avatar.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(localStorage.getItem("mn-theme")==="dark"){document.documentElement.classList.add("dark");}}catch(e){}',
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            // Take the splash lock before first paint so the hero's hidden
            // entrance state is the initial one (no visible-then-hide flash).
            // Mirrors the reduced-motion bail in preloader.js; the failsafe
            // lifts the lock again should the splash never flag completion.
            __html:
              `(function(){
                if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
                var root=document.documentElement;
                root.classList.add("pre-lock");
                var keys=[" ","ArrowUp","ArrowDown","PageUp","PageDown","Home","End"];
                function block(event){if(root.classList.contains("pre-lock")&&(event.type!=="keydown"||keys.indexOf(event.key)!==-1))event.preventDefault();}
                window.addEventListener("wheel",block,{passive:false});
                window.addEventListener("touchmove",block,{passive:false});
                window.addEventListener("keydown",block);
                window.__releasePreloaderLock=function(){
                  clearTimeout(timer);
                  root.classList.remove("pre-lock");
                  window.removeEventListener("wheel",block);
                  window.removeEventListener("touchmove",block);
                  window.removeEventListener("keydown",block);
                };
                var timer=setTimeout(function(){
                  var splash=document.getElementById("mnPre");
                  if(splash)splash.remove();
                  root.classList.add("pre-done");
                  window.__releasePreloaderLock();
                },12000);
                document.addEventListener("DOMContentLoaded",function(){
                  if(!document.getElementById("mnPre"))window.__releasePreloaderLock();
                },{once:true});
              })();`,
          }}
        />
        <noscript>
          <style>{".preloader{display:none!important}"}</style>
        </noscript>
      </head>
      <body>
        <SiteRippleBackground />
        <div className="site-shell">{children}</div>
        <ScrollSling />
      </body>
    </html>
  );
}
