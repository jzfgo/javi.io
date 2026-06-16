---
company: "Fly-Fut"
role: "Tech Lead"
location: "Madrid, España"
dateStart: 2021-04-01
dateEnd: 2022-11-01
bullets:
  - "Audité la plataforma existente antes del rediseño: documenté vulnerabilidades de seguridad críticas (credenciales en el repositorio), ausencia total de migraciones de esquema, uso de MongoDB para un modelo 93% relacional y una API con 50 controladores y 300+ endpoints sin versionar — diagnóstico que definió cada decisión arquitectónica del sistema de reemplazo"
  - "Diseñé y construí en solitario el backend de Fly-Fut Ligas: API NestJS modular con tres ámbitos de autenticación y RBAC jerárquico, sistema de pagos dual (Stripe + Apple In-App Purchases), modelo de dominio en PostgreSQL (85 entidades, 175 migraciones) y tres entornos completamente aislados con CI/CD"
  - "Construí el pipeline de orquestación de vídeo que coordina la ingesta, detección de eventos con IA (SoccerNet, YOLOv5), codificación y publicación del metraje de drones a la app de consumo — automatizado con 22 tareas programadas en App Engine Cron"
  - "Diseñé y construí el PoC de la app iPad de control autónomo de drones de Fly-Fut Pro (Vue/Nuxt, sincronización en tiempo real con Firebase)"
skills:
  - "Arquitectura Cloud"
  - "Arquitectura de Software"
  - "Desarrollo Full Stack"
  - "Diseño UI"
  - "Diseño UX"
  - "Liderazgo Técnico"
---

Fly-Fut es la primera empresa del mundo en protocolizar la grabación de fútbol con drones, asistida por IA.

## Responsabilidades

### Auditoría Técnica

Antes de comenzar el diseño, realicé una auditoría formal de la plataforma existente. El análisis reveló vulnerabilidades de seguridad críticas (credenciales alojadas en el repositorio), ausencia total de versionado del esquema de datos, uso inadecuado de MongoDB para un modelo mayoritariamente relacional, y una API sin estructura ni documentación. Este diagnóstico definió cada decisión arquitectónica del rediseño.

### Diseño de Sistemas

Lideré el diseño de la nueva versión de la plataforma para el producto de consumo de la empresa (Fly-Fut Ligas), que daba soporte a las aplicaciones móviles del usuario final, un pipeline de creación de vídeo en la nube asistido por IA (SoccerNet, YOLOv5) y varias herramientas de gestión.

Posteriormente, estuve a cargo del diseño de la nueva suite de aplicaciones profesionales de la compañía (Fly-Fut Pro), que incluye una aplicación para iPad para grabar sesiones de entrenamiento de fútbol con un dron autónomo y una herramienta para el análisis táctico de las sesiones grabadas.

### Desarrollo

Desarrollé toda la infraestructura backend de la plataforma de consumo, incluyendo el pipeline de creación de vídeo, las herramientas de gestión y la aplicación móvil.

Posteriormente, lideré el desarrollo de una versión prototipo de la aplicación de control de drones.

### Gestión

También supervisé el desarrollo de la suite de herramientas y servicios internos y asistí a los equipos encargados de integrar los servicios backend.

Algunas de estas herramientas son: un software de edición de vídeo basado en navegador, un pipeline de vídeo totalmente automatizado que gestiona la ingesta, codificación y publicación, y un pipeline de IA que detecta eventos relevantes del partido a partir de la grabación en bruto.

## Proyectos Clave

- [**Fly-Fut Ligas**](/projects/fly-fut-ligas)
- [**Fly-Fut Pro**](/projects/fly-fut-pro)
