import "../style.css";
import "./globals.css";

export const metadata = {
  title: {
    default: "David Saputra | Portfolio",
    template: "%s | David Saputra",
  },
  description:
    "Portfolio David Saputra berisi project, eksperimen desain, dan blog seputar development.",
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
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Code:wght@500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
        />
        <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
      </head>
      <body>
        <div className="site-shell">{children}</div>
      </body>
    </html>
  );
}
