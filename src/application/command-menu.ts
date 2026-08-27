/* oxlint-disable @rikalabs/no-low-signal-variable-names, @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, mps/no-length-comparison, mps/prefer-arr-match, mps/prefer-option-over-null -- Search placeholders, optional icon selection, and the controlled dialog branches are exact upstream component states. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export type CommandMenuItemType = "default" | "icon" | "avatar" | "dot";
export type CommandMenuItemIcon =
  | "file-plus"
  | "folder"
  | "folder-plus"
  | "help-circle"
  | "layers"
  | "user"
  | "user-plus"
  | "users"
  | "zap-fast";

export interface CommandMenuItem {
  readonly avatarUrl?: string;
  readonly description?: string;
  readonly id: string;
  readonly icon?: CommandMenuItemIcon;
  readonly imageAlt?: string;
  readonly imageSrc?: string;
  readonly isDisabled?: boolean;
  readonly label: string;
  readonly shortcutKeys?: readonly string[];
  readonly stacked?: boolean;
  readonly type?: CommandMenuItemType;
}

export interface CommandMenuGroup {
  readonly id: string;
  readonly items: readonly CommandMenuItem[];
  readonly title?: string;
}

export interface CommandMenuProps<Message> {
  readonly ariaLabel?: string;
  readonly dialogClassName?: string;
  readonly emptyContent?: Html;
  readonly emptyState?: string;
  readonly focusedId?: string;
  readonly groups: readonly CommandMenuGroup[];
  readonly id: string;
  readonly isOpen: boolean;
  readonly messageForFocus: (id: string) => NoInfer<Message>;
  readonly messageForSelect: (id: string) => NoInfer<Message>;
  readonly onClose: NoInfer<Message>;
  readonly onQueryChange: (query: string) => NoInfer<Message>;
  readonly placeholder?: string;
  readonly previewContent?: Html;
  readonly query: string;
  readonly resultsClassName?: string;
  readonly selectedId?: string;
  readonly shortcut?: string | false;
  readonly showFooter?: boolean;
}

const normalized = (value: string): string =>
  value
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036F]/gu, "")
    .toLocaleLowerCase();

export const filterCommandGroups = (
  groups: readonly CommandMenuGroup[],
  query: string,
): readonly CommandMenuGroup[] => {
  const needle = normalized(query.trim());
  if (needle === "") {
    return groups;
  }
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        normalized(`${item.label} ${item.description ?? ""}`).includes(needle),
      ),
    }))
    .filter((group) => group.items.length > 0);
};

const searchIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 text-fg-quaternary"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("m21 21-3.5-3.5m2.5-6a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z")])],
  );

const itemIcon = <Message>(
  icon: CommandMenuItemIcon | undefined,
  h: HtmlBuilder<Message>,
): Html => {
  const paths: Record<CommandMenuItemIcon, string> = {
    "file-plus":
      "M14 2.27V6.4c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437c.214.11.494.11 1.054.11h4.13M12 18v-6m-3 3h6M14 2H8.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C4 4.28 4 5.12 4 6.8v10.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C6.28 22 7.12 22 8.8 22h6.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C20 19.72 20 18.88 20 17.2V8l-6-6Z",
    folder:
      "m13 7-1.116-2.231c-.32-.642-.481-.963-.72-1.198a2 2 0 0 0-.748-.462C10.1 3 9.74 3 9.022 3H5.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C2 4.52 2 5.08 2 6.2V7m0 0h15.2c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C22 9.28 22 10.12 22 11.8v4.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C19.72 21 18.88 21 17.2 21H6.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C2 18.72 2 17.88 2 16.2V7Z",
    "folder-plus":
      "m13 7-1.116-2.231c-.32-.642-.481-.963-.72-1.198a2 2 0 0 0-.748-.462C10.1 3 9.74 3 9.022 3H5.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C2 4.52 2 5.08 2 6.2V7m0 0h15.2c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C22 9.28 22 10.12 22 11.8v4.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C19.72 21 18.88 21 17.2 21H6.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C2 18.72 2 17.88 2 16.2V7Zm10 10v-6m-3 3h6",
    "help-circle":
      "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z",
    layers:
      "m7 12-5 2.5 9.642 4.821c.131.066.197.099.266.111.06.012.123.012.184 0 .069-.012.135-.045.266-.11L22 14.5 17 12M2 9.5l9.642-4.821c.131-.066.197-.098.266-.111a.5.5 0 0 1 .184 0c.069.013.135.045.266.111L22 9.5l-9.642 4.821a1.028 1.028 0 0 1-.266.111.501.501 0 0 1-.184 0c-.069-.012-.135-.045-.266-.11L2 9.5Z",
    user: "M20 21c0-1.396 0-2.093-.172-2.661a4 4 0 0 0-2.667-2.667c-.568-.172-1.265-.172-2.661-.172h-5c-1.396 0-2.093 0-2.661.172a4 4 0 0 0-2.667 2.667C4 18.907 4 19.604 4 21M16.5 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z",
    "user-plus":
      "M12 15.5H7.5c-1.396 0-2.093 0-2.661.172a4 4 0 0 0-2.667 2.667C2 18.907 2 19.604 2 21m17 0v-6m-3 3h6M14.5 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z",
    users:
      "M22 21v-2a4.002 4.002 0 0 0-3-3.874M15.5 3.291a4.001 4.001 0 0 1 0 7.418M17 21c0-1.864 0-2.796-.305-3.53a4 4 0 0 0-2.164-2.165C13.796 15 12.864 15 11 15H8c-1.864 0-2.796 0-3.53.305a4 4 0 0 0-2.166 2.164C2 18.204 2 19.136 2 21M13.5 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
    "zap-fast":
      "M9 17.5H3.5m3-5.5H2m7-5.5H4M17 3l-6.596 9.235c-.292.409-.438.613-.432.784a.5.5 0 0 0 .194.377c.135.104.386.104.889.104H16L15 21l6.596-9.235c.292-.409.438-.613.432-.784a.5.5 0 0 0-.194-.377c-.135-.104-.386-.104-.889-.104H16L17 3Z",
  };
  if (icon === undefined) {
    return searchIcon(h);
  }
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 text-fg-quaternary"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D(paths[icon])])],
  );
};

const shortcutArrow = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-4 text-text-quaternary"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2.2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("M5 12h14m0 0-7-7m7 7-7 7")])],
  );

const shortcut = <Message>(keys: readonly string[], h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.AriaHidden(true), h.Class("flex items-center gap-x-1")],
    keys.flatMap((key, index) =>
      index === 0
        ? [
            h.kbd(
              [
                h.Class(
                  "min-w-6 rounded-sm bg-bg-secondary-alt px-1 py-0.5 text-center text-sm font-medium text-text-tertiary ring-1 ring-border-secondary ring-inset",
                ),
              ],
              [key.toLocaleUpperCase()],
            ),
          ]
        : [
            shortcutArrow(h),
            h.kbd(
              [
                h.Class(
                  "min-w-6 rounded-sm bg-bg-secondary-alt px-1 py-0.5 text-center text-sm font-medium text-text-tertiary ring-1 ring-border-secondary ring-inset",
                ),
              ],
              [key.toLocaleUpperCase()],
            ),
          ],
    ),
  );

const leading = <Message>(item: CommandMenuItem, h: HtmlBuilder<Message>): readonly Html[] => {
  if (item.imageSrc !== undefined) {
    return [
      h.img([
        h.Alt(item.imageAlt ?? ""),
        h.Class(
          `mr-2 shrink-0 object-contain ${item.stacked === true ? "size-10 rounded-none" : "size-6"}`,
        ),
        h.Src(item.imageSrc),
      ]),
    ];
  }
  if (item.type === "icon") {
    return [
      h.span(
        [
          h.Class(
            item.stacked === true
              ? "mr-2 flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-quaternary shadow-xs-skeuomorphic ring-1 ring-border-secondary ring-inset"
              : "mr-2 shrink-0",
          ),
        ],
        [itemIcon(item.icon, h)],
      ),
    ];
  }
  if (item.type === "avatar") {
    return item.avatarUrl === undefined
      ? []
      : [
          h.img([
            h.Alt(""),
            h.Class(
              `mr-2 shrink-0 rounded-full object-cover ${item.stacked === true ? "size-10" : "size-6"}`,
            ),
            h.Src(item.avatarUrl),
          ]),
        ];
  }
  if (item.type === "dot") {
    return [
      h.svg(
        [
          h.AriaHidden(true),
          h.Class(
            `mr-2 size-2.5 shrink-0 text-fg-success-secondary ${item.stacked === true ? "mt-2 self-start" : ""}`,
          ),
          h.ViewBox("0 0 10 10"),
        ],
        [h.circle([h.Cx("5"), h.Cy("5"), h.Fill("currentColor"), h.R("4")])],
      ),
    ];
  }
  return [];
};

const optionSelector = (menuId: string, itemId: string): string =>
  `[data-command-menu="${menuId}"][data-command-item="${itemId}"]`;

const moveFocus = <Message>(
  props: CommandMenuProps<Message>,
  items: readonly CommandMenuItem[],
  index: number,
  key: string,
) => {
  const delta = key === "ArrowDown" ? 1 : key === "ArrowUp" ? -1 : 0;
  if (delta === 0 || items.length === 0) {
    return Option.none();
  }
  const target = Math.max(0, Math.min(items.length - 1, index + delta));
  const next = items[target];
  if (next === undefined) {
    return Option.none();
  }
  return Option.some({
    focusSelector: optionSelector(props.id, next.id),
    message: props.messageForFocus(next.id),
  });
};

const commandItem = <Message>(
  props: CommandMenuProps<Message>,
  item: CommandMenuItem,
  items: readonly CommandMenuItem[],
  index: number,
  h: HtmlBuilder<Message>,
): Html => {
  const selected = item.id === props.selectedId;
  const focused = item.id === props.focusedId || (props.focusedId === undefined && index === 0);
  return h.button(
    [
      h.AriaDisabled(item.isDisabled === true),
      h.AriaSelected(selected),
      h.Autofocus(focused),
      h.Class("group block w-full cursor-pointer px-2 py-0.5 text-left outline-hidden"),
      h.DataAttribute("command-item", item.id),
      h.DataAttribute("command-menu", props.id),
      h.Disabled(item.isDisabled === true),
      h.OnClick(props.messageForSelect(item.id)),
      h.OnKeyDownFocus((key) => moveFocus(props, items, index, key)),
      h.OnKeyDownPreventDefault((key) =>
        key === "Escape" ? Option.some(props.onClose) : Option.none(),
      ),
      h.Role("option"),
      h.Tabindex(focused ? 0 : -1),
      h.Type("button"),
    ],
    [
      h.span(
        [
          h.Class(
            `relative flex min-h-10 justify-between rounded-lg outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover group-focus-visible:outline-2 group-focus-visible:outline-offset-2 ${selected ? "bg-bg-primary-hover" : ""} ${item.stacked === true ? "items-start p-2.5 pl-3.5" : "items-center px-2.5 py-2 pl-2.5"}`,
          ),
        ],
        [
          ...leading(item, h),
          h.span(
            [
              h.Class(
                `flex flex-1 gap-x-1.5 ${item.stacked === true ? "flex-col" : "items-center"}`,
              ),
            ],
            [
              h.span([h.Class("text-sm font-medium text-text-primary")], [item.label]),
              ...(item.description === undefined
                ? []
                : [h.span([h.Class("text-sm text-text-tertiary")], [item.description])]),
            ],
          ),
          ...(item.shortcutKeys === undefined ? [] : [shortcut(item.shortcutKeys, h)]),
        ],
      ),
    ],
  );
};

type FooterIcon = "arrow-down" | "arrow-left" | "arrow-up" | "return";

const footerIcon = <Message>(kind: FooterIcon, h: HtmlBuilder<Message>): Html => {
  const paths = {
    "arrow-down": "M12 5v14m0 0 7-7m-7 7-7-7",
    "arrow-left": "M19 12H5m0 0 7 7m-7-7 7-7",
    "arrow-up": "M12 19V5m0 0-7 7m7-7 7 7",
    return:
      "M20 4v1.4c0 3.36 0 5.04-.654 6.324a6 6 0 0 1-2.622 2.622C15.44 15 13.76 15 10.4 15H4m0 0 5-5m-5 5 5 5",
  } as const;
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-4 text-fg-quaternary"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2.4"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D(paths[kind])])],
  );
};

const settingsIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("pointer-events-none size-5 shrink-0"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([h.D("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z")]),
      h.path([
        h.D(
          "M18.727 14.727a1.5 1.5 0 0 0 .3 1.655l.055.054a1.816 1.816 0 0 1 0 2.573 1.818 1.818 0 0 1-2.573 0l-.055-.055a1.5 1.5 0 0 0-1.654-.3 1.5 1.5 0 0 0-.91 1.373v.155a1.818 1.818 0 1 1-3.636 0V20.1a1.5 1.5 0 0 0-.981-1.373 1.5 1.5 0 0 0-1.655.3l-.054.055a1.818 1.818 0 0 1-3.106-1.287 1.818 1.818 0 0 1 .533-1.286l.054-.055a1.5 1.5 0 0 0 .3-1.654 1.5 1.5 0 0 0-1.372-.91h-.155a1.818 1.818 0 1 1 0-3.636H3.9a1.5 1.5 0 0 0 1.373-.981 1.5 1.5 0 0 0-.3-1.655l-.055-.054A1.818 1.818 0 1 1 7.491 4.99l.054.054a1.5 1.5 0 0 0 1.655.3h.073a1.5 1.5 0 0 0 .909-1.372v-.155a1.818 1.818 0 0 1 3.636 0V3.9a1.499 1.499 0 0 0 .91 1.373 1.5 1.5 0 0 0 1.654-.3l.054-.055a1.817 1.817 0 0 1 2.573 0 1.819 1.819 0 0 1 0 2.573l-.055.054a1.5 1.5 0 0 0-.3 1.655v.073a1.5 1.5 0 0 0 1.373.909h.155a1.818 1.818 0 0 1 0 3.636H20.1a1.499 1.499 0 0 0-1.373.91Z",
        ),
      ]),
    ],
  );

type FooterKeyContent = Readonly<{ icon: FooterIcon }> | Readonly<{ label: string }>;

const footerKey = <Message>(content: FooterKeyContent, h: HtmlBuilder<Message>): Html =>
  h.kbd(
    [
      h.Class(
        "flex h-7 min-w-7 items-center justify-center rounded-lg bg-bg-primary p-1.5 text-sm font-semibold text-fg-quaternary ring-1 ring-border-secondary ring-inset",
      ),
    ],
    ["icon" in content ? footerIcon(content.icon, h) : content.label],
  );

const footer = <Message>(h: HtmlBuilder<Message>): Html =>
  h.footer(
    [
      h.Class(
        "absolute inset-x-0 bottom-0 hidden items-center justify-between gap-x-3 bg-alpha-white/80 p-2 pl-4.5 ring-1 ring-border-secondary-alt backdrop-blur-lg md:flex",
      ),
    ],
    [
      h.div(
        [h.Class("flex gap-4")],
        [
          h.div(
            [h.Class("flex items-center gap-2")],
            [
              h.div(
                [h.Class("flex gap-1.5")],
                [footerKey({ icon: "arrow-up" }, h), footerKey({ icon: "arrow-down" }, h)],
              ),
              h.span([h.Class("text-sm font-semibold text-text-quaternary")], ["to navigate"]),
            ],
          ),
          h.div(
            [h.Class("flex items-center gap-2")],
            [
              footerKey({ icon: "return" }, h),
              h.span([h.Class("text-sm font-semibold text-text-quaternary")], ["to select"]),
            ],
          ),
          h.div(
            [h.Class("flex items-center gap-2")],
            [
              footerKey({ label: "esc" }, h),
              h.span([h.Class("text-sm font-semibold text-text-quaternary")], ["to close"]),
            ],
          ),
          h.div(
            [h.Class("flex items-center gap-2")],
            [
              footerKey({ icon: "arrow-left" }, h),
              h.span([h.Class("text-sm font-semibold text-text-quaternary")], ["return to parent"]),
            ],
          ),
        ],
      ),
      h.button(
        [
          h.AriaLabel("Settings"),
          h.Class(
            "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.Type("button"),
        ],
        [settingsIcon(h)],
      ),
    ],
  );

export const commandMenu = <Message>(
  props: CommandMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  if (!props.isOpen) {
    return h.div([h.DataAttribute("command-menu-closed", props.id)]);
  }
  const groups = filterCommandGroups(props.groups, props.query);
  const items = groups.flatMap((group) => group.items).filter((item) => item.isDisabled !== true);
  const listId = `${props.id}-results`;
  return h.div(
    [
      h.Class(
        "fixed inset-0 z-50 flex min-h-full items-start justify-center overflow-y-auto bg-overlay/70 p-4 text-center backdrop-blur md:pt-16 xl:pt-[calc(clamp(64px,10vh,243px)+9px)]",
      ),
      h.DataAttribute("command-overlay", props.id),
    ],
    [
      h.button([
        h.AriaHidden(true),
        h.Class("fixed inset-0 cursor-default border-0 bg-transparent p-0"),
        h.OnClick(props.onClose),
        h.Tabindex(-1),
        h.Type("button"),
      ]),
      h.dialog(
        [
          h.AriaLabel(props.ariaLabel ?? "Command menu"),
          h.Class(
            `relative m-0 flex max-h-full w-160 flex-col overflow-hidden rounded-xl border-0 bg-bg-primary p-0 text-left align-middle shadow-xl outline-hidden ${props.dialogClassName ?? ""}`,
          ),
          h.Id(props.id),
          h.OnCancel(props.onClose),
          h.OnKeyDownPreventDefault((key) =>
            key === "Escape" ? Option.some(props.onClose) : Option.none(),
          ),
          h.Open(true),
        ],
        [
          h.div(
            [h.Class("relative flex min-h-0 flex-1 flex-col outline-hidden")],
            [
              h.label(
                [
                  h.Class(
                    "relative flex items-center gap-x-2 rounded-xl bg-bg-primary p-4 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-border-secondary",
                  ),
                ],
                [
                  searchIcon(h),
                  h.span([h.Class("sr-only")], ["Search commands"]),
                  h.input([
                    h.AriaAutocomplete("list"),
                    h.AriaControls(listId),
                    h.Autofocus(true),
                    h.Class(
                      "m-0 w-full bg-transparent text-md text-text-primary ring-0 outline-hidden placeholder:text-text-placeholder",
                    ),
                    h.OnInput(props.onQueryChange),
                    h.OnKeyDownFocus((key) =>
                      key === "ArrowDown" && items[0] !== undefined
                        ? Option.some({
                            focusSelector: optionSelector(props.id, items[0].id),
                            message: props.messageForFocus(items[0].id),
                          })
                        : Option.none(),
                    ),
                    h.OnKeyDownPreventDefault((key) =>
                      key === "Escape" ? Option.some(props.onClose) : Option.none(),
                    ),
                    h.Placeholder(props.placeholder ?? "Search"),
                    h.Role("combobox"),
                    h.Type("text"),
                    h.Value(props.query),
                  ]),
                  ...(props.shortcut === false ? [] : [shortcut([props.shortcut ?? "⌘/"], h)]),
                ],
              ),
              h.div(
                [
                  h.AriaLabel("Command menu results"),
                  h.Class(
                    `flex max-h-106 flex-1 scroll-py-10 flex-col gap-2 overflow-auto focus:outline-hidden ${props.showFooter === false ? "" : "scroll-pb-22 pb-13"} ${groups.length === 0 ? "" : "pt-2"} ${props.resultsClassName ?? ""}`,
                  ),
                  h.Id(listId),
                  h.Role("listbox"),
                ],
                groups.length === 0
                  ? props.emptyContent === undefined
                    ? [
                        h.div(
                          [h.Class("px-6 py-12 text-center text-sm text-text-tertiary")],
                          [props.emptyState ?? "No commands found."],
                        ),
                      ]
                    : [props.emptyContent]
                  : groups.map((group) =>
                      h.section(
                        [h.Class("border-b border-border-secondary pb-2 last:border-transparent")],
                        [
                          ...(group.title === undefined
                            ? []
                            : [
                                h.header(
                                  [
                                    h.Class(
                                      "flex px-4.5 pt-2 pb-1 text-xs font-semibold text-text-tertiary",
                                    ),
                                  ],
                                  [group.title],
                                ),
                              ]),
                          ...group.items.map((item) =>
                            commandItem(props, item, items, items.indexOf(item), h),
                          ),
                        ],
                      ),
                    ),
              ),
              ...(props.previewContent === undefined ? [] : [props.previewContent]),
              ...(props.showFooter === false ? [] : [footer(h)]),
            ],
          ),
        ],
      ),
    ],
  );
};
