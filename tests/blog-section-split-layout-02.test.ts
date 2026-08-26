import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  blogSectionSplitLayout02,
  blogSectionSplitLayout02Articles,
} from "../src/marketing/blog-section-split-layout-02.ts";
import type { BlogSectionSplitLayout02Props } from "../src/marketing/blog-section-split-layout-02.ts";

describe("blog section split layout 02", () => {
  it("preserves the two authenticated visible article fixtures", () => {
    expect(blogSectionSplitLayout02Articles.map(({ title }) => title)).toEqual([
      "UX review presentations",
      "Migrating to Linear 101",
    ]);
    expect(blogSectionSplitLayout02Articles[0]?.category.name).toBe("Design");
    expect(blogSectionSplitLayout02Articles[1]?.author.name).toBe("Phoenix Baker");
  });

  it("keeps article, category, author, and view-all actions controlled", () => {
    const props = {
      articles: blogSectionSplitLayout02Articles,
      description: "The latest industry news.",
      heading: "From the blog",
      onArticle: (id: string) => `article:${id}`,
      onAuthor: (id: string) => `author:${id}`,
      onCategory: (id: string) => `category:${id}`,
      onViewAll: "view-all",
      viewAllLabel: "View all posts",
    } satisfies BlogSectionSplitLayout02Props<string>;

    expect(props.onArticle("article-1")).toBe("article:article-1");
    expect(props.onCategory("article-1")).toBe("category:article-1");
    expect(props.onAuthor("article-2")).toBe("author:article-2");
    expect(props.onViewAll).toBe("view-all");
    expect(blogSectionSplitLayout02).toBeTypeOf("function");
  });
});
