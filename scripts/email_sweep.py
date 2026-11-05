#!/usr/bin/env python3
"""Email sweep: read a mail export and propose tracker changes.

Read only. Writes proposals.csv, never the tracker. Every proposal carries a
quoted sentence as evidence. You review each one in the dashboard under
Proposed updates.

  python3 scripts/email_sweep.py --mbox ~/private/INBOX.mbox/mbox \
      --tracker ~/private/tracker.csv --out ~/private/proposals.csv

Standard library only. See playbooks/inbox-sweep.md.
"""
import argparse, csv, email, email.policy, email.utils, mailbox, os, re, sys
from datetime import date, datetime, timedelta

REJECT = [
    r"not (?:be )?(?:moving|move|going|proceeding|progressing|advancing) (?:forward|ahead|on|with)",
    r"decided (?:not )?to (?:move|go|proceed|continue) (?:forward )?with (?:other|another)",
    r"decided not to (?:move|proceed|progress|continue)",
    r"will not be (?:moving|advancing|proceeding|progressing)",
    r"(?:pursue|pursuing|proceed with|moving forward with) (?:other|another) (?:candidates?|applicants?)",
    r"(?:other|another) candidates? (?:whose|who|that|better|more closely)",
    r"no longer (?:being )?(?:considered|under consideration)",
    r"position (?:has been|is now) (?:filled|closed)",
    r"we regret to inform",
    r"(?:not|won't|will not) be (?:taking|taken) (?:your application|you) (?:any )?further",
    r"(?:no|not) (?:hemos|vamos a) (?:podido|continuar|seguir)",
    r"hemos decidido (?:continuar|seguir|avanzar) con (?:otr[oa]s?|otra)",
    r"lamentamos (?:informarte|comunicarte)",
    r"no (?:continuaremos|seguiremos|avanzaremos) con tu",
]
SOFT_REJECT = r"unfortunately|lamentablemente|desafortunadamente"
CONTEXT = r"application|candidate|candidatura|position|role|puesto|process|proceso"
INTERVIEW = [
    r"(?:like|love|want|happy) to (?:invite|speak|talk|chat|meet|schedule|arrange)",
    r"invite you to (?:an? )?(?:interview|call|chat|conversation|next)",
    r"(?:schedule|book|arrange) (?:an? |your |a time for )?(?:interview|call|chat|intro|time|slot|conversation)",
    r"(?:move|moving|progress|progressing) you (?:forward|to the next|on to)",
    r"(?:next|first) (?:stage|round|step) (?:of|in) (?:the|our) (?:interview|hiring|selection|process)",
    r"te (?:invitamos|propongo|proponemos)(?: a)? (?:una )?(?:entrevista|llamada|reunión)",
    r"(?:agendar|programar|concertar) (?:una )?(?:entrevista|llamada)",
]
OFFER = [r"(?:pleased|delighted|happy|excited) to (?:offer|extend)", r"offer letter", r"extend (?:you )?an offer", r"oferta (?:de trabajo|formal)"]
CONFIRM = [
    r"thank(?:s| you) for (?:applying|your application|your interest in)",
    r"(?:we(?:'ve| have)|has been) received your application",
    r"your application (?:has been|was) (?:received|submitted|sent)",
    r"application (?:received|submitted)",
    r"gracias por (?:tu candidatura|postularte|aplicar|tu interés)",
    r"hemos recibido tu candidatura",
]
SUFFIX = re.compile(r"\b(?:inc|ltd|llc|gmbh|sl|sa|ag|plc|limited|corp|co|group|labs?|technologies|technology|tech|health|medical)\b")
NOISE_SENDER = re.compile(r"(?:newsletter|jobalert|job-alert|digest|noreply@linkedin|jobs-noreply@linkedin|indeed\.com/alert)", re.I)


def norm(s):
    return re.sub(r"[^a-z0-9]+", " ", (s or "").lower()).strip()


def core(name):
    n = norm(name)
    c = norm(SUFFIX.sub(" ", n))
    return c if len(c) >= 3 else n


def parse_date(s):
    if not s:
        return None
    for fmt in ("%Y-%m-%d", "%d/%m/%Y"):
        try:
            return datetime.strptime(s.strip(), fmt).date()
        except ValueError:
            pass
    return None


def body_text(msg):
    try:
        part = msg.get_body(preferencelist=("plain", "html"))
    except Exception:
        part = None
    if part is None:
        return ""
    try:
        txt = part.get_content()
    except Exception:
        return ""
    if part.get_content_type() == "text/html":
        txt = re.sub(r"(?is)<(script|style).*?</\1>", " ", txt)
        txt = re.sub(r"(?s)<[^>]+>", " ", txt)
        txt = re.sub(r"&nbsp;", " ", txt)
    return re.sub(r"[ \t\r\f\v]+", " ", txt)[:6000]


def first_hit(patterns, text):
    for p in patterns:
        m = re.search(p, text, re.I)
        if m:
            return m
    return None


def evidence(text, m):
    start = max(text.rfind(".", 0, m.start()), text.rfind("\n", 0, m.start()), text.rfind("!", 0, m.start())) + 1
    ends = [i for i in (text.find(".", m.end()), text.find("\n", m.end()), text.find("!", m.end())) if i >= 0]
    end = min(ends) + 1 if ends else min(len(text), m.end() + 160)
    s = re.sub(r"\s+", " ", text[start:end]).strip().replace('"', "'")
    return s[:230]


