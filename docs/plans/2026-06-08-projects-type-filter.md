# Projects Type Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a required `type` field to projects content and filter tabs to the projects list pages so visitors can distinguish personal from professional work.

**Architecture:** Add `type: z.enum(["personal", "professional"])` to the shared `projectsSchema`, tag all 20 project frontmatter files (10 EN + 10 ES), then add filter tabs + inline JS to both projects index pages. Filtering is client-side: JS reads `?type=` on load, updates the URL with `history.pushState` on tab click, and toggles `display: none` on list items.

**Tech Stack:** Astro 5 (content collections, `is:inline` scripts), Tailwind v4, Zod schema validation, vanilla JS.

---

## Task 1: Add `type` to schema and tag all frontmatter

> **Note:** The schema change and frontmatter tagging must be committed together — the schema makes `type` required, so the build breaks until all files are tagged. Do not commit the schema change alone.

**Files:**
- Modify: `src/content.config.ts` (lines 55–63, `projectsSchema`)
- Modify: `src/content/projects-en/agents/index.md`
- Modify: `src/content/projects-en/carroquesi/index.md`
- Modify: `src/content/projects-en/bahiazul-website/index.md`
- Modify: `src/content/projects-en/english-monstruo/index.md`
- Modify: `src/content/projects-en/fly-fut-ligas/index.md`
- Modify: `src/content/projects-en/fly-fut-pro/index.md`
- Modify: `src/content/projects-en/fuera-de-juego/index.md`
- Modify: `src/content/projects-en/minerales-de-la-liga/index.md`
- Modify: `src/content/projects-en/porcelanosa-ecommerce/index.md`
- Modify: `src/content/projects-en/quadrant-travel-cloud/index.md`
- Modify: `src/content/projects-es/agents/index.md`
- Modify: `src/content/projects-es/carroquesi/index.md`
- Modify: `src/content/projects-es/bahiazul-website/index.md`
- Modify: `src/content/projects-es/english-monstruo/index.md`
- Modify: `src/content/projects-es/fly-fut-ligas/index.md`
- Modify: `src/content/projects-es/fly-fut-pro/index.md`
- Modify: `src/content/projects-es/fuera-de-juego/index.md`
- Modify: `src/content/projects-es/minerales-de-la-liga/index.md`
- Modify: `src/content/projects-es/porcelanosa-ecommerce/index.md`
- Modify: `src/content/projects-es/quadrant-travel-cloud/index.md`

- [ ] **Step 1: Update `projectsSchema` in `src/content.config.ts`**

Replace the `projectsSchema` definition (lines 55–63):

```ts
const projectsSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  type: z.enum(["personal", "professional"]),
  draft: z.boolean().optional(),
  demoURL: z.string().optional(),
  repoURL: z.string().optional(),
  translationKey: z.string().optional(),
});
```

- [ ] **Step 2: Verify schema enforces the field (build should fail)**

```bash
pnpm build
```

Expected: build fails with content validation errors about missing `type` field. This confirms the required field is enforced.

- [ ] **Step 3: Add `type: personal` to `projects-en` personal projects**

Add `type: "personal"` to the frontmatter of:

`src/content/projects-en/agents/index.md` — insert after `date:` line:
```yaml
type: "personal"
```

`src/content/projects-en/carroquesi/index.md` — insert after `date:` line:
```yaml
type: "personal"
```

- [ ] **Step 4: Add `type: professional` to `projects-en` professional projects**

Add `type: "professional"` to the frontmatter of each of these files, after the `date:` line:

- `src/content/projects-en/bahiazul-website/index.md`
- `src/content/projects-en/english-monstruo/index.md`
- `src/content/projects-en/fly-fut-ligas/index.md`
- `src/content/projects-en/fly-fut-pro/index.md`
- `src/content/projects-en/fuera-de-juego/index.md`
- `src/content/projects-en/minerales-de-la-liga/index.md`
- `src/content/projects-en/porcelanosa-ecommerce/index.md`
- `src/content/projects-en/quadrant-travel-cloud/index.md`

