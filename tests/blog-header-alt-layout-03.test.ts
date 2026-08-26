import { describe, it } from "@effect/vitest";

import {
  blogHeaderAltLayout03,
  blogHeaderAltLayout03Articles,
  blogHeaderAltLayout03Tabs,
} from "../src/marketing/blog-header-alt-layout-03.ts";
import type { BlogHeaderAltLayout03Props } from "../src/marketing/blog-header-alt-layout-03.ts";
import { expect } from "./assertions.ts";

describe("blog header alt layout 03", () => {
  it("preserves the source inventory and controlled interactions", () => {
    const props = {
      articles: blogHeaderAltLayout03Articles,
      description: "Updates",
      email: "operator@example.com",
      emailLabel: "Email address",
      emailPlaceholder: "Enter your email",
      eyebrow: "Blog",
      heading: "Resource library",
      loadMoreLabel: "Load more",
      onArticle: (id: string) => `article:${id}`,
      onAuthor: (id: string) => `author:${id}`,
      onCategory: (id: string) => `category:${id}`,
      onEmailInput: (email: string) => `email:${email}`,
      onLoadMore: "load-more",
      onSearchInput: (search: string) => `search:${search}`,
      onSubscribe: "subscribe",
      onTabFocus: (id: string) => `focus:${id}`,
      onTabSelect: (id: string) => `tab:${id}`,
      onTag: (id: string, tag: string) => `tag:${id}:${tag}`,
      privacyHref: "#privacy",
      privacyLabel: "privacy policy",
      privacyPrefix: "We care about your data in our",
      search: "",
      searchLabel: "Search",
      searchPlaceholder: "Search",
      selectedTabId: "all",
      subscribeLabel: "Get started",
      tabs: blogHeaderAltLayout03Tabs,
    } satisfies BlogHeaderAltLayout03Props<string>;

    expect(blogHeaderAltLayout03Articles).toHaveLength(9);
    expect(blogHeaderAltLayout03Articles[0]?.isFeatured).toBe(true);
    expect(blogHeaderAltLayout03Articles[0]?.thumbnailUrl).toBe(
      "https://www.untitledui.com/marketing/spirals.webp",
    );
    expect(blogHeaderAltLayout03Tabs).toHaveLength(5);
    expect(props.onEmailInput("team@siglata.com")).toBe("email:team@siglata.com");
    expect(props.onTabSelect("design")).toBe("tab:design");
    expect(props.onArticle("article-1")).toBe("article:article-1");
    expect(props.onTag("article-1", "Design")).toBe("tag:article-1:Design");
    expect(blogHeaderAltLayout03).toBeTypeOf("function");
  });
});
