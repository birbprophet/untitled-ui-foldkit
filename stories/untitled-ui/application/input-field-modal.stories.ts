/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { inputFieldModal } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({ isOpen: S.Boolean, name: S.String });
type Model = typeof Model.Type;
const Shown = m("InputFieldModalShown");
const Closed = m("InputFieldModalClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Confirm" | "Dismiss" }>
  | Readonly<{ _tag: "NameInput"; value: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowInputFieldModal = Command.define("ShowInputFieldModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseInputFieldModal = Command.define("CloseInputFieldModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "Cancel" | "Confirm" | "Dismiss"): Message => ({ _tag: tag });
const nameInput = (projectName: string): Message => ({ _tag: "NameInput", value: projectName });

const definition = {
  Args,
  Model,
  init: () =>
    [
      { isOpen: true, name: "" },
      [ShowInputFieldModal({ selector: "#input-field-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "NameInput") {
      return [{ ...model, name: next.value }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "InputFieldModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Cancel" || next._tag === "Confirm" || next._tag === "Dismiss"
      ? ([updated, [CloseInputFieldModal({ selector: "#input-field-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof inputFieldModal<Message>>[1]) =>
    inputFieldModal(
      {
        id: "input-field-modal-story",
        isOpen: model.isOpen,
        name: model.name,
        onCancel: action("Cancel"),
        onConfirm: action("Confirm"),
        onDismiss: action("Dismiss"),
        onNameInput: nameInput,
      },
      h,
    ),
};

const meta = componentMeta("input-field-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Input Field Modal",
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
    const dialog = await canvas.findByRole("dialog", { name: "Project created" });
    const projectName = within(dialog).getByRole("textbox", { name: "Project name" });
    await userEvent.type(projectName, "Annual report");
    await expect(projectName).toHaveValue("Annual report");
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#input-field-modal-story")).toBeNull(),
    );
  },
};
