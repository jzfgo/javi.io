---
title: "AI Agent Skills"
description: "Biblioteca personal de skills de agentes IA con desarrollo guiado por evals y arquitectura multi-harness — Claude Code, Codex, Cursor, Google Antigravity, OpenCode y Pi desde una única fuente."
date: 2026-05-30
type: "personal"
repoURL: "https://github.com/jzfgo/agents"
demoURL: "https://www.skills.sh/jzfgo/agents"
translationKey: "agents"
skills:
  - "Agent Skill Engineering"
  - "Agent Eval Engineering"
  - "Claude Code"
  - "Cursor IDE"
  - "Google Antigravity"
  - "OpenAI Codex"
  - "OpenCode"
  - "Pi Coding Agent"
  - "Skill Creator"
---

Una biblioteca personal de skills de agentes IA — cada uno compatible con seis harnesses de agentes de código distintos desde una única fuente. Construida con el mismo rigor de ingeniería que se aplica a sistemas en producción: interfaces bien definidas, desarrollo guiado por evals y bloqueo de dependencias.

## Desarrollo guiado por evals

Cada skill incluye dos suites de tests:

- **`evals.json`** — tests funcionales que definen qué debe producir el skill ante una entrada dada
- **`trigger_eval.json`** — tests de activación que especifican cuándo debe y no debe dispararse el skill

Esto es TDD aplicado al comportamiento de agentes IA. Fuerza precisión en la descripción del skill (que impulsa la invocación automática), previene regresiones a medida que los skills evolucionan y hace la intención explícita. Es la misma disciplina que hace mantenible el código en producción — aplicada a un área donde la mayoría improvisa.

## Arquitectura multi-harness

El mismo skill funciona en Claude Code, Codex, Cursor, Google Antigravity, OpenCode y Pi. Cada harness tiene un mecanismo de descubrimiento de plugins distinto — manifiestos, symlinks, entradas de configuración o referencias en `GEMINI.md` — por lo que la arquitectura separa la lógica del skill (un `SKILL.md`) de los adaptadores de harness (un manifiesto por ecosistema). Se escribe una vez, se despliega en todas partes.

## Skills

### [1on1](https://github.com/jzfgo/agents/blob/main/skills/1on1/SKILL.md)

Una revisión profesional 1:1 estructurada entre el usuario y su agente IA. Antes de que comience la entrevista, el agente se prepara en silencio: lee `git log`, escanea el codebase en busca de señales recientes y revisa los action items anteriores. Luego conduce una entrevista guiada una pregunta a la vez, reflexiona honestamente sobre su propio rendimiento, persiste los action items en el fichero de configuración del agente y entrega un informe escrito.

## Gestión de dependencias

`skills-lock.json` rastrea los skills externos instalados en el repo — modelado sobre `package-lock.json` — haciendo que el entorno de skills sea reproducible y auditable. La colección usa el skill oficial de Anthropic [Skill Creator](https://github.com/anthropics/skills) para construir e iterar sobre sus propios skills.
