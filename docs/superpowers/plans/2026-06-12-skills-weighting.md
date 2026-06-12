# Skills Weighting System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat, unordered tech list on the CV with a decay-weighted skills list sourced from projects, work entries, and education; display raw skill tags on project detail pages.

**Architecture:** A new `src/utils/skills.ts` utility computes half-life decay scores for each skill across all three content types, filters stale skills, and returns a sorted list. CV pages import and call this utility. Project detail pages render skills directly from frontmatter with no weighting.

**Tech Stack:** Astro 6, TypeScript, Zod (content schema), Tailwind CSS v4

> **Note on TDD:** This project has no test framework. `pnpm astro check` serves as the type-level test harness. Each task ends with a check command and its expected output. The final task runs `pnpm build` as the integration test.

---

## File Map

| Action | File |
|--------|------|
| Create | `src/utils/skills.ts` |
| Modify | `tsconfig.json` |
| Modify | `src/content.config.ts` |
| Modify | `src/content/work-es/bahiazul.md` |
| Modify | `src/content/work-es/fly-fut.md` |
| Modify | `src/content/work-es/interacso.md` |
| Modify | `src/content/work-es/neolabels.md` |
| Modify | `src/content/work-en/bahiazul.md` |
| Modify | `src/content/work-en/fly-fut.md` |
| Modify | `src/content/work-en/interacso.md` |
| Modify | `src/content/work-en/neolabels.md` |
| Modify | `src/pages/cv/index.astro` |
| Modify | `src/pages/en/cv/index.astro` |
| Modify | `src/pages/projects/[...slug].astro` |
| Modify | `src/pages/en/projects/[...slug].astro` |

---

### Task 1: Add `@utils` path alias and create `src/utils/skills.ts`

**Files:**
- Modify: `tsconfig.json`
- Create: `src/utils/skills.ts`

- [ ] **Step 1: Add `@utils` path alias to `tsconfig.json`**

The file currently has paths for `@components`, `@layouts`, `@lib`, `@styles`, `@assets`, `@consts`, `@types`, and `@cv`. Add `@utils` after `@cv`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strictNullChecks": true,
    "baseUrl": ".",
    "paths": {
      "@components/*": ["./src/components/*"],
      "@layouts/*": ["./src/layouts/*"],
      "@lib/*": ["./src/lib/*"],
      "@styles/*": ["./src/styles/*"],
      "@assets/*": ["./src/assets/*"],
      "@consts": ["./src/consts.ts"],
      "@types": ["./src/types.ts"],
      "@cv/*": ["./src/cv/*"],
      "@utils/*": ["./src/utils/*"]
    }
  }
}
```

- [ ] **Step 2: Create `src/utils/skills.ts`**

```typescript
const HALF_LIFE_YEARS = 3;
const MAX_TECH_AGE_YEARS = 10;
const RECENCY_THRESHOLD = Math.pow(0.5, MAX_TECH_AGE_YEARS / HALF_LIFE_YEARS);

export type SkillEntry = { skills?: string[]; date: Date };

function decayScore(date: Date): number {
  const yearsAgo = (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  return Math.pow(0.5, yearsAgo / HALF_LIFE_YEARS);
}

export function computeSkillWeights(entries: SkillEntry[]): string[] {
  const totals = new Map<string, number>();
  const peaks  = new Map<string, number>();

  for (const { skills, date } of entries) {
    const score = decayScore(date);
    for (const s of skills ?? []) {
      totals.set(s, (totals.get(s) ?? 0) + score);
      peaks.set(s,  Math.max(peaks.get(s) ?? 0, score));
    }
  }

  return [...totals.entries()]
    .filter(([name]) => (peaks.get(name) ?? 0) >= RECENCY_THRESHOLD)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
}
```

- [ ] **Step 3: Verify types pass**

```bash
pnpm astro check
```

Expected:
```
Result (45 files): 0 errors, 0 warnings, 1 hint
```

(The 1 hint is a pre-existing deprecation warning on `z.string().url()` in `content.config.ts` — not introduced by this task.)

- [ ] **Step 4: Commit**

```bash
git add tsconfig.json src/utils/skills.ts
git commit -m "feat: add computeSkillWeights utility with half-life decay"
```

---

### Task 2: Update content schema and CV pages atomically

The schema rename (`tech` → `skills` in `workSchema`) and the CV page updates must land in the same commit — the CV pages reference `e.data.tech` which TypeScript will error on as soon as the schema renames the field.

**Files:**
- Modify: `src/content.config.ts`
- Modify: `src/pages/cv/index.astro`
- Modify: `src/pages/en/cv/index.astro`

- [ ] **Step 1: Rename `tech` → `skills` in `workSchema` and add `skills` to `projectsSchema`**

In `src/content.config.ts`, line 34, change:
```typescript
tech: z.array(z.string()).optional(),
```
to:
```typescript
skills: z.array(z.string()).optional(),
```

In `projectsSchema` (around line 62, after `translationKey`), add:
```typescript
skills: z.array(z.string()).optional(),
```

The full updated `projectsSchema` should look like:
```typescript
const projectsSchema = ({ image }: SchemaContext) =>
  z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    type: z.enum(["personal", "professional"]),
    draft: z.boolean().optional(),
    demoURL: z.string().optional(),
    repoURL: z.string().optional(),
    translationKey: z.string().optional(),
    hero: image().optional(),
    skills: z.array(z.string()).optional(),
  });
