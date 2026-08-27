import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { agentFace } from "../stories/fixtures/brand.ts";

import { blogCards } from "../src/marketing/blog-cards.ts";
import type { BlogCardsProps, BlogCardsVariant } from "../src/marketing/blog-cards.ts";

const variants = [
  "simple-01-vertical",
  "simple-02-vertical",
  "simple-03-vertical",
  "simple-04-vertical",
  "simple-01-horizontal",
  "simple-02-horizontal",
  "simple-03-horizontal",
  "simple-04-horizontal",
  "card-full-width-image-01-vertical",
  "card-full-width-image-02-vertical",
  "card-full-width-image-03-vertical",
  "card-full-width-image-04-vertical",
  "card-full-width-image-01-horizontal",
  "card-full-width-image-02-horizontal",
  "card-full-width-image-03-horizontal",
  "card-full-width-image-04-horizontal",
] as const satisfies readonly BlogCardsVariant[];

describe("blog cards", () => {
  it("exposes every authenticated card variant and controlled destinations", () => {
    const props = {
      article: {
        author: { avatarUrl: agentFace("Olivia Rhye"), href: "#author", name: "Olivia Rhye" },
        category: { href: "#design", name: "Design" },
        href: "#article",
        id: "article-1",
        publishedAt: "20 Jan 2027",
        readingTime: "8 min read",
        summary:
          "How do you create compelling presentations that wow your colleagues and impress your managers?",
        tags: [{ color: "brand", href: "#tag", name: "Design" }],
        thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
        title: "UX review presentations",
      },
      onArticle: "article",
      onAuthor: "author",
      onCategory: "category",
      onTag: () => "tag",
      variant: variants[0],
    } satisfies BlogCardsProps<string>;

    expect(variants).toHaveLength(16);
    expect(new Set(variants).size).toBe(16);
    expect(props).toMatchObject({
      onArticle: "article",
      onAuthor: "author",
      onCategory: "category",
    });
    expect(blogCards).toBeTypeOf("function");
  });
});
