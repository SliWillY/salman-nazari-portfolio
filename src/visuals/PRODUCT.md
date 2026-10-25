# Product

<!-- impeccable:product-schema 1 -->

Scope: this record covers only the visuals site at `salmannazari.com/visuals/` (this folder). The repository also builds
Salman's UX, games and 3D portfolio, a separate product with its own audience and look; nothing here applies to it
and nothing from it applies here (see the root `CLAUDE.md`).

## Platform

web

## Users

E-commerce brands and online stores in Saudi Arabia that sell shoes and other products and need photographs for
their product listings, and the people who commission those shoots for them (owners, marketing and e-commerce
managers). They look at the page to judge whether Salman's product photography is good enough for their store and to
get in touch. A smaller audience looks at the cinematography section for video work.

## Product Purpose

A one-page portfolio for Salman Nazari's product photography, mostly shoes, shot for e-commerce listings rather than
social media, with one section near the end for his cinematography. Success is a visitor who has seen the work
contacting Salman to book a shoot.

## Positioning

A photographer who specialises in shoes for online stores: the shots a listing needs (packshots on white and
coloured backgrounds, close details, pairs and sets, every angle of one product), retouching shown before and after,
and cinematography graded from LOG in DaVinci Resolve. The positioning wording is not final; the copywriter sets it.

## Operating Context

- Visitors arrive from a shared link (WhatsApp, Instagram, a direct message) and mostly on a phone, so the page is
  designed for phones first and scrolls down only.
- Arabic only, right to left; the copy is written for the Saudi e-commerce market by a separate copywriting agent.
  Until then every sentence is a `[bracketed]` placeholder in `content.ts`.
- It is a standalone page on the same domain as the portfolio. Nothing links between the two.
- Indexed by search engines; it has a canonical URL and link-preview tags.

## Capabilities and Constraints

- One page only. New content becomes a section on this page, never a second page.
- Sections, in order: opening (name, short intro, main photo, request a shoot), the work in four style groups (white
  background, coloured background, close details, pairs and sets), every angle of one product, before and after
  retouching, brands worked with, how a shoot runs, cinematography, contact.
- Contact is email now; WhatsApp and Instagram appear once their details are filled in.
- Media is served from Cloudinary under `visuals/`. Built with Astro inside the portfolio's repository and deployed
  with it to GitHub Pages; the code lives in `src/visuals/` and the route in `src/pages/visuals/index.astro`.
- Undecided: WhatsApp number, Instagram handle, city; which brands may be named and their logos; the description of
  each work group; how long each step of a shoot takes; the share image; a favicon of its own; whether visits are
  counted in their own analytics property.

## Brand Commitments

- Name: سلمان نظري (Salman Nazari).
- Professional and sparing with words: the photographs carry the page, text stays short.
- None of the portfolio's identity (its colour worlds, toys, confetti, fonts) is used here.

## Evidence on Hand

- No photographs, video or logos are uploaded yet; every image slot shows a grey stand-in of its final shape.
- Three brands have been worked with so far; their names and logos have not been provided.
- There are no testimonials, client quotes, prices, statistics or awards. Do not invent any.

## Product Principles

1. The work is the pitch: photographs lead, words stay few and short.
2. Shot for the listing, not the feed: show what a store needs (angles, clean backgrounds, details, retouching).
3. Phones first: everything must work on a phone, scrolling down only, before it is widened.
4. One action: every path ends in getting in touch.
5. Standalone: this site and the portfolio never borrow from each other.

## Accessibility & Inclusion

Arabic, right to left, with Latin details (email, ratios, `DaVinci Resolve`) set left to right inside it. Motion is
switched off for visitors who ask for reduced motion, and content never depends on scripts to be visible.
