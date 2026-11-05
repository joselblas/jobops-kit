#!/usr/bin/env python3
"""Funnel report from tracker.csv. Standard library only.

Columns (extra columns are ignored):
  date_found, company, role, source, score, gate_result, status,
  date_applied, date_outcome, outcome, notes

status:  found | gated | skipped | tailored | applied | closed
outcome: "" (none yet) | rejected | rejected-auto | interview | offer | withdrawn
gate_result examples: pass, fail:geo, fail:lang, fail:onsite, fail:closed

Usage: python3 funnel.py tracker.csv
"""
import csv
import sys
from collections import Counter, defaultdict
from datetime import date, datetime
from statistics import median


def d(s):
    s = (s or "").strip()
    for fmt in ("%Y-%m-%d", "%d/%m/%Y"):
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            pass
    return None


def pct(a, b):
    return f"{100 * a / b:.0f}%" if b else "n/a"


def band(score):
    try:
        s = float(score)
    except (TypeError, ValueError):
        return "unscored"
    if s >= 4:
        return "4.0+"
    if s >= 3:
        return "3.0-3.9"
    return "<3.0"


def main(path):
    with open(path, newline="", encoding="utf8") as f:
        rows = list(csv.DictReader(f))
    if not rows:
        sys.exit("Tracker is empty.")

    today = date.today()
    applied = [r for r in rows if (r.get("status") or "").strip() == "applied"]
    responded = [r for r in applied if (r.get("outcome") or "").strip()]
    interviews = [r for r in applied if (r.get("outcome") or "").strip() in ("interview", "offer")]
    offers = [r for r in applied if (r.get("outcome") or "").strip() == "offer"]

    print("# Funnel report\n")
    print(f"Rows: {len(rows)}. Generated {today}.\n")
    print("## Stages\n")
    print("| Stage | Count |\n|---|---|")
    print(f"| Listings logged | {len(rows)} |")
    print(f"| Stopped at a gate | {sum(1 for r in rows if (r.get('gate_result') or '').startswith('fail'))} |")
    print(f"| Applied | {len(applied)} |")
    print(f"| Any outcome | {len(responded)} ({pct(len(responded), len(applied))}) |")
    print(f"| Interview or offer | {len(interviews)} ({pct(len(interviews), len(applied))}) |")
    print(f"| Offer | {len(offers)} |")

    print("\n## Gate failures by reason\n")
    fails = Counter((r.get("gate_result") or "") for r in rows if (r.get("gate_result") or "").startswith("fail"))
    if fails:
        print("| Reason | Count |\n|---|---|")
        for k, v in fails.most_common():
            print(f"| {k} | {v} |")
    else:
        print("None logged.")

    print("\n## By source (applied only)\n")
    by = defaultdict(list)
    for r in applied:
        by[(r.get("source") or "unknown").strip() or "unknown"].append(r)
    print("| Source | Applied | Any outcome | Interview+ | Median days to outcome |\n|---|---|---|---|---|")
    for src, rs in sorted(by.items(), key=lambda kv: -len(kv[1])):
        out = [x for x in rs if (x.get("outcome") or "").strip()]
        iv = [x for x in rs if (x.get("outcome") or "").strip() in ("interview", "offer")]
        days = []
        for x in out:
            a, b = d(x.get("date_applied")), d(x.get("date_outcome"))
            if a and b:
                days.append((b - a).days)
        print(f"| {src} | {len(rs)} | {len(out)} | {len(iv)} | {median(days) if days else 'n/a'} |")

    print("\n## By fit score band (applied only)\n")
    bb = defaultdict(list)
    for r in applied:
        bb[band(r.get("score"))].append(r)
    print("| Band | Applied | Any outcome | Interview+ |\n|---|---|---|---|")
    for k in ("4.0+", "3.0-3.9", "<3.0", "unscored"):
        rs = bb.get(k, [])
        if rs:
            out = [x for x in rs if (x.get("outcome") or "").strip()]
            iv = [x for x in rs if (x.get("outcome") or "").strip() in ("interview", "offer")]
            print(f"| {k} | {len(rs)} | {len(out)} | {len(iv)} |")

    print("\n## Automatic rejections\n")
    auto = [r for r in applied if (r.get("outcome") or "").strip() == "rejected-auto"]
    print(f"{len(auto)} marked rejected-auto (outcome in under 2 days, no feedback).")

    print("\n## Waiting, no outcome yet\n")
    waiting = []
    for r in applied:
        if (r.get("outcome") or "").strip():
            continue
        a = d(r.get("date_applied"))
        if a:
            waiting.append(((today - a).days, r.get("company"), r.get("role")))
    waiting.sort(reverse=True)
    older = [w for w in waiting if w[0] >= 14]
    if older:
        print("| Days | Company | Role |\n|---|---|---|")
        for n, c, ro in older:
            flag = " (30+)" if n >= 30 else ""
            print(f"| {n}{flag} | {c} | {ro} |")
    else:
        print("Nothing waiting 14 days or more.")

    n = len(applied)
    print("\n## Caveat\n")
    if n < 30:
        print(f"Only {n} applications. Treat every comparison above as a hint, not a result.")
    else:
        print("Buckets under about 30 applications are still noisy. Read with care.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
