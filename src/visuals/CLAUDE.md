# Visuals

`salmannazari.com/visuals/`: Salman's product photography (mostly shoes, shot for e-commerce listings, not social
media) and, in one section near the end, his cinematography. A standalone one-page site, not part of the portfolio
(see the root `CLAUDE.md`). Nothing in `README.md` applies here.

- **One page only.** New content becomes a section on this page, never a second page.
- **Mobile first.** The plain CSS is the phone layout; `min-width: 720px` adds the wide layout (four columns, and
  the opening split into the photo's half and the name's half). The page only scrolls down: nothing scrolls sideways.
- **The work leads.** The opening's first thing is a photo; the name and the offer (together the `h1`) come beside it
  on wide screens and under it on phones, with the call to action inside the first screen at common sizes.
- **Arabic only**, right to left (`<html lang="ar" dir="rtl">`). No English, no language switch. Latin bits (email,
  ratios, `DaVinci Resolve`) carry `dir="ltr"`. Numbers use Western digits (1, 2, 3) throughout, as the big numbers do. Use logical CSS properties (`inset-inline-start`, `border-inline-end`).
- **Indexed once finished.** `indexed` in `content.ts` is false while the page is unfinished: the page then carries
  `noindex` and stays out of the sitemap. Set to true, it joins the sitemap, and the build fails while any `[bracketed]`
  placeholder is left. Always a canonical URL and link-preview tags (the preview picture falls back to the opening's
  photo). A photo with a public ID but no alt text also fails the build.
- **Words**: `[bracketed]` text is a placeholder for the copywriter (Saudi e-commerce audience); plain labels are
  working labels. Both live in `content.ts` only, never in the components.

## The look: "Columns"

Chosen from three samples; it draws on obys agency's grids and gallery sites and Frame & Form.

- Light grey ground `#F2F2F2`, black text, black 1px hairlines; the one dark band (cinematography) redraws the same
  tokens for black. Nothing but greys: no accent colour.
- IBM Plex Sans Arabic, light (300) for section titles, the offer and big numbers, regular (400) for the name, medium
  (500) for labels and the call to action. Small text is 12 to 15px (Arabic loses its dots below 12px); the name and the closing heading are set huge.
- Sharp corners everywhere. No rounded corners, shadows, glow, or gradients other than the 1px line trick below.
- Column lines are 1px `linear-gradient` backgrounds on the grid, so they run its full height whatever the photos'
  heights. Sections open with `SectionHead` (light title, small count, hairline).
- **Motion: a bit live, never busy.** Things arrive as they scroll into view, using the `data-reveal` types and
  `data-lines` described at the end of `visuals.css` (rise, wipe, grow, pop, line), staggered with `--i`, all on one
  easing (`--ease`): hairlines draw, column lines grow down, photos are uncovered from the top, text rises. The
  opening plays in order on load, and a link reached by keyboard shows at once. The marquee is the one thing always
  moving; hovering or keyboard focus stops it, and a tap stops and restarts it. Hovers (and keyboard focus): photos
  push in slightly, the arrow nudges, underlines redraw. Focus is one square 2px ring in the ink colour, drawn inside
  the black call-to-action cells. Nothing bounces, flashes or glows, and everything is off for
  `prefers-reduced-motion` and when scripts don't run.

## Files

| File | What it holds |
|---|---|
| `content.ts` | Every word, photo, video and contact detail. Content changes go here. |
| `VisualsPage.astro` | The whole document: `<head>` (title, description, canonical, link previews, font, analytics) and the sections in order. |
| `sections/` | One component per section, each with its own scoped `<style>`, in page order: `Header`, `Hero`, `Marquee`, `Work`, `Angles`, `Ask` (a mid-page call to action), `BeforeAfter`, `Brands`, `Film`, `Process`, `Deliverables` (what a brand receives), `Contact`, `Footer`. The process and deliverables sit right before the contact, so the questions that decide a brand are answered before the ask. |
| `whatsapp.ts` | The WhatsApp chat link (greeting already typed) and the number as shown. WhatsApp is the main way in: both calls to action open it, and the contact section leads with it. |
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
