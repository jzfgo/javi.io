---
title: "Fly-Fut Ligas"
description: "Plataforma de fútbol de consumo con producción de vídeo en la nube y aplicación móvil."
date: 2022-09-01
type: "professional"
translationKey: "fly-fut-ligas"
skills:
  - "App Engine"
  - "Apple In-App Purchases"
  - "Cloud Build"
  - "DDD"
  - "Firebase"
  - "Google Cloud Platform (GCP)"
  - "NestJS"
  - "Node.js"
  - "OpenAPI"
  - "PostgreSQL"
  - "RBAC"
  - "REST API Design"
  - "Stripe"
  - "TypeORM"
  - "TypeScript"
hero: ../../../assets/projects/fly-fut-ligas/hero.png
---

**Fly-Fut Ligas** es el producto de consumo de la empresa. Permite a equipos de fútbol aficionado tener sus partidos grabados y producidos profesionalmente con drones, y ver y compartir los momentos destacados a través de una aplicación móvil.

La plataforma está compuesta por una aplicación móvil orientada al consumidor, un pipeline de producción de vídeo en la nube, y herramientas internas de administración y gestión.

## Arquitectura e Implementación

Como **Arquitecto de Sistemas** y **Desarrollador Backend**, diseñé y desarrollé en solitario toda la infraestructura backend de la plataforma.

Aspectos clave de la implementación:

- API REST modular en **NestJS** con tres scopes diferenciados (app móvil, backoffice y servicios internos), autenticación por **Firebase Auth** y control de acceso por roles (**RBAC**) con árbol jerárquico de permisos.
- Modelado de dominio completo con **PostgreSQL** y **TypeORM** (85 entidades, 175 migraciones), siguiendo principios de **DDD** con interfaces documentadas en **OpenAPI**.
- Integración dual de pagos y suscripciones: **Stripe** (Android) y **Apple In-App Purchases** (iOS), con webhooks, reconciliación de estados y gestión de expiración automatizada.
- Pipeline de vídeo en **Google Cloud Platform** que automatiza la grabación, procesamiento y publicación, orquestado por 22 tareas programadas en **App Engine Cron**.
- Tres entornos completamente aislados (dev/staging/producción) con CI/CD en **Cloud Build** y gestión de secretos en runtime con **GCP Secret Manager**.

![Aplicación iOS Fly-Fut Ligas](../../../assets/projects/fly-fut-ligas/fly-fut-ligas.png)
