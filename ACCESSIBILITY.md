# Accessibility statement

## Commitment

fAInd should be usable by people who work with a keyboard, a screen reader, zoom, high contrast or reduced motion. People who search for work are often tired or stressed, so clear and calm is part of accessible. The target is WCAG 2.1 level AA for the dashboard and the site pages (setup, story, design system and brand).

## What is checked

- axe-core finds no violations on the dashboard and the site pages, in light and dark, in English and Spanish.
- Keyboard: every control can be reached and used, with a visible focus ring and a skip link.
- Contrast: text pairs are at least 4.5 to 1 and control borders at least 3 to 1, calculated for both themes (lowest text pair 5.06 to 1, lowest border 3.44 to 1).
- Reflow at 320 px wide, text spacing, reduced motion and forced colors are checked.

The full method, results and fixes are in [docs/accessibility.md](docs/accessibility.md). The design rules behind the colour choices are in [docs/design-system.md](docs/design-system.md).

## Supported environments

Tested with current Chrome on desktop and a phone-sized viewport, with the accessibility tree read as a stand-in for a screen reader. Connecting a folder uses the File System Access API, which not every browser has. Without it you can still use the sample data and the Load buttons.

## Known limitations

- Nobody has listened to the pages with VoiceOver, NVDA or JAWS, and it has not been tested with voice control or switch access. The semantics are in place, but that needs a person who uses these tools.
- Automated checks do not catch everything. Manual checks found problems axe did not, so there may be more.
- Windows high contrast was emulated in Chrome, not run on Windows. Zoom beyond 400 percent is untested.
- The Claude skills run in Claude, so their accessibility depends on the Claude app you use.

## How to report a barrier

Open an issue with the "Accessibility barrier" template, or email ux@joselblas.com. Please include the page, what you were trying to do, what got in the way and the browser and assistive technology you use. Barriers that stop someone completing a task are fixed first.
