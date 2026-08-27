/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-await-in-loop, mps/avoid-direct-tag-checks, mps/imperative-loops, mps/require-is-prefix-for-boolean-schema-field -- Storybook CSF and sequential play functions use the browser promise API directly. */
import * as S from "effect/Schema";
import { pinInput } from "ui/base";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ label: S.String });
const Model = S.Struct({ isFocused: S.Boolean, label: S.String, value: S.String });
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Blurred" }>
  | Readonly<{ _tag: "Focused" }>
  | Readonly<{ _tag: "Typed"; value: string }>;
const typed = (pinValue: string): Message => ({ _tag: "Typed", value: pinValue });
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isFocused: false, value: "" }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "Focused") {
      return { ...model, isFocused: true };
    }
    if (message._tag === "Blurred") {
      return { ...model, isFocused: false };
    }
    return { ...model, value: message.value };
  },
  view: (model: Model, h: Parameters<typeof pinInput<Message>>[1]) =>
    pinInput(
      {
        description: "Enter the four-digit code.",
        id: "secure-code",
        isFocused: model.isFocused,
        label: model.label,
        onBlur: { _tag: "Blurred" },
        onFocus: { _tag: "Focused" },
        onInput: typed,
        value: model.value,
      },
      h,
    ),
} as const;

const staticPin = (
  label: string,
  pinValue: string,
  h: Parameters<typeof pinInput<Message>>[1],
  options: Readonly<{
    id: string;
    isDisabled?: boolean;
    isFocused?: boolean;
    isInvalid?: boolean;
    maxLength?: number;
    separatorAfter?: readonly number[];
    size?: "xxxs" | "xxs" | "xs" | "sm" | "md" | "lg";
  }>,
) =>
  pinInput(
    {
      description: "Enter the four-digit code.",
      label,
      onInput: typed,
      value: pinValue,
      ...options,
    },
    h,
  );

export default { ...componentMeta("pin-input"), title: "Untitled UI/Base/PIN Input" };

export const AllVariants = {
  ...liveStory<typeof Args.Type, Model, Message>({
    ...definition,
    update: (model) => model,
    view: (model, h) =>
      matrix(
        [
          [
            "Sizes",
            (["xxxs", "xxs", "xs", "sm", "md", "lg"] as const).map((size) =>
              staticPin(model.label, "1234", h, { id: `pin-${size}`, size }),
            ),
          ],
          [
            "Separator",
            [
              staticPin(model.label, "123456", h, {
                id: "pin-separator",
                maxLength: 6,
                separatorAfter: [3],
              }),
            ],
          ],
        ],
        h,
      ),
  }),
  args: { label: "Secure code" },
};

export const States = {
  ...liveStory<typeof Args.Type, Model, Message>({
    ...definition,
    update: (model) => model,
    view: (model, h) =>
      matrix(
        [
          [
            "States",
            [
              staticPin(model.label, "12", h, { id: "pin-focused", isFocused: true }),
              staticPin(model.label, "1234", h, { id: "pin-invalid", isInvalid: true }),
              staticPin(model.label, "1234", h, { id: "pin-disabled", isDisabled: true }),
            ],
          ],
        ],
        h,
      ),
  }),
  args: { label: "Secure code" },
};

export const Dark = {
  ...liveStory<typeof Args.Type, Model, Message>({
    ...definition,
    update: (model) => model,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [staticPin(model.label, "1234", h, { id: "pin-dark" })],
      ),
  }),
  args: { label: "Secure code" },
};

export const Interactions = {
  ...liveStory(definition),
  args: { label: "Secure code" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const input = await within(canvasElement).findByRole("textbox", { name: "Secure code" });
    await userEvent.click(input);
    for (const [character, expectedValue] of [
      ["1", "1"],
      ["2", "12"],
      ["a", "12"],
      ["3", "123"],
      ["4", "1234"],
    ] as const) {
      await userEvent.type(input, character);
      await waitFor(() => expect(input).toHaveValue(expectedValue));
    }
    await expect(input).toHaveValue("1234");
    await expect(input).toHaveAttribute("aria-invalid", "false");
  },
};
