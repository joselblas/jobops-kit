# UX audit of the dashboard

Date: 2026-11-13. Scope: the static dashboard in `app/` (desktop 1440 px and phone 390 px), judged against one question: can a designer who has never seen this open it and know what to do in under a minute?

## Method

1. Walked every view in sample-data mode, on desktop and on a phone-sized viewport, and took screenshots.
2. Read the accessibility tree for each view, as a stand-in for a screen reader.
3. Checked the first-run path: what you see before you connect a folder.
4. Compared wording against the docs (setup, privacy) for consistency.

Screenshots of earlier states live in `docs/evolution/`.

## Findings and what changed

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | High | The three "Soon" pages (Scout, Apply, Interview prep) were dead ends: a label and nothing to do. | Fixed. Each now says it already works in Claude, and gives a prompt you can copy with one button. |
| 2 | Medium | Status labels showed raw lowercase values from the CSV ("found", "tailored"). | Fixed. Known statuses are translated (EN/ES), unknown ones are capitalised. |
| 3 | Medium | Proof page ticks were unlabeled toggles with no state for assistive tech. | Fixed. Real buttons with text ("Mark done" / "Done") and `aria-pressed`. |
| 4 | Medium | On a phone, the folder card pushed the content down by most of a screen. | Fixed. On small screens the card keeps the sample-data tag and the Connect button only. |
| 5 | Medium | Proof page: the main button read "Load hooks.csv" while the page showed sample data. | Fixed. With nothing loaded, "Sample data" is the primary button and a short line explains the empty state. |
| 6 | Low | Tracker header had four or five actions of equal weight. | Fixed. One primary action, the rest under a native "More" menu (closes on Escape, focus returns to it). |
| 7 | Medium | No first-run pointer from the dashboard to the setup guide. | Fixed. A dismissible card on Overview links to the setup guide. Dismissal is remembered in this browser only. |
| 8 | Low | Funnel, gates and sources were plain text for screen readers, with no list structure. | Fixed. They are real lists, bars are hidden from assistive tech, and the Sources numbers are read as a sentence. |

## Result

After the fixes, the automated accessibility check (`scripts/a11y_audit.py`, axe-core, 9 pages) reports no violations. All eight findings are now fixed.
