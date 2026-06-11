# Developer & Agent Guidelines

This file provides guidance to coding agents (Claude Code, Codex CLI, etc.) and the developer when working with this repository.

## Project Overview

**javi.io** is Javier Zapata's personal website — portfolio, blog, CV, and work history. It is a fully static site with no backend or database.

- Stack: **Astro 6**, **Tailwind CSS v4**, **TypeScript**, **pnpm**
- Deployed to **GitHub Pages** via `pnpm deploy` (`gh-pages`)
- Bilingual: Spanish (default, no URL prefix) and English (`/en/`)

## Local Dev Environment

The project uses `direnv` with a `.envrc` that sets `SHARP_IGNORE_GLOBAL_LIBVIPS=1` (prevents sharp from compiling against Homebrew's libvips). Run `direnv allow` when:

- Entering the project folder for the first time
- Entering any new worktree (each worktree requires its own `direnv allow`)

## Commands

```bash
pnpm dev              # dev server at localhost:4321
pnpm build            # astro check + full production build
pnpm preview          # serve the built output
pnpm lint             # ESLint
pnpm lint:fix         # ESLint with auto-fix
pnpm astro check      # TypeScript / Astro type-checking only (faster than full build)
pnpm generate:cv      # generate CV PDF + DOCX from src/cv/
pnpm deploy           # build + push dist/ to GitHub Pages
```

**Validation before any push:** `pnpm lint && pnpm build` — `pnpm build` runs `astro check` internally, so a passing build means types are clean too.

## Content Architecture

### Collections

| Collection                    | Path                                | Format         |
| ----------------------------- | ----------------------------------- | -------------- |
| `blog-es` / `blog-en`         | `src/content/blog-{es,en}/`         | `.md` / `.mdx` |
| `work-es` / `work-en`         | `src/content/work-{es,en}/`         | `.md`          |
| `projects-es` / `projects-en` | `src/content/projects-{es,en}/`     | `.md` / `.mdx` |
| `education`                   | `src/content/education/public.json` | JSON array     |

Schema is enforced via Zod in `src/content.config.ts`.

### Bilingual content rule

Every blog post, project, and work entry **must** exist in both `*-es` and `*-en`.

- `blog` and `projects`: link with a shared `translationKey` in frontmatter — this is how the language switcher finds the paired page.
- `work`: matched by filename — no `translationKey` needed, just keep filenames identical across `-es` and `-en`.

```yaml
# blog-es/hola-mundo.md
translationKey: "hello-world"

# blog-en/hello-world.md
translationKey: "hello-world"
```

### Visibility flags

Both `work` and `education` entries support `include: { cv: bool, web: bool }` to control where they appear. Defaults are `true` for both. Use these to hide entries from the website without removing them from the CV, or vice versa.

### Projects frontmatter

Required: `title`, `description`, `date`, `type` (`"personal"` | `"professional"`).
Optional: `demoURL`, `repoURL`, `translationKey`, `hero` (image).

### CV generation

The CV is built from TypeScript source in `src/cv/sections.ts` and rendered as a web page at `/cv`. The `pnpm generate:cv` command produces `public/cv/javier-zapata-{lang}-{hash}.pdf/.docx` (e.g. `javier-zapata-es-a3f2c1.pdf`) via Playwright + docx. Run this whenever `src/cv/` changes.

## i18n Routing

- Default locale: `es` — no URL prefix (`/blog/`, `/work/`, `/projects/`)
- English: prefix `/en/` (`/en/blog/`, `/en/work/`, `/en/projects/`)
- Configured in `astro.config.mjs` with `prefixDefaultLocale: false`
- Page components live in `src/pages/` (ES) and `src/pages/en/` (EN)

## Git Workflow

> **HARD STOP — before touching any file:** confirm a worktree is active (not `master`). If on `master`, create a worktree first. No exceptions.

- Worktrees go in `.worktrees/<branch-name>` (not as siblings to the repo)
- Squash-merge PRs by default
- Check `git status` before and after changes to avoid unintended files in commits
- `pnpm-lock.yaml` churn from platform-specific native bindings is not intentional — do not commit it

## Validation Checklist

Before pushing any change:

- [ ] `pnpm lint` passes
- [ ] `pnpm build` passes (includes `astro check`)
- [ ] If `src/cv/` changed: `pnpm generate:cv` run and output committed
- [ ] Only intentional files changed (no `pnpm-lock.yaml` platform churn)

## Definition of Done

A task is complete only when **all** of the following are true:

- [ ] Worktree confirmed active (not on `master`) before any file was touched
- [ ] `pnpm lint && pnpm build` passes
- [ ] Bilingual: any new content exists in both `*-es` and `*-en` with a matching `translationKey`
- [ ] CV output regenerated if `src/cv/` was touched
- [ ] Only intentional files changed

## Bug Investigation

Limit exploration to ~3–5 file reads before either fixing or asking a targeted question. Don't read speculatively — form a hypothesis first, then verify.

## Project Layout

```
src/
  components/       # Astro components
  content/          # Content collections (blog, work, projects, education)
  cv/               # CV data (sections.ts) and page
  layouts/          # PageLayout.astro
  pages/            # ES pages (default locale) + en/ subfolder for EN
  styles/           # global.css (Tailwind entry point)
  consts.ts         # Site metadata, section metadata, author bio, socials
  content.config.ts # Collection schemas (Zod)
  types.ts          # Shared TypeScript types
scripts/            # CV generation scripts (Playwright PDF, docx)
public/             # Static assets, CNAME, cv/ output
```