- [ ] **Step 5: Add `type: personal` to `projects-es` personal projects**

Add `type: "personal"` to the frontmatter of:

- `src/content/projects-es/agents/index.md`
- `src/content/projects-es/carroquesi/index.md`

- [ ] **Step 6: Add `type: professional` to `projects-es` professional projects**

Add `type: "professional"` to the frontmatter of each of these files, after the `date:` line:

- `src/content/projects-es/bahiazul-website/index.md`
- `src/content/projects-es/english-monstruo/index.md`
- `src/content/projects-es/fly-fut-ligas/index.md`
- `src/content/projects-es/fly-fut-pro/index.md`
- `src/content/projects-es/fuera-de-juego/index.md`
- `src/content/projects-es/minerales-de-la-liga/index.md`
- `src/content/projects-es/porcelanosa-ecommerce/index.md`
- `src/content/projects-es/quadrant-travel-cloud/index.md`

- [ ] **Step 7: Verify build passes**

```bash
pnpm build
```

Expected: build completes successfully with no content validation errors.

- [ ] **Step 8: Commit**

```bash
git add src/content.config.ts \
  src/content/projects-en/agents/index.md \
  src/content/projects-en/carroquesi/index.md \
  src/content/projects-en/bahiazul-website/index.md \
  src/content/projects-en/english-monstruo/index.md \
  src/content/projects-en/fly-fut-ligas/index.md \
  src/content/projects-en/fly-fut-pro/index.md \
  src/content/projects-en/fuera-de-juego/index.md \
  src/content/projects-en/minerales-de-la-liga/index.md \
  src/content/projects-en/porcelanosa-ecommerce/index.md \
  src/content/projects-en/quadrant-travel-cloud/index.md \
  src/content/projects-es/agents/index.md \
  src/content/projects-es/carroquesi/index.md \
  src/content/projects-es/bahiazul-website/index.md \
  src/content/projects-es/english-monstruo/index.md \
  src/content/projects-es/fly-fut-ligas/index.md \
  src/content/projects-es/fly-fut-pro/index.md \
  src/content/projects-es/fuera-de-juego/index.md \
  src/content/projects-es/minerales-de-la-liga/index.md \
  src/content/projects-es/porcelanosa-ecommerce/index.md \
  src/content/projects-es/quadrant-travel-cloud/index.md
git commit -m "feat: add type field to projects content schema and frontmatter"
```

---

## Task 2: Add filter tabs to the English projects page

**Files:**
- Modify: `src/pages/en/projects/index.astro`

- [ ] **Step 1: Replace the entire file with the updated version**

