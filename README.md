# Salman Nazari portfolio

An Astro static portfolio with English and Arabic routes, Git-managed Markdown content, reusable media blocks, and responsive Cloudinary images.

## Local development

```bash
pnpm install
pnpm dev
```

Build with `pnpm build` and preview the generated site with `pnpm preview`.

## Content & Cloudinary Workflow

Content is managed via Markdown files with frontmatter in:
- `src/content/pages/en/` (English)
- `src/content/pages/ar/` (Arabic)

Upload your media assets to Cloudinary under cloud `vwkbtzdh` (or set `PUBLIC_CLOUDINARY_CLOUD_NAME`).

### 1. Recommended Cloudinary Folder Organization
In your Cloudinary Media Library, organize assets logically:
- `portfolio/covers/` (or `featured/`) — cover images for home page cards
- `portfolio/3d/` — 3D renders, wireframes, breakdown shots
- `portfolio/games/` — game development screenshots, art, prototypes
- `portfolio/ux/` — UX case studies, user flows, diagrams
- `portfolio/animations/` — animation stills, GIFs, clips
- `portfolio/profile/` — portrait / about photo
- `portfolio/certificates/` — certificates images / PDFs

### 2. Supported Frontmatter Media Fields

#### A. Hero Image (`heroImage`)
Displayed at the top of a standard page:
```yaml
heroImage: "portfolio/3d/scifi-corridor-hero"
```

#### B. Home Page Featured Cards (`featured`)
```yaml
featured:
  - title: 3D Renders
    text: Visual worlds built through composition, light, and detail.
    href: 3d-renders
    image: "portfolio/covers/3d-renders-cover"
```

#### C. Page Media Gallery (`media`)
Add any combination of images, videos, documents, or links:

```yaml
media:
  # Cloudinary Image
  - type: image
    publicId: "portfolio/3d/render-01"
    title: "Sci-Fi Corridor"
    alt: "Modular interior sci-fi corridor in Blender"
    aspect: "16 / 9" # e.g. "16 / 9", "4 / 3", "1 / 1", "21 / 9"
    caption: "Rendered in Blender Cycles with volumetric fog"

  # Video (Cloudinary, YouTube, or Vimeo)
  - type: video
    provider: cloudinary
    publicId: "portfolio/animations/turntable" # Or id: "dQw4w9WgXcQ" with provider: youtube
    title: "Turntable Loop"
    aspect: "16 / 9"
    caption: "Interactive 3D model turnaround"

  # Document (PDF hosted on Cloudinary or external URL)
  - type: document
    publicId: "portfolio/certificates/cs50-cert" # Or url: "https://..."
    title: "Harvard CS50x Certificate"

  # External Link
  - type: link
    url: "https://sliwilly.github.io/tanafusi-case-study/"
    title: "Explore the Tanafusi Interactive Prototype"
```

### 3. Bilingual Synchronization
Keep `publicId` and `aspect` identical across both language versions (`en-*.md` and `ar-*.md`), while translating `title`, `alt`, and `caption` into Arabic.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys `main` to GitHub Pages. Enable Pages for the repository with **GitHub Actions** as the source.
