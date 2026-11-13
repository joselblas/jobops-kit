# fAInd brand

The live version, with downloads, is at [design/brand/](https://joselblas.github.io/jobops-kit/design/brand/).

## The idea

Find a job. Keep your head. The AI is written into the word, quietly, and is not the headline. The strongest parts of the product are privacy, plain-text context and honest numbers, and the AI serves those.

## The name

- Say it "find". Write it **fAInd**, with a capital A and I.
- A capital in the middle of a word is read letter by letter by some screen readers. The wordmark therefore carries the text "find" for assistive technology. In plain text, where you cannot do that, add what it is the first time: "fAInd, the open job search kit".
- The repository (`jobops-kit`), the file names and the skills (`jobops-start` and the others) keep their technical names, so nothing already installed breaks.
- Page titles cannot hold hidden text, so they use the name as written.

### Name risk

Searching the web on 13 November 2026 found other products with the same or a very close name: FAIND (an AI app that connects people with shared interests, 2024), Faind (an AI shopping assistant), Faind (professional search and freelancer matching, November 2025) and a company with the exact spelling fAInd that makes an AI sensing platform for RFID tags (2024). I have not checked domain names, social handles or the EUIPO trademark register.

For an open-source portfolio project the risk is low. For anything commercial, or if you want to rank for your own name, it is a real problem. Two mitigations: always write it with its description the first time ("the open job search kit"), and keep the name in one place so it can change. In the code the wordmark is one inline SVG snippet and the name appears in a handful of page titles, so a rename is a short job.

## Wordmark

A round mark and the name, drawn as outlines so it looks the same everywhere. The AI is in the accent colour. The I has serifs on purpose: in a plain sans a capital I looks like a lower case l and the name reads "fAlnd".

- Use the supplied files in `design/brand/assets/`. Light version on light, dark version on dark.
- Clear space: three times the height of the mark's inner dot. Minimum width 96 px for the wordmark, 16 px for the mark alone.
- Do not retype it, stretch it, outline it, add shadows or recolour it. Do not put the gold AI on a light background.

## Colour

| Name | Value | Use |
|------|-------|-----|
| Mist | `#E1EBF0` | Light surface |
| Teal | `#A9CDD4` | Soft fills, the mark on dark |
| Steel | `#477A91` | The mark and the AI on light |
| Deep steel | `#2E5C72` | Buttons and links on light |
| Ink | `#17313E` | Text on light |
| Gold | `#D6AA58` | The AI on dark, the dot, the action colour on dark |
| Night | `#0F2029` | Dark surface |

Contrast, measured: gold on white is 2.15 to 1, so it is never used for small text on light. Gold on night is 7.74 to 1. Deep steel on white is 7.27 to 1. See the [design system](design-system.md) for every pair.

## Voice

Dry wit and a stoic backbone. Say the number, what it means, and one line worth keeping. Never "don't worry".

- Sounds like fAInd: "A rejection is mail. Not a verdict." "26 applications is a small sample. Treat every comparison as a hint, not a result."
- Does not: "Don't worry, the right role is out there!" "Supercharge your career with AI."
- Plain words, short sentences, no hype. Write for someone who reads English as a second language.

## Words to use

Each is true of the product today. Note the two layers of privacy: the dashboard and your files are local, and what you give Claude is processed under your Claude account's settings. See [privacy](privacy.md).

- **Tagline:** Find a job. Keep your head.
- **One line:** fAInd is an open-source job search kit. It keeps an honest record, shows your real odds, and keeps your files on your computer.
- **Short description:** fAInd helps you run a calm, honest job search with Claude. Everything is plain text, the dashboard runs in your browser, and your files stay yours.
- **Bio (LinkedIn, X, GitHub):** Open-source job search kit for Claude. Honest numbers, plain-text context, your files on your computer. Built by a UX designer during a real search.
- **Repository description:** fAInd: a calm, honest job search kit for Claude. Plain-text context, local dashboard, nothing uploaded by the dashboard.

## Assets

In `design/brand/assets/`: three wordmarks with the mark (light, dark, deep ink), two without, the mark, a favicon that follows the system theme, a 512 px avatar, a 1200 by 630 share card and a 1584 by 396 LinkedIn banner.
