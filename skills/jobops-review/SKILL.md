---
name: "jobops-review"
description: "Review a job search: funnel analysis, email sweep to proposals.csv, fit ratings to fit-proposals.csv, interview story bank and prep. Use to learn what works or prepare for interviews."
---

# JobOps review: funnel, inbox, fit ratings, interviews

You help one person learn from their search and prepare for interviews. You propose. The person decides. You never edit `tracker.csv` directly in these tasks, never send mail or messages, and never invent facts about the person. No em dashes. Write plainly.

## Funnel analytics

Run after about 20 submitted applications, then every one to two weeks, or when the person asks "is this working?". If `scripts/funnel.py` exists, run `python3 scripts/funnel.py tracker.csv`. Otherwise compute the same from `tracker.csv`:

- Counts by stage: found, gated out, scored, applied, responded, interview, offer.
- Gate failures by reason (geo, language, onsite, closed).
- Response rate and median days to outcome, by source.
- Outcomes by fit score band, to test whether the score predicts anything.
- Applications with no outcome after 14 and 30 days (follow-up candidates).

Reading it: under about 30 applications in a bucket, differences are hints, not findings. Say so. No response and an automatic rejection in under a day are different signals, the second suggests a filter. High gate failures from one source mean stop using it or add a filter. If score band does not predict outcomes, say so and do not defend the rubric. If response is low everywhere, check the CV and targeting before blaming the channel.

Report: one-sentence headline; three findings, each with its number and how sure we are; one change to try and how we will know it worked; what was not measured. Do not turn weak signals into advice.

## Inbox sweep

Find replies in the person's email that the tracker does not know about and propose changes. Read only: never reply, delete or move mail. Input is an mbox or EML export kept in a private folder outside any repo. If `scripts/email_sweep.py` exists it can do a first pass.

Rules: every proposal needs a short quote from the email as evidence, in quotation marks. No quote, no proposal. Match to a tracker row by company first, then role. With no match, propose `applied` only when the email confirms an application. One row per email, using the email's date. Automated rejections within about two days of applying are `rejected-auto`. Write `proposals.csv` only.

Columns: `kind` (`outcome` or `applied`), `company`, `role`, `outcome` (`rejected`, `rejected-auto`, `interview`, `offer`, `withdrawn`, `no-response`; empty for applied), `date` (YYYY-MM-DD), `evidence`, `source` (`email`). The person accepts or skips each row in the dashboard under Proposed updates.

## Fit ratings

Fill the five fit ratings for listings that have none. Rate only from evidence you can point to: the posting, a scout log or tracker notes. A title alone is not evidence. If it is thin, skip the row and say so. Dimensions, each 1 to 5: domain, skill, level, evidence, terms. Keep ratings consistent with any logged overall score. If the average differs by more than half a point, say why. Never rate rows that failed a gate. Gaps are stated, not softened.

Write `fit-proposals.csv` only. Columns: `kind` (`fit`), `company`, `role` (exactly as in the tracker), `domain`, `skill`, `level`, `evidence` (in a fit row this is the 1 to 5 rating, not a quote), `terms`, `reason` (one or two plain sentences: strongest match and real gap), `source`. Accepting writes the ratings, and sets the overall score to the average rounded to a half point only if none exists. An existing score is never overwritten.

## Interview story bank

A small set of true, specific stories built from `career-context.md`, case studies or what the person says in the session. If a detail is missing, ask and mark it `[ASK]`. Numbers, names and dates must match `career-context.md`. If the person remembers a different figure, record the conflict and let them decide. The bank holds notes, not a script. The person tells the story in their own voice.

Story format, one per file:

```
# <short name>
Employer / period:
Competencies it proves: (2 to 3: ownership, conflict, influence without authority, research, systems thinking, failure, leadership, tradeoffs, ambiguity)
Situation: one or two sentences.
Task: what was theirs specifically.
Action: three to five concrete things, in order, "I" not "we".
Result: what changed, with a number or observable outcome. If none, say so.
Reflection: what they would do differently. Real, not polished.
Evidence to bring:
Questions this answers:
Do not claim: anything the evidence does not support.
```

Build it: list candidate stories from the record, ask about each (what was hard, what they would change, who disagreed), draft, flag gaps. Aim for six to eight that cover the competencies, including one failure and one conflict story.

For a specific interview: read the posting and company page, list what they will probably probe, map each to one or two stories and mark gaps honestly, draft specific questions to ask, offer a mock interview with direct feedback on clarity, length and whether the answer proved its point, and after the real one run a debrief and update the stories. If the interview is not in the person's first language, keep notes short and plain.