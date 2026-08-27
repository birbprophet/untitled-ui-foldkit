import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { agentFace } from "../stories/fixtures/brand.ts";

import { blogSectionSimpleLeftAligned02 } from "../src/marketing/blog-section-simple-left-aligned-02.ts";
import type { BlogSectionSimpleLeftAligned02Props } from "../src/marketing/blog-section-simple-left-aligned-02.ts";

describe("blog section simple left aligned 02", () => {
  it("keeps article, author, category, tag, and view-all actions controlled", () => {
    const article = {
      author: { avatarUrl: agentFace("Olivia Rhye"), href: "#author", name: "Olivia Rhye" },
      category: { href: "#design", name: "Design" },
      href: "#article",
      id: "article-1",
      isFeatured: true,
      publishedAt: "20 Jan 2027",
      readingTime: "8 min read",
      summary: "How do you create compelling presentations that impress your managers?",
      tags: [{ color: "brand", href: "#design", name: "Design" }],
      thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
      title: "UX review presentations",
    } as const;
    const props: BlogSectionSimpleLeftAligned02Props<string> = {
      articles: [article],
      description: "The latest industry news, interviews, technologies, and resources.",
      heading: "From the blog",
      onArticle: (id) => `article:${id}`,
      onAuthor: (id) => `author:${id}`,
      onCategory: (id) => `category:${id}`,
      onTag: (id, tag) => `tag:${id}:${tag.name}`,
      onViewAll: "view-all",
      viewAllLabel: "View all posts",
    };

    expect([
      props.onArticle(article.id),
      props.onAuthor(article.id),
      props.onCategory(article.id),
      props.onTag(article.id, article.tags[0]),
      props.onViewAll,
    ]).toEqual([
      "article:article-1",
      "author:article-1",
      "category:article-1",
      "tag:article-1:Design",
      "view-all",
    ]);
    expect(blogSectionSimpleLeftAligned02).toBeTypeOf("function");
  });
});
