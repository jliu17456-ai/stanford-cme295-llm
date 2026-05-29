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
