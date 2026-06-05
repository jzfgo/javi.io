import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  NAME: "Hic sunt dracones",
  EMAIL: "javierzapata82@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 3,
  NUM_PROJECTS_ON_HOMEPAGE: 2,
};

export const HOME_EN: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Divagando.",
};

export const HOME_ES: Metadata = {
  TITLE: "Inicio",
  DESCRIPTION: "Divagando.",
};

export const BLOG_EN: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Posts on tech, design, and whatever else.",
};

export const BLOG_ES: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Posts sobre tecnología, diseño y lo que sea.",
};

export const WORK_EN: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const WORK_ES: Metadata = {
  TITLE: "Experiencia",
  DESCRIPTION: "Dónde he trabajado y qué he hecho.",
};

export const PROJECTS_EN: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "A collection of my projects, with links to repositories and demos.",
};

export const PROJECTS_ES: Metadata = {
  TITLE: "Proyectos",
  DESCRIPTION: "Una colección de mis proyectos, con enlaces a repositorios y demos.",
};

export const AUTHOR = {
  NAME: "Javier Zapata",
  BIO_EN:
    "Developer, tech lead, recovering designer. 20 years of shipping things. Still learning.",
  BIO_ES:
    "Desarrollador, tech lead, diseñador en recuperación. 20 años lanzando cosas. Aún aprendiendo.",
  AVATAR: "/avatar.jpg",
};

export const SOCIALS: Socials = [
  { NAME: "linkedin", HREF: "https://www.linkedin.com/in/jzfgo" },
  { NAME: "github", HREF: "https://github.com/jzfgo" },
  { NAME: "twitter", HREF: "https://twitter.com/jzfgo" },
  { NAME: "instagram", HREF: "https://instagram.com/jzfgo" },
];
