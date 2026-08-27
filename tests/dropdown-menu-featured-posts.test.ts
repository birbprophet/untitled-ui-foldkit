import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { dropdownMenuFeaturedPosts } from "../src/marketing/dropdown-menu-featured-posts.ts";

describe("dropdown menu featured posts", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(dropdownMenuFeaturedPosts).toBeTypeOf("function");
  });
});
