/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF and the controlled filter lifecycle remain direct. */
import * as S from "effect/Schema";
import { filterDropdownMenu } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({
  appliedCount: S.Number,
  isDisabled: S.Boolean,
  triggerLabel: S.String,
});
const Model = S.Struct({
  appliedCount: S.Number,
  hasFilter: S.Boolean,
  isDisabled: S.Boolean,
  isOpen: S.Boolean,
  triggerLabel: S.String,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Add" | "Apply" | "Clear" | "Remove" }>
  | Readonly<{ _tag: "Open"; open: boolean }>;
const add: Message = { _tag: "Add" };
const apply: Message = { _tag: "Apply" };
const clear: Message = { _tag: "Clear" };
const remove: Message = { _tag: "Remove" };
const opened = (open: boolean): Message => ({ _tag: "Open", open });

const control = <ControlMessage>(
  label: string,
  h: Parameters<typeof filterDropdownMenu<ControlMessage>>[1],
) =>
  h.div(
    [
      h.Class(
        "flex h-9 min-w-36 items-center rounded-lg bg-bg-primary px-3 text-sm text-text-secondary shadow-xs ring-1 ring-border-primary ring-inset",
      ),
    ],
    [label],
  );

const filters = (h: Parameters<typeof filterDropdownMenu<Message>>[1]) =>
  [
    {
      content: [control("Status", h), control("is", h), control("Active", h)],
      field: "Status",
      id: "status",
      onRemove: remove,
      operator: "is",
      value: "Active",
    },
  ] as const;

const dialog = (hasFilter: boolean, h: Parameters<typeof filterDropdownMenu<Message>>[1]) =>
  filterDropdownMenu(
    {
      filters: hasFilter ? filters(h) : [],
      kind: "dialog",
      onAddFilter: add,
      onApply: apply,
      onClearAll: clear,
    },
    h,
  );

const dropdown = (model: Model, id: string, h: Parameters<typeof filterDropdownMenu<Message>>[1]) =>
  filterDropdownMenu(
    {
      appliedCount: model.appliedCount,
      filters: model.hasFilter ? filters(h) : [],
      id,
      isDisabled: model.isDisabled,
      kind: "dropdown",
      onAddFilter: add,
      onApply: apply,
      onClearAll: clear,
      onOpenChanged: opened,
      triggerLabel: model.triggerLabel,
    },
    h,
  );

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, hasFilter: true, isOpen: false }),
  update: (model: Model, message: Message): Model => ({
    ...model,
    hasFilter:
      message._tag === "Add"
        ? true
        : message._tag === "Clear" || message._tag === "Remove"
          ? false
          : model.hasFilter,
    isOpen: message._tag === "Open" ? message.open : model.isOpen,
  }),
  view: (model: Model, h: Parameters<typeof filterDropdownMenu<Message>>[1]) =>
    dropdown(model, "filter-dropdown-story", h),
} as const;

export default {
  ...componentMeta("filter-dropdown-menu"),
  title: "Untitled UI/Application/Filter Dropdown Menu",
};

export const AllVariants = {
  ...liveStory<typeof Args.Type, Model, Message>({
    ...definition,
    update: (model: Model) => model,
    view: (model, h) =>
      matrix(
        [
          [
            "Default and applied triggers",
            [
              dropdown({ ...model, appliedCount: 0 }, "filter-dropdown-default", h),
              dropdown({ ...model, appliedCount: 3 }, "filter-dropdown-applied", h),
            ],
          ],
          [
            "Count badges",
            [
              filterDropdownMenu({ count: 1, kind: "count-badge" }, h),
              filterDropdownMenu({ count: 12, kind: "count-badge" }, h),
            ],
          ],
          ["Empty dialog", [dialog(false, h)]],
          ["Populated dialog", [dialog(true, h)]],
        ],
        h,
      ),
  }),
  args: { appliedCount: 3, isDisabled: false, triggerLabel: "Filters" },
};

export const States = {
  ...liveStory<typeof Args.Type, Model, Message>({
    ...definition,
    update: (model: Model) => model,
    view: (model, h) =>
      matrix(
        [
          ["Empty", [dialog(false, h)]],
          ["With filters", [dialog(true, h)]],
          ["Disabled", [dropdown({ ...model, isDisabled: true }, "filter-dropdown-disabled", h)]],
        ],
        h,
      ),
  }),
  args: { appliedCount: 0, isDisabled: false, triggerLabel: "Filters" },
};

export const Dark = {
  ...liveStory<typeof Args.Type, Model, Message>({
    ...definition,
    update: (model: Model) => model,
    view: (_model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
        [dialog(true, h)],
      ),
  }),
  args: { appliedCount: 3, isDisabled: false, triggerLabel: "Filters" },
};

export const Interactions = {
  ...liveStory(definition),
  args: { appliedCount: 3, isDisabled: false, triggerLabel: "Filters" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Filters 3" }));
    await expect(await canvas.findByRole("dialog", { name: "Filters" })).toBeVisible();
    await userEvent.click(await canvas.findByRole("button", { name: "Remove filter" }));
    await expect(await canvas.findByText("No filters applied")).toBeVisible();
    await userEvent.click(await canvas.findByRole("button", { name: "Add filter" }));
    await expect(await canvas.findByText("Active")).toBeVisible();
    await userEvent.click(await canvas.findByRole("button", { name: "Apply filter" }));
    await waitFor(() =>
      expect(canvas.queryByRole("dialog", { name: "Filters" })).not.toBeInTheDocument(),
    );
  },
};
