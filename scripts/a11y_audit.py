#!/usr/bin/env python3
"""Accessibility check for the JobOps dashboard.

Runs axe-core (WCAG 2.0/2.1 A and AA plus best practice) on every dashboard
page, in light and dark, English and Spanish. Prints each distinct problem
once with where it was found. No output means no violations.

Setup (once):
    pip install playwright && playwright install chromium
    npm install axe-core

Run (serve the app folder first, for example: python3 -m http.server 8765 --directory app):
    python3 scripts/a11y_audit.py --url http://localhost:8765/index.html --axe node_modules/axe-core/axe.min.js

This is an automated check. It cannot judge reading order, wording or how a
screen reader sounds. Keyboard, contrast and reflow checks are listed in
docs/accessibility.md.
"""
import argparse
import asyncio
from playwright.async_api import async_playwright

VIEWS = ["overview", "tracker", "log", "inbox", "review", "followups", "steady", "craft", "proof", "scout", "apply", "prepare"]
RUN = ("axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']}})"
       ".then(r=>r.violations.map(x=>({id:x.id,impact:x.impact,help:x.help,ex:x.nodes.slice(0,2).map(n=>n.target.join(' '))})))")


async def main(url, axe_path):
    axe = open(axe_path, encoding="utf-8").read()
    found = {}
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for theme in ("light", "dark"):
            for lang in ("en", "es"):
                page = await (await browser.new_context(viewport={"width": 1280, "height": 900})).new_page()
                await page.goto(url)
                await page.evaluate("([t,l])=>{localStorage.setItem('jo.theme',t);localStorage.setItem('jo.lang',l)}", [theme, lang])
                await page.reload()
                for view in VIEWS:
                    await page.goto(url + "#" + view)
                    await page.wait_for_timeout(300)
                    if view == "inbox":
                        await page.click('[data-act="prop-sample"]')
                    if view == "proof":
                        await page.click('[data-act="proof-sample"]')
                    await page.add_script_tag(content=axe)
                    for v in await page.evaluate(RUN):
                        entry = found.setdefault(v["id"], {"impact": v["impact"], "help": v["help"], "where": [], "ex": v["ex"]})
                        entry["where"].append(f"{theme}-{lang}-{view}")
        await browser.close()
    for vid, e in found.items():
        print(f"{vid} ({e['impact']}) in {len(e['where'])} places: {e['help']}")
        print("   example:", e["ex"][0] if e["ex"] else "")
        print("   where:", ", ".join(e["where"][:4]))
    if not found:
        print("No violations found.")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default="http://localhost:8765/index.html")
    ap.add_argument("--axe", default="node_modules/axe-core/axe.min.js")
    a = ap.parse_args()
    asyncio.run(main(a.url, a.axe))
