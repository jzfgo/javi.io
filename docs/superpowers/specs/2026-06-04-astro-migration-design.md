# Astro Nano Migration Design

**Date:** 2026-06-04  
**Status:** Approved

## Overview

Migrate javi.io from Gatsby v2 + `@narative/gatsby-theme-novela` to Astro v4 + Astro Nano (`markhorn-dev/astro-nano`). The Gatsby stack requires `NODE_OPTIONS=--openssl-legacy-provider` to build and is based on an unmaintained theme. The new site adds first-class multilingual support (ES + EN) from the start.

---

## Section 1 — Repository & Infrastructure

- New git branch `astro-migration` with a worktree at `.worktrees/astro-migration`
- Base: scaffolded from `markhorn-dev/astro-nano`
- Gatsby code stays untouched on `master` until the new site is ready to ship
- Deployment: manual `npm run deploy` via `gh-pages` package (unchanged)
- `CNAME` (`javi.io`) moves from `static/` to Astro's `public/`
- GTM (`GTM-N7RN8K79`) injected via snippet in Astro Nano's `<BaseHead>` component

---

## Section 2 — i18n Architecture

- Astro built-in i18n: `defaultLocale: "es"`, `locales: ["es", "en"]`, `routing: "prefix-other-locales"`
- URL structure:
  - Spanish (default): `/blog/slug` — no prefix
  - English: `/en/blog/slug`
  - Listings: `/blog` (ES) and `/en/blog` (EN)
- Astro filenames are derived from the live Gatsby slugs, sanitized to remove special characters (`!`, `'`, `()`). Each redirect is a `public/<old-gatsby-slug>/index.html` file with a `<meta http-equiv="refresh">` pointing to the new URL.

| Old Gatsby URL | New Astro URL | Redirect needed? |
|---|---|---|
| `/hola-mundo!` | `/blog/hola-mundo` | yes (`!` removed) |
| `/diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio` | `/blog/diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio` | no (slug identical, only prefix changes) |
| `/servicios-de-pago-ofrecidos-gratuitamente-debido-al-coronavirus-covid-19` | `/blog/servicios-de-pago-ofrecidos-gratuitamente-debido-al-coronavirus-covid-19` | no (slug identical, only prefix changes) |
| `/sudo-en-linux-con-touch-id-(sin-morir-en-el-intento)` | `/blog/sudo-en-linux-con-touch-id-sin-morir-en-el-intento` | yes (`()` removed) |
| `/my-recap-of-scrimba's-javascriptmas` | `/en/blog/my-recap-of-scrimbas-javascriptmas` | yes (`'` removed) |
| `/building-my-first-public-claude-code-skill-the-1on1` | `/en/blog/building-my-first-public-claude-code-skill-the-1on1` | no (slug identical, only prefix changes) |

Note: all posts also need a root→`/blog/` prefix redirect (e.g. `/diez-cosas-...` → `/blog/diez-cosas-...`), since Novela serves at root and Astro Nano serves under `/blog/`.

- Posts with both translations share the same slug across languages (e.g., `es/diez-cosas-...` ↔ `en/diez-cosas-...`)
- Posts not yet translated simply absent from the other language's listing

---

## Section 3 — Content Structure & Migration

### Directory layout

```
src/content/blog-es/
  hola-mundo.md
  diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio.md
  servicios-de-pago-ofrecidos-gratuitamente-debido-al-coronavirus-covid-19.md
  sudo-en-linux-con-touch-id-sin-morir-en-el-intento.md

src/content/blog-en/
  my-recap-of-scrimbas-javascriptmas.md
  building-my-first-public-claude-code-skill-the-1on1.md

public/blog/
  diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio/
    (images)
  hola-mundo/
    (images)
  ...
```

### Frontmatter mapping

| Novela field | Astro Nano field | Notes |
|---|---|---|
| `title` | `title` | unchanged |
| `excerpt` | `description` | renamed |
| `date` | `date` | unchanged |
| `author` | — | dropped (single-author site) |
| `hero` | — | dropped for now |
| `slug` | — | becomes the filename |
| — | `translationKey` | new optional field; posts sharing the same key are treated as translations of each other |

### Content changes per post

- `.mdx` → `.md` (no JSX components used in any post)
- Inline image references: `./images/foo.jpg` → `/blog/slug/foo.jpg` (absolute paths into `public/`)
- Images moved from `content/posts/YYYY-MM-DD-slug/images/` to `public/blog/slug/`

### Initial language assignment

| Astro filename | Language |
|---|---|
| `hola-mundo.md` | `es` |
| `diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio.md` | `es` |
| `servicios-de-pago-ofrecidos-gratuitamente-debido-al-coronavirus-covid-19.md` | `es` |
| `sudo-en-linux-con-touch-id-sin-morir-en-el-intento.md` | `es` |
| `my-recap-of-scrimbas-javascriptmas.md` | `en` |
| `building-my-first-public-claude-code-skill-the-1on1.md` | `en` |

---

## Section 4 — Astro Nano Customizations

Astro Nano used as-is. Only the minimum changes needed for i18n and content to work:

1. **`astro.config.mjs`** — add `i18n` config, `site: "https://javi.io"`, `@astrojs/sitemap` with i18n locales
2. **`src/consts.ts`** — `SITE.title = "Hic sunt dracones"`, `SITE.description = "Divagando."`, social links (LinkedIn, GitHub, Twitter, Instagram)
3. **`src/content/config.ts`** — define two separate collections (`blog-es`, `blog-en`) sharing the same zod schema (`title`, `description`, `date`, `draft?`, `translationKey?`). Separate collections avoid per-query language filtering and map cleanly onto the two locale route files.
4. **Routing** — duplicate Nano's `src/pages/blog/` routes into `src/pages/en/blog/` for the EN locale
5. **Language switcher** — post layout queries the other collection for a matching `translationKey`; renders a link to the translation if found, renders nothing if not. No special handling needed for untranslated posts.
6. **`<BaseHead>`** — add GTM head/body snippet
7. **`public/`** — add `CNAME` and all redirect files per the table in Section 2

No visual, font, or color changes.

---

## Section 5 — Deployment

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "deploy": "gh-pages --dotfiles -d dist"
}
```

- `NODE_OPTIONS=--openssl-legacy-provider` removed entirely
- Astro builds to `dist/` (replaces Gatsby's `public/`)
- `astro-migration` branch can be deployed independently to GitHub Pages for side-by-side review before cutting over `master`

---

## Out of Scope

- Visual customization (colors, fonts, layout) — deferred
- Hero images — deferred
- Language switcher UI component — deferred
- GitHub Actions CI/CD — deferred
- Author page — deferred
