/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-low-signal-variable-names, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { form02Modal } from "../../../src/application.ts";
import type { Form02ModalField } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Values = S.Struct({
  company: S.String,
  description: S.String,
  keywords: S.String,
  username: S.String,
  website: S.String,
});
const Model = S.Struct({
  isOpen: S.Boolean,
  values: Values,
});
type Model = typeof Model.Type;
const Shown = m("Form02ModalShown");
const Closed = m("Form02ModalClosed");
type Message =
  | Readonly<{ _tag: "AddCompany" | "Cancel" | "Dismiss" }>
  | Readonly<{ _tag: "AvatarSelected" }>
  | Readonly<{ _tag: "FieldInput"; field: Form02ModalField; value: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowForm02Modal = Command.define("ShowForm02Modal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Effect.sleep("50 millis").pipe(
      Effect.andThen(Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' })),
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseForm02Modal = Command.define("CloseForm02Modal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "AddCompany" | "Cancel" | "Dismiss"): Message => ({ _tag: tag });
const avatarAction = (): Message => ({ _tag: "AvatarSelected" });
const fieldInput = (field: Form02ModalField, value: string): Message => ({
  _tag: "FieldInput",
  field,
  value,
});

const initialModel = {
  isOpen: true,
  values: {
    company: "",
    description: "",
    keywords: "",
    username: "siglata",
    website: "",
  },
} satisfies Model;

const definition = {
  Args,
  Model,
  init: () => [initialModel, [ShowForm02Modal({ selector: "#form-02-modal-story" })]] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "FieldInput") {
      return [{ ...model, values: { ...model.values, [next.field]: next.value } }, []] as const;
    }
    if (next._tag === "AvatarSelected") {
      return [model, []] as const;
    }
    const updated = { ...model, isOpen: next._tag === "Form02ModalClosed" ? false : model.isOpen };
    return next._tag === "Dismiss" || next._tag === "Cancel" || next._tag === "AddCompany"
      ? ([updated, [CloseForm02Modal({ selector: "#form-02-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof form02Modal<Message>>[1]) =>
    form02Modal(
      {
        id: "form-02-modal-story",
        isOpen: model.isOpen,
        onAddCompany: action("AddCompany"),
        onAvatarSelected: avatarAction,
        onCancel: action("Cancel"),
        onDismiss: action("Dismiss"),
        onFieldInput: fieldInput,
        values: model.values,
      },
      h,
    ),
};

const meta = componentMeta("form-02-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Form 02 Modal",
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
    const dialog = await canvas.findByRole("dialog", { name: "Add your company" });
    const company = within(dialog).getByRole("textbox", { name: /^Company name/u });
    await userEvent.type(company, "Linear");
    await expect(company).toHaveValue("Linear");
    const username = within(dialog).getByRole("textbox", { name: "Username" });
    await userEvent.clear(username);
    await userEvent.type(username, "design");
    await expect(username).toHaveValue("design");
    await expect(within(dialog).getByRole("button", { name: "Add company" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#form-02-modal-story")).toBeNull(),
    );
  },
};
