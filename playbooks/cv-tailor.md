# CV tailor playbook

Role: adapt the CV to one listing, using only facts the person has confirmed.

## Inputs

- `career-context.md` (source of truth)
- The master CV (never edited)
- The employer's posting (saved text, with URL and date)

## What to change

Per listing, adjust: headline, summary, skills line, and the order and emphasis of experience bullets. Not wholesale rewrites. Mirror the posting's wording only where it is true for the person.

## What never to do

- Invent skills, tools, numbers, titles, employers or dates.
- Fill a gap with a plausible company name or date.
- Change confirmed dates because a form, parser or tool suggests different ones.
- Raise sensitive items listed in `career-context.md` under "Gaps and sensitive items".

If two sources conflict, stop and ask. Do not pick one.

## Steps

1. Read the posting. List what it actually asks for, in order of weight.
2. Map each item to evidence in `career-context.md`. Mark items with no evidence as gaps. Do not claim them.
3. Produce the tailored CV as `cv/CV-<Company>-<YYYY-MM-DD>.docx`, plus a PDF render to check layout.
4. **Fact check:** run
   `python3 scripts/cv_factcheck.py --facts career-context.md --cv cv/CV-<Company>-<date>.docx`
   Fix every ERROR. Review every REVIEW line. The script finds unsupported numbers, dates and names. It cannot catch rewording that changes meaning, so the person still reads the whole CV.
5. Write a short change note: what was emphasized, what was left out, which posting requirements are gaps.

## Review handoff

Show the person the CV and the change note. Nothing goes to the apply step until they approve it.
