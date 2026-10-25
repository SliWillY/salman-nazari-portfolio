---
name: Salman Nazari · Visuals
description: Product photography (mostly shoes, for e-commerce) and cinematography on one Arabic page.
colors:
  ground: "#F2F2F2"
  ink: "#000000"
  muted: "#5E5E5E"
  line: "#000000"
  placeholder: "#E3E3E3"
  dark-ground: "#000000"
  dark-ink: "#F2F2F2"
  dark-muted: "#A8A8A8"
  dark-line: "#3A3A3A"
  dark-placeholder: "#1C1C1C"
typography:
  name:
    fontFamily: "IBM Plex Sans Arabic, system-ui, sans-serif"
    fontSize: "clamp(5rem, 23vw, 11rem)"
    fontWeight: 400
    lineHeight: 1.15
  display:
    fontFamily: "IBM Plex Sans Arabic, system-ui, sans-serif"
    fontSize: "56px"
    fontWeight: 300
    lineHeight: "64px"
  number:
    fontFamily: "IBM Plex Sans Arabic, system-ui, sans-serif"
    fontSize: "60px"
    fontWeight: 300
    lineHeight: "64px"
  marquee:
    fontFamily: "IBM Plex Sans Arabic, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 300
    lineHeight: "64px"
  section-title:
    fontFamily: "IBM Plex Sans Arabic, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 300
    lineHeight: "40px"
  link-large:
    fontFamily: "IBM Plex Sans Arabic, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "28px"
  title:
    fontFamily: "IBM Plex Sans Arabic, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
  body:
    fontFamily: "IBM Plex Sans Arabic, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "18px"
  label:
    fontFamily: "IBM Plex Sans Arabic, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: "16px"
rounded:
  none: "0px"
spacing:
  cell-gap: "8px"
  cell: "8px"
  cell-wide: "12px"
  gutter: "16px"
  gutter-wide: "24px"
  section-top: "24px"
  section-top-wide: "48px"
components:
  section-head:
    textColor: "{colors.ink}"
    typography: "{typography.section-title}"
    padding: "24px 16px 13px"
  photo-standin:
    backgroundColor: "{colors.placeholder}"
    rounded: "{rounded.none}"
  cta-row-link:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    height: "44px"
    padding: "0 16px"
  cta-row-link-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  contact-link:
    textColor: "{colors.ink}"
    typography: "{typography.link-large}"
    padding: "8px 0"
  bar:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    height: "44px"
    padding: "0 16px"
---

# Design System: Salman Nazari · Visuals

Scope: this file governs only `src/visuals/` (the page at `/visuals/`). The portfolio elsewhere in this repository has
a different system and must not take anything from this one.

## Overview

**Creative North Star: "The Contact Sheet"**

The page reads like a photographer's contact sheet laid on a light table: frames in ruled columns, small labels beside
them, the work in order, and nothing that competes with the photographs. Structure is drawn, not boxed: black 1px
hairlines divide the page into columns and rows, column lines run the full height of their block, and the grey
ground lets white-background packshots sit in it like prints. It draws on obys agency's grid and gallery sites and on
Frame & Form, adapted for a phone held upright.

Density is calm: small type for labels and descriptions, very large light type for the few things that should be
remembered (the name, the closing invitation, the step numbers, the marquee). There is no colour in the interface;
colour comes only from the photographs. The one black band is the cinematography section, where the same system is
redrawn in reverse.

Motion grammar: things arrive as they scroll into view and then stay still. Hairlines are drawn from the start of the
line, column lines grow down from the top, photographs are uncovered from the top down like a print coming out, text
rises a short way into place, staggered 80ms behind its neighbour, all on one long-settling ease. The marquee band is
the only thing that keeps moving. Nothing bounces, flashes or glows, and every motion is off under
`prefers-reduced-motion`.

Confirmed rejections: rounded corners, colourful palettes, glowing elements, shadows, sideways-scrolling sections,
and anything from the portfolio's look.

