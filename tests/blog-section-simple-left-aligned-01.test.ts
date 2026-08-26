import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { blogSectionSimpleLeftAligned01 } from "../src/marketing/blog-section-simple-left-aligned-01.ts";
import type { BlogSectionSimpleLeftAligned01Props } from "../src/marketing/blog-section-simple-left-aligned-01.ts";

describe("blog section simple left aligned 01", () => {
  it("keeps article, author, and view-all actions distinct", () => {
    const props: BlogSectionSimpleLeftAligned01Props<string> = {
      articles: [
        {
          authorHref: "#olivia",
          authorName: "Olivia Rhye",
          avatarUrl: "/olivia.webp",
          category: "Design",
          href: "#article",
          id: "article-1",
          publishedAt: "20 Jan 2027",
          summary: "How do you create compelling presentations?",
          thumbnailUrl: "/spirals.webp",
          title: "UX review presentations",
        },
      ],
      description: "Tool and strategies modern teams need to help their companies grow.",
      eyebrow: "Our blog",
      heading: "Latest blog posts",
      onArticle: (id) => `article:${id}`,
      onAuthor: (id) => `author:${id}`,
      onViewAll: "view-all",
      viewAllLabel: "View all posts",
    };
    expect(props.onArticle("article-1")).toBe("article:article-1");
    expect(props.onAuthor("article-1")).toBe("author:article-1");
    expect(props.onViewAll).toBe("view-all");
    expect(blogSectionSimpleLeftAligned01).toBeTypeOf("function");
  });
});
