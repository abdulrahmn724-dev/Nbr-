/* ============================================================
   NBR — admin panel logic (Supabase Auth + content CRUD + uploads)
   Writes are allowed only for the authenticated admin (enforced by RLS).
   ============================================================ */
(function () {
  "use strict";

  var cfg = window.NBR_SUPABASE || {};
  if (!window.supabase || !cfg.url) { alert("إعدادات Supabase غير متوفرة"); return; }
  var sb = window.supabase.createClient(cfg.url, cfg.anonKey);

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // ---------- content model ----------
  var TABLES = {
    gallery: {
      title: "المعرض", sortable: true,
      fields: [
        { key: "image_path", label: "الصورة", type: "image" },
        { key: "cat", label: "التصنيف", type: "text" },
        { key: "title", label: "العنوان", type: "text" },
        { key: "caption", label: "الوصف", type: "textarea" },
        { key: "aspect", label: "نسبة الأبعاد (مثل 1/1 أو 1200/1600)", type: "text", def: "1/1" },
        { key: "published", label: "منشور", type: "bool", def: true }
      ]
    },
    works: {
      title: "أعمال مختارة (الرئيسية)", sortable: true,
      fields: [
        { key: "image_path", label: "الصورة", type: "image" },
        { key: "cat", label: "التصنيف", type: "text" },
        { key: "title", label: "العنوان", type: "text" },
        { key: "published", label: "منشور", type: "bool", def: true }
      ]
    },
    woods: {
      title: "مكتبة الأخشاب", sortable: true,
      fields: [
        { key: "name", label: "الاسم", type: "text" },
        { key: "latin", label: "بالإنجليزية", type: "text" },
        { key: "best", label: "الأنسب لـ", type: "text" },
        { key: "note", label: "الوصف", type: "textarea" },
        { key: "grad", label: "تدرّج اللون (CSS gradient)", type: "text", def: "linear-gradient(155deg,#7A5331,#3C2614)" },
        { key: "published", label: "منشور", type: "bool", def: true }
      ]
    }
  };

  var state = { section: "gallery", items: [] };

  // ---------- helpers ----------
  function toast(text, kind) {
    var el = $("#topmsg");
    el.className = "topmsg " + (kind || "");
    el.textContent = text;
    el.style.display = "block";
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.style.display = "none"; }, 3200);
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // ---------- auth ----------
  function showApp(on) {
    $("#app").classList.toggle("hidden", !on);
    $("#login").classList.toggle("hidden", on);
  }

  $("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = $("#loginMsg");
    msg.textContent = "جارٍ الدخول..."; msg.className = "msg";
    sb.auth.signInWithPassword({ email: $("#email").value.trim(), password: $("#password").value })
      .then(function (r) {
        if (r.error) { msg.textContent = "فشل الدخول: " + r.error.message; msg.className = "msg err"; return; }
        msg.textContent = ""; boot();
      });
  });

  $("#signout").addEventListener("click", function () {
    sb.auth.signOut().then(function () { showApp(false); });
  });

  // ---------- navigation ----------
  $$(".navbtn[data-sec]").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".navbtn[data-sec]").forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
      state.section = b.dataset.sec;
      loadSection();
    });
  });

  $("#addBtn").addEventListener("click", function () { openForm(null); });

  // ---------- load + render ----------
  function loadSection() {
    var sec = state.section;
    if (sec === "messages") { $("#secTitle").textContent = "رسائل التواصل"; $("#addBtn").style.display = "none"; return loadMessages(); }
    if (sec === "texts") { $("#secTitle").textContent = "نصوص الصفحات"; $("#addBtn").style.display = "none"; return loadTexts(); }
    $("#addBtn").style.display = "";
    var t = TABLES[sec];
    $("#secTitle").textContent = t.title;
    $("#list").innerHTML = '<p class="hint">جارٍ التحميل...</p>';
    var q = sb.from(sec).select("*");
    if (t.sortable) q = q.order("sort", { ascending: true });
    q.then(function (r) {
      if (r.error) { $("#list").innerHTML = '<p class="msg err">خطأ: ' + esc(r.error.message) + "</p>"; return; }
      state.items = r.data || [];
      renderList();
    });
  }

  function renderList() {
    var sec = state.section, t = TABLES[sec];
    if (!state.items.length) { $("#list").innerHTML = '<p class="hint">لا توجد عناصر بعد. اضغط «إضافة».</p>'; return; }
    var html = state.items.map(function (it, i) {
      var imgField = t.fields.filter(function (f) { return f.type === "image"; })[0];
      var thumb = imgField ? '<img src="' + esc(it[imgField.key]) + '" alt="" />' : "";
      var gradSw = sec === "woods" ? '<span class="swatch" style="background:' + esc(it.grad) + '"></span>' : "";
      var titleVal = it.title || it.name || "(بدون عنوان)";
      var sub = sec === "woods" ? (it.latin || "") + " · " + (it.best || "") : (it.cat || "");
      var pub = it.published
        ? '<span class="badge on">منشور</span>'
        : '<span class="badge off">مخفي</span>';
      var ups = t.sortable
        ? '<button class="btn ghost sm" data-act="up" data-i="' + i + '">▲</button>' +
          '<button class="btn ghost sm" data-act="down" data-i="' + i + '">▼</button>'
        : "";
      return '<div class="row">' + thumb + gradSw +
        '<div class="grow"><div class="t">' + esc(titleVal) + "</div><div class=\"s\">" + esc(sub) + "</div></div>" +
        pub +
        '<div class="ops">' + ups +
        '<button class="btn ghost sm" data-act="edit" data-i="' + i + '">تعديل</button>' +
        '<button class="btn danger sm" data-act="del" data-i="' + i + '">حذف</button></div></div>';
    }).join("");
    $("#list").innerHTML = html;
    $$("#list [data-act]").forEach(function (b) {
      b.addEventListener("click", function () {
        var it = state.items[+b.dataset.i], act = b.dataset.act;
        if (act === "edit") openForm(it);
        else if (act === "del") removeItem(it);
        else if (act === "up") move(it, -1);
        else if (act === "down") move(it, 1);
      });
    });
  }

  function loadMessages() {
    $("#list").innerHTML = '<p class="hint">جارٍ التحميل...</p>';
    sb.from("contact_submissions").select("*").order("created_at", { ascending: false }).then(function (r) {
      if (r.error) { $("#list").innerHTML = '<p class="msg err">خطأ: ' + esc(r.error.message) + "</p>"; return; }
      if (!(r.data || []).length) { $("#list").innerHTML = '<p class="hint">لا توجد رسائل بعد.</p>'; return; }
      $("#list").innerHTML = r.data.map(function (m) {
        var d = m.created_at ? new Date(m.created_at).toLocaleString("ar") : "";
        return '<div class="row"><div class="grow"><div class="t">' + esc(m.name || "—") +
          ' · <span class="s" style="display:inline" dir="ltr">' + esc(m.email || "") + "</span></div>" +
          '<div class="s">' + esc(m.type || "") + " — " + esc(m.message || "") + "</div>" +
          '<div class="s">' + esc(d) + "</div></div></div>";
      }).join("");
    });
  }

  // ---------- page texts ----------
  function loadTexts() {
    var fields = window.TEXT_FIELDS || [];
    if (!fields.length) { $("#list").innerHTML = '<p class="hint">لا توجد حقول نصوص.</p>'; return; }
    $("#list").innerHTML = '<p class="hint">جارٍ التحميل...</p>';
    sb.from("content_text").select("key,value").then(function (r) {
      var ov = {};
      (r.data || []).forEach(function (row) { ov[row.key] = row.value; });
      var pages = {};
      fields.forEach(function (f) { (pages[f.page] = pages[f.page] || []).push(f); });
      var LBL = { home: "الرئيسية", carpentry: "النجارة والأعمال", workshops: "الورش", consulting: "الاستشارات" };
      $("#list").innerHTML = Object.keys(pages).map(function (pg) {
        var rows = pages[pg].map(function (f) {
          var val = (ov[f.key] != null ? ov[f.key] : f.default);
          return '<div class="row" style="flex-direction:column;align-items:stretch;gap:8px">' +
            '<textarea data-tkey="' + esc(f.key) + '">' + esc(val) + "</textarea>" +
            '<div class="ops"><button class="btn sm" data-savetext="' + esc(f.key) + '">حفظ</button>' +
            '<button class="btn ghost sm" data-resettext="' + esc(f.key) + '">استرجاع الأصلي</button></div></div>';
        }).join("");
        return '<h3 style="margin:18px 4px 8px">' + (LBL[pg] || pg) + "</h3>" + rows;
      }).join("");
      // defaults map for reset
      var defs = {}; fields.forEach(function (f) { defs[f.key] = f.default; });
      $$("#list [data-savetext]").forEach(function (b) {
        b.addEventListener("click", function () {
          var key = b.dataset.savetext, ta = $('[data-tkey="' + key + '"]');
          b.disabled = true;
          sb.from("content_text").upsert({ key: key, value: ta.value }).then(function (r) {
            b.disabled = false;
            if (r.error) return toast("تعذّر الحفظ: " + r.error.message, "err");
            toast("تم الحفظ ✓", "ok");
          });
        });
      });
      $$("#list [data-resettext]").forEach(function (b) {
        b.addEventListener("click", function () {
          var key = b.dataset.resettext;
          $('[data-tkey="' + key + '"]').value = defs[key] || "";
        });
      });
    });
  }

  // ---------- reorder ----------
  function move(it, dir) {
    var i = state.items.indexOf(it), j = i + dir;
    if (j < 0 || j >= state.items.length) return;
    var other = state.items[j];
    Promise.all([
      sb.from(state.section).update({ sort: other.sort }).eq("id", it.id),
      sb.from(state.section).update({ sort: it.sort }).eq("id", other.id)
    ]).then(function () { loadSection(); });
  }

  // ---------- delete ----------
  function removeItem(it) {
    if (!confirm("متأكد من حذف هذا العنصر؟")) return;
    sb.from(state.section).delete().eq("id", it.id).then(function (r) {
      if (r.error) return toast("تعذّر الحذف: " + r.error.message, "err");
      toast("تم الحذف", "ok"); loadSection();
    });
  }

  // ---------- add / edit form ----------
  function openForm(item) {
    var t = TABLES[state.section];
    var editing = !!item;
    var data = {};
    t.fields.forEach(function (f) { data[f.key] = editing ? item[f.key] : (f.def !== undefined ? f.def : ""); });

    var body = t.fields.map(function (f) {
      if (f.type === "image") {
        return '<div class="field"><label>' + f.label + "</label>" +
          '<img class="thumb" id="thumb_' + f.key + '" src="' + esc(data[f.key]) + '" alt="" />' +
          '<input type="file" accept="image/*" data-img="' + f.key + '" />' +
          '<div class="hint">اختر صورة لرفعها، أو اترك الحالية.</div>' +
          '<input type="hidden" data-key="' + f.key + '" value="' + esc(data[f.key]) + '" /></div>';
      }
      if (f.type === "textarea")
        return '<div class="field"><label>' + f.label + '</label><textarea data-key="' + f.key + '">' + esc(data[f.key]) + "</textarea></div>";
      if (f.type === "bool")
        return '<div class="field"><label>' + f.label + '</label><select data-key="' + f.key + '"><option value="true"' + (data[f.key] ? " selected" : "") + ">منشور</option><option value=\"false\"" + (!data[f.key] ? " selected" : "") + ">مخفي</option></select></div>";
      return '<div class="field"><label>' + f.label + '</label><input type="text" data-key="' + f.key + '" value="' + esc(data[f.key]) + '" /></div>';
    }).join("");

    var root = $("#modalRoot");
    root.innerHTML = '<div class="ov"><div class="modal"><h3>' + (editing ? "تعديل" : "إضافة") + " — " + t.title +
      "</h3>" + body +
      '<div class="actions"><button class="btn" id="saveBtn">حفظ</button>' +
      '<button class="btn ghost" id="cancelBtn">إلغاء</button></div></div></div>';

    $("#cancelBtn").addEventListener("click", function () { root.innerHTML = ""; });

    // image upload handlers
    $$('input[data-img]', root).forEach(function (inp) {
      inp.addEventListener("change", function () {
        var file = inp.files && inp.files[0]; if (!file) return;
        var key = inp.dataset.img;
        toast("جارٍ رفع الصورة...");
        uploadImage(file).then(function (url) {
          $('[data-key="' + key + '"]', root).value = url;
          $("#thumb_" + key).src = url;
          toast("تم رفع الصورة", "ok");
        }).catch(function (e) { toast("فشل رفع الصورة: " + (e.message || e), "err"); });
      });
    });

    $("#saveBtn").addEventListener("click", function () {
      var rec = {};
      t.fields.forEach(function (f) {
        var node = $('[data-key="' + f.key + '"]', root);
        var v = node ? node.value : "";
        if (f.type === "bool") v = (v === "true");
        rec[f.key] = v;
      });
      if (!editing && t.sortable) {
        var maxSort = state.items.reduce(function (m, x) { return Math.max(m, x.sort || 0); }, -1);
        rec.sort = maxSort + 1;
      }
      var op = editing
        ? sb.from(state.section).update(rec).eq("id", item.id)
        : sb.from(state.section).insert(rec);
      $("#saveBtn").disabled = true;
      op.then(function (r) {
        if (r.error) { $("#saveBtn").disabled = false; return toast("تعذّر الحفظ: " + r.error.message, "err"); }
        root.innerHTML = ""; toast("تم الحفظ ✓", "ok"); loadSection();
      });
    });
  }

  function uploadImage(file) {
    var safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    var path = state.section + "/" + Date.now() + "-" + safe;
    return sb.storage.from("images").upload(path, file, { upsert: true, cacheControl: "3600" })
      .then(function (r) {
        if (r.error) throw r.error;
        return sb.storage.from("images").getPublicUrl(path).data.publicUrl;
      });
  }

  // ---------- boot ----------
  function boot() { showApp(true); loadSection(); }
  sb.auth.getSession().then(function (r) {
    if (r.data && r.data.session) boot(); else showApp(false);
  });
})();
