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
| 5 | Medium | Proof page: the main button reads "Load hooks.csv" while the page shows sample data. | Open. Needs a clearer empty state and a primary action. |
| 6 | Low | Tracker header has many actions of equal weight. | Open. Group secondary actions under one menu. |
| 7 | Medium | No first-run pointer from the dashboard to the setup guide. | Open. Add a short card on first visit, dismissible. |
| 8 | Low | Funnel, gates and sources are plain text for screen readers, with no list or table structure. | Open. Documented in `docs/accessibility.md`. |

## Result

After the fixes, the automated accessibility check (`scripts/a11y_audit.py`, axe-core, 9 pages) reports no violations. Items 5 to 8 are the next batch.
