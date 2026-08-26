import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  blogHeaderSimple03,
  blogHeaderSimple03Articles,
} from "../src/marketing/blog-header-simple-03.ts";
import type { BlogHeaderSimple03Props } from "../src/marketing/blog-header-simple-03.ts";

describe("blog header simple 03", () => {
  it("keeps newsletter, article, and rounded-pagination actions controlled", () => {
    const props = {
      articles: blogHeaderSimple03Articles,
      description: "The blog is the best source of information. Subscribe for weekly updates.",
      email: "operator@siglata.com",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email",
      eyebrow: "Our blog",
      heading: "Stories and interviews",
      onArticle: (id: string) => `article:${id}`,
      onEmailInput: (email: string) => `email:${email}`,
      onPage: (page: number) => `page:${page}`,
      onSubscribe: "subscribe",
      page: 1,
      privacyHref: "#privacy",
      subscribeLabel: "Get started",
      totalPages: 10,
    } satisfies BlogHeaderSimple03Props<string>;

    expect(props.articles).toHaveLength(9);
    expect(props.onArticle("article-1")).toBe("article:article-1");
    expect(props.onEmailInput("news@siglata.com")).toBe("email:news@siglata.com");
    expect(props.onPage(2)).toBe("page:2");
    expect(props.onSubscribe).toBe("subscribe");
    expect(blogHeaderSimple03).toBeTypeOf("function");
  });
});
