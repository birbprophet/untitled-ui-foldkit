/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- This story helper owns only the identical controlled state contract of two upstream sibling compositions. */
import * as S from "effect/Schema";
import type { Html, HtmlBuilder } from "foldkit/html";
import type { CommandMenuActionsProps } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { liveStory } from "../story.ts";

const Args = S.Struct({ placeholder: S.String });
const Model = S.Struct({
  ...Args.fields,
  focusedId: S.optional(S.String),
  isOpen: S.Boolean,
  query: S.String,
  selectedId: S.optional(S.String),
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Closed" }>
  | Readonly<{ _tag: "Focused"; id: string }>
  | Readonly<{ _tag: "QueryChanged"; query: string }>
  | Readonly<{ _tag: "Selected"; id: string }>;
type Renderer = (props: CommandMenuActionsProps<Message>, h: HtmlBuilder<Message>) => Html;

interface InteractionFixture {
  readonly filter: string;
  readonly filteredName: RegExp;
  readonly selectionName: RegExp;
}

const actionInteraction: InteractionFixture = {
  filter: "support",
  filteredName: /Support/u,
  selectionName: /My profile/u,
};

const closed: Message = { _tag: "Closed" };
const focused = (id: string): Message => ({ _tag: "Focused", id });
const queryChanged = (query: string): Message => ({ _tag: "QueryChanged", query });
const selected = (id: string): Message => ({ _tag: "Selected", id });

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
  return { ...model, focusedId: message.id, selectedId: message.id };
};

export const commandMenuActionStories = (
  renderer: Renderer,
  id: string,
  interaction: InteractionFixture = actionInteraction,
) => {
  const view = (model: Model, h: HtmlBuilder<Message>) =>
    renderer(
      {
        focusedId: model.focusedId,
        id,
        isOpen: model.isOpen,
        messageForFocus: focused,
        messageForSelect: selected,
        onClose: closed,
        onQueryChange: queryChanged,
        placeholder: model.placeholder,
        query: model.query,
        selectedId: model.selectedId,
      },
      h,
    );
  const definition = {
    Args,
    Model,
    init: (args: typeof Args.Type): Model => ({ ...args, isOpen: true, query: "" }),
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
        await userEvent.type(search, interaction.filter);
        const [filteredOption] = await canvas.findAllByRole("option", {
          name: interaction.filteredName,
        });
        await expect(filteredOption).toBeVisible();
        await userEvent.clear(search);
        const [target] = await canvas.findAllByRole("option", {
          name: interaction.selectionName,
        });
        await userEvent.click(target);
        await waitFor(async () => {
          const [selectedOption] = await canvas.findAllByRole("option", {
            name: interaction.selectionName,
          });
          await expect(selectedOption).toHaveAttribute("aria-selected", "true");
        });
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
          query: "No matching action",
        }),
      }),
      args,
    },
  } as const;
};
