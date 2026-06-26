---
title: "Sony Pictures Spain"
description: "Official Spanish website for Sony Pictures Entertainment — infrastructure migration from GCP to AWS, and ongoing maintenance and feature delivery."
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

**Sony Pictures Spain** is the official **Sony Pictures Entertainment** website in Spain, with information about movies, TV shows, and entertainment content.

As **Tech Lead** at **Interacso**, I joined the project in late 2023 to unblock the platform migration from Interacso's infrastructure on **Google Cloud Platform** to Sony's own infrastructure on **Amazon Web Services**.

The blocker was the database: the project ran on **SQLite** and AWS required an RDS-compatible engine, for which **PostgreSQL** was chosen. The team had exhausted Strapi's native migration tools and asked me to find an alternative.

After analysing the problem and researching solutions, I found [pgloader](https://pgloader.io/), an open-source tool for migrating databases to PostgreSQL. I implemented a script in its DSL covering type conversions (`datetime→timestamp` with epoch normalisation, `integer→serial`, `json→jsonb`), sequence regeneration, indexes and foreign keys, and post-load cleanup. The migration was transparent: Strapi kept running without any change from the CMS's perspective.

After the migration, I took over ongoing maintenance and evolution of the site, working with the PM and frontend developer to deliver new features and bug fixes.

## Technologies

- **Next.js** and **React** for the frontend.
- **Strapi** as the headless CMS.
- **PostgreSQL** as the database.
- **Tailwind CSS** for styling.
- **TypeScript** throughout the stack.
