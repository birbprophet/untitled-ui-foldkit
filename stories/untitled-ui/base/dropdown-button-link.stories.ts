/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF and interaction functions use the browser promise API directly. */
import * as S from "effect/Schema";
import { dropdownButtonLink } from "../../../src/base.ts";
import type { DropdownButtonLinkPermission } from "../../../src/base.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({});
const Permission = S.Union([S.Literal("owner"), S.Literal("can-edit"), S.Literal("can-view")]);
const Model = S.Struct({
  focusedId: S.String,
  isOpen: S.Boolean,
  selectedPermission: Permission,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Closed" | "Deleted" | "Toggled" }>
  | Readonly<{ _tag: "Focused"; id: string }>
  | Readonly<{ _tag: "Selected"; permission: DropdownButtonLinkPermission }>;

const specimen = (model: Model, h: Parameters<typeof dropdownButtonLink<Message>>[1]) =>
  dropdownButtonLink(
    {
      focusedId: model.focusedId,
      isOpen: model.isOpen,
      onClose: { _tag: "Closed" },
      onDelete: { _tag: "Deleted" },
      onFocus: (id): Message => ({ _tag: "Focused", id }),
      onSelect: (permission): Message => ({ _tag: "Selected", permission }),
      onToggle: { _tag: "Toggled" },
      selectedPermission: model.selectedPermission,
    },
    h,
  );

const definition = (initiallyOpen: boolean) => ({
  Args,
  Model,
  init: (_args: typeof Args.Type): Model => ({
    focusedId: "owner",
    isOpen: initiallyOpen,
    selectedPermission: "can-edit",
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "Toggled") {
      return { ...model, isOpen: !model.isOpen };
    }
    if (message._tag === "Closed" || message._tag === "Deleted") {
      return { ...model, isOpen: false };
    }
    if (message._tag === "Focused") {
      return { ...model, focusedId: message.id };
    }
    if (message._tag === "Selected") {
      return { ...model, isOpen: false, selectedPermission: message.permission };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof dropdownButtonLink<Message>>[1]) =>
    h.div([h.Class("min-h-80")], [specimen(model, h)]),
});

export default {
  ...componentMeta("dropdown-button-link"),
  title: "Untitled UI/Base/Dropdown Button Link",
};

export const AllVariants = {
  ...liveStory({
    ...definition(false),
    view: (model, h) => matrix([["Default", [specimen(model, h)]]], h),
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
    await userEvent.click(await canvas.findByRole("button", { name: "Can edit" }));
    await userEvent.click(await canvas.findByRole("menuitemradio", { name: "Owner" }));
    await expect(await canvas.findByRole("button", { name: "Owner" })).toBeVisible();
    await userEvent.click(await canvas.findByRole("button", { name: "Owner" }));
    const deleteItem = await canvas.findByRole("menuitem", { name: "Delete" });
    deleteItem.focus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("menu")).not.toBeInTheDocument());
  },
};
