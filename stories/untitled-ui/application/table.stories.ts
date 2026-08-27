/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/require-is-prefix-for-boolean-schema-field -- Story state stays in the FoldKit Model while the fixture exercises the authenticated table anatomy. */
import * as S from "effect/Schema";
import { table } from "../../../src/application.ts";
import type { TableRow, TableSortDirection } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory } from "../story.ts";

const Args = S.Struct({ size: S.Literals(["sm", "md"]) });
const Model = S.Struct({
  ...Args.fields,
  openActionsFor: S.optional(S.String),
  selectedIds: S.Array(S.String),
  sortColumnId: S.String,
  sortDirection: S.Literals(["ascending", "descending"]),
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Action"; action: "edit" | "copy" | "delete"; rowId: string }>
  | Readonly<{ _tag: "MenuToggled"; rowId: string }>
  | Readonly<{ _tag: "RowSelected"; rowId: string; selected: boolean }>
  | Readonly<{ _tag: "SelectAll"; selected: boolean }>
  | Readonly<{ _tag: "Sorted"; columnId: string; direction: TableSortDirection }>;

const rows: readonly TableRow[] = [
  {
    cells: {
      access: { kind: "badge", label: "Admin", tone: "success" },
      lastActive: { kind: "text", primary: "Aug 24, 2026", secondary: "10:24 AM" },
      progress: { kind: "progress", label: "Olivia profile completion", value: 80 },
      user: { kind: "user", name: "Olivia Rhye", supportingText: "olivia@siglata.com" },
    },
    id: "olivia",
  },
  {
    cells: {
      access: { kind: "badge", label: "Member" },
      lastActive: { kind: "text", primary: "Aug 23, 2026", secondary: "4:12 PM" },
      progress: { kind: "progress", label: "Phoenix profile completion", value: 60 },
      user: { kind: "user", name: "Phoenix Baker", supportingText: "phoenix@siglata.com" },
    },
    id: "phoenix",
  },
  {
    cells: {
      access: { kind: "badge", label: "Member" },
      lastActive: { kind: "text", primary: "Aug 22, 2026", secondary: "2:36 PM" },
      progress: { kind: "progress", label: "Lana profile completion", value: 40 },
      user: { kind: "user", name: "Lana Steiner", supportingText: "lana@siglata.com" },
    },
    id: "lana",
  },
  {
    cells: {
      access: { kind: "badge", label: "Invited", tone: "warning" },
      lastActive: { kind: "text", primary: "Not yet active" },
      progress: { kind: "progress", label: "Demi profile completion", value: 20 },
      user: { kind: "user", name: "Demi Wilkinson", supportingText: "demi@siglata.com" },
    },
    id: "demi",
  },
];

const columns = [
  { id: "user", label: "Name", sortable: true, tooltip: "Sort by team member" },
  { id: "access", label: "Access" },
  { id: "lastActive", label: "Last active", sortable: true },
  { id: "progress", label: "Profile completion" },
] as const;

const update = (model: Model, message: Message): Model => {
  if (message._tag === "MenuToggled") {
    return {
      ...model,
      openActionsFor: model.openActionsFor === message.rowId ? undefined : message.rowId,
    };
  }
  if (message._tag === "RowSelected") {
    return {
      ...model,
      selectedIds: message.selected
        ? [...model.selectedIds, message.rowId]
        : model.selectedIds.filter((id) => id !== message.rowId),
    };
  }
  if (message._tag === "SelectAll") {
    return { ...model, selectedIds: message.selected ? rows.map((row) => row.id) : [] };
  }
  if (message._tag === "Sorted") {
    return {
      ...model,
      sortColumnId: message.columnId,
      sortDirection: message.direction,
    };
  }
  return { ...model, openActionsFor: undefined };
};

const view = (model: Model, h: Parameters<typeof table<Message>>[1]) =>
  h.div(
    [h.Class("fixed inset-0 overflow-auto bg-bg-secondary p-4 md:p-8")],
    [
      h.div(
        [h.Class("mx-auto max-w-6xl")],
        [
          table(
            {
              badge: "100 users",
              columns,
              description: "Manage your team members and their account permissions here.",
              onAction: (rowId, action): Message => ({ _tag: "Action", action, rowId }),
              onActionMenuToggle: (rowId): Message => ({ _tag: "MenuToggled", rowId }),
              onSelectAll: (selected): Message => ({ _tag: "SelectAll", selected }),
              onSelectionChange: (rowId, selected): Message => ({
                _tag: "RowSelected",
                rowId,
                selected,
              }),
              onSort: (columnId, direction): Message => ({
                _tag: "Sorted",
                columnId,
                direction,
              }),
              openActionsFor: model.openActionsFor,
              rows,
              selectedIds: model.selectedIds,
              size: model.size,
              sort: { columnId: model.sortColumnId, direction: model.sortDirection },
              title: "Team members",
            },
            h,
          ),
        ],
      ),
    ],
  );

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    selectedIds: [],
    sortColumnId: "user",
    sortDirection: "ascending",
  }),
  update,
  view,
} as const;
const args: typeof Args.Type = { size: "md" };

export default {
  ...componentMeta("table"),
  argTypes: { size: { control: "inline-radio", options: ["sm", "md"] } },
  title: "Untitled UI/Application/Table",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (nextArgs: typeof Args.Type): Model => ({
      ...nextArgs,
      selectedIds: ["olivia", "phoenix"],
      sortColumnId: "user",
      sortDirection: "ascending",
    }),
  }),
  args: { size: "sm" } as const,
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) => h.div([h.DataAttribute("theme", "dark")], [view(model, h)]),
  }),
  args,
};
export const Responsive = { ...liveStory(definition), args };
export const Interactions = {
  ...liveStory(definition),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("checkbox", { name: "Select row phoenix" }));
    await waitFor(async () => {
      await expect(
        await canvas.findByRole("checkbox", { name: "Select row phoenix" }),
      ).toBeChecked();
    });
    await userEvent.click(await canvas.findByRole("button", { name: /Name/u }));
    await waitFor(async () => {
      await expect(await canvas.findByRole("columnheader", { name: /Name/u })).toHaveAttribute(
        "aria-sort",
        "descending",
      );
    });
    const phoenixRow = await canvas.findByRole("row", { name: /Phoenix Baker/u });
    await userEvent.click(within(phoenixRow).getByRole("button", { name: "Row actions" }));
    await expect(await canvas.findByRole("menuitem", { name: "Copy link" })).toBeVisible();
  },
};
