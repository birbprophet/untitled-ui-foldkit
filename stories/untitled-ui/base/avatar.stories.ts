/* oxlint-disable effect/noSpread, effect/noTernary -- Storybook CSF variant matrices stay direct. */
import * as S from "effect/Schema";
import { avatar } from "ui/base";

import { componentMeta, matrix, staticStory } from "../story.ts";

const Args = S.Struct({ seed: S.String });

export default { ...componentMeta("avatar"), title: "Untitled UI/Base/Avatar" };

export const AllVariants = {
  ...staticStory(Args, (args, h) =>
    matrix(
      [
        [
          "Sizes",
          (["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((size) =>
            avatar({ alt: "Agent Olivia", entityKind: "agent", seed: args.seed, size }, h),
          ),
        ],
        [
          "Shape",
          [
            avatar({ alt: "Agent Olivia", rounded: true, seed: args.seed }, h),
            avatar({ alt: "Agent Olivia", rounded: false, seed: args.seed }, h),
          ],
        ],
      ],
      h,
    ),
  ),
  args: { seed: "olivia-rhye" },
};

export const States = {
  ...staticStory(Args, (args, h) =>
    matrix(
      [
        [
          "States",
          [
            avatar({ alt: "Agent Olivia", seed: args.seed, status: "online" }, h),
            avatar({ alt: "Agent Olivia", seed: args.seed, status: "offline" }, h),
            avatar({ alt: "Agent Olivia", seed: args.seed, verified: true }, h),
            avatar({ alt: "Agent Olivia", count: 3, seed: args.seed }, h),
            avatar({ initials: "OR" }, h),
            avatar({}, h),
          ],
        ],
      ],
      h,
    ),
  ),
  args: { seed: "olivia-rhye" },
};

export const Dark = {
  ...staticStory(Args, (args, h) =>
    h.div(
      [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
      [
        matrix(
          [
            [
              "Dark",
              [
                avatar({ alt: "Agent Olivia", seed: args.seed, status: "online" }, h),
                avatar({ initials: "OR", verified: true }, h),
              ],
            ],
          ],
          h,
        ),
      ],
    ),
  ),
  args: { seed: "olivia-rhye" },
};
