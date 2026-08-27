/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF and its pointer/keyboard play function use the browser promise API directly. */
import * as S from "effect/Schema";
import { alert } from "../../../src/application.ts";
import type { AlertColor } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({
  confirmLabel: S.String,
  description: S.String,
  dismissLabel: S.String,
  title: S.String,
});
const Model = S.Struct({ ...Args.fields, isVisible: S.Boolean });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Confirmed" | "Dismissed" }>;
const confirmed: Message = { _tag: "Confirmed" };
const dismissed: Message = { _tag: "Dismissed" };
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isVisible: true }),
  update: (model: Model, message: Message): Model =>
    message._tag === "Dismissed" ? { ...model, isVisible: false } : model,
  view: (model: Model, h: Parameters<typeof alert<Message>>[1]) =>
    model.isVisible
      ? alert(
          {
            ...model,
            confirmMessage: confirmed,
            dismissMessage: dismissed,
            variant: "floating",
          },
          h,
        )
      : h.div([]),
} as const;
const specimen = (
  model: Model,
  h: Parameters<typeof alert<Message>>[1],
  color: AlertColor,
  variant: "floating" | "full-width" = "floating",
  actionType: "button" | "link" = "link",
) =>
  alert(
    {
      ...model,
      actionType,
      color,
      confirmMessage: confirmed,
      dismissMessage: dismissed,
      variant,
    },
    h,
  );
const colors = ["default", "brand", "gray", "error", "warning", "success"] as const;

export default { ...componentMeta("alerts"), title: "Untitled UI/Application/Alerts" };

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          ...colors.map((color): [string, readonly ReturnType<typeof alert>[]] => [
            color,
            [specimen(model, h, color)],
          ]),
          ["Full width — buttons", [specimen(model, h, "default", "full-width", "button")]],
          ["Full width — links", [specimen(model, h, "brand", "full-width", "link")]],
        ],
        h,
      ),
  }),
  args: {
    confirmLabel: "View changes",
    description: "Your team has been updated with the latest permissions.",
    dismissLabel: "Dismiss",
    title: "We've just released a new feature",
  },
};

export const States = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          ["Actions", [specimen(model, h, "default")]],
          [
            "No actions",
            [
              alert(
                {
                  confirmLabel: model.confirmLabel,
                  description: model.description,
                  title: model.title,
                },
                h,
              ),
            ],
          ],
        ],
        h,
      ),
  }),
  args: {
    confirmLabel: "View changes",
    description: "Your team has been updated with the latest permissions.",
    dismissLabel: "Dismiss",
    title: "We've just released a new feature",
  },
};

export const Dark = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
        [specimen(model, h, "brand")],
      ),
  }),
  args: {
    confirmLabel: "View changes",
    description: "Your team has been updated with the latest permissions.",
    dismissLabel: "Dismiss",
    title: "We've just released a new feature",
  },
};

export const Responsive = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) => specimen(model, h, "default", "full-width", "button"),
  }),
  args: {
    confirmLabel: "View changes",
    description: "Your team has been updated with the latest permissions.",
    dismissLabel: "Dismiss",
    title: "We've just released a new feature",
  },
};

export const Interactions = {
  ...liveStory(definition),
  args: {
    confirmLabel: "View changes",
    description: "Your team has been updated with the latest permissions.",
    dismissLabel: "Dismiss",
    title: "We've just released a new feature",
  },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const dismiss = await canvas.findByLabelText("Dismiss");
    dismiss.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(canvas.queryByText("We've just released a new feature")).toBeNull());
  },
};
