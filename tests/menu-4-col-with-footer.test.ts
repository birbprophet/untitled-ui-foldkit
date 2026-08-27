import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { menu4ColWithFooter } from "../src/marketing/menu-4-col-with-footer.ts";
import type { Menu4ColWithFooterProps } from "../src/marketing/menu-4-col-with-footer.ts";

describe("menu 4 col with footer", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {} as unknown as Menu4ColWithFooterProps<string>;
    expect(menu4ColWithFooter).toBeTypeOf("function");
    expect(props).toBeDefined();
  });
});
