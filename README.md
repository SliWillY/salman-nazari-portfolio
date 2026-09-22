# Salman Nazari portfolio

An Astro static portfolio with English and Arabic routes, Git-managed Markdown content, reusable media blocks, and responsive Cloudinary images.

## Local development

```bash
pnpm install
pnpm dev
```

Build with `pnpm build` and preview the generated site with `pnpm preview`.

## Content workflow

Pages live in `src/content/pages/en` and `src/content/pages/ar`. Add a Markdown page with the same `slug` to both folders to create a translated pair. Media blocks accept YouTube, Vimeo, Cloudinary image, document, and external-link entries in frontmatter.

Replace placeholder video IDs and document URLs before publishing. Upload originals to Cloudinary cloud `vwkbtzdh`, then use their public IDs in image blocks.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys `main` to GitHub Pages. Enable Pages for the repository with **GitHub Actions** as the source. The configured site URL is the temporary `https://salman-nazari.github.io` placeholder and should be updated to the repository's actual Pages URL before launch.
