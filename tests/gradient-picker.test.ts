import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  defaultGradientStops,
  gradientCss,
  moveGradientStop,
  reverseGradientStops,
} from "../src/application/gradient-picker.ts";

describe("gradient picker", () => {
  it("uses the Siglata teal ramp for the authenticated two-stop default", () => {
    expect(defaultGradientStops.map((stop) => stop.color)).toEqual(["#0B7D74", "#054F4A"]);
    expect(gradientCss(defaultGradientStops, "linear", 135)).toContain("linear-gradient(135deg");
  });

  it("keeps a moved stop between its adjacent stops", () => {
    const stops = defaultGradientStops.concat({
      alpha: 100,
      color: "#FFFFFF",
      id: "middle",
      position: 50,
    });
    expect(
      moveGradientStop(stops, "middle", 120).find((stop) => stop.id === "middle")?.position,
    ).toBe(100);
    expect(
      moveGradientStop(stops, "teal-1", 1).find((stop) => stop.id === "teal-1")?.position,
    ).toBe(1);
  });

  it("reverses colors without changing stop positions", () => {
    const reversed = reverseGradientStops(defaultGradientStops);
    expect(reversed.map((stop) => stop.color)).toEqual(["#054F4A", "#0B7D74"]);
    expect(reversed.map((stop) => stop.position)).toEqual([0, 100]);
  });
});
