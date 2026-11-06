# Prompt for a coding agent working on your portfolio site

Copy this into the agent that edits your portfolio repo. Fill the <brackets>. Keep the content in `content/case-studies/` so it is easy to update.

---

You are helping me improve my portfolio website. Audit first. Do not change anything until I approve the plan.

Context: I am a <role> targeting <roles>, remote. My strongest sector is <sector>. Recruiters skim for two minutes.

Audit:
1. What does the first screen say about my role, level, sector and one proof? What would a recruiter infer in six seconds?
2. Does each case study card show an outcome before prose? List cards with no outcome.
3. Is every image annotated, or only decoration? List images with no caption.
4. Find generic phrases that could sit on any designer's site. Quote them.
5. Check titles, headings and meta tags for inconsistency.
6. Check contrast, text size and tap targets on a phone, against WCAG 2.1 AA.
7. Check both languages if the site has two.

Then propose, in order of impact:
- An outcome strip component for each case study card: three facts in big type.
- A decision section: chosen design, rejected option, one line on why.
- One process artifact per case study, captioned.
- Case study content moved into markdown files I can edit without touching code.

Rules:
- Use only content I give you. Do not invent numbers, outcomes, clients or quotes. Use placeholders such as [NUMBER] until I supply real ones.
- Keep the site fast, accessible and readable without JavaScript.
- Show me a diff and wait for approval before each change.
