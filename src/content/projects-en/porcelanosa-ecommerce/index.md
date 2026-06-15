---
title: "Porcelanosa Ecommerce"
description: "Global headless ecommerce platform for Porcelanosa — Next.js 15 with Payload CMS as BFF, three production markets, and Google Cloud Run deployment."
date: 2024-10-01
type: "professional"
translationKey: "porcelanosa-ecommerce"
skills:
  - "Adobe Commerce"
  - "Apollo"
  - "BFF Pattern"
  - "Cloud Run"
  - "Docker"
  - "Feature Flags"
  - "GCP"
  - "GraphQL"
  - "i18n"
  - "ISR"
  - "NextAuth"
  - "Next.js"
  - "Node.js"
  - "OAuth"
  - "Payload CMS"
  - "PostgreSQL"
  - "React"
  - "React Query"
  - "React Server Components"
  - "Redis"
  - "Sentry"
  - "SSR"
  - "Tailwind CSS"
  - "Turborepo"
  - "TypeScript"
demoURL: "https://store.porcelanosa.com/"
---

**Porcelanosa** is a Spanish manufacturer of ceramics, kitchen furniture, and bathroom elements, with a presence in over 150 countries.

The project migrated its global ecommerce from **Magento _on-premise_** to a **_headless_** architecture on **Adobe Commerce Cloud**, replacing the existing frontend with a **Next.js 15** platform using **Payload CMS** as BFF. As **Tech Lead** at **Interacso**, I led the 5-person frontend team. The Adobe Commerce backend had its own Tech Lead on the Porcelanosa side.

## BFF Architecture

**Payload CMS** serves as the Backend For Frontend: it manages content owned by the frontend (pages, blog, configuration, feature flags) and holds references to the Adobe Commerce catalog. The catalog itself lives in Adobe. This model decouples the frontend from Adobe Commerce and centralizes authentication, caching, and data transformation at a single entry point.

The Adobe Commerce integration follows a layered model:

```
Frontend → Next.js API routes (proxy) → Payload services → Apollo → Adobe Commerce GraphQL
```

The API routes act as a secure proxy: the frontend never calls Adobe Commerce directly. Authentication and authorization are resolved in the BFF.

## Rendering

**React Server Components** is the default pattern: components are async server components unless they require state or interactivity, where `'use client'` is applied selectively. ISR is the primary rendering strategy, with three revalidation tiers configured via environment variables (10 / 30 / 120 minutes depending on content type). The production cache layer uses **Redis**. Payload includes an admin view to purge the cache without redeploying.

## Multi-market

Three markets in production: **us**, **uk**, and **fr**. Locale detection is handled in the Next.js middleware, with cookie-based persistence and server-side translation via **next-intl**. Each market has its own store code for Adobe Commerce API calls.

## Catalog Sync

I designed the incremental sync architecture from Adobe Commerce REST (**OAuth 1.0a**) to Payload PostgreSQL: timestamp-based delta sync, paginated at 100 items, covering categories, products, and variants. A colleague implemented the first version; I later refactored it.

## Infrastructure

I designed and set up the infrastructure on **Google Cloud Platform**: deployment on **Cloud Run** with Next.js standalone output containerized in **Docker**. Error monitoring via **Sentry**, integrated in both server and client runtimes.

## Technologies

- **Next.js 15** and **React 19** for the frontend.
- **Payload CMS** as BFF and CMS.
- **Adobe Commerce Cloud** as catalog and commerce backend.
- **Apollo Client** for GraphQL queries to Adobe Commerce.
- **TanStack React Query** for client-side state (cart, wishlist, profile).
- **NextAuth** for customer authentication.
- **next-intl** for multi-market internationalization.
- **Tailwind CSS** and a design system based on Shadcn and Radix UI.
- **PostgreSQL** as Payload's database.
- **Redis** as the production cache layer.
- **Google Cloud Platform** — Cloud Run, Docker, Sentry.
- **Turborepo** as the monorepo orchestrator.
