#!/usr/bin/env python3
"""Pre-publish check. Scans files that git would publish for personal data.

Looks for: email addresses, phone-like numbers, and any words you list in
.privacy-terms (one per line, gitignored): your surname, past employers,
recruiters, companies you applied to.

Usage: python3 scripts/privacy_check.py
Exit code 1 if anything is found. Standard library only.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")
PHONE = re.compile(r"(?<!\d)(\+?\d[\d\s().-]{8,}\d)(?!\d)")
OK_EMAIL = ("example.com", "example.org", "noreply")


def files():
    out = subprocess.run(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard"],
        cwd=ROOT, capture_output=True, text=True,
    )
    if out.returncode != 0:
        sys.exit("Run this inside the git repository.")
    return [ROOT / f for f in out.stdout.splitlines() if f]


def main():
    terms = []
    tf = ROOT / ".privacy-terms"
    if tf.exists():
        terms = [t.strip().lower() for t in tf.read_text().splitlines() if t.strip() and not t.startswith("#")]
    hits = 0
    for f in files():
        if f.suffix.lower() in {".png", ".jpg", ".pdf", ".docx", ".zip"} or not f.is_file():
            continue
        try:
            lines = f.read_text(encoding="utf8").splitlines()
        except (UnicodeDecodeError, OSError):
            continue
        for n, line in enumerate(lines, 1):
            found = []
            for m in EMAIL.findall(line):
                if not any(ok in m for ok in OK_EMAIL):
                    found.append("email " + m)
            if "SAMPLE_CSV" not in line:
                for m in PHONE.findall(line):
                    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", m.strip()):
                        found.append("number " + m.strip())
            low = line.lower()
            for t in terms:
                if t in low:
                    found.append("term '" + t + "'")
            for what in found:
                hits += 1
                print(f"{f.relative_to(ROOT)}:{n}: {what}")
    print(f"\n{hits} possible personal item(s)." if hits else "Nothing found. Still read git status before you push.")
    sys.exit(1 if hits else 0)


if __name__ == "__main__":
    main()
