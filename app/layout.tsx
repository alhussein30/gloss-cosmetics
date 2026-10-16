import type { Metadata, Viewport } from "next";
import brand from "@/content/brand.json";
import "./globals.css";

export const metadata: Metadata = {
  title: `${brand.name.ar} | ${brand.name.en}`,
  description: brand.about.ar,
};

export const viewport: Viewport = { themeColor: brand.colors.primary };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const c = brand.colors;
  const vars = {
    "--brand-primary": c.primary,
    "--brand-accent": c.accent,
    "--brand-bg": c.bg,
    "--brand-text": c.text,
  } as React.CSSProperties;
  return (
    <html lang="ar" dir="rtl" style={vars}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&family=Tajawal:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
