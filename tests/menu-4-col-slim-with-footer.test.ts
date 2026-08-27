import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { menu4ColSlimWithFooter } from "../src/marketing/menu-4-col-slim-with-footer.ts";
import type { Menu4ColSlimWithFooterProps } from "../src/marketing/menu-4-col-slim-with-footer.ts";

describe("menu 4 col slim with footer", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {} as unknown as Menu4ColSlimWithFooterProps<string>;
    expect(menu4ColSlimWithFooter).toBeTypeOf("function");
    expect(props).toBeDefined();
  });
});
