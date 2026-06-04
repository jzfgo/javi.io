import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://javi.io",
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: "es",
        locales: { es: "es", en: "en" },
      },
    }),
    tailwind(),
  ],
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: "prefix-always",
  },
});
