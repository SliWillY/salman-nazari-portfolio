# Salman Nazari portfolio

An Astro static portfolio (English + Arabic) built from **blocks** and **prefabs**:
pages are stacks of Jimdo-style sections, sections hold blocks, and reusable
prefabs work like Unity prefabs. Media comes from Cloudinary, YouTube and Vimeo.

## Local development

```bash
pnpm install
pnpm dev
```

- Site: <http://localhost:4321/en/>
- **Block & prefab catalog: <http://localhost:4321/dev/blocks/>** (Arabic: `/dev/blocks-ar/`). Every block and prefab, live, with a copy-paste YAML snippet. Only exists in dev.

`pnpm build` builds the site; `pnpm preview` serves the build. Draft projects and the catalog are never included in the build.

## How it fits together

| Unity | This site | Where |
|---|---|---|
| Scene | Page / project | `src/content/pages/<route>.yaml`, `src/content/projects/<category>/<route>.yaml` |
| GameObjects in the scene | `sections:` — full-width bands | inside the page file |
| Components | Blocks — `type: gallery`, `type: heading` … | `src/blocks/<type>/` |
| Prefab asset | Prefab | `src/content/prefabs/<name>.yaml` |
| Prefab instance + exposed fields | `- prefab: showcase-grid` + `props:` | inside the page file |
| Instance override | `overrides:` | inside the page file |
| Prefab variant | prefab with `extends:` | `src/content/prefabs/` |

**Text is bilingual in one file.** Any text field takes either a plain string (same in both languages) or `{ en: …, ar: … }`. Media is defined once for both languages.

## Pages

```yaml
# src/content/pages/games-dev.yaml  →  /en/games-dev/ and /ar/games-dev/
title: { en: Games Dev, ar: تطوير الألعاب }
description: { en: Game art and level design., ar: فن الألعاب وتصميم المراحل. }
eyebrow: { en: Interactive work, ar: أعمال تفاعلية }
header: auto            # auto = title/description/eyebrow at the top; none = build your own

sections:
  - theme: dark         # paper | light | dark | accent
    width: wide         # narrow | contained | wide | full
    spacing: m          # none | s | m | l
    align: start        # start | center
    # background: { image: portfolio/covers/games, overlay: 0.5 }
    blocks:
      - type: heading
        text: { en: Pixel Art, ar: فن البكسل }
      - type: gallery
        layout: grid
        columns: 4
        items: [portfolio/games/pixel/01, portfolio/games/pixel/02]

  - prefab: section-title
    props:
      title: { en: Level design, ar: تصميم المراحل }
```

The menu is defined in `src/lib/site.ts`.

**Section themes:** `paper` is the page ground (warm paper), `light` is a lifted band, `dark` is a dusk band (artwork glows on it, in both site themes), `accent` is a sun-gradient field in the page's world colours with confetti.

## Look

A sunny creative studio full of toys. Page tops are soft sun gradients (a pale sky corner, a warm glowing core, a vivid edge) with fine grain, paper confetti dots and Cinema 4D-style 3D candy toys floating in them; content sits calm on warm paper. A little frosted glass: the floating header and a few pills. The dark theme is the same studio at dusk: deep indigo with warm glows, the same toys lit by a warm lamp and a violet rim. Fonts: DM Sans, Readex Pro for Arabic.

Each world has its own candy colour, carried by its category page and project pages (accent, banner gradient, chips, the superscript number):

| World | Colour | Toys |
|---|---|---|
| UX & Gamification⁰¹ | grape | a screen, a button, an XP bar, a star badge, a cursor |
| Games Dev⁰² | mint | three platforms, the googly-eyed buddy, a coin |
| 3D Renders⁰³ | sky | cube, cone, sphere, torus |

The mapping lives in `src/lib/site.ts` (`categoryHue`, `iconHue`); the colours are the `.hue-*` and `--toy-*` tokens in `src/styles/global.css`. Other pages are sun and tangerine.

