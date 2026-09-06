/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- Luminance formula uses standard WCAG 2.1 piecewise function. */
import { describe, expect, it } from "@effect/vitest";

import {
  renderSiglataBrandRampBlock,
  siglataBrandContext,
  siglataBrandRamp,
  siglataExtendedBrandRamp,
} from "../src/siglata.ts";
import { brandRampNames } from "../src/theme.ts";

const toLinear = function toLinear(c: number): number {
  if (c <= 0.03928) {
    return c / 12.92;
  }
  return ((c + 0.055) / 1.055) ** 2.4;
};

const relativeLuminance = function relativeLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = Number.parseInt(clean.slice(0, 2), 16) / 255;
  const g = Number.parseInt(clean.slice(2, 4), 16) / 255;
  const b = Number.parseInt(clean.slice(4, 6), 16) / 255;
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
};

const contrastRatio = function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

describe("Siglata theme adapter", () => {
  it("provides all eleven standard brand ramp steps matching Siglata Emerald", () => {
    for (const name of brandRampNames) {
      expect(siglataBrandRamp[name]).toMatch(/^#[0-9a-f]{6}$/u);
    }
    expect(siglataBrandRamp["--brand-500"]).toBe("#62c8ac");
    expect(siglataExtendedBrandRamp["--brand-25"]).toBe("#f7fcfa");
  });

  it("renders a contrast-compliant CSS block for Siglata", () => {
    const css = renderSiglataBrandRampBlock();
    expect(css).toContain("--color-bg-brand-solid: var(--brand-700);");
    expect(css).toContain("--color-bg-brand-solid-hover: var(--brand-800);");
    expect(css).toContain("--brand-500: #62c8ac;");
  });

  it("enforces WCAG AA 4.5:1 contrast floor for solid brand buttons", () => {
    const white = "#ffffff";
    const brand600 = siglataBrandRamp["--brand-600"];
    const brand700 = siglataBrandRamp["--brand-700"];
    const brand800 = siglataBrandRamp["--brand-800"];

    const contrast600 = contrastRatio(white, brand600);
    const contrast700 = contrastRatio(white, brand700);
    const contrast800 = contrastRatio(white, brand800);

    // --brand-600 fails 4.5:1 floor (~3.2:1)
    expect(contrast600).toBeLessThan(4.5);
    // --brand-700 passes 4.5:1 floor (~5.5:1)
    expect(contrast700).toBeGreaterThanOrEqual(4.5);
    // --brand-800 passes 4.5:1 floor (~7.5:1)
    expect(contrast800).toBeGreaterThanOrEqual(4.5);
  });

  it("provides Sheetling mascot BrandContext for Siglata identity injection", () => {
    expect(siglataBrandContext.symbol.alt).toBe("Siglata Sheetling mascot");
    expect(siglataBrandContext.symbol.url).toContain("data:image/svg+xml");
    expect(siglataBrandContext.wordmarkHorizontal?.alt).toBe("Siglata");
  });
});
