/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, effect/noTernary, mps/require-is-prefix-for-boolean-schema-field -- Storybook CSF and play functions use the browser promise API directly. */
import * as S from "effect/Schema";
import { buttonUtility } from "ui/base";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ tooltip: S.String });
const Model = S.Struct({ presses: S.Finite, tooltip: S.String });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Pressed" }>;
const story = liveStory<typeof Args.Type, Model, Message>({
  Args,
  Model,
  init: (args) => ({ ...args, presses: 0 }),
  update: (model) => ({ ...model, presses: model.presses + 1 }),
  view: (model, h) => buttonUtility({ onPress: { _tag: "Pressed" }, tooltip: model.tooltip }, h),
});

export default { ...componentMeta("button-utility"), title: "Untitled UI/Base/Button Utility" };

export const AllVariants = {
  ...liveStory<typeof Args.Type, Model, Message>({
    Args,
    Model,
    init: (args) => ({ ...args, presses: 0 }),
    update: (model) => model,
    view: (model, h) =>
      matrix(
        [
          [
            "Sizes",
            [
              buttonUtility({ size: "xs", tooltip: model.tooltip }, h),
              buttonUtility({ size: "sm", tooltip: model.tooltip }, h),
            ],
          ],
          [
            "Colors",
            [
              buttonUtility({ color: "secondary", tooltip: model.tooltip }, h),
              buttonUtility({ color: "tertiary", tooltip: model.tooltip }, h),
            ],
          ],
        ],
        h,
      ),
  }),
  args: { tooltip: "More options" },
};
export const States = {
  ...liveStory<typeof Args.Type, Model, Message>({
    Args,
    Model,
    init: (args) => ({ ...args, presses: 0 }),
    update: (model) => model,
    view: (model, h) =>
      matrix(
        [
          [
            "States",
            [
              buttonUtility({ isDisabled: true, tooltip: model.tooltip }, h),
              buttonUtility({ href: "#utility-link", tooltip: model.tooltip }, h),
            ],
          ],
        ],
        h,
      ),
  }),
  args: { tooltip: "More options" },
};
export const Dark = {
  ...liveStory<typeof Args.Type, Model, Message>({
    Args,
    Model,
    init: (args) => ({ ...args, presses: 0 }),
    update: (model) => model,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [buttonUtility({ tooltip: model.tooltip }, h)],
      ),
  }),
  args: { tooltip: "More options" },
};
export const Interactions = {
  ...story,
  args: { tooltip: "More options" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const control = await within(canvasElement).findByRole("button", { name: "More options" });
    control.focus();
    await expect(control).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(control).toBeInTheDocument();
  },
};
