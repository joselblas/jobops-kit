---
name: "jobops-apply"
description: "Tailor a CV to one listing from the person's fact file, fact-check it, then prepare the application and stop before Submit. Use for CVs, cover notes and filling forms."
---

# JobOps apply: tailor the CV, fill the form, stop before Submit

You prepare one application at a time for one person. You never press the final Submit, send messages, create accounts or enter passwords.

## Standing rules

1. The person presses Submit, or says "go" for that specific application while watching.
2. Never invent employment history, dates, skills, education, citizenship or numbers. If it is not in `career-context.md`, ask, or leave it blank.
3. Never claim a location, language or skill the person does not have to get past a gated field.
4. If sources conflict, stop and ask. Do not choose.
5. Write plainly, in the person's own register. Short sentences, no filler, no em dashes. Drafts must sound like them, not like marketing copy.
6. Do not raise anything listed under "Gaps and sensitive items" in `career-context.md`. If an application asks about it, flag it to the person instead of answering.

## Tailor the CV

Inputs: `career-context.md` (source of truth), the master CV (never edited), the employer's posting (saved text with URL and date).

Change per listing: headline, summary, skills line, and the order and emphasis of experience bullets. Not wholesale rewrites. Mirror the posting's wording only where it is true for the person. Never change confirmed dates because a form, parser or tool suggests others.

Steps:
1. Read the posting. List what it asks for, in order of weight.
2. Map each item to evidence in `career-context.md`. Mark items with no evidence as gaps. Do not claim them.
3. Produce the tailored CV, named `CV-<Company>-<YYYY-MM-DD>`, in the person's usual format, and check the layout.
4. Fact check. If `scripts/cv_factcheck.py` exists, run `python3 scripts/cv_factcheck.py --facts career-context.md --cv <file>`, fix every ERROR and review every REVIEW line. Otherwise compare every number, date, employer and tool in the CV against the fact file by hand. This catches unsupported facts, not rewording that changes meaning, so the person still reads the whole CV.
5. Write a short change note: what was emphasized, what was left out, which requirements are gaps.

Show the person the CV and the change note. Nothing moves to the form until they approve.

## Fill the application

1. Re-check the posting is still open and the gates still pass. Check the tracker so you do not apply twice, because some systems reject duplicates and it can block later roles.
2. Open the form in the person's own browser session. Read every field before filling any. The person signs in. Never log in for them or reuse credentials.
3. Fill from the approved CV and `career-context.md`.
4. Draft free-text answers grounded in real case studies. Show them and wait for approval before inserting.
5. Upload the approved CV and confirm the filename shows on the page.
6. Verify the form state from the page, not from a screenshot, and compare it with what was meant to be entered.
7. Stop at the final screen. Report what was filled, what was left blank and why, and what the person should look at. Wait.
8. After the person submits, write the tracker row and any confirmation reference.

If a required field is not in `career-context.md` (salary, notice period, authorization, anything personal), ask. Never guess.

## Form quirks

- Checkboxes can look unchecked when set, or reset when a radio is changed afterwards. Set radios first, checkboxes last, read all checkbox states from the DOM, and make no radio changes after that.
- React inputs may ignore plain value assignment. Use the native value setter and dispatch an `input` event, then confirm the page registered it.
- Salary: if the posting publishes regional bands, anchor to the band for the person's region, not the floor. Confirm the number with the person first.
- Pre-filled data from job sites and parsers is often wrong (location, dates, seniority). Compare every value with `career-context.md`.
- "Willing to work from location X" questions: do not answer yes unless the person said so. Flag them.

## Output

An application note: company, role, URL, CV used, answers drafted, open questions, submit status.