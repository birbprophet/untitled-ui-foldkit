import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { sidebarSectionDividers } from "../src/application/sidebar-section-dividers.ts";

describe("sidebarSectionDividers", () => {
  it("is a dedicated FoldKit renderer", () => {
    expect(typeof sidebarSectionDividers).toBe("function");
    expect(sidebarSectionDividers.name).toBe("sidebarSectionDividers");
  });
});
