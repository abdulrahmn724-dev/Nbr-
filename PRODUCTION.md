# NBR — منجرة نبر · Production notes

Static site (HTML + CSS + vanilla JS, no build step). Arabic / RTL.
Deployed on **Vercel** from GitHub. The repo root is the project root.

Built from the Claude Design source (`HANDOFF.md` + loose page files). The
design is unchanged — `assets/styles.css` is untouched.

## Structure & URLs

Clean URLs use the **directory-per-page** convention; `vercel.json` pins the
behaviour (`cleanUrls`, no trailing slash):

```
index.html             ->  /            (Home)
carpentry/index.html    ->  /carpentry   (Woodwork & Carpentry)
workshops/index.html    ->  /workshops   (Kids workshops)
consulting/index.html   ->  /consulting  (Consulting)
assets/{styles.css, app.js, image-slot.js}
images/                # all photography + nbr-logo.png
vercel.json            # { "cleanUrls": true, "trailingSlash": false }
HANDOFF.md             # original design handoff
```

All asset paths are **root-relative** (`/assets/…`, `/images/…`), so pages
work at any depth. Fonts load from Google Fonts via `<link>` (unchanged).

## Deploy (Vercel)

1. Import the GitHub repo into Vercel. No framework / no build command —
   it's a static site, so **Output Directory = repo root** (Framework Preset:
   "Other").
2. `vercel.json` already enables `cleanUrls` + `trailingSlash: false`, so
   `/carpentry`, `/workshops`, `/consulting` resolve to their `index.html`
   files. (Verified locally: all four routes return `200`.)
3. Add the domain **nbr.sa** in Vercel → Project → Domains.
4. Replace the form endpoint (below) before relying on the contact form.

Local preview: `python3 -m http.server` from the repo root → `http://localhost:8000/`.

## Before launch — action items

1. **Form endpoint (required).** `assets/app.js` posts the contact form to
   Formspree. Search for the placeholder **`FORM_SPREE_ENDPOINT_HERE`** and
   replace it with your real endpoint:
   ```js
   const FORMSPREE_ENDPOINT = "https://formspree.io/f/abcdwxyz";
   ```
   Create the form at https://formspree.io with the notification email set to
   **abdullah@nbr.sa**. Fields sent: `name`, `email`, `type`, `message`.
   On success the form hides and `#formSuccess` shows (unchanged behaviour);
   on failure an inline error shows and the submit button re-enables.

2. **Optional gallery image — `g-console-cane.jpeg`.** It was referenced by
   the Carpentry `#work` gallery ("كونسول تلفاز") but was **not in the export**
   (only `g-console-stone.jpeg` was). Rather than ship a broken tile, that one
   entry was **removed** from the `GALLERY` array in `assets/app.js`. If you
   have a photo that matches the gallery style, add it to `images/` and
   re-insert the entry:
   ```js
   { cat: "خزائن", title: "كونسول تلفاز",
     cap: "هيكل جوز دافئ مع أبواب من الخيزران الكلاسيكي",
     ar: "1200/1600", img: "/images/g-console-cane.jpeg" },
   ```
   Optional — the gallery looks complete without it (21 pieces).

## Done (per HANDOFF "wire / decide before launch")

- **Contact form** wired to Formspree (placeholder), success behaviour kept.
- **Clean URLs** `/`, `/carpentry`, `/workshops`, `/consulting` across all
  nav, footer, in-page links, and the works-rail link built in `app.js`.
- **`og:image`** absolute (`https://nbr.sa/…`) on every page; added `og:url`
  + `<link rel="canonical">` per page.
- **Contact details** verified site-wide: `wa.me/966505509199`,
  `tel:+966505509199`, `+966 50 550 9199`, `abdullah@nbr.sa`.
- **EN `.lang-switch`** left as the intentional "coming soon" placeholder.
- **Tweaks panel + EDITMODE** scripts removed from every page.

## Notes

- `NBR Woodwork.html` and the `(standalone)` bundles in the original zip are
  not part of the 4-page site in HANDOFF.md, so they were left out. Say the
  word if you want the Woodwork page wired in.
- `<image-slot>` elements load the real photo from `src`; their click/drag
  "replace image" behaviour persists only in the visitor's own browser
  (localStorage) and is harmless.
- The original source zip remains on the `main` branch for reference.
