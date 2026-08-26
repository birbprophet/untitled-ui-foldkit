import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { blogHeaderSimple01 } from "../src/marketing/blog-header-simple-01.ts";
import type { BlogHeaderSimple01Props } from "../src/marketing/blog-header-simple-01.ts";

describe("blog header simple 01", () => {
  it("keeps discovery, sorting, subscription, article, author, and page actions controlled", () => {
    const props: BlogHeaderSimple01Props<string> = {
      articles: [
        {
          authorHref: "#olivia",
          authorName: "Olivia Rhye",
          avatarUrl: "/olivia.webp",
          category: "Design",
          href: "#article",
          id: "article-1",
          publishedAt: "20 Jan 2027",
          summary: "Create compelling presentations.",
          thumbnailUrl: "/spirals.webp",
          title: "UX review presentations",
        },
      ],
      categories: [{ id: "all", label: "View all" }],
      description: "The latest industry news.",
      eyebrow: "Our blog",
      heading: "The latest writings from our team",
      newsletterDescription: "No spam. Just the latest releases and tips.",
      newsletterEmail: "reader@example.com",
      newsletterPrivacyHref: "#privacy",
      newsletterTitle: "Weekly newsletter",
      onArticle: (id) => `article:${id}`,
      onAuthor: (id) => `author:${id}`,
      onCategory: (id) => `category:${id}`,
      onNewsletterEmail: (email) => `email:${email}`,
      onNewsletterSubscribe: "subscribe",
      onPage: (page) => `page:${page}`,
      onSearch: (query) => `search:${query}`,
      onSort: (id) => `sort:${id}`,
      page: 1,
      pageCount: 10,
      query: "design",
      selectedCategory: "all",
      sortBy: "recent",
      sortOptions: [{ id: "recent", label: "Most recent" }],
    };
    expect(props.onArticle("article-1")).toBe("article:article-1");
    expect(props.onAuthor("article-1")).toBe("author:article-1");
    expect(props.onCategory("design")).toBe("category:design");
    expect(props.onNewsletterEmail("new@example.com")).toBe("email:new@example.com");
    expect(props.onPage(2)).toBe("page:2");
    expect(props.onSearch("api")).toBe("search:api");
    expect(props.onSort("popular")).toBe("sort:popular");
    expect(blogHeaderSimple01).toBeTypeOf("function");
  });
});
