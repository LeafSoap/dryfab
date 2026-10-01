# Product Overview

This is the website for **Dry Fabrications**, an independent game studio. It is a
single-page, informational site rendered in an ASCII / terminal aesthetic.

## Goals
- Inform visitors about the studio, its games, team, and contact details.
- Stay simple: a static site, no backend, no build step.
- Present a distinctive plain-text / terminal look.

## Site structure (single-view navigation)
- The site is a single HTML page with four content sections: **about, games, team, contact**.
- Only one section is visible at a time. Clicking a nav link swaps the centered content.
- The page **defaults to the About section** on load.
- The URL hash reflects the active section (e.g. `#games`) so sections are deep-linkable.
- The title "Dry Fabrications" sits in the top-left; content panels are centered.

## Important content facts
- Studio name is written "Dry Fabrications" (normal capitalization).
- Contact: email hello@dryfabrications.com, itch dryfabrications.itch.io, github github.com/LeafSoap.
- Games are placeholders for now (PROJECT_01 working title, PROJECT_02 concept).

## Scope / preferences
- **No decorative ASCII art.** ASCII characters are used only for layout/formatting
  (box borders like `+---[ SECTION ]---+`, `|` edges, dividers, line breaks).
- Keep information progressive — not everything is shown at once.
