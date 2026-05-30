/* =============================================================================
   Interactive self-attention visualization for the landing page.
   Hover/click a word (query) to see its attention over all words (keys).
   The weights are an illustrative, hand-tuned pattern for one sentence —
   a concept demo of what self-attention does, not a real model's output.
   ========================================================================== */
(function () {
  "use strict";
  const sentence = ["The", "cat", "sat", "because", "it", "was", "tired"];
  // rows = query, cols = key (each row ~ a softmax distribution)
  const A = [
    [0.16, 0.55, 0.10, 0.03, 0.05, 0.04, 0.07], // The   -> cat
    [0.08, 0.26, 0.42, 0.04, 0.07, 0.05, 0.08], // cat   -> sat
    [0.05, 0.46, 0.18, 0.05, 0.11, 0.05, 0.10], // sat   -> cat
    [0.04, 0.10, 0.30, 0.10, 0.12, 0.10, 0.24], // because-> sat / tired
    [0.05, 0.56, 0.09, 0.05, 0.15, 0.04, 0.06], // it    -> cat (coreference!)
    [0.03, 0.10, 0.12, 0.08, 0.20, 0.12, 0.35], // was   -> tired / it
    [0.03, 0.14, 0.12, 0.10, 0.26, 0.10, 0.25], // tired -> it
  ].map((r) => { const s = r.reduce((a, b) => a + b, 0); return r.map((x) => x / s); });

  let active = 4; // default query: "it"

  function init() {
    const wrap = document.getElementById("attnSentence");
    const svg = document.getElementById("attnSvg");
    const qLabel = document.getElementById("attnQuery");
    if (!wrap || !svg) return;

    svg.innerHTML = '<defs><linearGradient id="attnGrad" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#6366f1"/><stop offset="0.5" stop-color="#8b5cf6"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs>';

    wrap.innerHTML = sentence.map((w, i) =>
      `<button class="attn-token" data-i="${i}" type="button" aria-label="${w}"><span class="t">${w}</span><span class="bar"></span></button>`
    ).join("");

    const tokens = [...wrap.querySelectorAll(".attn-token")];
    tokens.forEach((tk) => {
      const i = +tk.dataset.i;
      tk.addEventListener("mouseenter", () => set(i));
      tk.addEventListener("focus", () => set(i));
      tk.addEventListener("click", () => set(i));
    });

    function set(i) { active = i; render(); }

    function render() {
      const row = A[active];
      tokens.forEach((tk, i) => {
        const w = row[i];
        tk.classList.toggle("is-query", i === active);
        // background intensity by weight
        tk.style.background = i === active ? "" : `rgba(139,92,246,${(0.06 + w * 0.8).toFixed(3)})`;
        tk.style.borderColor = `rgba(139,92,246,${(0.15 + w * 0.6).toFixed(3)})`;
        const bar = tk.querySelector(".bar");
        if (bar) bar.style.transform = `scaleX(${w.toFixed(3)})`;
      });
      if (qLabel) qLabel.textContent = sentence[active];
      drawCurves(row);
    }

    function drawCurves(row) {
      const base = svg.getBoundingClientRect();
      if (!base.width) return;
      const center = (el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - base.left, y: r.top + r.height / 2 - base.top };
      };
      const q = center(tokens[active]);
      let paths = "";
      row.forEach((w, i) => {
        if (i === active) return;
        const k = center(tokens[i]);
        const midX = (q.x + k.x) / 2;
        const lift = 26 + Math.abs(q.x - k.x) * 0.16;
        const ctrlY = Math.min(q.y, k.y) - lift;
        const sw = (1.2 + w * 8).toFixed(2);
        const op = (0.1 + w * 0.7).toFixed(3);
        paths += `<path d="M ${q.x} ${q.y} Q ${midX} ${ctrlY} ${k.x} ${k.y}" fill="none" stroke="url(#attnGrad)" stroke-width="${sw}" stroke-linecap="round" opacity="${op}"/>`;
      });
      // keep defs, replace paths
      const defs = svg.querySelector("defs");
      svg.innerHTML = "";
      svg.appendChild(defs);
      svg.insertAdjacentHTML("beforeend", paths);
    }

    render();
    let rid;
    window.addEventListener("resize", () => { cancelAnimationFrame(rid); rid = requestAnimationFrame(render); });
    // re-measure once fonts/layout settle
    setTimeout(render, 300);
    setTimeout(render, 1200);
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
