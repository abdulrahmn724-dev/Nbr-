/* ============================================================
   NBR — interactions & data
   ============================================================ */
(function () {
  "use strict";

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const toAr = (n) => String(n).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

  /* ---------- editable text overrides (managed in /admin) ---------- */
  (function () {
    var T = (window.SITE && window.SITE.text) || {};
    $$("[data-cms]").forEach(function (el) {
      var k = el.getAttribute("data-cms");
      // only override plain-text elements, so styled headings stay intact
      if (T[k] != null && T[k] !== "" && el.children.length === 0) el.textContent = T[k];
    });
  })();

  /* ---------- DATA ---------- */
  const GALLERY = (window.SITE && window.SITE.gallery) || [];

  const WOODS = (window.SITE && window.SITE.woods) || [];

  /* ---------- NAV ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const menuBtn = $("#menuBtn");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => document.body.classList.toggle("menu-open"));
    $$(".drawer a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));
  }

  /* ---------- GALLERY ---------- */
  const grid = $("#gallery");
  if (grid) {
    GALLERY.forEach((g, i) => {
      const id = g.img.split("/").pop().replace(/\.[^.]+$/, "");
      const el = document.createElement("div");
      el.className = "gitem reveal";
      el.dataset.cat = g.cat;
      el.dataset.idx = i;
      el.innerHTML =
        '<image-slot id="' + id + '" shape="rect" fit="cover" src="' + g.img +
        '" placeholder="ضع صورة العمل" style="aspect-ratio:' + g.ar.replace("/", " / ") + '"></image-slot>' +
        '<div class="ov"><div class="cat">' + g.cat + '</div><h3>' + g.title + '</h3><p class="meta">' + g.cap + '</p></div>';
      el.addEventListener("click", () => openLightbox(i));
      grid.appendChild(el);
    });
  }

  /* filters */
  $$(".filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".filter").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      $$(".gitem").forEach((it) => {
        const show = f === "all" || it.dataset.cat === f;
        it.style.display = show ? "" : "none";
      });
    });
  });

  /* ---------- LIGHTBOX ---------- */
  const lb = $("#lightbox");
  let visible = [], pos = 0;
  function openLightbox(idx) {
    visible = $$(".gitem").filter((it) => it.style.display !== "none").map((it) => +it.dataset.idx);
    pos = visible.indexOf(idx);
    renderLb();
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function renderLb() {
    const g = GALLERY[visible[pos]];
    $("#lbImg").src = g.img;
    $("#lbCat").textContent = g.cat;
    $("#lbTitle").textContent = g.title;
    $("#lbCaption").textContent = g.cap;
    $("#lbCount").textContent = toAr(pos + 1) + " / " + toAr(visible.length);
  }
  function closeLb() { lb.classList.remove("open"); document.body.style.overflow = ""; }
  function step(d) { pos = (pos + d + visible.length) % visible.length; renderLb(); }
  if (lb) {
    $("#lbClose").addEventListener("click", closeLb);
    $("#lbPrev").addEventListener("click", () => step(-1));
    $("#lbNext").addEventListener("click", () => step(1));
    lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") step(1);
      if (e.key === "ArrowRight") step(-1);
    });
  }

  /* ---------- MATERIALS ---------- */
  const matList = $("#matList"), matPrev = $("#matPreview");
  if (matList && matPrev) {
    WOODS.forEach((w, i) => {
      const row = document.createElement("div");
      row.className = "mat-row" + (i === 0 ? " active" : "");
      row.dataset.idx = i;
      row.innerHTML =
        '<span class="sw" style="background:' + w.grad + '"></span>' +
        '<span class="tx"><b>' + w.name + '</b><span>' + w.best + '</span></span>' +
        '<span class="en">' + w.latin + '</span>';
      row.addEventListener("click", () => selectWood(i));
      row.addEventListener("mouseenter", () => selectWood(i));
      matList.appendChild(row);

      const face = document.createElement("div");
      face.className = "mat-face" + (i === 0 ? " show" : "");
      face.dataset.idx = i;
      face.style.background = w.grad;
      face.innerHTML =
        '<div class="mat-cap"><span class="en">' + w.latin + '</span><b>' + w.name + '</b>' +
        '<p>' + w.note + '</p><div class="best">' + w.best + '</div></div>';
      matPrev.appendChild(face);
    });
  }
  function selectWood(i) {
    $$(".mat-row").forEach((r) => r.classList.toggle("active", +r.dataset.idx === i));
    $$(".mat-face").forEach((f) => f.classList.toggle("show", +f.dataset.idx === i));
  }

  /* ---------- COUNTERS ---------- */
  function runCount(el) {
    const to = +el.dataset.to;
    if (reduce) { el.textContent = toAr(to); return; }
    const dur = 1500, t0 = performance.now();
    function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = toAr(Math.round(to * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- REVEAL + counters via IntersectionObserver ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$(".count", e.target).forEach(runCount);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- FORM ---------- */
  const form = $("#quoteForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      const checks = [
        ["#f-name", (v) => v.trim().length > 1],
        ["#f-email", (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())],
        ["#f-type", (v) => !!v],
        ["#f-msg", (v) => v.trim().length > 4]
      ];
      checks.forEach(([sel, test]) => {
        const input = $(sel), field = input.closest(".field");
        const valid = test(input.value);
        field.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      if (ok) {
        // ───────────────────────────────────────────────────────────
        // 1) Save the submission to Supabase (so it shows in the admin).
        // 2) Open WhatsApp to NBR with the details pre-filled.
        // Both are best-effort; the success state always shows.
        // ───────────────────────────────────────────────────────────
        const data = {
          name: $("#f-name").value.trim(),
          email: $("#f-email").value.trim(),
          type: $("#f-type").value,
          message: $("#f-msg").value.trim()
        };

        // 1) store in Supabase (anon insert allowed by RLS) — fire and forget
        try {
          const sb = window.NBR_SUPABASE;
          if (sb && sb.url && sb.anonKey) {
            fetch(sb.url + "/rest/v1/contact_submissions", {
              method: "POST",
              headers: {
                "apikey": sb.anonKey,
                "Authorization": "Bearer " + sb.anonKey,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
              },
              body: JSON.stringify(data)
            }).catch(function () {});
          }
        } catch (e) {}

        // 2) open WhatsApp with the details pre-filled
        const text =
          "السلام عليكم، أرغب بالتواصل مع منجرة نبر 🌿\n\n" +
          "الاسم: " + data.name + "\n" +
          "البريد: " + data.email + "\n" +
          "نوع المشروع: " + data.type + "\n" +
          "التفاصيل: " + data.message;
        window.open("https://wa.me/966505509199?text=" + encodeURIComponent(text), "_blank");

        form.style.display = "none";
        $("#formSuccess").classList.add("show");
      }
    });
    $$("#quoteForm input, #quoteForm select, #quoteForm textarea").forEach((inp) => {
      inp.addEventListener("input", () => inp.closest(".field").classList.remove("invalid"));
    });
  }

  /* ---------- year ---------- */
  const y = $("#year"); if (y) y.textContent = toAr(new Date().getFullYear());
})();

