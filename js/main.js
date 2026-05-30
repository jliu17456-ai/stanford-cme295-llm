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
  const TAGS_ZH = {
    1: ["注意力", "词嵌入", "RNN · LSTM"],
    2: ["RoPE", "GQA", "FlashAttn", "BERT"],
    3: ["MoE", "采样", "思维链"],
    4: ["预训练", "量化", "LoRA"],
    5: ["RLHF", "PPO", "DPO"],
    6: ["推理", "GRPO", "测试期算力"],
    7: ["RAG", "智能体", "ReAct"],
    8: ["基准测试", "LLM 裁判", "偏差"],
    9: ["回顾", "趋势", "下一步"],
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
        <p>${t(o.text, o.textZh || o.text)}</p>
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
        <p class="tagline">${t(l.tagline, l.taglineZh || l.tagline)}</p>
        <div class="lc-tags">${((window.CME.getLang() === "zh" ? TAGS_ZH[l.id] : TAGS[l.id]) || []).map((x) => `<span class="lc-tag">${x}</span>`).join("")}</div>
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

  /* ---------- Animated hero: a drifting token / attention network ---------- */
  function initHeroCanvas() {
    const canvas = document.getElementById("heroCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const palette = ["#818cf8", "#a78bfa", "#22d3ee", "#38bdf8"];
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w, h, dpr, nodes, raf;
    const mouse = { x: -999, y: -999 };
    const LINK = 150;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(72, Math.max(26, Math.round((w * h) / 17000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.8 + 1.1,
        c: palette[(Math.random() * palette.length) | 0],
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        // links between nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            ctx.strokeStyle = a.c;
            ctx.globalAlpha = (1 - d / LINK) * 0.16;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        // link to cursor (attention beam)
        const mdx = a.x - mouse.x, mdy = a.y - mouse.y;
        const md = Math.hypot(mdx, mdy);
        if (md < LINK * 1.5) {
          ctx.strokeStyle = a.c;
          ctx.globalAlpha = (1 - md / (LINK * 1.5)) * 0.4;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        // node
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = a.c;
        ctx.shadowColor = a.c; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(frame);
    }

    resize();
    frame(); // draws at least one frame (static if reduced motion)
    window.addEventListener("resize", () => { cancelAnimationFrame(raf); resize(); if (!reduce) frame(); });
    if (!reduce) {
      window.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
      });
      window.addEventListener("mouseleave", () => { mouse.x = -999; mouse.y = -999; });
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
      });
    }
  }

  function renderAll() {
    renderOutcomes();
    renderLectures();
    renderResources();
    if (window.CME.observeReveals) window.CME.observeReveals();
  }

  /* ---------- Count-up stats ---------- */
  function countUp() {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll("[data-count]").forEach((el) => {
      const target = parseInt(el.getAttribute("data-count"), 10);
      const suffix = el.getAttribute("data-suffix") || "";
      if (reduce) { el.textContent = target + suffix; return; }
      const dur = 1100, t0 = performance.now();
      function step(t) {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
        el.textContent = Math.round(target * e) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  function boot() { renderAll(); initHeroCanvas(); countUp(); }
  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
  document.addEventListener("langchange", renderAll); // re-render text only; canvas persists
})();
