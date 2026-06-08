---
title: "Minerales de LaLiga"
description: "Interactive 3D data art experience for Solán de Cabras × LaLiga — parametric crystal generation, Three.js visualization, and video pipeline."
date: "Jun 01 2024"
type: "professional"
translationKey: "minerales-de-la-liga"
---

**Minerales de LaLiga** is an interactive web application developed for **Solán de Cabras** and **LaLiga**, aimed at promoting the benefits of the minerals present in **Solán de Cabras** natural mineral water and their impact on sports performance.

Based on real data from **LaLiga** players, we designed a system capable of generating crystal representations for all teams in **LaLiga EA Sports** and **LaLiga HyperMotion**. These crystals can be viewed and manipulated in **three dimensions** within the web application, designed with a _mobile-first_ approach.

In addition to exploring and comparing the crystals and the values they represent, users could access a **player ranking** for each of these parameters. The campaign also included a promotion allowing users to win an **official jersey of their favorite team** through an integration with **Solán de Cabras'** CRM.

To optimize development and enable rapid iterations, we created several **custom tools**, including:

- A **data transformation manager** that allowed us to fine-tune data conversion parameters to generate more visually appealing crystals.
- A **video generator** for sharing on social media.
- A **real-time adjustment system** for fine-tuning the crystals' appearance directly from the **CMS**.

## Technologies

- **Streamlit** for **data transformation**.
- **Blender** for the **parametric generation** of crystals.
- **Next.js** and **Payload CMS** for the web application.
- **Three.js (React Three Fiber)** for **3D visualization** of the crystals.
- **Remotion** for parametric video generation using **React**.
- All **data processing** was implemented in **Python**, while **web development** was done in **TypeScript**.

## Infrastructure

The initial deployment was carried out using independent services on **Cloud Run**, with **Cloud SQL** as the database service and **Cloud Storage** for multimedia assets. Later, at the client's request, we performed a **migration from Google Cloud Platform to AWS**, adopting a containerized architecture on **EC2, RDS, and S3**.

## My Role in the Project

As the **Tech Lead**, I was responsible for leading the development team and coordinating communication between the different teams involved. Additionally, I oversaw the **functional and technical architecture**, the development of the **web application** and **video generator**, as well as the **cloud infrastructure migration**.
