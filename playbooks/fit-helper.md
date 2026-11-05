# Fit helper

Goal: fill in the five fit ratings for listings that have none, so the radar and the "score against outcome" chart work on your real data. The agent proposes. You confirm each one in the dashboard under Proposed updates.

## Rules
- Rate only from evidence you can point to: the posting, a scout log, or notes in the tracker. A job title alone is not evidence. If the evidence is thin, skip the row and say so.
- Use the five dimensions from `playbooks/score-rubric.md`: domain, skill, level, evidence, terms. Each is 1 to 5.
- Every proposal carries a short reason that names the strongest match and the real gap. Gaps are not softened.
- Keep ratings consistent with any overall score already logged. If the average differs by more than half a point, say why in the reason.
- Do not touch rows that failed a gate. They never get a fit score.
- The agent writes `fit-proposals.csv` only. It never edits `tracker.csv`.

## Output: fit-proposals.csv

| Column | Meaning |
|---|---|
| kind | `fit` |
| company, role | exactly as in the tracker, so the row can be matched |
| domain, skill, level | 1 to 5 |
| evidence | 1 to 5. In a fit row this column is the rating, not a quote |
| terms | 1 to 5 |
| reason | one or two plain sentences: strongest match, real gap |
| source | where the evidence came from, for example `scout-log 2026-10-14` |

See `templates/fit-proposals.example.csv`.

## Accepting
Accepting writes the five ratings to the row. If the row has no overall score, it is set to the average rounded to the nearest half point. An existing score is never overwritten. If a row already has ratings, the card says the new ones replace them.
