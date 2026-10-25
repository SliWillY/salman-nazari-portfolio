# Salman Nazari: brand notes

Read this when writing for Salman's own business or for salmannazari.com/visuals. It records what is known and, just as important, what isn't. Facts from the "Not known" section must come from Salman or stay as placeholders.

## The business

- **Who:** سلمان نظري (Salman Nazari), a product photographer living in Saudi Arabia. He also does cinematography.
- **What he shoots:** product photography, mostly shoes, for e-commerce listings (not for social media). The work comes in four groups: white background (خلفية بيضاء), coloured background (خلفية ملوّنة), close details (تفاصيل قريبة), and pairs and sets (أزواج ومجموعات).
- **Listing angles:** every angle a store listing needs. The site shows eight: side, inside, front, back, top, sole, 3/4 and detail (جانب، داخل، أمام، خلف، أعلى، نعل، 3/4، تفصيل).
- **Retouching:** the same shot straight from the camera and after retouching (من الكاميرا / بعد التعديل).
- **Cinematography:** a showreel, and colour grading in DaVinci Resolve (from LOG to Rec.709).
- **Who buys:** Saudi e-commerce stores and brands. Write for their owners and marketing leads.
- **Contact:** email salmansaif@live.com. The WhatsApp and Instagram fields on the site are still empty.

## Voice

- **First person singular.** It is one person's studio, and the site already says «عملت مع». Write «أصوّر», not «نصوّر» or «فريقنا».
- **Tone:** calm, precise and confident, with no hype. That matches the site's look: light grey, black hairlines, no colour accents, nothing loud.
- **Register:** the website is clear modern standard Arabic. Social posts and WhatsApp use light Saudi white dialect.

## Not known (never invent)

- prices or how pricing works (per product, per package, per angle);
- turnaround in days;
- usual reply time;
- the city he works from, and how products reach him (shipping or drop-off);
- angles, sizes and formats included as standard;
- brands he has worked with;
- years of experience and number of clients.

Ask Salman for these. If he isn't asked or doesn't know yet, keep a bracketed placeholder that names the fact.

## The visuals page: copy slots

All of the page's words live in `src/visuals/content.ts` in the salman-nazari-portfolio repo. Its rules are in `src/visuals/CLAUDE.md`:

- Arabic only.
- Western digits throughout.
- Latin words only where needed (email, ratios, DaVinci Resolve).
- `[bracketed]` text is a copywriter slot; plain text is a working label, which may be improved.

While `indexed` is `false`, the page is hidden from search. Once it is `true`, the build fails while any `[bracket]` remains, so a slot you can't fill keeps its bracket.

| Slot in content.ts | What it is | Space |
|---|---|---|
| `description` | Search-result and link-preview description | About 120–155 characters |
| `hero.offer` | One line under the name, part of the page's h1 (currently «تصوير منتجات للمتاجر الإلكترونية») | One line, about 35 characters |
| `hero.intro` | Two short lines under the offer, separated by `\n` | About 30–40 characters per line |
| `work.groups[].description` | One line under each group name | About 30–45 characters |
| `beforeAfter.before.note` and `beforeAfter.after.note` | A note beside «من الكاميرا» and «بعد التعديل» | About 15–25 characters each |
| `ask.line` | A mid-page line beside the «اطلب تصويرًا» button | One line, about 40–60 characters |
| `brands.items[].name` | Brand names, until logos arrive | Real names only |
| `process.steps[].note` | One line under each step (الطلب، التصوير، التعديل، التسليم) | About 35–50 characters |
| `deliverables.items[].value` | The value beside each label (الزوايا، المقاسات، الخلفية والصيغة، مدة التسليم، السعر) | Short phrase |
| `film.reel.title` | The showreel's title | A few words |
| `contact.note` | The reply-time line under the contact links | One line |
| `contact.emailSubject`, `emailBody`, `whatsappText` | Pre-filled message text | Short |

The call-to-action wording on the page is «اطلب تصويرًا» in both places. Keep it the same wherever it appears.
