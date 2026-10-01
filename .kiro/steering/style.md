# Visual Style & Design Rules

The site uses the **Dracula** color scheme (https://draculatheme.com) with a
**darkened background**. Use only colors from this palette.

## Palette (Dracula)
| Role                | Hex       | Usage                                           |
|---------------------|-----------|-------------------------------------------------|
| Background (darkened) | `#1a1b23` | Page background. Darker than standard Dracula.  |
| Dracula bg (ref)    | `#282a36` | Standard Dracula bg, kept as reference only.    |
| Current Line        | `#6272a4` |                                                 |
| Selection           | `#44475a` | Scanline overlay tint.                          |
| Foreground          | `#f8f8f2` | **ASCII lines, boxes, formatting, body text.**  |
| Comment             | `#6272a4` | Muted/footer text.                              |
| Red                 | `#ff5555` |                                                 |
| Orange              | `#ffb86c` |                                                 |
| Yellow              | `#f1fa8c` | **Links** (active/hover inverts to bg-on-yellow). |
| Green               | `#50fa7b` | **"Dry Fabrications" title.**                   |
| Cyan                | `#8be9fd` |                                                 |
| Purple              | `#bd93f9` |                                                 |
| Pink                | `#ff79c6` |                                                 |

## Explicit color assignments (as requested)
- **Background** → background color.
- **Foreground** `#f8f8f2` → ASCII lines and formatting (line breaks, boxes, etc.).
- **Green** `#50fa7b` → the "Dry Fabrications" title.
- **Yellow** `#f1fa8c` → links.

## Rules
- Do not introduce colors outside the Dracula palette. The only non-palette color
  usage allowed is transparent/alpha tints of palette colors (e.g. the scanline
  overlay uses Selection `#44475a` with alpha).
- Keep the background darker than standard Dracula `#282a36`.
- Everything is monospace. Font stack: Cascadia Code / Consolas / SFMono / Menlo / monospace.

## Layout
- Title "Dry Fabrications" — normal capitalization, large, pinned top-left.
- Content panels centered, max-width ~760px.
- ASCII boxes must not wrap (`white-space: pre`); allow horizontal scroll on small screens.
- No decorative ASCII art — layout/structure only.

## Files
- `index.html` — markup + the small tab-switching script (vanilla JS, no framework).
- `style.css` — all styling; palette defined as CSS custom properties under `:root`.