```astro
---
import { getCollection } from "astro:content";
import PageLayout from "@layouts/PageLayout.astro";
import Container from "@components/Container.astro";
import ArrowCard from "@components/ArrowCard.astro";
import { PROJECTS_EN as PROJECTS } from "@consts";
import { getIconMap, idToSlug } from "@lib/utils";

const projects = (await getCollection("projects-en"))
  .filter(project => !project.data.draft)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const icons = getIconMap(import.meta.glob("/src/assets/projects/*/icon.*", { eager: true }) as Record<string, { default: { src: string } }>);
---

<PageLayout title={PROJECTS.TITLE} description={PROJECTS.DESCRIPTION}>
  <Container>
    <div class="space-y-10">
      <div class="animate font-semibold text-black dark:text-white">
        Projects
      </div>
      <div class="animate flex gap-6 border-b border-black/10 dark:border-white/10">
        <button data-filter="all" aria-current="true" class="projects-filter-tab">All</button>
        <button data-filter="professional" class="projects-filter-tab">Professional</button>
        <button data-filter="personal" class="projects-filter-tab">Personal</button>
      </div>
      <ul id="project-list" class="animate flex flex-col gap-4">
        {
          projects.map((project) => (
            <li data-type={project.data.type} class="flex items-center gap-3">
              <div class="flex-1">
                <ArrowCard entry={project} href={`/en/projects/${idToSlug(project.id)}`} icon={icons[idToSlug(project.id)]} />
              </div>
              <span class="type-label text-xs uppercase tracking-widest text-black/30 dark:text-white/30 shrink-0">{project.data.type}</span>
            </li>
          ))
        }
      </ul>
    </div>
  </Container>
</PageLayout>

<style is:global>
  .projects-filter-tab {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 500;
    color: rgb(0 0 0 / 0.4);
    border: none;
    background: transparent;
    padding-bottom: 12px;
    margin-bottom: -1px;
    border-bottom: 2px solid transparent;
    cursor: pointer;
  }
  .projects-filter-tab[aria-current="true"] {
    font-weight: 600;
    color: rgb(0 0 0);
    border-bottom-color: rgb(0 0 0);
  }
  .dark .projects-filter-tab {
    color: rgb(255 255 255 / 0.4);
  }
  .dark .projects-filter-tab[aria-current="true"] {
    color: rgb(255 255 255);
    border-bottom-color: rgb(255 255 255);
  }
</style>

<script is:inline>
  (function () {
    var VALID = ["professional", "personal"];

    function getFilter() {
      var p = new URLSearchParams(window.location.search).get("type");
      return VALID.indexOf(p) !== -1 ? p : "all";
    }

    function applyFilter(filter) {
      document.querySelectorAll("#project-list li").forEach(function (li) {
        var match = filter === "all" || li.dataset.type === filter;
        li.style.display = match ? "" : "none";
        var label = li.querySelector(".type-label");
        if (label) label.style.display = filter === "all" ? "" : "none";
      });
      document.querySelectorAll(".projects-filter-tab").forEach(function (btn) {
        if (btn.dataset.filter === filter) {
          btn.setAttribute("aria-current", "true");
        } else {
          btn.removeAttribute("aria-current");
        }
      });
    }

    applyFilter(getFilter());

    document.querySelectorAll(".projects-filter-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.dataset.filter;
        var url = new URL(window.location.href);
        if (filter === "all") {
          url.searchParams.delete("type");
        } else {
          url.searchParams.set("type", filter);
        }
        history.pushState({}, "", url);
        applyFilter(filter);
      });
    });

    window.addEventListener("popstate", function () {
      applyFilter(getFilter());
    });
  })();
</script>
```

- [ ] **Step 2: Start dev server and verify EN page**

```bash
pnpm dev
```

Open `http://localhost:4321/en/projects` in a browser and check:

1. Three tabs appear: "All", "Professional", "Personal" — "All" is bold with underline by default
2. In "All" view, each project row shows a muted type label to the right
3. Click "Professional" → URL becomes `?type=professional`, only professional projects show, type labels hide
4. Click "Personal" → URL becomes `?type=personal`, only "agents" and "carroquesi" show
5. Click "All" → URL param is removed, all projects show with labels again
6. Navigate to `http://localhost:4321/en/projects?type=personal` directly → Personal tab is pre-selected on load
7. Click "Professional", then press browser back button → returns to Personal filter correctly
8. Toggle dark mode (if site has a toggle) → tab styles update correctly

Stop the dev server with `Ctrl+C`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/en/projects/index.astro
git commit -m "feat: add type filter tabs to EN projects page"
```

---

## Task 3: Add filter tabs to the Spanish projects page

**Files:**
- Modify: `src/pages/es/projects/index.astro`

- [ ] **Step 1: Replace the entire file with the updated version**

```astro
---
import { getCollection } from "astro:content";
import PageLayout from "@layouts/PageLayout.astro";
import Container from "@components/Container.astro";
import ArrowCard from "@components/ArrowCard.astro";
import { PROJECTS_ES as PROJECTS } from "@consts";
import { getIconMap, idToSlug } from "@lib/utils";

