/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF and play functions use the browser promise API directly. */
import * as S from "effect/Schema";
import { button, hookForm, input } from "../../../src/base.ts";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ isSubmitting: S.Boolean });
const Model = S.Struct({ email: S.String, isSubmitted: S.Boolean, isSubmitting: S.Boolean });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "EmailChanged"; value: string }> | Readonly<{ _tag: "Submitted" }>;
const submitted: Message = { _tag: "Submitted" };

const specimen = (
  model: Model,
  h: Parameters<typeof hookForm<Message>>[1],
  id: string,
  forceInvalid = false,
) => {
  const invalid = forceInvalid || (model.isSubmitted && !model.email.includes("@"));
  return hookForm(
    {
      children: [
        input(
          {
            hint: invalid ? "Enter a valid email address" : undefined,
            isInvalid: invalid,
            isRequired: true,
            label: "Email",
            name: id,
            onInput: (value): Message => ({ _tag: "EmailChanged", value }),
            placeholder: "you@example.com",
            type: "email",
            value: model.email,
          },
          h,
        ),
        button(
          {
            isDisabled: model.isSubmitting,
            isLoading: model.isSubmitting,
            label: "Submit",
            showTextWhileLoading: true,
            type: "submit",
          },
          h,
        ),
      ],
      className: "flex w-80 flex-col gap-4",
      id,
      isSubmitting: model.isSubmitting,
      onSubmit: submitted,
    },
    h,
  );
};

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ email: "", ...args, isSubmitted: false }),
  update: (model: Model, message: Message): Model =>
    message._tag === "EmailChanged"
      ? { ...model, email: message.value, isSubmitted: false }
      : { ...model, isSubmitted: true },
  view: (model: Model, h: Parameters<typeof hookForm<Message>>[1]) =>
    specimen(model, h, "hook-form-interaction"),
} as const;

export default { ...componentMeta("hook-form"), title: "Untitled UI/Base/Hook Form" };

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) => matrix([["Controlled", [specimen(model, h, "hook-form")]]], h),
  }),
  args: { isSubmitting: false },
};

export const States = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          ["Invalid", [specimen(model, h, "hook-form-invalid", true)]],
          ["Submitting", [specimen({ ...model, isSubmitting: true }, h, "hook-form-loading")]],
        ],
        h,
      ),
  }),
  args: { isSubmitting: false },
};

export const Dark = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [specimen(model, h, "hook-form-dark")],
      ),
  }),
  args: { isSubmitting: false },
};

export const Interactions = {
  ...liveStory(definition),
  args: { isSubmitting: false },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Submit" }));
    await expect(await canvas.findByRole("alert")).toHaveTextContent("Enter a valid email address");
    await expect(await canvas.findByRole("textbox", { name: /Email/u })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  },
};
