# Set up Job Ops

An illustrated version of these steps is at https://joselblas.github.io/jobops-kit/setup/.

About 30 minutes. No code needed. You build it once, then you use it every week.

This repo has two parts. You can use either one alone.

- **The Claude kit**: instructions that turn a Claude Project into a careful job-search assistant. Part 1 to 4 below.
- **The dashboard**: a page in your browser that shows your tracker and helps you update it. Part 5 below.

## Parts list

| You need | Why |
|---|---|
| A Claude account that has Projects | The assistant lives in a Project |
| Chrome or Edge | The dashboard saves straight to your file in these. Other browsers work with a download |
| Your current CV as a file or text | The source for your fact file |
| A folder on your computer, outside any Git repo | Your private data lives here |
| About 30 minutes | Mostly writing down facts about yourself |

You do not need Python or Git to start. They only matter for the optional scripts.

## Part 1. Get the files

1. Open https://github.com/joselblas/jobops-kit.
2. Click **Code**, then **Download ZIP**.
3. Unzip it. You should see `AGENTS.md`, and folders named `playbooks`, `templates`, `app`.

## Part 2. Make your private folder

Your real data never goes in the repo folder. Keep it apart.

4. Create a folder called `jobops-private` somewhere else, for example in Documents.
5. Copy these four files from `templates/` into it:
   - `career-context.example.md`, rename it to `career-context.md`
   - `profile.example.yml`, rename it to `profile.yml`
   - `tracker.example.csv`, rename it to `tracker.csv`
   - leave the other two templates where they are for now

You should see three files in `jobops-private`.

## Part 3. Write your facts

This is the step that matters most. The assistant builds every CV and answer from this file and nothing else.

6. Open `career-context.md`. Fill in every section from your CV: name, headline, location, languages, education with exact dates, each job with outcomes you can defend.
7. Under **Gaps and sensitive items**, write how you want gaps shown and what the assistant must never raise on its own.
8. Under **Do not claim**, list skills you do not have.
9. Open `profile.yml`. Set your target roles, `work_mode`, where you are based, and which regions count as eligible. Add companies you will never work for.

You should see no template placeholders left (`Country, Region`, `ExampleCorp`, empty `Name:`).

If you do not know a fact, leave it blank. A blank is safe. A guess is not.

## Part 4. Set up Claude

The rules and playbooks come packaged as four skills in the `skills/` folder. You install them once, and they work in every Project.

10. In Claude, open **Settings** and then **Skills**. Add the four skills from the `skills/` folder: `jobops-screen`, `jobops-craft`, `jobops-apply`, `jobops-review`. Each is a folder with one `SKILL.md` file. If Claude asks for a zip, zip the folder first.
11. Create a new **Project** called "Job search".
12. Upload three files to the Project: your `career-context.md`, `profile.yml` and `tracker.csv`.
13. In the Project instructions, paste one line: `Use the JobOps skills for job search tasks.`
14. Start a chat in the Project and type: `Scout today's listings and run the gates.`

You should see all four skills switched on in Settings. Then you should get a short scout note: new leads with a score, the gates checked with quoted evidence, and a list of anything not suitable, each with a reason.

Rules the assistant follows (see `AGENTS.md`): it never submits, sends or creates accounts. You press the final button, every time.

### Without skills

If you prefer not to install skills, skip step 10 and upload `AGENTS.md` and everything in `playbooks/` to the Project instead. The rules are the same.

### Using Claude Code instead

If you prefer the terminal: put the repo folder and your private files side by side, copy `career-context.md`, `profile.yml` and `tracker.csv` into the repo folder (they are gitignored), run `claude` there. It reads `AGENTS.md` by itself and uses the playbooks and scripts directly.

## Part 5. Open the dashboard

15. Try it first: https://joselblas.github.io/jobops-kit/app/ shows fictional sample data.
16. For your own data, open `app/index.html` from the unzipped folder in Chrome or Edge.
17. Click **Open and edit** and choose `jobops-private/tracker.csv`.

You should see your own listings in the overview. Edits save straight back to the file. Nothing leaves your computer.

## Your weekly rhythm

| When | Do this |
|---|---|
| Each day you search | Ask the Project to scout. Pick leads. Review each tailored CV before anything is filled |
| After each application | Mark it applied in the dashboard (**Log an update**) |
| When replies arrive | **Log an update**, or run the email sweep and accept proposals under **Proposed updates** |
| Every 3 weeks of silence | Open **Follow-ups**, copy a draft, send it yourself |
| Once a week | **Weekly review**. Five minutes |

## If something looks wrong

| You see | Try |
|---|---|
| The dashboard shows sample data | You have not opened your file. Click **Open and edit** |
| No "Open" button | Your browser cannot save to a file. Use Chrome or Edge, or use **Load tracker.csv**, then **Download CSV** to save |
| The assistant invents a fact | It should not. Add the real fact to `career-context.md`, re-upload, and say what it got wrong |
| Scout results ignore your gates | Check `profile.yml` was uploaded and has no placeholders |
| A listing said remote but is not | Expected. Gates are checked on the employer's page. Tell the assistant, it logs the reason |

## Keep your data private

Never commit `career-context.md`, `profile.yml`, `tracker.csv`, `cv/`, `logs/`. They are gitignored. Run `python3 scripts/privacy_check.py` before you publish a fork. See `docs/lessons-learned.md`.
