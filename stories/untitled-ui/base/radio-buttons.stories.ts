/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, effect/noTernary, mps/require-is-prefix-for-boolean-schema-field -- Storybook CSF and play functions use the browser promise API directly. */
import * as S from "effect/Schema";
import { radioButtons } from "../../../src/base.ts";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory } from "../story.ts";

const Args = S.Struct({ label: S.String });
const Model = S.Struct({ label: S.String, selected: S.String });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Selected"; value: string }>;
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, selected: "basic" }),
  update: (model: Model, message: Message): Model => ({ ...model, selected: message.value }),
  view: (model: Model, h: Parameters<typeof radioButtons<Message>>[1]) =>
    radioButtons(
      {
        items: [
          {
            hint: "$10/month",
            label: model.label,
            message: { _tag: "Selected", value: "basic" },
            value: "basic",
          },
          {
            hint: "$20/month",
            label: "Business plan",
            message: { _tag: "Selected", value: "business" },
            value: "business",
          },
          {
            hint: "$40/month",
            label: "Enterprise plan",
            message: { _tag: "Selected", value: "enterprise" },
            value: "enterprise",
          },
        ],
        label: "Plans",
        name: "plan",
        selectedValue: model.selected,
      },
      h,
    ),
} as const;

export default { ...componentMeta("radio-buttons"), title: "Untitled UI/Base/Radio Buttons" };
export const AllVariants = { ...liveStory(definition), args: { label: "Basic plan" } };
export const States = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      radioButtons(
        {
          items: [
            { label: model.label, message: { _tag: "Selected", value: "basic" }, value: "basic" },
            {
              isDisabled: true,
              label: "Disabled plan",
              message: { _tag: "Selected", value: "disabled" },
              value: "disabled",
            },
          ],
          label: "States",
          name: "states",
          selectedValue: "basic",
          size: "md",
        },
        h,
      ),
  }),
  args: { label: "Selected plan" },
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: { label: "Basic plan" },
};
export const Interactions = {
  ...liveStory(definition),
  args: { label: "Basic plan" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const business = await canvas.findByRole("radio", { name: /Business plan/u });
    await userEvent.click(business);
    await expect(await canvas.findByRole("radio", { name: /Business plan/u })).toBeChecked();
    await userEvent.keyboard("{ArrowDown}");
    await expect(await canvas.findByRole("radio", { name: /Enterprise plan/u })).toBeChecked();
  },
};
