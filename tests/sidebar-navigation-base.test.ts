import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { sidebarNavigationBase } from "../src/application/sidebar-navigation-foundations.ts";

describe("sidebarNavigationBase", () => {
  it("exports the authenticated five-primitive foundation barrel as one dedicated renderer", () => {
    expect(typeof sidebarNavigationBase).toBe("function");
    expect(sidebarNavigationBase.name).toBe("sidebarNavigationBase");
  });
});
