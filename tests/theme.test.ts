import { describe, expect, it } from "@effect/vitest";

import { brandRampNames, renderBrandRampBlock, untitledDefaultBrandRamp } from "../src/theme.ts";

describe("theme contract", () => {
  it("renders the eleven-step brand ramp as a CSS block", () => {
    const css = renderBrandRampBlock(untitledDefaultBrandRamp);
    for (const name of brandRampNames) {
      expect(css).toContain(`${name}: ${untitledDefaultBrandRamp[name]};`);
    }
    expect(css.startsWith(":root {")).toBe(true);
  });
});