def classify(subject, body):
    text = subject + "\n" + body
    m = first_hit(REJECT, text)
    if not m:
        s = re.search(SOFT_REJECT, text, re.I)
        if s and re.search(CONTEXT, text[max(0, s.start() - 200): s.end() + 300], re.I):
            m = s
    if m:
        return "rejected", evidence(text, m)
    m = first_hit(OFFER, text)
    if m and re.search(r"\boffer", text, re.I):
        return "offer", evidence(text, m)
    m = first_hit(INTERVIEW, text)
    if m:
        return "interview", evidence(text, m)
    m = first_hit(CONFIRM, text)
    if m:
        return "applied", evidence(text, m)
    return None, ""


def load_tracker(path):
    with open(path, encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def messages(path):
    if os.path.isdir(path):
        cand = os.path.join(path, "mbox")
        if os.path.isfile(cand):
            path = cand
    if os.path.isfile(path):
        yield from mailbox.mbox(path, factory=lambda f: email.message_from_binary_file(f, policy=email.policy.default))
        return
    for root, _, files in os.walk(path):
        for fn in files:
            if fn.endswith((".eml", ".emlx")):
                with open(os.path.join(root, fn), "rb") as f:
                    raw = f.read()
                if fn.endswith(".emlx"):
                    raw = raw.split(b"\n", 1)[1] if b"\n" in raw[:12] else raw
                yield email.message_from_bytes(raw, policy=email.policy.default)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--mbox", required=True, help="mbox file, folder containing one, or folder of .eml files")
    ap.add_argument("--tracker", required=True)
    ap.add_argument("--out", default="proposals.csv")
    ap.add_argument("--since", help="YYYY-MM-DD. Default: three days before the earliest application in the tracker")
    ap.add_argument("--find-new", action="store_true", help="also propose applications for confirmations that match no tracker row (low confidence)")
    ap.add_argument("--force", action="store_true", help="allow writing inside a git repository")
    a = ap.parse_args()

    out = os.path.abspath(a.out)
    d = os.path.dirname(out)
    while d and d != os.path.dirname(d):
        if os.path.isdir(os.path.join(d, ".git")) and not a.force:
            sys.exit("Refusing to write %s inside a git repository (%s). Your mail evidence is private. Use a path outside the repo, or --force." % (out, d))
        d = os.path.dirname(d)

    rows = load_tracker(a.tracker)
    targets = []
    for i, r in enumerate(rows):
        if r.get("status") == "applied" and r.get("company"):
            targets.append((i, core(r["company"]), norm(r["company"]), parse_date(r.get("date_applied"))))
    applied_dates = [t[3] for t in targets if t[3]]
    since = parse_date(a.since) if a.since else (min(applied_dates) - timedelta(days=3) if applied_dates else date.today() - timedelta(days=120))
    known = {core(r["company"]) for r in rows if r.get("company")}

    best = {}      # row index -> (rank, date, outcome, evidence, source, confidence)
    new = {}       # company key -> proposal
    seen = 0
    RANK = {"rejected": 1, "interview": 2, "offer": 3}
    for msg in messages(a.mbox):
        seen += 1
        try:
            dt = email.utils.parsedate_to_datetime(str(msg["date"])).date()
        except Exception:
            continue
        if dt < since:
            continue
        subject = str(msg["subject"] or "")
        frm = str(msg["from"] or "")
        if NOISE_SENDER.search(frm) or NOISE_SENDER.search(subject):
            continue
        body = body_text(msg)
        kind, ev = classify(subject, body)
        if not kind:
            continue
        head = norm(frm + " " + subject + " " + body[:800])
        hits = [t for t in targets if re.search(r"\b%s\b" % re.escape(t[1]), head) and (t[3] is None or dt >= t[3] - timedelta(days=1))]
        if kind == "applied":
            if not hits and a.find_new:
                m = re.search(r"(?:application (?:to|for|at)|applying to|thanks? for applying to|candidatura (?:en|a|para)) ([A-Z][\w&.\- ]{2,40})", subject + " " + body[:300])
                key = core(m.group(1)) if m else ""
                if m and key and key not in known and key not in new:
                    new[key] = {"kind": "applied", "company": m.group(1).strip(" .-"), "role": "", "outcome": "", "date": dt.isoformat(), "evidence": ev, "source": "email", "confidence": "low"}
            continue
        if not hits:
            continue
        # pick the row: not yet resolved first, then the most recently applied
        hits.sort(key=lambda t: (1 if rows[t[0]].get("outcome") else 0, -(t[3].toordinal() if t[3] else 0)))
        i = hits[0][0]
        conf = "high" if len(hits) == 1 else "low"
        outcome = kind
        applied_on = hits[0][3]
        if kind == "rejected" and applied_on and (dt - applied_on).days <= 2:
            outcome = "rejected-auto"
        cur = best.get(i)
        cand = (RANK.get(kind, 0), dt, outcome, ev, "email", conf)
        if not cur or (dt, cand[0]) > (cur[1], cur[0]):
            best[i] = cand

    props = []
    skipped_same = 0
    for i, (rank, dt, outcome, ev, src, conf) in sorted(best.items(), key=lambda kv: kv[1][1]):
        r = rows[i]
        if r.get("outcome") == outcome:
            skipped_same += 1
            continue
        props.append({"kind": "outcome", "company": r["company"], "role": r.get("role", ""), "outcome": outcome, "date": dt.isoformat(), "evidence": ev, "source": src, "confidence": conf})
    props.extend(new.values())

    cols = ["kind", "company", "role", "outcome", "date", "evidence", "source", "confidence"]
    with open(out, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols, lineterminator="\n")
        w.writeheader()
        w.writerows(props)
    print("Read %d messages since %s." % (seen, since))
    print("%d proposals written to %s (%d already in the tracker, skipped)." % (len(props), out, skipped_same))
    print("Review them in the dashboard under Proposed updates. The tracker was not changed.")


if __name__ == "__main__":
    main()
