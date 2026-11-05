# Score rubric: gates first, then fit

Run this on every listing before any CV work. Two stages. A listing that fails a gate is logged and dropped. It never gets a fit score and never gets a tailored CV.

All evidence comes from the employer's own posting or ATS page, not from an aggregator card. Aggregator tags (LinkedIn, Lenny's Jobs, job boards) are often wrong or stale. "Remote" on a card frequently turns out to be one country on the real posting.

## Stage 1: Hard gates (pass / fail / unclear)

Read the gate values from `profile.yml`. For each gate, record a result and one quoted line of evidence plus the URL it came from.

| Gate | Pass when | Fail when |
|---|---|---|
| Work mode | Fully remote, or remote within your region | Hybrid or office days required, unless profile says otherwise |
| Geography | Your country or region is explicitly allowed (country list, regional salary band, "EU" with a stated entity that can employ you) | Country list excludes you, or only other regions are named |
| Language | Every required language is one you have at the stated level | A required language you lack, including "fluent X" in the body text |
| Work authorization | Posting does not require rights you lack, or it states your status is covered | No sponsorship plus no rights, or an entity-country work-rights requirement |
| Seniority | Level is inside your target band | More than one band away in either direction |
| Legitimacy | See `liveness-and-legitimacy.md`: posting is open and on the employer's own page | Closed, reposted without change for months, or no employer page found |

Result values:
- `pass`: evidence found.
- `fail`: evidence found. Log the reason code, for example `fail:geo`, `fail:lang`, `fail:onsite`, `fail:closed`.
- `unclear`: the posting does not say. Do not guess. Log what is missing and the one question that would resolve it. Only continue if the person decides to.

If any gate is `fail`, stop. Write the tracker row and move on.

## Stage 2: Fit score (1 to 5)

Only for listings with no failed gate. Score each dimension 1 to 5, then give the overall as a rounded average, not a formula result. The reasoning matters more than the number.

1. Domain match: sector and problem space against your strongest evidence.
2. Skill match: required skills against skills you can prove from `career-context.md`.
3. Level and scope: ownership, team size, and decision rights against your history.
4. Evidence available: do you have a real case study or result for this role? If not, say so.
5. Practical terms: pay if stated, contract type, timezone overlap, company stability signals.

Write one line each for "strongest match" and "biggest gap". Gaps must be real, not softened.

## Using the score

- 4.0 and above: recommend. Tailor a CV.
- 3.0 to 3.9: present to the person with the gap stated. Their call.
- Below 3.0: log only, unless the person says otherwise.

These are advice, not rules. When the person needs income quickly, lower the apply threshold in `profile.yml` and say so in the log. The gates stay as they are, because applying to a role that fails a gate wastes effort and can cost credibility.

## Log format

One tracker row per listing, always, including failures. See `templates/tracker.example.csv`. Before scoring, search the tracker for the company and role so nothing is scored twice.
