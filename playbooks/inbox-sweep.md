# Inbox sweep

Goal: find replies in your email that the tracker does not know about, and propose changes. The agent proposes. You decide in the dashboard under **Proposed updates**.

## Rules
- Read only. Never reply, delete or move mail.
- Every proposal needs evidence: a short quote from the email, in quotation marks. No quote, no proposal.
- Match to an existing tracker row by company first, then role. If there is no match, propose `applied` only when the email confirms an application. Otherwise leave it out.
- One row per email. Do not guess dates. Use the date on the email.
- Automated rejections arriving within about two days of applying are `rejected-auto`.
- Do not write to `tracker.csv`. Write `proposals.csv` only.

## Input
Mail exported as mbox or EML into a private folder outside the repo (for Apple Mail: Mailbox > Export Mailbox). Never commit it.

## Output: proposals.csv

| Column | Values |
|---|---|
| kind | `outcome` or `applied` |
| company | as in the tracker |
| role | as in the tracker, or from the email for `applied` |
| outcome | `rejected`, `rejected-auto`, `interview`, `offer`, `withdrawn`, `no-response` (empty for `applied`) |
| date | `YYYY-MM-DD`, the email date |
| evidence | quoted sentence |
| source | `email` unless stated |

See `templates/proposals.example.csv`.

## Review
Open the dashboard, go to **Proposed updates**, load `proposals.csv`, and accept or skip each one. With Open and edit, accepted changes save straight to your tracker.
