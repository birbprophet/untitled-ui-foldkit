import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { blogHeaderSimple02 } from "../src/marketing/blog-header-simple-02.ts";
import type { BlogHeaderSimple02Props } from "../src/marketing/blog-header-simple-02.ts";

describe("blog header simple 02", () => {
  it("keeps newsletter, article navigation, and pagination controlled", () => {
    const props = {
      articles: [],
      description: "Subscribe to learn about new product features.",
      email: "",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email",
      eyebrow: "Blog",
      heading: "Resource library",
      id: "blog-header-simple-02",
      onArticle: (id: string) => `article:${id}`,
      onEmailInput: (email: string) => `email:${email}`,
      onPage: (page: number) => `page:${String(page)}`,
      onSubmit: "submit",
      page: 1,
      pageCount: 10,
      privacyHref: "#privacy",
      privacyLabel: "privacy policy",
      privacyPrefix: "We care about your data in our",
      subscribeLabel: "Subscribe",
    } satisfies BlogHeaderSimple02Props<string>;

    expect([props.onEmailInput("a@b.com"), props.onArticle("one"), props.onPage(2)]).toEqual([
      "email:a@b.com",
      "article:one",
      "page:2",
    ]);
    expect(props.onSubmit).toBe("submit");
    expect(blogHeaderSimple02).toBeTypeOf("function");
  });
});
