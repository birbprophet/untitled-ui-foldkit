/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, eslint/no-negated-condition, foldkit/keyed-required-for-mapped-rows, mps/avoid-native-object-helpers, mps/casting-awareness, mps/imperative-loops, mps/no-length-comparison, mps/prefer-arr-match, mps/prefer-option-over-null, unicorn/no-nested-ternary, unicorn/no-useless-collection-argument -- The renderer keeps the authenticated recursive tree anatomy and controlled interaction branches explicit. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export type TreeViewSize = "sm" | "md";
export type TreeViewSelectionMode = "none" | "single" | "multiple";
export type TreeViewIcon = "file" | "folder" | "project" | "settings" | "user";

export interface TreeViewNode {
  readonly children?: readonly TreeViewNode[];
  readonly disabled?: boolean;
  readonly icon?: TreeViewIcon;
  readonly id: string;
  readonly label: string;
}

export interface TreeViewProps<Message> {
  readonly draggable?: boolean;
  readonly draggingId?: string;
  readonly dropTargetId?: string;
  readonly expandedIds: readonly string[];
  readonly focusedId?: string;
  readonly label: string;
  readonly nodes: readonly TreeViewNode[];
  readonly onDragEnd?: (id: string) => Message;
  readonly onDragStart?: (id: string) => Message;
  readonly onDrop?: (draggedId: string, targetId: string) => Message;
  readonly onExpandedChange: (id: string, expanded: boolean) => Message;
  readonly onFocusChange: (id: string) => Message;
  readonly onSelectionChange?: (ids: readonly string[], selected: boolean) => Message;
  readonly selectedIds?: readonly string[];
  readonly selectionMode?: TreeViewSelectionMode;
  readonly showConnectors?: boolean;
  readonly size?: TreeViewSize;
}

interface TreeIndex {
  readonly descendants: Readonly<Record<string, readonly string[]>>;
  readonly parent: Readonly<Record<string, string | undefined>>;
  readonly visible: readonly string[];
}

const nodeIds = (node: TreeViewNode): readonly string[] => [
  node.id,
  ...(node.children ?? []).flatMap(nodeIds),
];

const buildIndex = (nodes: readonly TreeViewNode[], expanded: ReadonlySet<string>): TreeIndex => {
  const parent: Record<string, string | undefined> = {};
  const descendants: Record<string, readonly string[]> = {};
  const visible: string[] = [];
  const visit = (node: TreeViewNode, parentId: string | undefined, isVisible: boolean): void => {
    parent[node.id] = parentId;
    descendants[node.id] = (node.children ?? []).flatMap(nodeIds);
    if (isVisible) {
      visible.push(node.id);
    }
    for (const child of node.children ?? []) {
      visit(child, node.id, isVisible && expanded.has(node.id));
    }
  };
  for (const node of nodes) {
    visit(node, undefined, true);
  }
  return { descendants, parent, visible };
};

