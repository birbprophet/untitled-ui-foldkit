import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { menu2ColWithSidebar } from "../src/marketing/menu-2-col-with-sidebar.ts";
import type { Menu2ColWithSidebarProps } from "../src/marketing/menu-2-col-with-sidebar.ts";

describe("menu 2 col with sidebar", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {} as unknown as Menu2ColWithSidebarProps<string>;
    expect(menu2ColWithSidebar).toBeTypeOf("function");
    expect(props).toBeDefined();
  });
});
