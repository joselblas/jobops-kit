# CV builder playbook: from graded evidence to a CV someone can defend

Role: build the person's CV from their career vault and fact file. Every line on the page must trace to something the person said or can show. You write the words. They own the facts.

This sits between the vault interview (`vault.md`) and the application (`apply.md`). The vault holds the raw, graded material. The CV builder turns it into a document. The apply step tailors it to one listing and fills the form.

## Inputs

- `career-context.md`: confirmed facts, source of truth. Includes "Do not claim" and any sensitive items.
- `career-vault.md`: graded atoms (M, R, E, Q), parked items, NDA marks. May be missing. Then build from `career-context.md` and the master CV only, and say the CV will be thinner for it.
- The target: one listing, or a role family ("senior product designer, health").
- `hooks.csv` and the positioning sentence, if they exist (`hooks.md`).
- The master CV, read only.

## What may go on a CV

| Source | May appear as |
|---|---|
| Atom graded M | A fact, with its number |
| Atom graded R, confirmed by the person | A fact, without a number unless they confirm one |
| Atom graded E | Never. Offer an unlock question instead |
| Atom graded Q | Never. Ask |
| Atom marked NDA | Never named. Describe the work without the client, figure or screen, and ask first |
| Parked atom | Only if the person moves it out of parked |
| Anything under "Do not claim" | Never, even if a vault atom suggests it. Stop and ask |

If two sources disagree (a date, a title, a number, a skill), stop and show both. Do not choose.

## Steps

### 1. Brief (two minutes)
Confirm the target. If a listing, read it and list five to seven requirements in order of weight, marking must, should and nice. Say which three you will lead with. The person may reorder them.

### 2. Evidence map
A table: requirement, the atoms that answer it, their grades, and strength (strong, partial, none). Show it before writing anything. Mark `none` as GAP. Never fill a GAP by stretching a nearby atom. The person confirms or changes the map.

### 3. Draft, with options
- **Positioning line (summary):** three options of at most three lines each, built on the positioning sentence. No adjective without proof next to it.
- **Bullets:** for each role, three to five bullets for recent roles, two or three for older ones. Order by relevance to the weighted requirements. Job order stays reverse chronological.
- **Skills:** only tools and methods with evidence behind them. Group them. No ratings, no bars.
- **Hooks:** place at most three, each tied to a story the person can tell (see `hooks.md`). Never place a hook whose atom is E or Q.

Bullet formula: past-tense verb, what, the constraint or decision that made it hard, the result. Two lines at most. One idea per bullet. A number only if the atom is M, written as the atom states it.

### 4. Trace and gaps
Produce a trace table (see `templates/cv-trace.example.md`): each CV line, its atom id, grade, where it was confirmed, and which requirement it serves. Then list:
- **Gaps:** requirements with no evidence, said plainly.
- **Unlocks:** for each E, Q or partial item, the one question that would upgrade it, answerable in a minute ("Is there a report or message showing the 30 percent?").
- **Conflicts:** anything the sources disagree on.

### 5. Checks
- Fact check: every number, date, employer, title and tool against `career-context.md`. If `scripts/cv_factcheck.py` exists, run it.
- Voice check: read it aloud. Remove filler (see list below). It should sound like the person talks.
- Six-second signal check (`hooks.md`): from the top third, what would a recruiter infer? Say it, and compare with the intent.
- Format check below.

### 6. Hand-off
Name the version so the tracker can learn from it: `cv-<family>-<n>`, for example `cv-health-systems-2`. Tell the person to record it in the `cv_version` column of each application that uses it. Offer to promote any newly confirmed facts to `career-context.md`. The apply step produces the file and fills the form.

## Versions: fewer than you think

Keep a master CV (everything confirmed, two pages) and three or four role-family versions. Per listing, change only the headline, the summary, the skills line and the order of bullets. Many versions make it impossible to learn which works, and the dashboard's CV and portfolio page needs a few versions with enough applications each.

## Format

- One column. Standard headings (Summary, Experience, Skills, Education). No tables, icons, photos, text in images or text boxes.
- Dates as MM/YYYY, the same everywhere. A short, plain location line.
- A font that survives (system sans or serif), 10 to 11 pt, readable margins.
- Two pages at most for fifteen years of work. One page if under about eight years.
- Text selectable in the PDF. Link text spelled out, not "click here".
- Write in the language of the listing, unless the person says otherwise.

## Words to avoid

passionate, results-driven, dynamic, synergy, seamlessly, leveraged, spearheaded, utilised, responsible for, cutting-edge, world-class, "proven track record", and any em dash. Prefer plain verbs: led, built, cut, shipped, tested, wrote, taught.

## Human touches

- Offer choices, not a single verdict. Three summaries, two bullet wordings.
- Say why each line is there ("this answers the design-system requirement").
- When the evidence is thin, say so kindly and name the one question that would help. A short, honest CV beats a padded one.
- If a story keeps coming up and has no bullet, ask whether it belongs.

## Do not

- Invent, round, upgrade or "tidy" a fact, number, date or title.
- Claim a skill or language the record does not support, even to pass a gate.
- Bring up anything listed under sensitive items unless the application asks, and then flag it to the person.
- Edit the master CV or `career-context.md`. Propose blocks to paste.
- Submit, send or fill a form. That belongs to `apply.md`.
