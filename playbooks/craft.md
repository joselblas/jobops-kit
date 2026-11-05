# Craft playbook: build and tune the CV and portfolio

Role: help the person build a strong master CV and portfolio from real evidence, then tune them for each listing. Per-listing CV tailoring and form filling are in `cv-tailor.md` and `apply.md`. This playbook covers the layer above: is the master good, is the portfolio doing its job, and what should lead for this role.

## Rules

- Evidence only. Every claim comes from `career-context.md`, a case study or what the person says in the session. If a detail is missing, ask. Mark it `[ASK]`.
- Never invent skills, numbers, titles, dates or outcomes. Never fill a gap with a plausible detail.
- Do not guess why an application was rejected. Rejection emails rarely say. Use patterns in the tracker, and say how sure you are.
- The master CV and the live portfolio are never edited. Propose changes. The person makes them.
- Write plainly, in the person's own register. No filler, no em dashes.

## A. CV audit

Run once for the master, and again after big changes. Inputs: master CV, `career-context.md`, the tracker.

1. **Facts.** Titles, employers, dates and numbers match `career-context.md`. Run `scripts/cv_factcheck.py` if available. Any conflict: stop and ask.
2. **Top third.** In five seconds a reader should know the role, the level, the sector and one proof. Headline and summary in plain words. No adjectives without evidence.
3. **Each job.** Three to five bullets. Outcome first. Scope shown (team size, users, platforms). A number only if it is in the record. Cut tasks that prove nothing.
4. **Gaps.** Shown the way the person chose in `career-context.md`. Never hidden with an invented detail, never raised unprompted.
5. **Machine-readable.** One column, standard headings, selectable text, no text in images, one date format, two pages at most, a clear file name.
6. **Voice.** Short sentences. Sounds like the person. If they write in a second language, plain beats polished.

Output `cv/audit-YYYY-MM-DD.md`: fixes ranked as must, should, nice, each with the line it applies to and why.

## B. Portfolio audit

Judge it the way a hiring manager skims it: two minutes, one scroll.

1. **Front door.** One sentence says who you are, your level, and what you do best.
2. **Selection.** Three or four case studies at most, chosen for the roles being targeted. List which to cut or hide, and why.
3. **Each case study.** Problem. Your role, with what you personally did. Process. Decisions with the trade-off. Outcome with evidence. What you would change. NDA-safe.
4. **Gaps.** If no case study fits a target sector, say so. Suggest what to write from real material. Do not invent a project.
5. **Basics.** Loads fast, works on a phone, contact is easy, links from the CV go to the right case study.

Output `portfolio/audit-YYYY-MM-DD.md` with the same ranking.

## C. Tune for one listing

Run after the listing passes the gates and the person picks it. Output one short note, `cv/tune-<Company>-<YYYY-MM-DD>.md`:

1. **What the posting asks for**, in order of weight. A table: requirement, evidence in the record, or `GAP`.
2. **Portfolio order.** The two case studies to lead with and one line on why each. A third only if it earns it.
3. **Headline and summary.** One true line aimed at this role. Mirror the posting's words only where they are true.
4. **What to leave out** for this role.
5. **Open questions** for the person.

Then hand over to `cv-tailor.md` to produce the CV and fact check it. The person reviews before anything is used.

## D. Learn from results

After about ten applications per CV version, compare reply rates by version and by portfolio lead. Under about thirty per bucket, call differences hints. Suggest one change at a time, and say how you will know if it worked. Record the CV file used in the `cv_version` column of the tracker, and the case study you led with in `portfolio_lead`, so versions can be compared later. The dashboard's CV and portfolio page reads them.

## Do not

- Edit the master CV or the live site.
- Claim a skill the record does not support, even if every posting asks for it.
- Present a guess about a rejection as a finding.
