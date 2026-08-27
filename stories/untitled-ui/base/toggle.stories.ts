/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, effect/noTernary, mps/require-is-prefix-for-boolean-schema-field -- Storybook CSF and play functions use the browser promise API directly. */
import * as S from "effect/Schema";
import { toggle } from "../../../src/base.ts";
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
  view: (model: Model, h: Parameters<typeof toggle<Message>>[1]) =>
    toggle(
      {
        hint: "Receive product updates",
        isSelected: model.selected,
        label: model.label,
        onToggle: { _tag: "Toggled" },
      },
      h,
    ),
} as const;

export default { ...componentMeta("toggle"), title: "Untitled UI/Base/Toggle" };
export const AllVariants = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      matrix(
        [
          [
            "Sizes",
            [
              toggle({ label: model.label, size: "sm" }, h),
              toggle({ label: model.label, size: "md" }, h),
            ],
          ],
          [
            "Styles",
            [toggle({ label: model.label }, h), toggle({ label: model.label, slim: true }, h)],
          ],
        ],
        h,
      ),
  }),
  args: { label: "Notifications" },
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
              toggle({ isSelected: true, label: model.label }, h),
              toggle({ isDisabled: true, label: model.label }, h),
            ],
          ],
        ],
        h,
      ),
  }),
  args: { label: "Notifications" },
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [toggle({ isSelected: true, label: model.label }, h)],
      ),
  }),
  args: { label: "Notifications" },
};
export const Interactions = {
  ...liveStory(definition),
  args: { label: "Notifications" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const control = await within(canvasElement).findByRole("switch", { name: "Notifications" });
    await expect(control).not.toBeChecked();
    await userEvent.click(control);
    await expect(
      await within(canvasElement).findByRole("switch", { name: "Notifications" }),
    ).toBeChecked();
  },
};
