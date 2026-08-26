import { describe, it } from "@effect/vitest";

import {
  blogSectionCarouselLayout02,
  blogSectionCarouselLayout02Articles,
} from "../src/marketing/blog-section-carousel-layout-02.ts";
import type { BlogSectionCarouselLayout02Props } from "../src/marketing/blog-section-carousel-layout-02.ts";
import { expect } from "./assertions.ts";

describe("blog section carousel layout 02", () => {
  it("preserves the source articles and controlled carousel actions", () => {
    const props = {
      articles: blogSectionCarouselLayout02Articles,
      description: "The latest news, technologies, and resources from our team.",
      heading: "Latest writings",
      nextLabel: "Next slide",
      onArticle: (id: string) => `article:${id}`,
      onCategory: (id: string) => `category:${id}`,
      onNext: "next",
      onPrevious: "previous",
      onTag: (id: string, tag: string) => `tag:${id}:${tag}`,
      onViewAll: "view-all",
      previousLabel: "Previous slide",
      selectedIndex: 0,
      viewAllLabel: "View all posts",
    } satisfies BlogSectionCarouselLayout02Props<string>;

    expect(blogSectionCarouselLayout02Articles).toHaveLength(9);
    expect(blogSectionCarouselLayout02Articles.slice(0, 4)).toHaveLength(4);
    expect(blogSectionCarouselLayout02Articles[0]?.title).toBe("UX review presentations");
    expect(blogSectionCarouselLayout02Articles[3]?.thumbnailUrl).toBe(
      "https://www.untitledui.com/blog/two-people.webp",
    );
    expect(props.onArticle("article-1")).toBe("article:article-1");
    expect(props.onCategory("article-2")).toBe("category:article-2");
    expect(props.onTag("article-1", "Design")).toBe("tag:article-1:Design");
    expect(props.onNext).toBe("next");
    expect(blogSectionCarouselLayout02).toBeTypeOf("function");
  });
});
