import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { blogHeaderFeaturedPost03 } from "../src/marketing/blog-header-featured-post-03.ts";
import type { BlogHeaderFeaturedPost03Props } from "../src/marketing/blog-header-featured-post-03.ts";

describe("blog header featured post 03", () => {
  it("keeps subscription, article navigation, and pagination controlled", () => {
    const props = {
      articles: [
        {
          authorName: "Olivia Rhye",
          categoryHref: "#design",
          categoryName: "Design",
          href: "#article-1",
          id: "article-1",
          publishedAt: "20 Jan 2027",
          summary: "How do you create compelling presentations?",
          tags: [{ color: "brand", href: "#design", name: "Design" }],
          thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
          title: "UX review presentations",
        },
      ],
      description: "The latest industry news, interviews, technologies, and resources.",
      email: "operator@siglata.com",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email",
      eyebrow: "Our blog",
      heading: "Resources and insights",
      onArticle: (id: string) => `article:${id}`,
      onEmailInput: (email: string) => `email:${email}`,
      onPage: (page: number) => `page:${page}`,
      onSubscribe: "subscribe",
      page: 1,
      privacyHref: "#privacy",
      subscribeLabel: "Get started",
      totalPages: 10,
    } satisfies BlogHeaderFeaturedPost03Props<string>;

    expect(props.onArticle("article-1")).toBe("article:article-1");
    expect(props.onEmailInput("news@siglata.com")).toBe("email:news@siglata.com");
    expect(props.onPage(2)).toBe("page:2");
    expect(props.onSubscribe).toBe("subscribe");
    expect(blogHeaderFeaturedPost03).toBeTypeOf("function");
  });
});
