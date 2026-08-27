/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions use the browser promise API directly. */
import * as S from "effect/Schema";
import { dropdownSearchSimple } from "ui/base";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({
  focusedId: S.String,
  isOpen: S.Boolean,
  query: S.String,
  selectedUserIds: S.Array(S.String),
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Closed" | "Toggled" }>
  | Readonly<{ _tag: "Focused" | "UserToggled"; id: string }>
  | Readonly<{ _tag: "QueryChanged"; query: string }>;

const specimen = (model: Model, h: Parameters<typeof dropdownSearchSimple<Message>>[1]) =>
  dropdownSearchSimple(
    {
      focusedId: model.focusedId,
      isOpen: model.isOpen,
      onClose: { _tag: "Closed" },
      onFocus: (id): Message => ({ _tag: "Focused", id }),
      onQueryChange: (query): Message => ({ _tag: "QueryChanged", query }),
      onToggle: { _tag: "Toggled" },
      onUserToggle: (id): Message => ({ _tag: "UserToggled", id }),
      query: model.query,
      selectedUserIds: model.selectedUserIds,
    },
    h,
  );

const definition = (initiallyOpen: boolean) => ({
  Args,
  Model,
  init: (_args: typeof Args.Type): Model => ({
    focusedId: "olivia",
    isOpen: initiallyOpen,
    query: "",
    selectedUserIds: ["olivia", "phoenix"],
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
    if (message._tag === "QueryChanged") {
      return { ...model, query: message.query };
    }
    if (message._tag === "UserToggled") {
      const selected = model.selectedUserIds.includes(message.id);
      return {
        ...model,
        selectedUserIds: selected
          ? model.selectedUserIds.filter((id) => id !== message.id)
          : [...model.selectedUserIds, message.id],
      };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof dropdownSearchSimple<Message>>[1]) =>
    h.div([h.Class("min-h-[36rem]")], [specimen(model, h)]),
});

export default {
  ...componentMeta("dropdown-search-simple"),
  title: "Untitled UI/Base/Dropdown Search Simple",
};

export const AllVariants = {
  ...liveStory({
    ...definition(false),
    view: (model, h) => matrix([["Trigger", [specimen(model, h)]]], h),
  }),
  args: {},
};
export const States = {
  ...liveStory({
    ...definition(true),
    view: (model, h) => matrix([["Open", [specimen(model, h)]]], h),
  }),
  args: {},
};
export const Dark = {
  ...liveStory({
    ...definition(false),
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [specimen(model, h)],
      ),
  }),
  args: {},
};
export const Interactions = {
  ...liveStory(definition(false)),
  args: {},
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Manage access" }));
    const search = await canvas.findByRole("textbox", { name: "Search" });
    await userEvent.type(search, "Lana");
    await userEvent.click(await canvas.findByRole("menuitemcheckbox", { name: "Lana Steiner" }));
    await expect(await canvas.findByRole("textbox", { name: "Search" })).toHaveValue("Lana");
    await userEvent.keyboard("{Escape}");
  },
};