**Home scene:** the home page's `cards` block uses `layout: space`: the worlds are scattered down a sun-gradient stage full of floating toys. Hovering (or keyboard-focusing) a world springs its toys onto the stage beside it, where they act out its story (the UX screen gets clicked and levels up, the Games buddy hops and pops a coin, the 3D primitives are rendered from clay to colour). On touch screens the world nearest the middle of the screen plays, taking turns while several are in view; tapping opens it. Clicking a floating toy makes it jump; the eyeball follows the pointer. With reduced motion nothing drifts and the finished pose appears without the story. World pages float their own toys in the banner.

The toys are built in code with three.js (`src/lib/toys/`: `models.ts` the toys, `stories.ts` the three stories, `engine.ts` layout, motion and rendering). three.js loads after the page has painted, only on pages with toys, and the animation pauses when off screen or in a hidden tab.

## Projects

Each project is one file: `src/content/projects/<category>/<route>.yaml`, where category is `3d-renders`, `games-dev` or `ux-and-gamification`. It gets its own page at `/<lang>/<category>/<route>/`, and a card on the category page wherever that page has a `type: projects` block.

Project fields: `title`, `summary`, `cover`, `tags`, `role`, `tools`, `projectCategory`, `order`, `draft`, `header`, `sections`. Start by copying `src/content/projects/3d-renders/example-scifi-corridor.yaml`.

### Project categories and order

On the category page, the `projects` block shows one heading per **project category**, with that category's cards under it.

- The project categories live in one list, `projectCategories` in `src/blocks/projects/schema.ts`, with their English and Arabic names. **The order of that list is the order of the headings**: move a line to move its heading. A heading only shows on a page that has projects in it.
- Each project picks one with `projectCategory: Projects` (the English name, exactly as in the list). VS Code autocompletes it, and a misspelled name stops the build with the list of valid names. To add a new category, add a line to the list first.
- `order` in the project file is its position **inside its project category** (lower first), so each category can start again from 1.
- The "previous / next" links on a project page follow the same order.
- `headings: false` on the `projects` block hides the headings and shows the cards as plain grids.

`draft: true` shows the project in `pnpm dev` (with a "draft" badge) but keeps it off the live site. Delete the line to publish.

## Blocks

| Group | Blocks |
|---|---|
| Text | `heading`, `text` (Markdown), `quote`, `button` |
| Media | `image`, `gallery` (grid / masonry / slider, with lightbox), `video` (YouTube / Vimeo / Cloudinary), `pdf`, `embed` (Sketchfab, itch.io, Figma…) |
| Layout | `columns` (blocks inside blocks), `image-text`, `spacer`, `divider` |
| Site | `hero`, `cards`, `projects`, `project-meta` |

See every field and a live preview in the catalog (`/dev/blocks/`). In VS Code, install the recommended **YAML** extension: while `pnpm dev` runs, `.vscode/schemas/` is regenerated and gives autocomplete + red squiggles for block types, fields and prefab names.

### Creating a new block type

1. Create a folder `src/blocks/<type>/` (the folder name is the `type:`).
2. Add `schema.ts` exporting `meta` (label, group, description), `schema` (zod, with `type: z.literal('<type>')`) and `example`.
3. Add one `.astro` component in the same folder; it receives `block` (validated fields), `lang` and `ctx`. Use `t(value, lang)` from `src/lib/i18n.ts` for text.

That's it: blocks are discovered automatically; there is no registry to edit. Copy an existing block (e.g. `quote/`) as a starting point. Styles go in `src/styles/global.css`, and use only the colour tokens defined at its top (`--bg`, `--surface`, `--text`, `--text-muted`, `--border`, `--accent`, …), never raw colours: that is what makes the block work in dark mode, on every section theme and in every world's colour.

## Prefabs

A prefab is a saved section (or list of blocks) with **props** — the exposed fields you fill in per instance. Editing the prefab file updates every page that uses it.

```yaml
# src/content/prefabs/showcase-grid.yaml
name: Showcase grid
description: "Heading + image grid on a themed band."
props:                    # exposed fields and their defaults
  title: { en: Untitled work, ar: عمل بدون عنوان }
  images: [""]
  theme: dark
section:                  # or `blocks:` for a prefab that sits inside a section
  theme: "{{theme}}"
  blocks:
    - type: heading
      text: "{{title}}"
    - type: gallery
      items: "{{images}}"
example:                  # optional: props used for the catalog preview
  title: { en: Pixel Art, ar: فن البكسل }
```

