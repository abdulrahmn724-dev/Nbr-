// ============================================================
//  GET /api/site  →  returns `window.SITE = {...}` as JavaScript,
//  built live from Supabase (published rows), edge-cached.
//
//  Loaded as a blocking <script src="/api/site"> AFTER the static
//  /content/site.js fallback, so:
//    • on success it overrides window.SITE with fresh DB content;
//    • on any error it returns a harmless comment and the static
//      fallback stays in effect (the site never breaks).
//
//  The anon key is public (RLS restricts everything); safe server-side.
// ============================================================
const SUPABASE_URL = "https://cmwyfjrjrjvdpbqgakot.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtd3lmanJqcmp2ZHBicWdha290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMzU2MDUsImV4cCI6MjA5NzcxMTYwNX0.WnRpdQhE41tUqsBHjsIkWQfwM1cGSoo8xh4rEBGbgPc";

async function fetchTable(table, select) {
  const url =
    SUPABASE_URL + "/rest/v1/" + table +
    "?select=" + select + "&published=eq.true&order=sort.asc";
  const r = await fetch(url, {
    headers: { apikey: ANON_KEY, Authorization: "Bearer " + ANON_KEY }
  });
  if (!r.ok) throw new Error(table + " " + r.status);
  return r.json();
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600");
  try {
    const h = { apikey: ANON_KEY, Authorization: "Bearer " + ANON_KEY };
    const [gallery, woods, works, textRows] = await Promise.all([
      fetchTable("gallery", "cat,title,caption,aspect,image_path"),
      fetchTable("woods", "name,latin,best,note,grad"),
      fetchTable("works", "image_path,cat,title"),
      fetch(SUPABASE_URL + "/rest/v1/content_text?select=key,value", { headers: h })
        .then(function (r) { return r.ok ? r.json() : []; })
    ]);
    const text = {}, images = {};
    (textRows || []).forEach(function (t) {
      if (t.key.indexOf("img:") === 0) images[t.key.slice(4)] = t.value;  // fixed-image overrides
      else text[t.key] = t.value;
    });
    const SITE = {
      gallery: gallery.map((g) => ({
        cat: g.cat, title: g.title, cap: g.caption, ar: g.aspect, img: g.image_path
      })),
      woods: woods.map((w) => ({
        name: w.name, latin: w.latin, best: w.best, note: w.note, grad: w.grad
      })),
      works: works.map((w) => ({ img: w.image_path, cat: w.cat, title: w.title })),
      text: text,
      images: images
    };
    res.status(200).send("window.SITE = " + JSON.stringify(SITE) + ";");
  } catch (e) {
    // leave the static /content/site.js fallback in effect
    const msg = String((e && e.message) || e).replace(/\*\//g, "");
    res.status(200).send("/* /api/site unavailable: " + msg + " — using static fallback */");
  }
};
