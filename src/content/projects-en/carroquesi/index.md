---
title: "carroquesi"
description: "Collaborative grocery shopping PWA with offline-first write queue, Gemini-powered receipt scanning, barcode lookup, community prices via Open Food Facts, and algorithmic restocking suggestions."
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
  - "REST API Design"
  - "Pydantic"
  - "Python"
  - "React"
  - "Spec Driven Development"
  - "TDD"
  - "TypeScript"
  - "uv"
  - "Vite"
---

_Together we shop better_

Multiple users share lists, mark items as purchased, scan receipts with AI, look up products by
barcode, and track per-item price history across stores. A built-in algorithm predicts when each
item needs restocking based on the user's median purchase interval.

## Stack

| Layer      | Technology                                           |
| ---------- | ---------------------------------------------------- |
| Frontend   | React 19 · TypeScript · Vite 8                       |
| Backend    | Python 3.13 · FastAPI · SQLModel                     |
| Database   | PostgreSQL (production) · SQLite (tests & local)     |
| Auth / AI  | Firebase Auth · Gemini 3.5 Flash via Firebase AI SDK |
| Deployment | Firebase Hosting · Google Cloud Run · Docker         |

## Architecture

```
carroquesi/
├── frontend/   # React + TypeScript (Vite) → Firebase Hosting
└── backend/    # Python + FastAPI + PostgreSQL → Cloud Run
```

- **Auth & AI:** Firebase handles Google Sign-In and receipt scanning (Gemini 3.5 Flash via
  Firebase AI SDK + App Check reCAPTCHA v3). The frontend sends a Firebase ID token; the backend
  validates it via the Firebase Admin SDK. The API key is never exposed in the bundle — App Check
  issues short-lived tokens instead.
- **Data:** All CRUD goes through the FastAPI backend. No Firestore.
- **Real-time sync:** Short-polling — `GET /lists/{id}/updated-at` every 5 s; re-fetches items
  only when the timestamp changes. Paused automatically while the tab is hidden.
- **Offline-first:** An IndexedDB write queue drains on reconnect, resolving tempId → real server
  ID for chained operations (adding an item offline then updating it before sync works correctly).
- **Feature flags:** A custom per-user flag system stored in PostgreSQL. Flags are toggled via
  CLI, evaluated server-side, and synced to the client at login — no redeploy needed.

## Features

- **Natural language input:** Mini-DSL with sigils — `+quantity #brand @store |EAN` — with
  quoted-literal support for compound names.
- **Own-brand inference:** ~50 Spanish private-label brands (Hacendado, Milbona, Bosque
  Verde…) mapped to their parent supermarket; the store is suggested automatically when the
  brand is typed.
- **Normalised price history:** Prices are normalised to €/kg when SI quantities are available,
  enabling cross-format comparison in the same chart.
- **Restocking suggestions:** A SQL algorithm computes the window `[0.9 × median, 1.5 × median]`
  of each item's purchase interval and only surfaces items currently in range. No external ML.
- **Receipt scanning:** Gemini extracts store, date, total, and line items (UNIT/KILOGRAM/MULTI
  classification). The result passes through a two-phase pipeline — exact lookup against learned
  store × product-name mappings, then fuzzy matching — before bulk-applying prices.
- **Community prices:** Integration with Open Food Facts and the Open Prices API. Cached in
  PostgreSQL with a 7-day TTL and negative caching to avoid redundant failed lookups.

## Engineering practices

**ADRs:** Five Architecture Decision Records in `docs/decisions/` covering key decisions with
evaluated alternatives and accepted trade-offs: sync strategy, Firebase-auth/Postgres-data split,
SQLModel choice, client-side AI integration with App Check, and custom feature flags.

**CI/CD:** GitHub Actions with parallel PR jobs (typecheck + lint for frontend, pytest for
backend). Path-filtered automatic deploys on push to `main`: `frontend/**` deploys to Firebase
Hosting, `backend/**` builds the Docker image and deploys to Cloud Run via Artifact Registry.

**Tests:** Backend pytest runs on SQLite in-memory (`StaticPool`) — no Postgres or Firebase
emulator needed in CI. ~2,900 lines covering all routers, the suggestions algorithm, the
fuzzy-matching pipeline, feature flag management, and the local dev auth bypass.

**Developer experience:** `overmind` to start both servers, `just` as the task runner,
`DEV_AUTH_BYPASS` to skip Firebase locally, and a seed script with 3 users, 4 lists, 128 items
and price history across 6 stores.

## Deployment

| Layer    | Target                    |
| -------- | ------------------------- |
| Frontend | Firebase Hosting          |
| Backend  | Google Cloud Run (Docker) |

> Closed alpha — users can request access via the waitlist; each member can invite up to 5 others.
