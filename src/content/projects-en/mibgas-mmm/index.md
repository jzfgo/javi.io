---
title: "Market Maker Monitoring"
description: "Internal MIBGAS system to automate regulatory oversight of Market Makers in Spain's organised natural gas market — from market data ingestion to compliance report generation."
date: 2024-01-01
type: "professional"
translationKey: "mibgas-mmm"
---

**MIBGAS** operates the organised natural gas market in Spain and is subject to official regulation requiring continuous monitoring of Market Makers operating on its platform. **MMM (Market Maker Monitoring)** is the internal system that automates this oversight — from market data ingestion to regulatory compliance report generation.

As **Tech Lead / Software Architect**, I designed the microservices architecture, implemented the backend service (BFF), defined gRPC inter-service communication and REST backend-to-frontend communication, and made the key technology decisions for the project. Team of 2–3 engineers over approximately one year.

## Architecture

Turborepo monorepo with 6 applications deployed on **Google Cloud Platform**:

- **Frontend** (Next.js 15 / React 19): operator interface for market data visualisation, manual collection triggers, and report downloads.
- **Backend BFF** (NestJS / PostgreSQL): REST API with JWT. Single entry point for the frontend — microservices are never exposed directly.
- **Collection Service** (NestJS / gRPC / SOAP): daily ingestion of order books, offers, and trades from MIBGAS's external SOAP API. Triggered by Cloud Scheduler or manually from the frontend.
- **Compliance Service** (NestJS / gRPC / stateless): compliance algorithm built from scratch, implementing the official Spanish regulatory standard.
- **Reporting Service** (NestJS / gRPC / stateless): PDF generation (Puppeteer + Handlebars), Excel (ExcelJS), GCS storage, and email delivery (SendGrid).
- **Backtesting** (React / Vite / standalone): internal tool to validate compliance algorithm changes by comparing CSV datasets using statistical metrics (MAE, RMSE, MAPE).

## Key technical decisions

- **gRPC unary** for all inter-service communication. Pub/Sub was evaluated but discarded due to resource constraints; gRPC proved sufficient for the data volume and simplified the stack.
- **BFF pattern**: the frontend never calls microservices directly. Next.js API routes act as a secure proxy, centralising authentication and authorisation.
- **Stateless compliance and reporting services**: no database in these services; all persistence delegated to the backend, simplifying deployment and scaling.
- **Static mutexes** to prevent duplicate concurrent compliance calculations for the same period.
- Standard PostgreSQL (TimescaleDB evaluated and discarded).

## Outcome

System in production monitoring ~10 Market Makers, with automated generation of regulatory compliance reports per Spanish regulation.
