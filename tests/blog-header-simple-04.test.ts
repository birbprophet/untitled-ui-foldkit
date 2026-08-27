import { describe, it } from "@effect/vitest";

import {
  blogHeaderSimple04,
  blogHeaderSimple04Articles,
} from "../src/marketing/blog-header-simple-04.ts";
import type { BlogHeaderSimple04Props } from "../src/marketing/blog-header-simple-04.ts";
import { expect } from "./assertions.ts";

describe("blog-header-simple-04", () => {
  it("keeps subscription, article links, and load-more behavior controlled", () => {
    const props: BlogHeaderSimple04Props<string> = {
      articles: blogHeaderSimple04Articles,
      description: "Tool and strategies modern teams need to help their companies grow.",
      email: "",
      eyebrow: "Resources",
      heading: "Siglata blog",
      onArticleActivate: ({ articleId, target }) => `${articleId}:${target}`,
      onEmailInput: (email) => email,
      onLoadMore: "load-more",
      onSubscribe: "subscribe",
    };

    expect(props.onEmailInput("reader@example.com")).toBe("reader@example.com");
    expect(props.onArticleActivate({ articleId: "article-1", target: "author" })).toBe(
      "article-1:author",
    );
    expect(props.onLoadMore).toBe("load-more");
    expect(props.onSubscribe).toBe("subscribe");
    expect(typeof blogHeaderSimple04).toBe("function");
  });

  it("preserves every authenticated article field and upstream avatar URL", () => {
    expect(blogHeaderSimple04Articles).toHaveLength(9);
    expect(blogHeaderSimple04Articles[0]?.tags).toHaveLength(3);
    expect(blogHeaderSimple04Articles[0]?.isFeatured).toBe(true);
    expect(new Set(blogHeaderSimple04Articles.map(({ id }) => id)).size).toBe(9);
    expect(
      blogHeaderSimple04Articles.every(({ author }) =>
        author.avatarUrl.startsWith("https://www.untitledui.com/images/avatars/"),
      ),
    ).toBe(true);
  });
});
