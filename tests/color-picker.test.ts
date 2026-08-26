import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { colorChannels, hsbToHex, normalizeHexColor } from "../src/application/color-picker.ts";

describe("color picker", () => {
  it("normalizes supported hex values", () => {
    expect(normalizeHexColor("#7f56d9")).toBe("#7F56D9");
    expect(normalizeHexColor("0b7")).toBe("#00BB77");
    expect(normalizeHexColor("invalid")).toBe("#7F56D9");
  });

  it("derives the upstream default channels", () => {
    const channels = colorChannels("#7F56D9");
    expect(channels).toMatchObject({
      blue: 217,
      green: 86,
      red: 127,
    });
    expect(channels.brightness).toBeCloseTo(85.1, 1);
    expect(channels.hue).toBeCloseTo(258.8, 1);
    expect(channels.lightness).toBeCloseTo(59.4, 1);
    expect(channels.lightnessSaturation).toBeCloseTo(63.3, 1);
    expect(channels.saturation).toBeCloseTo(60.4, 1);
  });

  it("round-trips hue, saturation, and brightness", () => {
    const channels = colorChannels("#7F56D9");
    expect(hsbToHex(channels.hue, channels.saturation, channels.brightness)).toBe("#7F56D9");
    expect(hsbToHex(0, 100, 100)).toBe("#FF0000");
  });
});
