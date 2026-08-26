import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { defaultImageAdjustments } from "../src/application/image-picker.ts";

describe("image picker", () => {
  it("starts every authenticated adjustment channel at zero", () => {
    expect(defaultImageAdjustments).toEqual({
      contrast: 0,
      exposure: 0,
      highlights: 0,
      saturation: 0,
      shadows: 0,
      temperature: 0,
      tint: 0,
    });
  });
});
