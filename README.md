# Job Ops for Claude

A human-in-the-loop job search system for designers and other remote-first knowledge workers. Claude scouts and screens listings, tailors CVs from a verified fact file, fills application forms in your own browser, and stops before Submit. You stay in control of everything that leaves your hands.

Built by [Jose L. Blas](https://portfolio.joselblas.com), a product designer, during a real search for remote roles from Spain. It is a set of plain markdown playbooks and three small scripts. No framework, no server, no telemetry.

## What makes it different

- **Gates before scores.** Remote mode, geography, language, work authorization and legitimacy are checked on the employer's own posting, with quoted evidence, before any CV work. Most wasted effort in a remote search comes from listings that say "remote" on an aggregator and mean one country on the real page.
- **Facts only.** Every CV and answer is built from one file, `career-context.md`. A script checks tailored CVs for numbers, dates and names that file does not contain.
- **Works from outside the US.** The defaults assume you need to verify country lists, languages and entity locations, not just "remote".
- **Runs where you are.** Use it as a Claude Project with uploaded files (no code), or in Claude Code with the scripts.
- **Honest about gaps.** Gaps in fit are stated, not softened.

## What it will not do

- Press Submit for you.
- Send messages or emails for you.
- Create accounts or enter your passwords.
- Invent anything about you.

## How it works

```
scout -> gates -> fit score -> you pick -> tailor CV -> fact check
      -> you review -> apply (stops before Submit) -> you submit
      -> tracker -> funnel review -> interview story bank
```

| Stage | Playbook | Script |
|---|---|---|
| Find and screen listings | `playbooks/scout.md` | |
| Gates and fit score | `playbooks/score-rubric.md` | |
| Open? Real? | `playbooks/liveness-and-legitimacy.md` | `scripts/liveness.py` |
| Tailor CV | `playbooks/cv-tailor.md` | `scripts/cv_factcheck.py` |
| Fill forms | `playbooks/apply.md` | |
| Learn what works | `playbooks/funnel-analytics.md` | `scripts/funnel.py` |
| Interview prep | `playbooks/interview-story-bank.md` | |

## Quick start

**In a Claude Project (no code):**
1. Create a Project. Upload `AGENTS.md` and everything in `playbooks/`.
2. Copy `templates/career-context.example.md` and `templates/profile.example.yml`, fill them in, upload them.
3. Ask: "Scout today's listings and run the gates."

**In Claude Code:**
1. Clone this repo. Copy the templates to `career-context.md`, `profile.yml` and `tracker.csv` (all gitignored).
2. Run `claude` in the folder. It reads `AGENTS.md`.
3. Optional browser control: connect Claude in Chrome for the apply step.

**Scripts** (Python 3, standard library only; `pdftotext` optional for PDFs):

```
python3 scripts/liveness.py <posting-url>
python3 scripts/cv_factcheck.py --facts career-context.md --cv cv/CV-Company-2026-01-01.docx
python3 scripts/funnel.py tracker.csv
```

## Results

> Replace this section with your real numbers once you have enough data, for example: listings screened, gated out by reason, applications sent, responses, interviews. Report small samples as small samples.

## Limits

- `cv_factcheck.py` catches unsupported numbers, dates and names. It does not catch rewording that changes meaning. Read every CV.
- `liveness.py` uses public APIs for Greenhouse, Lever and Ashby. Other systems often need a browser check.
- Form automation is fragile. Verify field values from the page, not from screenshots.
- No tool can fix a weak portfolio or a poor fit. This one stops you wasting effort on the wrong listings.

## Privacy

Everything personal stays local and gitignored. See `docs/lessons-learned.md` for what to keep out of any public fork.

## Credits and license

Inspired by the open-source [career-ops](https://github.com/career-ops-hq/career-ops) project, which takes a similar markdown-and-CLI approach with a larger scanner and PDF pipeline. This kit is a smaller, independent work with a different focus: gate-first screening, geography checks for non-US applicants, and a fact check on CVs.

MIT license. See `LICENSE`.
