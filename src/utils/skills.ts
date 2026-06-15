const HALF_LIFE_YEARS = 3;
const MAX_TECH_AGE_YEARS = 5;
const RECENCY_THRESHOLD = Math.pow(0.5, MAX_TECH_AGE_YEARS / HALF_LIFE_YEARS);
const DEFAULT_LIMIT = 25;

export type SkillEntry = { skills?: string[]; date: Date };

function decayScore(date: Date): number {
  const yearsAgo = Math.max(0, (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  return Math.pow(0.5, yearsAgo / HALF_LIFE_YEARS);
}

export function computeSkillWeights(entries: SkillEntry[], limit = DEFAULT_LIMIT): string[] {
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
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name]) => name);
}
