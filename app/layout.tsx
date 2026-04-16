import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "AD Standards Tracker — 自动驾驶标准追踪",
  description:
    "Bilingual tracker for global autonomous-driving standards, regulations and consultations (UNECE WP.29, ISO, SAC/TC114, NHTSA, SAE, UL 4600, IEEE, Euro NCAP, METI, MLIT).",
  alternates: { types: { "application/rss+xml": "/api/feed.xml" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <I18nProvider>
          <Nav />
          <main className="mx-auto max-w-6xl w-full px-4 py-8 flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
