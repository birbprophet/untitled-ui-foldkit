/* oxlint-disable effect/noSpread, effect/noTernary -- Storybook CSF variant matrices stay direct. */
import * as S from "effect/Schema";
import { progressCircle } from "ui/base";

import { componentMeta, matrix, staticStory } from "../story.ts";

const Args = S.Struct({ value: S.Finite });

export default { ...componentMeta("progress-circles"), title: "Untitled UI/Base/Progress Circles" };

export const AllVariants = {
  ...staticStory(Args, (args, h) =>
    matrix(
      [
        [
          "Circle",
          (["xxs", "xs", "sm", "md", "lg"] as const).map((size) =>
            progressCircle({ label: "Completed", size, value: args.value }, h),
          ),
        ],
        [
          "Half circle",
          (["xxs", "xs", "sm", "md", "lg"] as const).map((size) =>
            progressCircle({ kind: "half-circle", label: "Completed", size, value: args.value }, h),
          ),
        ],
      ],
      h,
    ),
  ),
  args: { value: 40 },
};

export const Dark = {
  ...staticStory(Args, (args, h) =>
    h.div(
      [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
      [progressCircle({ label: "Completed", size: "md", value: args.value }, h)],
    ),
  ),
  args: { value: 40 },
};
