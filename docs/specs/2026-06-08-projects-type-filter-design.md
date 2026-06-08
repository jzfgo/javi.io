# Projects Type Filter — Design Spec

**Date:** 2026-06-08  
**Branch:** feat/content-review  

## Goal

Distinguish personal projects from professional ones on the projects section of javi.io. Both types remain equally visible — the distinction adds context, not hierarchy.

## Data Model

Add a required `type` field to `projectsSchema` in `src/content.config.ts`:

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

The field is **required** so Astro's content layer throws a build error if any project is published without a type tag.

### Project categorizations

| Project | Type |
|---|---|
| agents | personal |
| carroquesi | personal |
| bahiazul-website | professional |
| english-monstruo | professional |
| fly-fut-ligas | professional |
| fly-fut-pro | professional |
| fuera-de-juego | professional |
| minerales-de-la-liga | professional |
| porcelanosa-ecommerce | professional |
| quadrant-travel-cloud | professional |

All 10 project directories exist in both `projects-en` and `projects-es` — both sets of frontmatter files get the `type:` field added.

## UI — Filter Tabs

Both `/en/projects/index.astro` and `/es/projects/index.astro` get filter tabs above the project list.

**Tabs:**
- English: `All` | `Professional` | `Personal`
- Spanish: `Todos` | `Profesional` | `Personal`

**Active tab style:** bold text + 2px bottom border using `text-black dark:text-white` (the site's default foreground), matching the existing typographic style.

**Type label on rows:** In the "All" view, a small muted uppercase label (e.g. `professional`) appears as a sibling element inside the `<li>`, after the `<ArrowCard>`. It is rendered server-side by Astro — `ArrowCard` itself is not modified. When a type tab is active, the label is hidden — the tab itself already communicates the type.

**Markup:** Each `<li>` in the project list gets a `data-type` attribute (value: `"professional"` or `"personal"`) rendered server-side by Astro.

## JS Behavior

An `is:inline` script is added to both projects index pages. It does three things:

1. **On load** — reads `?type=` from `window.location.search`. If `professional` or `personal`, hides non-matching `<li>` items and marks the correct tab active. If absent or `all`, shows everything.

2. **On tab click** — calls `history.pushState` to update the URL without a page reload, then re-runs the filter. Enables shareable URLs and a working back button.

3. **Filter logic** — toggles `display: none` on non-matching items and swaps type label visibility.

No external dependencies. Graceful degradation: if JS is disabled, all projects show and tabs are inert.

## Out of Scope

- Homepage project previews (`NUM_PROJECTS_ON_HOMEPAGE`) — these show the N most recent projects regardless of type; no filter needed there.
- Individual project detail pages — no type-related UI changes.
- `consts.ts` — tab labels live in the page files, not in constants.
