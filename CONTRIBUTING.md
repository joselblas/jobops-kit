# Contributing

Thanks for thinking about helping. This is a small project by one person, so please read this page first. It saves time for both of us.

By taking part you agree to the [code of conduct](CODE_OF_CONDUCT.md).

## What helps most

- Reports of things that confused you, especially in the first minute with the dashboard or the setup.
- Accessibility barriers, with the browser and assistive technology you used.
- Fixes for wrong or unclear docs, in English or Spanish.
- New job sources, gates or checks that work for people outside the US.
- Test cases for the skills in `docs/test-fixtures` and `docs/testing-skills.md`.

If you are not sure a change fits, open an issue and ask before you spend time on it.

## Ground rules

These come from `AGENTS.md` and `docs/privacy.md`. They are not negotiable.

1. **No personal data.** Do not commit a real tracker, CV, career file, email export, name, recruiter or employer you applied to. Use fictional data. Run `python3 scripts/privacy_check.py` before you open a pull request.
2. **Nothing that submits for the user.** The kit prepares and stops before Submit. No change should send a message, create an account or enter a password.
3. **Facts only.** CV and application content comes from the user's own files. Do not add features that invent experience, dates or numbers.
4. **No dependencies and no network** in the dashboard. It must keep working from the files, offline.
5. **English and Spanish are equals.** If you change user-facing text, change both, or say in the pull request which one needs a translation.
6. **Write plainly.** Short sentences, no filler, no em dashes.

## Running it

The dashboard is static. From the repo folder:

```
python3 -m http.server 8765
```

Then open `http://localhost:8765/app/index.html`. The scripts in `scripts/` use only the Python standard library, except the accessibility audit, which needs Playwright and axe-core (see the top of `scripts/a11y_audit.py`).

## Before you open a pull request

- `python3 scripts/privacy_check.py` reports nothing new.
- For a change to the dashboard or the site pages, run `scripts/a11y_audit.py` and fix new violations. Check the page with the keyboard, in light and dark, at 320 px wide and on a phone-sized viewport.
- Use the design tokens in `app/style.css`. Do not add raw colours. If you add one, calculate the contrast for both themes and update [docs/design-system.md](docs/design-system.md).
- Update the docs and the screenshots in `docs/screenshots` if what people see has changed.
- Keep the pull request small and say why, not only what.

## Skills and playbooks

If you change a skill or a playbook, say what you tested it on. `docs/testing-skills.md` explains how to test a skill, including cases where the correct answer is to stop and ask. A change that makes an assistant guess instead of ask will not be merged.

## Reporting problems

- Bugs and ideas: open an issue and pick a template.
- Security or personal data: follow [SECURITY.md](SECURITY.md). Do not open a public issue.
- Accessibility: use the "Accessibility barrier" template or see [ACCESSIBILITY.md](ACCESSIBILITY.md).

## Replies

You will usually hear back within a week. Some reviews take longer. A polite nudge is fine.
