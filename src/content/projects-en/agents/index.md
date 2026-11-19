---
title: "AI Agent Skills"
description: "Personal library of AI agent skills, built with evals and compatible with six harnesses from a single source: Claude Code, Codex, Cursor, Google Antigravity, OpenCode, and Pi."
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

My personal library of AI agent skills, following the open [AgentSkills](https://agentskills.io) standard. It started with a single skill and now has six, ranging from reviewing how I work with my agent to managing DNS records. Each skill is written once and works across six different harnesses (the program that runs the agent): Claude Code, Codex, Cursor, Google Antigravity, OpenCode, and Pi.

## Skills

### [1on1](https://github.com/jzfgo/agents/blob/main/skills/1on1/SKILL.md)

A professional 1:1 between you and your agent. Before the first question, the agent prepares silently: it reads `git log`, checks the state of the repo, and goes over past 1:1s. Then it runs the interview one question at a time, reflects honestly on its own work (it isn't there to agree with you), and saves the action items to whichever instructions file the project already has, `AGENTS.md` or `CLAUDE.md`, without creating the other one. The report goes to `.agents/1on1-reviews/`, so 1:1s run from different agents build a single history.

### [write-like-me](https://github.com/jzfgo/agents/blob/main/skills/write-like-me/SKILL.md)

Writes, rewrites, and reviews text in your own voice. The `init` mode builds a profile from a corpus of your own writing, and `update` fixes one specific rule when something doesn't sound like you, without rebuilding the whole profile. Every fix is added to a re-runnable regression suite, so what was fixed stays fixed. The profile lives outside the repo and is never published. Spanish and English are equally supported. By the way, this page was written with this very skill.

### [cdmon](https://github.com/jzfgo/agents/blob/main/skills/cdmon/SKILL.md)

Manages domains and DNS records hosted at cdmon through its API: it lists domains and their records, and adds, changes, or deletes A, CNAME, and TXT records. Before every write it shows a diff and asks for explicit confirmation, and afterwards it checks propagation with `dig`. AAAA and MX are out of scope because the API can't write them.

### [babysit-pr](https://github.com/jzfgo/agents/blob/main/skills/babysit-pr/SKILL.md)

Takes ownership of a GitHub PR until it's ready to merge. It triages review comments, fixes the real issues with commits, answers false positives with evidence, and fixes CI when it goes red. Then it asks `@claude` (the Claude Code GitHub Action) for a re-review and loops until the review of the latest commit comes back clean. It never merges.

### [sync-docs](https://github.com/jzfgo/agents/blob/main/skills/sync-docs/SKILL.md)

Audits a repo's documentation against its code: agent instructions files (`AGENTS.md`, `CLAUDE.md`, and nested ones), README, and `docs/`. It checks every verifiable claim at its source of truth, instead of refreshing the docs from memory, and delivers a report with every drifted claim and its evidence. Once the report is approved, it fixes them on a branch. Generated files (such as `CHANGELOG.md`) are left alone.

### [statusline](https://github.com/jzfgo/agents/blob/main/skills/statusline/SKILL.md)

Installs or updates a two-line statusline for Claude Code and Antigravity CLI, and its closest native single-row equivalent for Codex CLI. It shows the host, the zmx session, the repo, worktree and branch, the model and its effort level, 5-hour and 7-day usage with a countdown to each reset, and context window usage. Before writing anything it shows a plan and asks for permission, and it never overwrites another statusline without consent.

## Eval-driven development

Every skill ships with two test suites:

- **`evals.json`**: functional tests, what the skill must produce for a given input.
- **`trigger_eval.json`**: trigger tests, when the skill should fire and, above all, when it shouldn't.

A skill's `description` is what the agent reads to decide whether to invoke it, so it has to be precise and also name what the skill doesn't cover; that's where the negative cases come from. `1on1` and `write-like-me` go one step further, with a `claude plugin eval` suite where each case builds its own starting repo with a `scaffold.sh` and is scored by several graders (criteria checked by a judge model).

## Multi-harness architecture

Each harness discovers plugins in its own way. Claude Code uses one manifest per skill plus a `marketplace.json`; Codex and Cursor, a root manifest pointing at `skills/`; Antigravity and Pi, symlinks in `.agents/skills/`; and OpenCode, an entry in `opencode.json`. That's why each skill's logic lives in a single `SKILL.md`, and the manifests are just adapters.

Whatever the skills produce (reports, per-repo configuration) goes into `.agents/`, never into an agent-specific directory such as `.claude/`, because the next run may come from a different agent.

## Credits

`write-like-me` takes its three-pass structure, analysis dimensions, and review taxonomies from [sam-dumont/claude-skills](https://github.com/sam-dumont/claude-skills) (MIT). The [NOTICE](https://github.com/jzfgo/agents/blob/main/NOTICE) details what is derived and what is original.
