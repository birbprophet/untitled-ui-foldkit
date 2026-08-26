import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { blogHeaderFeaturedPost01 } from "../src/marketing/blog-header-featured-post-01.ts";
import type { BlogHeaderFeaturedPost01Props } from "../src/marketing/blog-header-featured-post-01.ts";

describe("blog header featured post 01", () => {
  it("keeps filtering, sorting, paging, and article navigation controlled", () => {
    const article = {
      author: { avatarSeed: "amelie-laurent", href: "#author", name: "Amélie Laurent" },
      category: { href: "#design", name: "Design" },
      href: "#article",
      id: "article-001",
      publishedAt: "10 April 2027",
      readingTime: "8 min read",
      summary: "Tools and trends change, but good design is timeless.",
      tags: [{ href: "#design", name: "Design" }],
      thumbnailUrl: "https://www.untitledui.com/marketing/blog-featured-post-01.webp",
      title: 'Improve your design skills: Develop an "eye" for design',
    } as const;
    const props: BlogHeaderFeaturedPost01Props<string> = {
      articles: [article],
      description: "The latest industry news, interviews, technologies, and resources.",
      eyebrow: "Our blog",
      featuredArticle: article,
      heading: "Resources and insights",
      onArticle: (id) => `article:${id}`,
      onPage: (page) => `page:${String(page)}`,
      onSort: (id) => `sort:${id}`,
      onTab: (id) => `tab:${id}`,
      page: 1,
      pageCount: 10,
      selectedSort: "recent",
      selectedTab: "all",
      sortLabel: "Sort by",
      sortOptions: [{ id: "recent", label: "Most recent" }],
      tabs: [{ id: "all", label: "View all" }],
    };

    expect([
      props.onArticle(article.id),
      props.onTab("design"),
      props.onSort("popular"),
      props.onPage(2),
    ]).toEqual(["article:article-001", "tab:design", "sort:popular", "page:2"]);
    expect(blogHeaderFeaturedPost01).toBeTypeOf("function");
  });
});
