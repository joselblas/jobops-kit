#!/usr/bin/env python3
"""Check a tailored CV against career-context.md.

Flags numbers, dates and capitalised names in the CV that do not appear in the
facts file. It cannot judge rewording, so a human still reads the CV.

Usage:
    python3 cv_factcheck.py --facts career-context.md --cv CV-Company-2026-01-01.docx
    python3 cv_factcheck.py --facts career-context.md --cv cv.txt --allow allowed.txt

Exit code 1 if any number or date is unsupported, 0 otherwise.
Supports .docx (stdlib only), .pdf (needs pdftotext), .txt, .md.
"""
import argparse
import re
import subprocess
import sys
import zipfile


def read_text(path):
    low = path.lower()
    if low.endswith(".docx"):
        with zipfile.ZipFile(path) as z:
            xml = z.read("word/document.xml").decode("utf8", "ignore")
        xml = re.sub(r"</w:p>", "\n", xml)
        xml = re.sub(r"<[^>]+>", "", xml)
        return (xml.replace("&amp;", "&").replace("&lt;", "<")
                   .replace("&gt;", ">").replace("&quot;", '"'))
    if low.endswith(".pdf"):
        out = subprocess.run(["pdftotext", "-layout", path, "-"],
                             capture_output=True, text=True)
        if out.returncode != 0:
            sys.exit("pdftotext failed. Install poppler or pass a .docx/.txt.")
        return out.stdout
    with open(path, encoding="utf8", errors="ignore") as f:
        return f.read()


NUM = re.compile(r"\d[\d.,]*\s?(?:%|\+|k|K|m|M)?")
MONTH_YEAR = re.compile(r"\b(0?[1-9]|1[0-2])\s?[/.\-]\s?((?:19|20)\d{2})\b")
YEAR = re.compile(r"\b(?:19|20)\d{2}\b")
NAME = re.compile(r"\b[A-Z][a-zA-Z0-9&\-]{2,}(?:[ \t]+[A-Z][a-zA-Z0-9&\-]{2,})*\b")

STOP = set("""The And For With From Senior Lead Product Design Designer Experience
User Research Systems System Team Teams Skills Summary Profile Education
Languages Language English Spanish Native Professional Present Remote Years
Year Months Month Management Manager Director Head Strategy Services Service
Platform Platforms Mobile Web Digital Health Data Design Figma Based Built Led
Key Work History Contact Email Phone Location Portfolio LinkedIn Spain Europe
""".split())


def norm_num(s):
    return re.sub(r"[\s,]", "", s.lower())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--facts", required=True)
    ap.add_argument("--cv", required=True)
    ap.add_argument("--allow", help="text file with extra allowed tokens, one per line")
    a = ap.parse_args()

    facts = read_text(a.facts)
    cv = read_text(a.cv)
    allow = set()
    if a.allow:
        allow = {l.strip().lower() for l in open(a.allow, encoding="utf8") if l.strip()}

    facts_low = facts.lower()
    facts_nums = {norm_num(m.group()) for m in NUM.finditer(facts)}
    facts_nums |= {n.rstrip("+%kKmM") for n in facts_nums}

    problems, warnings = [], []

    for m in MONTH_YEAR.finditer(cv):
        token = f"{int(m.group(1)):02d}/{m.group(2)}"
        alt = f"{int(m.group(1))}/{m.group(2)}"
        if token not in facts and alt not in facts and m.group().lower() not in allow:
            problems.append(f"date not in facts: {m.group()}")

    for m in YEAR.finditer(cv):
        if m.group() not in facts and m.group().lower() not in allow:
            problems.append(f"year not in facts: {m.group()}")

    cv_nodates = MONTH_YEAR.sub(" ", cv)
    for m in NUM.finditer(cv_nodates):
        raw = m.group().strip()
        n = norm_num(raw)
        base = n.rstrip("+%kKmM").rstrip(".,")
        if not base:
            continue
        if re.fullmatch(r"(?:19|20)\d{2}", base):
            continue
        if n in facts_nums or base in facts_nums or raw.lower() in allow:
            continue
        if base in {norm_num(x) for x in re.findall(r"\d+", facts)}:
            continue
        problems.append(f"number not in facts: {raw}")

    seen = set()
    for m in NAME.finditer(cv):
        name = m.group().strip()
        words = name.split()
        if all(w in STOP for w in words) or name in seen:
            continue
        seen.add(name)
        before = cv[:m.start()].rstrip(" \t")
        sentence_start = (not before) or before[-1] in ".\n:;-\u2022*#"
        if sentence_start and len(words) == 1:
            continue
        if name.lower() not in facts_low and name.lower() not in allow:
            warnings.append(f"name/term not in facts (review): {name}")

    for p in sorted(set(problems)):
        print("ERROR  ", p)
    for w in warnings:
        print("REVIEW ", w)
    if not problems and not warnings:
        print("OK: no unsupported numbers, dates or names found.")
    elif not problems:
        print("No unsupported numbers or dates. Review the names above.")
    print("\nThis check cannot catch rewording. Read the CV before sending.")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
