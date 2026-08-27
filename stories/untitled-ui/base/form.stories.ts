/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF and play functions use the browser promise API directly. */
import * as S from "effect/Schema";
import { button, form, input } from "ui/base";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const ValidationBehavior = S.Union([S.Literal("native"), S.Literal("aria")]);
const Args = S.Struct({ validationBehavior: ValidationBehavior });
const Model = S.Struct({
  email: S.String,
  isSubmitted: S.Boolean,
  validationBehavior: ValidationBehavior,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "EmailChanged"; value: string }>
  | Readonly<{ _tag: "Reset" }>
  | Readonly<{ _tag: "Submitted" }>;
const reset: Message = { _tag: "Reset" };
const submitted: Message = { _tag: "Submitted" };

const specimen = (
  model: Model,
  h: Parameters<typeof form<Message>>[1],
  options: Readonly<{
    id: string;
    isInvalid?: boolean;
    validationBehavior?: "aria" | "native";
  }>,
) =>
  form(
    {
      children: [
        input(
          {
            hint: options.isInvalid === true ? "Enter a valid email address" : undefined,
            isInvalid: options.isInvalid,
            isRequired: true,
            label: "Email",
            name: options.id,
            onInput: (value): Message => ({ _tag: "EmailChanged", value }),
            placeholder: "you@example.com",
            type: "email",
            value: model.email,
          },
          h,
        ),
        h.div(
          [h.Class("flex gap-3")],
          [
            button({ color: "secondary", label: "Reset", type: "reset" }, h),
            button(
              {
                label: model.isSubmitted ? "Submitted" : "Submit",
                type: "submit",
              },
              h,
            ),
          ],
        ),
      ],
      className: "flex w-80 flex-col gap-4",
      id: options.id,
      onReset: reset,
      onSubmit: submitted,
      validationBehavior: options.validationBehavior,
    },
    h,
  );

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ email: "", ...args, isSubmitted: false }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "EmailChanged") {
      return { ...model, email: message.value };
    }
    if (message._tag === "Reset") {
      return { ...model, email: "", isSubmitted: false };
    }
    return { ...model, isSubmitted: true };
  },
  view: (model: Model, h: Parameters<typeof form<Message>>[1]) =>
    specimen(model, h, {
      id: "form-interaction",
      validationBehavior: model.validationBehavior,
    }),
} as const;

export default { ...componentMeta("form"), title: "Untitled UI/Base/Form" };

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          ["Native validation", [specimen(model, h, { id: "form-native" })]],
          [
            "ARIA validation",
            [specimen(model, h, { id: "form-aria", validationBehavior: "aria" })],
          ],
        ],
        h,
      ),
  }),
  args: { validationBehavior: "native" },
};

export const States = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix([["Invalid", [specimen(model, h, { id: "form-invalid", isInvalid: true })]]], h),
  }),
  args: { validationBehavior: "native" },
};

export const Dark = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [specimen(model, h, { id: "form-dark" })],
      ),
  }),
  args: { validationBehavior: "native" },
};

export const Interactions = {
  ...liveStory(definition),
  args: { validationBehavior: "native" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const email = await canvas.findByRole("textbox", { name: /Email/u });
    await userEvent.type(email, "operator@siglata.com");
    await userEvent.click(await canvas.findByRole("button", { name: "Submit" }));
    await expect(await canvas.findByRole("button", { name: "Submitted" })).toBeEnabled();
  },
};
