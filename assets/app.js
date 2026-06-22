/* ============================================================
   NBR — interactions & data
   ============================================================ */
(function () {
  "use strict";

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const toAr = (n) => String(n).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

  /* ---------- DATA ---------- */
  const GALLERY = [
    { cat: "أثاث",   title: "طاولة طعام زجاجية",   cap: "رحبة لثمانية أشخاص على قاعدة من الجوز",        ar: "1/1",        img: "/images/g-dining.jpeg" },
    { cat: "مغاسل",  title: "مغسلة بحافة طبيعية",   cap: "لوح خشبي واحد يحتضن حوضين حجريين",              ar: "1200/1600", img: "/images/g-bath-burl.jpeg" },
    { cat: "معماري", title: "جدار شرائح مُضاء",     cap: "شرائح جوز تبرز جمالها إضاءة خلفية مخفية",       ar: "1200/1600", img: "/images/g-slatwall.jpeg" },
    { cat: "أثاث",   title: "كونسول حجر وبرونز",    cap: "سطح ترافرتين فاخر على قاعدة فولاذية متينة",     ar: "1200/1600", img: "/images/g-console-stone.jpeg" },
    { cat: "زخرفي",  title: "لوحة مناظر متدرّجة",   cap: "فن التطعيم بمزيج من خشب الجوز والبلوط",         ar: "1200/1600", img: "/images/g-relief.jpeg" },
    { cat: "مغاسل",  title: "مغسلة رخامية",         cap: "أرجل خشبية مخروطة ضمن إطار من البلوط",          ar: "960/1280",  img: "/images/g-vanity-green.jpeg" },
    { cat: "تجاري",  title: "تجهيز «مقهى رتوة»",    cap: "مقاعد، فواصل خشبية، ونجارة متكاملة",            ar: "1600/1066", img: "/images/g-cafe-ratwah.jpeg" },
    { cat: "معماري", title: "درجات سلّمٍ معلّقة",   cap: "خشب صلب متين يكسو هيكلاً فولاذياً مخفياً",       ar: "900/1600",  img: "/images/g-stair.jpeg" },
    { cat: "زخرفي",  title: "مزهريات نحتية",        cap: "طقم من أربع قطع، نُحتت من أخشاب متنوعة",        ar: "904/1600",  img: "/images/g-vases.jpeg" },
    { cat: "أثاث",   title: "طاولة قهوة مقوّسة",    cap: "أرجل بلوط تحمل سطحاً زجاجياً بشفافية تامة",     ar: "900/1600",  img: "/images/g-coffee.jpeg" },
    { cat: "مغاسل",  title: "مغسلة كونسول",         cap: "رف مفتوح عملي وسطح رخامي أنيق",                 ar: "960/1280",  img: "/images/g-vanity-yellow.jpeg" },
    { cat: "خزائن",  title: "وحدة تلفاز جدارية",    cap: "مزيج البلوط والخيزران محاط بإطار داكن",         ar: "1200/1600", img: "/images/g-media-wall.jpeg" },
    { cat: "تجاري",  title: "كاونتر خدمة مقهى",     cap: "واجهة خشبية مبطّنة ومُضاءة بعناية",             ar: "1600/1066", img: "/images/g-cafe-bar.jpeg" },
    { cat: "معماري", title: "باب خشبي شرائحي",      cap: "صنوبر معالج حرارياً بتصميم عمودي أنيق",         ar: "900/1600",  img: "/images/g-door.jpeg" },
    { cat: "زخرفي",  title: "مخطوطة عربية محفورة",  cap: "حروف من البلوط، شُكلت يدوياً بدقة",             ar: "1200/1600", img: "/images/g-calligraphy.jpeg" },
    { cat: "أثاث",   title: "طاولة ومقاعد (بنش)",   cap: "من خشب البلوط الداكن والصلب",                   ar: "1/1",       img: "/images/g-refectory.jpeg" },
    { cat: "مغاسل",  title: "مغسلتا بلوط متجاورتان", cap: "تصميم ركني ذكي مع تجهيزات نحاسية عتيقة",       ar: "1600/1336", img: "/images/g-vanity-blue.jpeg" },
    { cat: "خزائن",  title: "وحدة غرفة ألعاب",      cap: "قطعة مدمجة وعملية تضفي مرحاً على مساحة الأطفال", ar: "1200/1600", img: "/images/g-playroom.jpeg" },
    { cat: "تجاري",  title: "محل حلويات",           cap: "جدار دافئ من الشرائح الخشبية",                  ar: "1200/1600", img: "/images/g-dessert-bar.jpeg" },
    { cat: "معماري", title: "فاصل بارتفاع طابقين",  cap: "واجهة مهيبة من شرائح خشب الأرز",                ar: "720/1280",  img: "/images/g-facade.jpeg" },
    { cat: "زخرفي",  title: "جوائز تذكارية",        cap: "كؤوس خشبية صُممت وحُفرت خصيصاً للمناسبة",       ar: "1200/1600", img: "/images/g-awards.jpeg" }
  ];

  const WOODS = [
    { name: "الجوز",     latin: "Walnut",   best: "الأثاث الفاخر · النجارة المميزة",
      note: "بلونه البني الداكن المائل للشوكولاتة وتوشيحاته الرمادية والبنفسجية — خشب غني، أنيق، وجريء لقطع تخطف الأنظار.",
      grad: "linear-gradient(155deg,#7A5331 0%,#5A3A20 50%,#3C2614 100%)" },
    { name: "البلوط",    latin: "Oak",      best: "الطاولات · الأرضيات · الأبواب",
      note: "قوي بعروقه الواضحة ولونه الذهبي الفاتح الذي يعتّق بمرور الزمن ليصبح بلون العسل الدافئ. خيارك الأمثل للقوة والأصالة.",
      grad: "linear-gradient(155deg,#DBB67E 0%,#C49A5C 45%,#A87C40 100%)" },
    { name: "التيك (الساج)", latin: "Teak", best: "الأثاث الخارجي · الحمامات",
      note: "غني بالزيوت الطبيعية بلون ذهبي مائل للبني، يتحدى الرطوبة وعوامل الطقس — رفيقك الدائم للمساحات الداخلية والخارجية.",
      grad: "linear-gradient(155deg,#B58451 0%,#9A6B3C 50%,#7B5028 100%)" },
    { name: "الماهوجني", latin: "Mahogany", best: "الطاولات · القطع المميزة",
      note: "أحمر بنّي فاخر بلمعان دافئ وعروق ناعمة منتظمة — خيار راقٍ يمنح القطعة حضوراً كلاسيكياً ثرياً.",
      grad: "linear-gradient(155deg,#9C4A2E 0%,#7E3520 50%,#5A2415 100%)" },
    { name: "الدردار",   latin: "Ash",      best: "الأشكال المنحنية · الكراسي",
      note: "خشب فاتح بمرونة استثنائية وعروق ساحرة؛ ينحني ولا ينكسر. مريح للعين وأصلب مما تتخيل.",
      grad: "linear-gradient(155deg,#E2D2B2 0%,#CDBA92 50%,#B19E76 100%)" },
    { name: "القيقب",    latin: "Maple",    best: "الخزائن · الديكور العصري",
      note: "فاتح وناعم بعروق دقيقة يمنح مظهراً عصرياً نظيفاً — مثالي للمساحات الحديثة والتفاصيل الراقية.",
      grad: "linear-gradient(155deg,#EAD9B8 0%,#DBC59B 50%,#C7AC78 100%)" },
    { name: "الزان",     latin: "Beech",    best: "القطع المخروطة · أدوات المطبخ",
      note: "ناعم، متجانس، ولونه كريمي هادئ. صديق الحرفيين؛ متين، ودود لليد، ومريح في الاستخدام اليومي.",
      grad: "linear-gradient(155deg,#ECD6AC 0%,#D8BC8B 50%,#BE9F69 100%)" },
    { name: "الأرز",     latin: "Cedar",    best: "الخزائن · التكسيات · الأعمال الخارجية",
      note: "عطري ومقاوم للحشرات بطبيعته، بلون دافئ محمرّ — مثالي للتكسيات والخزائن وكل ما يدوم.",
      grad: "linear-gradient(155deg,#C98A5A 0%,#A96B3E 50%,#834B27 100%)" }
  ];

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
        // Open WhatsApp to NBR with the form contents pre-filled, then show
        // the success state. (Phase 2: also POST the same fields to Supabase
        // so every submission is stored and visible in the admin panel.)
        // ───────────────────────────────────────────────────────────
        const WHATSAPP_NUMBER = "966505509199";
        const data = {
          name: $("#f-name").value.trim(),
          email: $("#f-email").value.trim(),
          type: $("#f-type").value,
          message: $("#f-msg").value.trim()
        };
        const text =
          "السلام عليكم، أرغب بالتواصل مع منجرة نبر 🌿\n\n" +
          "الاسم: " + data.name + "\n" +
          "البريد: " + data.email + "\n" +
          "نوع المشروع: " + data.type + "\n" +
          "التفاصيل: " + data.message;
        window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text), "_blank");

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
    const WORKS = [
      { img: "/images/g-bath-burl.jpeg",    cat: "مغاسل وحمامات", title: "مغسلة بحافة طبيعية" },
      { img: "/images/g-slatwall.jpeg",     cat: "أعمال معمارية", title: "جدار شرائح مُضاء" },
      { img: "/images/g-dining.jpeg",       cat: "أثاث",          title: "طاولة طعام زجاجية" },
      { img: "/images/g-relief.jpeg",       cat: "قطع ديكور",     title: "لوحة مناظر متدرّجة" },
      { img: "/images/g-cafe-ratwah.jpeg",  cat: "مساحات تجارية", title: "تجهيز «مقهى رتوة»" },
      { img: "/images/g-stair.jpeg",        cat: "أعمال معمارية", title: "درجات سلّمٍ معلّقة" }
    ];
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
