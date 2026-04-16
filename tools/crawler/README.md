# AD Standards Tracker · Crawler

Daily crawler for the 25 primary standards & regulations sources. Runs inside
GitHub Actions and opens a pull request with any new candidate records.

## Design

- Single fixed User-Agent: `AD-Standards-Tracker-Bot/1.0 (contact: zhangyuxin@jlu.edu.cn)`
- Honours `robots.txt`.
- Per-source hard cap (default **20 min**); a single slow source will not block the job.
- Polite delay (default 2 s) between sources.
- Output is **candidate** JSON (`tools/crawler/raw/YYYY-MM-DD/{source}.json`).
  It is **never** written directly to the `standards/` tree — a human reviewer
  promotes candidates to YAML via a PR.

## Local run

```bash
cd tools/crawler
pip install -r requirements.txt
python crawler.py --list-sources       # sanity check
python crawler.py --source miit        # one source
python crawler.py --all                # all 25
```

## Adding a new source

1. Append an entry to `sources.yaml` with `id`, `name`, `jurisdiction`, `html` (or `feed`),
   `list_selector`, `title_selector`, `date_selector`, `keywords`.
2. Run `python crawler.py --source <id>` locally to verify the selectors find items.
3. Commit; the daily workflow picks it up automatically.

## Review workflow

1. Daily workflow runs at 02:00 UTC.
2. If any candidates are produced, a PR is opened labelled `needs-review`.
3. A human reviewer:
   - Confirms the source URL is accessible and the title is accurate.
   - Assigns the standardised `STD-{ORG}-{YYYY}-{NNN}` id.
   - Writes the bilingual title/summary (no AI-generated text shipped without review).
   - Places the file under `standards/{jurisdiction}/{year}/{id}.yaml`.
4. Merge the PR.

## Legal

Only public listing pages are scraped. Standard text itself is **never**
downloaded, cached, or redistributed by this repository.
