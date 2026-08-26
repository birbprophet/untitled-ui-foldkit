import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { sidebarDualTier } from "../src/application/sidebar-dual-tier.ts";

describe("sidebarDualTier", () => {
  it("exports one dedicated renderer", () => {
    expect(typeof sidebarDualTier).toBe("function");
    expect(sidebarDualTier.name).toBe("sidebarDualTier");
  });
});
