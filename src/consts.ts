import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  NAME: "Hic sunt dracones",
  EMAIL: "javierzapata82@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 2,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 2,
};

export const HOME_EN: Metadata = {
  TITLE: "Javier Zapata — Software Developer & Tech Lead",
  DESCRIPTION:
    "Developer, tech lead, recovering designer. 20 years shipping things.",
};

export const HOME_ES: Metadata = {
  TITLE: "Javier Zapata — Desarrollador & Tech Lead",
  DESCRIPTION:
    "Desarrollador, tech lead, diseñador en rehabilitación. 20 años construyendo cosas.",
};

export const BLOG_EN: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Posts on tech, design, and whatever else.",
  TAGLINE: "Rambling.",
};

export const BLOG_ES: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Posts sobre tecnología, diseño y lo que sea.",
  TAGLINE: "Divagando.",
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
  H1_EN: "Hi, I’m Javi.",
  H1_ES: "Hola, soy Javi.",
  BIO_EN:
    "I’m a developer, tech lead, and recovering designer who has been shipping things for more than 20 years. Still learning, though.",
  BIO_ES:
    "Soy desarrollador, tech lead y diseñador en rehabilitación que lleva más de 20 años lanzando cosas. Aun así, sigo aprendiendo.",
  PRODUCT_EN:
    "I build products people actually want to use, not just software that technically works.",
  PRODUCT_ES:
    "Construyo productos que la gente quiere usar, no solo software que técnicamente funciona.",
  BRIDGE_EN:
    "Here you’ll find what I’m working on, what I’ve built, and the occasional write-up about code, AI, and tooling.",
  BRIDGE_ES:
    "Aquí encontrarás en qué trabajo, qué he construido y algún que otro artículo sobre código, IA y herramientas.",
  AVATAR: "/avatar.jpg",
};

export const SOCIALS: Socials = [
  { NAME: "linkedin", HREF: "https://www.linkedin.com/in/jzfgo" },
  { NAME: "github", HREF: "https://github.com/jzfgo" },
  { NAME: "twitter", HREF: "https://twitter.com/jzfgo" },
  { NAME: "instagram", HREF: "https://instagram.com/jzfgo" },
];
