/* =============================================================================
   Landing page rendering — outcomes, curriculum cards, resource links.
   ========================================================================== */
(function () {
  "use strict";
  if (!window.COURSE) return;
  const C = window.COURSE;
  const t = (en, zh) => window.CME.t(en, zh);

  /* Short topic chips per lecture (presentation only) */
  const TAGS = {
    1: ["Attention", "Embeddings", "RNN · LSTM"],
    2: ["RoPE", "GQA", "FlashAttn", "BERT"],
    3: ["MoE", "Sampling", "Chain-of-thought"],
    4: ["Pretraining", "Quantization", "LoRA"],
    5: ["RLHF", "PPO", "DPO"],
    6: ["Reasoning", "GRPO", "Test-time"],
    7: ["RAG", "Agents", "ReAct"],
    8: ["Benchmarks", "LLM-as-judge", "Bias"],
    9: ["Recap", "Trends", "What's next"],
  };

  const RES_ICONS = {
    syllabus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    cheatsheet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11H3v10h6zM21 3h-6v18h6zM15 7H9v14h6z"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7A5.2 5.2 0 0 0 20 4.8 4.9 4.9 0 0 0 19.9 1S18.7.6 16 2.5a13.4 13.4 0 0 0-7 0C6.3.6 5.1 1 5.1 1A4.9 4.9 0 0 0 5 4.8a5.2 5.2 0 0 0-1.4 3.7c0 5.2 3.2 6.4 6.2 6.7A3.4 3.4 0 0 0 9 17.8V22"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  };
  const ARROW = '<svg class="arr" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>';

  function renderOutcomes() {
    const grid = document.getElementById("outcomesGrid");
    if (!grid) return;
    grid.innerHTML = C.outcomes.map((o, i) => `
      <div class="outcome reveal d${(i % 3) + 1}">
        <div class="ico"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${o.icon}"/></svg></div>
        <h3>${t(o.title, o.titleZh)}</h3>
        <p>${o.text}</p>
      </div>`).join("");
  }

  function renderLectures() {
    const grid = document.getElementById("lecturesGrid");
    if (!grid) return;
    grid.innerHTML = C.lectures.map((l, i) => `
      <a class="lecture-card accent-${l.accent} reveal d${(i % 3) + 1}" href="learn.html#${l.slug}">
        <div class="lc-top">
          <span class="lc-num">${l.num}</span>
          <span class="lc-meta">
            <div>${l.date}</div>
            <div class="dur">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
              ${l.duration}
            </div>
          </span>
        </div>
        <h3>${t(l.title, l.titleZh)}</h3>
        <p class="tagline">${l.tagline}</p>
        <div class="lc-tags">${(TAGS[l.id] || []).map((x) => `<span class="lc-tag">${x}</span>`).join("")}</div>
        <span class="lc-go">${t("Open lecture", "进入本讲")} <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
      </a>`).join("");
  }

  function renderResources() {
    const list = document.getElementById("resList");
    if (!list) return;
    const items = [
      { icon: "video", title: t("Lecture playlist", "讲座播放列表"), sub: "YouTube · Autumn 2025", url: C.meta.playlist },
      { icon: "syllabus", title: t("Official syllabus", "官方教学大纲"), sub: "cme295.stanford.edu", url: C.meta.syllabus },
      { icon: "cheatsheet", title: t("VIP cheatsheet", "VIP 速查表"), sub: t("Visual summary", "可视化摘要"), url: C.meta.cheatsheet },
      { icon: "github", title: "GitHub repository", sub: "afshinea/stanford-cme-295…", url: C.meta.github },
      { icon: "book", title: "Super Study Guide", sub: t("Companion textbook", "配套教材"), url: C.meta.book },
    ];
    list.innerHTML = items.map((r) => `
      <a class="res-link" href="${r.url}" target="_blank" rel="noopener">
        <span class="ri">${RES_ICONS[r.icon]}</span>
        <span class="rt"><b>${r.title}</b><span>${r.sub}</span></span>
        ${ARROW}
      </a>`).join("");
  }

  function renderAll() {
    renderOutcomes();
    renderLectures();
    renderResources();
    if (window.CME.observeReveals) window.CME.observeReveals();
  }

  if (document.readyState !== "loading") renderAll();
  else document.addEventListener("DOMContentLoaded", renderAll);
  document.addEventListener("langchange", renderAll);
})();
