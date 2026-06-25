---
company: "Fly-Fut"
role: "Tech Lead"
location: "Madrid, Spain"
dateStart: 2021-04-01
dateEnd: 2022-11-01
bullets:
  - "Audited the existing platform before the redesign: documented critical security vulnerabilities, a complete absence of schema versioning, MongoDB misused for a 93%-relational data model, and an API with 50 controllers and 300+ unversioned endpoints — a diagnosis that drove every architectural decision in the replacement system"
  - "Solely designed and built the Fly-Fut Ligas backend: modular NestJS API with three auth scopes and hierarchical RBAC, dual payment system (Stripe + Apple In-App Purchases), PostgreSQL domain model (85 entities, 175 migrations), and three fully isolated environments with CI/CD"
  - "Built the video orchestration pipeline that coordinates ingestion, AI event detection (SoccerNet, YOLOv5), encoding, and publishing of drone footage to the consumer app"
  - "Designed and built the Fly-Fut Pro autonomous drone control iPad App PoC (Vue/Nuxt, Firebase real-time sync)"
skills:
  - "Cloud Architecture"
  - "Full Stack Development"
  - "Software Architecture"
  - "Technology Leadership"
  - "UI Design"
  - "UX Design"
---

Fly-Fut is the first company in the world to protocolize the recording of football with drones, assisted by AI.

## Responsibilities

### Technical Audit

Before starting the design, I conducted a formal audit of the existing platform. The analysis uncovered critical security vulnerabilities, a complete absence of schema versioning, MongoDB being misused for a predominantly relational data model, and an undocumented, unstructured API. This diagnosis drove every architectural decision in the redesign.

### Systems Design

I led the design of the new version of the platform for the company's consumer product (Fly-Fut Ligas), which supported the end-user mobile Apps, a cloud-based video authoring pipeline assisted by AI (SoccerNet, YOLOv5), and several management tools.

Afterwards, I designed an iPad App for recording football training sessions with an autonomous drone, which was the cornerstone of the company's new suite of professional applications (Fly-Fut Pro).

### Development

I developed all the backend infrastructure of the consumer platform, including the video authoring pipeline, the management tools, and the mobile App.

Afterwards, I led the development of a prototype version of the drone control App.

### Management

I also oversaw the development of our suite of internal tools and services and assisted the teams tasked with integrating our backend services.

Some of these tools are: a browser-based video editing software, a fully automated video pipeline that handles intake, encoding and publishing, and an AI pipeline that detects relevant match events from raw video footage.

## Key Projects

- [**Fly-Fut Ligas**](/en/projects/fly-fut-ligas)
- [**Fly-Fut Pro**](/en/projects/fly-fut-pro)
