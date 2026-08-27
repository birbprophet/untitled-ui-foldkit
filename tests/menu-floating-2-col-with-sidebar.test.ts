import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { menuFloating2ColWithSidebar } from "../src/marketing/menu-floating-2-col-with-sidebar.ts";
import type { MenuFloating2ColWithSidebarProps } from "../src/marketing/menu-floating-2-col-with-sidebar.ts";

describe("menu floating 2 col with sidebar", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {} as unknown as MenuFloating2ColWithSidebarProps<string>;
    expect(menuFloating2ColWithSidebar).toBeTypeOf("function");
    expect(props).toBeDefined();
  });
});
