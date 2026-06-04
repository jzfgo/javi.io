# Astro Nano Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate javi.io from Gatsby v2 + gatsby-theme-novela to Astro v5 + Astro Nano, with first-class ES/EN i18n, in an isolated git worktree.

**Architecture:** Two separate content collections (`blog-es`, `blog-en`) share a zod schema with an optional `translationKey` field for linking translations. Astro's built-in i18n uses `prefix-always` routing: ES posts under `/es/blog/`, EN posts under `/en/blog/`. Root `/` is a static `public/index.html` that JS-redirects to `/es/` or `/en/` using `navigator.language`. Static HTML redirects in `public/` also bridge old Gatsby URLs to new ones.

**Tech Stack:** Astro v5, Tailwind CSS, `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/tailwind`, `gh-pages`

**All file paths below are relative to `.worktrees/astro-migration/` unless noted as `[main repo]`.**

---

### Task 1: Set up worktree and scaffold Astro Nano

**Files:**
- Modify: `[main repo] .gitignore`
- Create: `.worktrees/astro-migration/` (full scaffold from astro-nano)

- [ ] **Step 1: Add `.worktrees/` to the main repo's `.gitignore`**

Run from the main repo root:
```bash
echo ".worktrees/" >> .gitignore
git add .gitignore
git commit -m "chore: ignore worktrees directory"
```

- [ ] **Step 2: Create the branch and worktree**

```bash
git branch astro-migration
git worktree add .worktrees/astro-migration astro-migration
```

- [ ] **Step 3: Scaffold Astro Nano into the worktree**

```bash
cd .worktrees/astro-migration
npx degit markhorn-dev/astro-nano . --force
```

Expected: files appear in `.worktrees/astro-migration/` (astro.config.mjs, src/, public/, etc.)

- [ ] **Step 4: Install dependencies and add gh-pages**

```bash
npm install
npm install --save-dev gh-pages
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Expected: server starts on `http://localhost:4321` with no errors. Stop it with Ctrl+C.

- [ ] **Step 6: Commit the scaffold**

```bash
git add -A
git commit -m "chore: scaffold astro-nano"
```

---

### Task 2: Remove unused Nano sections (work, projects, sample blog content)

**Files:**
- Delete: `src/content/work/`
- Delete: `src/content/projects/`
- Delete: `src/content/blog/`
- Delete: `src/pages/work/`
- Delete: `src/pages/projects/`

- [ ] **Step 1: Delete unused content and pages**

```bash
rm -rf src/content/work src/content/projects src/content/blog
rm -rf src/pages/work src/pages/projects
```

- [ ] **Step 2: Verify the deletions**

```bash
ls src/content/
ls src/pages/
```

Expected: `src/content/` contains only `config.ts`. `src/pages/` contains `blog/`, `index.astro`, `robots.txt.ts`, `rss.xml.ts`.

- [ ] **Step 3: Clear `src/content/config.ts` to remove broken references**

```typescript
export const collections = {};
```

Also open `src/pages/rss.xml.ts` and change `getCollection("blog")` to `getCollection("blog-es")` now, so the file doesn't fail type-checking before Task 15 sets up the full RSS config. Just update the one reference — leave the rest of the file as-is for now.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove work, projects, and sample blog content"
```

---

### Task 3: Configure site metadata

**Files:**
- Modify: `src/consts.ts`

- [ ] **Step 1: Replace `src/consts.ts` with javi.io metadata**

```typescript
import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Hic sunt dracones",
  EMAIL: "javierzapata82@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 0,
  NUM_PROJECTS_ON_HOMEPAGE: 0,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Divagando.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Divagando.",
};

export const SOCIALS: Socials = [
  { NAME: "linkedin", HREF: "https://www.linkedin.com/in/jzfgo" },
  { NAME: "github",   HREF: "https://github.com/jzfgo" },
  { NAME: "twitter",  HREF: "https://twitter.com/jzfgo" },
  { NAME: "instagram", HREF: "https://instagram.com/jzfgo" },
];
```

- [ ] **Step 2: Run type check to confirm no errors**

```bash
npx astro check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/consts.ts
git commit -m "feat: set javi.io site metadata"
```

---

### Task 4: Configure i18n and dynamic page language

**Files:**
- Modify: `astro.config.mjs`
- Modify: `src/layouts/PageLayout.astro`

- [ ] **Step 1: Update `astro.config.mjs` with i18n and correct site URL**

```javascript
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://javi.io",
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: "es",
        locales: { es: "es", en: "en" },
      },
    }),
    tailwind(),
  ],
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: "prefix-always",
  },
});
```

- [ ] **Step 2: Update `src/layouts/PageLayout.astro` to use dynamic `lang`**

Change the `<html>` opening tag from:
```astro
<html lang="en">
```
to:
```astro
<html lang={Astro.currentLocale ?? "es"}>
```

- [ ] **Step 3: Run type check**

```bash
npx astro check
```

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs src/layouts/PageLayout.astro
git commit -m "feat: configure i18n (prefix-always routing) and dynamic html lang"
```

