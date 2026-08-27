/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, effect/noTernary, mps/require-is-prefix-for-boolean-schema-field -- Storybook CSF and play functions use the browser promise API directly. */
import * as S from "effect/Schema";
import { checkbox } from "ui/base";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ label: S.String });
const Model = S.Struct({ label: S.String, selected: S.Boolean });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Toggled" }>;
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, selected: false }),
  update: (model: Model): Model => ({ ...model, selected: !model.selected }),
  view: (model: Model, h: Parameters<typeof checkbox<Message>>[1]) =>
    checkbox(
      {
        hint: "Save my preferences",
        isSelected: model.selected,
        label: model.label,
        onToggle: { _tag: "Toggled" },
      },
      h,
    ),
} as const;

export default { ...componentMeta("checkbox"), title: "Untitled UI/Base/Checkbox" };
export const AllVariants = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      matrix(
        [
          [
            "Sizes",
            [
              checkbox({ label: model.label, size: "sm" }, h),
              checkbox({ label: model.label, size: "md" }, h),
            ],
          ],
        ],
        h,
      ),
  }),
  args: { label: "Remember me" },
};
export const States = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      matrix(
        [
          [
            "States",
            [
              checkbox({ isSelected: true, label: model.label }, h),
              checkbox({ isIndeterminate: true, label: model.label }, h),
              checkbox({ isDisabled: true, label: model.label }, h),
            ],
          ],
        ],
        h,
      ),
  }),
  args: { label: "Remember me" },
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [checkbox({ isSelected: true, label: model.label }, h)],
      ),
  }),
  args: { label: "Remember me" },
};
export const Interactions = {
  ...liveStory(definition),
  args: { label: "Remember me" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const control = await within(canvasElement).findByRole("checkbox", { name: "Remember me" });
    await expect(control).not.toBeChecked();
    await userEvent.click(control);
    await expect(
      await within(canvasElement).findByRole("checkbox", { name: "Remember me" }),
    ).toBeChecked();
  },
};