/* ============================================================
   NBR — premium motion layer
   scroll progress · auto-hide nav · headline word reveal ·
   magnetic buttons · hero parallax · selected-works rail
   ============================================================ */
(function () {
  "use strict";
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const fine = matchMedia("(pointer:fine)").matches;

  /* ---------- scroll progress ---------- */
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);
  function progress() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, h.scrollTop / max) : 0) + ")";
  }
  progress();
  window.addEventListener("scroll", progress, { passive: true });
  window.addEventListener("resize", progress);

  /* ---------- auto-hide nav ---------- */
  const nav = $("#nav");
  if (nav) {
    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      const yy = window.scrollY;
      if (document.body.classList.contains("menu-open")) return;
      if (yy > 260 && yy > lastY + 5) nav.classList.add("nav-hidden");
      else if (yy < lastY - 5) nav.classList.remove("nav-hidden");
      lastY = yy;
    }, { passive: true });
  }

  /* ---------- word-by-word headline reveal ---------- */
  function wrapWord(t) {
    const w = document.createElement("span"); w.className = "word";
    const i = document.createElement("span"); i.className = "word-i";
    i.textContent = t; w.appendChild(i); return w;
  }
  function splitInto(node, host) {
    Array.from(node.childNodes).forEach((ch) => {
      if (ch.nodeType === 3) {
        ch.textContent.split(/(\s+)/).forEach((p) => {
          if (p === "") return;
          if (/^\s+$/.test(p)) host.appendChild(document.createTextNode(" "));
          else host.appendChild(wrapWord(p));
        });
      } else if (ch.nodeType === 1) {
        const clone = document.createElement(ch.tagName);
        if (ch.className) clone.className = ch.className;
        splitInto(ch, clone);
        host.appendChild(clone);
      }
    });
  }
  if (!reduce) {
    $$(".hero h1, .page-hero h1").forEach((h) => {
      const frag = document.createDocumentFragment();
      splitInto(h, frag);
      h.textContent = "";
      h.appendChild(frag);
      h.classList.add("split");
      $$(".word-i", h).forEach((el, i) => { el.style.transitionDelay = (0.16 + i * 0.075) + "s"; });
      requestAnimationFrame(() => requestAnimationFrame(() => h.classList.add("in")));
    });
  }

  /* ---------- magnetic primary buttons ---------- */
  if (!reduce && fine) {
    $$(".btn-accent, .btn-ink, .btn-wa").forEach((b) => {
      b.addEventListener("mousemove", (e) => {
        const r = b.getBoundingClientRect();
        const mx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const my = (e.clientY - (r.top + r.height / 2)) / r.height;
        b.style.transform = "translate(" + (mx * 8).toFixed(1) + "px," + (my * 8 - 3).toFixed(1) + "px)";
      });
      b.addEventListener("mouseleave", () => { b.style.transform = ""; });
    });
  }

  /* ---------- hero image parallax ---------- */
  const heroMedia = $(".hero-media");
  if (heroMedia && !reduce) {
    window.addEventListener("scroll", () => {
      const yy = window.scrollY;
      if (yy > 40 && yy < 1000) heroMedia.style.transform = "translateY(" + (yy * 0.06).toFixed(1) + "px)";
    }, { passive: true });
  }

  /* ---------- selected works cinematic rail (home) ---------- */
  const rail = $("#worksStrip");
  if (rail) {
    const WORKS = (window.SITE && window.SITE.works) || [];
    rail.innerHTML = WORKS.map((w) => {
      const id = "wstrip-" + w.img.split("/").pop().replace(/\.[^.]+$/, "");
      return '<a class="work-card" href="/carpentry#work">' +
        '<image-slot id="' + id + '" shape="rect" fit="cover" src="' + w.img + '" placeholder="ضع صورة العمل"></image-slot>' +
        '<div class="ov"><div class="cat">' + w.cat + '</div><h3>' + w.title + '</h3></div></a>';
    }).join("");

    /* arrows (RTL: forward = toward lower scrollLeft) */
    const amt = () => {
      const c = rail.querySelector(".work-card");
      return (c ? c.getBoundingClientRect().width : 320) + 20;
    };
    const next = $("#worksNext"), prev = $("#worksPrev");
    if (next) next.addEventListener("click", () => rail.scrollBy({ left: -amt(), behavior: "smooth" }));
    if (prev) prev.addEventListener("click", () => rail.scrollBy({ left: amt(), behavior: "smooth" }));

    /* drag to scroll */
    let down = false, startX = 0, startL = 0, moved = false;
    rail.addEventListener("mousedown", (e) => { down = true; moved = false; startX = e.pageX; startL = rail.scrollLeft; rail.classList.add("drag"); });
    window.addEventListener("mouseup", () => { down = false; rail.classList.remove("drag"); });
    rail.addEventListener("mousemove", (e) => {
      if (!down) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 4) moved = true;
      rail.scrollLeft = startL - dx;
    });
    rail.addEventListener("click", (e) => { if (moved) e.preventDefault(); }, true);
  }
})();
