/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { stackedWithTeamAndLinkModal } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

import { agentFace } from "../../fixtures/brand.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({ isCopied: S.Boolean, isOpen: S.Boolean, link: S.String, locale: Locale });
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const Shown = m("StackedWithTeamAndLinkModalShown");
const Closed = m("StackedWithTeamAndLinkModalClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Continue" | "Copy" | "Dismiss" }>
  | Readonly<{ _tag: "LinkInput"; value: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowStackedWithTeamAndLinkModal = Command.define("ShowStackedWithTeamAndLinkModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "button" }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseStackedWithTeamAndLinkModal = Command.define("CloseStackedWithTeamAndLinkModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "Cancel" | "Continue" | "Copy" | "Dismiss"): Message => ({ _tag: tag });
const linkInput = (link: string): Message => ({ _tag: "LinkInput", value: link });
const fixture = { locale: "en-US" } satisfies Args;
const members = [
  { avatarUrl: agentFace("Caitlyn King"), name: "Caitlyn King" },
  { avatarUrl: agentFace("Sienna Hewitt"), name: "Sienna Hewitt" },
  { avatarUrl: agentFace("Olly Schroeder"), name: "Olly Schroeder" },
] as const;

const definition = {
  Args,
  Model,
  init: (args: Args) =>
    [
      {
        isCopied: false,
        isOpen: true,
        link: "join.siglata.com/project",
        locale: args.locale,
      } satisfies Model,
      [ShowStackedWithTeamAndLinkModal({ selector: "#stacked-with-team-and-link-modal-story" })],
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
      isOpen: next._tag === "StackedWithTeamAndLinkModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Cancel" || next._tag === "Continue" || next._tag === "Dismiss"
      ? ([
          updated,
          [
            CloseStackedWithTeamAndLinkModal({
              selector: "#stacked-with-team-and-link-modal-story",
            }),
          ],
        ] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof stackedWithTeamAndLinkModal<Message>>[1]) =>
    stackedWithTeamAndLinkModal(
      {
        copied: model.isCopied,
        id: "stacked-with-team-and-link-modal-story",
        isOpen: model.isOpen,
        link: model.link,
        locale: model.locale,
        members,
        onCancel: action("Cancel"),
        onContinue: action("Continue"),
        onCopy: action("Copy"),
        onDismiss: action("Dismiss"),
        onLinkInput: linkInput,
      },
      h,
    ),
};

const copiedDefinition = {
  ...definition,
  init: (args: Args) => {
    const [model, commands] = definition.init(args);
    return [{ ...model, isCopied: true }, commands] as const;
  },
};

const meta = componentMeta("stacked-with-team-and-link-modal");
export default {
  ...meta,
  title: "Untitled UI/Application/Stacked With Team And Link Modal",
};
export const AllVariants = { ...liveCommandStory(definition), args: fixture };
export const States = { ...liveCommandStory(copiedDefinition), args: fixture };
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
    const canvas = within(canvasElement.ownerDocument.body);
    const dialog = await canvas.findByRole("dialog", { name: "Invite your team" });
    const link = within(dialog).getByRole("textbox", { name: "Share link" });
    await expect(link).toHaveAttribute("readonly");
    await userEvent.click(within(dialog).getByRole("button", { name: "Copy link" }));
    const copiedButton = await canvas.findByRole("button", { name: "Link copied" });
    const copiedDialog = copiedButton.closest("dialog") ?? dialog;
    await expect(copiedButton).toBeVisible();
    await userEvent.click(within(copiedDialog).getByRole("button", { name: "Continue" }));
    await waitFor(
      () =>
        expect(
          canvasElement.ownerDocument.querySelector("#stacked-with-team-and-link-modal-story"),
        ).toBeNull(),
      { timeout: 3000 },
    );
  },
};
