# Design system

The tokens and components behind the dashboard. The live version is [design/system/](https://joselblas.github.io/jobops-kit/design/system/). It uses the real stylesheet (`app/style.css`), so the page and the product cannot drift apart.

## Principles

1. **Calm over urgent.** A job search is stressful already. No red alarms, no streaks, no countdowns. Caution is amber and always says why.
2. **Honest numbers.** A small sample is labelled small. A number never appears without its label.
3. **Text carries meaning.** Colour, shape and position only add emphasis. Every state has words, so it survives forced colors and colour blindness.
4. **Works with a keyboard.** Every control is a real button, link or field, with a visible focus ring and a 40 px target.

## Tokens

All tokens are CSS custom properties in `:root`, with a dark set under `[data-theme="dark"]`.

| Group | Tokens |
|-------|--------|
| Surfaces | `--surface`, `--surface-raised`, `--surface-sunken` |
| Text | `--ink`, `--ink-muted`, `--ink-faint` |
| Action and state | `--accent`, `--accent-soft`, `--calm`, `--calm-soft`, `--closed`, `--closed-soft`, `--caution`, `--caution-soft` |
| Lines | `--line`, `--line-strong` |
| Space | `--s-1` to `--s-8` (4, 8, 12, 16, 24, 32, 48, 64 px) |
| Type | `--t-xs` 12, `--t-sm` 13, `--t-base` 15, `--t-md` 18, `--t-lg` 28, plus the fluid h1 and KPI sizes |
| Shape | `--r-sm` 12, `--r-md` 22, `--r-lg` 28, `--r-pill` |
| Elevation | `--shadow` (cards), `--shadow-pop` (menus) |
| Motion | `--dur-1` 120 ms, `--dur-2` 250 ms, `--ease` |
| Targets | `--target` 40 px |

The scale tokens (space, type, motion) are new. Existing rules adopt them gradually, so some older values are still literal numbers.

### Contrast

Text pairs need 4.5 to 1 and control borders 3 to 1. The design page computes every pair live in both themes. At the time of writing all pairs pass; the lowest text pair is 4.96 to 1 (accent on its soft fill, light theme) and the lowest border is 3.58 to 1.

## Components

| Component | Class | Use it for |
|-----------|-------|-----------|
| Button | `.btn`, `.ghost`, `.sm`, `.caution` | One filled button per view, the rest ghost. Caution only for actions that lose data. |
| Tag | `.tag`, `.accent`, `.closed`, `.calm`, `.caution` | A status with text. |
| Chip and segmented control | `.chip`, `.seg` | Filter a list, or switch mode. Use `aria-pressed`. |
| Field | `.field`, `.input`, `.hint`, `.err` | Label above, hint and error below. Link them with `aria-describedby`. |
| Callout | `.callout`, `.info`, `.calm`, `.caution` | A short note inside a page. |
| Card and KPI | `.card`, `.kpi` | Group one idea. A number always has a label. |
| Checklist row | `.chk` | A step with a state and one action. |
| More menu | `details.more` | One primary action, the rest tucked away. |
| Empty state | `.proof-empty`, `.empty` | Say what is missing and what to do next. |

Each component has its markup, when to use it and its accessibility notes on the design page.

## Rules for new components

- Start from a native element. Add ARIA only for state (`aria-pressed`, `aria-invalid`, `aria-describedby`).
- Give every state words, not only colour.
- Check both themes and forced colors. Run `python3 scripts/a11y_audit.py` before committing.
- Add the component to the design page with its markup and accessibility note.
