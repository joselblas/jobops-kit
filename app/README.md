# Dashboard

A single-page, no-dependency dashboard for `tracker.csv`. Dark, editorial layout. Everything runs in your browser. Nothing is uploaded.

## Use

1. Open `index.html` in a browser (double click works, no server needed).
2. Press **Load tracker.csv** or drop your file on the page.
3. First load shows fictional sample data (`sample-tracker.csv`).

## What it shows

- Key numbers and the funnel, from gate to interview
- **Fit**: a five-axis profile per opportunity (domain, skills, level, evidence, terms)
- Score against outcome: does your fit score predict anything
- Gate failures by reason, results by source
- Applications waiting 14 days or more
- Filterable, sortable tracker table

## Columns

The base columns are the same as `templates/tracker.example.csv`. For the fit profile, add five optional columns with values from 1 to 5, matching the five dimensions in `playbooks/score-rubric.md`:

`domain, skill, level, evidence, terms`

Rows without them still work. The fit panel then shows the overall score and notes only. `scripts/funnel.py` ignores the extra columns.

## Privacy

Your real tracker stays local and gitignored. The sample data is invented.
