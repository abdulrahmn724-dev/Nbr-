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
2. ⬜ **Inventory + decouple page text / contact / sections** into the payload.
3. ⬜ **Supabase schema + Storage bucket + RLS**; build the read path (`/api/content`).
4. ⬜ **Auth** — client login for `/admin`.
5. ⬜ **Admin UI** — gallery CRUD + image upload + reorder, then text/sections.
6. ⬜ **Polish** — image optimization, drafts/publish, export/backup.

## Supabase setup (client action — do in parallel)

1. supabase.com → **New project** (free tier; region near KSA).
2. **Storage → New bucket** `images`, public.
3. **Authentication → Users → Add user** — the client's admin email + password.
4. Share the **Project URL** + **anon public key** (Settings → API).
   Keep the `service_role` secret OUT of chat — it goes only into Vercel
   server-side env vars later.

SQL schema (tables + RLS) will be added here once Phase 1b inventory is done,
so the columns match every editable field.
