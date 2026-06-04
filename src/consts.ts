import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Hic sunt dracones",
  EMAIL: "javierzapata82@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 3,
  NUM_PROJECTS_ON_HOMEPAGE: 2,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Divagando.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Divagando.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "A collection of my projects, with links to repositories and demos.",
};

export const AUTHOR = {
  NAME: "Javier Zapata",
  BIO: "Soy un desarrollador Full Stack, diseñador de UX/UI y –aprendiz de– CRO que lleva cerca de 20 años ayudando a marcas a crecer.",
  AVATAR: "/avatar.jpg",
};

export const SOCIALS: Socials = [
  { NAME: "linkedin", HREF: "https://www.linkedin.com/in/jzfgo" },
  { NAME: "github",   HREF: "https://github.com/jzfgo" },
  { NAME: "twitter",  HREF: "https://twitter.com/jzfgo" },
  { NAME: "instagram", HREF: "https://instagram.com/jzfgo" },
];
