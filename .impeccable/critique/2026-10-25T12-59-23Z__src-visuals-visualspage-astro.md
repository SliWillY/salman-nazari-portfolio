---
target: src/visuals/VisualsPage.astro
total_score: 22
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 3
target_identity: "file:/home/user/salman-nazari-portfolio/src/visuals/VisualsPage.astro"
target_fingerprint: "sha256:ecc6242a830b69c020776d35710b74e5891f2dc0814e9c975dc74556e769b108"
target_path: /home/user/salman-nazari-portfolio/src/visuals/VisualsPage.astro
timestamp: 2026-10-25T12-59-23Z
slug: src-visuals-visualspage-astro
closed: true
---
Method: dual-agent (A: isolated design-review agent · B: isolated detector agent)

Context: every photo, video and logo id in content.ts is empty (29 grey stand-ins, 0 img/video) and 15 copy lines are [bracketed] placeholders. The critique judges the frame and its readiness to persuade once photos arrive.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Hero CTA reveal stagger (--i: 10, Hero.astro:20) also applies on scroll/focus; focused CTA invisible ~1s |
| 2 | Match System / Real World | 3 | Fluent Arabic/RTL; jargon leaks: "RAW / FINAL", "DaVinci Resolve — LOG → Rec.709", "16:9" as a count |
| 3 | User Control and Freedom | 3 | Marquee pauses only on mouse hover |
| 4 | Consistency and Standards | 3 | Count slot holds counts/English tag/ratio; Latin 01–04 beside Arabic-Indic ٣/٤; designed hover but no designed focus; off-grid hero lines; 10px labels below the page's own 11px floor |
| 5 | Error Prevention | 3 | mailto without subject or prompt |
| 6 | Recognition Rather Than Recall | 2 | Header "تواصل" link indistinguishable from plain text; header not sticky; ~5.5 desktop screens with no contact affordance |
| 7 | Flexibility and Efficiency | n/a | Single-path showcase |
| 8 | Aesthetic and Minimalist Design | 3 | ~31% of desktop first viewport is an empty decorative band; marquee repeats on-page words |
| 9 | Error Recovery | 2 | mailto-only contact dead-ends on phones without a mail app; no WhatsApp, no copy button |
| 10 | Help and Documentation | n/a | Showcase; buyer info gap treated as a Persuade issue |
| **Total** | | **22/32 (69%)** | **Acceptable** |

## Design Specificity Verdict

LLM: coherent, disciplined system (greys only, full-height hairline columns, one easing, black square mark, token-swapped dark band), but the skeleton is the stock studio landing page (giant name, services marquee, numbered heads, 01–04 process, worked-with strip, giant "let's work together" + email), an acknowledged obys / Frame & Form homage. Product-authored moments: the eight-angle contact sheet, RAW/FINAL and LOG/graded pairs, 4:5 and 1:1 listing ratios, the #F2F2F2 sweep-like ground. Missed: the photography as interface (turntable through the angles, retouch slider, loupe/lightbox).

Deterministic scan: CLI 1 finding (marquee) — element match false (Astro <Marquee /> tag at VisualsPage.astro:65), pattern real (infinite 45s loop, Marquee.astro:38), intentional per src/visuals/CLAUDE.md. Browser: undersized-ui-text x8 (Angles labels 10px on phones, Angles.astro:39; LLM agreed), text-occlusion x8 (stand-in ratio mark at Photo.astro:37 carries dir="ltr", so inset-inline-end lands on the right under the opaque angle label; LLM missed). Marquee flag under reduced motion is a false positive. No contrast findings, no horizontal overflow 320–1440px.

Overlays: injection succeeded headless only; no user-visible [Human] tab in this cloud session.

## Overall Impression

A real grammar and better-than-most RTL and motion craft, but it currently sells the name, not the service: a 280px empty band and a 187px name open the page, and the first CTA is ~1,440px down on desktop. Biggest opportunity: lead with a product on the sweep plus a one-line offer, and make contact work for a Saudi e-commerce buyer on a phone.