---

### Task 5: Define content collections

**Files:**
- Modify: `src/content/config.ts`

- [ ] **Step 1: Replace `src/content/config.ts` with two-collection schema**

```typescript
import { defineCollection, z } from "astro:content";

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  draft: z.boolean().optional(),
  translationKey: z.string().optional(),
});

const blogEs = defineCollection({ type: "content", schema: blogSchema });
const blogEn = defineCollection({ type: "content", schema: blogSchema });

export const collections = {
  "blog-es": blogEs,
  "blog-en": blogEn,
};
```

- [ ] **Step 2: Create the collection directories**

```bash
mkdir -p src/content/blog-es src/content/blog-en
```

- [ ] **Step 3: Run type check**

```bash
npx astro check
```

Expected: no schema errors.

- [ ] **Step 4: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: define blog-es and blog-en content collections with translationKey"
```

---

### Task 6: Migrate ES posts

**Files:**
- Create: `src/content/blog-es/hola-mundo.md`
- Create: `src/content/blog-es/diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio.md`
- Create: `src/content/blog-es/servicios-de-pago-ofrecidos-gratuitamente-debido-al-coronavirus-covid-19.md`
- Create: `src/content/blog-es/sudo-en-linux-con-touch-id-sin-morir-en-el-intento.md`
- Create: `public/blog/<slug>/` image directories

The source files live in the **main repo** at `../../content/posts/`. All commands run from `.worktrees/astro-migration/`.

- [ ] **Step 1: Copy images for all ES posts**

```bash
mkdir -p public/blog/hola-mundo
mkdir -p public/blog/diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio
mkdir -p public/blog/servicios-de-pago-ofrecidos-gratuitamente-debido-al-coronavirus-covid-19
mkdir -p public/blog/sudo-en-linux-con-touch-id-sin-morir-en-el-intento

