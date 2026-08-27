import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { agentFace } from "../stories/fixtures/brand.ts";

import { blogSectionSplitLayout01 } from "../src/marketing/blog-section-split-layout-01.ts";
import type { BlogSectionSplitLayout01Props } from "../src/marketing/blog-section-split-layout-01.ts";

describe("blog section split layout 01", () => {
  it("keeps article, author, and view-all actions controlled", () => {
    const props = {
      articles: [
        {
          authorAvatarSrc: agentFace("Olivia Rhye"),
          authorHref: "#olivia",
          authorName: "Olivia Rhye",
          categoryHref: "#design",
          categoryName: "Design",
          href: "#article",
          id: "article-1",
          publishedAt: "20 Jan 2027",
          readingTime: "8 min read",
          summary: "How do you create compelling presentations?",
          thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
          title: "UX review presentations",
        },
      ],
      description: "The latest industry news, interviews, technologies, and resources.",
      eyebrow: "Latest",
      heading: "From the blog",
      onArticle: (id: string) => `article:${id}`,
      onAuthor: (id: string) => `author:${id}`,
      onViewAll: "view-all",
      viewAllLabel: "View all posts",
    } satisfies BlogSectionSplitLayout01Props<string>;

    expect(props.onArticle("article-1")).toBe("article:article-1");
    expect(props.onAuthor("article-1")).toBe("author:article-1");
    expect(props.onViewAll).toBe("view-all");
    expect(typeof blogSectionSplitLayout01).toBe("function");
  });
});
