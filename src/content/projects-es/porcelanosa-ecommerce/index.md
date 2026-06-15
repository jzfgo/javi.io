---
title: "Porcelanosa Ecommerce"
description: "Plataforma headless de ecommerce global para Porcelanosa — Next.js 15 con Payload CMS como BFF, tres markets en producción y despliegue en Google Cloud Run."
date: 2025-12-01
type: "professional"
translationKey: "porcelanosa-ecommerce"
skills:
  - "Adobe Commerce"
  - "Apollo"
  - "BFF Pattern"
  - "Cloud Run"
  - "Docker"
  - "Feature Flags"
  - "Google Cloud Platform (GCP)"
  - "GraphQL"
  - "NextAuth"
  - "Next.js"
  - "Node.js"
  - "OAuth"
  - "Payload CMS"
  - "PostgreSQL"
  - "React"
  - "Redis"
  - "Sentry"
  - "Monorepo"
  - "TypeScript"
demoURL: "https://store.porcelanosa.com/"
---

**Porcelanosa** es una empresa española fabricante de cerámica, mobiliario de cocina y elementos de baño, con presencia en más de 150 países.

El proyecto migró su ecommerce global de **Magento _on-premise_** a una arquitectura **_headless_** sobre **Adobe Commerce Cloud**, sustituyendo el frontend existente por una plataforma en **Next.js 15** con **Payload CMS** como BFF. Como **Tech Lead** en **Interacso**, lideré el equipo de frontend de 5 personas. El backend de Adobe Commerce tenía su propio Tech Lead en el lado de Porcelanosa.

## Arquitectura BFF

**Payload CMS** actúa como Backend For Frontend: gestiona el contenido responsabilidad del frontend (páginas, blog, configuración, feature flags) y mantiene referencias al catálogo de Adobe Commerce. El catálogo en sí vive en Adobe. Este modelo desacopla el frontend de Adobe Commerce y centraliza la autenticación, la caché y la transformación de datos en un único punto de entrada.

La integración con Adobe Commerce sigue un modelo en capas:

```
Frontend → API routes de Next.js (proxy) → Payload services → Apollo → Adobe Commerce GraphQL
```

Las API routes actúan como proxy seguro: el frontend nunca llama directamente a Adobe Commerce. La autenticación y la autorización se resuelven en el BFF.

## Rendering

**React Server Components** es el patrón por defecto: los componentes son async server components salvo que necesiten estado o interactividad, donde se aplica `'use client'` de forma selectiva. ISR es la estrategia de rendering principal, con tres niveles de revalidación configurables vía variables de entorno (10 / 30 / 120 minutos según el tipo de contenido). La capa de caché en producción usa **Redis**. Payload incluye una vista de administración para purgar caché sin redespliegue.

## Multi-market

Tres markets en producción: **us**, **uk** y **fr**. La detección de locale se resuelve en el middleware de Next.js, con persistencia en cookie y traducción server-side vía **next-intl**. Cada market tiene su propio store code para las llamadas a Adobe Commerce.

## Sincronización de catálogo

Diseñé la arquitectura de sincronización incremental desde Adobe Commerce REST (autenticación **OAuth 1.0a**) hacia Payload PostgreSQL: delta sync basado en timestamps, paginado a 100 elementos, con soporte para categorías, productos y variantes. Un compañero implementó la primera versión; posteriormente la refactoricé.

## Infraestructura

Diseñé y monté la infraestructura en **Google Cloud Platform**: despliegue en **Cloud Run** con output standalone de Next.js contenerizado en **Docker**. Monitorización de errores con **Sentry** integrado en los runtimes de servidor y cliente.

## Tecnologías

- **Next.js 15** y **React 19** para el frontend.
- **Payload CMS** como BFF y CMS.
- **Adobe Commerce Cloud** como backend de catálogo y comercio.
- **Apollo Client** para queries GraphQL a Adobe Commerce.
- **TanStack React Query** para el estado cliente (carrito, wishlist, perfil).
- **NextAuth** para la autenticación de clientes.
- **next-intl** para internacionalización multi-market.
- **Tailwind CSS** y design system basado en Shadcn y Radix UI.
- **PostgreSQL** como base de datos de Payload.
- **Redis** como capa de caché en producción.
- **Google Cloud Platform** — Cloud Run, Docker, Sentry.
- **Turborepo** como orquestador del monorepo.
