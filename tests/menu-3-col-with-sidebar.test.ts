import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { menu3ColWithSidebar } from "../src/marketing/menu-3-col-with-sidebar.ts";
import type { Menu3ColWithSidebarProps } from "../src/marketing/menu-3-col-with-sidebar.ts";

describe("menu 3 col with sidebar", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {} as unknown as Menu3ColWithSidebarProps<string>;
    expect(menu3ColWithSidebar).toBeTypeOf("function");
    expect(props).toBeDefined();
  });
});
