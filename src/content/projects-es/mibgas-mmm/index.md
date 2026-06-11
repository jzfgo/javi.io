---
title: "Market Maker Monitoring"
description: "Sistema interno de MIBGAS para automatizar la vigilancia regulatoria de Market Makers en el mercado organizado de gas natural en España — desde la ingesta de datos hasta la generación de informes de cumplimiento normativo."
date: 2024-10-01
type: "professional"
translationKey: "mibgas-mmm"
---

**MIBGAS** opera el mercado organizado de gas natural en España y está sujeta a regulación oficial que exige monitorizar el comportamiento de los Market Makers que operan en su plataforma. El **MMM (Market Maker Monitoring)** es el sistema interno que automatiza esa vigilancia, desde la ingesta de datos de mercado hasta la generación de informes de cumplimiento normativo.

Como **Tech Lead / Arquitecto de Software**, diseñé la arquitectura de microservicios, implementé el servicio backend (BFF), definí la comunicación gRPC entre servicios y REST entre backend y frontend, y tomé las decisiones tecnológicas clave del proyecto. Equipo de 2–3 personas durante aproximadamente un año.

## Arquitectura

Monorepo (Turborepo) con 6 aplicaciones desplegadas en **Google Cloud Platform**:

- **Frontend** (Next.js 15 / React 19): interfaz para operadores con visualización de datos de mercado, inicio manual de la ingesta de datos y descarga de informes.
- **Backend BFF** (NestJS / PostgreSQL): API REST con JWT. Puerta de entrada única del frontend; los microservicios nunca se exponen directamente.
- **Collection Service** (NestJS / gRPC / SOAP): ingesta diaria de libros de órdenes, ofertas y operaciones desde la API externa de MIBGAS vía SOAP. Iniciada por Cloud Scheduler o manualmente desde el frontend.
- **Compliance Service** (NestJS / gRPC / stateless): algoritmo de cumplimiento implementado desde cero siguiendo la normativa regulatoria oficial española.
- **Reporting Service** (NestJS / gRPC / stateless): generación de PDF (Puppeteer + Handlebars), Excel (ExcelJS), almacenamiento en GCS y envío por email (SendGrid).
- **Backtesting** (React / Vite / standalone): herramienta interna para validar cambios en el algoritmo de cumplimiento mediante comparación de datasets CSV con métricas estadísticas (MAE, RMSE, MAPE).

## Decisiones técnicas

- **gRPC unario** para toda la comunicación interservicios. Se evaluó Pub/Sub pero se descartó por limitaciones de recursos; gRPC resultó suficiente para el volumen de datos y simplificó el stack.
- **BFF pattern**: el frontend nunca llama directamente a los microservicios. Las API routes de Next.js actúan como proxy seguro, centralizando autenticación y autorización.
- **Servicios sin estado (stateless) en cumplimiento y reporting**: sin base de datos en estos servicios; toda persistencia delegada al backend, simplificando el despliegue y el escalado.
- **Mutex estáticos** para proteger contra cálculos de cumplimiento concurrentes duplicados sobre el mismo periodo (instancia única de Cloud Run por diseño — suficiente para el volumen de ~10 Market Makers).
- PostgreSQL estándar (TimescaleDB evaluado y descartado).

## Resultado

Sistema en producción monitorizando ~10 Market Makers, con generación automática de informes de cumplimiento normativo según la normativa española.
