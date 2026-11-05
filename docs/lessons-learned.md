# Lessons learned

Notes from running this on a real remote search. They are the reason the playbooks look the way they do.

## Listings

- **Aggregator tags lie.** "Remote" on a card often means one country, or a US-only role, on the real posting. Always open the employer's page.
- **Country lists beat the word "EMEA".** The most reliable proof of eligibility is an explicit country list or a regional salary band for your country.
- **Language gates hide in the body text.** A title with no language requirement can still say "fluent German" three paragraphs down.
- **Hybrid hides too.** "Remote, based in City" and "occasional office days" are not remote. Read for them.
- **Postings disappear.** Re-check that the page is live right before you fill the form.
- **Check your own history first.** Search the tracker before proposing a company. Some applicant systems reject duplicates, which can block a later, better role.

## CVs and profiles

- **Parsers invent data.** Job-site profile importers produced wrong locations, wrong seniority, garbled names and made-up education dates. Compare every pre-filled field with the fact file.
- **Do not let a tool change confirmed dates.**
- **Tailor lightly.** Headline, summary, skills line, ordering. Not wholesale rewrites. The more you rewrite, the more can be wrong.

## Forms

- Checkbox state can look wrong in a screenshot. Read it from the DOM.
- Changing a radio button can reset checkboxes. Set checkboxes last.
- React inputs may ignore plain value assignment. Use the native setter and fire an input event.
- Stop at Submit. Every time.

## Process

- Log failures. A failed listing that is not logged will be re-checked.
- Do not defend a score. If the scores do not predict outcomes, change the rubric.
- Automatic rejections within a day are a filter, not a verdict on you. Keep them separate in the data.
- Small samples mislead. Say so in every report.

## Before publishing a fork (checklist)

Keep these out of any public repo:

- Real `career-context.md`, `profile.yml`, `tracker.csv`, `cv/`, `logs/`, `stories/`, `reports/`.
- Names, emails, phone numbers and links of references, recruiters and hiring managers.
- Names of companies you applied to or were rejected by, with outcomes.
- Salary expectations, exit terms from a previous job, any dispute.
- Screenshots of forms that show personal data.

The `.gitignore` in this repo covers the standard paths. Check `git status` and search the history before every push.
