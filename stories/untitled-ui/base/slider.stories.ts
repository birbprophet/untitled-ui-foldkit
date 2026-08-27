/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, effect/noTernary, mps/require-is-prefix-for-boolean-schema-field -- Storybook CSF and play functions use the browser promise API directly. */
import * as S from "effect/Schema";
import { slider } from "../../../src/base.ts";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ label: S.String });
const Model = S.Struct({ label: S.String, value: S.Finite });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Changed"; value: number }>;
const changed = (sliderValue: number): Message => ({ _tag: "Changed", value: sliderValue });
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, value: 40 }),
  update: (model: Model, message: Message): Model => ({ ...model, value: message.value }),
  view: (model: Model, h: Parameters<typeof slider<Message>>[1]) =>
    h.div(
      [h.Class("w-[480px]")],
      [
        slider(
          {
            label: model.label,
            onChange: changed,
            value: model.value,
          },
          h,
        ),
      ],
    ),
} as const;

export default { ...componentMeta("slider"), title: "Untitled UI/Base/Slider" };
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
                "Labels",
                [
                  h.div(
                    [h.Class("w-full")],
                    [slider({ label: model.label, onChange: changed, value: model.value }, h)],
                  ),
                  h.div(
                    [h.Class("w-full")],
                    [
                      slider(
                        {
                          label: model.label,
                          labelPosition: "bottom",
                          onChange: changed,
                          value: model.value,
                        },
                        h,
                      ),
                    ],
                  ),
                  h.div(
                    [h.Class("w-full")],
                    [
                      slider(
                        {
                          label: model.label,
                          labelPosition: "top-floating",
                          onChange: changed,
                          value: model.value,
                        },
                        h,
                      ),
                    ],
                  ),
                ],
              ],
            ],
            h,
          ),
        ],
      ),
  }),
  args: { label: "Completion" },
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
  args: { label: "Completion" },
};
export const Interactions = {
  ...liveStory(definition),
  args: { label: "Completion" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const control = await within(canvasElement).findByRole("slider", { name: "Completion" });
    control.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(
      await within(canvasElement).findByRole("slider", { name: "Completion" }),
    ).toHaveValue("41");
  },
};
