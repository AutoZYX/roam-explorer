import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import SWRegister from "@/components/sw-register";

export const metadata: Metadata = {
  title: "ROAM Explorer — L4 Robotaxi Incident Database",
  description:
    "Interactive explorer for the ROAM open-source database of L4+ robotaxi operational anomalies, scenario taxonomy, and reference architecture.",
  manifest: "/manifest.json",
  themeColor: "#c85a3a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ROAM Explorer",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="mx-auto max-w-5xl w-full px-4 py-8 flex-1">{children}</main>
        <Footer />
        <SWRegister />
      </body>
    </html>
  );
}
