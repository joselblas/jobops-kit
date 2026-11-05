# Dashboard

A full-screen, no-dependency dashboard for `tracker.csv`. Rounded cards, a left menu, light by default with a dark option, English and Spanish. Everything runs in your browser. Nothing is uploaded.

![Overview, light](../docs/screenshots/overview-light.png)

## Use

1. Open `index.html` in a browser (double click works, no server needed), or use the live demo.
2. Press **Open and edit** (Chrome or Edge) to edit your file in place, or **Load tracker.csv** or drop the file on the page.
3. First load shows fictional sample data (`sample-tracker.csv`).

## Menu

| Page | State | What it does |
|---|---|---|
| Overview | Live | Key numbers, funnel, odds of an interview, fit radar, score against outcome, waiting list, gates, sources |
| Tracker | Live | Filter, search, sort and edit every listing, or add one |
| Log an update | Live | One question per step: a reply arrived, I applied, an interview happened |
| Steady | Preview | Your own odds in plain words, a pacing guard, one dry line after a rejection |
| Scout, CV and portfolio, Apply, Interview prep | Coming | Placeholder pages showing what each will do and in which roadmap phase |

## Log an update

One question at a time, big choices that move on when you pick them, Enter to continue, a progress bar and a review step before saving. Pick **A reply arrived** and choose the application, then the kind of reply (rejected, rejected within a day or two, interview invite, offer, no reply, withdrew), the date and an optional note. After a rejection you get a Steady card with your own base rate and one line to carry.

![Log an update](../docs/screenshots/log-step.png)

## Saving

In Chrome or Edge, **Open and edit** writes changes straight back to your file. In other browsers use **Download CSV**. The page warns you before closing with unsaved changes.

## Columns

The base columns are the same as `templates/tracker.example.csv`. Outcome values: `rejected`, `rejected-auto`, `interview`, `offer`, `withdrawn`, `no-response`. For the fit profile, add five optional columns with values from 1 to 5, matching `playbooks/score-rubric.md`:

`domain, skill, level, evidence, terms`

Rows without them still work. `scripts/funnel.py` ignores the extra columns.

## Language and theme

Use the switches at the bottom of the menu. Your choice is remembered in this browser only.

## Privacy

Your real tracker stays local and gitignored. The sample data is invented. The page makes no network requests and uses system fonts.
