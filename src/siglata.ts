/**
 * First-class Siglata adapter and theme contract for untitled-ui-foldkit.
 *
 * Provides the authoritative Siglata Emerald ramp (#62c8ac seed),
 * Sheetling mascot BrandContext, and contrast-compliant solid button tokens.
 */
import type { BrandContext } from "./brand-context.ts";
import type { BrandRamp, BrandRampName } from "./theme.ts";
import { brandRampNames } from "./theme.ts";

/**
 * Authoritative Siglata Emerald brand ramp from Siglata's token table.
 * Seed is Siglata Emerald (#62c8ac).
 */
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

/**
 * Complete twelve-step Siglata ramp including --brand-25.
 */
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

/**
 * First-class Sheetling mascot BrandContext for Siglata identity injection.
 */
export const siglataBrandContext = {
  symbol: {
    alt: "Siglata Sheetling mascot",
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1254 1254' fill='none'%3E%3Cpath d='M324 114h399c36 0 70 14 95 39l193 191c40 40 62 94 62 151v499c0 80-64 144-144 144H324c-80 0-144-64-144-144V258c0-80 64-144 144-144Z' fill='%2362c8ac'/%3E%3Cpath d='M723 114c36 0 70 14 95 39l193 191c39 39 61 91 62 147-31-53-74-82-132-82h-70c-74 0-92-32-92-105v-84c0-52-18-88-56-106Z' fill='%230c5b52'/%3E%3Cellipse cx='433' cy='634' rx='51' ry='62' fill='%230c5b52'/%3E%3Cellipse cx='815' cy='634' rx='51' ry='62' fill='%230c5b52'/%3E%3C/svg%3E",
  },
  wordmarkHorizontal: {
    alt: "Siglata",
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40' fill='none'%3E%3Ctext x='0' y='30' font-family='Inter, sans-serif' font-weight='700' font-size='28' fill='%230d2d27'%3ESiglata%3C/text%3E%3C/svg%3E",
  },
} as const satisfies BrandContext;

/**
 * Render a :root brand-ramp block with Siglata Emerald ramp and WCAG AA 4.5:1
 * compliant button roles (--brand-700 / --brand-800).
 */
export const renderSiglataBrandRampBlock = (selector = ":root"): string =>
  `${selector} {\n${brandRampNames.map((name: BrandRampName) => `  ${name}: ${siglataBrandRamp[name]};`).join("\n")}
  --brand-25: #f7fcfa;
  --color-bg-brand-solid: var(--brand-700);
  --color-bg-brand-solid-hover: var(--brand-800);
  --color-bg-brand-solid_hover: var(--brand-800);
  --background-color-brand-solid: var(--brand-700);
  --background-color-brand-solid_hover: var(--brand-800);
  --color-focus-ring: var(--brand-500);
}\n`;
