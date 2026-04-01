# Aleksander Dudek — Portfolio

A single-file static portfolio built with pure HTML, CSS, and JavaScript — no framework, no build step.

## Features

- Animated neural-mesh canvas background
- Glitch effect on the hero name
- Typing animation cycling through tech skills
- Animated counters for stats
- Cards scroll in with stagger on IntersectionObserver
- 3-D tilt effect on project cards (mousemove)
- Scanline animation on code blocks
- Full syntax highlighting via CSS spans
- Live demo links, Storybook, GraphQL playground links

## Deploy to GitHub Pages

### Option A — User/Org site (recommended)

1. Create a repo named **`AleksanderDudek.github.io`**
2. Push this folder's contents to the `main` branch
3. The site will appear at **`https://aleksanderdudek.github.io/`**

```bash
git init
git remote add origin git@github.com:AleksanderDudek/AleksanderDudek.github.io.git
git add .
git commit -m "feat: portfolio site"
git push -u origin main
```

GitHub Pages is enabled automatically for `*.github.io` repos — no settings change needed.

### Option B — Project repo

1. Create any repo (e.g. `portfolio`)
2. Push contents to `main`
3. Go to **Settings → Pages → Source → GitHub Actions**
4. The workflow at `.github/workflows/deploy.yml` handles the rest
5. Site lives at `https://aleksanderdudek.github.io/portfolio/`

## Local preview

```bash
# Any static file server works — Python ships with one:
python3 -m http.server 8080 --directory .
# open http://localhost:8080
```