const chevron = <Message>(expanded: boolean, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-4"), h.Fill("none"), h.ViewBox("0 0 16 16")],
    [
      h.path([
        h.D(expanded ? "m4 6 4 4 4-4" : "m6 4 4 4-4 4"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.5"),
      ]),
    ],
  );

const checkmark = <Message>(indeterminate: boolean, h: HtmlBuilder<Message>): Html =>
  indeterminate
    ? h.span([h.Class("h-0.5 w-2.5 rounded-full bg-current")])
    : h.svg(
        [h.AriaHidden(true), h.Class("size-3.5"), h.Fill("none"), h.ViewBox("0 0 14 14")],
        [
          h.path([
            h.D("m3 7 2.5 2.5L11 4"),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeLinejoin("round"),
            h.StrokeWidth("1.7"),
          ]),
        ],
      );

const itemIcon = <Message>(icon: TreeViewIcon, h: HtmlBuilder<Message>): Html => {
  const path =
    icon === "folder"
      ? "M2.67 4.67h4l1.33 2h5.33v6.66H2.67V4.67Z"
      : icon === "file"
        ? "M4 1.67h5.33L12 4.33v10H4V1.67Zm5.33 0v2.66H12"
        : icon === "user"
          ? "M8 8a2.67 2.67 0 1 0 0-5.33A2.67 2.67 0 0 0 8 8Zm-4.67 6c.45-2.2 2.16-3.33 4.67-3.33s4.22 1.13 4.67 3.33"
          : icon === "settings"
            ? "M8 10.17A2.17 2.17 0 1 0 8 5.83a2.17 2.17 0 0 0 0 4.34Zm5.67-2.17-.94-.54.02-1.09-1.4-.8-.93.56-.95-.55-.02-1.08H6.55l-.02 1.08-.95.55-.93-.56-1.4.8.02 1.09-.94.54.94.54-.02 1.09 1.4.8.93-.56.95.55.02 1.08h2.9l.02-1.08.95-.55.93.56 1.4-.8-.02-1.09.94-.54Z"
            : "M2.67 4.67 8 1.67l5.33 3v6.66L8 14.33l-5.33-3V4.67Zm0 0L8 7.67m5.33-3L8 7.67m0 6.66V7.67";
  return h.svg(
    [h.AriaHidden(true), h.Class("shrink-0"), h.Fill("none"), h.ViewBox("0 0 16 16")],
    [
      h.path([
        h.D(path),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.25"),
      ]),
    ],
  );
};

const dragHandle = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-4"), h.Fill("currentColor"), h.ViewBox("0 0 16 16")],
    [2, 6, 10].flatMap((y) => [
      h.circle([h.Cx("5"), h.Cy(String(y + 2)), h.R("1")]),
      h.circle([h.Cx("11"), h.Cy(String(y + 2)), h.R("1")]),
    ]),
  );

const focusMessage = <Message>(
  props: TreeViewProps<Message>,
  index: TreeIndex,
  id: string,
  key: string,
) => {
  const position = index.visible.indexOf(id);
  const target =
    key === "ArrowDown"
      ? index.visible[position + 1]
      : key === "ArrowUp"
        ? index.visible[position - 1]
        : key === "Home"
          ? index.visible[0]
          : key === "End"
            ? index.visible.at(-1)
            : undefined;
  return target === undefined
    ? Option.none()
    : Option.some({
        focusSelector: `[data-tree-item="${target}"]`,
        message: props.onFocusChange(target),
      });
};

const keyboardMessage = <Message>(
  props: TreeViewProps<Message>,
  index: TreeIndex,
  node: TreeViewNode,
  expanded: boolean,
  key: string,
) => {
  if (key === "ArrowRight" && (node.children?.length ?? 0) > 0 && !expanded) {
    return Option.some(props.onExpandedChange(node.id, true));
  }
  if (key === "ArrowLeft" && (node.children?.length ?? 0) > 0 && expanded) {
    return Option.some(props.onExpandedChange(node.id, false));
  }
  const parentId = index.parent[node.id];
  if (key === "ArrowLeft" && parentId !== undefined) {
    return Option.some(props.onFocusChange(parentId));
  }
  const selected = new Set(props.selectedIds ?? []);
  if ((key === " " || key === "Enter") && props.onSelectionChange !== undefined) {
    return Option.some(
      props.onSelectionChange(
        props.selectionMode === "multiple"
          ? [node.id, ...(index.descendants[node.id] ?? [])]
          : [node.id],
        !selected.has(node.id),
      ),
    );
  }
  return Option.none();
};

const connector = <Message>(
  type: "end" | "line" | "none",
  size: TreeViewSize,
  h: HtmlBuilder<Message>,
): Html =>
  h.span(
    [h.AriaHidden(true), h.Class("relative size-4 shrink-0")],
    type === "none"
      ? []
      : [
          h.span([
            h.Class(
              type === "line"
                ? `absolute top-1/2 left-1/2 w-px -translate-x-1/2 -translate-y-1/2 bg-border-secondary ${size === "sm" ? "h-[42px]" : "h-[44px]"}`
                : `absolute bottom-2 left-1/2 -translate-x-1/2 border-b border-l border-border-secondary ${size === "sm" ? "h-[22px] w-[10px] rounded-bl-[5px]" : "h-[24px] w-3 rounded-bl-md"}`,
            ),
          ]),
        ],
  );

