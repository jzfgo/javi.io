// scripts/cv-meta.mjs
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

export function computeCvMeta() {
  const workDirs = ["src/content/work-en", "src/content/work-es"];
  const files = workDirs
    .flatMap((dir) =>
      readdirSync(dir)
        .filter((f) => f.endsWith(".md"))
        .sort()
        .map((f) => join(dir, f)),
    )
    .sort();

  const hashInput = files.map((f) => readFileSync(f, "utf-8")).join("");
  const hash = createHash("sha256").update(hashInput).digest("hex").slice(0, 8);

  let updated = "";
  try {
    updated = execSync(
      "git log -1 --format=%cd --date=short -- src/content/work-en src/content/work-es src/content/profile src/content/education",
      { encoding: "utf-8" },
    ).trim();
  } catch {
    // no git or no commits — fall back to today
  }
  if (!updated || !/^\d{4}-\d{2}-\d{2}$/.test(updated)) {
    updated = new Date().toISOString().slice(0, 10);
  }

  return { hash, updated };
}
