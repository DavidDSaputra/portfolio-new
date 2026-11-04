import Script from "next/script";
import BodyClass from "./body-class";

export default function LegacyPageShell({
  html,
  inlineStyle,
  bodyClassName,
  scripts = [],
  moduleScripts = [],
}) {
  return (
    <>
      <BodyClass className={bodyClassName} />
      {inlineStyle ? <style dangerouslySetInnerHTML={{ __html: inlineStyle }} /> : null}
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />
      {scripts.map((src) => (
        <Script key={src} src={src} strategy="afterInteractive" />
      ))}
      {moduleScripts.map((src) => (
        /* lazyOnload: module fetches use CORS mode, so next/script's
           afterInteractive preload (as="script") never matches and the
           guestbook module would download twice — idle loading avoids it. */
        <Script key={src} src={src} type="module" strategy="lazyOnload" />
      ))}
    </>
  );
}
