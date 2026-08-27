/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { labelsMenu } from "../../../../../packages/ui/src/application/labels-menu.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const LabelId = S.Literals([
  "compliance",
  "customer-success",
  "design",
  "finance",
  "human-resources",
  "management",
  "marketing",
  "operations",
  "product",
  "product-design",
  "sales",
]);
type LabelsMenuLabelId = typeof LabelId.Type;
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({
  focusedId: S.optional(LabelId),
  inputValue: S.String,
  isOpen: S.Boolean,
  isPickerOpen: S.Boolean,
  locale: Locale,
  searchSelectedId: S.optional(LabelId),
  selectedIds: S.Array(LabelId),
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const Shown = m("LabelsMenuShown");
const Closed = m("LabelsMenuClosed");
const ShowFailed = m("LabelsMenuShowFailed");
const CloseFailed = m("LabelsMenuCloseFailed");
type Message =
  | Readonly<{
      _tag:
        | "AddLabel"
        | "Apply"
        | "Cancel"
        | "ClosePicker"
        | "Dismiss"
        | "ManageLabels"
        | "OpenPicker";
    }>
  | Readonly<{ _tag: "Focus" | "SearchSelect" | "Toggle"; id: LabelsMenuLabelId }>
  | Readonly<{ _tag: "Input"; labelFilter: string }>
  | typeof Shown.Type
  | typeof Closed.Type
  | typeof ShowFailed.Type
  | typeof CloseFailed.Type;

const ShowLabelsMenu = Command.define("ShowLabelsMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[data-labels-menu-close]" }).pipe(
      Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() }),
    ),
  messages: [Shown, ShowFailed],
});
const CloseLabelsMenu = Command.define("CloseLabelsMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed, CloseFailed],
});
const action = (
  tag: "AddLabel" | "Apply" | "Cancel" | "ClosePicker" | "Dismiss" | "ManageLabels" | "OpenPicker",
): Message => ({ _tag: tag });
const labelAction = (tag: "Focus" | "SearchSelect" | "Toggle", id: LabelsMenuLabelId): Message => ({
  _tag: tag,
  id,
});
const input = (labelFilter: string): Message => ({ _tag: "Input", labelFilter });

const initialSelected = ["design", "product", "marketing", "management"] as const;
const definitionWith = (state: "partial" | "unchecked") => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      {
        focusedId: undefined,
        inputValue: "",
        isOpen: true,
        isPickerOpen: false,
        locale: args.locale,
        searchSelectedId: undefined,
        selectedIds: state === "unchecked" ? [] : [...initialSelected],
      } satisfies Model,
      [ShowLabelsMenu({ selector: "#labels-menu-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "Input") {
      return [{ ...model, inputValue: message.labelFilter, isPickerOpen: true }, []] as const;
    }
    if (message._tag === "Focus") {
      return [{ ...model, focusedId: message.id }, []] as const;
    }
    if (message._tag === "Toggle") {
      return [
        {
          ...model,
          selectedIds: model.selectedIds.includes(message.id)
            ? model.selectedIds.filter((id) => id !== message.id)
            : [...model.selectedIds, message.id],
        },
        [],
      ] as const;
    }
    if (message._tag === "SearchSelect") {
      return [
        {
          ...model,
          inputValue: "",
          isPickerOpen: false,
          searchSelectedId: message.id,
          selectedIds: model.selectedIds.includes(message.id)
            ? model.selectedIds
            : [...model.selectedIds, message.id],
        },
        [],
      ] as const;
    }
    if (message._tag === "OpenPicker") {
      return [{ ...model, isPickerOpen: true }, []] as const;
    }
    if (message._tag === "ClosePicker") {
      return [{ ...model, isPickerOpen: false }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: message._tag === "LabelsMenuClosed" ? false : model.isOpen,
    } satisfies Model;
    return message._tag === "Apply" || message._tag === "Cancel" || message._tag === "Dismiss"
      ? ([updated, [CloseLabelsMenu({ selector: "#labels-menu-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof labelsMenu<Message>>[1]) =>
    labelsMenu(
      {
        focusedId: model.focusedId,
        id: "labels-menu-story",
        inputValue: model.inputValue,
        isOpen: model.isOpen,
        isPickerOpen: model.isPickerOpen,
        locale: model.locale,
        onAddLabel: action("AddLabel"),
        onApply: action("Apply"),
        onCancel: action("Cancel"),
        onClosePicker: action("ClosePicker"),
        onDismiss: action("Dismiss"),
        onFocusOption: (id: LabelsMenuLabelId) => labelAction("Focus", id),
        onInput: input,
        onManageLabels: action("ManageLabels"),
        onOpenPicker: action("OpenPicker"),
        onSearchSelect: (id: LabelsMenuLabelId) => labelAction("SearchSelect", id),
        onToggleLabel: (id: LabelsMenuLabelId) => labelAction("Toggle", id),
        searchSelectedId: model.searchSelectedId,
        selectedIds: model.selectedIds,
      },
      h,
    ),
});

const definition = definitionWith("partial");
const enUs = { locale: "en-US" } satisfies Args;
export default {
  ...componentMeta("labels-menu"),
  argTypes: { locale: { control: "select", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/Labels Menu",
};
export const AllVariants = { ...liveCommandStory(definition), args: enUs };
export const States = { ...liveCommandStory(definitionWith("unchecked")), args: enUs };
export const Dark = {
  ...liveCommandStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: enUs,
};
export const Responsive = { ...liveCommandStory(definition), args: enUs };
export const Interactions = {
  ...liveCommandStory(definition),
  args: enUs,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 15_000 });
    const currentDialog = () => page.getByRole("dialog", { name: "Slideout menu" });
    const currentCheckbox = (name: string) =>
      within(currentDialog()).getByRole("checkbox", { name });
    const currentCombobox = () => within(currentDialog()).getByRole("combobox", { name: "Labels" });
    const selectUnchecked = async (name: string) => {
      const checkbox = currentCheckbox(name);
      await expect(checkbox).not.toBeChecked();
      await userEvent.click(checkbox);
      await waitFor(() => expect(currentCheckbox(name)).toBeChecked());
    };

    await expect(within(currentDialog()).getByRole("button", { name: "Close" })).toHaveFocus();
    await expect(currentCheckbox("Product")).toBeChecked();
    await expect(currentCheckbox("Sales")).not.toBeChecked();

    await userEvent.click(currentCombobox());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(currentCombobox()).toHaveAttribute("aria-expanded", "false"));

    await userEvent.type(currentCombobox(), "Oper");
    await userEvent.keyboard("{ArrowDown}");
    const operationsOption = within(currentDialog()).getByRole("option", { name: "Operations" });
    await expect(operationsOption).toHaveFocus();
    await userEvent.click(operationsOption);
    await waitFor(() => expect(currentCheckbox("Operations")).toBeChecked());
    await expect(currentCombobox()).toHaveValue("");

    await selectUnchecked("Sales");
    await selectUnchecked("Product design");
    await selectUnchecked("Customer Success");
    await selectUnchecked("Human Resources");
    await selectUnchecked("Compliance");
    await selectUnchecked("Finance");
    await waitFor(() =>
      expect(
        within(currentDialog())
          .getAllByRole("checkbox")
          .every((checkbox) => checkbox.matches(":checked")),
      ).toBe(true),
    );
    await expect(
      within(currentDialog()).getByRole("button", { name: "Manage labels" }),
    ).toBeEnabled();
    await expect(currentCheckbox("Finance")).toHaveFocus();
  },
};
