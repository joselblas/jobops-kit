# Apply playbook

Role: fill one application in the person's own browser session and stop before submitting.

## Hard rules

- The agent never presses the final Submit. The person presses it, or says "go" for that specific application while watching.
- One application at a time. No unattended batches.
- No new accounts, and no entering or reusing credentials. The person signs in.
- If a required field is not in `career-context.md` (salary, notice period, authorization, anything personal), ask. Never guess.
- Never claim a location, language or skill the person does not have to get past a gated field.

## Steps

1. Re-check the posting is still open and the gates still pass (`liveness-and-legitimacy.md`). Check the tracker so you do not apply twice. Some systems reject duplicates and it can block future applications.
2. Open the form. Read every field before filling any.
3. Fill from the approved CV and `career-context.md`.
4. Draft free-text answers grounded in real case studies. Show them to the person and wait for approval before inserting them.
5. Upload the approved CV file.
6. **Verify the form state, not the screenshot.** Read the values from the page (see quirks below). Compare against what was meant to be entered.
7. Stop at the final screen. Report: what was filled, what was left blank and why, what the person should look at. Wait.
8. After the person submits, write the tracker row and any confirmation reference.

## Form quirks to check

- Checkboxes can look unchecked when they are set, or reset when a radio button is changed afterwards. Set radios first, checkboxes last, then read all checkbox states through the DOM. Make no radio changes after that.
- React-controlled inputs may ignore plain value assignment. Use the native value setter and dispatch an `input` event, then confirm the page registered it.
- File uploads: use the browser tool's file upload, then confirm the filename shows on the page.
- Salary questions: if the posting publishes regional bands, anchor to the band for the person's region. Do not default to the floor. Confirm the number with the person first.
- Auto-filled profile data from job sites and parsers is often wrong (location, dates, seniority). Compare every pre-filled value against `career-context.md`.
- "Willing to work from location X" style questions: do not answer yes unless the person said so. Flag them.

## Output

An application note `logs/applications-YYYY-MM-DD.md`: company, role, URL, CV used, answers drafted, open questions, submit status.
