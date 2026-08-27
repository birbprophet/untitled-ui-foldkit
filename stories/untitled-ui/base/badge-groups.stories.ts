/* oxlint-disable effect/noSpread, effect/noTernary -- Storybook CSF variant matrices stay direct. */
import * as S from "effect/Schema";
import { badgeGroup } from "../../../src/base.ts";

import { componentMeta, matrix, staticStory } from "../story.ts";

const Args = S.Struct({ label: S.String });

export default { ...componentMeta("badge-groups"), title: "Untitled UI/Base/Badge Groups" };

export const AllVariants = {
  ...staticStory(Args, (args, h) =>
    matrix(
      [
        [
          "Themes",
          [
            badgeGroup({ addonText: "New feature", label: args.label, theme: "light" }, h),
            badgeGroup({ addonText: "New feature", label: args.label, theme: "modern" }, h),
          ],
        ],
        [
          "Alignment",
          [
            badgeGroup({ addonText: "New feature", align: "leading", label: args.label }, h),
            badgeGroup({ addonText: "Learn more", align: "trailing", label: args.label }, h),
          ],
        ],
        [
          "Colors",
          (["brand", "warning", "error", "gray", "success"] as const).map((color) =>
            badgeGroup({ addonText: "New", color, label: args.label }, h),
          ),
        ],
      ],
      h,
    ),
  ),
  args: { label: "We've just released a new feature" },
};

export const Dark = {
  ...staticStory(Args, (args, h) =>
    h.div(
      [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
      [badgeGroup({ addonText: "New feature", label: args.label, theme: "modern" }, h)],
    ),
  ),
  args: { label: "Read the release notes" },
};
