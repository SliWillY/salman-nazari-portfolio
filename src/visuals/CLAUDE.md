# Visuals

`salmannazari.com/visuals/`: Salman's product photography (mostly shoes, shot for e-commerce listings, not social
media) and, in one section near the end, his cinematography. A standalone one-page site, not part of the portfolio
(see the root `CLAUDE.md`). Nothing in `README.md` applies here.

- **One page only.** New content becomes a section on this page, never a second page.
- **Mobile first.** The plain CSS is the phone layout; `min-width: 720px` adds the wide layout (four columns),
  `min-width: 1200px` sets the name on one line. The page only scrolls down: nothing scrolls sideways.
- **Arabic only**, right to left (`<html lang="ar" dir="rtl">`). No English, no language switch. Latin bits (email,
  ratios, `DaVinci Resolve`) carry `dir="ltr"`. Use logical CSS properties (`inset-inline-start`, `border-inline-end`).
- **Indexed**: in the sitemap and open to search engines, with a canonical URL and link-preview tags.
- **Words**: `[bracketed]` text is a placeholder for the copywriter (Saudi e-commerce audience); plain labels are
  working labels. Both live in `content.ts` only, never in the components.

## The look: "Columns"

Chosen from three samples; it draws on obys agency's grids and gallery sites and Frame & Form.

- Light grey ground `#F2F2F2`, black text, black 1px hairlines; the one dark band (cinematography) redraws the same
  tokens for black. Nothing but greys: no accent colour.
- IBM Plex Sans Arabic, light (300) for section titles and big numbers, regular (400) for the name, medium (500) for
  labels. Small text is 11 to 15px; the name and the closing heading are set huge.
- Sharp corners everywhere. No rounded corners, shadows, glow, or gradients other than the 1px line trick below.
- Column lines are 1px `linear-gradient` backgrounds on the grid, so they run its full height whatever the photos'
  heights. Sections open with `SectionHead` (light title, small count, hairline).
- **Motion: a bit live, never busy.** Things arrive as they scroll into view, using the `data-reveal` types and
  `data-lines` described at the end of `visuals.css` (rise, wipe, grow, pop, line), staggered with `--i`, all on one
  easing (`--ease`): hairlines draw, column lines grow down, photos are uncovered from the top, text rises. The
  opening plays in order on load. The marquee is the one thing always moving. Hovers: photos push in slightly, the
  arrow nudges, underlines redraw. Nothing bounces, flashes or glows, and everything is off for
  `prefers-reduced-motion` and when scripts don't run.

## Files

| File | What it holds |
|---|---|
| `content.ts` | Every word, photo, video and contact detail. Content changes go here. |
| `VisualsPage.astro` | The whole document: `<head>` (title, description, canonical, link previews, font, analytics) and the sections in order. |
| `sections/` | One component per section, each with its own scoped `<style>`: `Header`, `Hero`, `Marquee`, `Work`, `Angles`, `BeforeAfter`, `Brands`, `Process`, `Film`, `Contact`, `Footer`. |
| `components/Photo.astro` | One photo at a fixed ratio from Cloudinary; a grey stand-in of the same shape while its `id` is empty. |
| `components/SectionHead.astro` | A section's heading row. |
| `visuals.css` | Tokens (colours, font, gutter, easing), base rules, the `.dark` band, and the motion rules. |
| `../pages/visuals/index.astro` | The route; it only renders `VisualsPage`. |

To add a section: give it its content in `content.ts`, make `sections/<Name>.astro`, and place it in
`VisualsPage.astro`.

## Media

Cloudinary, same account as the portfolio, under the `visuals/` folder. In `content.ts` a photo is its public ID plus
Arabic alt text; gallery photos also name their ratio (`4:5` or `1:1`). The showreel is a Cloudinary video and shows
its first frame as a poster unless `poster` names a photo. Brand logos are one-colour images; until one is set, the
brand's name shows.
