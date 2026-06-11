export const SECTIONS = {
  en: {
    summary: "Summary",
    experience: "Professional Experience",
    skills: "Skills",
    education: "Certifications",
    updated: "Updated",
    present: "Present",
  },
  es: {
    summary: "Resumen profesional",
    experience: "Experiencia profesional",
    skills: "Aptitudes",
    education: "Certificaciones",
    updated: "Actualizado",
    present: "Actualidad",
  },
} as const;

export type Lang = keyof typeof SECTIONS;
