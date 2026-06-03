# NBR — منجرة نبر · Production notes

Static site (HTML + CSS + vanilla JS, no build step). Arabic / RTL.
The repo root **is** the web root: deploy the root directory as-is to any
static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, nginx…).

Built from the Claude Design source (`HANDOFF.md` + loose page files). The
design is unchanged — `assets/styles.css` is untouched.

## Structure & URLs

Clean URLs use the **directory-per-page** convention — no server rewrites
needed; every static host serves `dir/index.html` at `/dir`:

```
index.html             ->  /            (Home)
carpentry/index.html    ->  /carpentry   (Woodwork & Carpentry)
workshops/index.html    ->  /workshops   (Kids workshops)
consulting/index.html   ->  /consulting  (Consulting)
assets/
  styles.css           # design system (unchanged — source of truth)
  app.js               # interactions, data, form handler
  image-slot.js        # <image-slot> web component
images/                # all photography + nbr-logo.png
HANDOFF.md             # original design handoff
```

All asset paths are **root-relative** (`/assets/…`, `/images/…`), so pages
work at any depth. Fonts load from Google Fonts via `<link>` (unchanged from
the source). Verified locally: all four routes and every asset return `200`.

## Before launch — action items

1. **Form endpoint (required).** `assets/app.js` posts the contact form to
   Formspree via a placeholder. Search for `FORMSPREE_ENDPOINT` and replace
   the string with your real endpoint:
   ```js
   const FORMSPREE_ENDPOINT = "https://formspree.io/f/abcdwxyz";
   ```
   Create the form at https://formspree.io with the notification email set to
   **abdullah@nbr.sa**. Fields sent: `name`, `email`, `type`, `message`.
   On success the form hides and `#formSuccess` shows (unchanged behaviour);
   on failure an inline error shows and the submit button re-enables.

2. **Missing gallery image.** `assets/app.js` references
   `images/g-console-cane.jpeg` (Carpentry `#work` gallery, "كونسول تلفاز"),
   but it was not in the export — only `g-console-stone.jpeg` was. Add the file
   to `images/`, or remove that one entry from the `GALLERY` array in
   `assets/app.js`. (Home is unaffected.)

## Deploy

1. Replace `FORMSPREE_ENDPOINT` (item 1 above).
2. Point the host's publish/output directory at the repo root.
3. Map `nbr.sa` DNS to the host.

Local preview: from the repo root run `python3 -m http.server` and open
`http://localhost:8000/`.

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
  not part of the 4-page site in HANDOFF.md, so they were left out. The
  Woodwork page looks like an alternate landing/prototype — say the word if you
  want it wired in (e.g. as a replacement for Carpentry).
- `<image-slot>` elements load the real photo from `src`; their click/drag
  "replace image" behaviour persists only in the visitor's own browser
  (localStorage) and is harmless. Swap to plain `<img>` later if you prefer.
- The original source zip remains on the `main` branch for reference.
