---
target: src/visuals/VisualsPage.astro
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:D:\\Projects\\Coding\\Salman Website 2\\src\\visuals\\VisualsPage.astro"
target_fingerprint: "sha256:e01ee5902b061f09497c1e2e580f6f351e7ee37534bd3040714e827012a7a72a"
target_path: "D:\\Projects\\Coding\\Salman Website 2\\src\\visuals\\VisualsPage.astro"
timestamp: 2026-10-25T12-24-08Z
slug: src-visuals-visualspage-astro
---
Method: dual-agent (A: design review · B: detector + browser)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Long, calm page; no sense of where you are, header not sticky |
| 2 | Match System / Real World | 2 | Listing vocabulary spot on; "RAW / FINAL", "LOG → Rec.709", "16:9" as a count are crew jargon |
| 3 | User Control and Freedom | 2 | No photo can be enlarged; marquee pauses only on mouse hover |
| 4 | Consistency and Standards | 3 | Tight system; numerals mix Western and Arabic-Indic, English labels, default focus ring |
| 5 | Error Prevention | 3 | Only contact path is mailto, which fails silently with no mail client |
| 6 | Recognition Rather Than Recall | 3 | Clear heads; counts beside them unlabelled |
| 7 | Flexibility and Efficiency | n/a | One-page showcase, three tab stops |
| 8 | Aesthetic and Minimalist Design | 3 | On brief; 280px empty intro block and 96px process numerals carry nothing |
| 9 | Error Recovery | 2 | No fallback if mailto fails: no WhatsApp, no copy-email |
| 10 | Help and Documentation | n/a | Portfolio |
| **Total** | | **21/32** | **Acceptable (66%)** |

## Design Specificity Verdict

LLM: "Columns" executed with discipline (gradient hairlines, SectionHead rhythm, token-redraw dark band, correct RTL), but the frame is category-generic (obys grid, huge name, marquee, giant process numerals, "لنعمل معًا" + email). Authored-for-this-job parts: Angles, Work group names, Before/After — mid-page and small. All photos are stand-ins and persuasive copy is placeholders, so only the frame can be judged.

Detector: `detect src/visuals` exit 2, 1 finding: `marquee` — false positive (matched the `<Marquee />` component tag, VisualsPage.astro:65; brief makes it the one moving thing; aria-hidden, reduced-motion off). Leftover: hover-only pause. Browser overlay at 375px: 8× `undersized-ui-text` on Angles labels, 10px (Angles.astro:39) — real, breaks the brief's 11–15px rule. No overflow at 375px, no console errors, all measured contrast ≥ 5:1, no :focus/outline rule anywhere in src/visuals.

## Priority Issues

[P1] The first screen sells the name, not a shoe. At 1133px the name wraps to two lines at 18vw (534px tall; Hero.astro:75, one-line rule waits for 1200px at :82), photo starts at 890px (259px strip visible in a 1149px viewport), CTA at 1545px; on phones CTA at 997px vs 812px viewport. Fix: .intro to ~96–120px; move `.last { flex-basis: auto }` + ~12–13vw into the 720px query; photo and ideally CTA into the first screen; on phones put .cta under the name. → /impeccable layout

[P1] Photos too small to judge and none can be enlarged. Before/After two 25vw frames with half the row empty (BeforeAfter.astro:33); LOG/graded ~260px; Angles 12.5vw / ~94px on phones; no photo is a link or button. Fix: full four columns (or drag-to-compare) for Before/After and Film pair; Work and Angles photos open a <dialog> styled in-system. → /impeccable layout (/impeccable overdrive for compare slider)

[P1] Contact path thin for a Saudi B2B buyer; page never says what they get. Only mailto renders (whatsapp/instagram empty, content.ts:137); process is four bare words; no deliverables, turnaround or what to send. Fix: fill WhatsApp at equal weight in Contact and hero CTA; process.steps → { name, line }; "ما تحتاج إرساله" in the contact kicker. → /impeccable clarify

[P2] Focus and motion control left to browser defaults. No :focus-visible rule (Chromium's orange ring is the only colour on the page); CTA inverts on hover not focus (Hero.astro:65); header underline hover-only; marquee pauses only on :hover (Marquee.astro:39), WCAG 2.2.2. Fix: `:focus-visible { outline: 1px solid var(--ink); outline-offset: 3px }`; add :focus-visible to both hover selectors; pause marquee off-screen or after a few loops. → /impeccable harden

[P2] Small Arabic text below the brief's floor; dark band loses its grid. Angles labels and stand-in marks 10px (detector confirmed); header, footer, kicker, counts, Film captions 11px; dark --line #3A3A3A on #000 ≈ 1.8:1 (visuals.css:45). Fix: 12px floor for labels, 13px for meta; dark --line ≈ #5E5E5E. → /impeccable typeset

## Persona Red Flags

Jordan (brand marketing manager): no value proposition in the first screen; jargon (RAW / FINAL, LOG → Rec.709, 16:9); Brands reads empty; no deliverables or turnaround; email only.
Sam (screen reader / keyboard): 3 tab stops with unstyled default ring; CTA hover has no focus equivalent; every alt is '' and a forgotten alt ships as decorative (Photo.astro:31); counts read without context; video aria-label is a placeholder.
Casey (one-handed phone): only always-reachable contact is a ~30px link top-left; hero CTA below the fold; no bottom contact bar; marquee can't be paused by touch; 10px angle labels; Process number and name ~300px apart.

## Minor Observations

P3 language/numerals: خام / نهائي instead of RAW / FINAL; one numeral system; "16:9" isn't a count. Footer "/visuals" is developer text. Header/footer name isn't a link to top. shareImage empty, description placeholder, borrowed favicon. Hero column lines use physical left: (Hero.astro:12). Add @media print override for reveal-hidden content. "المجموعة" repeats four times. Unverifiable without real photos: hover push-in cropping product edges; white-background shots' edge against #F2F2F2.

## Questions to Consider

- What if the first screen were one shoe, full-bleed, name at header scale, and the huge type saved for "لنعمل معًا"?
- Should Angles move up as "the eight shots your listing needs"?
- Does cinematography right before the ask dilute "I shoot your products"? Would Film work better right after Work?
