# AD Standards Tracker — Handoff

> Branch: `ad-standards-tracker` (orphan branch of `AutoZYX/roam-explorer`).
> Scope: MVP of the new **AD Standards Tracker** project, intended to be moved
> into a dedicated `AutoZYX/ad-standards-tracker` repository and deployed on Vercel.
> Date: 2026-04-16.

---

## 1 · What was built

A working Next.js 16 / React 19 / TypeScript / Tailwind v4 app covering global
autonomous-driving standards, regulations and consultations, bilingual (zh/en).

**Pages (6):**

| Route | Description |
|-------|-------------|
| `/` | Dashboard — totals, distribution charts, open consultations, recent |
| `/standards` | Filterable library — search + jurisdiction / status / type / year / org |
| `/standards/[id]` | Detail page — prerendered from YAML at build time |
| `/sources` | Grouped list of the 25 primary sources the crawler monitors |
| `/subscribe` | Email & RSS subscription (RSS lives at `/api/feed.xml`) |
| `/about` | Methodology, licensing, contact — bilingual long-form |

Dynamic API route `/api/feed.xml` emits a valid RSS 2.0 feed of the latest 50
records. Language toggle persists to `localStorage`.

**Data: 62 seed YAML records** under `standards/{jurisdiction}/{year}/{id}.yaml`
(13 international, 24 China, 13 US, 6 EU, 3 UK, 3 Japan). Every record carries
bilingual title, summary, jurisdiction, type, status, document number (where
applicable), official URL, topics, automation levels, and a `last_updated`.

**Crawler (`tools/crawler/`):**

- `crawler.py` — abstract HTTP/BS4 crawler honouring `robots.txt`, bounded by a
  20-minute per-source cap, single fixed User-Agent
  `AD-Standards-Tracker-Bot/1.0 (contact: zhangyuxin@jlu.edu.cn)`.
- `sources.yaml` — 25 configured sources (all the P0 list).
- `requirements.txt` — minimal deps (requests, bs4, PyYAML).
- `README.md` — operator & review instructions.
- Output is **candidate JSON** in `tools/crawler/raw/YYYY-MM-DD/{source}.json`;
  never touches `standards/` directly. Promotion to YAML requires human review.

**Automation: `.github/workflows/daily-crawl.yml`** — runs at 02:00 UTC daily,
opens a `needs-review` PR if new candidates land. Timeout-protected (45 min).

## 2 · Quality-gate status

- ✅ Branch `ad-standards-tracker` exists (orphan from `main`).
- ✅ 6 page routes, all statically generated at build time.
- ✅ 62 YAML records (≥ 50 target).
- ✅ Python crawler + workflow in place; `python3 -m py_compile` clean.
- ✅ `pnpm install && pnpm build` succeeds with 62 static pages prerendered + `/api/feed.xml` as dynamic.
- ✅ RSS feed valid; bilingual i18n working; filters working.
- ✅ Handoff (this file) + `progress.log`.

## 3 · Next steps for the user (manual)

The remote agent cannot touch your local machine or authenticate against
GitHub / Vercel / Cloudflare. You will need to:

### 3.1 Move the branch into its own repository

```bash
# On your Mac, after pulling the updated roam-explorer branch:
cd /tmp
git clone --branch ad-standards-tracker --single-branch \
  git@github.com:AutoZYX/roam-explorer.git ad-standards-tracker
cd ad-standards-tracker

# Create the new empty repo on GitHub manually at:
#   https://github.com/new
# (name: ad-standards-tracker, private or public, no README/LICENSE)

git remote set-url origin git@github.com:AutoZYX/ad-standards-tracker.git
git branch -m ad-standards-tracker main
git push -u origin main
```

Because the branch is **orphan** (no shared history with roam-explorer), the
new repo starts clean.

### 3.2 Deploy to Vercel

1. Vercel → **Add New → Project** → Import `AutoZYX/ad-standards-tracker`.
2. Framework preset: **Next.js** (auto-detected).
3. Build command: `pnpm build` (default).
4. Env vars: set `NEXT_PUBLIC_SITE_URL=https://ad-standards.autozyx.com` so the
   RSS feed URLs are absolute.
