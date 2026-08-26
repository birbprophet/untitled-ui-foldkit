import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { blogHeaderAltLayout04 } from "../src/marketing/blog-header-alt-layout-04.ts";
import type { BlogHeaderAltLayout04Props } from "../src/marketing/blog-header-alt-layout-04.ts";

describe("blog header alt layout 04", () => {
  it("keeps newsletter, article, author, category, and pagination actions controlled", () => {
    const props = {
      articles: [],
      currentPage: 1,
      description: "Tools and strategies for modern teams.",
      email: "operator@siglata.com",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email",
      eyebrow: "Resources",
      heading: "Siglata blog",
      messageForArticle: (id: string) => `article:${id}`,
      messageForAuthor: (id: string) => `author:${id}`,
      messageForCategory: (id: string) => `category:${id}`,
      messageForPage: (page: number) => `page:${String(page)}`,
      onEmailInput: (email: string) => `email:${email}`,
      onPrivacyPolicy: "privacy",
      onSubmit: "submit",
      privacyCopy: "We care about your data in our",
      privacyHref: "#privacy",
      privacyLabel: "privacy policy",
      submitLabel: "Get started",
      totalPages: 10,
    } satisfies BlogHeaderAltLayout04Props<string>;

    expect(props.messageForArticle("article-1")).toBe("article:article-1");
    expect(props.messageForPage(2)).toBe("page:2");
    expect(props.onEmailInput("hello@siglata.com")).toBe("email:hello@siglata.com");
    expect(props.onSubmit).toBe("submit");
    expect(blogHeaderAltLayout04).toBeTypeOf("function");
  });
});
