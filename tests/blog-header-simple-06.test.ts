import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  blogHeaderSimple06,
  blogHeaderSimple06Articles,
  blogHeaderSimple06Categories,
} from "../src/marketing/blog-header-simple-06.ts";
import type { BlogHeaderSimple06Props } from "../src/marketing/blog-header-simple-06.ts";

describe("blog header simple 06", () => {
  it("preserves the authenticated article and category fixtures", () => {
    expect(blogHeaderSimple06Articles).toHaveLength(8);
    expect(blogHeaderSimple06Articles.map(({ id }) => id)).toEqual([
      "article-1",
      "article-2",
      "article-3",
      "article-4",
      "article-5",
      "article-6",
      "article-7",
      "article-8",
    ]);
    expect(blogHeaderSimple06Categories.map(({ label }) => label)).toEqual([
      "View all",
      "Design",
      "Product",
      "Software Engineering",
      "Customer Success",
    ]);
  });

  it("keeps subscription, category, article, and pagination actions controlled", () => {
    const props = {
      articles: blogHeaderSimple06Articles,
      categories: blogHeaderSimple06Categories,
      currentPage: 1,
      desktopDescription: "Subscribe for updates.",
      email: "operator@example.com",
      emailPlaceholder: "Enter your email",
      eyebrow: "Our blog",
      focusedCategoryId: "all",
      heading: "Stories and interviews",
      mobileDescription: "Subscribe for updates every week.",
      onArticle: (id: string) => `article:${id}`,
      onAuthor: (id: string) => `author:${id}`,
      onCategory: (id: string) => `article-category:${id}`,
      onCategoryFocus: (id: string) => `focus:${id}`,
      onCategorySelect: (id: string) => `category:${id}`,
      onEmail: (email: string) => `email:${email}`,
      onPage: (page: number) => `page:${String(page)}`,
      onPrivacy: "privacy",
      onSubscribe: "subscribe",
      privacyCopy: "We care about your data in our",
      privacyHref: "#privacy",
      privacyLabel: "privacy policy",
      selectedCategoryId: "all",
      submitLabel: "Get started",
      totalPages: 10,
    } satisfies BlogHeaderSimple06Props<string>;

    expect(props.onEmail("new@example.com")).toBe("email:new@example.com");
    expect(props.onCategorySelect("design")).toBe("category:design");
    expect(props.onArticle("article-1")).toBe("article:article-1");
    expect(props.onPage(2)).toBe("page:2");
    expect(props.onSubscribe).toBe("subscribe");
    expect(blogHeaderSimple06).toBeTypeOf("function");
  });
});
