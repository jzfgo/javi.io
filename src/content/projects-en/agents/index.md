---
title: "AI Agent Skills"
description: "Personal AI agent skill library with eval-driven development and multi-harness architecture — Claude Code, Codex, Cursor, Google Antigravity, OpenCode, and Pi from a single source."
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

A personal library of AI agent skills. Each skill is compatible with six different coding agent harnesses from a single source, using well-defined interfaces, eval-driven development, and dependency locking.

## Eval-driven development

Every skill ships with two test suites:

- **`evals.json`** — functional tests defining what the skill must produce for a given input
- **`trigger_eval.json`** — trigger tests specifying when the skill should and should not fire

This approach forces precision in the skill description (which drives automatic invocation), prevents regressions as skills evolve, and makes intent explicit and verifiable.

## Multi-harness architecture

The same skill works across Claude Code, Codex, Cursor, Google Antigravity, OpenCode, and Pi. Each harness has a different plugin discovery mechanism — manifests, symlinks, config entries, or `GEMINI.md` references — so the architecture separates skill logic (one `SKILL.md`) from harness adapters (one manifest per ecosystem).

## Skills

### [1on1](https://github.com/jzfgo/agents/blob/main/skills/1on1/SKILL.md)

A structured professional 1:1 between the user and their AI agent. Before the interview begins, the agent silently prepares: reads `git log`, scans the codebase for recent signals, and reviews past action items. Then it conducts a guided interview one question at a time, reflects honestly on its own performance, persists action items back to the agent config file, and delivers a written report.

## Dependency management

`skills-lock.json` tracks external skills installed into the repo — modelled after `package-lock.json` — making the skill environment reproducible and auditable. The collection uses Anthropic's official [Skill Creator](https://github.com/anthropics/skills) skill to build and iterate on its own skills.
