/* ============================================================
   <image-slot> — lightweight fillable image placeholder
   - Renders `src` immediately (design stays populated)
   - Click to browse / drag-drop an image to replace it
   - Replacement persists in localStorage (per id)
   - Sizes entirely from your CSS (light DOM, no shadow quirks)
   ============================================================ */
(function () {
  "use strict";
  const KEY = (id) => "nbr-slot:" + id;

  class ImageSlot extends HTMLElement {
    static get observedAttributes() { return ["src", "fit", "radius", "shape"]; }

    connectedCallback() {
      if (this._built) return;
      this._built = true;

      const shape = (this.getAttribute("shape") || "rounded").toLowerCase();
      let radius = "0";
      if (shape === "circle") radius = "50%";
      else if (shape === "pill") radius = "9999px";
      else if (shape === "rounded") radius = (parseFloat(this.getAttribute("radius")) || 12) + "px";

      Object.assign(this.style, {
        position: "relative",
        display: this.style.display || "block",
        overflow: "hidden",
        borderRadius: radius,
        cursor: "pointer",
        background: "#EBE0CE",
      });

      // image
      this._img = document.createElement("img");
      this._img.alt = "";
      this._img.decoding = "async";
      Object.assign(this._img.style, {
        width: "100%", height: "100%", display: "block",
        objectFit: this.getAttribute("fit") || "cover",
        objectPosition: "50% 50%",
      });

      // placeholder
      this._ph = document.createElement("div");
      Object.assign(this._ph.style, {
        position: "absolute", inset: "0",
        display: "flex", flexDirection: "column", gap: "8px",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "16px",
        fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px",
        letterSpacing: "0.04em", color: "rgba(42,36,30,0.5)",
        background:
          "repeating-linear-gradient(135deg, rgba(42,36,30,0.045) 0 2px, transparent 2px 11px)",
      });
      this._ph.innerHTML =
        '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:.7"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.8"/><path d="m21 15-5-5L5 21"/></svg>' +
        '<span>' + (this.getAttribute("placeholder") || "أضف صورة") + "</span>";

      // hover hint when filled
      this._hint = document.createElement("div");
      Object.assign(this._hint.style, {
        position: "absolute", insetBlockEnd: "10px", insetInlineEnd: "10px",
        background: "rgba(34,28,22,0.82)", color: "#fff",
        fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: "11.5px",
        padding: "6px 11px", borderRadius: "100px", opacity: "0",
        transition: "opacity .25s", pointerEvents: "none", backdropFilter: "blur(4px)",
      });
      this._hint.textContent = "اسحب صورة للاستبدال";

      this.appendChild(this._img);
      this.appendChild(this._ph);
      this.appendChild(this._hint);

      // hidden file input
      this._input = document.createElement("input");
      this._input.type = "file";
      this._input.accept = "image/*";
      this._input.style.display = "none";
      this.appendChild(this._input);

      // events
      this.addEventListener("click", () => this._input.click());
      this._input.addEventListener("change", (e) => {
        const f = e.target.files && e.target.files[0];
        if (f) this._readFile(f);
      });
      this.addEventListener("dragover", (e) => { e.preventDefault(); this.style.outline = "2px dashed #9A3B2E"; });
      this.addEventListener("dragleave", () => { this.style.outline = "none"; });
      this.addEventListener("drop", (e) => {
        e.preventDefault(); this.style.outline = "none";
        const f = e.dataTransfer.files && e.dataTransfer.files[0];
        if (f && f.type.startsWith("image/")) this._readFile(f);
      });
      this.addEventListener("mouseenter", () => { if (this._filled) this._hint.style.opacity = "1"; });
      this.addEventListener("mouseleave", () => { this._hint.style.opacity = "0"; });

      // initial source: saved override > bundled resource > src attribute
      let saved = null;
      try { saved = this.id ? localStorage.getItem(KEY(this.id)) : null; } catch (e) {}
      var raw = this.getAttribute("src") || "";
      var bundled = (window.__resources && raw && window.__resources[raw]) || "";
      this._set(saved || bundled || raw);
    }

    _readFile(file) {
      const r = new FileReader();
      r.onload = () => {
        this._set(r.result);
        try { if (this.id) localStorage.setItem(KEY(this.id), r.result); } catch (e) {}
      };
      r.readAsDataURL(file);
    }

    _set(url) {
      if (url) {
        this._img.src = url;
        this._img.style.display = "block";
        this._ph.style.display = "none";
        this._filled = true;
      } else {
        this._img.removeAttribute("src");
        this._img.style.display = "none";
        this._ph.style.display = "flex";
        this._filled = false;
      }
    }

    attributeChangedCallback(name, oldV, newV) {
      if (!this._built) return;
      if (name === "src") this._set(newV);
      if (name === "fit") this._img.style.objectFit = newV || "cover";
    }
  }

  if (!customElements.get("image-slot")) customElements.define("image-slot", ImageSlot);
})();
