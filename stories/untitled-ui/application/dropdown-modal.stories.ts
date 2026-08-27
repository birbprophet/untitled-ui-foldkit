/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { dropdownModal } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({
  focusedId: S.String,
  isOpen: S.Boolean,
  isSelectOpen: S.Boolean,
  selectedPersonId: S.String,
});
type Model = typeof Model.Type;
const Shown = m("DropdownModalShown");
const Closed = m("DropdownModalClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Confirm" | "Dismiss" }>
  | Readonly<{ _tag: "Focused" | "Selected"; id: string }>
  | Readonly<{ _tag: "SelectOpenChanged"; isOpen: boolean }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowDropdownModal = Command.define("ShowDropdownModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseDropdownModal = Command.define("CloseDropdownModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "Cancel" | "Confirm" | "Dismiss"): Message => ({ _tag: tag });
const focused = (id: string): Message => ({ _tag: "Focused", id });
const selected = (id: string): Message => ({ _tag: "Selected", id });
const selectOpenChanged = (isOpen: boolean): Message => ({ _tag: "SelectOpenChanged", isOpen });

const definition = {
  Args,
  Model,
  init: () =>
    [
      {
        focusedId: "@olivia",
        isOpen: true,
        isSelectOpen: false,
        selectedPersonId: "@olivia",
      } satisfies Model,
      [ShowDropdownModal({ selector: "#dropdown-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "Focused") {
      return [{ ...model, focusedId: next.id }, []] as const;
    }
    if (next._tag === "Selected") {
      return [{ ...model, selectedPersonId: next.id }, []] as const;
    }
    if (next._tag === "SelectOpenChanged") {
      return [{ ...model, isSelectOpen: next.isOpen }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "DropdownModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Cancel" || next._tag === "Confirm" || next._tag === "Dismiss"
      ? ([updated, [CloseDropdownModal({ selector: "#dropdown-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof dropdownModal<Message>>[1]) =>
    dropdownModal(
      {
        id: "dropdown-modal-story",
        isOpen: model.isOpen,
        onCancel: action("Cancel"),
        onConfirm: action("Confirm"),
        onDismiss: action("Dismiss"),
        onFocusPerson: focused,
        onSelectOpenChanged: selectOpenChanged,
        onSelectPerson: selected,
        selectedPersonId: model.selectedPersonId,
      },
      h,
    ),
};

const meta = componentMeta("dropdown-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Dropdown Modal",
};
export const AllVariants = { ...liveCommandStory(definition), args: {} };
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
    const trigger = within(dialog).getByRole("button", { name: "Team member" });
    await userEvent.click(trigger);
    const option = await canvas.findByRole("option", { name: /Phoenix Baker/u });
    await userEvent.click(option);
    await waitFor(() => expect(trigger).toHaveTextContent("Phoenix Baker"));
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#dropdown-modal-story")).toBeNull(),
    );
  },
};
