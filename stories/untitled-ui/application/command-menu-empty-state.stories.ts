/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/require-is-prefix-for-boolean-schema-field -- Storybook drives the exact controlled query and dialog state through FoldKit messages. */
import * as S from "effect/Schema";
import { commandMenuEmptyState } from "../../../src/application.ts";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory } from "../story.ts";

const Args = S.Struct({
  placeholder: S.String,
});
const Model = S.Struct({
  ...Args.fields,
  isOpen: S.Boolean,
  query: S.String,
  selectedAction: S.optional(S.Literal("new-project")),
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Cleared" }>
  | Readonly<{ _tag: "Closed" }>
  | Readonly<{ _tag: "NewProject" }>
  | Readonly<{ _tag: "QueryChanged"; query: string }>;

const cleared: Message = { _tag: "Cleared" };
const closed: Message = { _tag: "Closed" };
const newProject: Message = { _tag: "NewProject" };
const queryChanged = (query: string): Message => ({ _tag: "QueryChanged", query });

const update = (model: Model, message: Message): Model => {
  if (message._tag === "Cleared") {
    return { ...model, query: "" };
  }
  if (message._tag === "Closed") {
    return { ...model, isOpen: false };
  }
  if (message._tag === "NewProject") {
    return { ...model, selectedAction: "new-project" };
  }
  return { ...model, query: message.query };
};

const view = (model: Model, h: Parameters<typeof commandMenuEmptyState<Message>>[1]) =>
  commandMenuEmptyState(
    {
      id: "command-menu-empty-state",
      isOpen: model.isOpen,
      onClear: cleared,
      onClose: closed,
      onNewProject: newProject,
      onQueryChange: queryChanged,
      placeholder: model.placeholder,
      query: model.query,
    },
    h,
  );

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    isOpen: true,
    query: "Landing page design",
  }),
  update,
  view,
} as const;

const defaultArgs = { placeholder: "Search" } as const;

export default {
  ...componentMeta("command-menu-empty-state"),
  title: "Untitled UI/Application/Command Menu Empty State",
};

export const AllVariants = {
  ...liveStory(definition),
  args: defaultArgs,
};

export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [view(model, h)],
      ),
  }),
  args: defaultArgs,
};

export const Interactions = {
  ...liveStory(definition),
  args: defaultArgs,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement.ownerDocument.body);
    const search = await canvas.findByRole("combobox", { name: "Search commands" });
    await expect(search).toHaveValue("Landing page design");
    await userEvent.click(await canvas.findByRole("button", { name: "Clear search" }));
    await expect(search).toHaveValue("");
    await userEvent.type(search, "quarterly report");
    await expect(canvas.findByText(/quarterly report/u)).resolves.toBeTruthy();
    await userEvent.keyboard("{Escape}");
    await expect(canvas.queryByRole("dialog", { name: "Command menu" })).not.toBeInTheDocument();
  },
};
