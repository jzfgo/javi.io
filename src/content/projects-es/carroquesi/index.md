---
title: "carroquesi"
description: "Lista de la compra colaborativa con PWA offline-first, escaneado de tickets con Gemini, búsqueda por código de barras, precios de comunidad (Open Food Facts) y sugerencias algorítmicas de reposición."
date: 2026-03-26
type: "personal"
repoURL: "https://github.com/jzfgo/carroquesi"
demoURL: "https://carroquesi.web.app/"
translationKey: "carroquesi"
skills:
  - "Architectural Decision Records (ADR)"
  - "Agentic AI Development"
  - "AI Engineering"
  - "Alembic"
  - "Claude Code"
  - "Cloud Run"
  - "Docker"
  - "FastAPI"
  - "Feature Flags"
  - "Firebase"
  - "Google Cloud Platform (GCP)"
  - "GitHub Actions"
  - "LLM Integration"
  - "OCR"
  - "Open Food Facts"
  - "PostgreSQL"
  - "PWA"
  - "Pydantic"
  - "Python"
  - "React"
  - "Spec Driven Development"
  - "TDD"
  - "TypeScript"
  - "uv"
  - "Vite"
---

_Juntos compramos mejor_

Varios usuarios comparten listas, marcan artículos como comprados, escanean tickets con IA, buscan
productos por código de barras y siguen el historial de precios por producto y tienda. Un algoritmo
propio predice cuándo toca reponer cada artículo en función del intervalo mediano de compra del
usuario.

## Stack

| Capa          | Tecnología                                           |
| ------------- | ---------------------------------------------------- |
| Frontend      | React 19 · TypeScript · Vite 8                       |
| Backend       | Python 3.13 · FastAPI · SQLModel                     |
| Base de datos | PostgreSQL (producción) · SQLite (tests y local)     |
| Auth / IA     | Firebase Auth · Gemini 3.5 Flash via Firebase AI SDK |
| Despliegue    | Firebase Hosting · Google Cloud Run · Docker         |

## Arquitectura

```
carroquesi/
├── frontend/   # React + TypeScript (Vite) → Firebase Hosting
└── backend/    # Python + FastAPI + PostgreSQL → Cloud Run
```

- **Auth e IA:** Firebase gestiona el inicio de sesión con Google y el escaneado de tickets
  (Gemini 3.5 Flash via Firebase AI SDK + App Check reCAPTCHA v3). El frontend envía un Firebase
  ID token; el backend lo valida con el Firebase Admin SDK. La API key nunca está expuesta en el
  bundle — App Check emite tokens de corta duración.
- **Datos:** Todo el CRUD pasa por el backend FastAPI. Sin Firestore.
- **Sincronización:** Short-polling — `GET /lists/{id}/updated-at` cada 5 s; recarga la lista
  completa solo si el timestamp cambió. Pausado automáticamente mientras la pestaña está oculta.
- **Offline-first:** Cola de escritura en IndexedDB que se drena al recuperar conexión, resolviendo
  tempId → ID real para operaciones encadenadas (añadir un artículo sin conexión y actualizarlo
  antes de sincronizar funciona correctamente).
- **Feature flags:** Sistema propio de flags por usuario en PostgreSQL. Se gestionan por CLI, se
  evalúan en el backend y se sincronizan al cliente al iniciar sesión, sin redespliegue.

## Funcionalidades

- **Entrada en lenguaje natural:** Mini-DSL con sigils — `+cantidad #marca @tienda |EAN` — con
  soporte de literales entre comillas para nombres compuestos.
- **Inferencia de marca blanca:** ~50 marcas propias españolas (Hacendado, Milbona, Bosque
  Verde…) mapeadas a su supermercado; se sugiere la tienda automáticamente al escribir la marca.
- **Historial de precios normalizado:** Los precios se normalizan a €/kg cuando hay unidades SI
  compatibles, permitiendo comparar registros de formatos distintos en el mismo gráfico.
- **Sugerencias de reposición:** Algoritmo SQL que calcula la ventana `[0,9 × mediana, 1,5 ×
mediana]` del intervalo de compra y solo sugiere artículos dentro de ese rango. Sin ML externo.
- **Escaneado de tickets:** Gemini extrae tienda, fecha, total y líneas (clasificación
  UNIT/KILOGRAM/MULTI). El resultado pasa por un pipeline de dos fases — lookup exacto en mapeos
  aprendidos de confirmaciones previas, luego fuzzy matching — antes de aplicar precios en bloque.
- **Precios de comunidad:** Integración con Open Food Facts y Open Prices API. Caché en PostgreSQL
  con TTL de 7 días y negative cache para no relanzar peticiones fallidas.

## Prácticas de ingeniería

**ADRs:** Cinco Architecture Decision Records en `docs/decisions/` con alternativas evaluadas y
trade-offs aceptados: estrategia de sync, split Firebase-auth/Postgres-data, elección de SQLModel,
integración de IA client-side con App Check y feature flags propios.

**CI/CD:** GitHub Actions con jobs paralelos en PR (typecheck + lint en frontend, pytest en
backend). Despliegues automáticos path-filtered al hacer push a `main`: `frontend/**` despliega a
Firebase Hosting, `backend/**` construye la imagen Docker y la despliega en Cloud Run via Artifact
Registry.

**Tests:** Backend con pytest sobre SQLite in-memory (`StaticPool`) — sin Postgres ni Firebase
emulator en CI. ~2.900 líneas cubriendo todos los routers, el algoritmo de sugerencias, el
pipeline de fuzzy matching, la gestión de feature flags y el bypass de auth para desarrollo local.

**Developer experience:** `overmind` para arrancar ambos servidores, `just` como task runner,
`DEV_AUTH_BYPASS` para evitar Firebase en local, script de seed con 3 usuarios + 4 listas + 128
artículos con historial de precios en 6 tiendas.

## Despliegue

| Capa     | Destino                   |
| -------- | ------------------------- |
| Frontend | Firebase Hosting          |
| Backend  | Google Cloud Run (Docker) |

> Alpha cerrada — los usuarios pueden solicitar acceso a través de la lista de espera; cada
> miembro puede invitar hasta a otras 5 personas.
