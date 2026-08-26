/* oxlint-disable @rikalabs/no-low-signal-variable-names, @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, mps/imperative-loops, mps/no-length-comparison, mps/prefer-arr-match -- The fixed upstream command menu uses controlled FoldKit messages and DOM-order roving focus. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export interface DropdownButtonSimpleProps<Message> {
  readonly focusedId: string;
  readonly isOpen: boolean;
  readonly isSubmenuOpen: boolean;
  readonly onClose: NoInfer<Message>;
  readonly onFocus: (id: string) => NoInfer<Message>;
  readonly onSelect: (id: string) => NoInfer<Message>;
  readonly onSubmenuToggle: NoInfer<Message>;
  readonly onToggle: NoInfer<Message>;
}

export type DropdownIconSimpleProps<Message> = DropdownButtonSimpleProps<Message>;

interface MenuItem {
  readonly addon?: string;
  readonly id: string;
  readonly label: string;
  readonly submenu?: boolean;
}

const sections: readonly (readonly MenuItem[])[] = [
  [
    { addon: "⌘X", id: "cut", label: "Cut" },
    { addon: "⌘C", id: "copy", label: "Copy" },
    { addon: "⌘V", id: "paste", label: "Paste" },
  ],
  [
    { id: "edit", label: "Edit" },
    { id: "duplicate", label: "Duplicate" },
    { id: "delete", label: "Delete" },
  ],
  [{ id: "view-details", label: "View details", submenu: true }],
];

const submenuItems: readonly MenuItem[] = [
  { id: "share", label: "Share" },
  { id: "save-as", label: "Save as" },
  { id: "archive", label: "Archive" },
];

const allItems = [...sections.flat(), ...submenuItems];

const selectorFor = (id: string): string => `[data-dropdown-item="${id}"]`;

const moveFocus = <Message>(
  props: DropdownButtonSimpleProps<Message>,
  current: string,
  key: string,
) => {
  const visible = props.isSubmenuOpen ? allItems : sections.flat();
  const index = visible.findIndex((item) => item.id === current);
  const delta = key === "ArrowDown" ? 1 : key === "ArrowUp" ? -1 : 0;
  if (delta === 0 || index === -1) {
    return Option.none();
  }
  const item = visible[(index + delta + visible.length) % visible.length];
  return item === undefined
    ? Option.none()
    : Option.some({ focusSelector: selectorFor(item.id), message: props.onFocus(item.id) });
};

const chevronDown = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-4 shrink-0 stroke-[2.25px] text-current/70"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("m6 9 6 6 6-6")])],
  );

const chevronRight = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("ml-auto size-4 shrink-0 stroke-[2.25px] text-fg-quaternary"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("m9 18 6-6-6-6")])],
  );

const dotsVertical = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 transition-inherit-all"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM12 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
        ),
      ]),
    ],
  );

const item = <Message>(
  value: MenuItem,
  props: DropdownButtonSimpleProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.Class("group block w-full cursor-pointer px-1.5 py-px text-left outline-none"),
      h.Type("button"),
      h.Role("menuitem"),
      h.Tabindex(value.id === props.focusedId ? 0 : -1),
      h.DataAttribute("dropdown-item", value.id),
      h.OnClick(value.submenu === true ? props.onSubmenuToggle : props.onSelect(value.id)),
      h.OnFocus(props.onFocus(value.id)),
      h.OnKeyDownFocus((key) => moveFocus(props, value.id, key)),
      h.OnKeyDownPreventDefault((key) => {
        if (key === "Escape") {
          return Option.some(props.onClose);
        }
        if (value.submenu === true && key === "ArrowRight") {
          return Option.some(props.onSubmenuToggle);
        }
        return Option.none();
      }),
    ],
    [
      h.span(
        [
          h.Class(
            `relative flex items-center rounded-md px-2.5 py-2 outline-focus-ring transition duration-100 ease-linear group-hover:bg-bg-primary-hover group-focus-visible:bg-bg-primary-hover group-focus-visible:outline-2 group-focus-visible:-outline-offset-2 ${value.id === props.focusedId && props.isOpen ? "bg-bg-primary-hover outline-2 -outline-offset-2" : ""} ${value.submenu === true ? "pr-1.5" : ""}`,
          ),
        ],
        [
          h.span(
            [h.Class("grow truncate text-sm font-semibold text-text-secondary")],
            [value.label],
          ),
          ...(value.addon === undefined
            ? []
            : [
                h.span(
                  [h.Class("ml-1 shrink-0 pr-1 text-xs font-medium text-text-quaternary")],
                  [value.addon],
                ),
              ]),
          ...(value.submenu === true ? [chevronRight(h)] : []),
        ],
      ),
    ],
  );

const menu = <Message>(
  values: readonly MenuItem[],
  props: DropdownButtonSimpleProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("h-min overflow-y-auto py-1 outline-none select-none"), h.Role("menu")],
    values.map((value) => item(value, props, h)),
  );

const renderDropdownSimple = <Message>(
  props: DropdownButtonSimpleProps<Message>,
  trigger: "button" | "icon",
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("relative inline-flex")],
    [
      ...(trigger === "button"
        ? [
            h.button(
              [
                h.Class(
                  "group relative inline-flex h-max cursor-pointer items-center justify-center gap-1 rounded-lg bg-bg-primary px-3 py-2 text-sm font-semibold whitespace-nowrap text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                ),
                h.Type("button"),
                h.AriaHasPopup("menu"),
                h.AriaExpanded(props.isOpen),
                h.OnClick(props.onToggle),
              ],
              [h.span([h.Class("px-0.5")], ["Account"]), chevronDown(h)],
            ),
          ]
        : [
            h.button(
              [
                h.Class(
                  `cursor-pointer rounded-md text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2 ${props.isOpen ? "outline-2 outline-offset-2" : ""}`,
                ),
                h.Type("button"),
                h.AriaLabel("Open menu"),
                h.AriaHasPopup("menu"),
                h.AriaExpanded(props.isOpen),
                h.OnClick(props.onToggle),
              ],
              [dotsVertical(h)],
            ),
          ]),
      h.div(
        [
          h.Class(
            `${props.isOpen ? "" : "hidden"} absolute top-full z-20 mt-2 w-54 origin-top-right overflow-auto rounded-lg bg-bg-primary shadow-lg ring-1 ring-border-secondary-alt ${trigger === "icon" ? "left-[-10.75rem]" : "right-0"}`,
          ),
        ],
        [
          h.div(
            [h.Class("h-min overflow-y-auto py-1 outline-none select-none"), h.Role("menu")],
            sections.flatMap((section, index) => [
              ...section.map((value) => item(value, props, h)),
              ...(index === sections.length - 1
                ? []
                : [h.hr([h.Class("my-1 h-px w-full border-0 bg-border-secondary")])]),
            ]),
          ),
        ],
      ),
      h.div(
        [
          h.Class(
            `${props.isOpen && props.isSubmenuOpen ? "" : "hidden"} absolute top-[calc(100%+9.5rem)] left-[calc(100%+0.25rem)] z-30 w-50 overflow-auto rounded-lg bg-bg-primary shadow-lg ring-1 ring-border-secondary-alt`,
          ),
        ],
        [menu(submenuItems, props, h)],
      ),
    ],
  );

export const dropdownButtonSimple = <Message>(
  props: DropdownButtonSimpleProps<Message>,
  h: HtmlBuilder<Message>,
): Html => renderDropdownSimple(props, "button", h);

export const dropdownIconSimple = <Message>(
  props: DropdownIconSimpleProps<Message>,
  h: HtmlBuilder<Message>,
): Html => renderDropdownSimple(props, "icon", h);
