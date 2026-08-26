import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { sidebarSlim } from "../src/application/sidebar-slim.ts";

describe("sidebarSlim", () => {
  it("is a dedicated FoldKit renderer", () => {
    expect(typeof sidebarSlim).toBe("function");
    expect(sidebarSlim.name).toBe("sidebarSlim");
  });
});
