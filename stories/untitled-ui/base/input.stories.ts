/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-placeholder-implementation, effect/noAsyncFunction, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF and HTML placeholder fixtures are direct. */
import * as S from "effect/Schema";
import { input } from "../../../src/base.ts";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ label: S.String });
const Model = S.Struct({ isPasswordVisible: S.Boolean, label: S.String, value: S.String });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Typed"; value: string }> | Readonly<{ _tag: "ToggledPassword" }>;
const typed = (fieldValue: string): Message => ({ _tag: "Typed", value: fieldValue });
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    isPasswordVisible: false,
    label: args.label,
    value: "",
  }),
  update: (model: Model, message: Message): Model =>
    message._tag === "Typed"
      ? { ...model, value: message.value }
      : { ...model, isPasswordVisible: !model.isPasswordVisible },
  view: (model: Model, h: Parameters<typeof input<Message>>[1]) =>
    input(
      {
        isPasswordVisible: model.isPasswordVisible,
        label: model.label,
        onInput: typed,
        onTogglePassword: { _tag: "ToggledPassword" },
        placeholder: "you@example.com",
        type: "email",
        value: model.value,
      },
      h,
    ),
} as const;

export default { ...componentMeta("input"), title: "Untitled UI/Base/Input" };
export const AllVariants = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("w-[360px]")],
        [
          matrix(
            [
              [
                "Sizes",
                (["sm", "md", "lg"] as const).map((size) =>
                  input(
                    {
                      label: model.label,
                      onInput: typed,
                      placeholder: "you@example.com",
                      size,
                      value: model.value,
                    },
                    h,
                  ),
                ),
              ],
              [
                "Features",
                [
                  input(
                    {
                      label: "Search",
                      leadingIcon: true,
                      onInput: typed,
                      placeholder: "Search",
                      type: "search",
                      value: "",
                    },
                    h,
                  ),
                  input({ keyboardShortcut: "⌘K", label: "Command", onInput: typed, value: "" }, h),
                  input(
                    {
                      isPasswordVisible: model.isPasswordVisible,
                      label: "Password",
                      onInput: typed,
                      onTogglePassword: { _tag: "ToggledPassword" },
                      type: "password",
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
  args: { label: "Email" },
};
export const States = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("w-[360px]")],
        [
          matrix(
            [
              [
                "States",
                [
                  input(
                    { isDisabled: true, label: model.label, onInput: typed, value: "Disabled" },
                    h,
                  ),
                  input(
                    {
                      hint: "Enter a valid email address",
                      isInvalid: true,
                      label: model.label,
                      onInput: typed,
                      value: "invalid",
                    },
                    h,
                  ),
                  input({ isRequired: true, label: model.label, onInput: typed, value: "" }, h),
                ],
              ],
            ],
            h,
          ),
        ],
      ),
  }),
  args: { label: "Email" },
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [h.div([h.Class("w-[360px]")], [definition.view(model, h)])],
      ),
  }),
  args: { label: "Email" },
};
export const Interactions = {
  ...liveStory(definition),
  args: { label: "Email" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const field = await within(canvasElement).findByRole("textbox", { name: "Email" });
    await userEvent.type(field, "olivia@example.com");
    await expect(await within(canvasElement).findByRole("textbox", { name: "Email" })).toHaveValue(
      "olivia@example.com",
    );
  },
};
