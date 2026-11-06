# Accessibility

The dashboard is checked against WCAG 2.1 level AA. This page says what was tested, what was fixed, and what has not been tested.

## Result (2026-11-06)

- **Automated:** axe-core 4.10 finds no violations on all 12 pages, in light and dark, English and Spanish, and in the editor, conflict dialog, folder card, log wizard, follow-up and review states.
- **Keyboard:** every control can be reached and used with Tab, Enter, Space and Escape. Every stop shows a visible focus ring. A "Skip to content" link is the first stop. Focus returns to the item you used after a list or table re-renders, and moves to the page title when you change page.
- **Contrast:** every text and background pair in the palette was calculated. Text is at least 4.5 to 1 and input and button borders at least 3 to 1, in both themes.
- **Reflow:** no sideways page scroll at 320 px wide. The tracker table scrolls inside its own box.
- **Text spacing:** with larger line, letter and word spacing (WCAG 1.4.12), nothing is cut off or overlaps.
- **Motion:** transitions switch off when the system asks for reduced motion.

## What changed in this pass

| Problem | Fix |
|---|---|
| The fit list used listbox roles with no name and no keyboard model | A plain list of real buttons with a label, and `aria-pressed` for the chosen item |
| Scrollable lists could not be reached with the keyboard | Made focusable and labelled |
| Heading levels jumped from 1 to 3 on the Log and Proposed updates pages | Real heading order |
| Sortable table headers were clickable cells | Real buttons inside the headers |
| The empty "Edit" table header had no visible text for assistive technology | Hidden text added |
| Two text greys and two border colours fell below the required contrast | Darkened (light theme) or lightened (dark theme) |
| Search placeholder text was too faint | Uses the muted text colour |
| The page scrolled sideways at 320 px | Fixed the grid column and a hidden-text element that escaped its table |
| No skip link, and focus stayed behind after changing page | Added, and focus now moves to the page title |
| A small optional-file note in the folder card was too faint | Full-strength text |

## Not tested

- **Screen readers.** The semantics are in place (labels, roles, headings, live status for toasts), but nobody has listened to the pages with VoiceOver, NVDA or JAWS. That needs a person.
- **Voice control and switch access.**
- **Zoom beyond 400 percent**, and Windows forced-colours mode.
- **Reading order and wording.** Automated tools cannot judge whether the labels make sense. Please tell us if one does not.

## Run it yourself

```
pip install playwright && playwright install chromium
npm install axe-core
python3 -m http.server 8765 --directory app &
python3 scripts/a11y_audit.py --url http://localhost:8765/index.html --axe node_modules/axe-core/axe.min.js
```

No output other than "No violations found." means a clean run. An automated pass is a floor, not a finish line.
