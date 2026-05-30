# CME 295 · Transformers & Large Language Models — Learn Hub

A self-paced, beautifully designed learning website for **Stanford CME 295: Transformers & Large Language Models** (Autumn 2025). It reorganizes the public course material into a clean study experience: the original lecture videos, distilled notes, key formulas, and takeaways across all nine lectures.

> An independent, open, educational study companion. Not affiliated with or endorsed by Stanford. All lecture videos belong to their respective owners.

## ✨ Features

- **9 lectures, one continuous arc** — from word embeddings & attention to RLHF, reasoning (GRPO) and agents.
- **Embedded lecture videos** straight from the official YouTube playlist.
- **Distilled notes + LaTeX formulas** rendered with MathJax.
- **Progress tracking** saved locally in your browser.
- **Bilingual UI** — English / 中文 toggle.
- **Light & dark themes**, responsive layout, search, and keyboard-friendly navigation.
- **Zero build step** — plain HTML/CSS/JS, deploys anywhere static.

## 🗂 Structure

```
index.html        Landing page (hero, outcomes, curriculum, resources)
learn.html        Learning interface (sidebar, video, notes, formulas)
css/main.css      Design system + components
js/data.js        All course content (single source of truth)
js/common.js      Shared: theme, i18n, nav, reveal animations
js/main.js        Landing-page rendering
js/learn.js       Learning app (routing, progress, search, MathJax)
```

## 🚀 Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## 📦 Deployment (GitHub Pages)

The site is plain static files at the repo root, so the simplest publish path
is **Deploy from a branch** — no build step, no workflow needed:

1. **(Free plan only)** Make the repo public: **Settings → General → Danger Zone
   → Change visibility → Public**. GitHub Pages is free for public repos; private
   repos need GitHub Pro/Team/Enterprise.
2. **Settings → Pages → Build and deployment → Source: _Deploy from a branch_.**
3. Choose branch **`claude/upbeat-clarke-dHMeR`** and folder **`/ (root)`**, then **Save**.
4. Wait ~1 minute. The site goes live at:

   **https://jliu17456-ai.github.io/stanford-cme295-llm/**

That's it — every future push to the branch republishes automatically.

## 📚 Official resources

- [Course site](https://cme295.stanford.edu) · [Syllabus](https://cme295.stanford.edu/syllabus/) · [Cheatsheet](https://cme295.stanford.edu/cheatsheet/)
- [Lecture playlist (YouTube)](https://www.youtube.com/playlist?list=PLoROMvodv4rOCXd21gf0CF4xr35yINeOy)
- [Official GitHub repo](https://github.com/afshinea/stanford-cme-295-transformers-large-language-models) · [Super Study Guide](https://superstudy.guide)

Lectures by **Afshine Amidi** and **Shervine Amidi**.
