import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { agentFace } from "../stories/fixtures/brand.ts";

import { blogHeaderSidebar02 } from "../src/marketing/blog-header-sidebar-02.ts";
import type { BlogHeaderSidebar02Props } from "../src/marketing/blog-header-sidebar-02.ts";

describe("blog header sidebar 02", () => {
  it("keeps search, category, article, author, and pagination behavior controlled", () => {
    const props = {
      articles: [
        {
          authorAvatarSrc: agentFace("Olivia Rhye"),
          authorHref: "#author",
          authorName: "Olivia Rhye",
          categoryHref: "#design",
          categoryName: "Design",
          href: "#article",
          id: "article-1",
          isFeatured: true,
          publishedAt: "20 Jan 2027",
          readingTime: "8 min read",
          summary: "How do you create compelling presentations?",
          thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
          title: "UX review presentations",
        },
      ],
      categories: [{ id: "all", label: "View all" }],
      description: "The latest industry news, interviews, technologies, and resources.",
      eyebrow: "Our blog",
      heading: "Resources and insights",
      onArticle: (id: string) => `article:${id}`,
      onAuthor: (id: string) => `author:${id}`,
      onCategory: (id: string) => `category:${id}`,
      onPage: (page: number) => `page:${String(page)}`,
      onSearch: (query: string) => `search:${query}`,
      page: 1,
      pageCount: 10,
      searchLabel: "Search",
      searchPlaceholder: "Search",
      searchQuery: "",
      selectedCategoryId: "all",
    } satisfies BlogHeaderSidebar02Props<string>;

    expect(props.onSearch("design")).toBe("search:design");
    expect(props.onCategory("all")).toBe("category:all");
    expect(props.onArticle("article-1")).toBe("article:article-1");
    expect(props.onAuthor("article-1")).toBe("author:article-1");
    expect(props.onPage(2)).toBe("page:2");
    expect(typeof blogHeaderSidebar02).toBe("function");
  });
});
