/* oxlint-disable mps/avoid-sync-fs, mps/use-filesystem-service -- Tests verify committed stylesheet files synchronously. */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "@effect/vitest";

import { brandRampNames, untitledDefaultBrandRamp } from "../src/theme.ts";

describe("theme contract", () => {
  it("provides all eleven steps in default-brand.css matching the theme ramp", () => {
    const css = readFileSync(new URL("../default-brand.css", import.meta.url), "utf-8");
    for (const name of brandRampNames) {
      expect(css).toContain(`${name}: ${untitledDefaultBrandRamp[name]};`);
    }
    expect(css).toContain(":root {");
  });
});
