/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF and interaction functions use the browser promise API directly. */
import * as S from "effect/Schema";
import { dropdownIntegration } from "ui/base";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({
  focusedId: S.String,
  isOpen: S.Boolean,
  selectedId: S.String,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Closed" | "Toggled" }>
  | Readonly<{ _tag: "Focused" | "Selected"; id: string }>;

const specimen = (model: Model, h: Parameters<typeof dropdownIntegration<Message>>[1]) =>
  dropdownIntegration(
    {
      focusedId: model.focusedId,
      isOpen: model.isOpen,
      onClose: { _tag: "Closed" },
      onFocus: (id): Message => ({ _tag: "Focused", id }),
      onSelect: (id): Message => ({ _tag: "Selected", id }),
      onToggle: { _tag: "Toggled" },
    },
    h,
  );

const definition = (initiallyOpen: boolean) => ({
  Args,
  Model,
  init: (_args: typeof Args.Type): Model => ({
    focusedId: "view-markdown",
    isOpen: initiallyOpen,
    selectedId: "",
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
      return { ...model, isOpen: false, selectedId: message.id };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof dropdownIntegration<Message>>[1]) =>
    h.div([h.Class("min-h-[40rem]")], [specimen(model, h)]),
});

export default {
  ...componentMeta("dropdown-integration"),
  title: "Untitled UI/Base/Dropdown Integration",
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
    const trigger = await canvas.findByRole("button", { name: "Copy" });
    await userEvent.click(trigger);
    const first = await canvas.findByRole("menuitem", { name: "View as markdown" });
    first.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(await canvas.findByRole("menuitem", { name: "Copy as markdown" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("menu")).not.toBeInTheDocument());
    await userEvent.click(trigger);
    await userEvent.click(await canvas.findByRole("menuitem", { name: "Open in ChatGPT" }));
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
  },
};
