/**
 * Siglata Emerald brand ramp for untitled-ui-foldkit.
 *
 * Authored seed: Siglata Emerald (#62c8ac).
 * Solid brand button: --brand-700 and hover --brand-800 to maintain
 * WCAG AA 4.5:1 contrast ratio for white label text.
 */
import type { BrandRamp } from "./theme.ts";

export const siglataBrandRamp = {
  "--brand-100": "#d9f2e8",
  "--brand-200": "#b8e7d5",
  "--brand-300": "#8ad9bf",
  "--brand-400": "#6ccfb3",
  "--brand-50": "#eef9f5",
  "--brand-500": "#62c8ac",
  "--brand-600": "#3aa083",
  "--brand-700": "#2b7b66",
  "--brand-800": "#245f51",
  "--brand-900": "#1e4e43",
  "--brand-950": "#0d2d27",
} as const satisfies BrandRamp;

export const siglataExtendedBrandRamp = {
  "--brand-100": "#d9f2e8",
  "--brand-200": "#b8e7d5",
  "--brand-25": "#f7fcfa",
  "--brand-300": "#8ad9bf",
  "--brand-400": "#6ccfb3",
  "--brand-50": "#eef9f5",
  "--brand-500": "#62c8ac",
  "--brand-600": "#3aa083",
  "--brand-700": "#2b7b66",
  "--brand-800": "#245f51",
  "--brand-900": "#1e4e43",
  "--brand-950": "#0d2d27",
} as const;
