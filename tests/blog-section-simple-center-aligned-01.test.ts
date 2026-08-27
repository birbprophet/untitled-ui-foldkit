import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { agentFace } from "../stories/fixtures/brand.ts";

import { blogSectionSimpleCenterAligned01 } from "../src/marketing/blog-section-simple-center-aligned-01.ts";
import type { BlogSectionSimpleCenterAligned01Props } from "../src/marketing/blog-section-simple-center-aligned-01.ts";

describe("blog section simple center aligned 01", () => {
  it("keeps source copy, articles, and actions controlled", () => {
    const props = {
      articles: [
        {
          author: { avatarUrl: agentFace("Olivia Rhye"), href: "#author", name: "Olivia Rhye" },
          category: { href: "#category", name: "Design" },
          href: "#article",
          id: "article-1",
          publishedAt: "20 Jan 2027",
          readingTime: "8 min read",
          summary:
            "How do you create compelling presentations that wow your colleagues and impress your managers?",
          tags: [{ color: "brand", href: "#tag", name: "Design" }],
          thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
          title: "UX review presentations",
        },
      ],
      description: "Interviews, tips, guides, industry best practices, and news.",
      eyebrow: "Latest posts",
      heading: "Siglata blog",
      onArticle: () => "article",
      onAuthor: () => "author",
      onCategory: () => "category",
      onTag: () => "tag",
      onViewAll: "view-all",
      viewAllLabel: "View all posts",
    } satisfies BlogSectionSimpleCenterAligned01Props<string>;

    expect(props).toMatchObject({
      description: "Interviews, tips, guides, industry best practices, and news.",
      eyebrow: "Latest posts",
      heading: "Siglata blog",
      onViewAll: "view-all",
    });
    expect(blogSectionSimpleCenterAligned01).toBeTypeOf("function");
  });
});