**Key Characteristics:**
- Light grey ground, black hairlines, greys only.
- One typeface (IBM Plex Sans Arabic) in light, regular and medium.
- Sharp corners everywhere; black squares as the only mark.
- Full-height column lines; a staggered two-column gallery on phones, four columns wide.
- Scroll-in reveals and one slow marquee; nothing loops except the marquee.

## Colors

A strictly neutral palette: the photographs supply all colour.

### Primary
- **Ink** (#000000): text, hairlines, the black square marks, the hover fill of the call-to-action row.

### Neutral
- **Light Table Grey** (#F2F2F2): page ground; also the text colour inside the dark band.
- **Quiet Grey** (#5E5E5E): labels, descriptions, counts and notes on the light ground (5.6:1 on the ground).
- **Stand-in Grey** (#E3E3E3): photo stand-ins until a photograph is uploaded.
- **Darkroom Black** (#000000): ground of the cinematography band.
- **Darkroom Line** (#3A3A3A): hairlines inside the dark band.
- **Darkroom Quiet** (#A8A8A8): labels and captions inside the dark band.
- **Darkroom Stand-in** (#1C1C1C): photo and reel stand-ins inside the dark band.

### Named Rules
**The Greys Only Rule.** The interface has no hue. No accent colour, no tinted greys, no coloured links or buttons;
colour on the page comes only from the photographs.

**The One Dark Band Rule.** Black ground appears once, for cinematography, by redefining the same tokens (`.dark`);
no other section switches to dark.

## Typography

**Display Font:** IBM Plex Sans Arabic (with system-ui, sans-serif)
**Body Font:** IBM Plex Sans Arabic (with system-ui, sans-serif)

**Character:** One sober Arabic grotesque at three weights. Size carries emphasis; weight stays light or regular, so
large type reads as calm rather than loud.

### Hierarchy
- **Name** (400, clamp(5rem, 23vw, 11rem) on phones, 18vw from 720px, clamp(9rem, 13vw, 14rem) from 1200px, line-height 1.15): the name in the opening, beside a black square 0.8em wide; two lines on phones and tablets, one line from 1200px.
- **Display** (300, 56px/64px; clamp(5rem, 9vw, 9rem)/1.1 from 720px): the closing invitation.
- **Number** (300, 60px/64px; 96px/100px from 720px): step numbers in how a shoot runs.
- **Marquee** (300, 40px/64px; 72px/112px from 720px): the moving band.
- **Section title** (300, 32px/40px; 48px/60px from 720px): every section's heading.
- **Large link** (400, 20px/28px; 32px/44px from 720px): the email and contact links.
- **Title** (500, 14px/20px; 16px/24px from 720px): the name of each work group.
- **Body** (400, 13px/18px; 15px/22px from 720px): intro lines and short sentences.
- **Label** (400, 11px/16px; 12px from 720px): bars, counts, captions, ratios. Angle labels and stand-in marks are 10px.

### Named Rules
**The Light Voice Rule.** Large type is never bold. Headlines, numbers and the name use weight 300 or 400; 500 is
reserved for small titles that need to hold their own beside a label.

## Layout

Phones first. The plain CSS is the phone layout; `min-width: 720px` adds the wide layout and `min-width: 1200px` puts
the name on one line. The page only scrolls down; nothing scrolls sideways, and the marquee is clipped to the page.
Content spans up to 1680px, centred. Side gutter is 16px on phones and 24px from 720px.

The page is a stack of full-width bands separated by hairlines. Grids have no gaps of their own: column lines are 1px
`linear-gradient` backgrounds at the column boundaries (50% for two columns; 25%, 50% and 75% for four), so they run
the full height of their block whatever the photographs' heights. Cells pad their photographs 8px on phones and 12px
wide.

- **Work gallery:** each group's photographs split into two columns on phones (first half and second half), with
  4:5 and 1:1 photographs alternated so the columns stagger yet end level; from 720px every photograph takes its own
  column of four, top-aligned, so mixed ratios stagger.
- **Every angle:** eight 1:1 squares, four by two on phones and one row of eight wide, divided by 1px gaps on an ink
  ground.
- **Before / after and LOG / graded:** two columns on phones; from 720px they take the first two of four columns and
  the other two stay empty, with their lines.
- **How a shoot runs:** rows on phones; four columns wide.
- **Opening:** a 200px (280px wide) block with four full-height column lines and the intro at its foot, then the
  name, the main photograph (4:5 on phones, cropped to 16:9 from 720px), and a two-cell call-to-action row.

## Elevation & Depth

None. The sheet is flat: no shadows, no blur, no layered surfaces. Separation comes only from hairlines, the grey
stand-ins against the ground, and the single black band.

### Named Rules
**The Flat Sheet Rule.** Nothing floats above the page. If something needs separating, draw a 1px line.

## Shapes

Corner radius is 0 everywhere, including images, stand-ins, links and the reel. Lines are 1px solid `line`. The only
marks are filled black squares: 8px beside the name in the bars, 0.8em beside the name in the opening, 0.2em
separators in the marquee, and a square-framed play mark in the reel stand-in.

## Components

### Section head
Every section opens with one: the title in light weight at the start, a small count or tag at the end, a hairline
underneath drawn as a `::after` line. As it scrolls in the line is drawn from the start and the title and count rise.

### Photo frame
- **Shape:** a fixed-ratio frame (4:5, 1:1 or 16:9) with `overflow: hidden` and no radius; the photograph fills it
  with `object-fit: cover`.
- **Stand-in:** until it has a Cloudinary ID it is a Stand-in Grey box of the same ratio, its ratio marked in 10px
  Quiet Grey at the bottom end.
- **Motion:** uncovered from the top when scrolled to; on hover (pointer devices) the photograph pushes in to
  `scale(1.04)` over 1.2s inside the frame.

### Call-to-action row
Two cells split by a hairline: a short line, then the link "اطلب تصويرًا" with an arrow pointing toward the end of the
line. At least 44px tall (56px wide). Hover fills the cell with ink and turns the text to the ground grey; the arrow
nudges 6px forward. There are no filled or rounded buttons anywhere on the page.

### Contact links
Large text links with a 1px underline drawn as a background. Hovering redraws the underline from the start of the
line. The email is set left to right.

### Group meta row
Label and value pairs in a grid: "المجموعة" in Quiet Grey, the group's name in medium, its description beneath; one
row of three columns from 720px.

### Bars
Header and footer are 44px bars of 11px text: the name with an 8px black square, what the page is, and a link or the
year. The header's link to the contact section draws its underline on hover.

### Marquee
A band of light type running toward the right (the reading direction of Arabic), two identical copies sliding one
copy's width in 45s linear and starting over, words separated by small black squares. Hover pauses it; it is
decorative and hidden from screen readers; under reduced motion it stands still.

## Do's and Don'ts

### Do:
- **Do** keep every corner at 0 and every divider a 1px line in `line`.
- **Do** draw column lines as full-height 1px backgrounds on the grid, not as borders on cells.
- **Do** keep text short and in `content.ts`; components hold no copy.
- **Do** design at phone width first and only scroll down.
- **Do** use logical properties (`inset-inline-start`, `border-inline-end`) and `dir="ltr"` on Latin details.
- **Do** add motion only through the reveal types in `visuals.css` (`rise`, `wipe`, `grow`, `pop`, `line`, `data-lines`), staggered with `--i`, on `--ease`.
- **Do** keep content visible without scripts and without motion (`html.js` and `prefers-reduced-motion` guard every hidden state).

### Don't:
- **Don't** add any hue to the interface: no accent colour, gradients of colour, or coloured text.
- **Don't** use rounded corners, shadows, glows or blur.
- **Don't** set large type in bold.
- **Don't** add sideways-scrolling rows, carousels or sliders.
- **Don't** use bouncing, elastic or looping motion other than the marquee.
- **Don't** add a second page or a navigation menu.
- **Don't** borrow anything from the portfolio: its colour worlds, candy toys, confetti, sun gradients, DM Sans or Readex Pro.
