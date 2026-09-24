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

## Projects

Each project is one file: `src/content/projects/<category>/<route>.yaml`, where category is `3d-renders`, `games-dev`, `ux-and-gamification` or `animations`. It gets its own page at `/<lang>/<category>/<route>/`, and a card on the category page wherever that page has a `type: projects` block.

Project fields: `title`, `summary`, `cover`, `year`, `role`, `tools`, `order` (lower first), `draft`, `header`, `sections`. Start by copying `src/content/projects/3d-renders/example-scifi-corridor.yaml`.

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

That's it: blocks are discovered automatically; there is no registry to edit. Copy an existing block (e.g. `quote/`) as a starting point. Styles go in `src/styles/global.css`.

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

Starter prefabs: `section-title`, `showcase-grid`, `showcase-slider`, `video-showcase`, `document-feature`, `project-header`, `contact-cta` (set your email in its `href` first).

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

Suggested folders: `portfolio/{3d,games,ux,animations}/<project>/`, `portfolio/covers/`, `portfolio/profile/`, `portfolio/certificates/`.

## GitHub Pages

`.github/workflows/deploy.yml` builds and deploys `main` to GitHub Pages. Enable Pages for the repository with **GitHub Actions** as the source.
