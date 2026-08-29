import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE = "https://valyria.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Valyria — the coding agent that never leaves your machine",
  description:
    "A local-first coding agent that plans, edits, runs and verifies inside your repo — entirely offline, on your own hardware. Coming soon.",
  applicationName: "Valyria",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/assets/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/assets/favicon-180.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Valyria",
    title: "Valyria — the coding agent that never leaves your machine",
    description:
      "Plans, edits, runs and verifies inside your repo — entirely offline, on your own hardware. Coming soon.",
    images: [{ url: "/assets/hero-poster.jpg", width: 1440, height: 900, alt: "The Valyria desktop app" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Valyria — the coding agent that never leaves your machine",
    description:
      "Plans, edits, runs and verifies inside your repo — entirely offline, on your own hardware. Coming soon.",
    images: ["/assets/hero-poster.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#bd5a2c",
  width: "device-width",
  initialScale: 1,
};

// Runs before the body renders, so an explicit light/dark choice never flashes.
const themeInit = `(function(){try{var t=localStorage.getItem("valyria-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {children}
      </body>
    </html>
  );
}
