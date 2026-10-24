# Visuals

`salmannazari.com/visuals/`: Salman's product photography and videography. A standalone one-page site, not part of
the portfolio (see the root `CLAUDE.md`). Nothing in `README.md` applies here.

- **One page only.** New content becomes a section on this page, never a second page.
- **Mobile first.** Design for a phone first, then add to it for wider screens with `min-width` queries.
- **Arabic only**, right to left (`<html lang="ar" dir="rtl">`). No English, no language switch. Use logical CSS
  properties (`margin-inline-start`, not `margin-left`) so the layout follows the text direction.
- **Indexed**: it is in the sitemap and open to search engines, with a canonical URL and link-preview tags.
- **The look is not decided yet.** Salman will give the style direction. Until then the CSS is a plain, neutral
  base: don't invent a look, and never borrow the portfolio's.

## Files

| File | What it holds |
|---|---|
| `content.ts` | Every word, photo and video, and the contact details. Content changes go here. |
| `VisualsPage.astro` | The whole document: `<head>` (title, description, canonical, link previews, analytics) and the sections in order. |
| `sections/` | One component per section, each with its own scoped `<style>`: `Hero`, `Photos`, `Videos`, `Contact`. |
| `visuals.css` | Tokens (colours, font, spacing) and base rules shared by the sections. |
| `../pages/visuals/index.astro` | The route; it only renders `VisualsPage`. |

To add a section: give it its content in `content.ts`, make `sections/<Name>.astro`, and place it in
`VisualsPage.astro`. A section whose list is empty renders nothing.

## Media

Cloudinary, same account as the portfolio, under the `visuals/` folder (`visuals/photos/…`, `visuals/videos/…`).
In `content.ts` a photo is its public ID plus alt text in Arabic; a video is its public ID plus a title, and shows
its first frame as a poster unless `poster` names a photo.
