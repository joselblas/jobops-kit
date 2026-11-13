# Set up JobOps in 15 minutes

Spanish version: [setup.es.md](setup.es.md). An illustrated version is at https://joselblas.github.io/jobops-kit/setup/.

You do not write code, and you do not fill in templates by hand. You install the skills once, and Claude interviews you to write your starter files. The whole idea in one line: **everything is context, written as text.** Claude reads a few files about you and about what you want. It never guesses.

## What you need

| You need | Why |
|---|---|
| A Claude account that can create Projects and add skills | The assistant lives in a Project |
| Your current CV, as a file or pasted text | Claude starts from it and asks you to confirm each fact |
| Chrome or Edge | The dashboard saves straight to your folder in these. Other browsers work with a download |
| About 15 minutes | Mostly answering questions about yourself |

You do not need Python or Git. They are only for the optional scripts.

## Before you start: what stays where

- **On your computer only:** the dashboard, your `tracker.csv` and your private folder. The dashboard makes no network requests and has no analytics.
- **In your Claude account:** whatever you type or upload to the Project. It is handled under your account's privacy settings. Check them in Claude under **Settings, Privacy** before you upload anything.

Read [privacy.md](privacy.md) once. It is short.

## Steps

**1. Get the files.**
Open https://github.com/joselblas/jobops-kit, click **Code**, then **Download ZIP**, and unzip it.
You should see a folder with `README.md`, `skills`, `app` and `playbooks` inside.

**2. Make your private folder.**
Create an empty folder called `jobops-private` in Documents, not inside the unzipped folder.
You should see an empty folder. Your real data will live here and nowhere else.

**3. Add the skills.**
In Claude open **Settings, Skills**. Add these five skills from the `skills` folder: `jobops-start`, `jobops-screen`, `jobops-craft`, `jobops-apply`, `jobops-review`. Each is a folder with one `SKILL.md` file. If Claude asks for a zip, zip the folder first.
You should see five JobOps skills switched on.

**4. Make a Project.**
Create a Project called "Job search". In its instructions paste: `Use the JobOps skills for job search tasks.`
You should see an empty Project.

**5. Say start.**
Open a chat in the Project. Attach your CV if you have one. Type: `Start`.
Claude explains how this works, asks what to keep private, then asks you questions one at a time. It shows you each fact before keeping it. Leave anything you do not know blank. A blank is safe, a guess is not.
At the end you should get three files: `career-context.md`, `profile.yml` and `tracker.csv`.

**6. Save the three files in `jobops-private`.**
You should see three files in the folder.

**7. Upload the same three files to the Project.**
Claude cannot see your folder, so this is how it keeps your facts for the next chat.
You should see the three files listed under the Project files.

**8. Run your first search.**
In a new chat in the Project type: `Scout today's listings and run the gates.`
You should get a short note: new leads with a score, the gates checked on the employer's own page with quoted evidence, and a list of listings that did not pass, each with the reason.

**9. Open the dashboard.**
Open `app/index.html` from the unzipped folder in Chrome or Edge. Press **Connect folder** and choose `jobops-private`.
You should see your own search in the overview. Edits save straight back to your file.

You can stop after step 8 and use only the assistant, or open only the dashboard from step 9 with your own `tracker.csv`.

## The rules the assistant follows

It never submits an application, sends a message or creates an account. You press the final button every time. It never invents anything about you. See `AGENTS.md`.

## Your weekly rhythm

| When | Do this |
|---|---|
| Each day you search | Ask the Project to scout. Pick leads. Review each tailored CV before anything is filled |
| After each application | **Log an update** in the dashboard |
| When replies arrive | **Log an update**, or run the email sweep and accept proposals under **Proposed updates** |
| After three weeks of silence | **Follow-ups**: copy a draft, send it yourself |
| Once a week | **Weekly review**. Five minutes |

## Other ways to run it

- **Without skills.** Skip step 3. Upload `AGENTS.md` and everything in `playbooks/` to the Project instead, then say `Start`. Claude follows `playbooks/start.md`. The rules are the same.
- **With Claude Code.** Put the three files in the repo folder (they are gitignored) and run `claude` there. It reads `AGENTS.md` by itself and uses the playbooks and scripts directly. Your files stay on disk, but the text Claude reads still goes to Claude.
- **Dashboard only.** Open the demo at https://joselblas.github.io/jobops-kit/app/ or open `app/index.html`. Add your listings by hand. No Claude account needed.

## If something looks wrong

| You see | Try |
|---|---|
| Claude does not offer to start | Check `jobops-start` is switched on in Settings, Skills. Or type: `Use the jobops-start skill` |
| The dashboard shows sample data | You have not connected your folder yet. Press **Connect folder** |
| No **Connect folder** button works | Your browser cannot save to a folder. Use Chrome or Edge, or press **Load tracker.csv** and then **Download CSV** to save |
| The assistant invents a fact | It should not. Correct it in the chat, update `career-context.md` and upload it again |
| Scout results ignore your gates | Check `profile.yml` is in the Project and has no placeholders left |
| A listing said remote but is not | Expected. Gates are checked on the employer's page. Tell the assistant and it logs the reason |

## Keep your data private

Never commit `career-context.md`, `profile.yml`, `tracker.csv`, `cv/` or `logs/`. They are gitignored. Run `python3 scripts/privacy_check.py` before you publish a fork. See [lessons-learned.md](lessons-learned.md).
