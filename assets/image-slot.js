/* ============================================================
   <image-slot> — display-only image element
   - Renders `src`, sized entirely from your CSS (shape/radius/fit).
   - No editing on the public site: content is managed in /admin.
   - Shows a subtle placeholder only when `src` is empty.
   ============================================================ */
(function () {
  "use strict";

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

      // placeholder (only shown when there is no image)
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
        '<span>' + (this.getAttribute("placeholder") || "صورة") + "</span>";

      this.appendChild(this._img);
      this.appendChild(this._ph);

      this._set(this.getAttribute("src") || "");
    }

    _set(url) {
      if (url) {
        this._img.src = url;
        this._img.style.display = "block";
        this._ph.style.display = "none";
      } else {
        this._img.removeAttribute("src");
        this._img.style.display = "none";
        this._ph.style.display = "flex";
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
