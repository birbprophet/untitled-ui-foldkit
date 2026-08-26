import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { sidebarSectionsSubheadings } from "../src/application/sidebar-sections-subheadings.ts";

describe("sidebar sections subheadings", () => {
  it("is a dedicated FoldKit renderer", () => {
    expect(typeof sidebarSectionsSubheadings).toBe("function");
    expect(sidebarSectionsSubheadings.name).toBe("sidebarSectionsSubheadings");
  });
});
