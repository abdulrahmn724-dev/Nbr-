# NBR — Admin / CMS plan

Goal: a custom admin so the client can manage **all** site content (images +
text) with full control, **without changing the public design**.

Decisions (agreed):
- **Backend:** Supabase — Postgres (content) + Storage (images) + Auth (admin login).
- **Editing model:** structured editing (safe forms per field/image/section;
  no raw HTML), so the layout and security stay protected.
- **Branch:** built on `claude/nbr-admin-cms`, separate from the launch PR (#1).

## Architecture

The public pages stay static HTML + `styles.css` (untouched). Content that the
client edits is **data**, read by the page — the markup/design never changes.

```
Public site  ──reads──>  window.SITE (content payload)  ──rendered by──> app.js
Admin (/admin) ──writes──> Supabase (Postgres + Storage)
                                  │
                publish ─────────►┘ regenerates the content payload the site reads
```

- **Phase 1 (done):** content payload is `content/site.js` (a blocking script
  that sets `window.SITE`), loaded before `app.js`. `app.js` reads
  `window.SITE.{gallery,woods,works}` instead of hardcoded arrays. Fully
  synchronous, so reveal/lightbox/rail timing is unchanged.
- **Phase 2+:** the *same* `window.SITE` shape is produced from Supabase
  (via a serverless `/api/content` or a publish step that rewrites
  `content/site.js`). `app.js` never changes.

## Content model

Current (client-rendered, now in `content/site.js`):
- `gallery[]` — `{ cat, title, cap, ar (aspect), img }` — Carpentry `#work`.
- `woods[]` — `{ name, latin, best, note, grad }` — wood library.
- `works[]` — `{ img, cat, title }` — Home selected-works rail.

Upcoming (Phase 1b — to inventory): editable page text (headings, paragraphs,
stats, testimonials), contact details, and section show/hide flags. These get
hooks so they hydrate from the payload without markup changes.

## Phases & status

1. ✅ **Decouple client-rendered data** into `content/site.js` (`window.SITE`).
2. ✅ **Supabase schema + Storage + RLS** — `supabase/schema.sql` (tables, RLS,
   grants, seed) + `supabase/storage-policies.sql` (uploads).
3. ✅ **Read path** — `api/site.js` serves `window.SITE` live from Supabase
   (edge-cached), loaded after the static `content/site.js` fallback so the
   site never breaks. Contact form saves to `contact_submissions` + WhatsApp.
4. ✅ **Auth** — Supabase email/password login at `/admin`.
5. ✅ **Admin UI** — `/admin`: gallery / works / woods CRUD + image upload +
   reorder + publish toggle; contact messages (read-only).
6. ⬜ **Page text / section toggles** — make headings/paragraphs editable.
7. ⬜ **Polish** — image optimization, drafts/publish workflow, export/backup.

## Setup checklist (Supabase)

Done: project created (region Mumbai), `images` bucket (public), admin user,
keys wired into `assets/supabase-config.js` + `api/site.js`, `schema.sql` run.

Remaining one-time step:
- Run **`supabase/storage-policies.sql`** in the SQL Editor so the admin can
  upload/replace/delete images in the `images` bucket.

## Using the admin

Visit **`/admin`**, log in with the Supabase user. Edit gallery/works/woods,
upload images, reorder, toggle published. Changes appear on the site within
~1 minute (read path is edge-cached for 60s).
