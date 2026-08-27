import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { menuBlogPostsWithFooter } from "../src/marketing/menu-blog-posts-with-footer.ts";
import type { MenuBlogPostsWithFooterProps } from "../src/marketing/menu-blog-posts-with-footer.ts";

describe("menu blog posts with footer", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {
      documentationLabel: "Documentation",
      onDocumentation: "documentation",
      onPost: (id) => `post:${id}`,
      onViewAllBlogPosts: "blog-all",
      onViewAllPosts: "posts-all",
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
      viewAllBlogPostsLabel: "View all blog posts",
      viewAllPostsLabel: "View all posts",
    } satisfies MenuBlogPostsWithFooterProps<string>;
    expect(menuBlogPostsWithFooter).toBeTypeOf("function");
    expect(props.onPost("abc")).toBe("post:abc");
  });
});
