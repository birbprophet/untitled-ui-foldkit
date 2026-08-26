import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { blogHeaderAltLayout02 } from "../src/marketing/blog-header-alt-layout-02.ts";
import type { BlogHeaderAltLayout02Props } from "../src/marketing/blog-header-alt-layout-02.ts";

describe("blog header alt layout 02", () => {
  it("keeps subscription, article, author, tag, and page actions controlled", () => {
    const props: BlogHeaderAltLayout02Props<string> = {
      articles: [
        {
          authorHref: "#olivia",
          authorName: "Olivia Rhye",
          categoryHref: "#design",
          href: "#article-1",
          id: "article-1",
          isFeatured: true,
          publishedAt: "20 Jan 2027",
          summary: "How do you create compelling presentations?",
          tags: [{ color: "brand", href: "#design", name: "Design" }],
          thumbnailUrl: "/spirals.webp",
          title: "UX review presentations",
        },
      ],
      description: "Subscribe to learn about new product features.",
      email: "reader@example.com",
      eyebrow: "Our blog",
      heading: "Stories and interviews",
      onArticle: (id) => `article:${id}`,
      onAuthor: (id) => `author:${id}`,
      onEmail: (email) => `email:${email}`,
      onPage: (page) => `page:${page}`,
      onSubscribe: "subscribe",
      onTag: (id, tag) => `tag:${id}:${tag}`,
      page: 1,
      pageCount: 10,
      privacyHref: "#privacy",
    };

    expect(props.onArticle("article-1")).toBe("article:article-1");
    expect(props.onAuthor("article-1")).toBe("author:article-1");
    expect(props.onEmail("new@example.com")).toBe("email:new@example.com");
    expect(props.onPage(2)).toBe("page:2");
    expect(props.onTag("article-1", "Design")).toBe("tag:article-1:Design");
    expect(blogHeaderAltLayout02).toBeTypeOf("function");
  });
});
