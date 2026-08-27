import { describe, it } from "@effect/vitest";

import {
  blogHeaderAltLayout01,
  blogHeaderAltLayout01Articles,
} from "../src/marketing/blog-header-alt-layout-01.ts";
import type { BlogHeaderAltLayout01Props } from "../src/marketing/blog-header-alt-layout-01.ts";
import { expect } from "./assertions.ts";

describe("blog-header-alt-layout-01", () => {
  it("keeps subscription, article, and pagination actions controlled", () => {
    const props: BlogHeaderAltLayout01Props<string> = {
      articles: blogHeaderAltLayout01Articles,
      email: "",
      onArticleActivate: ({ articleId, target }) => `${articleId}:${target}`,
      onEmailInput: (email) => email,
      onPageChange: String,
      onSubscribe: "subscribe",
      page: 1,
    };

    expect(props.onEmailInput("reader@example.com")).toBe("reader@example.com");
    expect(props.onPageChange(2)).toBe("2");
    expect(props.onArticleActivate({ articleId: "article-1", target: "category" })).toBe(
      "article-1:category",
    );
    expect(props.onSubscribe).toBe("subscribe");
    expect(typeof blogHeaderAltLayout01).toBe("function");
  });

  it("preserves the authenticated nine-article fixture and upstream avatar URLs", () => {
    expect(blogHeaderAltLayout01Articles).toHaveLength(9);
    expect(blogHeaderAltLayout01Articles[0]?.isFeatured).toBe(true);
    expect(new Set(blogHeaderAltLayout01Articles.map(({ id }) => id)).size).toBe(9);
    expect(
      blogHeaderAltLayout01Articles.every(({ author }) =>
        author.avatarUrl.startsWith("https://www.untitledui.com/images/avatars/"),
      ),
    ).toBe(true);
  });
});
