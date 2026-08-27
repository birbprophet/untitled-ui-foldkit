/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF and native-dialog command checks use promise-based APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { modal } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory, liveStory } from "../story.ts";

const Args = S.Struct({
  description: S.String,
  title: S.String,
  width: S.Literals(["sm", "md", "lg"]),
});
const Model = S.Struct({
  description: S.String,
  isOpen: S.Boolean,
  title: S.String,
  width: S.Literals(["sm", "md", "lg"]),
});
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

const ShowDialog = Command.define("ShowDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => ShowSettled(), onSuccess: () => ShowSettled() }),
    ),
  messages: [ShowSettled],
});

const CloseDialog = Command.define("CloseDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseSettled(), onSuccess: () => CloseSettled() }),
    ),
  messages: [CloseSettled],
});

const actions = (h: Parameters<typeof modal<Message>>[1]) =>
  h.div(
    [h.Class("grid grid-cols-2 gap-3 border-t border-border-secondary p-4")],
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
        ["Confirm"],
      ),
    ],
  );

const definition = (initiallyOpen: boolean, showTrigger = true) => ({
  Args,
  Model,
  init: (args: Args): Model => ({ ...args, isOpen: initiallyOpen }),
  update: (model: Model, message: Message): Model => ({
    ...model,
    isOpen: message._tag === "Open" ? true : message._tag === "CloseSettled" ? false : model.isOpen,
  }),
  view: (model: Model, h: Parameters<typeof modal<Message>>[1]) =>
    modal(
      {
        content: [actions(h)],
        description: model.description,
        id: "untitled-modal-story",
        isOpen: model.isOpen,
        onCancel: cancel,
        onOpen: open,
        title: model.title,
        triggerLabel: showTrigger ? "Open modal" : undefined,
        width: model.width,
      },
      h,
    ),
});

export default { ...componentMeta("modal"), title: "Untitled UI/Application/Modal" };

export const AllVariants = {
  ...liveStory(definition(true, false)),
  args: {
    description: "Your changes will be saved for everyone in this organization.",
    title: "Save changes?",
    width: "md",
  },
};

export const States = {
  ...liveStory(definition(false)),
  args: {
    description: "Open the dialog to review the pending changes.",
    title: "Review changes",
    width: "sm",
  },
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
  args: {
    description: "Your changes will be saved for everyone in this organization.",
    title: "Save changes?",
    width: "md",
  },
};

export const Responsive = {
  ...liveStory(definition(true, false)),
  args: {
    description: "Your changes will be saved for everyone in this organization.",
    title: "Save changes?",
    width: "md",
  },
};

export const Interactions = {
  ...liveCommandStory({
    ...definition(false),
    init: (args) => [definition(false).init(args), []],
    update: (model, message) => {
      const next = definition(false).update(model, message);
      return message._tag === "Open"
        ? [next, [ShowDialog({ selector: "#untitled-modal-story" })]]
        : message._tag === "Cancel"
          ? [next, [CloseDialog({ selector: "#untitled-modal-story" })]]
          : [next, []];
    },
  }),
  args: {
    description: "Your changes will be saved for everyone in this organization.",
    title: "Save changes?",
    width: "md",
  },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole("button", { name: "Open modal" });
    await userEvent.click(trigger);
    const dialog = await canvas.findByRole("dialog", { name: "Save changes?" });
    await expect(dialog).toBeVisible();
    const closeButton = await canvas.findByRole("button", { name: "Close dialog" });
    await expect(closeButton).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(await canvas.findByRole("button", { name: "Confirm" })).toHaveFocus();
    await userEvent.tab();
    await expect(closeButton).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};
