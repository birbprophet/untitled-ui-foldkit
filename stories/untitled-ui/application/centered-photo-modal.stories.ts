/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook play functions and native dialog commands use promise-based browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { centeredPhotoModal } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({ isCopied: S.Boolean, isOpen: S.Boolean });
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const DialogShown = m("CenteredPhotoDialogShown");
const DialogClosed = m("CenteredPhotoDialogClosed");
type Message =
  | Readonly<{ _tag: "CopyLink" | "Dismiss" | "Finish" }>
  | typeof DialogShown.Type
  | typeof DialogClosed.Type;

const ShowCenteredPhotoDialog = Command.define("ShowCenteredPhotoDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "button" }).pipe(
      Effect.match({ onFailure: () => DialogShown(), onSuccess: () => DialogShown() }),
    ),
  messages: [DialogShown],
});

const CloseCenteredPhotoDialog = Command.define("CloseCenteredPhotoDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => DialogClosed(), onSuccess: () => DialogClosed() }),
    ),
  messages: [DialogClosed],
});

const simple = (tag: "CopyLink" | "Dismiss" | "Finish"): Message => ({ _tag: tag });

const definitionWith = (copied: boolean) => ({
  Args,
  Model,
  init: (_args: Args) =>
    [
      { isCopied: copied, isOpen: true } satisfies Model,
      [ShowCenteredPhotoDialog({ selector: "#centered-photo-modal-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "CopyLink") {
      return [{ ...model, isCopied: true }, []] as const;
    }
    const next = {
      ...model,
      isOpen: message._tag === "CenteredPhotoDialogClosed" ? false : model.isOpen,
    } satisfies Model;
    return message._tag === "Dismiss" || message._tag === "Finish"
      ? ([next, [CloseCenteredPhotoDialog({ selector: "#centered-photo-modal-story" })]] as const)
      : ([next, []] as const);
  },
  view: (model: Model, h: Parameters<typeof centeredPhotoModal<Message>>[1]) =>
    centeredPhotoModal(
      {
        id: "centered-photo-modal-story",
        isCopied: model.isCopied,
        isOpen: model.isOpen,
        onCopyLink: simple("CopyLink"),
        onDismiss: simple("Dismiss"),
        onFinish: simple("Finish"),
      },
      h,
    ),
});

const definition = definitionWith(false);
const fixture = {} satisfies Args;

export default {
  ...componentMeta("centered-photo-modal"),
  title: "Untitled UI/Application/Centered Photo Modal",
};

export const AllVariants = { ...liveCommandStory(definition), args: fixture };

export const States = { ...liveCommandStory(definitionWith(true)), args: fixture };

export const Dark = {
  ...liveCommandStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: fixture,
};

export const Responsive = { ...liveCommandStory(definition), args: fixture };

export const Interactions = {
  ...liveCommandStory(definition),
  args: fixture,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const dialog = await canvas.findByRole("dialog", { name: "Blog post published" });
    await expect(dialog).toBeVisible();
    await expect(await canvas.findByRole("img", { name: "Flowers for Modal" })).toBeVisible();
    await userEvent.click(await canvas.findByRole("button", { name: "Copy link" }));
    await expect(await canvas.findByRole("button", { name: "Copied" })).toBeVisible();
    await userEvent.click(await canvas.findByRole("button", { name: "Finish" }));
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
  },
};
