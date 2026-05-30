/* Renderer for the ML probability handbook (handbook.html).
   Reuses the learn-page CSS classes; content/data come from window.HANDBOOK. */
(function () {
  "use strict";
  const H = window.HANDBOOK;
  const $ = (id) => document.getElementById(id);
  const ACCENTS = ["indigo", "violet", "cyan", "emerald", "amber", "rose", "sky", "teal", "fuchsia", "indigo", "violet", "cyan"];
  if (!H) return;

  const chapters = H.chapters;
  const bySlug = (s) => chapters.find((c) => c.slug === s);

  function buildNav() {
    const tree = $("navTree");
    tree.innerHTML = chapters.map((c, i) => `
      <div class="nav-group accent-${ACCENTS[i % ACCENTS.length]}" data-slug="${c.slug}">
        <button class="nav-lecture" data-slug="${c.slug}">
          <span class="nl-num">${c.num}</span>
          <span class="nl-title">${c.title}</span>
          <svg class="nl-chev" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </button>
        <div class="nav-subs">
          ${c.sections.map((s, j) => `<button class="nav-sub" data-slug="${c.slug}" data-sec="${j}">${s.title || c.title}</button>`).join("")}
        </div>
      </div>`).join("");

    tree.querySelectorAll(".nav-lecture").forEach((b) =>
      b.addEventListener("click", () => { location.hash = "#" + b.dataset.slug; closeSidebar(); }));
    tree.querySelectorAll(".nav-sub").forEach((b) =>
      b.addEventListener("click", () => { location.hash = "#" + b.dataset.slug + "/" + b.dataset.sec; closeSidebar(); }));
  }

  function render(slug, secIdx) {
    const c = bySlug(slug) || chapters[0];
    const idx = chapters.indexOf(c);
    const prev = chapters[idx - 1], next = chapters[idx + 1];
    const content = $("content");
    content.innerHTML = `
      <article class="lec" data-slug="${c.slug}">
        <div class="lec-head reveal in">
          <div class="lec-eyebrow"><span class="accent-dot accent-${ACCENTS[idx % ACCENTS.length]}"></span>${H.meta.title} · 第 ${c.num} 章</div>
          <h1>${c.title}</h1>
        </div>
        ${c.sections.map((s, j) => `
          <section class="topic" id="sec-${j}">
            <div class="topic-head"><span class="ti">${c.num}.${j + 1}</span><h2>${s.title || c.title}</h2></div>
            <div class="topic-body">${s.body}</div>
          </section>`).join("")}
        <nav class="lec-nav">
          ${prev ? `<a class="lec-nav-btn prev" href="#${prev.slug}"><span>← 上一章</span><b>${prev.title}</b></a>` : "<span></span>"}
          ${next ? `<a class="lec-nav-btn next" href="#${next.slug}"><span>下一章 →</span><b>${next.title}</b></a>` : "<span></span>"}
        </nav>
      </article>`;

    // active states
    document.querySelectorAll(".nav-group").forEach((g) => g.classList.toggle("open", g.dataset.slug === c.slug));
    document.querySelectorAll(".nav-lecture").forEach((b) => b.classList.toggle("active", b.dataset.slug === c.slug));
    const mt = $("mobileTitle"); if (mt) mt.textContent = c.title;
    document.title = c.title + " · 机器学习的概率视角";

    typeset(content);
    const sc = $("content"); if (sc) sc.scrollTop = 0;
    window.scrollTo(0, 0);
    if (secIdx != null) setTimeout(() => {
      const el = $("sec-" + secIdx); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    updateProgress();
  }

  function typeset(node) {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetClear && window.MathJax.typesetClear([node]);
      window.MathJax.typesetPromise([node, $("navTree")]).catch(() => {});
    }
  }

  function route() {
    const h = location.hash.replace(/^#/, "");
    if (!h) { location.replace("#" + chapters[0].slug); return; }
    const [slug, sec] = h.split("/");
    render(slug, sec != null ? +sec : null);
  }

  // reading progress + scrollspy
  function updateProgress() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? Math.min(100, Math.round((doc.scrollTop || document.body.scrollTop || window.scrollY) / max * 100)) : 0;
    const rp = $("readProgress"); if (rp) rp.style.width = pct + "%";
  }
  function scrollspy() {
    const secs = [...document.querySelectorAll(".topic")];
    let cur = 0;
    secs.forEach((s, i) => { if (s.getBoundingClientRect().top < 140) cur = i; });
    const slug = (location.hash.replace(/^#/, "").split("/")[0]) || chapters[0].slug;
    document.querySelectorAll(".nav-sub").forEach((b) =>
      b.classList.toggle("active", b.dataset.slug === slug && +b.dataset.sec === cur));
  }

  // search filter
  function initSearch() {
    const inp = $("search"); if (!inp) return;
    inp.addEventListener("input", () => {
      const q = inp.value.trim().toLowerCase();
      document.querySelectorAll(".nav-group").forEach((g) => {
        const c = bySlug(g.dataset.slug);
        const hay = (c.title + " " + c.sections.map((s) => s.title).join(" ")).toLowerCase();
        g.style.display = !q || hay.includes(q) ? "" : "none";
      });
    });
  }

  // mobile sidebar
  function closeSidebar() {
    $("sidebar") && $("sidebar").classList.remove("open");
    $("backdrop") && $("backdrop").classList.remove("show");
  }
  function initSidebar() {
    const t = $("sidebarToggle"), bd = $("backdrop");
    t && t.addEventListener("click", () => { $("sidebar").classList.toggle("open"); bd.classList.toggle("show"); });
    bd && bd.addEventListener("click", closeSidebar);
  }

  // keyboard: ← / → chapters, / focus search
  function initKeys() {
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") { if (e.key === "Escape") e.target.blur(); return; }
      const slug = (location.hash.replace(/^#/, "").split("/")[0]) || chapters[0].slug;
      const idx = chapters.findIndex((c) => c.slug === slug);
      if (e.key === "ArrowLeft" && idx > 0) location.hash = "#" + chapters[idx - 1].slug;
      else if (e.key === "ArrowRight" && idx < chapters.length - 1) location.hash = "#" + chapters[idx + 1].slug;
      else if (e.key === "/") { e.preventDefault(); $("search") && $("search").focus(); }
    });
  }

  function boot() {
    buildNav(); initSearch(); initSidebar(); initKeys();
    window.addEventListener("hashchange", route);
    (document.scrollingElement || document).addEventListener && document.addEventListener("scroll", () => { updateProgress(); scrollspy(); }, { passive: true });
    route();
  }
  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
