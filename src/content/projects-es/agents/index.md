---
title: "AI Agent Skills"
description: "Biblioteca personal de skills para agentes de IA, desarrolladas con evals y compatibles con seis harnesses desde una única fuente: Claude Code, Codex, Cursor, Google Antigravity, OpenCode y Pi."
date: 2026-05-30
type: "personal"
repoURL: "https://github.com/jzfgo/agents"
demoURL: "https://www.skills.sh/jzfgo/agents"
translationKey: "agents"
skills:
  - "AI Engineering"
  - "Agentic AI Development"
  - "Claude Code"
  - "Spec Driven Development"
  - "GitHub Actions"
  - "Bash"
---

Mi biblioteca personal de _skills_ para agentes de IA, conforme al estándar abierto [AgentSkills](https://agentskills.io). Empezó con una sola skill y hoy tiene seis, que van desde revisar cómo trabajo con mi agente hasta gestionar registros DNS. Cada skill se escribe una vez y funciona en seis _harnesses_ distintos (el programa que ejecuta al agente): Claude Code, Codex, Cursor, Google Antigravity, OpenCode y Pi.

## Skills

### [1on1](https://github.com/jzfgo/agents/blob/main/skills/1on1/SKILL.md)

Una reunión 1:1 profesional entre tú y tu agente. Antes de la primera pregunta, el agente se prepara sin decir nada: lee el `git log`, revisa el estado del repo y repasa los 1:1 anteriores. Luego conduce la entrevista pregunta a pregunta, hace autocrítica de verdad (no está ahí para darte la razón) y guarda los _action items_ en el fichero de instrucciones que ya exista en el proyecto, `AGENTS.md` o `CLAUDE.md`, sin crear el otro. El informe queda en `.agents/1on1-reviews/`, así que los 1:1 lanzados desde agentes distintos forman un único historial.

### [write-like-me](https://github.com/jzfgo/agents/blob/main/skills/write-like-me/SKILL.md)

Escribe, reescribe y revisa textos con tu propia voz. El modo `init` construye un perfil a partir de un corpus de textos tuyos, y `update` corrige una regla concreta cuando algo no suena a ti, sin rehacer el perfil entero. Cada corrección se añade a una suite de regresión que se puede volver a ejecutar, para que lo arreglado siga arreglado. El perfil vive fuera del repo y no se publica. Castellano e inglés están igual de soportados. Por cierto, esta página la ha redactado esta misma skill.

### [cdmon](https://github.com/jzfgo/agents/blob/main/skills/cdmon/SKILL.md)

Gestiona dominios y registros DNS alojados en cdmon a través de su API: lista los dominios y sus registros, y añade, cambia o borra registros A, CNAME y TXT. Antes de cada escritura enseña un diff y pide confirmación explícita, y después comprueba la propagación con `dig`. AAAA y MX se quedan fuera porque la API no permite escribirlos.

### [babysit-pr](https://github.com/jzfgo/agents/blob/main/skills/babysit-pr/SKILL.md)

Se hace cargo de una PR de GitHub hasta dejarla lista para mergear. Clasifica los comentarios de la revisión, corrige los problemas reales con commits, responde con pruebas a los falsos positivos y arregla la CI cuando está en rojo. Después pide una nueva revisión a `@claude` (la GitHub Action de Claude Code) y repite hasta que la revisión del último commit sale limpia. Nunca mergea.

### [sync-docs](https://github.com/jzfgo/agents/blob/main/skills/sync-docs/SKILL.md)

Audita la documentación de un repo contra su código: ficheros de instrucciones para agentes (`AGENTS.md`, `CLAUDE.md` y los anidados), README y `docs/`. Comprueba cada afirmación verificable en su fuente de verdad, en vez de refrescar la documentación de memoria, y entrega un informe con cada desfase y su prueba. Una vez aprobado el informe, corrige en una rama. Los ficheros generados -como `CHANGELOG.md`- no los toca.

### [statusline](https://github.com/jzfgo/agents/blob/main/skills/statusline/SKILL.md)

Instala o actualiza una barra de estado de dos líneas para Claude Code y Antigravity CLI, y su equivalente nativo en una sola fila para Codex CLI. Muestra el host, la sesión de zmx, el repo, el _worktree_ y la rama, el modelo y su nivel de esfuerzo, el uso de las ventanas de 5 horas y 7 días con la cuenta atrás hasta que se reinician, y el contexto consumido. Antes de escribir nada enseña un plan y pide permiso, y no sobrescribe otra barra de estado sin consentimiento.

## Desarrollo guiado por evals

Cada skill trae dos suites de tests:

- **`evals.json`**: tests funcionales, qué debe producir la skill ante una entrada dada.
- **`trigger_eval.json`**: tests de activación, cuándo debe saltar la skill y, sobre todo, cuándo no.

La `description` de una skill es lo que lee el agente para decidir si la invoca, así que tiene que ser precisa y nombrar también lo que la skill no cubre; de ahí salen los casos negativos. `1on1` y `write-like-me` van un paso más allá, con una suite para `claude plugin eval` en la que cada caso monta su propio repo de partida con un `scaffold.sh` y lo evalúan varios _graders_ (criterios que comprueba un modelo juez).

## Arquitectura multi-harness

Cada harness descubre los plugins a su manera. Claude Code usa un manifiesto por skill y un `marketplace.json`; Codex y Cursor, un manifiesto en la raíz que apunta a `skills/`; Antigravity y Pi, symlinks en `.agents/skills/`; y OpenCode, una entrada en `opencode.json`. Por eso la lógica de cada skill vive en un único `SKILL.md`, y los manifiestos son solo adaptadores.

Lo que generan las skills (informes, configuración por repo) va a `.agents/`, nunca a un directorio de un agente concreto como `.claude/`, porque la siguiente ejecución puede venir de otro agente.

## Créditos

`write-like-me` toma la estructura de tres pasadas, las dimensiones de análisis y las taxonomías de revisión de [sam-dumont/claude-skills](https://github.com/sam-dumont/claude-skills) (MIT). El [NOTICE](https://github.com/jzfgo/agents/blob/main/NOTICE) detalla qué es derivado y qué es propio.
