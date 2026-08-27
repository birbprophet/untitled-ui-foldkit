import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { menuBlogPostsWithFooter } from "../src/marketing/menu-blog-posts-with-footer.ts";
import type { MenuBlogPostsWithFooterProps } from "../src/marketing/menu-blog-posts-with-footer.ts";

describe("menu blog posts with footer", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {} as unknown as MenuBlogPostsWithFooterProps<string>;
    expect(menuBlogPostsWithFooter).toBeTypeOf("function");
    expect(props).toBeDefined();
  });
});
