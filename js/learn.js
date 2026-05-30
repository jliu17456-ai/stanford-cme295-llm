/* =============================================================================
   Learn page app: sidebar nav, hash routing, content rendering, progress,
   search, scrollspy and MathJax typesetting.
   ========================================================================== */
(function () {
  "use strict";
  if (!window.COURSE) return;
  const C = window.COURSE;
  const L = C.lectures;
  const t = (en, zh) => window.CME.t(en, zh);
  const $ = (id) => document.getElementById(id);

  const PROGRESS_KEY = "cme295-progress";
  let done = loadProgress();
  let scrollSpy = null;

  /* ---------- progress storage ---------- */
  function loadProgress() {
    try { return new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]")); }
    catch (e) { return new Set(); }
  }
  function saveProgress() { localStorage.setItem(PROGRESS_KEY, JSON.stringify([...done])); }

  /* ---------- routing ---------- */
  function parseHash() {
    const raw = decodeURIComponent(location.hash.replace(/^#/, ""));
    const [slug, topic] = raw.split("/");
    return { slug: slug || L[0].slug, topic: topic != null ? parseInt(topic, 10) : null };
  }
  function lectureBySlug(slug) { return L.find((l) => l.slug === slug) || L[0]; }

  /* ---------- MathJax ---------- */
  function typeset(el) {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetClear && window.MathJax.typesetClear([el]);
      window.MathJax.typesetPromise([el]).catch(() => {});
    } else {
      setTimeout(() => typeset(el), 180);
    }
  }

  /* ---------- icons ---------- */
  const ICheck = '<svg class="nl-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
  const ICaret = '<svg class="nl-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 6l6 6-6 6"/></svg>';

  /* ---------- sidebar ---------- */
  function renderSidebar() {
    const tree = $("navTree");
    const cur = parseHash().slug;
    tree.innerHTML = L.map((l) => {
      const isActive = l.slug === cur;
      const isDone = done.has(l.id);
      const subs = l.topics.map((tp, i) =>
        `<button class="nav-sub" data-slug="${l.slug}" data-topic="${i}">${t(tp.name, tp.nameZh || tp.name)}</button>`
      ).join("");
      return `
      <div class="nav-group accent-${l.accent} ${isActive ? "open" : ""}" data-slug="${l.slug}">
        <button class="nav-lecture ${isActive ? "active" : ""} ${isDone ? "done" : ""}" data-slug="${l.slug}">
          <span class="nl-num">${l.num}</span>
          <span class="nl-title">${t(l.title, l.titleZh)}</span>
          ${ICheck}
          ${ICaret}
        </button>
        <div class="nav-sublist"><div>${subs}</div></div>
      </div>`;
    }).join("");

    // lecture click -> navigate (and toggle expand if already active)
    tree.querySelectorAll(".nav-lecture").forEach((btn) => {
      btn.addEventListener("click", () => {
        const slug = btn.dataset.slug;
        if (parseHash().slug === slug) {
          btn.closest(".nav-group").classList.toggle("open");
        } else {
          location.hash = slug;
        }
        closeSidebarMobile();
      });
    });
    // topic click -> navigate to lecture + scroll
    tree.querySelectorAll(".nav-sub").forEach((btn) => {
      btn.addEventListener("click", () => {
        location.hash = btn.dataset.slug + "/" + btn.dataset.topic;
        closeSidebarMobile();
      });
    });
  }

  function updateSidebarActive() {
    const cur = parseHash().slug;
    document.querySelectorAll(".nav-group").forEach((g) => {
      const on = g.dataset.slug === cur;
      g.classList.toggle("open", on);
      const btn = g.querySelector(".nav-lecture");
      btn.classList.toggle("active", on);
    });
    document.querySelectorAll(".nav-lecture").forEach((btn) => {
      const l = lectureBySlug(btn.dataset.slug);
      btn.classList.toggle("done", done.has(l.id));
    });
  }

  /* ---------- progress bar ---------- */
  function updateProgress() {
    const pct = Math.round((done.size / L.length) * 100);
    $("progressFill").style.width = pct + "%";
    $("progressPct").textContent = pct + "%";
  }

  /* ---------- content ---------- */
  const ITime = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  const ICal = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
  const IBulb = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg>';
  const IBook = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>';
  const IExt = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>';

  function renderContent() {
    const { slug, topic } = parseHash();
    const l = lectureBySlug(slug);
    const idx = L.indexOf(l);
    const prev = L[idx - 1];
    const next = L[idx + 1];
    const isDone = done.has(l.id);
    const content = $("content");

    const topicsHtml = l.topics.map((tp, i) => `
      <section class="topic" id="topic-${i}">
        <div class="topic-head">
          <span class="ti">${String(i + 1).padStart(2, "0")}</span>
          <h2>${t(tp.name, tp.nameZh || tp.name)}</h2>
        </div>
        <div class="topic-body">${t(tp.body, tp.bodyZh || tp.body)}</div>
      </section>`).join("");

    const takeawaysHtml = `
      <div class="takeaways">
        <h3>${IBulb}<span>${t("Key takeaways", "要点总结")}</span></h3>
        <ul>${(window.CME.getLang() === "zh" && l.takeawaysZh ? l.takeawaysZh : l.takeaways).map((x) => `<li>${x}</li>`).join("")}</ul>
      </div>`;

    const refsHtml = (l.refs && l.refs.length) ? `
      <div class="refs">
        <h3>${IBook}<span>${t("Further reading", "延伸阅读")}</span></h3>
        <ul>${l.refs.map((r) => `<li><a href="${r.u}" target="_blank" rel="noopener">${r.t} ${IExt}</a></li>`).join("")}</ul>
      </div>` : "";

    content.innerHTML = `
      <div class="content-inner accent-${l.accent}">
        <header class="lec-head">
          <div class="crumbs">${C.meta.code} / <b>${t("LECTURE", "第")} ${l.num}${t("", " 讲")}</b></div>
          <h1>${t(l.title, l.titleZh)}</h1>
          <p class="lec-tagline">${t(l.tagline, l.taglineZh || l.tagline)}</p>
          <div class="lec-meta-row">
            <span>${ICal} ${l.date}</span>
            <span>${ITime} ${l.duration}</span>
            <span>${l.topics.length} ${t("topics", "个主题")}</span>
          </div>
        </header>

        <div class="video-frame" id="videoFrame">
          <button class="yt-facade" id="ytFacade" type="button" aria-label="${t("Play lecture video", "播放讲座视频")}">
            <img class="yt-thumb" id="ytThumb" src="https://i.ytimg.com/vi/${l.videoId}/maxresdefault.jpg" alt="" loading="lazy" />
            <span class="yt-scrim"></span>
            <span class="yt-play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>
          </button>
        </div>
        <a class="yt-link" href="https://www.youtube.com/watch?v=${l.videoId}" target="_blank" rel="noopener">${t("Watch on YouTube", "在 YouTube 上观看")} ${IExt}</a>

        <div class="overview-box">
          <div class="ob-label">${t("Overview", "本讲概览")}</div>
          ${t(l.overview, l.overviewZh).split("</p>").length > 1 ? t(l.overview, l.overviewZh) : "<p>" + t(l.overview, l.overviewZh) + "</p>"}
        </div>

        ${topicsHtml}
        ${takeawaysHtml}
        ${refsHtml}

        <button class="complete-btn ${isDone ? "done" : ""}" id="completeBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          <span>${isDone ? t("Completed", "已完成") : t("Mark as complete", "标记为已完成")}</span>
        </button>

        <div class="lec-nav">
          <a class="prev ${prev ? "" : "disabled"}" href="${prev ? "#" + prev.slug : "#"}">
            <div class="dir">← ${t("Previous", "上一讲")}</div>
            <div class="t">${prev ? t(prev.title, prev.titleZh) : "—"}</div>
          </a>
          <a class="next ${next ? "" : "disabled"}" href="${next ? "#" + next.slug : "#"}">
            <div class="dir">${t("Next", "下一讲")} →</div>
            <div class="t">${next ? t(next.title, next.titleZh) : t("You've reached the end 🎉", "你已学完全部 🎉")}</div>
          </a>
        </div>
      </div>`;

    // typeset math
    typeset(content);

    // complete button
    $("completeBtn").addEventListener("click", () => {
      if (done.has(l.id)) done.delete(l.id); else done.add(l.id);
      saveProgress();
      updateProgress();
      updateSidebarActive();
      const b = $("completeBtn");
      const on = done.has(l.id);
      b.classList.toggle("done", on);
      b.querySelector("span").textContent = on ? t("Completed", "已完成") : t("Mark as complete", "标记为已完成");
    });

    // video facade: sharp thumbnail -> load player on click (fast + graceful)
    const thumb = $("ytThumb");
    if (thumb) thumb.addEventListener("error", function () {
      this.onerror = null; this.src = "https://i.ytimg.com/vi/" + l.videoId + "/hqdefault.jpg";
    }, { once: true });
    const facade = $("ytFacade");
    if (facade) facade.addEventListener("click", () => {
      const f = $("videoFrame");
      if (!f) return;
      f.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + l.videoId +
        '?autoplay=1&rel=0" title="' + t(l.title, l.titleZh) +
        '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
    });

    // mobile title
    const mt = $("mobileTitle");
    if (mt) mt.textContent = (t("Lecture", "第") + " " + l.num);

    // scroll: to topic or to top
    requestAnimationFrame(() => {
      if (topic != null) {
        const el = $("topic-" + topic);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
        const c = document.querySelector(".content"); if (c) c.scrollTop = 0;
      }
      if (window.__updateRead) window.__updateRead();
    });

    setupScrollSpy(l);
    document.title = t(l.title, l.titleZh) + " · CME 295";
  }

  /* ---------- scrollspy: highlight active topic in sidebar ---------- */
  function setupScrollSpy(l) {
    if (scrollSpy) scrollSpy.disconnect();
    const subs = [...document.querySelectorAll(`.nav-sub[data-slug="${l.slug}"]`)];
    const sections = l.topics.map((_, i) => $("topic-" + i)).filter(Boolean);
    if (!("IntersectionObserver" in window) || !sections.length) return;
    scrollSpy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const i = sections.indexOf(e.target);
          subs.forEach((s, j) => s.classList.toggle("active", j === i));
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
    sections.forEach((s) => scrollSpy.observe(s));
  }

  /* ---------- search ---------- */
  function setupSearch() {
    const input = $("search");
    if (!input) return;
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      document.querySelectorAll(".nav-group").forEach((g) => {
        const l = lectureBySlug(g.dataset.slug);
        const hay = (l.title + " " + l.titleZh + " " + l.tagline + " " +
          l.topics.map((x) => x.name + " " + (x.summaryZh || "")).join(" ")).toLowerCase();
        let groupHit = !q || hay.includes(q);
        // filter sub items
        let anySub = false;
        g.querySelectorAll(".nav-sub").forEach((s) => {
          const hit = !q || s.textContent.toLowerCase().includes(q) || l.title.toLowerCase().includes(q);
          s.style.display = hit ? "" : "none";
          if (hit) anySub = true;
        });
        g.style.display = (groupHit || anySub) ? "" : "none";
        if (q && (groupHit || anySub)) g.classList.add("open");
      });
    });
  }

  /* ---------- mobile sidebar ---------- */
  function openSidebar() { $("sidebar").classList.add("open"); $("backdrop").classList.add("show"); }
  function closeSidebarMobile() { $("sidebar").classList.remove("open"); $("backdrop").classList.remove("show"); }

  /* ---------- boot ---------- */
  function boot() {
    if (!location.hash) location.replace("#" + L[0].slug);
    renderSidebar();
    renderContent();
    updateProgress();
    setupSearch();

    window.addEventListener("hashchange", () => {
      updateSidebarActive();
      renderContent();
    });

    const st = $("sidebarToggle");
    if (st) st.addEventListener("click", openSidebar);
    const bd = $("backdrop");
    if (bd) bd.addEventListener("click", closeSidebarMobile);

    $("resetProgress").addEventListener("click", () => {
      done = new Set(); saveProgress(); updateProgress(); updateSidebarActive();
      const b = $("completeBtn");
      if (b) { b.classList.remove("done"); b.querySelector("span").textContent = t("Mark as complete", "标记为已完成"); }
    });

    // reading progress bar
    const rp = $("readProgress");
    function updateRead() {
      if (!rp) return;
      const st = window.scrollY || document.documentElement.scrollTop || 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      rp.style.width = (max > 0 ? Math.min(100, (st / max) * 100) : 0) + "%";
    }
    window.addEventListener("scroll", updateRead, { passive: true });
    window.addEventListener("resize", updateRead);
    updateRead();

    // keyboard navigation: ←/→ between lectures, "/" focuses search, Esc closes
    document.addEventListener("keydown", (e) => {
      const el = e.target;
      const typing = /^(input|textarea|select)$/i.test(el.tagName) || el.isContentEditable;
      if (e.key === "/" && !typing) { e.preventDefault(); const s = $("search"); if (s) s.focus(); return; }
      if (typing) { if (e.key === "Escape") el.blur(); return; }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const l = lectureBySlug(parseHash().slug);
      const i = L.indexOf(l);
      if (e.key === "ArrowRight" && L[i + 1]) { location.hash = L[i + 1].slug; }
      else if (e.key === "ArrowLeft" && L[i - 1]) { location.hash = L[i - 1].slug; }
      else if (e.key === "Escape") closeSidebarMobile();
    });
    window.__updateRead = updateRead;

    // re-render on language switch
    document.addEventListener("langchange", () => {
      renderSidebar();
      renderContent();
      // restore search placeholder
      const s = $("search");
      if (s) s.placeholder = s.getAttribute(window.CME.getLang() === "zh" ? "data-zh-ph" : "data-en-ph") || s.placeholder;
    });

    // initial placeholder by lang
    const s = $("search");
    if (s) s.placeholder = s.getAttribute(window.CME.getLang() === "zh" ? "data-zh-ph" : "data-en-ph") || s.placeholder;
  }

  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
