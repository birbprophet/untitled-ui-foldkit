import { badge, badgeGroup } from "./base/badges.ts";
import { button } from "./base/button.ts";

/** Renderers that exist in this package. Verification status lives in catalog, not here. */
export const baseComponents = {
  badges: badge,
  "badge-groups": badgeGroup,
  button,
} as const;

export type BaseComponentId = keyof typeof baseComponents;
