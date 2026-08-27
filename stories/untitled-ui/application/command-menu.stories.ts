/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/require-is-prefix-for-boolean-schema-field -- Storybook exposes the upstream showFooter prop and exercises the exact controlled state through FoldKit messages. */
import * as S from "effect/Schema";
import { commandMenu } from "ui/application";
import type { CommandMenuGroup, CommandMenuProps } from "ui/application";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory } from "../story.ts";

const Args = S.Struct({
  placeholder: S.String,
  showFooter: S.Boolean,
});
const Model = S.Struct({
  focusedId: S.optional(S.String),
  isOpen: S.Boolean,
  placeholder: S.String,
  query: S.String,
  selectedId: S.optional(S.String),
  showFooter: S.Boolean,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Closed" }>
  | Readonly<{ _tag: "Focused"; id: string }>
  | Readonly<{ _tag: "QueryChanged"; query: string }>
  | Readonly<{ _tag: "Selected"; id: string }>;

const closed: Message = { _tag: "Closed" };
const focused = (id: string): Message => ({ _tag: "Focused", id });
const queryChanged = (query: string): Message => ({ _tag: "QueryChanged", query });
const selected = (id: string): Message => ({ _tag: "Selected", id });

const groups: readonly CommandMenuGroup[] = [
  {
    id: "suggestions",
    items: [
      {
        description: "Create a deterministic report Robot",
        id: "new-robot",
        label: "New Robot",
        shortcutKeys: ["⌘", "N"],
        stacked: true,
        type: "icon",
      },
      {
        description: "Open the latest run summary",
        id: "recent-run",
        label: "Recent Run",
        type: "dot",
      },
    ],
    title: "Suggestions",
  },
  {
    id: "people",
    items: [
      { id: "marina", label: "Marina Costa", shortcutKeys: ["↵"], type: "avatar" },
      { id: "ravi", isDisabled: true, label: "Ravi Shah", type: "avatar" },
    ],
    title: "People",
  },
  {
    id: "actions",
    items: [{ id: "settings", label: "Settings", shortcutKeys: ["⌘", ","] }],
    title: "Actions",
  },
];

const props = (
  model: Model,
  extra: Partial<CommandMenuProps<Message>> = {},
): CommandMenuProps<Message> => ({
  emptyState: "No commands found.",
  focusedId: model.focusedId,
  groups,
  id: "command-menu",
  isOpen: model.isOpen,
  messageForFocus: focused,
  messageForSelect: selected,
  onClose: closed,
  onQueryChange: queryChanged,
  placeholder: model.placeholder,
  query: model.query,
  selectedId: model.selectedId,
  shortcut: "⌘/",
  showFooter: model.showFooter,
  ...extra,
});

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

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isOpen: true, query: "" }),
  update,
  view: (model: Model, h: Parameters<typeof commandMenu<Message>>[1]) =>
    commandMenu(props(model), h),
} as const;

const defaultArgs = { placeholder: "Search", showFooter: true } as const;

export default {
  ...componentMeta("command-menu"),
  title: "Untitled UI/Application/Command Menu",
};

export const AllVariants = {
  ...liveStory(definition),
  args: defaultArgs,
};

export const States = {
  ...liveStory({
    ...definition,
    init: (args: typeof Args.Type): Model => ({
      ...args,
      isOpen: true,
      query: "No matching command",
    }),
  }),
  args: defaultArgs,
};

export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [commandMenu(props(model), h)],
      ),
  }),
  args: defaultArgs,
};

export const Responsive = {
  ...liveStory(definition),
  args: defaultArgs,
};

export const Interactions = {
  ...liveStory(definition),
  args: defaultArgs,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement.ownerDocument.body);
    const search = await canvas.findByRole("combobox", { name: "Search commands" });
    await userEvent.type(search, "settings");
    await expect(await canvas.findByRole("option", { name: /Settings/u })).toBeVisible();
    await userEvent.clear(search);
    await userEvent.click(await canvas.findByRole("option", { name: /Marina Costa/u }));
    await expect(await canvas.findByRole("option", { name: /Marina Costa/u })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await userEvent.keyboard("{Escape}");
    await expect(canvas.queryByRole("dialog", { name: "Command menu" })).not.toBeInTheDocument();
  },
};