```

- [ ] **Step 2: Update `src/pages/cv/index.astro`**

Add the import at the top of the frontmatter (after existing imports):
```typescript
import { computeSkillWeights } from "@utils/skills";
```

Replace the block from line 44 (`const allTech = ...`) through line 49 (end of `education` query):

**Before:**
```typescript
const allTech = [...new Set(work.flatMap(e => e.data.tech ?? []))];
const locationEs = profile.location ? profile.location.replace("Spain", "España") : "";

const education = (await getCollection("education"))
  .filter(e => e.data.include?.cv !== false)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
```

**After:**
```typescript
const locationEs = profile.location ? profile.location.replace("Spain", "España") : "";

const education = (await getCollection("education"))
  .filter(e => e.data.include?.cv !== false)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const projects = (await getCollection("projects-es")).filter(e => !e.data.draft);

const allSkills = computeSkillWeights([
  ...work.map(e => ({
    skills: e.data.skills,
    date: typeof e.data.dateEnd === "string" ? new Date() : e.data.dateEnd as Date,
  })),
  ...projects.map(e => ({ skills: e.data.skills, date: e.data.date })),
  ...education.map(e => ({ skills: e.data.skills, date: e.data.date })),
]);
```

In the template (line 149), change:
```astro
<p class="skills">{allTech.join(" · ")}</p>
```
to:
```astro
<p class="skills">{allSkills.join(" · ")}</p>
```

- [ ] **Step 3: Update `src/pages/en/cv/index.astro`**

Add the import at the top of the frontmatter (after existing imports):
```typescript
import { computeSkillWeights } from "@utils/skills";
```

Replace the block from line 43 (`const allTech = ...`) through line 47 (end of `education` query):

**Before:**
```typescript
const allTech = [...new Set(work.flatMap(e => e.data.tech ?? []))];

const education = (await getCollection("education"))
  .filter(e => e.data.include?.cv !== false)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
```

**After:**
```typescript
const education = (await getCollection("education"))
  .filter(e => e.data.include?.cv !== false)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const projects = (await getCollection("projects-en")).filter(e => !e.data.draft);

const allSkills = computeSkillWeights([
  ...work.map(e => ({
    skills: e.data.skills,
    date: typeof e.data.dateEnd === "string" ? new Date() : e.data.dateEnd as Date,
  })),
  ...projects.map(e => ({ skills: e.data.skills, date: e.data.date })),
  ...education.map(e => ({ skills: e.data.skills, date: e.data.date })),
]);
```

In the template (line 147), change:
```astro
<p class="skills">{allTech.join(" · ")}</p>
```
to:
```astro
<p class="skills">{allSkills.join(" · ")}</p>
```

- [ ] **Step 4: Verify types pass**

```bash
pnpm astro check
```

Expected:
```
Result (45 files): 0 errors, 0 warnings, 1 hint
```

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/pages/cv/index.astro src/pages/en/cv/index.astro
git commit -m "feat: rename tech→skills in schema, wire CV pages to computeSkillWeights"
```

---

### Task 3: Rename `tech:` → `skills:` in work content files