const projects = (await getCollection("projects-es"))
  .filter(project => !project.data.draft)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const icons = getIconMap(import.meta.glob("/src/assets/projects/*/icon.*", { eager: true }) as Record<string, { default: { src: string } }>);
---

<PageLayout title={PROJECTS.TITLE} description={PROJECTS.DESCRIPTION}>
  <Container>
    <div class="space-y-10">
      <div class="animate font-semibold text-black dark:text-white">
        Proyectos
      </div>
      <div class="animate flex gap-6 border-b border-black/10 dark:border-white/10">
        <button data-filter="all" aria-current="true" class="projects-filter-tab">Todos</button>
        <button data-filter="professional" class="projects-filter-tab">Profesional</button>
        <button data-filter="personal" class="projects-filter-tab">Personal</button>
      </div>
      <ul id="project-list" class="animate flex flex-col gap-4">
        {
          projects.map((project) => (
            <li data-type={project.data.type} class="flex items-center gap-3">
              <div class="flex-1">
                <ArrowCard entry={project} href={`/es/projects/${idToSlug(project.id)}`} icon={icons[idToSlug(project.id)]} />
              </div>
              <span class="type-label text-xs uppercase tracking-widest text-black/30 dark:text-white/30 shrink-0">{project.data.type}</span>
            </li>
          ))
        }
      </ul>
    </div>
  </Container>
</PageLayout>

<style is:global>
  .projects-filter-tab {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 500;
    color: rgb(0 0 0 / 0.4);
    border: none;
    background: transparent;
    padding-bottom: 12px;
    margin-bottom: -1px;
    border-bottom: 2px solid transparent;
    cursor: pointer;
  }
  .projects-filter-tab[aria-current="true"] {
    font-weight: 600;
    color: rgb(0 0 0);
    border-bottom-color: rgb(0 0 0);
  }
  .dark .projects-filter-tab {
    color: rgb(255 255 255 / 0.4);
  }
  .dark .projects-filter-tab[aria-current="true"] {
    color: rgb(255 255 255);
    border-bottom-color: rgb(255 255 255);
  }
</style>

<script is:inline>
  (function () {
    var VALID = ["professional", "personal"];

    function getFilter() {
      var p = new URLSearchParams(window.location.search).get("type");
      return VALID.indexOf(p) !== -1 ? p : "all";
    }

    function applyFilter(filter) {
      document.querySelectorAll("#project-list li").forEach(function (li) {
        var match = filter === "all" || li.dataset.type === filter;
        li.style.display = match ? "" : "none";
        var label = li.querySelector(".type-label");
        if (label) label.style.display = filter === "all" ? "" : "none";
      });
      document.querySelectorAll(".projects-filter-tab").forEach(function (btn) {
        if (btn.dataset.filter === filter) {
          btn.setAttribute("aria-current", "true");
        } else {
          btn.removeAttribute("aria-current");
        }
      });
    }

    applyFilter(getFilter());

    document.querySelectorAll(".projects-filter-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.dataset.filter;
        var url = new URL(window.location.href);
        if (filter === "all") {
          url.searchParams.delete("type");
        } else {
          url.searchParams.set("type", filter);
        }
        history.pushState({}, "", url);
        applyFilter(filter);
      });
    });

    window.addEventListener("popstate", function () {
      applyFilter(getFilter());
    });
  })();
</script>
```

- [ ] **Step 2: Start dev server and verify ES page**

```bash
pnpm dev
```

Open `http://localhost:4321/es/projects` and check:

1. Tabs show: "Todos", "Profesional", "Personal" — "Todos" active by default
2. "Profesional" tab filters correctly (same 8 projects as EN)
3. "Personal" tab shows only "agents" and "carroquesi"
4. URL updates to `?type=professional` / `?type=personal` on tab click
5. Direct URL `http://localhost:4321/es/projects?type=personal` pre-selects Personal tab

Stop the dev server with `Ctrl+C`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/es/projects/index.astro
git commit -m "feat: add type filter tabs to ES projects page"
```
