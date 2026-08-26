import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { nextCarouselIndex } from "../src/application/carousel-base.ts";

describe("carousel base", () => {
  it("moves one slide in either direction", () => {
    expect(nextCarouselIndex(1, 3, "previous")).toBe(0);
    expect(nextCarouselIndex(1, 3, "next")).toBe(2);
  });

  it("stops at the first and last slide", () => {
    expect(nextCarouselIndex(0, 3, "previous")).toBe(0);
    expect(nextCarouselIndex(2, 3, "next")).toBe(2);
    expect(nextCarouselIndex(0, 0, "next")).toBe(0);
  });
});
