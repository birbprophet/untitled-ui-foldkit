/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF and interaction functions use the browser promise API directly. */
import * as S from "effect/Schema";
import { dropdownIconSimple } from "../../../src/base.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({ focusedId: S.String, isOpen: S.Boolean, isSubmenuOpen: S.Boolean });
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Closed" | "SubmenuToggled" | "Toggled" }>
  | Readonly<{ _tag: "Focused" | "Selected"; id: string }>;

const specimen = (model: Model, h: Parameters<typeof dropdownIconSimple<Message>>[1]) =>
  dropdownIconSimple(
    {
      focusedId: model.focusedId,
      isOpen: model.isOpen,
      isSubmenuOpen: model.isSubmenuOpen,
      onClose: { _tag: "Closed" },
      onFocus: (id): Message => ({ _tag: "Focused", id }),
      onSelect: (id): Message => ({ _tag: "Selected", id }),
      onSubmenuToggle: { _tag: "SubmenuToggled" },
      onToggle: { _tag: "Toggled" },
    },
    h,
  );

const definition = (initiallyOpen: boolean) => ({
  Args,
  Model,
  init: (_args: typeof Args.Type): Model => ({
    focusedId: "cut",
    isOpen: initiallyOpen,
    isSubmenuOpen: false,
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "Toggled") {
      return { ...model, isOpen: !model.isOpen };
    }
    if (message._tag === "Closed" || message._tag === "Selected") {
      return { ...model, isOpen: false, isSubmenuOpen: false };
    }
    if (message._tag === "SubmenuToggled") {
      return { ...model, isSubmenuOpen: !model.isSubmenuOpen };
    }
    if (message._tag === "Focused") {
      return { ...model, focusedId: message.id };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof dropdownIconSimple<Message>>[1]) =>
    h.div([h.Class("min-h-96")], [specimen(model, h)]),
});

export default {
  ...componentMeta("dropdown-icon-simple"),
  title: "Untitled UI/Base/Dropdown Icon Simple",
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
    await userEvent.click(await canvas.findByRole("button", { name: "Open menu" }));
    await userEvent.click(await canvas.findByRole("menuitem", { name: "View details" }));
    await expect(await canvas.findByRole("menuitem", { name: "Share" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("menu")).not.toBeInTheDocument());
  },
};
