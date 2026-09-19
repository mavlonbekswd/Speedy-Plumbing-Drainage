#!/usr/bin/env python3
"""Re-runnable: does every claim in the copy bank appear on the LIVE Speedy site, and has any
forbidden claim appeared on it?

    python3 scripts/site-claims-audit.py            # the URLs in scripts/site-urls.txt
    python3 scripts/site-claims-audit.py <file>     # a different URL list

Ported from ARIM/bebest/site-claims-audit.py, with three changes that matter.

1. IT CHECKS THAT EACH URL EXISTS. The BeBest version curled every URL and grepped whatever came
   back, including an error page, so a claim could be reported present on a page that 404s and a
   whole missing section could audit clean. The dossier records that failure. A non-200 here is
   its own failure category and it forces exit 1 on its own.

2. FORBIDDEN RUNS OVER THE RAW BYTES, CLAIMS OVER THE STRIPPED TEXT. `aggregateRating` lives
   inside a <script type="application/ld+json"> block, so the BeBest habit of stripping scripts
   before matching would have made that check vacuous — it would have printed CLEAN for a site
   carrying review schema on every page. A £ figure in a JSON-LD offer is a price claim in
   exactly the way a £ figure in a heading is.

3. NO -L. A redirect is a failure, not a hop to follow. The list is www URLs and the canonical
   host is www; if one of them redirects, the site is nominating a URL it does not serve.

Python 3 standard library only, on purpose: it runs from a laptop, from a deploy hook or from a
machine with nothing installed, and after every deploy it must print ALL CLAIMS PRESENT.
"""

import html
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_LIST = os.path.join(HERE, "site-urls.txt")

# ---------------------------------------------------------------------------
# What must be on the site. Every one of these has a proof file in
# ARIM/speedy/claims-evidence/; a claim with no file does not run, and does not belong here.
# ---------------------------------------------------------------------------
CLAIMS = {
    "Arrival within 45 minutes": r"45\s*-?\s*min",
    "Open 24/7": r"24/7|24 hours",
    "A plumber answers the phone": r"a plumber answers|person who answers is the person who comes",
    "Price agreed before we start": r"price is agreed before we start|agreed before we start|approve the cost first",
    "No extra charge at night or weekends": r"no extra charge at night|no extra charge .{0,20}weekend",
    "12-month guarantee on workmanship": r"12[\s-]month guarantee|guaranteed for 12 months",
    "Materials covered by the maker's warranty": r"maker.{1,3}s (own )?warranty",
    "Fully insured": r"fully insured",
    "5+ years' trade experience": r"5\+?\s*years",
    "10,000 jobs between them": r"10,?000 jobs",
    "WhatsApp photo quote": r"whats\s?app",
    "Same day service": r"same.day",
    "Small jobs welcome": r"small jobs? (are )?welcome|dripping tap is a job",
}

# ---------------------------------------------------------------------------
# What must be nowhere. Each of these is a claim Speedy does not hold or has forbidden.
# ---------------------------------------------------------------------------
FORBIDDEN = {
    "a price figure": r"(&pound;|£)\s?\d",
    "the gas credential, in any casing or direction": r"gas\s*safe",
    "a call-out fee, named or denied": r"call[-\s]?out\s+(fee|charge)|free\s+call[-\s]?out",
    "an aggregateRating": r"aggregate\s?rating",
    "a star rating or review count": r"\b\d[\d,]*\s+reviews?\b|\b\d(\.\d)?\s*[-\s]?star\b",
}

TAG = re.compile(r"<[^>]+>")
SCRIPT_OR_STYLE = re.compile(r"<(script|style)\b.*?</\1>", re.S | re.I)
STATUS_MARK = "\n<<<HTTP_STATUS:"


def fetch(url):
    """(status, raw_html). -1 means curl itself failed. No -L: a redirect is a failure."""
    result = subprocess.run(
        ["curl", "-s", "--max-time", "30", "-w", STATUS_MARK + "%{http_code}>>>", url],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    out = result.stdout
    if STATUS_MARK not in out:
        return -1, ""
    body, _, tail = out.rpartition(STATUS_MARK)
    try:
        status = int(tail.rstrip(">").strip())
    except ValueError:
        status = -1
    return status, body


def readable(raw):
    """Scripts and styles gone, tags gone, entities decoded: what a reader sees."""
    text = SCRIPT_OR_STYLE.sub(" ", raw)
    return html.unescape(TAG.sub("\n", text))


def load_urls(path):
    urls = []
    with open(path, encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if line and not line.startswith("#"):
                urls.append(line)
    return urls


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_LIST
    urls = load_urls(path)
    if not urls:
        print(f"no URLs in {path}")
        return 1

    raw_pages = {}
    unreachable = []
    for url in urls:
        status, raw = fetch(url)
        if status == 200:
            raw_pages[url] = raw
        else:
            unreachable.append((url, status))

    text_pages = {url: readable(raw) for url, raw in raw_pages.items()}
    total = len(text_pages)
    failures = 0

    print(f"{len(urls)} URLs listed, {total} answered 200\n")

    if unreachable:
        failures += len(unreachable)
        print("URLs that did not answer 200:")
        for url, status in unreachable:
            print(f"{'FAIL':8}{url}  ->  {status if status != -1 else 'curl failed'}")
        print()

    for label, pattern in CLAIMS.items():
        found = sum(1 for body in text_pages.values() if re.search(pattern, body, re.I))
        if not found:
            failures += 1
        print(f"{'OK' if found else 'MISSING':8}{label:44}{found}/{total} pages")

    print()
    for label, pattern in FORBIDDEN.items():
        # Raw bytes, script blocks included: see the note at the top of this file.
        hits = [url for url, raw in raw_pages.items() if re.search(pattern, raw, re.I)]
        if hits:
            failures += 1
        print(f"{'FOUND' if hits else 'CLEAN':8}{label:44}{len(hits)}/{total} pages")
        for url in hits[:5]:
            print(f"{'':8}  {url}")

    if failures:
        print(f"\n{failures} problem(s): site not done")
        return 1

    print("\nALL CLAIMS PRESENT")
    return 0


if __name__ == "__main__":
    sys.exit(main())
