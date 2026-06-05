import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, "");
  const wordCount = textOnly.split(/\s+/).length;
  const readingTimeMinutes = ((wordCount / 200) + 1).toFixed();
  return `${readingTimeMinutes} min read`;
}

export function dateRange(startDate: Date, endDate?: Date | string, locale: string = "es"): string {
  const startMonth = startDate.toLocaleString(locale, { month: "short" });
  const startYear = startDate.getFullYear().toString();

  let end = "";
  if (endDate) {
    if (typeof endDate === "string") {
      end = endDate;
    } else {
      const endMonth = endDate.toLocaleString(locale, { month: "short" });
      const endYear = endDate.getFullYear().toString();
      end = `${endMonth} ${endYear}`;
    }
  }

  return `${startMonth} ${startYear} - ${end}`;
}

export function getIconMap(globResult: Record<string, unknown>): Record<string, string> {
  return Object.fromEntries(
    Object.keys(globResult).map(p => [
      p.split("/").at(-2)!,
      p.replace(/^\/public/, ""),
    ])
  );
}