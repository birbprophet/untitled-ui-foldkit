/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, effect/noTernary -- Storybook CSF variant matrices and play functions stay direct. */
import * as S from "effect/Schema";
import { badge } from "ui/base";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix, staticStory } from "../story.ts";

const Args = S.Struct({ label: S.String });
const colors = [
  "gray",
  "brand",
  "error",
  "warning",
  "success",
  "slate",
  "sky",
  "blue",
  "indigo",
  "purple",
  "pink",
  "orange",
] as const;

export default { ...componentMeta("badges"), title: "Untitled UI/Base/Badges" };

export const AllVariants = {
  ...staticStory(Args, (args, h) =>
    matrix(
      [
        [
          "Types",
          [
            badge({ label: args.label, type: "pill-color" }, h),
            badge({ label: args.label, type: "color" }, h),
            badge({ label: args.label, type: "modern" }, h),
          ],
        ],
        [
          "Sizes",
          (["sm", "md", "lg"] as const).map((size) =>
            badge({ color: "brand", label: args.label, size }, h),
          ),
        ],
        ["Colors", colors.map((color) => badge({ color, label: args.label }, h))],
        [
          "Adornment",
          (["dot", "leading-icon", "trailing-icon", "icon-only", "action"] as const).map(
            (adornment) => badge({ adornment, color: "brand", label: args.label }, h),
          ),
        ],
      ],
      h,
    ),
  ),
  args: { label: "Label" },
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
                badge({ label: args.label, type: "modern" }, h),
                badge({ color: "brand", label: args.label }, h),
                badge({ color: "success", label: args.label }, h),
              ],
            ],
          ],
          h,
        ),
      ],
    ),
  ),
  args: { label: "Label" },
};

const InteractionModel = S.Struct({ isRemoved: S.Boolean, label: S.String });
type InteractionModel = typeof InteractionModel.Type;
type InteractionMessage = Readonly<{ _tag: "Removed" }>;

export const Interactions = {
  ...liveStory<typeof Args.Type, InteractionModel, InteractionMessage>({
    Args,
    Model: InteractionModel,
    init: (args) => ({ isRemoved: false, label: args.label }),
    update: (model) => ({ ...model, isRemoved: true }),
    view: (model, h) =>
      model.isRemoved
        ? h.span([h.Role("status")], [`${model.label} removed`])
        : badge(
            {
              actionLabel: `Remove ${model.label}`,
              adornment: "action",
              label: model.label,
              onAction: { _tag: "Removed" },
            },
            h,
          ),
  }),
  args: { label: "Design" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Remove Design" }));
    await expect(await canvas.findByRole("status")).toHaveTextContent("Design removed");
  },
};
