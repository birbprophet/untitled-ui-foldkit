import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { menuBlogPostsWithSidebar } from "../src/marketing/menu-blog-posts-with-sidebar.ts";
import type { MenuBlogPostsWithSidebarProps } from "../src/marketing/menu-blog-posts-with-sidebar.ts";

describe("menu blog posts with sidebar", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {
      categoriesTitle: "Categories",
      categoryItems: [{ href: "#", id: "engineering", title: "Engineering" }],
      onCategory: (id) => `category:${id}`,
      onPost: (id) => `post:${id}`,
      posts: [
        {
          href: "#",
          id: "design-system",
          imageAlt: "Cover",
          imageSrc: "https://www.untitledui.com/images/blog/design-system",
          subtitle: "Level up your product craft",
          title: "Building a design system",
        },
      ],
    } satisfies MenuBlogPostsWithSidebarProps<string>;
    expect(menuBlogPostsWithSidebar).toBeTypeOf("function");
    expect(props.onCategory("abc")).toBe("category:abc");
  });
});
