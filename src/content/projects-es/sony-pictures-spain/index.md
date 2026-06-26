---
title: "Sony Pictures Spain"
description: "Web oficial en España de Sony Pictures Entertainment — migración de infraestructura de GCP a AWS, y mantenimiento y entrega continua de funcionalidades."
date: 2023-01-01
type: "professional"
translationKey: "sony-pictures-spain"
skills:
  - "Amazon Web Services (AWS)"
  - "Blue-Green Deployment"
  - "Google Cloud Platform (GCP)"
  - "Next.js"
  - "PostgreSQL"
  - "React"
  - "Strapi"
  - "TypeScript"
demoURL: "https://sonypictures.es/"
hero: ../../../assets/projects/sony-pictures-spain/hero.webp
---

**Sony Pictures Spain** es el sitio web oficial de **Sony Pictures Entertainment** en España, con información sobre películas, series y contenido de entretenimiento.

Como **Tech Lead** en **Interacso**, me incorporé al proyecto a finales de 2023 para desbloquear la migración de la plataforma desde la infraestructura de Interacso en **Google Cloud Platform** a la de Sony en **Amazon Web Services**.

El obstáculo era la base de datos: el proyecto usaba **SQLite** y AWS exigía un motor compatible con RDS, para lo cual se eligió **PostgreSQL**. El equipo había agotado las herramientas nativas de migración de Strapi y me pidió buscar alternativas.

Tras analizar el problema y buscar soluciones, encontré [pgloader](https://pgloader.io/), una herramienta open source para migración a PostgreSQL. Implementé un script en su DSL que cubría la conversión de tipos (`datetime→timestamp` con normalización de epoch, `integer→serial`, `json→jsonb`), la regeneración de secuencias, índices y claves foráneas, y la limpieza posterior. La migración resultó transparente: Strapi continuó operando sin ningún cambio desde el punto de vista del CMS.

Tras la migración, asumí el mantenimiento y la evolución continua del sitio, colaborando con el PM y el desarrollador frontend para entregar nuevas funcionalidades y correcciones.

## Tecnologías

- **Next.js** y **React** para el frontend.
- **Strapi** como headless CMS.
- **PostgreSQL** como base de datos.
- **Tailwind CSS** para los estilos.
- **TypeScript** en todo el stack.
