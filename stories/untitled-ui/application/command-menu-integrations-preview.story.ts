/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- This helper owns the controlled state contract shared by the authenticated integration preview menus. */
import * as S from "effect/Schema";
import type { Html, HtmlBuilder } from "foldkit/html";
import type { CommandMenuIntegrationsMenuProps } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { liveStory } from "../story.ts";

const Args = S.Struct({ placeholder: S.String });
const Model = S.Struct({
  ...Args.fields,
  focusedId: S.optional(S.String),
  isConnected: S.Boolean,
  isOpen: S.Boolean,
  query: S.String,
  selectedId: S.String,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Closed" }>
  | Readonly<{ _tag: "Focused"; id: string }>
  | Readonly<{ _tag: "Learned" }>
  | Readonly<{ _tag: "QueryChanged"; query: string }>
  | Readonly<{ _tag: "Selected"; id: string }>
  | Readonly<{ _tag: "Toggled" }>
  | Readonly<{ _tag: "Viewed" }>;
type Renderer = (props: CommandMenuIntegrationsMenuProps<Message>, h: HtmlBuilder<Message>) => Html;

const closed: Message = { _tag: "Closed" };
const focused = (id: string): Message => ({ _tag: "Focused", id });
const learned: Message = { _tag: "Learned" };
const queryChanged = (query: string): Message => ({ _tag: "QueryChanged", query });
const selected = (id: string): Message => ({ _tag: "Selected", id });
const toggled: Message = { _tag: "Toggled" };
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
  if (message._tag === "Toggled") {
    return { ...model, isConnected: !model.isConnected };
  }
  return model;
};

export const commandMenuIntegrationsPreviewStories = (renderer: Renderer, id: string) => {
  const view = (model: Model, h: HtmlBuilder<Message>) =>
    renderer(
      {
        focusedId: model.focusedId,
        id,
        isConnected: model.isConnected,
        isOpen: model.isOpen,
        messageForFocus: focused,
        messageForSelect: selected,
        onClose: closed,
        onLearnMore: learned,
        onQueryChange: queryChanged,
        onToggle: toggled,
        onViewIntegration: viewed,
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
      isConnected: true,
      isOpen: true,
      query: "",
      selectedId: "integration-02",
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
        await userEvent.type(search, "github");
        const option = await canvas.findByRole("option", { name: /GitHub/u });
        await userEvent.click(option);
        await waitFor(async () => {
          await expect(await canvas.findByRole("option", { name: /GitHub/u })).toHaveAttribute(
            "aria-selected",
            "true",
          );
        });
        const connection = await canvas.findByRole("switch", { name: "Connect GitHub" });
        await userEvent.click(connection);
        await waitFor(async () => {
          await expect(
            await canvas.findByRole("switch", { name: "Connect GitHub" }),
          ).not.toBeChecked();
        });
        await userEvent.click(await canvas.findByRole("button", { name: "View integration" }));
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
          isConnected: true,
          isOpen: true,
          query: "No matching integration",
          selectedId: "integration-02",
        }),
      }),
      args,
    },
  } as const;
};
