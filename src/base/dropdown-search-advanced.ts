/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, eslint/prefer-destructuring, unicorn/no-unreadable-array-destructuring -- Search is the authenticated input placeholder; the menu is a fixed controlled hierarchy. */
import { blobatarDataUri } from "avatar";
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export interface DropdownSearchAdvancedProps<Message> {
  readonly focusedId: string;
  readonly isOpen: boolean;
  readonly isSiglataOpen: boolean;
  readonly onClose: NoInfer<Message>;
  readonly onCreateTeam: NoInfer<Message>;
  readonly onFocus: (id: string) => NoInfer<Message>;
  readonly onQueryChange: (query: string) => NoInfer<Message>;
  readonly onSiglataToggle: NoInfer<Message>;
  readonly onToggle: NoInfer<Message>;
  readonly onAgentToggle: (id: string) => NoInfer<Message>;
  readonly onTeamToggle: (id: string) => NoInfer<Message>;
  readonly query: string;
  readonly selectedAgentIds: readonly string[];
  readonly selectedTeamIds: readonly string[];
}

const teams = [
  ["siglata", "Siglata", "Olivia Rhye"],
  ["shutterframe", "Shutterframe", "Phoenix Baker"],
  ["warpspeed", "Warpspeed", "Lana Steiner"],
  ["contrastai", "ContrastAI", "Demi Wilkinson"],
  ["launchsimple", "LaunchSimple", "Candice Wu"],
  ["elasticware", "Elasticware", "Natali Craig"],
] as const;

const agents = [
  ["olivia", "Olivia Rhye"],
  ["phoenix", "Phoenix Baker"],
  ["lana", "Lana Steiner"],
  ["demi", "Demi Wilkinson"],
] as const;

const svgIcon = <Message>(path: string, className: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(className),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D(path)])],
  );

const checkBox = <Message>(
  selected: boolean,
  indeterminate: boolean,
  h: HtmlBuilder<Message>,
): Html =>
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
              h.Class("pointer-events-none size-3 stroke-2 text-fg-white"),
              h.Fill("none"),
              h.Stroke("currentColor"),
              h.StrokeLinecap("round"),
              h.StrokeLinejoin("round"),
              h.ViewBox("0 0 14 14"),
            ],
            [h.path([h.D(indeterminate ? "M3.5 7h7" : "M11.6666 3.5 5.24992 9.91667 2.33325 7")])],
          ),
        ]
      : [],
  );

const agentAvatar = <Message>(id: string, label: string, h: HtmlBuilder<Message>): Html =>
  h.img([
    h.Alt(""),
    h.Class(
      "mr-2 size-6 shrink-0 rounded-full object-cover outline-[0.5px] -outline-offset-[0.5px] outline-black/16",
    ),
    h.Src(
      blobatarDataUri(`dropdown-search-advanced-${id}`, {
        background: "circle",
        kind: "agent",
        size: 128,
        title: label,
      }),
    ),
  ]);

const focusTarget = (id: string) => `[data-dropdown-search-advanced-item="${id}"]`;

const moveFocus = <Message>(
  props: DropdownSearchAdvancedProps<Message>,
  visibleIds: readonly string[],
  id: string,
  key: string,
) => {
  const index = visibleIds.indexOf(id);
  const delta = key === "ArrowDown" ? 1 : key === "ArrowUp" ? -1 : 0;
  if (index === -1 || delta === 0) {
    return Option.none();
  }
  const next = visibleIds[(index + delta + visibleIds.length) % visibleIds.length];
  return next === undefined
    ? Option.none()
    : Option.some({ focusSelector: focusTarget(next), message: props.onFocus(next) });
};

