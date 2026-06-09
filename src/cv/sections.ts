export const SECTIONS = {
  en: {
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    updated: 'Updated',
    present: 'Present',
  },
  es: {
    experience: 'Experiencia',
    education: 'Educación',
    skills: 'Conocimientos',
    updated: 'Actualizado',
    present: 'Actualidad',
  },
} as const;

export type Lang = keyof typeof SECTIONS;
