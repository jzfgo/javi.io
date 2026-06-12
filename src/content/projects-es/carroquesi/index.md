---
title: "carroquesi"
description: "Lista de la compra colaborativa con listas compartidas, historial de compras, escaneado de tickets con IA, búsqueda por código de barras y seguimiento de precios por producto."
date: 2026-03-26
type: "personal"
repoURL: "https://github.com/jzfgo/carroquesi"
demoURL: "https://carroquesi.web.app/"
translationKey: "carroquesi"
skills:
  - "Alembic"
  - "Cloud Run"
  - "Docker"
  - "Edge AI"
  - "FastAPI"
  - "Firebase"
  - "Firebase AI"
  - "GCP"
  - "Gemini"
  - "Gemini Nano"
  - "Just"
  - "Neon"
  - "OCR"
  - "Pydantic"
  - "PostgreSQL"
  - "SQLite"
  - "Python"
  - "React"
  - "Spec Driven Development"
  - "TDD"
  - "TypeScript"
  - "UV"
  - "Vite"
---

_Juntos compramos mejor_

Una lista de la compra colaborativa. Varios usuarios comparten listas, marcan artículos como comprados y reciben sugerencias inteligentes de productos basadas en el historial de compras. Incluye registro de precios con historial por producto, búsqueda por código de barras, escaneo de tickets con IA y totales de coste acumulados por sesión de compra.

## Arquitectura

```
carroquesi/
├── frontend/   # React + TypeScript (Vite) → Firebase Hosting
└── backend/    # Python + FastAPI + PostgreSQL → Cloud Run
```

- **Auth e IA:** Firebase gestiona el inicio de sesión con Google y el análisis de tickets con IA (Gemini vía Firebase AI SDK). El frontend envía un token de Firebase ID en cada petición; el backend lo valida mediante el Firebase Admin SDK.
- **Datos:** Todo el CRUD pasa por el backend FastAPI. Sin Firestore.
- **Sincronización en tiempo real:** Short-polling — el frontend llama a `GET /lists/{id}/updated-at` cada 5s y recarga los artículos cuando cambia el timestamp.

## Despliegue

| Capa     | Destino                   |
| -------- | ------------------------- |
| Frontend | Firebase Hosting          |
| Backend  | Google Cloud Run (Docker) |

La imagen Docker del backend ejecuta `alembic upgrade head` al arrancar antes de lanzar el servidor.
