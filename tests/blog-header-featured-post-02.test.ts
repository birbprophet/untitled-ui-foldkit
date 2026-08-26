import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  blogHeaderFeaturedPost02,
  blogHeaderFeaturedPost02Articles,
  blogHeaderFeaturedPost02FeaturedArticle,
  blogHeaderFeaturedPost02Tabs,
} from "../src/marketing/blog-header-featured-post-02.ts";
import type { BlogHeaderFeaturedPost02Props } from "../src/marketing/blog-header-featured-post-02.ts";

describe("blog header featured post 02", () => {
  it("preserves the authenticated featured post, article order, and category tabs", () => {
    expect(blogHeaderFeaturedPost02FeaturedArticle.title).toBe(
      'Improve your design skills: Develop an "eye" for design',
    );
    expect(blogHeaderFeaturedPost02Articles).toHaveLength(8);
    expect(blogHeaderFeaturedPost02Articles[0]?.title).toBe("UX review presentations");
    expect(blogHeaderFeaturedPost02Tabs.map(({ id }) => id)).toEqual([
      "all",
      "design",
      "product",
      "software-engineering",
      "customer-success",
      "leadership",
      "management",
    ]);
  });

  it("keeps search, tabs, pagination, and article links controlled", () => {
    const props = {
      articles: blogHeaderFeaturedPost02Articles,
      categoriesLabel: "Blog categories",
      currentPage: 1,
      description: "Latest resources.",
      eyebrow: "Our blog",
      featuredArticle: blogHeaderFeaturedPost02FeaturedArticle,
      focusedTabId: "all",
      heading: "The latest writings from our team",
      onArticle: (id: string) => `article:${id}`,
      onAuthor: (id: string) => `author:${id}`,
      onCategory: (id: string) => `category:${id}`,
      onPage: (page: number) => `page:${String(page)}`,
      onSearch: (query: string) => `search:${query}`,
      onTabFocus: (id: string) => `focus:${id}`,
      onTabSelect: (id: string) => `tab:${id}`,
      searchPlaceholder: "Search",
      searchQuery: "",
      selectedTabId: "all",
      tabs: blogHeaderFeaturedPost02Tabs,
      totalPages: 10,
    } satisfies BlogHeaderFeaturedPost02Props<string>;

    expect(props.onSearch("design")).toBe("search:design");
    expect(props.onTabSelect("product")).toBe("tab:product");
    expect(props.onPage(2)).toBe("page:2");
    expect(props.onArticle("article-1")).toBe("article:article-1");
    expect(blogHeaderFeaturedPost02).toBeTypeOf("function");
  });
});
