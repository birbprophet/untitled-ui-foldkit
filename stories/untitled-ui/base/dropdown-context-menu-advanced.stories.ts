/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook's browser interaction API is promise based. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import type { DropdownContextMenuAdvancedSubmenu } from "ui/base";
import { dropdownContextMenuAdvanced } from "ui/base";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory, liveStory, matrix } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({
  focusedId: S.String,
  isOpen: S.Boolean,
  openSubmenu: S.Literals(["developer", "more-tools", "none", "save-as"]),
  selectedId: S.String,
  selectedViewOptions: S.Array(S.Literals(["show-bookmarks", "show-urls"])),
  x: S.Number,
  y: S.Number,
});
type Model = typeof Model.Type;
const FocusSettled = m("FocusSettled");
type FocusSettled = typeof FocusSettled.Type;
type Message =
  | Readonly<{ _tag: "Closed" }>
  | Readonly<{ _tag: "Opened" }>
  | Readonly<{ _tag: "Focused"; id: string }>
  | Readonly<{ _tag: "Selected"; id: string }>
  | Readonly<{ _tag: "ViewOptionToggled"; id: "show-bookmarks" | "show-urls" }>
  | Readonly<{ _tag: "Positioned"; x: number; y: number }>
  | Readonly<{ _tag: "SubmenuChanged"; submenu: DropdownContextMenuAdvancedSubmenu }>
  | FocusSettled;

const FocusContextMenuAdvanced = Command.define("FocusContextMenuAdvanced", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.focus(selector).pipe(
      Effect.match({ onFailure: () => FocusSettled(), onSuccess: () => FocusSettled() }),
    ),
  messages: [FocusSettled],
});

const specimen = (model: Model, h: Parameters<typeof dropdownContextMenuAdvanced<Message>>[1]) =>
  dropdownContextMenuAdvanced(
    {
      focusedId: model.focusedId,
      id: "dropdown-context-menu-advanced",
      isOpen: model.isOpen,
      onClose: { _tag: "Closed" },
      onFocus: (id): Message => ({ _tag: "Focused", id }),
      onOpen: { _tag: "Opened" },
      onPosition: (x, y): Message => ({ _tag: "Positioned", x, y }),
      onSelect: (id): Message => ({ _tag: "Selected", id }),
      onSubmenuChange: (submenu): Message => ({ _tag: "SubmenuChanged", submenu }),
      onViewOptionToggle: (id): Message => ({ _tag: "ViewOptionToggled", id }),
      openSubmenu: model.openSubmenu,
      selectedViewOptions: model.selectedViewOptions,
      x: model.x,
      y: model.y,
    },
    h,
  );

const definition = (isOpen: boolean) => ({
  Args,
  Model,
  init: (_args: typeof Args.Type): Model => ({
    focusedId: "back",
    isOpen,
    openSubmenu: "none",
    selectedId: "",
    selectedViewOptions: ["show-bookmarks"],
    x: 360,
    y: 220,
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "Opened") {
      return { ...model, isOpen: true };
    }
    if (message._tag === "Closed") {
      return { ...model, isOpen: false, openSubmenu: "none" };
    }
    if (message._tag === "Positioned") {
      return { ...model, x: message.x, y: message.y };
    }
    if (message._tag === "Focused") {
      return { ...model, focusedId: message.id };
    }
    if (message._tag === "SubmenuChanged") {
      return { ...model, openSubmenu: message.submenu };
    }
    if (message._tag === "ViewOptionToggled") {
      const option = message.id;
      return {
        ...model,
        selectedViewOptions: model.selectedViewOptions.includes(option)
          ? model.selectedViewOptions.filter((id) => id !== option)
          : [...model.selectedViewOptions, option],
      };
    }
    if (message._tag === "FocusSettled") {
      return model;
    }
    return { ...model, isOpen: false, openSubmenu: "none", selectedId: message.id };
  },
  view: (model: Model, h: Parameters<typeof dropdownContextMenuAdvanced<Message>>[1]) =>
    h.div([h.Class("min-h-screen p-16")], [specimen(model, h)]),
});

const meta = componentMeta("dropdown-context-menu-advanced");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Base/Dropdown Context Menu Advanced",
};

export const AllVariants = {
  ...liveStory({
    ...definition(false),
    view: (model, h) => matrix([["Context menu trigger", [specimen(model, h)]]], h),
  }),
  args: {},
};
export const States = { ...liveStory(definition(true)), args: {} };
export const Dark = {
  ...liveStory({
    ...definition(false),
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [specimen(model, h)],
      ),
  }),
  args: {},
};
export const Interactions = {
  ...liveCommandStory({
    ...definition(false),
    init: (args) => [definition(false).init(args), []],
    update: (model, message) => {
      const next = definition(false).update(model, message);
      return message._tag === "Opened"
        ? [
            next,
            [
              FocusContextMenuAdvanced({
                selector:
                  '[data-context-menu-id="dropdown-context-menu-advanced"][data-context-menu-item="back"]',
              }),
            ],
          ]
        : [next, []];
    },
  }),
  args: {},
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole("button", { name: "Open context menu" });
    await userEvent.pointer({
      coords: { clientX: 180, clientY: 190 },
      keys: "[MouseRight]",
      target: trigger,
    });
    const back = await canvas.findByRole("menuitem", { name: "Back" });
    await waitFor(() => expect(back).toHaveFocus());
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => expect(canvas.getByRole("menuitem", { name: "Forward" })).toHaveFocus());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
    await userEvent.pointer({
      coords: { clientX: 180, clientY: 190 },
      keys: "[MouseRight]",
      target: trigger,
    });
    await userEvent.click(await canvas.findByRole("menuitem", { name: "Back" }));
    await waitFor(() => expect(canvas.queryByRole("menu")).not.toBeInTheDocument());
  },
};
