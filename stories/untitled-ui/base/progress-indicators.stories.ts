/* oxlint-disable effect/noSpread, effect/noTernary -- Storybook CSF variant matrices stay direct. */
import * as S from "effect/Schema";
import { progressIndicator } from "ui/base";

import { componentMeta, matrix, staticStory } from "../story.ts";

const Args = S.Struct({ value: S.Finite });

export default {
  ...componentMeta("progress-indicators"),
  title: "Untitled UI/Base/Progress Indicators",
};

export const AllVariants = {
  ...staticStory(Args, (args, h) =>
    h.div(
      [h.Class("w-[480px]")],
      [
        matrix(
          [
            [
              "Labels",
              [
                progressIndicator({ value: args.value }, h),
                progressIndicator({ labelPosition: "right", value: args.value }, h),
                progressIndicator({ labelPosition: "bottom", value: args.value }, h),
                progressIndicator({ labelPosition: "top-floating", value: args.value }, h),
                progressIndicator({ labelPosition: "bottom-floating", value: args.value }, h),
              ],
            ],
          ],
          h,
        ),
      ],
    ),
  ),
  args: { value: 40 },
};

export const States = {
  ...staticStory(Args, (_args, h) =>
    h.div(
      [h.Class("w-[480px]")],
      [
        matrix(
          [
            [
              "Values",
              [
                progressIndicator({ value: 0 }, h),
                progressIndicator({ value: 40 }, h),
                progressIndicator({ value: 100 }, h),
              ],
            ],
          ],
          h,
        ),
      ],
    ),
  ),
  args: { value: 40 },
};

export const Dark = {
  ...staticStory(Args, (args, h) =>
    h.div(
      [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
      [
        h.div(
          [h.Class("w-[480px]")],
          [progressIndicator({ labelPosition: "right", value: args.value }, h)],
        ),
      ],
    ),
  ),
  args: { value: 40 },
};
