# NBR — منجرة نبر · Developer Handoff

Static, dependency-free site (HTML + CSS + vanilla JS). Arabic, RTL. No build step.

## Pages
| File | Purpose |
|------|---------|
| `NBR Home.html` | Landing — hero, stats, about, 3 "Learn More" cards, Selected Works rail, testimonials, brands, CTA, **contact form** |
| `NBR Carpentry.html` | Woodwork & Carpentry — services, signature piece, filterable gallery + lightbox, wood library, process |
| `NBR Workshops.html` | Kids workshops — sessions, steps, formats |
| `NBR Consulting.html` | Consulting — advisory areas, approach, wood-library teaser |

## Shared assets
- `assets/styles.css` — full design system (CSS custom properties at `:root`). Single terracotta accent; warm bone surfaces. **One source of truth — all pages link it.**
- `assets/app.js` — interactions: nav, gallery + lightbox + filters, wood library, animated counters, scroll-reveal, form validation, and the premium motion layer (scroll progress, auto-hide nav, headline word-reveal, magnetic buttons, hero parallax, Selected Works rail).
- `assets/image-slot.js` — `<image-slot>` web component (drag-drop image placeholder; `src` is the current photo).
- `images/` — all photography. Swap files in place to update imagery.

## Things to wire / decide before launch
1. **Contact form** — currently validates client-side only. Integration point is marked in `assets/app.js` (search `DEV INTEGRATION POINT`). Decide: email / CRM / WhatsApp Business API. Fields: `name`, `email`, `type`, `message`.
2. **EN language toggle** — `.lang-switch` is a placeholder (`title="coming soon"`). Either build an English mirror of each page or remove the control.
3. **Clean URLs** — filenames contain spaces (`NBR Home.html`). For production, route to `/`, `/carpentry`, `/workshops`, `/consulting` and update the `<a href>`s + footer/nav links accordingly.
4. **Open Graph `og:image`** — currently relative paths; set absolute URLs once the domain is known.
5. **Contact details** — confirm phone/WhatsApp `+966 50 550 9199`, email `abdullah@nbr.sa`, and the `wa.me/966505509199` links.

## Notes
- Fully responsive; respects `prefers-reduced-motion`.
- The "Tweaks" panel + `EDITMODE` block in each page's inline script are an authoring tool (live accent/font preview). Safe to remove for production if unwanted — delete the `.tweaks` markup and the trailing inline `<script>` on each page.
- Gallery and wood-library content are data arrays at the top of `assets/app.js`.
