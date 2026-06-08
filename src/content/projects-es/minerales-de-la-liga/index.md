---
title: "Minerales de LaLiga"
description: "Experiencia interactiva de arte de datos en 3D para Solán de Cabras × LaLiga: generación paramétrica de cristales, visualización en Three.js y pipeline de vídeo."
date: "Jun 01 2024"
type: "professional"
translationKey: "minerales-de-la-liga"
---

**Minerales de LaLiga** es una aplicación web interactiva desarrollada para **Solán de Cabras** y **LaLiga**, orientada a promover los beneficios de los minerales presentes en el agua mineral natural **Solán de Cabras** y su impacto en el rendimiento deportivo.

Basándonos en datos reales de los jugadores de **LaLiga**, diseñamos un sistema capaz de generar representaciones de cristales para todos los equipos de **LaLiga EA Sports** y **LaLiga HyperMotion**. Estos cristales se pueden ver y manipular en **tres dimensiones** dentro de la aplicación web, diseñada con un enfoque _mobile-first_.

Además de explorar y comparar los cristales y los valores que representan, los usuarios podían acceder a un **ranking de jugadores** para cada uno de estos parámetros. La campaña también incluía una promoción que permitía a los usuarios ganar una **camiseta oficial de su equipo favorito** mediante una integración con el CRM de **Solán de Cabras**.

Para optimizar el desarrollo y permitir iteraciones rápidas, creamos varias **herramientas personalizadas**, incluyendo:

- Un **gestor de transformación de datos** que nos permitía ajustar los parámetros de conversión de datos para generar cristales más atractivos visualmente.
- Un **generador de vídeo** para compartir en redes sociales.
- Un **sistema de ajuste en tiempo real** para afinar la apariencia de los cristales directamente desde el **CMS**.

## Tecnologías

- **Streamlit** para la **transformación de datos**.
- **Blender** para la **generación paramétrica** de cristales.
- **Next.js** y **Payload CMS** para la aplicación web.
- **Three.js (React Three Fiber)** para la **visualización 3D** de los cristales.
- **Remotion** para la generación paramétrica de vídeo utilizando **React**.
- Todo el **procesamiento de datos** se implementó en **Python**, mientras que el **desarrollo web** se realizó en **TypeScript**.

## Infraestructura

El despliegue inicial se llevó a cabo utilizando servicios independientes en **Cloud Run**, con **Cloud SQL** como servicio de base de datos y **Cloud Storage** para los recursos multimedia. Más tarde, a petición del cliente, realizamos una **migración de Google Cloud Platform a AWS**, adoptando una arquitectura de contenedores en **EC2, RDS y S3**.

## Mi Rol en el Proyecto

Como **Tech Lead**, fui responsable de liderar al equipo de desarrollo y coordinar la comunicación entre los diferentes equipos involucrados. Además, supervisé la **arquitectura funcional y técnica** de la plataforma, desarrollé la **aplicación web** y el **generador de vídeo**, así como la **migración de la infraestructura en la nube**.
