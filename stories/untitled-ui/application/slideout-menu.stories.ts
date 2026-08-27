/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-placeholder-implementation, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF, real input placeholders, and native-dialog command checks use these forms. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { slideoutMenu } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory, liveStory } from "../story.ts";

const Args = S.Struct({ description: S.String, title: S.String });
const Model = S.Struct({ description: S.String, isOpen: S.Boolean, title: S.String });
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const ShowSettled = m("ShowSettled");
const CloseSettled = m("CloseSettled");
type Message =
  | Readonly<{ _tag: "Cancel" | "Open" }>
  | typeof ShowSettled.Type
  | typeof CloseSettled.Type;
const open: Message = { _tag: "Open" };
const cancel: Message = { _tag: "Cancel" };

const ShowSlideoutDialog = Command.define("ShowSlideoutDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close slideout menu"]' }).pipe(
      Effect.match({ onFailure: () => ShowSettled(), onSuccess: () => ShowSettled() }),
    ),
  messages: [ShowSettled],
});

const CloseSlideoutDialog = Command.define("CloseSlideoutDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseSettled(), onSuccess: () => CloseSettled() }),
    ),
  messages: [CloseSettled],
});

const body = (h: Parameters<typeof slideoutMenu<Message>>[1]) => [
  h.div(
    [h.Class("flex flex-col gap-1.5")],
    [
      h.label(
        [h.Class("text-sm font-medium text-text-secondary"), h.For("project-name")],
        ["Project name"],
      ),
      h.input([
        h.Class(
          "h-10 rounded-lg bg-bg-primary px-3 text-sm text-text-primary shadow-xs ring-1 ring-border-primary ring-inset outline-focus-ring placeholder:text-text-placeholder focus-visible:outline-2 focus-visible:outline-offset-2",
        ),
        h.Id("project-name"),
        h.Placeholder("Website redesign"),
        h.Type("text"),
      ]),
    ],
  ),
  h.div(
    [h.Class("flex flex-col gap-1.5")],
    [
      h.label(
        [h.Class("text-sm font-medium text-text-secondary"), h.For("project-owner")],
        ["Owner"],
      ),
      h.input([
        h.Class(
          "h-10 rounded-lg bg-bg-primary px-3 text-sm text-text-primary shadow-xs ring-1 ring-border-primary ring-inset outline-focus-ring placeholder:text-text-placeholder focus-visible:outline-2 focus-visible:outline-offset-2",
        ),
        h.Id("project-owner"),
        h.Placeholder("Olivia Rhye"),
        h.Type("text"),
      ]),
    ],
  ),
];

const footer = (h: Parameters<typeof slideoutMenu<Message>>[1]) => [
  h.div(
    [h.Class("grid grid-cols-2 gap-3")],
    [
      h.button(
        [
          h.Class(
            "rounded-lg bg-bg-primary px-3.5 py-2.5 text-sm font-semibold text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.OnClick(cancel),
          h.Type("button"),
        ],
        ["Cancel"],
      ),
      h.button(
        [
          h.Class(
            "rounded-lg bg-bg-brand-solid px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs-skeuomorphic outline-focus-ring hover:bg-bg-brand-solid-hover focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.OnClick(cancel),
          h.Type("button"),
        ],
        ["Save changes"],
      ),
    ],
  ),
];

const definition = (initiallyOpen: boolean, showTrigger = true) => ({
  Args,
  Model,
  init: (args: Args): Model => ({ ...args, isOpen: initiallyOpen }),
  update: (model: Model, message: Message): Model => ({
    ...model,
    isOpen: message._tag === "Open" ? true : message._tag === "CloseSettled" ? false : model.isOpen,
  }),
  view: (model: Model, h: Parameters<typeof slideoutMenu<Message>>[1]) =>
    slideoutMenu(
      {
        content: body(h),
        description: model.description,
        footer: footer(h),
        id: "untitled-slideout-story",
        isOpen: model.isOpen,
        onCancel: cancel,
        onOpen: open,
        title: model.title,
        triggerLabel: showTrigger ? "Open slideout" : undefined,
      },
      h,
    ),
});

export default {
  ...componentMeta("slideout-menu"),
  title: "Untitled UI/Application/Slideout Menu",
};

export const AllVariants = {
  ...liveStory(definition(true, false)),
  args: { description: "Update the project details below.", title: "Edit project" },
};

export const States = {
  ...liveStory(definition(false)),
  args: { description: "Update the project details below.", title: "Edit project" },
};

export const Dark = {
  ...liveStory({
    ...definition(true, false),
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition(true, false).view(model, h)],
      ),
  }),
  args: { description: "Update the project details below.", title: "Edit project" },
};

export const Responsive = {
  ...liveStory(definition(true, false)),
  args: { description: "Update the project details below.", title: "Edit project" },
};

export const Interactions = {
  ...liveCommandStory({
    ...definition(false),
    init: (args) => [definition(false).init(args), []],
    update: (model, message) => {
      const next = definition(false).update(model, message);
      return message._tag === "Open"
        ? [next, [ShowSlideoutDialog({ selector: "#untitled-slideout-story" })]]
        : message._tag === "Cancel"
          ? [next, [CloseSlideoutDialog({ selector: "#untitled-slideout-story" })]]
          : [next, []];
    },
  }),
  args: { description: "Update the project details below.", title: "Edit project" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole("button", { name: "Open slideout" });
    await userEvent.click(trigger);
    const dialog = await canvas.findByRole("dialog", { name: "Slideout menu" });
    await expect(dialog).toBeVisible();
    const closeButton = await canvas.findByRole("button", { name: "Close slideout menu" });
    await expect(closeButton).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(await canvas.findByRole("button", { name: "Save changes" })).toHaveFocus();
    await userEvent.tab();
    await expect(closeButton).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    const backdrop = canvasElement.querySelector<HTMLButtonElement>(
      '[data-slideout-overlay="untitled-slideout-story"] > button',
    );
    await expect(backdrop).not.toBeNull();
    if (backdrop !== null) {
      await userEvent.click(backdrop);
    }
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};
