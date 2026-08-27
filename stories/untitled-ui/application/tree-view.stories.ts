/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/require-is-prefix-for-boolean-schema-field -- Story state owns every interactive tree value while Args remain exact root component props. */
import * as S from "effect/Schema";
import { treeView } from "../../../src/application.ts";
import type { TreeViewNode } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({
  draggable: S.Boolean,
  selectionMode: S.Literals(["none", "single", "multiple"]),
  showConnectors: S.Boolean,
  size: S.Literals(["sm", "md"]),
});
const Model = S.Struct({
  ...Args.fields,
  draggingId: S.optional(S.String),
  dropTargetId: S.optional(S.String),
  expandedIds: S.Array(S.String),
  focusedId: S.String,
  selectedIds: S.Array(S.String),
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "DragEnded"; id: string }>
  | Readonly<{ _tag: "DragStarted"; id: string }>
  | Readonly<{ _tag: "Dropped"; sourceId: string; targetId: string }>
  | Readonly<{ _tag: "Expanded"; expanded: boolean; id: string }>
  | Readonly<{ _tag: "Focused"; id: string }>
  | Readonly<{ _tag: "Selected"; ids: readonly string[]; selected: boolean }>;

const nodes: readonly TreeViewNode[] = [
  {
    children: [
      {
        children: [
          { icon: "user", id: "sienna", label: "Sienna Hewitt" },
          { icon: "user", id: "ammar", label: "Ammar Foley" },
          { icon: "user", id: "caitlyn", label: "Caitlyn King" },
        ],
        icon: "folder",
        id: "design",
        label: "Design",
      },
      { icon: "folder", id: "product", label: "Product" },
      { icon: "folder", id: "marketing", label: "Marketing" },
      { disabled: true, icon: "folder", id: "finance", label: "Finance" },
    ],
    icon: "folder",
    id: "organization",
    label: "Organization",
  },
  {
    children: [
      {
        children: [
          { icon: "file", id: "brief-v1", label: "Brief_v1" },
          { icon: "file", id: "brief-v2", label: "Brief_v2" },
        ],
        icon: "folder",
        id: "client-brief",
        label: "Client brief",
      },
      { icon: "file", id: "assets", label: "assets.zip" },
    ],
    icon: "project",
    id: "powersurge",
    label: "Powersurge",
  },
  { icon: "settings", id: "settings", label: "Settings" },
];
const simpleNodes: readonly TreeViewNode[] = nodes.map((node) => ({
  ...node,
  children: node.children?.map((child) => ({
    ...child,
    children: child.children?.map((grandchild) => ({ ...grandchild, icon: undefined })),
    icon: undefined,
  })),
  icon: undefined,
}));

const update = (model: Model, message: Message): Model => {
  if (message._tag === "Expanded") {
    return {
      ...model,
      expandedIds: message.expanded
        ? [...model.expandedIds, message.id]
        : model.expandedIds.filter((id) => id !== message.id),
    };
  }
  if (message._tag === "Focused") {
    return { ...model, focusedId: message.id };
  }
  if (message._tag === "Selected") {
    const without = model.selectedIds.filter((id) => !message.ids.includes(id));
    return {
      ...model,
      selectedIds: message.selected
        ? model.selectionMode === "single"
          ? [message.ids[0] ?? ""]
          : [...without, ...message.ids]
        : without,
    };
  }
  if (message._tag === "DragStarted") {
    return { ...model, draggingId: message.id, dropTargetId: undefined };
  }
  if (message._tag === "Dropped") {
    return { ...model, draggingId: undefined, dropTargetId: message.targetId };
  }
  return { ...model, draggingId: undefined };
};

const specimen = (
  model: Model,
  h: Parameters<typeof treeView<Message>>[1],
  overrides: Partial<Model> = {},
) => {
  const value = { ...model, ...overrides };
  return h.div(
    [h.Class("w-80 rounded-xl bg-bg-primary p-4 ring-1 ring-border-secondary shadow-xs")],
    [
      treeView(
        {
          draggable: value.draggable,
          draggingId: value.draggingId,
          dropTargetId: value.dropTargetId,
          expandedIds: value.expandedIds,
          focusedId: value.focusedId,
          label: "Organization and projects",
          nodes: value.selectionMode === "none" ? simpleNodes : nodes,
          onDragEnd: (id): Message => ({ _tag: "DragEnded", id }),
          onDragStart: (id): Message => ({ _tag: "DragStarted", id }),
          onDrop: (sourceId, targetId): Message => ({ _tag: "Dropped", sourceId, targetId }),
          onExpandedChange: (id, expanded): Message => ({ _tag: "Expanded", expanded, id }),
          onFocusChange: (id): Message => ({ _tag: "Focused", id }),
          onSelectionChange: (ids, selected): Message => ({ _tag: "Selected", ids, selected }),
          selectedIds: value.selectedIds,
          selectionMode: value.selectionMode,
          showConnectors: value.showConnectors,
          size: value.size,
        },
        h,
      ),
    ],
  );
};

const view = (model: Model, h: Parameters<typeof treeView<Message>>[1]) =>
  h.div(
    [h.Class("fixed inset-0 overflow-auto bg-bg-secondary p-6 md:p-8")],
    [h.div([h.Class("mx-auto w-fit")], [specimen(model, h)])],
  );

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    expandedIds: ["organization", "design", "powersurge", "client-brief"],
    focusedId: "organization",
    selectedIds: args.selectionMode === "multiple" ? ["sienna"] : [],
  }),
  update,
  view,
} as const;

