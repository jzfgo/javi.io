---
title: "carroquesi"
description: "Collaborative grocery shopping list with shared lists, purchase history, AI-powered receipt scanning, barcode lookup, and per-item price tracking."
date: 2026-03-26
type: "personal"
repoURL: "https://github.com/jzfgo/carroquesi"
demoURL: "https://carroquesi.web.app/"
translationKey: "carroquesi"
---

*Juntos compramos mejor · Together we shop better*

A collaborative grocery shopping list. Multiple users share lists, mark items as purchased, and get smart product suggestions based on purchase history. Includes price logging with per-item history, barcode lookup, AI-powered receipt scanning, and running cost totals per shopping session.

## Architecture

```
carroquesi/
├── frontend/   # React + TypeScript (Vite) → Firebase Hosting
└── backend/    # Python + FastAPI + PostgreSQL → Cloud Run
```

- **Auth & AI:** Firebase handles Google Sign-In and AI-powered receipt parsing (Gemini via Firebase AI SDK). The frontend sends a Firebase ID token on every request; the backend validates it via the Firebase Admin SDK.
- **Data:** All CRUD goes through the FastAPI backend. No Firestore.
- **Real-time sync:** Short-polling — the frontend hits `GET /lists/{id}/updated-at` every 5s and re-fetches items when the timestamp changes.

## Deployment

| Layer    | Target                    |
| -------- | ------------------------- |
| Frontend | Firebase Hosting          |
| Backend  | Google Cloud Run (Docker) |

The backend Docker image runs `alembic upgrade head` on startup before launching the server.
