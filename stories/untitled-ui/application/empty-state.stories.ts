/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF and its keyboard play function use the browser promise API directly. */
import * as S from "effect/Schema";
import { emptyState } from "ui/application";
import type { EmptyStateDecoration, EmptyStateSize } from "ui/application";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({
  confirmLabel: S.String,
  decoration: S.Union([
    S.Literal("featured-icon"),
    S.Literal("illustration"),
    S.Literal("file-type"),
    S.Literal("avatar-radius"),
    S.Literal("avatar-row"),
    S.Literal("avatar-grid"),
  ]),
  description: S.String,
  dismissLabel: S.String,
  pattern: S.Union([S.Literal("circle"), S.Literal("none")]),
  size: S.Union([S.Literal("sm"), S.Literal("md"), S.Literal("lg")]),
  title: S.String,
});
const Model = S.Struct({
  ...Args.fields,
  action: S.Union([S.Literal("idle"), S.Literal("confirmed"), S.Literal("dismissed")]),
});
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Confirmed" | "Dismissed" }>;
const confirmed: Message = { _tag: "Confirmed" };
const dismissed: Message = { _tag: "Dismissed" };
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, action: "idle" }),
  update: (model: Model, message: Message): Model => ({
    ...model,
    action: message._tag === "Confirmed" ? "confirmed" : "dismissed",
  }),
  view: (model: Model, h: Parameters<typeof emptyState<Message>>[1]) =>
    emptyState(
      model.action === "idle"
        ? { ...model, confirmMessage: confirmed, dismissMessage: dismissed }
        : {
            ...model,
            description:
              model.action === "confirmed"
                ? "Your project is ready to configure."
                : "No changes were made.",
            title: model.action === "confirmed" ? "Project created" : "Creation cancelled",
          },
      h,
    ),
} as const;

const specimen = (
  model: Model,
  h: Parameters<typeof emptyState<Message>>[1],
  decoration: EmptyStateDecoration,
  size: EmptyStateSize,
) =>
  emptyState(
    {
      ...model,
      confirmMessage: confirmed,
      decoration,
      dismissMessage: dismissed,
      size,
    },
    h,
  );

const defaultArgs = {
  confirmLabel: "Create new project",
  decoration: "featured-icon",
  description: "Your search did not match any projects. Please try again.",
  dismissLabel: "Clear search",
  pattern: "circle",
  size: "lg",
  title: "No projects found",
} as const;

export default { ...componentMeta("empty-state"), title: "Untitled UI/Application/Empty State" };

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          ["Featured icon", [specimen(model, h, "featured-icon", "lg")]],
          ["Illustration", [specimen(model, h, "illustration", "lg")]],
          ["File type icon", [specimen(model, h, "file-type", "lg")]],
          ["Avatar radius", [specimen(model, h, "avatar-radius", "lg")]],
          ["Avatar row", [specimen(model, h, "avatar-row", "lg")]],
          ["Avatar grid", [specimen(model, h, "avatar-grid", "lg")]],
        ],
        h,
      ),
  }),
  args: defaultArgs,
};

export const States = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          ["Small", [specimen(model, h, model.decoration, "sm")]],
          ["Medium", [specimen(model, h, model.decoration, "md")]],
          ["Large", [specimen(model, h, model.decoration, "lg")]],
          ["No actions or pattern", [emptyState({ ...model, pattern: "none", size: "md" }, h)]],
        ],
        h,
      ),
  }),
  args: defaultArgs,
};

export const Dark = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      h.div(
        [
          h.Class("min-h-screen bg-bg-primary p-8 outline-[100vmax] outline-bg-primary"),
          h.DataAttribute("theme", "dark"),
        ],
        [specimen(model, h, "featured-icon", "lg")],
      ),
  }),
  args: defaultArgs,
};

export const Interactions = {
  ...liveStory(definition),
  args: defaultArgs,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const create = await canvas.findByRole("button", { name: "Create new project" });
    create.focus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.findByText("Project created")).resolves.toBeTruthy();
    await expect(canvas.queryByRole("button", { name: "Create new project" })).toBeNull();
  },
};