cp ../../content/posts/2020-01-01-hola-mundo/images/* public/blog/hola-mundo/ 2>/dev/null || true
cp ../../content/posts/2020-02-02-cqha-gym/images/* public/blog/diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio/ 2>/dev/null || true
cp ../../content/posts/2020-03-20-coronafreemium/images/* public/blog/servicios-de-pago-ofrecidos-gratuitamente-debido-al-coronavirus-covid-19/ 2>/dev/null || true
cp ../../content/posts/2026-05-01-1password-ssh-agent-touchid-linux/images/* public/blog/sudo-en-linux-con-touch-id-sin-morir-en-el-intento/ 2>/dev/null || true
```

- [ ] **Step 2: Create `src/content/blog-es/hola-mundo.md`**

Write this frontmatter, then paste the body from `../../content/posts/2020-01-01-hola-mundo/index.mdx` below it (everything after the closing `---`):

```markdown
---
title: "¡Hola Mundo!"
description: "Esta entrada llega diez años tarde."
date: 2020-01-01
---
```

Then append the body:
```bash
# Extract body (everything after the second ---) from source
tail -n +$(grep -n "^---" ../../content/posts/2020-01-01-hola-mundo/index.mdx | sed -n '2p' | cut -d: -f1) ../../content/posts/2020-01-01-hola-mundo/index.mdx | tail -n +2 >> src/content/blog-es/hola-mundo.md
```

- [ ] **Step 3: Create `src/content/blog-es/diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio.md`**

```markdown
---
title: "Diez cosas que he aprendido tras tres años yendo al gimnasio"
description: "JUST DO IT."
date: 2020-02-01
---
```

Append body:
```bash
SLUG=diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio
tail -n +$(grep -n "^---" ../../content/posts/2020-02-02-cqha-gym/index.mdx | sed -n '2p' | cut -d: -f1) ../../content/posts/2020-02-02-cqha-gym/index.mdx | tail -n +2 >> src/content/blog-es/${SLUG}.md
```

- [ ] **Step 4: Create `src/content/blog-es/servicios-de-pago-ofrecidos-gratuitamente-debido-al-coronavirus-covid-19.md`**

```markdown
---
title: "Servicios de pago ofrecidos gratuitamente debido al Coronavirus COVID-19"
description: "Recursos para sobrellevar el confinamiento."
date: 2020-03-20
---
```

Append body:
```bash
SLUG=servicios-de-pago-ofrecidos-gratuitamente-debido-al-coronavirus-covid-19
tail -n +$(grep -n "^---" ../../content/posts/2020-03-20-coronafreemium/index.mdx | sed -n '2p' | cut -d: -f1) ../../content/posts/2020-03-20-coronafreemium/index.mdx | tail -n +2 >> src/content/blog-es/${SLUG}.md
```

- [ ] **Step 5: Create `src/content/blog-es/sudo-en-linux-con-touch-id-sin-morir-en-el-intento.md`**

```markdown
---
title: "sudo en Linux con Touch ID (sin morir en el intento)"
description: "Configura el agente SSH de 1Password para usar Touch ID en tu servidor Linux."
date: 2026-05-01
---
```

Append body:
```bash
SLUG=sudo-en-linux-con-touch-id-sin-morir-en-el-intento
tail -n +$(grep -n "^---" ../../content/posts/2026-05-01-1password-ssh-agent-touchid-linux/index.mdx | sed -n '2p' | cut -d: -f1) ../../content/posts/2026-05-01-1password-ssh-agent-touchid-linux/index.mdx | tail -n +2 >> src/content/blog-es/${SLUG}.md
```

- [ ] **Step 6: Fix any inline image references**

```bash
# Check for ./images/ references in any ES post
grep -r "\./images/" src/content/blog-es/
```

For each match found, replace `./images/<filename>` with `/blog/<slug>/<filename>` in that post file. Example — for `sudo-en-linux-con-touch-id-sin-morir-en-el-intento.md`:
```bash
SLUG=sudo-en-linux-con-touch-id-sin-morir-en-el-intento
sed -i '' "s|\./images/|/blog/${SLUG}/|g" src/content/blog-es/${SLUG}.md
```

Repeat for each post that has matches.

- [ ] **Step 7: Run type check**

```bash
npx astro check
```

Expected: no errors on the content files (schema validation passes).

- [ ] **Step 8: Commit**

```bash
git add src/content/blog-es/ public/blog/
git commit -m "feat: migrate ES posts to blog-es collection"
```

---

### Task 7: Migrate EN posts

**Files:**
- Create: `src/content/blog-en/my-recap-of-scrimbas-javascriptmas.md`
- Create: `src/content/blog-en/building-my-first-public-claude-code-skill-the-1on1.md`
- Create: `public/blog/my-recap-of-scrimbas-javascriptmas/` (if images exist)
- Create: `public/blog/building-my-first-public-claude-code-skill-the-1on1/` (if images exist)

- [ ] **Step 1: Copy images for EN posts**

```bash
mkdir -p public/blog/my-recap-of-scrimbas-javascriptmas
mkdir -p public/blog/building-my-first-public-claude-code-skill-the-1on1

cp ../../content/posts/2020-12-20-javascriptmas/images/* public/blog/my-recap-of-scrimbas-javascriptmas/ 2>/dev/null || true
cp ../../content/posts/2026-06-01-building-my-first-public-claude-code-skill/images/* public/blog/building-my-first-public-claude-code-skill-the-1on1/ 2>/dev/null || true
```

- [ ] **Step 2: Create `src/content/blog-en/my-recap-of-scrimbas-javascriptmas.md`**

```markdown
---
title: "My recap of Scrimba's #JavaScriptmas"
description: "It was a fun ride!"
date: 2020-12-20
---
```

Append body:
```bash
SLUG=my-recap-of-scrimbas-javascriptmas
tail -n +$(grep -n "^---" ../../content/posts/2020-12-20-javascriptmas/index.mdx | sed -n '2p' | cut -d: -f1) ../../content/posts/2020-12-20-javascriptmas/index.mdx | tail -n +2 >> src/content/blog-en/${SLUG}.md
```

- [ ] **Step 3: Create `src/content/blog-en/building-my-first-public-claude-code-skill-the-1on1.md`**

```markdown
---
title: "Building My First Public Skill for Claude Code: The 1on1"
description: "I built a /1on1 slash command for Claude Code that runs a structured professional check-in between me and my AI collaborator. This is the story of how and why."
date: 2026-06-01
---
```

Append body:
```bash
SLUG=building-my-first-public-claude-code-skill-the-1on1
tail -n +$(grep -n "^---" ../../content/posts/2026-06-01-building-my-first-public-claude-code-skill/index.mdx | sed -n '2p' | cut -d: -f1) ../../content/posts/2026-06-01-building-my-first-public-claude-code-skill/index.mdx | tail -n +2 >> src/content/blog-en/${SLUG}.md
```

- [ ] **Step 4: Fix inline image references in EN posts**

```bash
grep -r "\./images/" src/content/blog-en/
```

For each match, replace with absolute path. Example:
```bash
SLUG=building-my-first-public-claude-code-skill-the-1on1
sed -i '' "s|\./images/|/blog/${SLUG}/|g" src/content/blog-en/${SLUG}.md
```

- [ ] **Step 5: Run type check**

```bash
npx astro check
```

- [ ] **Step 6: Commit**

```bash
git add src/content/blog-en/ public/blog/
git commit -m "feat: migrate EN posts to blog-en collection"
```

---

### Task 8: Update ArrowCard to accept a custom href

**Files:**
- Modify: `src/components/ArrowCard.astro`

The default `ArrowCard` builds hrefs as `/${entry.collection}/${entry.slug}`, which would produce `/blog-es/hola-mundo` — wrong. We add an explicit `href` prop that callers always provide.

- [ ] **Step 1: Replace `src/components/ArrowCard.astro`**

```astro
---
import type { CollectionEntry } from "astro:content";

type Props = {
  entry: CollectionEntry<"blog-es"> | CollectionEntry<"blog-en">;
  href: string;
};

const { entry, href } = Astro.props;
---

<a href={href} class="relative group flex flex-nowrap py-3 px-4 pr-10 rounded-lg border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors duration-300 ease-in-out">
  <div class="flex flex-col flex-1 truncate">
    <div class="font-semibold">
      {entry.data.title}
    </div>
    <div class="text-sm">
      {entry.data.description}
    </div>
  </div>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    class="absolute top-1/2 right-2 -translate-y-1/2 size-5 stroke-2 fill-none stroke-current">
    <line x1="5" y1="12" x2="19" y2="12" class="translate-x-3 group-hover:translate-x-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out" />
    <polyline points="12 5 19 12 12 19" class="-translate-x-1 group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
  </svg>
</a>
```

- [ ] **Step 2: Run type check**

```bash
npx astro check
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ArrowCard.astro
git commit -m "feat: add explicit href prop to ArrowCard"
```

---

### Task 9: Wire up ES blog routing

**Files:**
- Create: `src/pages/es/blog/index.astro`
- Create: `src/pages/es/blog/[...slug].astro`
- Delete: `src/pages/blog/` (replaced by `src/pages/es/blog/`)

- [ ] **Step 1: Create `src/pages/es/blog/index.astro`**

```bash
mkdir -p src/pages/es/blog
```

```astro
---
import { type CollectionEntry, getCollection } from "astro:content";
import PageLayout from "@layouts/PageLayout.astro";
import Container from "@components/Container.astro";
import ArrowCard from "@components/ArrowCard.astro";
import { BLOG } from "@consts";

const data = (await getCollection("blog-es"))
  .filter(post => !post.data.draft)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

type Acc = {
  [year: string]: CollectionEntry<"blog-es">[];
};

const posts = data.reduce((acc: Acc, post) => {
  const year = post.data.date.getFullYear().toString();
  if (!acc[year]) acc[year] = [];
  acc[year].push(post);
  return acc;
}, {});

const years = Object.keys(posts).sort((a, b) => parseInt(b) - parseInt(a));
---

<PageLayout title={BLOG.TITLE} description={BLOG.DESCRIPTION}>
  <Container>
    <div class="space-y-10">
      <div class="animate font-semibold text-black dark:text-white">
        Blog
      </div>
      <div class="space-y-4">
        {years.map(year => (
          <section class="animate space-y-4">
            <div class="font-semibold text-black dark:text-white">
              {year}
            </div>
            <ul class="flex flex-col gap-4">
              {posts[year].map((post) => (
                <li>
                  <ArrowCard entry={post} href={`/es/blog/${post.slug}`} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  </Container>
</PageLayout>
```

- [ ] **Step 2: Create `src/pages/es/blog/[...slug].astro`**

```astro
---
import { type CollectionEntry, getCollection } from "astro:content";
import PageLayout from "@layouts/PageLayout.astro";
import Container from "@components/Container.astro";
import FormattedDate from "@components/FormattedDate.astro";
import { readingTime } from "@lib/utils";
import BackToPrev from "@components/BackToPrev.astro";

export async function getStaticPaths() {
  const posts = (await getCollection("blog-es"))
    .filter(post => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}
type Props = CollectionEntry<"blog-es">;

const post = Astro.props;
const { Content } = await post.render();

const enPosts = await getCollection("blog-en");
const translation = post.data.translationKey
  ? enPosts.find(p => p.data.translationKey === post.data.translationKey)
  : undefined;
---

<PageLayout title={post.data.title} description={post.data.description}>
  <Container>
    <div class="animate">
      <BackToPrev href="/es/blog">
        Volver al blog
      </BackToPrev>
    </div>
    {translation && (
      <div class="animate text-sm mt-4 opacity-75">
        <a href={`/en/blog/${translation.slug}`}>Read in English →</a>
      </div>
    )}
    <div class="space-y-1 my-10">
      <div class="animate flex items-center gap-1.5">
        <div class="font-base text-sm">
          <FormattedDate date={post.data.date} />
        </div>
        &bull;
        <div class="font-base text-sm">
          {readingTime(post.body)}
        </div>
      </div>
      <div class="animate text-2xl font-semibold text-black dark:text-white">
        {post.data.title}
      </div>
    </div>
    <article class="animate">
      <Content />
    </article>
  </Container>
</PageLayout>
```

- [ ] **Step 3: Run type check**

```bash
npx astro check
```

- [ ] **Step 4: Start dev server and verify `/blog` loads with ES posts**

```bash
npm run dev
```

Open `http://localhost:4321/es/blog` — should list 4 ES posts grouped by year. Open one post — should render content. Stop the server.

- [ ] **Step 5: Remove old blog/ directory and commit**

```bash
git rm -r src/pages/blog/
git add src/pages/es/blog/
git commit -m "feat: wire ES blog listing and post pages under /es/blog/"
```

---

### Task 10: Wire up EN blog routing

**Files:**
- Create: `src/pages/en/blog/index.astro`
- Create: `src/pages/en/blog/[...slug].astro`

- [ ] **Step 1: Create the EN blog directory**

```bash
mkdir -p src/pages/en/blog
```

- [ ] **Step 2: Create `src/pages/en/blog/index.astro`**

```astro
---
import { type CollectionEntry, getCollection } from "astro:content";
import PageLayout from "@layouts/PageLayout.astro";
import Container from "@components/Container.astro";
import ArrowCard from "@components/ArrowCard.astro";
import { BLOG } from "@consts";

const data = (await getCollection("blog-en"))
  .filter(post => !post.data.draft)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

type Acc = {
  [year: string]: CollectionEntry<"blog-en">[];
};

const posts = data.reduce((acc: Acc, post) => {
  const year = post.data.date.getFullYear().toString();
  if (!acc[year]) acc[year] = [];
  acc[year].push(post);
  return acc;
}, {});

const years = Object.keys(posts).sort((a, b) => parseInt(b) - parseInt(a));
---

<PageLayout title={BLOG.TITLE} description={BLOG.DESCRIPTION}>
  <Container>
    <div class="space-y-10">
      <div class="animate font-semibold text-black dark:text-white">
        Blog
      </div>
      <div class="space-y-4">
        {years.map(year => (
          <section class="animate space-y-4">
            <div class="font-semibold text-black dark:text-white">
              {year}
            </div>
            <ul class="flex flex-col gap-4">
              {posts[year].map((post) => (
                <li>
                  <ArrowCard entry={post} href={`/en/blog/${post.slug}`} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  </Container>
</PageLayout>
```

- [ ] **Step 3: Create `src/pages/en/blog/[...slug].astro`**

```astro
---
import { type CollectionEntry, getCollection } from "astro:content";
import PageLayout from "@layouts/PageLayout.astro";
import Container from "@components/Container.astro";
import FormattedDate from "@components/FormattedDate.astro";
import { readingTime } from "@lib/utils";
import BackToPrev from "@components/BackToPrev.astro";

export async function getStaticPaths() {
  const posts = (await getCollection("blog-en"))
    .filter(post => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}
type Props = CollectionEntry<"blog-en">;

const post = Astro.props;
const { Content } = await post.render();

const esPosts = await getCollection("blog-es");
const translation = post.data.translationKey
  ? esPosts.find(p => p.data.translationKey === post.data.translationKey)
  : undefined;
---

<PageLayout title={post.data.title} description={post.data.description}>
  <Container>
    <div class="animate">
      <BackToPrev href="/en/blog">
        Back to blog
      </BackToPrev>
    </div>
    {translation && (
      <div class="animate text-sm mt-4 opacity-75">
        <a href={`/es/blog/${translation.slug}`}>Leer en español →</a>
      </div>
    )}
    <div class="space-y-1 my-10">
      <div class="animate flex items-center gap-1.5">
        <div class="font-base text-sm">
          <FormattedDate date={post.data.date} />
        </div>
        &bull;
        <div class="font-base text-sm">
          {readingTime(post.body)}
        </div>
      </div>
      <div class="animate text-2xl font-semibold text-black dark:text-white">
        {post.data.title}
      </div>
    </div>
    <article class="animate">
      <Content />
    </article>
  </Container>
</PageLayout>
```

- [ ] **Step 4: Run type check**

```bash
npx astro check
```

- [ ] **Step 5: Start dev server and verify `/en/blog` loads with EN posts**

```bash
npm run dev
```

Open `http://localhost:4321/en/blog` — should list 2 EN posts. Open one — should render. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add src/pages/en/
git commit -m "feat: wire EN blog listing and post pages from blog-en collection"
```

---

### Task 11: Update homepage

**Files:**
- Create: `src/pages/es/index.astro`
- Delete: `src/pages/index.astro` (replaced by `src/pages/es/index.astro`; root `/` handled by Task 12's `public/index.html`)

The Nano homepage shows blog, work experience, and projects. We keep only the latest blog posts (ES) and the social links section. With `prefix-always` routing, the ES homepage lives at `/es/` (`src/pages/es/index.astro`) and root `/` redirects via `public/index.html`.

- [ ] **Step 1: Create `src/pages/es/index.astro`**

```bash
mkdir -p src/pages/es
```

```astro
---
import { getCollection } from "astro:content";
import Container from "@components/Container.astro";
import PageLayout from "@layouts/PageLayout.astro";
import ArrowCard from "@components/ArrowCard.astro";
import Link from "@components/Link.astro";
import { SITE, HOME, SOCIALS } from "@consts";

const blog = (await getCollection("blog-es"))
  .filter(post => !post.data.draft)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, SITE.NUM_POSTS_ON_HOMEPAGE);
---

<PageLayout title={HOME.TITLE} description={HOME.DESCRIPTION}>
  <Container>
    <div class="space-y-16">
      <section>
        <article class="space-y-4">
          <p class="animate">
            {HOME.DESCRIPTION}
          </p>
        </article>
      </section>

      <section class="animate space-y-6">
        <div class="flex flex-wrap gap-y-2 items-center justify-between">
          <h5 class="font-semibold text-black dark:text-white">
            Últimas entradas
          </h5>
          <Link href="/es/blog">
            Ver todas
          </Link>
        </div>
        <ul class="flex flex-col gap-4">
          {blog.map(post => (
            <li>
              <ArrowCard entry={post} href={`/es/blog/${post.slug}`} />
            </li>
          ))}
        </ul>
      </section>

      <section class="animate space-y-4">
        <h5 class="font-semibold text-black dark:text-white">
          Contacto
        </h5>
        <ul class="flex flex-wrap gap-2">
          {SOCIALS.map(SOCIAL => (
            <li class="flex gap-x-2 text-nowrap">
              <Link href={SOCIAL.HREF} external aria-label={`${SITE.NAME} on ${SOCIAL.NAME}`}>
                {SOCIAL.NAME}
              </Link>
              {"/"}
            </li>
          ))}
          <li class="line-clamp-1">
            <Link href={`mailto:${SITE.EMAIL}`} aria-label={`Email ${SITE.NAME}`}>
              {SITE.EMAIL}
            </Link>
          </li>
        </ul>
      </section>
    </div>
  </Container>
</PageLayout>
```

- [ ] **Step 2: Run type check**

```bash
npx astro check
```

Expected: 0 errors.

- [ ] **Step 3: Start dev server and verify the homepage**

```bash
npm run dev
```

Open `http://localhost:4321/es/` — should show "Divagando." text, 3 most recent ES posts, and social links. Stop the server.

- [ ] **Step 4: Remove old index.astro and commit**

```bash
git rm src/pages/index.astro
git add src/pages/es/index.astro
git commit -m "feat: move ES homepage to /es/ (src/pages/es/index.astro)"
```

---

### Task 12: Add root locale redirect

**Files:**
- Create: `public/index.html`

Root `/` is not served by Astro with `prefix-always` routing — we serve a static HTML file that JS-redirects the visitor to the right locale based on `navigator.language`. Falls back to `/es/` for non-English browsers; English browsers go to `/en/`.

- [ ] **Step 1: Create `public/index.html`**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>javi.io</title>
    <script>
      var lang = (navigator.language || navigator.userLanguage || "es").toLowerCase();
      window.location.replace(lang.startsWith("en") ? "/en/" : "/es/");
    </script>
    <noscript>
      <meta http-equiv="refresh" content="0; url=/es/" />
    </noscript>
  </head>
  <body>
    <p><a href="/es/">Ir al blog en español</a> / <a href="/en/">Go to blog in English</a></p>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add public/index.html
git commit -m "feat: add root locale redirect (navigator.language → /es/ or /en/)"
```

---

### Task 13: Inject Google Tag Manager

**Files:**
- Modify: `src/components/Head.astro`
- Modify: `src/layouts/PageLayout.astro`

- [ ] **Step 1: Add GTM `<head>` snippet to `src/components/Head.astro`**

Add this block immediately before the closing `</script>` tag of the last `<script is:inline>` block (i.e., at the very end of the file, after all existing content):

```astro
<!-- Google Tag Manager -->
<script is:inline>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N7RN8K79');
</script>
<!-- End Google Tag Manager -->
```

- [ ] **Step 2: Add GTM `<body>` noscript to `src/layouts/PageLayout.astro`**

Add this block immediately after the `<body>` opening tag:

```astro
<!-- Google Tag Manager (noscript) -->
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N7RN8K79"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>
<!-- End Google Tag Manager (noscript) -->
```

- [ ] **Step 3: Run type check**

```bash
npx astro check
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Head.astro src/layouts/PageLayout.astro
git commit -m "feat: inject GTM-N7RN8K79"
```

---

### Task 14: Add CNAME and URL redirects

**Files:**
- Create: `public/CNAME`
- Create: `public/hola-mundo!/index.html`
- Create: `public/diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio/index.html`
- Create: `public/servicios-de-pago-ofrecidos-gratuitamente-debido-al-coronavirus-covid-19/index.html`
- Create: `public/sudo-en-linux-con-touch-id-(sin-morir-en-el-intento)/index.html`
- Create: `public/my-recap-of-scrimba's-javascriptmas/index.html`
- Create: `public/building-my-first-public-claude-code-skill-the-1on1/index.html`

- [ ] **Step 1: Create `public/CNAME`**

```
javi.io
```

- [ ] **Step 2: Create redirect for `/hola-mundo!`**

```bash
mkdir -p "public/hola-mundo!"
```

Create `public/hola-mundo!/index.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; url=/es/blog/hola-mundo" />
    <link rel="canonical" href="https://javi.io/es/blog/hola-mundo" />
  </head>
  <body>
    <p>Redirecting… <a href="/es/blog/hola-mundo">/es/blog/hola-mundo</a></p>
  </body>
</html>
```

- [ ] **Step 3: Create redirect for `/diez-cosas-...`**

```bash
mkdir -p "public/diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio"
```

Create `public/diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio/index.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; url=/es/blog/diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio" />
    <link rel="canonical" href="https://javi.io/es/blog/diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio" />
  </head>
  <body>
    <p>Redirecting… <a href="/es/blog/diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio">/es/blog/diez-cosas-...</a></p>
  </body>
</html>
```

- [ ] **Step 4: Create redirect for `/servicios-de-pago-...`**

```bash
mkdir -p "public/servicios-de-pago-ofrecidos-gratuitamente-debido-al-coronavirus-covid-19"
```

Create `public/servicios-de-pago-ofrecidos-gratuitamente-debido-al-coronavirus-covid-19/index.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; url=/es/blog/servicios-de-pago-ofrecidos-gratuitamente-debido-al-coronavirus-covid-19" />
    <link rel="canonical" href="https://javi.io/es/blog/servicios-de-pago-ofrecidos-gratuitamente-debido-al-coronavirus-covid-19" />
  </head>
  <body>
    <p>Redirecting… <a href="/es/blog/servicios-de-pago-ofrecidos-gratuitamente-debido-al-coronavirus-covid-19">/es/blog/servicios-...</a></p>
  </body>
</html>
```

- [ ] **Step 5: Create redirect for `/sudo-en-linux-con-touch-id-(sin-morir-en-el-intento)`**

```bash
mkdir -p "public/sudo-en-linux-con-touch-id-(sin-morir-en-el-intento)"
```

Create `public/sudo-en-linux-con-touch-id-(sin-morir-en-el-intento)/index.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; url=/es/blog/sudo-en-linux-con-touch-id-sin-morir-en-el-intento" />
    <link rel="canonical" href="https://javi.io/es/blog/sudo-en-linux-con-touch-id-sin-morir-en-el-intento" />
  </head>
  <body>
    <p>Redirecting… <a href="/es/blog/sudo-en-linux-con-touch-id-sin-morir-en-el-intento">/es/blog/sudo-en-linux-...</a></p>
  </body>
</html>
```

- [ ] **Step 6: Create redirect for `/my-recap-of-scrimba's-javascriptmas`**

```bash
mkdir -p "public/my-recap-of-scrimba's-javascriptmas"
```

Create `public/my-recap-of-scrimba's-javascriptmas/index.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; url=/en/blog/my-recap-of-scrimbas-javascriptmas" />
    <link rel="canonical" href="https://javi.io/en/blog/my-recap-of-scrimbas-javascriptmas" />
  </head>
  <body>
    <p>Redirecting… <a href="/en/blog/my-recap-of-scrimbas-javascriptmas">/en/blog/my-recap-of-scrimbas-javascriptmas</a></p>
  </body>
</html>
```

- [ ] **Step 7: Create redirect for `/building-my-first-public-claude-code-skill-the-1on1`**

```bash
mkdir -p "public/building-my-first-public-claude-code-skill-the-1on1"
```

Create `public/building-my-first-public-claude-code-skill-the-1on1/index.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; url=/en/blog/building-my-first-public-claude-code-skill-the-1on1" />
    <link rel="canonical" href="https://javi.io/en/blog/building-my-first-public-claude-code-skill-the-1on1" />
  </head>
  <body>
    <p>Redirecting… <a href="/en/blog/building-my-first-public-claude-code-skill-the-1on1">/en/blog/building-my-first-...</a></p>
  </body>
</html>
```

- [ ] **Step 8: Commit**

```bash
git add public/CNAME "public/hola-mundo!" \
  "public/diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio" \
  "public/servicios-de-pago-ofrecidos-gratuitamente-debido-al-coronavirus-covid-19" \
  "public/sudo-en-linux-con-touch-id-(sin-morir-en-el-intento)" \
  "public/my-recap-of-scrimba's-javascriptmas" \
  "public/building-my-first-public-claude-code-skill-the-1on1"
git commit -m "feat: add CNAME and URL redirects from old Gatsby slugs"
```

---

### Task 15: Update RSS feed and deployment scripts

**Files:**
- Modify: `src/pages/rss.xml.ts`
- Modify: `package.json`

- [ ] **Step 1: Update `src/pages/rss.xml.ts` to use `blog-es`**

Open `src/pages/rss.xml.ts` and replace every reference to `"blog"` collection with `"blog-es"`, and update the site URL if present. The file should look like:

```typescript
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "@consts";

export async function GET(context: { site: URL }) {
  const posts = (await getCollection("blog-es"))
    .filter(post => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: SITE.NAME,
    description: "Divagando.",
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/es/blog/${post.slug}/`,
    })),
  });
}
```

- [ ] **Step 2: Update `package.json` scripts to add deploy**

In `package.json`, update the `"scripts"` section to add the deploy command:

```json
"scripts": {
  "dev": "astro dev",
  "dev:network": "astro dev --host",
  "build": "astro check && astro build",
  "preview": "astro preview",
  "preview:network": "astro preview --host",
  "astro": "astro",
  "deploy": "gh-pages --dotfiles -d dist",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix"
}
```

- [ ] **Step 3: Run type check**

```bash
npx astro check
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/rss.xml.ts package.json
git commit -m "feat: update RSS feed for blog-es and add deploy script"
```

---

### Task 16: Full build verification

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: completes with no errors. Output is in `dist/`.

- [ ] **Step 2: Verify key pages exist in dist**

```bash
ls dist/es/blog/
ls dist/en/blog/
ls dist/es/blog/hola-mundo/
ls dist/es/blog/diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio/
ls dist/en/blog/building-my-first-public-claude-code-skill-the-1on1/
ls dist/es/blog/diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio/index.html
```

Each should show `index.html`.

- [ ] **Step 3: Verify redirects are in dist**

```bash
ls "dist/hola-mundo!/index.html"
ls "dist/sudo-en-linux-con-touch-id-(sin-morir-en-el-intento)/index.html"
```

- [ ] **Step 4: Verify CNAME**

```bash
cat dist/CNAME
```

Expected: `javi.io`

- [ ] **Step 5: Preview the built site locally**

```bash
npm run preview
```

Manually check:
- `http://localhost:4321` — root redirect fires (JS sends browser to `/es/` or `/en/`)
- `http://localhost:4321/es/` — ES homepage loads with 3 most recent ES posts
- `http://localhost:4321/es/blog` — ES listing with 4 posts
- `http://localhost:4321/en/blog` — EN listing with 2 posts
- `http://localhost:4321/es/blog/diez-cosas-que-he-aprendido-tras-tres-anos-yendo-al-gimnasio` — gym post renders
- `http://localhost:4321/en/blog/building-my-first-public-claude-code-skill-the-1on1` — EN post renders
- `http://localhost:4321/rss.xml` — RSS feed is valid XML with ES posts linking to `/es/blog/`

Stop the server.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: verified build — Astro Nano migration complete"
```
