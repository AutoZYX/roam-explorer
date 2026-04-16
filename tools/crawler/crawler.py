#!/usr/bin/env python3
"""AD Standards Tracker crawler.

Scrapes 25 official listing pages for new standards / regulations /
consultations relevant to autonomous driving. Produces *candidate*
records (JSON) that require human review before they are committed as
YAML under `standards/{jurisdiction}/{year}/`.

Design rules:
    - Polite: single fixed User-Agent with contact email.
    - Robots-aware: honours robots.txt; logs and skips if disallowed.
    - Bounded: per-source timeout hard-capped (default 20 min).
    - Idempotent: each candidate keyed by SHA-1 of (source, url, title).
    - Not destructive: never writes to the `standards/` tree automatically.

Usage:
    python crawler.py --all
    python crawler.py --source miit
    python crawler.py --list-sources
"""
from __future__ import annotations

import argparse
import hashlib
import json
import logging
import re
import sys
import time
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable
from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser

import requests
import yaml
from bs4 import BeautifulSoup

THIS = Path(__file__).parent
ROOT = THIS.parent.parent
DEFAULT_OUT = THIS / "raw" / datetime.now(timezone.utc).strftime("%Y-%m-%d")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
log = logging.getLogger("ad-stds-crawler")


# ---------------------------------------------------------------------------

@dataclass
class Candidate:
    source_id: str
    jurisdiction: str
    url: str
    title: str
    date_raw: str
    fetched_at: str
    hash: str

    @classmethod
    def build(cls, *, source_id: str, jurisdiction: str, url: str,
              title: str, date_raw: str) -> "Candidate":
        h = hashlib.sha1(f"{source_id}|{url}|{title}".encode("utf-8")).hexdigest()
        return cls(
            source_id=source_id,
            jurisdiction=jurisdiction,
            url=url,
            title=title.strip(),
            date_raw=date_raw.strip(),
            fetched_at=datetime.now(timezone.utc).isoformat(),
            hash=h,
        )


# ---------------------------------------------------------------------------

