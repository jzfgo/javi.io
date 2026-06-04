# Post-Migration TODO

Tasks deferred from the Astro Nano migration (see [migration design spec](specs/2026-06-04-astro-migration-design.md)). Each item has enough context to be picked up independently after the migration is live.

---

## 1. Hero images

**What was deferred:** Each Gatsby post had a `hero` frontmatter field pointing to a local image (`./images/hero.jpg`). Astro Nano has no hero image support out of the box, so the field was dropped entirely for the migration.

**Current state:** Post images are stored in `public/blog/<slug>/` and referenced via absolute paths in post body content. The hero images exist in the repo at `content/posts/<old-slug>/images/` and can be moved.

**What to do:**
1. Add an optional `hero: z.string().optional()` field to the shared collection schema in `src/content/config.ts`
2. Move each post's hero image to `public/blog/<slug>/`
3. Update the post card component to render a hero image when present
4. Update the post layout to render the hero image at the top of the article
5. Use Astro's `<Image>` component (`astro:assets`) for optimization where possible

---

## 2. Visual customization

**What was deferred:** Astro Nano defaults were kept as-is. No color, font, or layout changes were made during migration.

**Current state:** The site uses Astro Nano's default Tailwind config and typography. The original Novela theme had a distinct aesthetic: large serif headings in post content, clean card-based listing, implicit dark mode support.

**What to do:** Open-ended — revisit once the content is live and you have a feel for what to change. Entry points:
- `tailwind.config.mjs` — colors, font families, typography scale
- `src/styles/global.css` — base styles
- Astro Nano uses `@tailwindcss/typography` for prose — configure the `prose` class to match your preferred reading style

---

## 3. Nav-level language switcher

**What was deferred:** The post layout shows a link to the translated version of a post when one exists (via the `translationKey` frontmatter field). There is no language indicator in the site header or navigation.

**Current state:** A reader on `/blog/diez-cosas-...` will see a link to `/en/blog/ten-things-...` if the EN translation exists — but only while reading a post. The nav has no language context.

**What to do:**
1. Add a language switcher to the site header component
2. On post pages: link directly to the equivalent translation (already resolvable via `translationKey`)
3. On listing pages (`/blog`, `/en/blog`): link to the equivalent listing in the other language
4. On other pages: link to the home in the other language
5. Keep it minimal — a simple `ES / EN` toggle is enough

---

## 4. GitHub Actions deployment

**What was deferred:** Deployment is manual — `npm run deploy` runs `astro build` then `gh-pages --dotfiles -d dist`.

**Current state:** The workflow works but requires running locally. The deploy script is in `package.json`.

**What to do:** Create `.github/workflows/deploy.yml` that triggers on push to `master`, runs `astro build`, and pushes `dist/` to the `gh-pages` branch. The CNAME file lives in `public/` so it is included in the build output automatically.

---

## 5. About / Author page

**What was deferred:** Novela had a dedicated author page at `/author/javier-zapata` with bio, avatar, and post list. This was not migrated.

**Current state:** Author data exists in `content/authors/authors.yml` (name, bio, avatar path, social links). The `author` field was dropped from post frontmatter since the site has a single author. Astro Nano has no author page by default.

**What to do:**
1. Move author data into `src/consts.ts` (fits naturally alongside `SITE` metadata) or keep as a content file — either works for a single-author site
2. Create a simple `src/pages/about.astro` page with bio, avatar, and social links
3. Optionally add an "About" link to the site nav
4. The avatar image is at `content/authors/avatars/jzfgo.jpg` — move it to `public/`
