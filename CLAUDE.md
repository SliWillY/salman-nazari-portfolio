# Two sites in one repo

This repo builds two separate websites on salmannazari.com. They share only the repo, the domain, the build and the
deploy. Before working on anything, decide which of the two the task is about, and stay inside it.

| | Portfolio | Visuals |
|---|---|---|
| What | UX & gamification, games dev, 3D renders, about, certificates, the brief | Product photography and videography |
| URL | `/en/…`, `/ar/…` | `/visuals/` (one page) |
| Languages | English and Arabic | Arabic only |
| Code | everything in `src/` outside `src/visuals/` | `src/visuals/`, plus its route `src/pages/visuals/index.astro` |
| Built from | blocks and prefabs in YAML | plain Astro components and `src/visuals/content.ts` |
| Docs | `README.md` | `src/visuals/CLAUDE.md`, and its `PRODUCT.md`, `DESIGN.md` and `.impeccable/` |

- **No links either way.** Visuals is standalone: nothing in the portfolio links to it (menu, cards, footer, `/go/`
  share links, the brief) and it links to nothing in the portfolio.
- **No shared code** beyond the Cloudinary URL helpers in `src/lib/cloudinary.ts`. Visuals never uses `BaseLayout`,
  the portfolio's components, blocks, prefabs, `src/lib/site.ts`, `src/lib/i18n.ts` or `global.css`; the portfolio
  never imports from `src/visuals/`.
- **No shared look or words.** The portfolio's worlds, candy colours, toys, confetti and sun gradients stay out of
  visuals; product photography stays out of the portfolio.
- **No shared content.** Visuals content never goes in `src/content/` (every page file there becomes a portfolio
  page); its media is under `visuals/` in Cloudinary, the portfolio's under `portfolio/`.
- **Separate design context.** Visuals' Impeccable context (`PRODUCT.md`, `DESIGN.md`, `.impeccable/`) lives in
  `src/visuals/`, never at the repository root, so it only applies to visuals files. Context for the portfolio, if it
  ever gets some, goes at the root and describes the portfolio alone.
