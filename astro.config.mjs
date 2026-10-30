import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { computeCvMeta } from "./scripts/cv-meta.mjs";

const { hash: CV_HASH, updated: CV_UPDATED } = computeCvMeta();

export default defineConfig({
  site: "https://javi.io",
  integrations: [
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
    define: {
      "import.meta.env.PUBLIC_CV_HASH": JSON.stringify(CV_HASH),
      "import.meta.env.PUBLIC_CV_UPDATED": JSON.stringify(CV_UPDATED),
    },
    resolve: {
      alias: {
        "@cv": resolve("./src/cv"),
      },
    },
  },
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