Four ES files and four EN files have `tech:` in their frontmatter. The field is optional in the schema, so Zod silently ignores unknown keys — but rename anyway so the content stays consistent with the schema.

**Files:**
- Modify: `src/content/work-es/bahiazul.md`, `fly-fut.md`, `interacso.md`, `neolabels.md`
- Modify: `src/content/work-en/bahiazul.md`, `fly-fut.md`, `interacso.md`, `neolabels.md`

- [ ] **Step 1: Rename `tech:` → `skills:` in all 8 files**

```bash
sed -i 's/^tech:/skills:/' \
  src/content/work-es/bahiazul.md \
  src/content/work-es/fly-fut.md \
  src/content/work-es/interacso.md \
  src/content/work-es/neolabels.md \
  src/content/work-en/bahiazul.md \
  src/content/work-en/fly-fut.md \
  src/content/work-en/interacso.md \
  src/content/work-en/neolabels.md
```

- [ ] **Step 2: Verify the rename worked**

```bash
grep -r "^tech:" src/content/work-es/ src/content/work-en/
```

Expected: no output (no matches).

```bash
grep -r "^skills:" src/content/work-es/ src/content/work-en/
```

Expected: 4 lines for each directory.

- [ ] **Step 3: Verify types pass**

```bash
pnpm astro check
```

Expected:
```
Result (45 files): 0 errors, 0 warnings, 1 hint
```

- [ ] **Step 4: Commit**

```bash
git add src/content/work-es/bahiazul.md src/content/work-es/fly-fut.md \
        src/content/work-es/interacso.md src/content/work-es/neolabels.md \
        src/content/work-en/bahiazul.md src/content/work-en/fly-fut.md \
        src/content/work-en/interacso.md src/content/work-en/neolabels.md
git commit -m "chore: rename tech→skills in work content frontmatter"
```

---

### Task 4: Add skills tags to project detail pages

**Files:**
- Modify: `src/pages/projects/[...slug].astro`
- Modify: `src/pages/en/projects/[...slug].astro`

Both files have the same structure. The skills block goes between the closing `</nav>` of the demo/repo links and the `<article>` tag.

- [ ] **Step 1: Add skills tags block to `src/pages/projects/[...slug].astro`**

After the closing `</nav>` block (around line 66) and before `</div>` that closes `space-y-1`, insert:

**Before** (the `</div>` closing `space-y-1 my-10` and the article):
```astro
    </div>
    <article class="animate">
      <Content />
    </article>
```

**After:**
```astro
      {project.data.skills && project.data.skills.length > 0 && (
        <div class="animate flex flex-wrap gap-2 mt-3">
          {project.data.skills.map(s => (
            <span class="text-sm">{s}</span>
          ))}
        </div>
      )}
    </div>
    <article class="animate">
      <Content />
    </article>
```

- [ ] **Step 2: Add the same block to `src/pages/en/projects/[...slug].astro`**

Same change — the two files are structurally identical. After the closing `</nav>` block (around line 66) and before `</div>`:

```astro
      {project.data.skills && project.data.skills.length > 0 && (
        <div class="animate flex flex-wrap gap-2 mt-3">
          {project.data.skills.map(s => (
            <span class="text-sm">{s}</span>
          ))}
        </div>
      )}
    </div>
    <article class="animate">
      <Content />
    </article>
```

- [ ] **Step 3: Verify types pass**

```bash
pnpm astro check
```

Expected:
```
Result (45 files): 0 errors, 0 warnings, 1 hint
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/[...slug].astro src/pages/en/projects/[...slug].astro
git commit -m "feat: display skills tags on project detail pages"
```

---

### Task 5: Final build verification

- [ ] **Step 1: Run full build**

```bash
pnpm build
```

Expected: build completes with no errors. The CV Skills section will be empty or very sparse until `skills:` is added to project entries (that is a separate content authoring task).

- [ ] **Step 2: Spot-check CV output**

```bash
pnpm preview
```

Open `http://localhost:4321/cv` and `http://localhost:4321/en/cv`. The Skills section should render whatever skills are currently in the work and education entries (post-rename from `tech:`), sorted by decay weight. It should not throw or render nothing at all.

- [ ] **Step 3: Spot-check a project page**

Open any project that does NOT yet have `skills:` in its frontmatter — the skills block should be absent (not broken). If any project does have `skills:`, its tags should appear.
