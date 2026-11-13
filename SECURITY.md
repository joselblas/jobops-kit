# Security policy

## What this project is

fAInd (repository `jobops-kit`) is a static dashboard that runs in your browser, plus Claude skills, playbooks and small Python scripts that run on your own computer. There is no server, no account system and no telemetry. The dashboard makes no network requests, and the demo page uses fictional data.

That means the realistic security problems are:

- **Personal data leaking into the repository or a fork**, such as a real tracker, CV, career file, email export or name.
- **Script or dashboard bugs** that could run unwanted code, for example unsafe handling of a CSV or markdown file, or an injection through content loaded into the dashboard.
- **Skill or playbook instructions** that could make an assistant submit, send, create an account or reveal private files against the rules in `AGENTS.md`.

## Supported versions

Only the current main branch is maintained.

## How to report

Please do not open a public issue for a security problem.

Email ux@joselblas.com with:

- what you found and where (file, page or skill),
- how to reproduce it,
- what you think the impact is.

If private vulnerability reporting is enabled on the repository, you can use the Security tab instead.

You will get a first reply within about a week. This is a one-person project, so fixes depend on time, but anything that could expose personal data is treated as the highest priority.

## If you find your own data in the repository

Tell the maintainer the same way. Include the file and line and what should be removed. Run `python3 scripts/privacy_check.py` before publishing any fork of your own.

## What counts as out of scope

- Findings that need access to your own computer or your own browser profile.
- The behaviour of Claude, your browser, GitHub or other services. Report those to their owners.
- Missing HTTP headers on the demo site hosted by GitHub Pages.
