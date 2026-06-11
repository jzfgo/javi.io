---
title: "agents"
description: "Skills agénticas para flujos de trabajo de desarrollo profesional — 1:1s estructurados, revisiones con contexto de git y seguimiento de acciones. Compatible con Claude Code, Cursor, Codex y más."
date: 2026-05-30
type: "personal"
repoURL: "https://github.com/jzfgo/agents"
demoURL: "https://www.skills.sh/jzfgo/agents"
translationKey: "agents"
---

Skills de IA personal de Javier Zapata, conformes con el [estándar abierto AgentSkills](https://agentskills.io). Compatible con cualquier harness de agentes que implemente el estándar.

## Skills

| Skill | Descripción |
|-------|-------------|
| [1on1](https://github.com/jzfgo/agents/blob/main/skills/1on1/SKILL.md) | Check-ins profesionales 1:1 estructurados — revisa cómo tú y tu agente de IA habéis estado trabajando juntos |

## Instalación

Los skills son autodescubiertos por cualquier harness [compatible con AgentSkills](https://agentskills.io). Para los que requieren instalación explícita:

| Harness | Instalar |
|---------|---------|
| **Claude Code** | `claude mcp add javito-skills@git+https://github.com/jzfgo/agents.git` |
| **OpenCode** | Añadir `"plugin": ["javito-skills@git+https://github.com/jzfgo/agents.git"]` a `opencode.json` |
| **Gemini CLI** | Añadir entradas `@./skills/<name>/SKILL.md` a `GEMINI.md` |
| **Pi** | Autodescubierto vía symlinks `.agents/skills/` |
| **Codex** | Autodescubierto vía `.codex-plugin/plugin.json` |
| **Cursor** | Autodescubierto vía `.cursor-plugin/plugin.json` |
