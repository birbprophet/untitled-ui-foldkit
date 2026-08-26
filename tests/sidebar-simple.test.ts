import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { sidebarSimple } from "../src/application/sidebar-simple.ts";

describe("sidebarSimple", () => {
  it("is a dedicated FoldKit renderer", () => {
    expect(typeof sidebarSimple).toBe("function");
    expect(sidebarSimple.name).toBe("sidebarSimple");
  });
});
