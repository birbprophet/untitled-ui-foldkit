/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF and its keyboard play function use the browser promise API directly. */
import * as S from "effect/Schema";
import { rangePreset } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ label: S.String });
const Model = S.Struct({ isSelected: S.Boolean, label: S.String });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Selected" }>;
const selected: Message = { _tag: "Selected" };
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isSelected: false }),
  update: (model: Model): Model => ({ ...model, isSelected: true }),
  view: (model: Model, h: Parameters<typeof rangePreset<Message>>[1]) =>
    rangePreset({ isSelected: model.isSelected, label: model.label, onPress: selected }, h),
} as const;

export default { ...componentMeta("range-preset"), title: "Untitled UI/Application/Range Preset" };

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          ["Unselected", [rangePreset({ label: "Today", onPress: selected }, h)]],
          [
            "Selected",
            [rangePreset({ isSelected: true, label: "Last 7 days", onPress: selected }, h)],
          ],
        ],
        h,
      ),
  }),
  args: { label: "Today" },
};

export const States = AllVariants;

export const Dark = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
        [definition.view({ ...model, isSelected: true }, h)],
      ),
  }),
  args: { label: "Last 7 days" },
};

export const Interactions = {
  ...liveStory(definition),
  args: { label: "Today" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const preset = await within(canvasElement).findByRole("button", { name: "Today" });
    preset.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(preset).toHaveAttribute("aria-pressed", "true"));
  },
};
