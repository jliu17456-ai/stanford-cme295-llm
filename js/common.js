/* =============================================================================
   Shared front-end behavior: theme, language (i18n), nav, reveal animations.
   Loaded on every page before the page-specific script.
   ========================================================================== */
(function () {
  "use strict";

  const root = document.documentElement;

  /* ---------- Theme ---------- */
  const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function getTheme() {
    // Dark-first: the aurora design is the signature look. Honor an explicit
    // saved choice, otherwise default to dark for every new visitor.
    return localStorage.getItem("cme295-theme") || "dark";
  }
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    localStorage.setItem("cme295-theme", t);
    const btn = document.getElementById("themeBtn");
    if (btn) btn.innerHTML = t === "dark" ? SUN : MOON;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "dark" ? "#060814" : "#f7f8fc");
  }
  applyTheme(getTheme());

  /* ---------- Language ---------- */
  function getLang() { return localStorage.getItem("cme295-lang") || "en"; }
  function applyLang(lang) {
    localStorage.setItem("cme295-lang", lang);
    root.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
    document.querySelectorAll("[data-en]").forEach((el) => {
      const val = el.getAttribute(lang === "zh" ? "data-zh" : "data-en");
      if (val != null) el.innerHTML = val;
    });
    const btn = document.getElementById("langBtn");
    if (btn) btn.textContent = lang === "zh" ? "EN" : "中文";
    // Let page scripts react (e.g. re-render dynamic content)
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
  }
  // expose for page scripts
  window.CME = window.CME || {};
  window.CME.getLang = getLang;
  window.CME.applyLang = applyLang;
  window.CME.t = function (en, zh) { return getLang() === "zh" ? zh : en; };

  /* ---------- Wire up controls after DOM ready ---------- */
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    applyTheme(getTheme());
    applyLang(getLang());

    const themeBtn = document.getElementById("themeBtn");
    if (themeBtn) themeBtn.addEventListener("click", () => {
      applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });

    const langBtn = document.getElementById("langBtn");
    if (langBtn) langBtn.addEventListener("click", () => {
      applyLang(getLang() === "en" ? "zh" : "en");
    });

    /* Nav scroll shadow */
    const nav = document.getElementById("nav");
    if (nav) {
      const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* Mobile menu */
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
      navLinks.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => navLinks.classList.remove("open"))
      );
    }
  });

  /* ---------- Command palette (⌘K / Ctrl+K) ---------- */
  function initCmdK() {
    if (!window.COURSE || document.getElementById("cmdk")) return;
    const C = window.COURSE;
    const onLearn = !!document.getElementById("navTree") || /learn\.html$/.test(location.pathname);

    // build index
    const items = [];
    C.lectures.forEach((l) => {
      items.push({ label: l.title, labelZh: l.titleZh, sub: "Lecture " + l.num, hash: "#" + l.slug, accent: l.accent, lead: l.num });
      l.topics.forEach((tp, i) =>
        items.push({ label: tp.name, labelZh: tp.nameZh || tp.name, sub: "L" + l.num + " · " + l.title, hash: "#" + l.slug + "/" + i, accent: l.accent, lead: "·" }));
    });

    // trigger button in the nav
    const themeBtn = document.getElementById("themeBtn");
    if (themeBtn && themeBtn.parentNode) {
      const trig = document.createElement("button");
      trig.className = "icon-btn cmdk-trigger";
      trig.id = "cmdkTrigger";
      trig.title = "Search (⌘K)";
      trig.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg><span class="cmdk-kbd">⌘K</span>';
      themeBtn.parentNode.insertBefore(trig, themeBtn);
      trig.addEventListener("click", open);
    }

    // overlay
    const root = document.createElement("div");
    root.id = "cmdk"; root.className = "cmdk"; root.hidden = true;
    root.innerHTML =
      '<div class="cmdk-backdrop"></div>' +
      '<div class="cmdk-panel" role="dialog" aria-modal="true" aria-label="Search">' +
        '<div class="cmdk-input"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>' +
        '<input id="cmdkInput" type="text" autocomplete="off" spellcheck="false"></div>' +
        '<ul class="cmdk-list" id="cmdkList"></ul>' +
        '<div class="cmdk-foot"><span><kbd>↑</kbd><kbd>↓</kbd> ' + (getLang() === "zh" ? "选择" : "navigate") + '</span><span><kbd>↵</kbd> ' + (getLang() === "zh" ? "打开" : "open") + '</span><span><kbd>esc</kbd> ' + (getLang() === "zh" ? "关闭" : "close") + '</span></div>' +
      '</div>';
    document.body.appendChild(root);

    const input = root.querySelector("#cmdkInput");
    const list = root.querySelector("#cmdkList");
    let results = [], sel = 0;

    function render(q) {
      const lang = getLang();
      const ql = q.trim().toLowerCase();
      results = items.filter((it) => !ql || (it.label + " " + it.labelZh + " " + it.sub).toLowerCase().includes(ql)).slice(0, 50);
      sel = 0;
      list.innerHTML = results.map((it, i) =>
        `<li class="cmdk-item accent-${it.accent} ${i === 0 ? "sel" : ""}" data-i="${i}">
          <span class="cmdk-lead">${it.lead}</span>
          <span class="cmdk-text"><b>${lang === "zh" ? it.labelZh : it.label}</b><span>${it.sub}</span></span>
          <svg class="cmdk-go" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </li>`).join("") || `<li class="cmdk-empty">${lang === "zh" ? "没有匹配结果" : "No matches"}</li>`;
      list.querySelectorAll(".cmdk-item").forEach((li) => {
        li.addEventListener("mousemove", () => setSel(+li.dataset.i));
        li.addEventListener("click", () => go(+li.dataset.i));
      });
    }
    function setSel(i) {
      sel = i;
      list.querySelectorAll(".cmdk-item").forEach((li, j) => li.classList.toggle("sel", j === i));
      const el = list.querySelector(".cmdk-item.sel");
      if (el) el.scrollIntoView({ block: "nearest" });
    }
    function go(i) {
      const it = results[i]; if (!it) return;
      close();
      if (onLearn) { location.hash = it.hash; }
      else { location.href = "learn.html" + it.hash; }
    }
    function open() {
      root.hidden = false;
      document.body.style.overflow = "hidden";
      input.value = ""; input.placeholder = getLang() === "zh" ? "搜索讲座与主题…" : "Search lectures & topics…";
      render("");
      requestAnimationFrame(() => input.focus());
    }
    function close() { root.hidden = true; document.body.style.overflow = ""; }

    input.addEventListener("input", () => render(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setSel(Math.min(sel + 1, results.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSel(Math.max(sel - 1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); go(sel); }
      else if (e.key === "Escape") { close(); }
    });
    root.querySelector(".cmdk-backdrop").addEventListener("click", close);

    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); root.hidden ? open() : close(); }
    });
  }

  ready(initCmdK);

  /* ---------- Reveal-on-scroll (works for elements added later too) ---------- */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" })
    : null;

  window.CME.observeReveals = function (scope) {
    const els = (scope || document).querySelectorAll(".reveal:not(.in)");
    if (!io) { els.forEach((el) => el.classList.add("in")); return; }
    els.forEach((el) => io.observe(el));
  };
  ready(() => window.CME.observeReveals());
})();
