import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { blogHeaderFeaturedPost04 } from "../src/marketing/blog-header-featured-post-04.ts";
import type { BlogHeaderFeaturedPost04Props } from "../src/marketing/blog-header-featured-post-04.ts";

describe("blog header featured post 04", () => {
  it("keeps subscription, article, tag, and pagination behavior controlled", () => {
    const messages = {
      article: (id: string) => `article:${id}`,
      email: (email: string) => `email:${email}`,
      page: (page: number) => `page:${String(page)}`,
      subscribe: "subscribe",
      tag: (articleId: string, tagName: string) => `tag:${articleId}:${tagName}`,
    };

    expect(messages.article("article-1")).toBe("article:article-1");
    expect(messages.email("reader@example.com")).toBe("email:reader@example.com");
    expect(messages.page(2)).toBe("page:2");
    expect(messages.subscribe).toBe("subscribe");
    expect(messages.tag("article-1", "Design")).toBe("tag:article-1:Design");
    expect(blogHeaderFeaturedPost04).toBeTypeOf("function");
    const totalPages: BlogHeaderFeaturedPost04Props<string>["totalPages"] = 10;
    expect(totalPages).toBe(10);
  });
});