## What's Working

1. The "كل الزوايا" contact sheet (Angles.astro): eight listing angles in plain Arabic, uncovered one by one.
2. A neutral system that won't fight the products: greys only, full-height hairlines, one easing, token-redrawn dark band.
3. RTL and motion done properly: logical properties, LTR islands, forward-pointing arrows, rightward marquee, ي descender room; reduced-motion and no-JS fallbacks verified.

## Priority Issues

- [P0] Live and indexed while empty: salmannazari.com/visuals/ is deployed and in the sitemap (astro.config.mjs:10), live meta description is the bracketed placeholder (content.ts:18), no shareImage, all alt ''. Fix: sitemap filter + noindex until content lands; fail the build when an id has no alt. Command: /impeccable harden
- [P1] First screen leads with the name, not the work/offer/CTA: 280px intro band (Hero.astro:72), 275px name, photo from y≈632, CTA at y≈1443 desktop / y≈1001 phone; h1 doesn't name the service. Fix: collapse band, promote offer to 32–48px, photo within ~400px, filled CTA in first viewport. Command: /impeccable layout
- [P1] Contact path is one mailto at the end: no WhatsApp/Instagram, header link reads as text, header not sticky, nothing between hero and close. Fix: fill whatsapp with ?text=, mailto ?subject= + body prompt, copy button, response-time line, mid-page CTA, header link affordance. Command: /impeccable clarify
- [P1] No reassurance before the ask: four one-word process steps; no deliverables, turnaround, pricing basis, logistics; Film sits between Process and Contact. Fix: one line per step, a "what you get" row, move Film above Process (facts from the owner). Command: /impeccable clarify
- [P2] Small Arabic text and unfinished keyboard/motion states: 10px angle labels, 11px captions, no designed :focus-visible on the CTA, ~1s invisible focused CTA, no touch/keyboard marquee pause (WCAG 2.2.2). Fix: ≥11–12px, mirror hover on :focus-visible, cap --i below the fold + show [data-reveal]:focus-within, pause on tap/focus. Command: /impeccable adapt

## Persona Red Flags

- Jordan: placeholder search snippet; service only in an 11–12px tagline; unexplained RAW/FINAL, LOG → Rec.709, 16:9; no time/price; no "what happens next".
- Casey: 11px plain-looking "تواصل" (27×43px) as first contact; CTA below fold; ~3,800px gap to next contact; mailto only; 10px labels; marquee never stops on touch.
- Sam: default focus ring only; focused CTA invisible ~1s; h1 lacks the service; no keyboard marquee pause; future photos would announce as nothing. Positives: 3 tab stops, contrast passes, no overflow at 200% zoom.

## Minor Observations

- Hero column lines at 8/22/23.4/50% via physical left: (Hero.astro:12), off the 25/50/75% grid.
- dir="ltr" on Photo.astro:37 puts every stand-in ratio mark in the wrong corner.
- Hover push-in (Photo.astro:47-50) implies clickability; no lightbox.
- Before/after and LOG/graded fill half the row on desktop; before/after is static.
- Work repeats four identical blocks with "المجموعة" each time.
- Count slot as ornament; mixed numeral systems.
- Footer "/visuals" and the portfolio favicon point back at a parent site.
- White-sweep photos on #F2F2F2 differ by 1.12:1.
- Personal live.com contact address.
- <video> has no fallback text or captions track.

## Questions to Consider

- Why is the name the biggest thing on a page selling to brands who don't know it yet?
- If the eight angles are the product, why 180px thumbnails instead of one shoe the visitor can turn?
- Can a static quarter-width side-by-side prove retouching, and why is half that row empty?
- Who are "RAW / FINAL" and "LOG → Rec.709" written for?
- Does cinematography deserve its own path from the top rather than a band before the close?
