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

## 📦 Deployment

Pushed commits are published to **GitHub Pages** automatically via
`.github/workflows/deploy.yml` (the workflow enables Pages on first run).

## 📚 Official resources

- [Course site](https://cme295.stanford.edu) · [Syllabus](https://cme295.stanford.edu/syllabus/) · [Cheatsheet](https://cme295.stanford.edu/cheatsheet/)
- [Lecture playlist (YouTube)](https://www.youtube.com/playlist?list=PLoROMvodv4rOCXd21gf0CF4xr35yINeOy)
- [Official GitHub repo](https://github.com/afshinea/stanford-cme-295-transformers-large-language-models) · [Super Study Guide](https://superstudy.guide)

Lectures by **Afshine Amidi** and **Shervine Amidi**.
