# Job Ops for Claude

A calm, careful way to run a remote job search with Claude. You stay in control of everything that leaves your hands.

Built by [Jose L. Blas](https://joselblas.com), a product designer, during a real search for remote roles from Spain. No framework, no server, no telemetry.

**[Set it up in 30 minutes](https://joselblas.github.io/jobops-kit/setup/)** ([text version](docs/setup.md)) · [Live demo](https://joselblas.github.io/jobops-kit/app/) · [Design and story](https://joselblas.github.io/jobops-kit/design/)

![Overview](docs/screenshots/overview-light.png)

## Two parts, one search

| | The Claude kit | The dashboard |
|---|---|---|
| What it is | Three Claude skills (or the same playbooks as plain markdown) that turn a Claude Project or Claude Code into a job-search assistant | A page in your browser that shows your tracker and gives you small tools |
| Where it lives | `skills/`, `AGENTS.md`, `playbooks/`, `templates/`, `scripts/` | `app/` |
| What it does | Finds and screens listings, checks the gates, tailors CVs from your facts, fills forms and stops before Submit, reads your email export for replies | Funnel and odds, tracker, step-by-step updates, proposed updates, follow-up drafts, weekly review |
| Needs | A Claude account with Projects | A browser. Chrome or Edge to save to your file |

They share one file, `tracker.csv`. The assistant writes proposals. You accept them in the dashboard. Neither works behind your back.

## Pick your path

- **I want the assistant.** Follow [docs/setup.md](docs/setup.md), parts 1 to 4. Install three skills, make a Claude Project, no code.
- **I use Claude Code.** Same guide, "Using Claude Code instead".
- **I only want the dashboard.** Open the [demo](https://joselblas.github.io/jobops-kit/app/), or open `app/index.html` and load your own CSV (columns in `app/README.md`).

## Principles

- **Gates before scores.** Remote mode, geography, language, work authorization and legitimacy are checked on the employer's own posting, with quoted evidence, before any CV work.
- **Facts only.** Every CV and answer comes from one file, `career-context.md`. A script flags numbers, dates and names it does not contain.
- **Works from outside the US.** Country lists and entity locations are verified, not assumed from the word "remote".
- **Honest about gaps.** Gaps in fit are stated, not softened.
- **You press the button.** The assistant will not submit, send messages, create accounts or enter passwords. It will not invent anything about you.

## The skills

| Skill | Covers |
|---|---|
| `jobops-screen` | Scout, gates, legitimacy check, fit score |
| `jobops-apply` | Tailor the CV, fact check, fill the form, stop before Submit |
| `jobops-review` | Funnel review, email sweep, fit ratings, interview story bank |

They are condensed copies of the playbooks and work without the scripts. The playbooks stay the full reference and the path for Claude Code. To check the skills behave, run the test in [docs/testing-skills.md](docs/testing-skills.md). Fit ratings use the anchors in [docs/score-anchors.md](docs/score-anchors.md).

## How it flows

```
scout -> gates -> fit score -> you pick -> tailor CV -> fact check
      -> you review -> apply (stops before Submit) -> you submit
      -> tracker -> follow up -> funnel review -> interview story bank
```

| Stage | Playbook | Script |
|---|---|---|
| Find and screen listings | `playbooks/scout.md` | |
| Gates and fit score | `playbooks/score-rubric.md` | |
| Open? Real? | `playbooks/liveness-and-legitimacy.md` | `scripts/liveness.py` |
| Tailor CV | `playbooks/cv-tailor.md` | `scripts/cv_factcheck.py` |
| Fill forms | `playbooks/apply.md` | |
| Rate fit for unrated listings | `playbooks/fit-helper.md` | |
| Find replies in your email | `playbooks/inbox-sweep.md` | `scripts/email_sweep.py` |
| Learn what works | `playbooks/funnel-analytics.md` | `scripts/funnel.py` |
| Interview prep | `playbooks/interview-story-bank.md` | |

Scripts need Python 3 and nothing else. Check a CV: `python3 scripts/cv_factcheck.py --facts career-context.md --cv cv/CV-Company-2026-01-01.docx`.

## What is in the dashboard

Rounded cards, a left menu, light by default with a dark option, English and Spanish. It reads your own `tracker.csv` and sends nothing anywhere.

- **Overview**: funnel, odds of an interview in plain words, fit radar, score against outcome, waiting list.
- **Tracker**: filter, search, sort and edit. In Chrome or Edge it saves straight back to your file.
- **Log an update**: one question per step. A reply arrived, I applied, an interview happened.
- **Follow-ups**: applications silent for three weeks, each with a short draft in English or Spanish. You copy it and send it yourself. Nothing is sent from the app.
- **Proposed updates**: the assistant reads your email export and proposes changes with a quote as evidence. You accept or skip each one. It can also propose fit ratings for unrated listings.
- **Weekly review**: five calm minutes. The week against the one before, a chance to close dead applications, one thing you did well, a focus for next week.
- **Steady** (preview): your own base rate and one dry line after a rejection.
- **Scout, CV and portfolio, Apply, Interview prep**: menu pages marked Soon.

| Log an update | Steady | Dark |
|---|---|---|
| ![Log](docs/screenshots/log-step.png) | ![Steady](docs/screenshots/steady.png) | ![Dark](docs/screenshots/overview-dark.png) |

## Limits

- `cv_factcheck.py` catches unsupported numbers, dates and names. It does not catch rewording that changes meaning. Read every CV.
- `liveness.py` uses public APIs for Greenhouse, Lever and Ashby. Other systems often need a browser check.
- Form automation is fragile. Verify field values from the page, not from screenshots.
- The email sweep matches phrases. It misses some replies. Treat it as a helper, not a judge.
- Small samples mislead. Your odds in the dashboard come with a range for that reason.
- No tool fixes a weak portfolio or a poor fit. This one stops you wasting effort on the wrong listings.

## Privacy

Everything personal stays local and gitignored. Keep your private files in a folder outside this repo. `python3 scripts/privacy_check.py` flags leaks before you publish a fork. See `docs/lessons-learned.md`.

## Credits and license

Inspired by the open-source [career-ops](https://github.com/career-ops-hq/career-ops) project, which takes a similar markdown-and-CLI approach with a larger scanner and PDF pipeline. This kit is a smaller, independent work with a different focus: gate-first screening, geography checks for non-US applicants, and a fact check on CVs.

MIT license. See `LICENSE`.
