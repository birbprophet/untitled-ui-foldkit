/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { stackedWithTeamModal } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({ isOpen: S.Boolean });
type Model = typeof Model.Type;
const Shown = m("StackedWithTeamModalShown");
const Closed = m("StackedWithTeamModalClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Dismiss" | "GetStarted" }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowStackedWithTeamModal = Command.define("ShowStackedWithTeamModal", {
  args: { focusSelector: S.String, selector: S.String },
  execute: ({ focusSelector, selector }) =>
    Dom.showDialog(selector, { focusSelector }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseStackedWithTeamModal = Command.define("CloseStackedWithTeamModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});

const action = (tag: "Cancel" | "Dismiss" | "GetStarted"): Message => ({ _tag: tag });

const definition = (focusSelector: string) => ({
  Args,
  Model,
  init: () =>
    [
      { isOpen: true } satisfies Model,
      [
        ShowStackedWithTeamModal({
          focusSelector,
          selector: "#stacked-with-team-modal-story",
        }),
      ],
    ] as const,
  update: (model: Model, next: Message) => {
    const updated = {
      ...model,
      isOpen: next._tag === "StackedWithTeamModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Cancel" || next._tag === "Dismiss" || next._tag === "GetStarted"
      ? ([
          updated,
          [CloseStackedWithTeamModal({ selector: "#stacked-with-team-modal-story" })],
        ] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof stackedWithTeamModal<Message>>[1]) =>
    stackedWithTeamModal(
      {
        id: "stacked-with-team-modal-story",
        isOpen: model.isOpen,
        onCancel: action("Cancel"),
        onDismiss: action("Dismiss"),
        onGetStarted: action("GetStarted"),
      },
      h,
    ),
});

const defaultDefinition = definition("button");
const stateDefinition = definition("button:last-child");
const meta = componentMeta("stacked-with-team-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Stacked With Team Modal",
};
export const AllVariants = { ...liveCommandStory(defaultDefinition), args: {} };
export const States = { ...liveCommandStory(stateDefinition), args: {} };
export const Dark = {
  ...liveCommandStory({
    ...defaultDefinition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [defaultDefinition.view(model, h)],
      ),
  }),
  args: {},
};
export const Responsive = { ...liveCommandStory(defaultDefinition), args: {} };
export const Interactions = {
  ...liveCommandStory(defaultDefinition),
  args: {},
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await page.findByRole("dialog", {
      name: "You've been added to the team!",
    });
    const cancel = within(dialog).getByRole("button", { name: "Cancel" });
    const getStarted = within(dialog).getByRole("button", { name: "Get started" });
    await expect(cancel).toHaveFocus();
    await userEvent.tab();
    await expect(getStarted).toHaveFocus();
    await userEvent.click(getStarted);
    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument());
  },
};
