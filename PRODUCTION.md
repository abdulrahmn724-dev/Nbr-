# NBR — Production notes

Static site (HTML + CSS + vanilla JS, no build step). Arabic / RTL.
The repo root **is** the web root: deploy the root directory as-is to any
static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, nginx…).

## What's in here

```
index.html              # Home page — served at /
assets/
  styles.css            # design system (unchanged — source of truth)
  fonts.css             # @font-face for the self-hosted fonts
  fonts/*.woff2         # self-hosted fonts (no Google Fonts CDN dependency)
  app.js                # interactions, data, form handler
  image-slot.js         # <image-slot> web component
images/                 # photography + logo.jpg
design-export/          # original Claude Design standalone bundle (NOT deployed; reference only)
```

This source was reconstructed from the Claude Design standalone bundle
(`design-export/NBR Home (standalone).html`): CSS/JS/images/fonts were
externalised into the files above. The design is unchanged.

## Before launch — action items

1. **Form endpoint.** `assets/app.js` posts the contact form to a Formspree
   endpoint via a placeholder. Search for `FORMSPREE_ENDPOINT` and replace the
   string with your real endpoint, e.g.:
   ```js
   const FORMSPREE_ENDPOINT = "https://formspree.io/f/abcdwxyz";
   ```
   Create the form at https://formspree.io with the notification email set to
   **abdullah@nbr.sa**. Fields sent: `name`, `email`, `type`, `message`.
   On success the form is hidden and `#formSuccess` is shown (unchanged
   behaviour); on failure an inline error appears and the button re-enables.

2. **The other three pages are not in the bundle.** Only the Home page was
   exported. Carpentry / Workshops / Consulting must be exported from Claude
   Design and added (see clean URLs below). Nav/footer links to them are
   already wired and will 404 until the pages exist.

3. **Missing gallery images.** `assets/app.js` `GALLERY` (the Carpentry
   `#work` grid) references 15 images not in the bundle. They don't affect the
   Home page (that grid only renders where `#gallery` exists). Add them under
   `images/` when you ship the Carpentry page:
   `g-awards, g-cafe-bar, g-calligraphy, g-coffee, g-console-cane,
   g-console-stone, g-dessert-bar, g-door, g-facade, g-playroom, g-refectory,
   g-vanity-blue, g-vanity-green, g-vanity-yellow, g-vases` (all `.jpeg`).

## Clean URLs (`/`, `/carpentry`, `/workshops`, `/consulting`)

All asset paths are **root-relative** (`/assets/…`, `/images/…`), so pages
work at any URL depth. Use the **directory-per-page** convention — it needs no
server rewrites and works on every static host:

```
index.html              ->  /
carpentry/index.html     ->  /carpentry
workshops/index.html     ->  /workshops
consulting/index.html    ->  /consulting
```

So when you export the other pages, drop each one in as `<name>/index.html`.
(If you'd rather keep flat `carpentry.html` files, most hosts can strip the
`.html` — Netlify "Pretty URLs", Vercel `cleanUrls`, or an Apache
`.htaccess` rewrite — but the directory approach above needs no config.)

## Deploy

1. Replace `FORMSPREE_ENDPOINT` (step 1 above).
2. Point the host at the repo root as the publish/output directory.
3. `design-export/` is reference material — exclude it from the deploy if your
   host lets you, or just leave it (it isn't linked from the site).

## Notes

- `og:image` is absolute (`https://nbr.sa/…`); `og:url` + `<link rel=canonical>`
  point at the production domain.
- The EN `.lang-switch` is an intentional "coming soon" placeholder — left as-is.
- The Claude Design "Tweaks" panel + EDITMODE script were removed for production.
- `<image-slot>` elements load the real photo from their `src`; the click/drag
  "replace image" behaviour persists only in the visitor's own browser
  (localStorage) and is harmless. Swap to plain `<img>` later if you prefer.