const simpleArgs: typeof Args.Type = {
  draggable: false,
  selectionMode: "none",
  showConnectors: false,
  size: "sm",
};
const advancedArgs: typeof Args.Type = {
  draggable: true,
  selectionMode: "multiple",
  showConnectors: true,
  size: "sm",
};

export default {
  ...componentMeta("tree-view"),
  argTypes: {
    draggable: { control: "boolean" },
    selectionMode: { control: "inline-radio", options: ["none", "single", "multiple"] },
    showConnectors: { control: "boolean" },
    size: { control: "inline-radio", options: ["sm", "md"] },
  },
  title: "Untitled UI/Application/Tree View",
};

export const AllVariants = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      matrix(
        [
          [
            "Simple sm",
            [
              specimen(model, h, {
                draggable: false,
                selectionMode: "none",
                showConnectors: false,
                size: "sm",
              }),
            ],
          ],
          [
            "Simple md",
            [
              specimen(model, h, {
                draggable: false,
                selectionMode: "none",
                showConnectors: false,
                size: "md",
              }),
            ],
          ],
          [
            "Advanced sm",
            [
              specimen(model, h, {
                draggable: true,
                selectionMode: "multiple",
                showConnectors: true,
                size: "sm",
              }),
            ],
          ],
          [
            "Advanced md",
            [
              specimen(model, h, {
                draggable: true,
                selectionMode: "multiple",
                showConnectors: true,
                size: "md",
              }),
            ],
          ],
        ],
        h,
      ),
  }),
  args: simpleArgs,
};
export const States = {
  ...liveStory({
    ...definition,
    view: (model, h) => matrix([["Advanced", [specimen(model, h)]]], h),
  }),
  args: advancedArgs,
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [
          h.Class("fixed inset-0 overflow-auto bg-bg-primary p-16"),
          h.DataAttribute("theme", "dark"),
        ],
        [specimen(model, h)],
      ),
  }),
  args: { ...advancedArgs, size: "md" } as const,
};
export const Interactions = {
  ...liveStory(definition),
  args: advancedArgs,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Collapse Design" }));
    await waitFor(async () => {
      await expect(canvas.queryByText("Sienna Hewitt")).not.toBeInTheDocument();
    });
    await userEvent.click(await canvas.findByRole("button", { name: "Expand Design" }));
    await userEvent.click(await canvas.findByRole("checkbox", { name: "Select Design" }));
    await waitFor(async () => {
      await expect(
        await canvas.findByRole("checkbox", { name: "Select Ammar Foley" }),
      ).toBeChecked();
    });
    const designText = await canvas.findByText("Design");
    const design = designText.closest<HTMLElement>('[role="treeitem"]');
    await expect(design).not.toBeNull();
    design?.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(await canvas.findByText("Sienna Hewitt")).toBeVisible();
    await userEvent.click(await canvas.findByRole("button", { name: "Drag Design" }));
    await waitFor(async () => {
      const nextDesignText = await canvas.findByText("Design");
      await expect(nextDesignText.closest<HTMLElement>('[role="treeitem"]')).toHaveAttribute(
        "data-dragging",
        "true",
      );
    });
    const powersurgeText = await canvas.findByText("Powersurge");
    const powersurge = powersurgeText.closest<HTMLElement>('[role="treeitem"]');
    await expect(powersurge).not.toBeNull();
    powersurge?.dispatchEvent(new DragEvent("dragover", { bubbles: true }));
    powersurge?.dispatchEvent(new DragEvent("drop", { bubbles: true }));
    await waitFor(async () => {
      const nextPowersurgeText = await canvas.findByText("Powersurge");
      await expect(nextPowersurgeText.closest<HTMLElement>('[role="treeitem"]')).toHaveAttribute(
        "data-drop-target",
        "true",
      );
    });
  },
};