5. Deploy.

### 3.3 DNS (Cloudflare)

Add a `CNAME` record:

```
ad-standards   CNAME   cname.vercel-dns.com   (proxy OFF, just DNS)
```

Then in Vercel add the domain `ad-standards.autozyx.com`.

### 3.4 Enable the daily crawler

No secret is required for the default crawler run (it uses the built-in
`GITHUB_TOKEN`). Just make sure:

- Settings → Actions → General → **Workflow permissions**: "Read and write" + "Allow GitHub Actions to create and approve pull requests".

## 4 · Known gaps / deliberate cut-scope

| Area | Status | Note |
|------|--------|------|
| `/ask` AI page | **Cut** | Per instructions, skipped in MVP. |
| Email backend | **Stub** | Form writes email to `localStorage` and surfaces a `mailto:` fallback. Plug in Buttondown / Listmonk later. |
| Crawler → YAML auto-promotion | **Not built** | On purpose: all new records need a human in the loop. |
| Full-text search | **Client-side only** | In-memory `Array.filter`. Fine up to a few thousand records. Upgrade to MiniSearch or Algolia when needed. |
| Korea sources | **Schema-ready, 0 records** | `jurisdiction: korea` is defined; add KATRI / MOLIT as P1. |
| Date parsing in crawler | **Loose** | Extracts first ISO-like or `YYYY-MM-DD` / `YYYY年MM月DD日` token. Reviewer should normalise. |
| Tests | **None** | Not in the MVP budget. First test should be `lib/data.ts` happy-path + a YAML-schema lint step. |

## 5 · Data schema (reference)

See `lib/types.ts`. The canonical YAML skeleton:

```yaml
id: "STD-{ORG}-{YYYY}-{NNN}"
date: "2024-11-15"
org: "UNECE WP.29"
org_full: "UN Economic Commission for Europe — GRVA"
jurisdiction: international   # international|china|us|eu|uk|japan|korea
type: regulation              # regulation|standard|consultation|meeting_notice|recall|white_paper
status: published             # draft|consultation|published|revised|withdrawn|pending
document_number: "UN R157"    # optional
title_en: "..."
title_cn: "..."
url: "https://..."
effective_date: "2025-01-01"  # optional
consultation_deadline: "..."  # optional, used for dashboard "open" counter
automation_level: [L3, L4]
topics: [functional_safety, sotif, cybersecurity, data_recording, teleoperation,
         testing, type_approval, ads_performance, v2x, ota, ethics, mapping,
         operational_domain, hmi, recall]
summary_en: "..."
summary_cn: "..."
impact_note: "..."
related_standards: ["ISO 21448"]
last_updated: "2026-04-16"
```

## 6 · Files of interest

| Path | Why it matters |
|------|---------------|
| `app/layout.tsx` | Global shell, i18n provider, fonts. |
| `app/page.tsx` | Dashboard server component. |
| `app/standards/[id]/page.tsx` | Static generation of detail pages. |
| `app/api/feed.xml/route.ts` | RSS 2.0 feed. |
| `lib/data.ts` | YAML walker + stats. Cached in-process. |
| `lib/i18n.tsx` | `zh` default, toggle persisted to `localStorage`. |
| `lib/constants.ts` | Label / colour maps. |
| `lib/sources.ts` | Static copy of the 25 sources for UI. |
| `tools/crawler/sources.yaml` | Machine copy for the crawler (single source of truth — keep both in sync when adding). |
| `.github/workflows/daily-crawl.yml` | GitHub Actions cron. |

## 7 · Operating principles baked in

- **One-person company mindset**: no secrets required to run, no paid
  subscriptions in the deploy path, no hidden infra — everything is plain
  Next.js + GitHub Actions.
- **No full-text redistribution**: records are metadata + link only. The crawler
  hits *listing* pages, never standard documents.
- **No AI "voice"**: every summary in this seed set was hand-written; the
  crawler emits neutral factual candidates and defers interpretation to the
  reviewer.
- **Bilingual parity**: every user-facing string and every record field has an
  `_en` and a `_cn` form; UI defaults to `zh`.

— Remote agent, 2026-04-16.
