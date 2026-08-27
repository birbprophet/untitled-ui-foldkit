/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-low-signal-variable-names, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { form01Modal } from "../../../src/application.ts";
import type { Form01ModalField } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Values = S.Struct({
  companyId: S.String,
  companyQuery: S.String,
  description: S.String,
  employmentId: S.String,
  locationId: S.String,
  locationQuery: S.String,
  secondTitle: S.String,
  title: S.String,
  website: S.String,
});
const Model = S.Struct({
  companyFocusedId: S.optional(S.String),
  isCompanyOpen: S.Boolean,
  isLocationOpen: S.Boolean,
  isOpen: S.Boolean,
  locationFocusedId: S.optional(S.String),
  selectedStep: S.Union([S.Literal(0), S.Literal(1)]),
  values: Values,
});
type Model = typeof Model.Type;
const Shown = m("Form01ModalShown");
const Closed = m("Form01ModalClosed");
type SelectField = "companyId" | "employmentId" | "locationId";
type Message =
  | Readonly<{ _tag: "AddExperience" | "Dismiss" | "Next" | "Previous" | "SaveDraft" }>
  | Readonly<{ _tag: "FieldInput"; field: Form01ModalField; value: string }>
  | Readonly<{ _tag: "Select"; field: SelectField; id: string }>
  | Readonly<{ _tag: "SelectFocused"; field: SelectField; id: string }>
  | Readonly<{ _tag: "SelectOpenChanged"; field: SelectField; isOpen: boolean }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowForm01Modal = Command.define("ShowForm01Modal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseForm01Modal = Command.define("CloseForm01Modal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "AddExperience" | "Dismiss" | "Next" | "Previous" | "SaveDraft"): Message => ({
  _tag: tag,
});
const fieldInput = (field: Form01ModalField, value: string): Message => ({
  _tag: "FieldInput",
  field,
  value,
});
const selection = (field: SelectField, id: string): Message => ({ _tag: "Select", field, id });
const selectionFocus = (field: SelectField, id: string): Message => ({
  _tag: "SelectFocused",
  field,
  id,
});
const selectionOpen = (field: SelectField, isOpen: boolean): Message => ({
  _tag: "SelectOpenChanged",
  field,
  isOpen,
});

const initialModel = {
  isCompanyOpen: false,
  isLocationOpen: false,
  isOpen: true,
  selectedStep: 0,
  values: {
    companyId: "",
    companyQuery: "",
    description: "",
    employmentId: "fulltime",
    locationId: "",
    locationQuery: "",
    secondTitle: "",
    title: "",
    website: "",
  },
} satisfies Model;

const definition = {
  Args,
  Model,
  init: () => [initialModel, [ShowForm01Modal({ selector: "#form-01-modal-story" })]] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "FieldInput") {
      return [{ ...model, values: { ...model.values, [next.field]: next.value } }, []] as const;
    }
    if (next._tag === "Select") {
      return [
        {
          ...model,
          isCompanyOpen: next.field === "companyId" ? false : model.isCompanyOpen,
          isLocationOpen: next.field === "locationId" ? false : model.isLocationOpen,
          values: { ...model.values, [next.field]: next.id },
        },
        [],
      ] as const;
    }
    if (next._tag === "SelectFocused") {
      return [
        {
          ...model,
          companyFocusedId: next.field === "companyId" ? next.id : model.companyFocusedId,
          locationFocusedId: next.field === "locationId" ? next.id : model.locationFocusedId,
        },
        [],
      ] as const;
    }
    if (next._tag === "SelectOpenChanged") {
      return [
        {
          ...model,
          isCompanyOpen: next.field === "companyId" ? next.isOpen : model.isCompanyOpen,
          isLocationOpen: next.field === "locationId" ? next.isOpen : model.isLocationOpen,
        },
        [],
      ] as const;
    }
    if (next._tag === "Next") {
      return [{ ...model, selectedStep: 1 }, []] as const;
    }
    if (next._tag === "Previous") {
      return [{ ...model, selectedStep: 0 }, []] as const;
    }
    const updated = { ...model, isOpen: next._tag === "Form01ModalClosed" ? false : model.isOpen };
    return next._tag === "Dismiss" || next._tag === "SaveDraft" || next._tag === "AddExperience"
      ? ([updated, [CloseForm01Modal({ selector: "#form-01-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof form01Modal<Message>>[1]) =>
    form01Modal(
      {
        companyFocusedId: model.companyFocusedId,
        id: "form-01-modal-story",
        isCompanyOpen: model.isCompanyOpen,
        isLocationOpen: model.isLocationOpen,
        isOpen: model.isOpen,
        locationFocusedId: model.locationFocusedId,
        onAddExperience: action("AddExperience"),
        onDismiss: action("Dismiss"),
        onFieldInput: fieldInput,
        onNext: action("Next"),
        onPrevious: action("Previous"),
        onSaveDraft: action("SaveDraft"),
        onSelect: selection,
        onSelectFocus: selectionFocus,
        onSelectOpenChanged: selectionOpen,
        selectedStep: model.selectedStep,
        values: model.values,
      },
      h,
    ),
};

const meta = componentMeta("form-01-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Form 01 Modal",
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
    const dialog = await canvas.findByRole("dialog", { name: "Add experience" });
    const title = within(dialog)
      .getAllByRole("textbox", { name: /^Title/u })
      .at(0);
    await expect(title).toBeDefined();
    if (title === undefined) {
      return;
    }
    await userEvent.type(title, "Product designer");
    await expect(title).toHaveValue("Product designer");
    await expect(within(dialog).getByRole("button", { name: "Save as draft" })).toBeVisible();
    await expect(within(dialog).getByRole("button", { name: "Add experience" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#form-01-modal-story")).toBeNull(),
    );
  },
};
