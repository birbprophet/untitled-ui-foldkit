/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary -- Search is the authenticated input placeholder; the menu is a fixed controlled collection. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export interface DropdownSearchSimpleProps<Message> {
  readonly focusedId: string;
  readonly isOpen: boolean;
  readonly onClose: NoInfer<Message>;
  readonly onFocus: (id: string) => NoInfer<Message>;
  readonly onQueryChange: (query: string) => NoInfer<Message>;
  readonly onToggle: NoInfer<Message>;
  readonly onUserToggle: (id: string) => NoInfer<Message>;
  readonly query: string;
  readonly selectedUserIds: readonly string[];
}

const users = [
  ["olivia", "Olivia Rhye"],
  ["phoenix", "Phoenix Baker"],
  ["lana", "Lana Steiner"],
  ["demi", "Demi Wilkinson"],
  ["candice", "Candice Wu"],
  ["natali", "Natali Craig"],
  ["drew", "Drew Cano"],
  ["orlando", "Orlando Diggs"],
  ["andi", "Andi Lane"],
] as const;

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

const searchIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("pointer-events-none absolute left-3 size-5 text-fg-quaternary"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("m21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z")])],
  );

const checkBox = <Message>(selected: boolean, h: HtmlBuilder<Message>): Html =>
  h.span(
    [
      h.Class(
        `relative mr-2 flex size-4 shrink-0 items-center justify-center rounded ring-1 ring-inset ${selected ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"}`,
      ),
    ],
    selected
      ? [
          h.svg(
            [
              h.AriaHidden(true),
              h.Class("pointer-events-none size-3 text-fg-white"),
              h.Fill("none"),
              h.ViewBox("0 0 14 14"),
            ],
            [
              h.path([
                h.D("M11.6666 3.5 5.24992 9.91667 2.33325 7"),
                h.Stroke("currentColor"),
                h.StrokeLinecap("round"),
                h.StrokeLinejoin("round"),
                h.StrokeWidth("2"),
              ]),
            ],
          ),
        ]
      : [],
  );

export const dropdownSearchSimple = <Message>(
  props: DropdownSearchSimpleProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const visibleUsers = users.filter(([, label]) =>
    label.toLocaleLowerCase("en-US").includes(props.query.trim().toLocaleLowerCase("en-US")),
  );
  const moveFocus = (id: string, key: string) => {
    const ids: readonly string[] = visibleUsers.map(([userId]) => userId);
    const index = ids.indexOf(id);
    const delta = key === "ArrowDown" ? 1 : key === "ArrowUp" ? -1 : 0;
    if (index === -1 || delta === 0) {
      return Option.none();
    }
    const next = ids[(index + delta + ids.length) % ids.length];
    return next === undefined
      ? Option.none()
      : Option.some({
          focusSelector: `[data-dropdown-search-item="${next}"]`,
          message: props.onFocus(next),
        });
  };
  return h.div(
    [h.Class("relative inline-flex")],
    [
      h.button(
        [
          h.Class(
            "group relative inline-flex h-max cursor-pointer items-center justify-center gap-1 rounded-lg bg-bg-primary px-3 py-2 text-sm font-semibold whitespace-nowrap text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear before:absolute focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.Type("button"),
          h.AriaHasPopup("menu"),
          h.AriaExpanded(props.isOpen),
          h.OnClick(props.onToggle),
        ],
        [h.span([h.Class("px-0.5")], ["Manage access"]), chevronDown(h)],
      ),
      h.div(
        [
          h.Class(
            `${props.isOpen ? "" : "hidden"} absolute top-full right-0 z-20 mt-2 w-60 origin-top-right overflow-auto rounded-lg bg-bg-primary shadow-lg ring-1 ring-border-secondary-alt`,
          ),
        ],
        [
          h.div(
            [h.Class("flex gap-3 border-b border-border-secondary p-3")],
            [
              h.div(
                [
                  h.Class(
                    `group/input relative flex w-full flex-row place-content-center place-items-center rounded-lg bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset outline-focus-ring transition-shadow duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand ${props.isOpen ? "outline-2 -outline-offset-2" : ""}`,
                  ),
                ],
                [
                  searchIcon(h),
                  h.input([
                    h.Class(
                      "m-0 w-full bg-transparent py-2 pr-3 pl-10 text-md text-text-primary ring-0 outline-none placeholder:text-text-placeholder",
                    ),
                    h.Type("text"),
                    h.Placeholder("Search"),
                    h.AriaLabel("Search"),
                    h.Value(props.query),
                    h.OnInput(props.onQueryChange),
                    h.OnKeyDownFocus((key) => {
                      const first = visibleUsers[0]?.[0];
                      return key === "ArrowDown" && first !== undefined
                        ? Option.some({
                            focusSelector: `[data-dropdown-search-item="${first}"]`,
                            message: props.onFocus(first),
                          })
                        : Option.none();
                    }),
                    h.OnKeyDownPreventDefault((key) =>
                      key === "Escape" ? Option.some(props.onClose) : Option.none(),
                    ),
                  ]),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("h-min overflow-y-auto py-1 outline-none select-none"), h.Role("menu")],
            visibleUsers.map(([id, label]) => {
              const selected = props.selectedUserIds.includes(id);
              return h.button(
                [
                  h.Class("group block w-full cursor-pointer px-1.5 py-px text-left outline-none"),
                  h.Type("button"),
                  h.Role("menuitemcheckbox"),
                  h.AriaChecked(selected),
                  h.Tabindex(props.focusedId === id ? 0 : -1),
                  h.DataAttribute("dropdown-search-item", id),
                  h.OnFocus(props.onFocus(id)),
                  h.OnClick(props.onUserToggle(id)),
                  h.OnKeyDownFocus((key) => moveFocus(id, key)),
                  h.OnKeyDownPreventDefault((key) =>
                    key === "Escape" ? Option.some(props.onClose) : Option.none(),
                  ),
                ],
                [
                  h.span(
                    [
                      h.Class(
                        `relative flex items-center rounded-md px-2.5 py-2 outline-focus-ring transition duration-100 ease-linear group-hover:bg-bg-primary-hover group-focus-visible:bg-bg-primary-hover group-focus-visible:outline-2 group-focus-visible:-outline-offset-2 ${props.focusedId === id && props.isOpen ? "bg-bg-primary-hover outline-2 -outline-offset-2" : ""}`,
                      ),
                    ],
                    [
                      checkBox(selected, h),
                      h.span(
                        [h.Class("grow truncate text-sm font-semibold text-text-secondary")],
                        [label],
                      ),
                    ],
                  ),
                ],
              );
            }),
          ),
        ],
      ),
    ],
  );
};
