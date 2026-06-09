import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  NAME: "Hic sunt dracones",
  EMAIL: "javierzapata82@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 3,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME_EN: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Developer, tech lead, recovering designer. 20 years shipping things.",
};

export const HOME_ES: Metadata = {
  TITLE: "Inicio",
  DESCRIPTION: "Desarrollador, tech lead, diseñador en rehabilitación. 20 años construyendo cosas.",
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
  DESCRIPTION:
    "A collection of my projects, with links to repositories and demos.",
};

export const PROJECTS_ES: Metadata = {
  TITLE: "Proyectos",
  DESCRIPTION:
    "Una colección de mis proyectos, con enlaces a repositorios y demos.",
};

export const CREDITS_EN: Metadata = {
  TITLE: "Credits",
  DESCRIPTION:
    "Acknowledgements and attribution for third-party work used in this site.",
};

export const CREDITS_ES: Metadata = {
  TITLE: "Créditos",
  DESCRIPTION:
    "Agradecimientos y atribución del trabajo de terceros utilizado en este sitio.",
};

export const AUTHOR = {
  NAME: "Javier Zapata",
  BIO_EN:
    "I’m a developer, tech lead, and recovering designer that has been shipping things for more than 20 years. Still learning, though.",
  BIO_ES:
    "Soy desarrollador, tech lead y diseñador en rehabilitación que lleva más de 20 años lanzando cosas. Aun así, sigo aprendiendo.",
  AVATAR: "/avatar.jpg",
};

export const SOCIALS: Socials = [
  { NAME: "linkedin", HREF: "https://www.linkedin.com/in/jzfgo" },
  { NAME: "github", HREF: "https://github.com/jzfgo" },
  { NAME: "twitter", HREF: "https://twitter.com/jzfgo" },
  { NAME: "instagram", HREF: "https://instagram.com/jzfgo" },
];
