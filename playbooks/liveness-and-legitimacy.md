# Liveness and legitimacy check

Goal: do not spend effort on postings that are closed, fake, or not what the aggregator said.

## Step 1: Find the employer's own page

Aggregator and LinkedIn listings are pointers, not sources. Find the posting on the company's careers page or its ATS (Ashby, Greenhouse, Lever, Workable, Personio, Workday, and so on). If you cannot find it there, record `fail:no-employer-page` unless the listing is from a recruiter you can identify, in which case record `unclear` and name the agency.

## Step 2: Is it open?

Fastest to slowest:

1. Run `scripts/liveness.py <url>`. It calls the public API for Greenhouse, Lever and Ashby boards and falls back to a plain page check. Result: `OPEN`, `CLOSED` or `UNKNOWN`.
2. For `UNKNOWN` (JavaScript-rendered pages, Workday, Personio), open the page in the browser and look for the apply button and the closed-posting wording ("no longer accepting", "position filled", "page not found", a redirect to the careers index).
3. Record the date checked. A posting that was open last week may be closed today.

## Step 3: Legitimacy signals

Mark `unclear` or `fail:legit` and tell the person if two or more of these are present:

- Same posting republished repeatedly with no change, over a long period.
- No named hiring team, no salary information, and vague responsibilities.
- Recruiter or agency posting with no named client.
- Request for payment, personal documents, or data beyond a normal application before any interview.
- Company domain or ATS link does not match the company named in the listing.
- Contact is only via a messaging app.

A single signal alone is a note, not a fail. Agencies are fine, but say it is an agency listing, because it changes who sees the application.

## Step 4: Record

In the tracker, `gate_result` includes `legit:pass`, `legit:unclear` or `fail:closed` / `fail:legit`, and the notes column holds the URL checked and the date.

## Reminders

- Re-check liveness again right before filling the form, not only at scouting time.
- A listing that is gone on the real page is closed, even if it still shows on three aggregators.
- "Anywhere in the world" and "multiple countries" tags on aggregators are not evidence. Several roles carrying that tag were limited to one country on the employer's page. Read the location on the employer's posting.