Placing it:

```yaml
sections:
  - prefab: showcase-grid
    props:
      title: { en: Game Art, ar: فن الألعاب }
      images: [portfolio/games/art/01, portfolio/games/art/02]
    overrides:            # change anything for this instance only (path into the prefab)
      theme: accent
      blocks.1.layout: slider
```

- `"{{prop}}"` alone is replaced by the prop's value (text, list, number…); inside longer text it's interpolated.
- **Variants:** `extends: showcase-grid` + different `props` defaults → same layout, new defaults (see `showcase-slider.yaml`).
- **Nesting:** a prefab's blocks may contain other prefab instances.
- Using a prop the prefab doesn't have is an error (catches typos).

Starter prefabs: `section-title`, `showcase-grid`, `showcase-slider`, `video-showcase`, `document-feature`, `pdf-slider` (goes inside a section's `blocks:`), `project-header`, `contact-cta` (ends About; the email and LinkedIn are set in `src/lib/site.ts`, `contact`).

## Errors

Mistakes (unknown block type, missing field, typo in a prefab prop, bad YAML) show as a red box in `pnpm dev` that names the file, section and block, and make `pnpm build` fail — broken content never reaches the live site.

YAML tip: put quotes around text containing `: ` or `#`, and around text with commas inside `{ en: …, ar: … }`.

## Media (Cloudinary)

Cloud name `vwkbtzdh` (override with `PUBLIC_CLOUDINARY_CLOUD_NAME`).

1. Sign in at <https://console.cloudinary.com> → **Assets**.
2. One folder per project, e.g. `portfolio/games/desert-temple/`.
3. Rename files meaningfully before upload (`render-01.jpg`, `gdd.pdf`); upload the best-quality export — Cloudinary resizes per device.
4. Copy the asset's **Public ID** (e.g. `portfolio/games/desert-temple/render-01`) into the YAML. A full Cloudinary URL also works.
5. **One-time for PDFs:** Settings → **Security** → enable **"Allow delivery of PDF and ZIP files"**.

Images not uploaded yet show a "Media coming soon" placeholder (naming the expected public ID in dev). Long videos: YouTube/Vimeo (`id` is the part after `watch?v=` or `vimeo.com/`); short clips can use Cloudinary.

Suggested folders: `portfolio/{3d,games,ux}/<project>/`, `portfolio/covers/`, `portfolio/profile/`, `portfolio/certificates/`.

## Analytics

Google Analytics 4 (`src/components/Analytics.astro`) loads on the deployed site only; in `pnpm dev` the custom events are logged to the browser console instead.

**Where visitors come from.** Share a different link in each place, then see them in GA under *Reports → Acquisition → Traffic acquisition* (dimension *Session source* / *Session medium*):

- Short links: add a line to `src/lib/share-links.ts`, e.g. `linkedin: { medium: 'social' }`, and share `https://sliwilly.github.io/salman-nazari-portfolio/go/linkedin/`.
- Or tag any page URL by hand: `…/en/games-dev/?utm_source=linkedin&utm_medium=social`.

**Custom events** (on top of GA's automatic page views, scrolls, outbound links and file downloads):

| Event | When | Parameters |
| --- | --- | --- |
| `select_content` | a home category card, project card, lightbox image or screen-stack screen is clicked | `content_type` (category, project, image, screen), `item_id` |
| `language_switch` | the EN / ع switch | `language` |
| `theme_change` | the theme toggle | `theme` |
| `contact` | the email copied, an email or phone link, or LinkedIn opened from the contact block | `method` (email_copy, email, phone, linkedin) |

To use the parameters in GA reports, register each one once under *Admin → Custom definitions → Create custom dimension* (scope: Event).

## GitHub Pages

`.github/workflows/deploy.yml` builds and deploys `main` to GitHub Pages. Enable Pages for the repository with **GitHub Actions** as the source.
