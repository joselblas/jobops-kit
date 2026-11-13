# Accessibility

The dashboard and the site pages (setup, story, design) are checked against WCAG 2.1 level AA. This page says what was tested, what was fixed, and what has not been tested.

## Result (2026-11-13, second pass)

- **Automated:** axe-core finds no violations on the 12 dashboard pages (light and dark, English and Spanish) and on the setup, story (English and Spanish) and design pages (light and dark).
- **Keyboard walk:** Tab through seven dashboard pages. Every stop has a name and a visible focus ring, and no stop is smaller than 24 by 24 px (WCAG 2.2 target size). Result: no issues.
- **Accessibility tree:** read the overview page as a screen reader gets it (roles, names, order). This is a proxy. It is not the same as listening to it.
- **Forced colors** (Windows high contrast, emulated): checked by screenshot.
- **Reflow, text spacing, reduced motion:** as in the first pass below.

## What the second pass found and fixed

| Problem | Fix |
|---|---|
| "Load tracker.csv", "Load career-vault.md" and "Load hooks.csv" were labels around a hidden file input, so keyboard users could not reach them. The first pass missed this because axe does not flag it | Real buttons that open the file chooser |
| Setup, story and design pages had no `main` landmark and no skip link, and the first pass did not cover them | Skip link and `main` on all five pages, Spanish page nav label in Spanish |
| "54DAYS" was read as one word in the waiting list and follow-ups | A space before the unit |
| The score-against-outcome chart said only its title to a screen reader | The label now gives the number of applications and the count and average score for each outcome |
| In forced-colors mode the cards lost their edges and the funnel, odds and fit bars disappeared | Borders and system colors for those shapes |
| Hero italic words on the story and design pages were 2.7 to 1 on the dark band, and four swatch labels on the design page were under 4.5 to 1 | A lighter accent on the dark band, and full-strength swatch text |

## Result of the first pass (2026-11-06)

- **Automated:** axe-core 4.10 finds no violations on all 12 pages, in light and dark, English and Spanish, and in the editor, conflict dialog, folder card, log wizard, follow-up and review states.
- **Keyboard:** every control can be reached and used with Tab, Enter, Space and Escape. Every stop shows a visible focus ring. A "Skip to content" link is the first stop. Focus returns to the item you used after a list or table re-renders, and moves to the page title when you change page.
- **Contrast:** every text and background pair in the palette was calculated. Text is at least 4.5 to 1 and input and button borders at least 3 to 1, in both themes.
- **Reflow:** no sideways page scroll at 320 px wide. The tracker table scrolls inside its own box.
- **Text spacing:** with larger line, letter and word spacing (WCAG 1.4.12), nothing is cut off or overlaps.
- **Motion:** transitions switch off when the system asks for reduced motion.

## What changed in the first pass

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

- **Screen readers.** The semantics are in place and the accessibility tree reads in a sensible order, but nobody has listened to the pages with VoiceOver, NVDA or JAWS. That needs a person.
- **Real Windows high contrast.** Forced colors was emulated in Chrome, not run on Windows.
- **Funnel, gates and sources are read as plain text** by a screen reader (numbers next to labels, no table or list structure). It is understandable, but a definition list would be better.
- **Voice control and switch access.**
- **Zoom beyond 400 percent**, and Windows forced-colours mode.
- **Reading order and wording.** Automated tools cannot judge whether the labels make sense. Please tell us if one does not.

## Run it yourself

```
pip install playwright && playwright install chromium
npm install axe-core
python3 -m http.server 8765 &
python3 scripts/a11y_audit.py --url http://localhost:8765/app/index.html --site http://localhost:8765/ --axe node_modules/axe-core/axe.min.js
```

No output other than "No violations found." means a clean run. An automated pass is a floor, not a finish line.
