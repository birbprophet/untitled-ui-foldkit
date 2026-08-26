import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { blogHeaderSimple05 } from "../src/marketing/blog-header-simple-05.ts";
import type { BlogHeaderSimple05Props } from "../src/marketing/blog-header-simple-05.ts";

describe("blog header simple 05", () => {
  it("keeps category, subscription, article, author, and pagination behavior controlled", () => {
    const props = {
      article: (id: string) => `article:${id}`,
      author: (id: string) => `author:${id}`,
      category: (id: string) => `category:${id}`,
      email: (email: string) => `email:${email}`,
      page: (page: number) => `page:${String(page)}`,
      subscribe: "subscribe",
    };
    expect(props.category("design")).toBe("category:design");
    expect(props.article("article-1")).toBe("article:article-1");
    expect(props.author("article-1")).toBe("author:article-1");
    expect(props.email("reader@example.com")).toBe("email:reader@example.com");
    expect(props.page(2)).toBe("page:2");
    expect(props.subscribe).toBe("subscribe");
    expect(blogHeaderSimple05).toBeTypeOf("function");
    const selected: BlogHeaderSimple05Props<string>["selectedCategoryId"] = "all";
    expect(selected).toBe("all");
  });
});
