#!/usr/bin/env python3
"""Check whether a job posting is still open. Standard library only.

Usage: python3 liveness.py <url> [<url> ...]

Result per URL: OPEN, CLOSED or UNKNOWN, with the reason.
It uses the public job-board APIs for Greenhouse, Lever and Ashby where it can,
and a plain page check otherwise. JavaScript-rendered pages (Workday, Personio,
many custom sites) return UNKNOWN: open those in a browser.

This is a helper, not proof. Always confirm on the employer's page before applying.
"""
import json
import re
import sys
import urllib.error
import urllib.request

UA = {"User-Agent": "Mozilla/5.0 (jobops liveness check)"}
CLOSED_WORDS = (
    "no longer accepting", "no longer available", "position has been filled",
    "job is no longer", "this job has expired", "posting has closed",
    "page not found", "this position is closed", "no longer open",
    "ya no está disponible", "oferta cerrada",
)


def get(url, timeout=15):
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read().decode("utf8", "ignore"), r.geturl()
    except urllib.error.HTTPError as e:
        return e.code, "", url
    except Exception as e:  # network, DNS, TLS
        return None, str(e), url


def check(url):
    m = re.search(r"boards(?:\.eu)?\.greenhouse\.io/([^/]+)/jobs/(\d+)", url) or \
        re.search(r"job-boards(?:\.eu)?\.greenhouse\.io/([^/]+)/jobs/(\d+)", url)
    if m:
        s, _, _ = get(f"https://boards-api.greenhouse.io/v1/boards/{m.group(1)}/jobs/{m.group(2)}")
        if s == 200:
            return "OPEN", "Greenhouse API returned the job"
        if s == 404:
            return "CLOSED", "Greenhouse API: job not found"
        return "UNKNOWN", f"Greenhouse API status {s}"

    m = re.search(r"jobs\.(?:eu\.)?lever\.co/([^/]+)/([0-9a-f\-]{36})", url)
    if m:
        s, _, _ = get(f"https://api.lever.co/v0/postings/{m.group(1)}/{m.group(2)}")
        if s == 200:
            return "OPEN", "Lever API returned the posting"
        if s == 404:
            return "CLOSED", "Lever API: posting not found"
        return "UNKNOWN", f"Lever API status {s}"

    m = re.search(r"jobs\.ashbyhq\.com/([^/?#]+)/([0-9a-f\-]{36})", url)
    if m:
        s, body, _ = get(f"https://api.ashbyhq.com/posting-api/job-board/{m.group(1)}")
        if s == 200:
            try:
                ids = {j.get("id") for j in json.loads(body).get("jobs", [])}
            except ValueError:
                return "UNKNOWN", "Ashby API returned non-JSON"
            if m.group(2) in ids:
                return "OPEN", "Ashby board lists the job"
            return "CLOSED", "Ashby board does not list the job"
        return "UNKNOWN", f"Ashby API status {s}"

    s, body, final = get(url)
    if s is None:
        return "UNKNOWN", f"request failed: {body[:80]}"
    if s in (404, 410):
        return "CLOSED", f"HTTP {s}"
    if s == 200:
        low = body.lower()
        for w in CLOSED_WORDS:
            if w in low:
                return "CLOSED", f"page says: {w!r}"
        if len(re.sub(r"<[^>]+>", "", body).strip()) < 800:
            return "UNKNOWN", "page has little text (probably JavaScript-rendered): check in a browser"
        return "OPEN", "page loads with no closed wording (weak evidence)"
    return "UNKNOWN", f"HTTP {s}"


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    for u in sys.argv[1:]:
        status, why = check(u)
        print(f"{status:8} {u}\n         {why}")
