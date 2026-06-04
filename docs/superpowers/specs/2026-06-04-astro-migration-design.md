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
- All 6 existing posts get a static HTML redirect from their current Gatsby URL to their new Astro Nano URL. Gatsby Novela derives slugs from the post title (or the explicit `slug` frontmatter field where present); exact current URLs must be verified against the live site or Novela's slug logic at implementation time. Each redirect is a `public/<old-slug>/index.html` file with a `<meta http-equiv="refresh">` pointing to the new URL.
- Known explicit slugs in frontmatter: `1password-ssh-agent-touchid-linux` has `slug: sudo en Linux con Touch ID (sin morir en el intento)` and `building-my-first-public-claude-code-skill` has `slug: building-my-first-public-claude-code-skill-the-1on1`
- Posts with both translations share the same slug across languages (e.g., `es/cqha-gym.md` ↔ `en/cqha-gym.md`)
- Posts not yet translated simply absent from the other language's listing

---

## Section 3 — Content Structure & Migration

### Directory layout

```
src/content/blog-es/
  cqha-gym.md
  hola-mundo.md
  coronafreemium.md
  1password-ssh-agent-touchid-linux.md

src/content/blog-en/
  javascriptmas.md
  building-my-first-public-claude-code-skill.md

public/blog/
  cqha-gym/
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

### Content changes per post

- `.mdx` → `.md` (no JSX components used in any post)
- Inline image references: `./images/foo.jpg` → `/blog/slug/foo.jpg` (absolute paths into `public/`)
- Images moved from `content/posts/YYYY-MM-DD-slug/images/` to `public/blog/slug/`

### Initial language assignment

| Post | Language |
|---|---|
| hola-mundo | `es` |
| cqha-gym | `es` |
| coronafreemium | `es` |
| 1password-ssh-agent-touchid-linux | `es` |
| javascriptmas | `en` |
| building-my-first-public-claude-code-skill | `en` |

---

## Section 4 — Astro Nano Customizations

Astro Nano used as-is. Only the minimum changes needed for i18n and content to work:

1. **`astro.config.mjs`** — add `i18n` config, `site: "https://javi.io"`, `@astrojs/sitemap` with i18n locales
2. **`src/consts.ts`** — `SITE.title = "Hic sunt dracones"`, `SITE.description = "Divagando."`, social links (LinkedIn, GitHub, Twitter, Instagram)
3. **`src/content/config.ts`** — define two separate collections (`blog-es`, `blog-en`) sharing the same zod schema (`title`, `description`, `date`, `draft?`). Separate collections avoid per-query language filtering and map cleanly onto the two locale route files.
4. **Routing** — duplicate Nano's `src/pages/blog/` routes into `src/pages/en/blog/` for the EN locale
5. **`<BaseHead>`** — add GTM head/body snippet
6. **`public/`** — add `CNAME`, gym post redirect file

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
