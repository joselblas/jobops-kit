# Funnel analytics

Goal: use the tracker to decide where effort pays off, instead of guessing.

## When to run

- After about 20 submitted applications, then every one to two weeks.
- Whenever the person asks "is this working?" or wants to change strategy.

## How

```
python3 scripts/funnel.py tracker.csv
```

The script prints a markdown report. Read it, then write a short interpretation in `reports/funnel-YYYY-MM-DD.md`.

## What it reports

- Counts by stage: found, gated out, scored, applied, responded, interview, offer.
- Gate failures by reason (geo, language, onsite, closed). This tells you where the source of listings is weak.
- Response rate and median days to outcome, by source.
- Outcomes by fit score band, to test whether the score predicts anything.
- Applications with no outcome after 14 and 30 days (candidates for a follow-up).

## How to read it

- Be careful with small numbers. Under about 30 applications in a bucket, treat differences as hints, not findings. Say so in the report.
- "No response" and "automatic rejection in under a day" are different signals. The second suggests a filter, not a person.
- If gate failures are high for one source, stop using that source or add a filter. Do not keep paying the cost.
- If score band does not predict outcomes, say so. It may mean the rubric is wrong, or the sample is too small. Do not defend the rubric.
- If response is low everywhere, look at the CV and the targeting before blaming the channel. Compare a few tailored CVs against the postings they were for.

## Report format

1. Headline: one sentence.
2. Three findings, each with the number behind it and how sure we are.
3. One change to try next, and how we will know if it worked.
4. What we did not measure.

Do not turn weak signals into advice. Honest uncertainty is part of the report.
