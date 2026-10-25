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

## Product and design context

Read these before any change; they are the source of truth, written in [Impeccable](https://impeccable.style)'s
format and scoped to this folder only:

| File | What it holds |
|---|---|
| `PRODUCT.md` | Who the page is for, what it must do, constraints, what evidence exists (and what must not be invented). |
| `DESIGN.md` | The visual system ("The Contact Sheet"): tokens, type scale, layout, motion grammar, do's and don'ts. |
| `.impeccable/design.json` | `DESIGN.md`'s companion: motion tokens, breakpoints, component snippets. Regenerate it with `DESIGN.md`. |
| `.impeccable/surfaces/visualspage-astro.md` | This page's brief: visitor mode, direction contract, who chose what, what is built and what is open. |

In short: light grey ground, black hairlines, greys only, IBM Plex Sans Arabic, sharp corners, scroll-in reveals and
one marquee, nothing that glows or bounces. When the code and these files disagree, fix one of them in the same
change.

Impeccable finds this context by walking up from the file it is given, so point its commands at a file in this folder
(`/impeccable critique src/visuals/VisualsPage.astro`), not at a URL or the bare route: those resolve against the
repository root, which has no product context because the portfolio is a different product.

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
