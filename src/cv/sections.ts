export const SECTIONS = {
  en: {
    summary: "Summary",
    experience: "Professional Experience",
    skills: "Skills",
    education: "Education",
    updated: "Updated",
    present: "Present",
  },
  es: {
    summary: "Resumen profesional",
    experience: "Experiencia profesional",
    skills: "Aptitudes",
    education: "Educación",
    updated: "Actualizado",
    present: "Actualidad",
  },
} as const;

export type Lang = keyof typeof SECTIONS;
