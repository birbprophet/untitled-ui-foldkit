/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-placeholder-implementation, effect/noAsyncFunction, effect/noSpread, effect/noTernary -- Storybook CSF and HTML placeholder fixtures are direct. */
import * as S from "effect/Schema";
import { textarea } from "../../../src/base.ts";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ label: S.String });
const Model = S.Struct({ label: S.String, value: S.String });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Typed"; value: string }>;
const typed = (fieldValue: string): Message => ({ _tag: "Typed", value: fieldValue });
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ label: args.label, value: "" }),
  update: (model: Model, message: Message): Model => ({ ...model, value: message.value }),
  view: (model: Model, h: Parameters<typeof textarea<Message>>[1]) =>
    textarea(
      {
        label: model.label,
        onInput: typed,
        placeholder: "Leave us a message...",
        value: model.value,
      },
      h,
    ),
} as const;

export default { ...componentMeta("textarea"), title: "Untitled UI/Base/Textarea" };
export const AllVariants = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("w-[480px]")],
        [
          matrix(
            [
              [
                "Sizes",
                [
                  textarea(
                    {
                      label: model.label,
                      onInput: typed,
                      placeholder: "Leave us a message...",
                      size: "sm",
                      value: model.value,
                    },
                    h,
                  ),
                  textarea(
                    {
                      label: model.label,
                      onInput: typed,
                      placeholder: "Leave us a message...",
                      size: "md",
                      value: model.value,
                    },
                    h,
                  ),
                ],
              ],
            ],
            h,
          ),
        ],
      ),
  }),
  args: { label: "Description" },
};
export const States = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("w-[480px]")],
        [
          matrix(
            [
              [
                "States",
                [
                  textarea(
                    { isDisabled: true, label: model.label, onInput: typed, value: "Disabled" },
                    h,
                  ),
                  textarea(
                    {
                      hint: "This field is required",
                      isInvalid: true,
                      label: model.label,
                      onInput: typed,
                      value: "",
                    },
                    h,
                  ),
                  textarea({ isRequired: true, label: model.label, onInput: typed, value: "" }, h),
                ],
              ],
            ],
            h,
          ),
        ],
      ),
  }),
  args: { label: "Description" },
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [h.div([h.Class("w-[480px]")], [definition.view(model, h)])],
      ),
  }),
  args: { label: "Description" },
};
export const Interactions = {
  ...liveStory(definition),
  args: { label: "Description" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const field = await within(canvasElement).findByRole("textbox", { name: "Description" });
    await userEvent.type(field, "A deterministic report.");
    await expect(
      await within(canvasElement).findByRole("textbox", { name: "Description" }),
    ).toHaveValue("A deterministic report.");
  },
};
