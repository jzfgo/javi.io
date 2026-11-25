// scripts/test-filters.mjs
//
// Regression test for the ?type= filter tabs on /work and /projects and for
// the language switch carrying the active filter over. Both have broken
// before after ClientRouter navigations (#28, #56), and nothing in
// `pnpm build` can catch it: the bugs only show up in a real browser.
//
// Runs against the built site, so run `pnpm build` first.
//   pnpm test:e2e
//   PW_CHANNEL=chrome pnpm test:e2e   # use the installed Chrome locally
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import assert from "node:assert/strict";

const PORT = 4399;
const BASE = `http://localhost:${PORT}`;

if (!existsSync("dist/index.html")) {
  console.error("Error: dist/ not found. Did you run pnpm build first?");
  process.exit(1);
}

const server = spawn("pnpm", ["exec", "astro", "preview", "--port", String(PORT)], {
  stdio: ["ignore", "pipe", "inherit"],
  detached: true,
});

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(BASE);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`astro preview did not start on port ${PORT}`);
}

let failures = 0;
async function step(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failures++;
    console.log(`  ✗ ${name}\n    ${err.message.split("\n").join("\n    ")}`);
  }
}

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
  const page = await browser.newPage();

  /** State of the filter UI as a user sees it. */
  const state = () => page.evaluate(() => {
    const visible = sel => {
      const el = document.querySelector(sel);
      return el ? el.checkVisibility() : null;
    };
    const lang = new URL(document.querySelector("a[data-lang-switch]").href);
    return {
      path: location.pathname.replace(/\/$/, "") + location.search,
      selected: document.querySelector("[data-filter-tabs] [aria-selected=\"true\"]")?.dataset.filter,
      work: visible("#work-content"),
      certs: visible("#certs-content"),
      divider: visible("#work-certs-divider"),
      certsTitle: visible("#certs-title"),
      projects: Array.from(document.querySelectorAll("#project-list li"))
        .filter(li => li.checkVisibility())
        .map(li => li.dataset.filterShow.split(" ")[1]),
      typeLabels: Array.from(document.querySelectorAll("#project-list .type-label"))
        .some(el => el.checkVisibility()),
      lang: lang.pathname.replace(/\/$/, "") + lang.search,
    };
  });

  // A ClientRouter navigation finishes with astro:page-load; wait for it
  // rather than for the URL, which changes before the new page is swapped in.
  // The pathname check keeps a page-load left over from an earlier
  // navigation from passing for this one.
  async function navigateBy(action) {
    const from = await page.evaluate(() => {
      window.__pageLoaded = false;
      document.addEventListener("astro:page-load", () => { window.__pageLoaded = true; }, { once: true });
      return location.pathname;
    });
    await action();
    await page.waitForFunction(
      from => window.__pageLoaded === true && location.pathname !== from,
      from,
    );
  }
  const switchLanguage = () => navigateBy(() => page.click("a[data-lang-switch]"));

  console.log("/work");

  await step("a hard load of ?type=certifications shows only certifications", async () => {
    await page.goto(`${BASE}/work?type=certifications`);
    const s = await state();
    assert.equal(s.selected, "certifications");
    assert.deepEqual([s.work, s.certs, s.divider, s.certsTitle], [false, true, false, false]);
  });

  await step("the language link carries the filter before it is clicked", async () => {
    assert.equal((await state()).lang, "/en/work?type=certifications");
  });

  await step("switching language keeps the filter", async () => {
    await switchLanguage();
    const s = await state();
    assert.equal(s.path, "/en/work?type=certifications");
    assert.equal(s.selected, "certifications");
    assert.deepEqual([s.work, s.certs], [false, true]);
  });

  await step("tabs still respond after the switch, and the language link follows", async () => {
    await page.click("#tab-work");
    let s = await state();
    assert.equal(s.path, "/en/work?type=work");
    assert.deepEqual([s.work, s.certs], [true, false]);
    assert.equal(s.lang, "/work?type=work");

    await page.click("#tab-all");
    s = await state();
    assert.equal(s.path, "/en/work");
    assert.deepEqual([s.work, s.certs, s.divider, s.certsTitle], [true, true, true, true]);
    assert.equal(s.lang, "/work");
  });

  await step("back restores the previous filter", async () => {
    await page.goBack();
    await page.waitForFunction(() => location.search === "?type=work");
    const s = await state();
    assert.equal(s.selected, "work");
    assert.deepEqual([s.work, s.certs], [true, false]);
    assert.equal(s.lang, "/work?type=work");
  });

  await step("switching back keeps the filter, and tabs still respond", async () => {
    await switchLanguage();
    let s = await state();
    assert.equal(s.path, "/work?type=work");
    assert.equal(s.selected, "work");

    await page.click("#tab-certifications");
    s = await state();
    assert.equal(s.path, "/work?type=certifications");
    assert.deepEqual([s.work, s.certs], [false, true]);
  });

  await step("arrow keys move between tabs", async () => {
    await page.focus("#tab-certifications");
    await page.keyboard.press("ArrowRight");
    const s = await state();
    assert.equal(s.selected, "all");
    assert.equal(s.path, "/work");
  });

  await step("an unknown ?type= falls back to all", async () => {
    await page.goto(`${BASE}/en/work?type=bogus`);
    const s = await state();
    assert.equal(s.selected, "all");
    assert.deepEqual([s.work, s.certs], [true, true]);
  });

  console.log("/projects");

  await step("?type=personal shows only personal projects, without type labels", async () => {
    await page.goto(`${BASE}/en/projects?type=personal`);
    const s = await state();
    assert.equal(s.selected, "personal");
    assert.ok(s.projects.length > 0, "no project visible");
    assert.ok(s.projects.every(t => t === "personal"), `visible: ${s.projects}`);
    assert.equal(s.typeLabels, false);
  });

  await step("switching language keeps the filter, and tabs still respond", async () => {
    await switchLanguage();
    let s = await state();
    assert.equal(s.path, "/projects?type=personal");
    assert.equal(s.selected, "personal");

    await page.click("#tab-all");
    s = await state();
    assert.equal(s.path, "/projects");
    assert.ok(s.projects.includes("personal") && s.projects.includes("professional"));
    assert.equal(s.typeLabels, true);
  });

  console.log("other pages");

  await step("leaving a filtered page drops ?type= from the language link", async () => {
    await page.goto(`${BASE}/work?type=work`);
    await navigateBy(() => page.click("header a[href=\"/blog\"]"));
    assert.equal((await state()).lang, "/en/blog");
  });
} finally {
  await browser?.close();
  // detached + negative pid kills pnpm and the astro process it spawned.
  try { process.kill(-server.pid); } catch { /* already gone */ }
}

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log("\nAll filter checks passed");
