/**
 * Theme contract for untitled-ui-foldkit renderers.
 */

export const brandRampNames = [
  "--brand-50",
  "--brand-100",
  "--brand-200",
  "--brand-300",
  "--brand-400",
  "--brand-500",
  "--brand-600",
  "--brand-700",
  "--brand-800",
  "--brand-900",
  "--brand-950",
] as const;

export type BrandRampName = (typeof brandRampNames)[number];

export type BrandRamp = Record<BrandRampName, string>;

export const untitledDefaultBrandRamp = {
  "--brand-100": "#f4ebff",
  "--brand-200": "#e9d7fe",
  "--brand-300": "#d6bbfb",
  "--brand-400": "#b692f6",
  "--brand-50": "#f9f5ff",
  "--brand-500": "#9e77ed",
  "--brand-600": "#7f56d9",
  "--brand-700": "#6941c6",
  "--brand-800": "#53389e",
  "--brand-900": "#42307d",
  "--brand-950": "#2c185f",
} as const satisfies BrandRamp;

export const renderBrandRampBlock = (ramp: BrandRamp, selector = ":root"): string =>
  `${selector} {\n${brandRampNames.map((name) => `  ${name}: ${ramp[name]};`).join("\n")}\n}\n`;