const menuItem = <Message>(
  props: DropdownSearchAdvancedProps<Message>,
  visibleIds: readonly string[],
  id: string,
  label: string,
  selected: boolean,
  h: HtmlBuilder<Message>,
  kind: "agent" | "siglata" | "team",
): Html =>
  h.button(
    [
      h.Class("group block w-full cursor-pointer px-1.5 py-px text-left outline-none"),
      h.Type("button"),
      h.Role("menuitemcheckbox"),
      h.AriaChecked(selected),
      ...(kind === "siglata" ? [h.AriaHasPopup("menu"), h.AriaExpanded(props.isSiglataOpen)] : []),
      h.Tabindex(props.focusedId === id ? 0 : -1),
      h.DataAttribute("dropdown-search-advanced-item", id),
      h.OnFocus(props.onFocus(id)),
      h.OnClick(
        kind === "siglata"
          ? props.onSiglataToggle
          : kind === "agent"
            ? props.onAgentToggle(id)
            : props.onTeamToggle(id),
      ),
      h.OnKeyDownFocus((key) => moveFocus(props, visibleIds, id, key)),
      h.OnKeyDownPreventDefault((key) => {
        if (key === "Escape") {
          return Option.some(props.onClose);
        }
        return key === "ArrowRight" && kind === "siglata"
          ? Option.some(props.onSiglataToggle)
          : Option.none();
      }),
    ],
    [
      h.span(
        [
          h.Class(
            `relative flex items-center rounded-md px-2.5 py-2 outline-focus-ring transition duration-100 ease-linear group-hover:bg-bg-primary-hover group-focus-visible:bg-bg-primary-hover group-focus-visible:outline-2 group-focus-visible:-outline-offset-2 ${props.focusedId === id && props.isOpen ? "bg-bg-primary-hover outline-2 -outline-offset-2" : ""} ${kind === "siglata" ? "pr-1.5" : ""}`,
          ),
        ],
        [
          checkBox(selected, kind === "siglata", h),
          ...(kind === "agent" ? [agentAvatar(id, label, h)] : []),
          h.span([h.Class("grow truncate text-sm font-semibold text-text-secondary")], [label]),
          ...(kind === "siglata"
            ? [
                svgIcon(
                  "m9 18 6-6-6-6",
                  "ml-auto size-4 shrink-0 stroke-[2.25px] text-fg-quaternary",
                  h,
                ),
              ]
            : []),
        ],
      ),
    ],
  );

export const dropdownSearchAdvanced = <Message>(
  props: DropdownSearchAdvancedProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const normalizedQuery = props.query.trim().toLocaleLowerCase("en-US");
  const visibleTeams = teams.filter(([, , textValue]) =>
    textValue.toLocaleLowerCase("en-US").includes(normalizedQuery),
  );
  const visibleIds = visibleTeams.map(([id]) => id);
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
        [
          h.span([h.Class("px-0.5")], ["Manage access"]),
          svgIcon("m6 9 6 6 6-6", "size-4 shrink-0 stroke-[2.25px] text-current/70", h),
        ],
      ),
      h.div(
        [
          h.Class(
            `${props.isOpen ? "" : "hidden"} absolute top-full right-0 z-20 mt-2 w-60 origin-top-right overflow-visible rounded-lg bg-bg-primary shadow-lg ring-1 ring-border-secondary-alt`,
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
                  svgIcon(
                    "m21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
                    "pointer-events-none absolute left-3 size-5 stroke-2 text-fg-quaternary",
                    h,
                  ),
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
                      const first = visibleIds[0];
                      return key === "ArrowDown" && first !== undefined
                        ? Option.some({
                            focusSelector: focusTarget(first),
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
            visibleTeams.map(([id, label]) =>
              menuItem(
                props,
                visibleIds,
                id,
                label,
                props.selectedTeamIds.includes(id),
                h,
                id === "siglata" ? "siglata" : "team",
              ),
            ),
          ),
          h.div(
            [
              h.Class(
                `${props.isSiglataOpen ? "" : "hidden"} absolute top-13 left-[calc(100%+0.25rem)] z-30 w-50 overflow-auto rounded-lg bg-bg-primary py-1 shadow-lg ring-1 ring-border-secondary-alt`,
              ),
              h.Role("menu"),
            ],
            agents.map(([id, label]) =>
              menuItem(
                props,
                agents.map(([agentId]) => agentId),
                id,
                label,
                props.selectedAgentIds.includes(id),
                h,
                "agent",
              ),
            ),
          ),
          h.div(
            [h.Class("flex flex-col gap-3 border-t border-border-secondary p-3")],
            [
              h.button(
                [
                  h.Class(
                    "relative inline-flex h-max cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-bg-primary px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Type("button"),
                  h.OnClick(props.onCreateTeam),
                ],
                [
                  svgIcon(
                    "M12 5v14M5 12h14",
                    "size-4 shrink-0 stroke-[2.25px] text-fg-quaternary",
                    h,
                  ),
                  h.span([h.Class("px-0.5")], ["Create team"]),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
};
