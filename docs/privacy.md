# Privacy and security

Spanish version: [privacy.es.md](privacy.es.md).

**Short version.** fAInd has two layers, and they work differently. The dashboard and your files are local. The assistant is Claude, so whatever you give it is processed by Claude under your account's settings. You decide what to give it.

## Layer 1: on your computer

| Thing | Where it lives | What leaves your computer |
|---|---|---|
| The dashboard (`app/`) | Your browser, running from a file or from the demo page | Nothing. No analytics, no accounts, no fonts or scripts from other sites |
| `tracker.csv`, `proposals.csv`, `career-vault.md`, `hooks.csv` | The `jobops-private` folder you choose | Nothing |
| The scripts (`scripts/`) | Your terminal | Only `liveness.py`, which asks public job-board APIs whether a posting is open |
| Settings in the dashboard (theme, language, your name for follow-up drafts, ticks in Proof) | Your browser's local storage on this computer | Nothing |
| The folder permission | Your browser, on this computer | Nothing |

How we checked: we loaded nine dashboard pages and recorded every network request. There were four, all to the dashboard's own files. The code has no `fetch`, no `XMLHttpRequest` and no beacon. You can repeat it: open the page, open the browser's developer tools, choose **Network**, reload, and look at the list.

One caveat. If you open the live demo at `joselblas.github.io`, the page itself is loaded from GitHub, as any web page is. Your tracker is never sent there. To avoid even that, download the repo and open `app/index.html`.

## Layer 2: the assistant

The assistant is Claude, running in your Claude account. What you type, the files you attach to a chat and the files you upload to a Project go to Anthropic's servers so Claude can read them. How they are kept, and whether they can be used to improve Claude, depends on your account type and your privacy settings.

Do this once:

1. In Claude, open **Settings, then Privacy**.
2. Read the **Help improve Claude** setting and choose what you want.
3. Know how to delete a chat or a Project file when you are done.

Anthropic explains the setting here: https://privacy.claude.com/en/articles/12109829-how-do-i-change-my-model-improvement-privacy-settings. Policies change, so read the current page rather than trusting a summary, including this one.

### What the assistant sees

Only what you give it: your CV, the facts you confirm in the interview, your search rules, your tracker if you upload it, and the listings it reads on the web. It cannot see the rest of your computer. It cannot reach your private folder unless you attach a file.

### What to keep out

You do not need these for a good search, so leave them out:

- Government ID numbers, bank details, health information.
- Details of a project under NDA. Write the method and your role, not the client or the numbers.
- References' phone numbers and private emails. Names and roles are enough.
- Salary history. Write the range you want, not what you earned.

`jobops-start` asks you at the beginning what to keep out, and follows your answer.

## The assistant's own limits

These are rules in `AGENTS.md`, not guesses about behaviour:

- It never submits an application, sends a message or creates an account. You press the button.
- It never enters a password.
- It never invents a fact about you. Missing means blank, or a question.
- It logs what it checked, with the evidence, so you can see how it decided.

## If you want the most local setup

- Use the dashboard alone, with your own `tracker.csv`. Nothing is sent anywhere.
- Use the scripts alone. Same.
- Use Claude Code with your files on disk. The files stay on your computer, but the parts Claude reads are still sent to Claude to be processed.

There is no way to use an AI assistant without sending it the text it works on. fAInd keeps that to the minimum, and tells you where the line is.

## Before you publish a fork

Run `python3 scripts/privacy_check.py`. Keep your real files out of the repo (`.gitignore` covers the standard paths), and check `git status` and the history before every push. The checklist is in [lessons-learned.md](lessons-learned.md).
