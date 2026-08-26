/* oxlint-disable @rikalabs/no-low-signal-variable-names, effect/noReturnInArrow, effect/noTernary, effect/noSpread, eslint/no-nested-ternary -- The controlled dropdown mirrors the upstream menu's small fixed collection. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export type DropdownButtonLinkPermission = "can-edit" | "can-view" | "owner";

export interface DropdownButtonLinkProps<Message> {
  readonly focusedId: string;
  readonly isOpen: boolean;
  readonly onClose: NoInfer<Message>;
  readonly onDelete: NoInfer<Message>;
  readonly onFocus: (id: string) => NoInfer<Message>;
  readonly onSelect: (permission: DropdownButtonLinkPermission) => NoInfer<Message>;
  readonly onToggle: NoInfer<Message>;
  readonly selectedPermission: DropdownButtonLinkPermission;
}

const permissions: readonly Readonly<{
  id: DropdownButtonLinkPermission;
  label: string;
}>[] = [
  { id: "owner", label: "Owner" },
  { id: "can-edit", label: "Can edit" },
  { id: "can-view", label: "Can view" },
];

const check = <Message>(visible: boolean, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(
        `mr-2 size-4 shrink-0 stroke-[2.25px] text-fg-brand-primary ${visible ? "" : "invisible"}`,
      ),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("M20 6 9 17l-5-5")])],
  );

const chevronDown = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-3 shrink-0 stroke-3 text-fg-quaternary"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("m6 9 6 6 6-6")])],
  );

const trash = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("mr-2 size-4 shrink-0 stroke-[2.25px] text-fg-quaternary"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          "M16 6v-.8c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C14.48 2 13.92 2 12.8 2h-1.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C8 3.52 8 4.08 8 5.2V6m2 5.5v5m4-5v5M3 6h18m-2 0v11.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C16.72 22 15.88 22 14.2 22H9.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C5 19.72 5 18.88 5 17.2V6",
        ),
      ]),
    ],
  );

const focusMove = <Message>(
  props: DropdownButtonLinkProps<Message>,
  current: string,
  key: string,
) => {
  const ids = [...permissions.map((permission) => permission.id), "delete"];
  const index = ids.indexOf(current);
  const delta = key === "ArrowDown" ? 1 : key === "ArrowUp" ? -1 : 0;
  if (index === -1 || delta === 0) {
    return Option.none();
  }
  const id = ids[(index + delta + ids.length) % ids.length];
  return id === undefined
    ? Option.none()
    : Option.some({
        focusSelector: `[data-dropdown-link-item="${id}"]`,
        message: props.onFocus(id),
      });
};

const itemAttributes = <Message>(
  props: DropdownButtonLinkProps<Message>,
  id: string,
  h: HtmlBuilder<Message>,
) =>
  [
    h.Class("group block w-full cursor-pointer px-1.5 py-px text-left outline-none"),
    h.Type("button"),
    h.Tabindex(props.focusedId === id ? 0 : -1),
    h.DataAttribute("dropdown-link-item", id),
    h.OnFocus(props.onFocus(id)),
    h.OnKeyDownFocus((key) => focusMove(props, id, key)),
    h.OnKeyDownPreventDefault((key) =>
      key === "Escape" ? Option.some(props.onClose) : Option.none(),
    ),
  ] as const;

export const dropdownButtonLink = <Message>(
  props: DropdownButtonLinkProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const selectedLabel =
    permissions.find((permission) => permission.id === props.selectedPermission)?.label ??
    "Can edit";
  return h.div(
    [h.Class("relative inline-flex")],
    [
      h.button(
        [
          h.Class(
            `flex cursor-pointer items-center gap-1 rounded text-sm font-semibold text-text-tertiary outline-0 outline-offset-2 outline-focus-ring ${props.isOpen ? "outline-2" : ""}`,
          ),
          h.Type("button"),
          h.AriaHasPopup("menu"),
          h.AriaExpanded(props.isOpen),
          h.OnClick(props.onToggle),
        ],
        [selectedLabel, chevronDown(h)],
      ),
      h.div(
        [
          h.Class(
            `${props.isOpen ? "" : "hidden"} absolute top-full right-0 z-20 mt-2 h-min w-40 origin-top-right overflow-auto rounded-lg bg-bg-primary py-1 shadow-lg ring-1 ring-border-secondary-alt outline-none select-none`,
          ),
          h.Role("menu"),
        ],
        [
          h.div(
            [],
            permissions.map((permission) =>
              h.button(
                [
                  ...itemAttributes(props, permission.id, h),
                  h.Role("menuitemradio"),
                  h.AriaChecked(permission.id === props.selectedPermission),
                  h.OnClick(props.onSelect(permission.id)),
                ],
                [
                  h.span(
                    [
                      h.Class(
                        `relative flex items-center rounded-md px-2.5 py-2 outline-focus-ring transition duration-100 ease-linear group-hover:bg-bg-primary-hover group-focus-visible:bg-bg-primary-hover group-focus-visible:outline-2 group-focus-visible:-outline-offset-2 ${props.focusedId === permission.id && props.isOpen ? "bg-bg-primary-hover outline-2 -outline-offset-2" : ""}`,
                      ),
                    ],
                    [
                      check(permission.id === props.selectedPermission, h),
                      h.span(
                        [h.Class("grow truncate text-sm font-semibold text-text-secondary")],
                        [permission.label],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          h.hr([h.Class("my-1 h-px w-full border-0 bg-border-secondary")]),
          h.div(
            [],
            [
              h.button(
                [
                  ...itemAttributes(props, "delete", h),
                  h.Role("menuitem"),
                  h.OnClick(props.onDelete),
                ],
                [
                  h.span(
                    [
                      h.Class(
                        `relative flex items-center rounded-md px-2.5 py-2 outline-focus-ring transition duration-100 ease-linear group-hover:bg-bg-primary-hover group-focus-visible:bg-bg-primary-hover group-focus-visible:outline-2 group-focus-visible:-outline-offset-2 ${props.focusedId === "delete" && props.isOpen ? "bg-bg-primary-hover" : ""}`,
                      ),
                    ],
                    [
                      trash(h),
                      h.span(
                        [h.Class("grow truncate text-sm font-semibold text-text-secondary")],
                        ["Delete"],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
};
