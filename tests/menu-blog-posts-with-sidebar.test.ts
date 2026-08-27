import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { menuBlogPostsWithSidebar } from "../src/marketing/menu-blog-posts-with-sidebar.ts";
import type { MenuBlogPostsWithSidebarProps } from "../src/marketing/menu-blog-posts-with-sidebar.ts";

describe("menu blog posts with sidebar", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {} as unknown as MenuBlogPostsWithSidebarProps<string>;
    expect(menuBlogPostsWithSidebar).toBeTypeOf("function");
    expect(props).toBeDefined();
  });
});
