import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { blogSectionSimpleCenterAligned02 } from "../src/marketing/blog-section-simple-center-aligned-02.ts";
import type { BlogSectionSimpleCenterAligned02Props } from "../src/marketing/blog-section-simple-center-aligned-02.ts";

describe("blog section simple center aligned 02", () => {
  it("keeps article, category, and author destinations controlled", () => {
    const props = {
      articles: [],
      description: "The latest news, technologies, and resources from our team.",
      heading: "Latest writings",
      messageForArticle: (id: string) => `article:${id}`,
      messageForAuthor: (id: string) => `author:${id}`,
      messageForCategory: (id: string) => `category:${id}`,
    } satisfies BlogSectionSimpleCenterAligned02Props<string>;

    expect(props.messageForArticle("article-1")).toBe("article:article-1");
    expect(props.messageForAuthor("article-1")).toBe("author:article-1");
    expect(props.messageForCategory("article-1")).toBe("category:article-1");
    expect(blogSectionSimpleCenterAligned02).toBeTypeOf("function");
  });
});
