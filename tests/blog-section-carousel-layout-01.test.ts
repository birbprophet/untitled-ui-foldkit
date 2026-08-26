import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { blogSectionCarouselLayout01 } from "../src/marketing/blog-section-carousel-layout-01.ts";
import type { BlogSectionCarouselLayout01Props } from "../src/marketing/blog-section-carousel-layout-01.ts";

describe("blog section carousel layout 01", () => {
  it("keeps carousel position and article actions controlled", () => {
    const props = {
      activeIndex: 0,
      articles: [
        {
          author: { href: "#olivia", name: "Olivia Rhye" },
          category: { href: "#design", name: "Design" },
          href: "#article",
          id: "article-1",
          publishedAt: "20 Jan 2027",
          readingTime: "8 min read",
          summary: "Presentation guidance.",
          thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
          title: "UX review presentations",
        },
      ],
      description: "Interviews, tips, guides, industry best practices, and news.",
      eyebrow: "Latest posts",
      heading: "Siglata blog",
      nextLabel: "Next slide",
      onArticle: (id: string) => `article:${id}`,
      onAuthor: (id: string) => `author:${id}`,
      onCategory: (id: string) => `category:${id}`,
      onNext: "next",
      onPrevious: "previous",
      onViewAll: "view-all",
      previousLabel: "Previous slide",
      viewAllHref: "#all-posts",
      viewAllLabel: "View all posts",
    } satisfies BlogSectionCarouselLayout01Props<string>;
    expect(props.onArticle("article-1")).toBe("article:article-1");
    expect(props.onAuthor("article-1")).toBe("author:article-1");
    expect(props.onCategory("article-1")).toBe("category:article-1");
    expect(props.onNext).toBe("next");
    expect(props.onPrevious).toBe("previous");
    expect(props.onViewAll).toBe("view-all");
    expect(blogSectionCarouselLayout01).toBeTypeOf("function");
  });
});
