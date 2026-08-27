/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF and browser interaction checks use promise-based APIs. */
import * as S from "effect/Schema";
import * as Effect from "effect/Effect";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import type { DropdownItemSpec, DropdownSelectionIndicator } from "ui/base";
import { dropdown } from "ui/base";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory, liveStory, matrix } from "../story.ts";

const Args = S.Struct({
  selectionIndicator: S.Literals(["checkmark", "checkbox", "radio", "toggle", "none"]),
  trigger: S.Literals(["button", "dots"]),
  triggerLabel: S.String,
});
const Model = S.Struct({
  focusedId: S.String,
  isOpen: S.Boolean,
  selectedIds: S.Array(S.String),
  selectionIndicator: S.Literals(["checkmark", "checkbox", "radio", "toggle", "none"]),
  trigger: S.Literals(["button", "dots"]),
  triggerLabel: S.String,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const FocusSettled = m("FocusSettled");
type FocusSettled = typeof FocusSettled.Type;
type Message =
  | Readonly<{ _tag: "Closed" | "Toggled" }>
  | Readonly<{ _tag: "Focused" | "Selected"; id: string }>
  | FocusSettled;

const FocusDropdown = Command.define("FocusDropdown", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.focus(selector).pipe(
      Effect.match({ onFailure: () => FocusSettled(), onSuccess: () => FocusSettled() }),
    ),
  messages: [FocusSettled],
});

const items: readonly DropdownItemSpec[] = [
  { addon: "⌘X", id: "cut", label: "Cut" },
  { addon: "⌘C", id: "copy", label: "Copy" },
  { disabled: true, id: "paste", label: "Paste" },
  { id: "details", label: "View details", submenu: true },
];
const variantItems: readonly DropdownItemSpec[] = [
  { id: "checkmark", label: "Checkmark", selectionIndicator: "checkmark" },
  { id: "checkbox", label: "Checkbox", selectionIndicator: "checkbox" },
  { id: "radio", label: "Radio", selectionIndicator: "radio" },
  { id: "toggle", label: "Toggle", selectionIndicator: "toggle" },
  { id: "none", label: "None", selectionIndicator: "none" },
];

const definition = (initiallyOpen: boolean) => ({
  Args,
  Model,
  init: (args: Args): Model => ({
    focusedId: "cut",
    isOpen: initiallyOpen,
    selectedIds: ["copy"],
    selectionIndicator: args.selectionIndicator,
    trigger: args.trigger,
    triggerLabel: args.triggerLabel,
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "Toggled") {
      return { ...model, isOpen: !model.isOpen };
    }
    if (message._tag === "Closed") {
      return { ...model, isOpen: false };
    }
    if (message._tag === "Focused") {
      return { ...model, focusedId: message.id };
    }
    if (message._tag === "Selected") {
      const selected = model.selectedIds.includes(message.id);
      return {
        ...model,
        isOpen: false,
        selectedIds: selected
          ? model.selectedIds.filter((id) => id !== message.id)
          : [...model.selectedIds, message.id],
      };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof dropdown<Message>>[1]) =>
    dropdown(
      {
        focusedId: model.focusedId,
        id: "interactive-dropdown",
        isOpen: model.isOpen,
        items,
        onClose: { _tag: "Closed" },
        onFocus: (id): Message => ({ _tag: "Focused", id }),
        onSelect: (id): Message => ({ _tag: "Selected", id }),
        onToggle: { _tag: "Toggled" },
        selectedIds: model.selectedIds,
        selectionIndicator: model.selectionIndicator,
        trigger: model.trigger,
        triggerLabel: model.triggerLabel,
      },
      h,
    ),
});

const specimen = (
  model: Model,
  h: Parameters<typeof dropdown<Message>>[1],
  id: string,
  indicator: DropdownSelectionIndicator,
  trigger: "button" | "dots" = "button",
  specimenItems: readonly DropdownItemSpec[] = items,
  selectedIds: readonly string[] = model.selectedIds,
) =>
  h.div(
    [h.Class("min-h-60 min-w-62")],
    [
      dropdown(
        {
          focusedId: "copy",
          id,
          isOpen: true,
          items: specimenItems,
          onClose: { _tag: "Closed" },
          onFocus: (itemId): Message => ({ _tag: "Focused", id: itemId }),
          onSelect: (itemId): Message => ({ _tag: "Selected", id: itemId }),
          onToggle: { _tag: "Toggled" },
          selectedIds,
          selectionIndicator: indicator,
          trigger,
          triggerLabel: trigger === "dots" ? "Open menu" : "Actions",
        },
        h,
      ),
    ],
  );

export default {
  ...componentMeta("dropdown"),
  title: "Untitled UI/Base/Dropdown",
};

export const AllVariants = {
  ...liveStory({
    ...definition(true),
    view: (model, h) =>
      matrix(
        [
          [
            "Indicators",
            [
              specimen(model, h, "dropdown-indicators", "checkmark", "button", variantItems, [
                "checkmark",
                "checkbox",
                "radio",
                "toggle",
              ]),
            ],
          ],
          ["Dots trigger", [specimen(model, h, "dropdown-dots", "checkmark", "dots")]],
        ],
        h,
      ),
  }),
  args: { selectionIndicator: "checkmark", trigger: "button", triggerLabel: "Actions" },
};

export const States = {
  ...liveStory({
    ...definition(true),
    view: (model, h) => matrix([["Open", [specimen(model, h, "dropdown-state", "checkmark")]]], h),
  }),
  args: { selectionIndicator: "checkmark", trigger: "button", triggerLabel: "Actions" },
};

export const Dark = {
  ...liveStory({
    ...definition(true),
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
        [matrix([["Dark", [specimen(model, h, "dropdown-dark", "checkmark")]]], h)],
      ),
  }),
  args: { selectionIndicator: "checkmark", trigger: "button", triggerLabel: "Actions" },
};

export const Interactions = {
  ...liveCommandStory({
    ...definition(false),
    init: (args) => [definition(false).init(args), []],
    update: (model, message) => {
      const next = definition(false).update(model, message);
      return message._tag === "Toggled" && !model.isOpen
        ? [
            next,
            [
              FocusDropdown({
                selector: '[data-dropdown-id="interactive-dropdown"][data-dropdown-item="cut"]',
              }),
            ],
          ]
        : [next, []];
    },
  }),
  args: { selectionIndicator: "checkbox", trigger: "button", triggerLabel: "Actions" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole("button", { name: "Actions" });
    await userEvent.click(trigger);
    const cut = await canvas.findByRole("menuitemcheckbox", { name: "Cut ⌘X" });
    await expect(cut).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
    await expect(trigger).toHaveFocus();
  },
};
