import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function readingTime(markdown: string): number {
  const noCodeBlocks = markdown.replace(/```[\s\S]*?```/g, "");
  const noInlineCode = noCodeBlocks.replace(/`[\s\S]*?`/g, "");
  const textOnly = noInlineCode.replace(/<[^>]+>/g, "");
  const wordCount = textOnly.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function dateRange(startDate: Date, endDate?: Date | string, locale: string = "es"): string {
  const startMonth = startDate.toLocaleString(locale, { month: "short", timeZone: "UTC" });
  const startYear = startDate.getUTCFullYear().toString();

  let end = "";
  if (endDate) {
    if (typeof endDate === "string") {
      end = locale === "es" ? "Actualidad" : "Current";
    } else {
      const endMonth = endDate.toLocaleString(locale, { month: "short", timeZone: "UTC" });
      const endYear = endDate.getUTCFullYear().toString();
      end = `${endMonth} ${endYear}`;
    }
  }

  return end ? `${startMonth} ${startYear} - ${end}` : `${startMonth} ${startYear}`;
}

export function idToSlug(id: string): string {
  return id.replace(/(?:^|\/)index\.(md|mdx)$/, "").replace(/\.(md|mdx)$/, "") || "index";
}

export function getIconMap(globResult: Record<string, { default: { src: string } }>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(globResult).map(([p, mod]) => {
      const filename = p.split("/").at(-1)!;
      // folder-based icons (work): key is the parent folder name
      // flat icons (education institutions): key is the filename without extension
      const key = filename.startsWith("icon.")
        ? p.split("/").at(-2)!
        : filename.replace(/\.[^.]+$/, "");
      return [key, mod.default.src];
    })
  );
}

export function institutionToSlug(institution: string): string {
  return institution
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
