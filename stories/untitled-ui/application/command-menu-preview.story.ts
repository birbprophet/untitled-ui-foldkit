/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- This helper owns the shared controlled state contract of the authenticated preview-menu siblings. */
import * as S from "effect/Schema";
import type { Html, HtmlBuilder } from "foldkit/html";
import type { CommandMenuUsersMenuProps } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { liveStory } from "../story.ts";

const Args = S.Struct({ placeholder: S.String });
const Model = S.Struct({
  ...Args.fields,
  focusedId: S.optional(S.String),
  isOpen: S.Boolean,
  query: S.String,
  selectedId: S.String,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Closed" }>
  | Readonly<{ _tag: "Focused"; id: string }>
  | Readonly<{ _tag: "Followed" }>
  | Readonly<{ _tag: "QueryChanged"; query: string }>
  | Readonly<{ _tag: "Selected"; id: string }>
  | Readonly<{ _tag: "Viewed" }>;
type Renderer = (props: CommandMenuUsersMenuProps<Message>, h: HtmlBuilder<Message>) => Html;

const closed: Message = { _tag: "Closed" };
const focused = (id: string): Message => ({ _tag: "Focused", id });
const followed: Message = { _tag: "Followed" };
const queryChanged = (query: string): Message => ({ _tag: "QueryChanged", query });
const selected = (id: string): Message => ({ _tag: "Selected", id });
const viewed: Message = { _tag: "Viewed" };

const update = (model: Model, message: Message): Model => {
  if (message._tag === "Closed") {
    return { ...model, isOpen: false };
  }
  if (message._tag === "Focused") {
    return { ...model, focusedId: message.id };
  }
  if (message._tag === "QueryChanged") {
    return { ...model, focusedId: undefined, query: message.query };
  }
  if (message._tag === "Selected") {
    return { ...model, focusedId: message.id, selectedId: message.id };
  }
  return model;
};

export const commandMenuPreviewStories = (renderer: Renderer, id: string) => {
  const view = (model: Model, h: HtmlBuilder<Message>) =>
    renderer(
      {
        focusedId: model.focusedId,
        id,
        isOpen: model.isOpen,
        messageForFocus: focused,
        messageForSelect: selected,
        onClose: closed,
        onFollow: followed,
        onQueryChange: queryChanged,
        onViewPortfolio: viewed,
        placeholder: model.placeholder,
        query: model.query,
        selectedId: model.selectedId,
      },
      h,
    );
  const definition = {
    Args,
    Model,
    init: (args: typeof Args.Type): Model => ({
      ...args,
      isOpen: true,
      query: "",
      selectedId: "user-02",
    }),
    update,
    view,
  } as const;
  const args = { placeholder: "Search" } as const;
  return {
    AllVariants: { ...liveStory(definition), args },
    Dark: {
      ...liveStory({
        ...definition,
        view: (model, h) =>
          h.div(
            [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
            [view(model, h)],
          ),
      }),
      args,
    },
    Interactions: {
      ...liveStory(definition),
      args,
      play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
        const canvas = within(canvasElement.ownerDocument.body);
        const search = await canvas.findByRole("combobox", { name: "Search commands" });
        await userEvent.type(search, "phoenix");
        const option = await canvas.findByRole("option", { name: /Phoenix Baker/u });
        await userEvent.click(option);
        await waitFor(async () => {
          await expect(
            await canvas.findByRole("option", { name: /Phoenix Baker/u }),
          ).toHaveAttribute("aria-selected", "true");
        });
        await userEvent.click(await canvas.findByRole("button", { name: "Follow" }));
        await userEvent.keyboard("{Escape}");
        await waitFor(async () => {
          await expect(
            canvas.queryByRole("dialog", { name: "Command menu" }),
          ).not.toBeInTheDocument();
        });
      },
    },
    States: {
      ...liveStory({
        ...definition,
        init: (storyArgs: typeof Args.Type): Model => ({
          ...storyArgs,
          isOpen: true,
          query: "No matching user",
          selectedId: "user-02",
        }),
      }),
      args,
    },
  } as const;
};
