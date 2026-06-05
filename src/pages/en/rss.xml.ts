import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { HOME_EN as HOME } from "@consts";

export async function GET(context: APIContext) {
  const blog = (await getCollection("blog-en"))
  .filter(post => !post.data.draft);

  return rss({
    title: HOME.TITLE,
    description: HOME.DESCRIPTION,
    site: context.site ? context.site.toString() : "",
    items: blog
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: new URL(`/en/blog/${post.slug}`, context.site ?? "https://javi.io").toString(),
      })),
  });
}
