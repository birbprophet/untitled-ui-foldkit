/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { linkFieldModal } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({ isCopied: S.Boolean, isOpen: S.Boolean, link: S.String });
type Model = typeof Model.Type;
const Shown = m("LinkFieldModalShown");
const Closed = m("LinkFieldModalClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Confirm" | "Copy" | "Dismiss" }>
  | Readonly<{ _tag: "LinkInput"; value: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowLinkFieldModal = Command.define("ShowLinkFieldModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseLinkFieldModal = Command.define("CloseLinkFieldModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "Cancel" | "Confirm" | "Copy" | "Dismiss"): Message => ({ _tag: tag });
const linkInput = (link: string): Message => ({ _tag: "LinkInput", value: link });

const makeDefinition = (copied: boolean) => ({
  Args,
  Model,
  init: () =>
    [
      { isCopied: copied, isOpen: true, link: "www.siglata.com/blog" },
      [ShowLinkFieldModal({ selector: "#link-field-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "LinkInput") {
      return [{ ...model, link: next.value }, []] as const;
    }
    if (next._tag === "Copy") {
      return [{ ...model, isCopied: true }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "LinkFieldModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Cancel" || next._tag === "Confirm" || next._tag === "Dismiss"
      ? ([updated, [CloseLinkFieldModal({ selector: "#link-field-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof linkFieldModal<Message>>[1]) =>
    linkFieldModal(
      {
        copied: model.isCopied,
        id: "link-field-modal-story",
        isOpen: model.isOpen,
        link: model.link,
        onCancel: action("Cancel"),
        onConfirm: action("Confirm"),
        onCopy: action("Copy"),
        onDismiss: action("Dismiss"),
        onLinkInput: linkInput,
      },
      h,
    ),
});

const definition = makeDefinition(false);
const meta = componentMeta("link-field-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Link Field Modal",
};
export const AllVariants = { ...liveCommandStory(definition), args: {} };
export const States = { ...liveCommandStory(makeDefinition(true)), args: {} };
export const Dark = {
  ...liveCommandStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: {},
};
export const Responsive = { ...liveCommandStory(definition), args: {} };
export const Interactions = {
  ...liveCommandStory(definition),
  args: {},
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement.ownerDocument.body);
    const dialog = await canvas.findByRole("dialog", { name: "Blog post published" });
    const shareLink = within(dialog).getByRole("textbox", { name: "Share link" });
    await expect(shareLink).toHaveAttribute("readonly");
    await userEvent.click(within(dialog).getByRole("button", { name: "Copy link" }));
    await expect(within(dialog).getByRole("button", { name: "Link copied" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#link-field-modal-story")).toBeNull(),
    );
  },
};
