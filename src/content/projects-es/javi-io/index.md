---
title: "javi.io"
description: "Portfolio bilingüe construido con Astro 6: blog, historial de proyectos, CV autogenerado con Playwright y algoritmo de decay temporal para curar el listado de skills."
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

Este sitio. Portfolio, blog, historial laboral y CV en formato de sitio estático completamente versionado.

## Arquitectura

Astro 6 con colecciones de contenido tipadas por Zod: `blog`, `work`, `projects` y `education`, cada una en dos idiomas. El sistema de i18n usa rutas sin prefijo para español (`/blog/`) y prefijo `/en/` para inglés (`/en/blog/`), con `translationKey` para emparejar traducciones en blog y proyectos.

## Algoritmo de skills

El CV incluye una lista curada de skills generada algorítmicamente: cada entrada de trabajo o proyecto declara sus tecnologías y una fecha (última fecha de trabajo en el proyecto). Un algoritmo de decay exponencial con half-life de 3 años acumula un score por skill, filtrando las que no han aparecido en los últimos 5 años y limitando el resultado a las 25 más relevantes.

## Generación de CV

`pnpm generate:cv` genera automáticamente `javier-zapata-{lang}-{hash}.pdf` y `.docx` desde el mismo código TypeScript que renderiza `/cv` en la web. PDF vía Playwright (Chromium headless); DOCX vía la librería `docx`.

## Despliegue

Sitio estático en GitHub Pages via `gh-pages`. CI con GitHub Actions: lint + build en PR, despliegue automático en push a `main`.

## Metodología

Construido y mantenido íntegramente con Claude Code.
