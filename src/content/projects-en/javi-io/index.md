---
title: "javi.io"
description: "Bilingual portfolio built with Astro 6: blog, project history, Playwright-generated CV, and a temporal decay algorithm to curate the CV skills list."
date: 2026-03-01
type: "personal"
repoURL: "https://github.com/jzfgo/javi.io"
translationKey: "javi-io"
skills:
  - "Astro"
  - "Claude Code"
  - "GitHub Actions"
  - "GitHub Pages"
  - "Playwright"
  - "TypeScript"
---

This site. Portfolio, blog, work history and CV as a fully version-controlled static site.

## Architecture

Astro 6 with Zod-typed content collections: `blog`, `work`, `projects`, and `education`, each in two languages. The i18n system uses unprefixed routes for Spanish (`/blog/`) and a `/en/` prefix for English (`/en/blog/`), with `translationKey` to pair translations across blog posts and projects.

## Skills algorithm

The CV includes an algorithmically curated skill list: each work or project entry declares its technologies and a date (the last date worked on the project). An exponential decay algorithm with a 3-year half-life accumulates a score per skill, discarding those not used in the last 5 years and capping the output at the 25 most relevant.

## CV generation

`pnpm generate:cv` automatically generates `javier-zapata-{lang}-{hash}.pdf` and `.docx` from the same TypeScript source that renders `/cv` on the web. PDF via Playwright (headless Chromium); DOCX via the `docx` library.

## Deployment

Static site on GitHub Pages via `gh-pages`. CI with GitHub Actions: lint + build on PR, automatic deploy on push to `main`.

## Methodology

Built and maintained entirely with Claude Code.
