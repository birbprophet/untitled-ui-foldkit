/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook's browser interaction API is promise based. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { dropdownContextMenuSimple } from "../../../src/base.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory, liveStory, matrix } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({
  focusedId: S.String,
  isOpen: S.Boolean,
  isSubmenuOpen: S.Boolean,
  selectedId: S.String,
  x: S.Number,
  y: S.Number,
});
type Model = typeof Model.Type;
const FocusSettled = m("FocusSettled");
type FocusSettled = typeof FocusSettled.Type;
type Message =
  | Readonly<{ _tag: "Closed" }>
  | Readonly<{ _tag: "Opened" }>
  | Readonly<{ _tag: "SubmenuChanged" }>
  | Readonly<{ _tag: "Focused"; id: string }>
  | Readonly<{ _tag: "Selected"; id: string }>
  | Readonly<{ _tag: "Positioned"; x: number; y: number }>
  | FocusSettled;

const FocusContextMenuSimple = Command.define("FocusContextMenuSimple", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.focus(selector).pipe(
      Effect.match({ onFailure: () => FocusSettled(), onSuccess: () => FocusSettled() }),
    ),
  messages: [FocusSettled],
});

const specimen = (model: Model, h: Parameters<typeof dropdownContextMenuSimple<Message>>[1]) =>
  dropdownContextMenuSimple(
    {
      focusedId: model.focusedId,
      id: "dropdown-context-menu-simple",
      isOpen: model.isOpen,
      isSubmenuOpen: model.isSubmenuOpen,
      onClose: { _tag: "Closed" },
      onFocus: (id): Message => ({ _tag: "Focused", id }),
      onOpen: { _tag: "Opened" },
      onPosition: (x, y): Message => ({ _tag: "Positioned", x, y }),
      onSelect: (id): Message => ({ _tag: "Selected", id }),
      onSubmenuChange: (): Message => ({ _tag: "SubmenuChanged" }),
      x: model.x,
      y: model.y,
    },
    h,
  );

const definition = (isOpen: boolean) => ({
  Args,
  Model,
  init: (_args: typeof Args.Type): Model => ({
    focusedId: "cut",
    isOpen,
    isSubmenuOpen: false,
    selectedId: "",
    x: 360,
    y: 220,
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "Opened") {
      return { ...model, isOpen: true };
    }
    if (message._tag === "Closed") {
      return { ...model, isOpen: false, isSubmenuOpen: false };
    }
    if (message._tag === "Positioned") {
      return { ...model, x: message.x, y: message.y };
    }
    if (message._tag === "Focused") {
      return { ...model, focusedId: message.id };
    }
    if (message._tag === "SubmenuChanged") {
      return { ...model, isSubmenuOpen: true };
    }
    if (message._tag === "FocusSettled") {
      return model;
    }
    return { ...model, isOpen: false, isSubmenuOpen: false, selectedId: message.id };
  },
  view: (model: Model, h: Parameters<typeof dropdownContextMenuSimple<Message>>[1]) =>
    h.div([h.Class("min-h-screen p-16")], [specimen(model, h)]),
});

const meta = componentMeta("dropdown-context-menu-simple");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Base/Dropdown Context Menu Simple",
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
              FocusContextMenuSimple({
                selector:
                  '[data-context-menu-id="dropdown-context-menu-simple"][data-context-menu-item="cut"]',
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
    const cut = await canvas.findByRole("menuitem", { name: "Cut ⌘X" });
    await waitFor(() => expect(cut).toHaveFocus());
    await userEvent.keyboard("{ArrowDown}{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
    await userEvent.pointer({
      coords: { clientX: 180, clientY: 190 },
      keys: "[MouseRight]",
      target: trigger,
    });
    await userEvent.hover(await canvas.findByRole("menuitem", { name: "View details" }));
    await userEvent.click(await canvas.findByRole("menuitem", { name: "Share" }));
    await waitFor(() => expect(canvas.queryByRole("menu")).not.toBeInTheDocument());
  },
};