interface RenderContext<Message> {
  readonly index: TreeIndex;
  readonly props: TreeViewProps<Message>;
  readonly selected: ReadonlySet<string>;
  readonly size: TreeViewSize;
}

const renderNodes = <Message>(
  nodes: readonly TreeViewNode[],
  level: number,
  ancestorsLast: readonly boolean[],
  context: RenderContext<Message>,
  h: HtmlBuilder<Message>,
): readonly Html[] =>
  nodes.map((node, nodeIndex) => {
    const { index, props, selected, size } = context;
    const children = node.children ?? [];
    const hasChildren = children.length > 0;
    const expanded = props.expandedIds.includes(node.id);
    const descendants = index.descendants[node.id] ?? [];
    const selectedDescendants = descendants.filter((id) => selected.has(id)).length;
    const isSelected = selected.has(node.id);
    const indeterminate =
      descendants.length > 0 && selectedDescendants > 0 && selectedDescendants < descendants.length;
    const ids = props.selectionMode === "multiple" ? [node.id, ...descendants] : [node.id];
    const selectMessage = props.onSelectionChange?.(ids, !isSelected);
    const dragStartMessage = props.onDragStart?.(node.id);
    const isLast = nodeIndex === nodes.length - 1;
    const connectorNodes =
      props.showConnectors === true
        ? [
            ...ancestorsLast.slice(1).map((last) => connector(last ? "none" : "line", size, h)),
            ...(level > 1 ? [connector(isLast ? "end" : "line", size, h)] : []),
          ]
        : [];
    const paddingLeft = props.showConnectors === true ? 8 : 8 + (level - 1) * 24;
    const row = h.div(
      [
        h.Class(
          `flex w-full cursor-pointer items-center gap-2 rounded-sm pr-2 -outline-offset-2 outline-focus-ring transition duration-100 ease-linear ${size === "sm" ? "py-1.5" : "py-2"} ${props.dropTargetId === node.id ? "bg-bg-secondary-hover outline-2" : isSelected || indeterminate ? "bg-bg-secondary hover:bg-bg-secondary-hover" : "hover:bg-bg-primary-hover"} ${node.disabled === true ? "cursor-not-allowed opacity-50" : ""}`,
        ),
        h.Style({ paddingLeft: `${String(paddingLeft)}px` }),
      ],
      [
        ...connectorNodes,
        ...(hasChildren
          ? [
              h.button(
                [
                  h.AriaExpanded(expanded),
                  h.AriaLabel(`${expanded ? "Collapse" : "Expand"} ${node.label}`),
                  h.Class(
                    "flex shrink-0 items-center justify-center text-fg-quaternary outline-hidden",
                  ),
                  h.Disabled(node.disabled === true),
                  h.OnClick(props.onExpandedChange(node.id, !expanded)),
                  h.Type("button"),
                ],
                [chevron(expanded, h)],
              ),
            ]
          : []),
        ...(props.selectionMode === "none"
          ? []
          : [
              h.label(
                [h.Class("relative flex size-4 shrink-0 items-center justify-center")],
                [
                  h.input([
                    h.AriaLabel(`Select ${node.label}`),
                    h.AriaChecked(indeterminate ? "mixed" : isSelected),
                    h.Checked(isSelected),
                    h.Class("peer absolute inset-0 cursor-pointer opacity-0"),
                    h.Disabled(node.disabled === true),
                    h.Type(props.selectionMode === "multiple" ? "checkbox" : "radio"),
                    ...(selectMessage === undefined || node.disabled === true
                      ? []
                      : [h.OnClick(selectMessage)]),
                  ]),
                  h.span(
                    [
                      h.AriaHidden(true),
                      h.Class(
                        `flex size-4 items-center justify-center ${props.selectionMode === "single" ? "rounded-full" : "rounded-xs"} ring-1 ring-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring ${isSelected || indeterminate ? "bg-bg-brand-solid text-white ring-bg-brand-solid" : "bg-bg-primary text-transparent ring-border-primary"}`,
                      ),
                    ],
                    isSelected || indeterminate ? [checkmark(indeterminate, h)] : [],
                  ),
                ],
              ),
            ]),
        h.span(
          [h.Class(`flex min-w-0 flex-1 items-center ${size === "sm" ? "gap-1.5" : "gap-2"}`)],
          [
            ...(node.icon === undefined
              ? []
              : [
                  h.span(
                    [h.Class(`shrink-0 text-fg-quaternary ${size === "sm" ? "size-4" : "size-5"}`)],
                    [itemIcon(node.icon, h)],
                  ),
                ]),
            h.span(
              [h.Class("min-w-0 flex-1 truncate text-sm font-semibold text-text-tertiary")],
              [node.label],
            ),
            ...(props.draggable === true && isSelected
              ? [
                  h.button(
                    [
                      h.AriaLabel(`Drag ${node.label}`),
                      h.Class("shrink-0 cursor-grab text-fg-quaternary"),
                      ...(dragStartMessage === undefined
                        ? []
                        : [
                            h.OnPointerDown((_pointerType, button) =>
                              button === 0 ? Option.some(dragStartMessage) : Option.none(),
                            ),
                          ]),
                      h.Type("button"),
                    ],
                    [dragHandle(h)],
                  ),
                ]
              : []),
          ],
        ),
      ],
    );
    return h.li(
      [
        ...(hasChildren ? [h.AriaExpanded(expanded)] : []),
        h.AriaLevel(level),
        ...(props.selectionMode === "none" ? [] : [h.AriaSelected(isSelected)]),
        h.Class(`${level === 1 && nodeIndex === 0 ? "mt-0" : "mt-0.5"} outline-hidden`),
        h.DataAttribute("tree-item", node.id),
        h.DataAttribute("drop-target", props.dropTargetId === node.id ? "true" : "false"),
        h.DataAttribute("dragging", props.draggingId === node.id ? "true" : "false"),
        h.Draggable(props.draggable === true && node.disabled !== true),
        h.OnFocus(props.onFocusChange(node.id)),
        h.OnKeyDownFocus((key) => focusMessage(props, index, node.id, key)),
        h.OnKeyDownPreventDefault((key) => keyboardMessage(props, index, node, expanded, key)),
        ...(props.onDragStart === undefined ? [] : [h.OnDragStart(props.onDragStart(node.id))]),
        ...(props.onDragEnd === undefined ? [] : [h.OnDragEnd(props.onDragEnd(node.id))]),
        ...(props.draggingId === undefined || props.onDrop === undefined
          ? []
          : [h.AllowDrop(), h.OnDrop(props.onDrop(props.draggingId, node.id))]),
        h.Role("treeitem"),
        h.Tabindex(
          props.focusedId === node.id ||
            (props.focusedId === undefined && index.visible[0] === node.id)
            ? 0
            : -1,
        ),
      ],
      [
        row,
        ...(hasChildren && expanded
          ? [
              h.ul(
                [h.Role("group")],
                renderNodes(children, level + 1, [...ancestorsLast, isLast], context, h),
              ),
            ]
          : []),
      ],
    );
  });

export const treeView = <Message>(props: TreeViewProps<Message>, h: HtmlBuilder<Message>): Html => {
  const expanded = new Set(props.expandedIds);
  const index = buildIndex(props.nodes, expanded);
  const context: RenderContext<Message> = {
    index,
    props,
    selected: new Set(props.selectedIds ?? []),
    size: props.size ?? "sm",
  };
  return h.ul(
    [
      h.AriaLabel(props.label),
      h.AriaMultiSelectable(props.selectionMode === "multiple"),
      h.Class("flex flex-col"),
      h.Role("tree"),
    ],
    renderNodes(props.nodes, 1, [], context, h),
  );
};
