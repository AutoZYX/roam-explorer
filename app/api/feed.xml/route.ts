import { getAllStandards } from "@/lib/data";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://ad-standards.autozyx.com";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const items = getAllStandards().slice(0, 50);
  const now = new Date().toUTCString();

  const body = items
    .map((s) => {
      const pub = new Date(s.date + "T00:00:00Z").toUTCString();
      const desc = s.summary_en || s.summary_cn || "";
      return `
    <item>
      <title>${esc(s.title_en || s.title_cn)}</title>
      <link>${SITE}/standards/${esc(s.id)}</link>
      <guid isPermaLink="false">${esc(s.id)}</guid>
      <pubDate>${pub}</pubDate>
      <category>${esc(s.jurisdiction)}</category>
      <category>${esc(s.status)}</category>
      <description><![CDATA[${desc}\n\nSource: ${s.url}]]></description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>AD Standards Tracker</title>
    <link>${SITE}</link>
    <description>Global autonomous-driving standards, regulations and consultations.</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    ${body}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
