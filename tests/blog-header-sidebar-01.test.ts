import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { blogHeaderSidebar01 } from "../src/marketing/blog-header-sidebar-01.ts";
import type { BlogHeaderSidebar01Props } from "../src/marketing/blog-header-sidebar-01.ts";

describe("blog header sidebar 01", () => {
  it("keeps subscription, search, category, article, author, and pagination actions controlled", () => {
    const props = {
      activeCategoryId: "all",
      articles: [
        {
          author: { href: "#olivia", name: "Olivia Rhye" },
          category: { href: "#design", name: "Design" },
          href: "#article",
          id: "article-1",
          publishedAt: "20 Jan 2027",
          readingTime: "8 min read",
          summary: "A presentation guide.",
          thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
          title: "UX review presentations",
        },
      ],
      categories: [{ href: "#all", id: "all", label: "View all" }],
      description: "Tools and strategies modern teams need.",
      email: "",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email",
      eyebrow: "Resources",
      heading: "Siglata blog",
      onArticle: (id: string) => `article:${id}`,
      onAuthor: (id: string) => `author:${id}`,
      onCategorySelect: (id: string) => `category:${id}`,
      onEmailInput: (email: string) => `email:${email}`,
      onPageChange: (page: number) => `page:${String(page)}`,
      onSearchInput: (query: string) => `search:${query}`,
      onSubscribe: "subscribe",
      page: 1,
      privacyHref: "#privacy",
      privacyLabel: "privacy policy",
      query: "",
      searchLabel: "Search",
      subscribeLabel: "Get started",
    } satisfies BlogHeaderSidebar01Props<string>;
    expect(props.onEmailInput("reader@example.com")).toBe("email:reader@example.com");
    expect(props.onSearchInput("design")).toBe("search:design");
    expect(props.onCategorySelect("design")).toBe("category:design");
    expect(props.onArticle("article-1")).toBe("article:article-1");
    expect(props.onAuthor("article-1")).toBe("author:article-1");
    expect(props.onPageChange(2)).toBe("page:2");
    expect(props.onSubscribe).toBe("subscribe");
    expect(blogHeaderSidebar01).toBeTypeOf("function");
  });
});