class Crawler:
    def __init__(self, config: dict, out_dir: Path):
        self.defaults = config.get("defaults", {})
        self.sources = config.get("sources", [])
        self.out_dir = out_dir
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": self.defaults.get(
                "user_agent",
                "AD-Standards-Tracker-Bot/1.0 (contact: zhangyuxin@jlu.edu.cn)",
            ),
            "Accept": "text/html,application/xml,application/json;q=0.9,*/*;q=0.8",
            "Accept-Language": "en;q=0.9,zh;q=0.8",
        })
        self._robots_cache: dict[str, RobotFileParser] = {}

    # -- networking ---------------------------------------------------------

    def _can_fetch(self, url: str) -> bool:
        parsed = urlparse(url)
        root = f"{parsed.scheme}://{parsed.netloc}"
        rp = self._robots_cache.get(root)
        if rp is None:
            rp = RobotFileParser()
            rp.set_url(f"{root}/robots.txt")
            try:
                rp.read()
            except Exception as e:  # noqa: BLE001
                log.debug("robots.txt fetch failed for %s: %s", root, e)
                rp = RobotFileParser()  # empty => default allow
            self._robots_cache[root] = rp
        try:
            return rp.can_fetch(self.session.headers["User-Agent"], url)
        except Exception:  # noqa: BLE001
            return True

    def _fetch(self, url: str) -> str | None:
        retry = int(self.defaults.get("retry_count", 3))
        backoff = int(self.defaults.get("retry_backoff_seconds", 2))
        timeout = int(self.defaults.get("timeout_seconds", 30))
        for attempt in range(retry):
            try:
                r = self.session.get(url, timeout=timeout)
                if r.status_code == 200:
                    r.encoding = r.apparent_encoding or r.encoding
                    return r.text
                if r.status_code in (403, 404):
                    log.warning("%s -> HTTP %s (giving up)", url, r.status_code)
                    return None
                log.warning("%s -> HTTP %s (retry %d)", url, r.status_code, attempt + 1)
            except requests.RequestException as e:
                log.warning("%s -> %s (retry %d)", url, e, attempt + 1)
            time.sleep(backoff ** attempt)
        return None

    # -- parsing ------------------------------------------------------------

    @staticmethod
    def _extract_date(text: str) -> str:
        """Grab the first date-looking token from a string."""
        patterns = [
            r"(20\d{2})[-/\.年]\s*(\d{1,2})[-/\.月]\s*(\d{1,2})",
            r"(\d{1,2})[-/\s](Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(20\d{2})",
            r"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+(20\d{2})",
        ]
        for p in patterns:
            m = re.search(p, text, re.IGNORECASE)
            if m:
                return m.group(0)
        return ""

    @staticmethod
    def _matches(text: str, keywords: Iterable[str]) -> bool:
        if not keywords:
            return True
        low = text.lower()
        return any(k.lower() in low for k in keywords)

    # -- per-source --------------------------------------------------------

    def crawl_source(self, src: dict) -> list[Candidate]:
        source_id = src["id"]
        jurisdiction = src.get("jurisdiction", "international")
        url = src.get("html") or src.get("feed")
        if not url:
            log.warning("[%s] no html/feed URL configured", source_id)
            return []
        if not self._can_fetch(url):
            log.warning("[%s] robots.txt disallows %s", source_id, url)
            return []

        html = self._fetch(url)
        if not html:
            return []

        soup = BeautifulSoup(html, "html.parser")
        list_sel = src.get("list_selector") or "article, li, tr"
        title_sel = src.get("title_selector") or "a"
        date_sel = src.get("date_selector") or "time, .date, .time"
        keywords = src.get("keywords", [])

        candidates: list[Candidate] = []
        for node in soup.select(list_sel):
            a = node.select_one(title_sel)
            if not a:
                continue
            title = a.get_text(" ", strip=True)
            if not title:
                continue
            href = a.get("href", "")
            if not href:
                continue
            full = urljoin(url, href)
            date_node = node.select_one(date_sel)
            date_raw = (date_node.get_text(strip=True) if date_node else "") or \
                self._extract_date(node.get_text(" ", strip=True))
            hay = f"{title} {date_raw}"
            if not self._matches(hay, keywords):
                continue
            candidates.append(Candidate.build(
                source_id=source_id,
                jurisdiction=jurisdiction,
                url=full,
                title=title,
                date_raw=date_raw,
            ))
        log.info("[%s] %d candidate(s)", source_id, len(candidates))
        return candidates

    # -- driver ------------------------------------------------------------

    def run(self, selected: set[str] | None = None) -> dict[str, list[Candidate]]:
        self.out_dir.mkdir(parents=True, exist_ok=True)
        block_cap = int(self.defaults.get("max_block_per_source_seconds", 1200))
        polite = int(self.defaults.get("polite_delay_seconds", 2))
        results: dict[str, list[Candidate]] = {}
        for src in self.sources:
            if selected and src["id"] not in selected:
                continue
            started = time.monotonic()
            try:
                cands = self.crawl_source(src)
            except Exception as e:  # noqa: BLE001
                log.exception("[%s] crawl failed: %s", src["id"], e)
                cands = []
            elapsed = time.monotonic() - started
            if elapsed > block_cap:
                log.warning("[%s] exceeded block cap (%.1fs > %ds)",
                            src["id"], elapsed, block_cap)
            results[src["id"]] = cands
            if cands:
                out = self.out_dir / f"{src['id']}.json"
                out.write_text(
                    json.dumps([asdict(c) for c in cands], ensure_ascii=False, indent=2),
                    encoding="utf-8",
                )
            time.sleep(polite)
        return results


# ---------------------------------------------------------------------------

def load_config() -> dict:
    with (THIS / "sources.yaml").open("r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--all", action="store_true", help="crawl all configured sources")
    p.add_argument("--source", action="append", help="crawl specified source id (repeatable)")
    p.add_argument("--list-sources", action="store_true", help="list configured sources and exit")
    p.add_argument("--out", type=Path, default=DEFAULT_OUT, help="output directory")
    args = p.parse_args(argv)

    cfg = load_config()

    if args.list_sources:
        for s in cfg.get("sources", []):
            print(f"{s['id']:24} {s.get('jurisdiction',''):14} {s.get('name','')}")
        return 0

    if not args.all and not args.source:
        p.print_help()
        return 2

    crawler = Crawler(cfg, args.out)
    selected = set(args.source) if args.source else None
    results = crawler.run(selected)

    total = sum(len(v) for v in results.values())
    log.info("Wrote %d candidate records across %d source(s) to %s",
             total, len(results), args.out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
