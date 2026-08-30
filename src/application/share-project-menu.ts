/* oxlint-disable @rikalabs/no-low-signal-variable-names, @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, mps/prefer-option-over-null, unicorn/no-nested-ternary -- The controlled renderer preserves the authenticated share-project slideout anatomy and native menu behavior. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import { button } from "../base/button.ts";
import { buttonUtility } from "../base/button-utility.ts";

export type ShareProjectMenuLocale = "en-US" | "pt-BR";
export type ShareProjectMenuMemberId = "ammar" | "fleur" | "julius" | "mathilde" | "sienna";
export type ShareProjectMenuControl = "link" | ShareProjectMenuMemberId;
export type ShareProjectMenuPermission = "can-edit" | "can-view" | "owner";

export interface ShareProjectMenuMemberPermissions {
  readonly ammar: ShareProjectMenuPermission;
  readonly fleur: ShareProjectMenuPermission;
  readonly julius: ShareProjectMenuPermission;
  readonly mathilde: ShareProjectMenuPermission;
  readonly sienna: ShareProjectMenuPermission;
}

export interface ShareProjectMenuProps<Message> {
  readonly avatars: Partial<Record<ShareProjectMenuMemberId, string>>;
  readonly copied: boolean;
  readonly focusedPermission: ShareProjectMenuPermission;
  readonly id: string;
  readonly isOpen: boolean;
  readonly linkPermission: Exclude<ShareProjectMenuPermission, "owner">;
  readonly locale: ShareProjectMenuLocale;
  readonly memberPermissions: ShareProjectMenuMemberPermissions;
  readonly onCancel: NoInfer<Message>;
  readonly onCopy: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onDone: NoInfer<Message>;
  readonly onEmbed: NoInfer<Message>;
  readonly onFocusPermission: (permission: ShareProjectMenuPermission) => NoInfer<Message>;
  readonly onMenuOpen: (menu: ShareProjectMenuControl | null) => NoInfer<Message>;
  readonly onPermissionSelect: (
    menu: ShareProjectMenuControl,
    permission: ShareProjectMenuPermission,
  ) => NoInfer<Message>;
  readonly onSearch: (query: string) => NoInfer<Message>;
  readonly openMenu: ShareProjectMenuControl | null;
  readonly searchQuery: string;
  readonly shareUrl: string;
}

const copy = {
  "en-US": {
    accessDescription: "Invite others to view and edit this project.",
    accessTitle: "Who has access",
    cancel: "Cancel",
    close: "Close slideout menu",
    copied: "Copied",
    copy: "Copy",
    description: "Invite your team to review and collaborate.",
    dialog: "Slideout menu",
    done: "Done",
    embed: "Get embed code",
    linkAccess: "Anyone with the link",
    permissions: { "can-edit": "Can edit", "can-view": "Can view", owner: "Owner" },
    search: "Search by name or email",
    title: "Share this project",
  },
  "pt-BR": {
    accessDescription: "Convide outras pessoas para visualizar e editar este projeto.",
    accessTitle: "Quem tem acesso",
    cancel: "Cancelar",
    close: "Fechar menu lateral",
    copied: "Copiado",
    copy: "Copiar",
    description: "Convide sua equipe para revisar e colaborar.",
    dialog: "Menu lateral",
    done: "Concluir",
    embed: "Obter código de incorporação",
    linkAccess: "Qualquer pessoa com o link",
    permissions: {
      "can-edit": "Pode editar",
      "can-view": "Pode visualizar",
      owner: "Proprietário",
    },
    search: "Pesquise por nome ou e-mail",
    title: "Compartilhe este projeto",
  },
} as const;

const members = [
  {
    email: "sienna@siglata.com",
    id: "sienna",
    initials: undefined,
    isOnline: true,
    name: "Sienna Hewitt",
  },
  {
    email: "ammar@siglata.com",
    id: "ammar",
    initials: undefined,
    isOnline: false,
    name: "Ammar Foley",
  },
  {
    email: "mathilde@siglata.com",
    id: "mathilde",
    initials: undefined,
    isOnline: false,
    name: "Mathilde Lewis",
  },
  {
    email: "julius@siglata.com",
    id: "julius",
    initials: undefined,
    isOnline: false,
    name: "Julius Vaughan",
  },
  {
    email: "fleur@siglata.com",
    id: "fleur",
    initials: "FC",
    isOnline: false,
    name: "Fleur Cook",
  },
] as const;

const pathIcon = <Message>(path: string, className: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class(className), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D(path),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon("M18 6 6 18M6 6l12 12", "size-5", h);
const usersIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M19 21v-6m-3 3h6m-10-3H8c-1.864 0-2.796 0-3.53.305a4 4 0 0 0-2.166 2.164C2 18.204 2 19.136 2 21M15.5 3.29a4.001 4.001 0 0 1 0 7.42M13.5 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
    "z-1 size-5",
    h,
  );
const linkIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "m12.708 18.364-1.415 1.414a5 5 0 1 1-7.07-7.07l1.413-1.415m12.728 1.414 1.415-1.414a5 5 0 0 0-7.071-7.071l-1.415 1.414M8.5 15.5l7-7",
    "mt-0.5 size-4 shrink-0 text-fg-quaternary",
    h,
  );
const copyIcon = <Message>(copied: boolean, h: HtmlBuilder<Message>): Html =>
  pathIcon(
    copied
      ? "M20 6 9 17l-5-5"
      : "M5 15c-.932 0-1.398 0-1.765-.152a2 2 0 0 1-1.083-1.083C2 13.398 2 12.932 2 12V5.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 2 4.08 2 5.2 2H12c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C15 3.602 15 4.068 15 5m-2.8 17h6.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 20.48 22 19.92 22 18.8v-6.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 9 19.92 9 18.8 9h-6.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C9 10.52 9 11.08 9 12.2v6.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C10.52 22 11.08 22 12.2 22Z",
    "size-5",
    h,
  );
const searchIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "m21 21-3.5-3.5m2.5-6a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z",
    "pointer-events-none size-5 shrink-0 text-fg-quaternary",
    h,
  );
const codeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5"),
      h.DataAttribute("icon", "leading"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("m17 17 5-5-5-5M7 7l-5 5 5 5m7-14-4 18")])],
  );
const chevronIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon("m6 9 6 6 6-6", "size-3 shrink-0 stroke-3 text-fg-quaternary", h);
const linkPermissionIds = ["can-view", "can-edit"] as const;
const memberPermissionIds = ["owner", "can-edit", "can-view"] as const;

const menuFocus = <Message>(
  props: ShareProjectMenuProps<Message>,
  menu: ShareProjectMenuControl,
  available: readonly ShareProjectMenuPermission[],
  current: ShareProjectMenuPermission,
  key: string,
) => {
  if (key === "Escape") {
    return Option.some({
      focusSelector: `[data-share-project-menu-trigger="${menu}"]`,
      message: props.onMenuOpen(null),
    });
  }
  const index = available.indexOf(current);
  const target =
    key === "Home"
      ? available.at(0)
      : key === "End"
        ? available.at(-1)
        : key === "ArrowDown"
          ? available[(index + 1 + available.length) % available.length]
          : key === "ArrowUp"
            ? available[(index - 1 + available.length) % available.length]
            : undefined;
  return target === undefined
    ? Option.none()
    : Option.some({
        focusSelector: `[data-share-project-menu-list="${menu}"][data-permission="${target}"]`,
        message: props.onFocusPermission(target),
      });
};

const permissionMenu = <Message>(
  props: ShareProjectMenuProps<Message>,
  menu: ShareProjectMenuControl,
  selected: ShareProjectMenuPermission,
  h: HtmlBuilder<Message>,
): Html => {
  const labels = copy[props.locale].permissions;
  const available = menu === "link" ? linkPermissionIds : memberPermissionIds;
  const isOpen = props.openMenu === menu;
  return h.div(
    [h.Class("relative inline-flex shrink-0")],
    [
      h.button(
        [
          h.AriaExpanded(isOpen),
          h.AriaHasPopup("menu"),
          h.Class(
            `flex cursor-pointer items-center gap-1 rounded-md text-sm font-semibold outline-offset-2 outline-focus-ring focus-visible:outline-2 ${menu === "link" ? "text-text-primary" : "text-text-tertiary"}`,
          ),
          h.DataAttribute("share-project-menu-trigger", menu),
          h.OnClick(props.onMenuOpen(isOpen ? null : menu)),
          h.Type("button"),
        ],
        [
          menu === "link" ? labels[selected].toLocaleLowerCase(props.locale) : labels[selected],
          chevronIcon(h),
        ],
      ),
      ...(isOpen
        ? [
            h.div(
              [
                h.Class(
                  "absolute top-full right-0 z-30 mt-2 h-min w-24 origin-top-right overflow-auto rounded-lg bg-bg-primary py-1 shadow-lg ring-1 ring-border-secondary-alt outline-none select-none",
                ),
                h.Role("menu"),
              ],
              available.map((permission) =>
                h.button(
                  [
                    h.AriaChecked(permission === selected),
                    h.Autofocus(props.focusedPermission === permission),
                    h.Class(
                      "group block w-full cursor-pointer px-1.5 py-px text-left outline-none",
                    ),
                    h.DataAttribute("permission", permission),
                    h.DataAttribute("share-project-menu-list", menu),
                    h.OnClick(props.onPermissionSelect(menu, permission), {
                      focusSelector: `[data-share-project-menu-trigger="${menu}"]`,
                    }),
                    h.OnFocus(props.onFocusPermission(permission)),
                    h.OnKeyDownFocus((key) => menuFocus(props, menu, available, permission, key)),
                    h.Role("menuitemradio"),
                    h.Tabindex(props.focusedPermission === permission ? 0 : -1),
                    h.Type("button"),
                  ],
                  [
                    h.span(
                      [
                        h.Class(
                          `relative flex items-center rounded-md px-2.5 py-2 outline-focus-ring transition duration-100 ease-linear group-hover:bg-bg-primary-hover group-focus-visible:bg-bg-primary-hover group-focus-visible:outline-2 group-focus-visible:-outline-offset-2 ${props.focusedPermission === permission ? "bg-bg-primary-hover" : ""}`,
                        ),
                      ],
                      [
                        h.span(
                          [h.Class("grow truncate text-sm font-semibold text-text-secondary")],
                          [labels[permission]],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ]
        : []),
    ],
  );
};

const avatarLabel = <Message>(
  member: (typeof members)[number],
  memberAvatar: string | undefined,
  h: HtmlBuilder<Message>,
): Html =>
  h.figure(
    [h.Class("group flex min-w-0 flex-1 items-center gap-2")],
    [
      avatar(
        {
          alt: member.name,
          border: true,
          ...(memberAvatar === undefined ? { initials: member.initials } : { src: memberAvatar }),
          size: "md",
          status: member.isOnline ? "online" : undefined,
        },
        h,
      ),
      h.figcaption(
        [h.Class("min-w-0 flex-1")],
        [
          h.p([h.Class("text-sm font-semibold text-text-primary")], [member.name]),
          h.p([h.Class("truncate text-sm text-text-tertiary")], [member.email]),
        ],
      ),
    ],
  );

export const shareProjectMenu = <Message>(
  props: ShareProjectMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const text = copy[props.locale];
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-end bg-overlay/70 pl-6 outline-hidden md:pl-10",
              ),
              h.DataAttribute("share-project-menu-overlay", props.id),
            ],
            [
              h.button([
                h.AriaHidden(true),
                h.Class("fixed inset-0 cursor-default border-0 bg-transparent p-0"),
                h.DataAttribute("share-project-menu-backdrop", ""),
                h.OnClick(props.onDismiss),
                h.Tabindex(-1),
                h.Type("button"),
              ]),
              h.dialog(
                [
                  h.AriaLabel(text.dialog),
                  h.Attribute("dir", "ltr"),
                  h.Attribute("lang", props.locale),
                  h.Class(
                    "fixed inset-y-0 right-0 left-auto m-0 h-full w-[calc(100%-24px)] max-w-100 overflow-hidden border-0 bg-bg-primary p-0 shadow-xl outline-hidden",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                  h.Style({ left: "auto" }),
                ],
                [
                  h.div(
                    [
                      h.Class(
                        "relative flex size-full flex-col items-start gap-6 overflow-y-auto bg-bg-primary outline-hidden",
                      ),
                    ],
                    [
                      h.header(
                        [h.Class("relative flex w-full items-start gap-3 px-4 pt-6 md:px-6")],
                        [
                          h.div(
                            [
                              h.Class(
                                "relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset max-md:hidden",
                              ),
                            ],
                            [usersIcon(h)],
                          ),
                          h.section(
                            [h.Class("flex flex-col gap-0.5")],
                            [
                              h.h1(
                                [h.Class("text-md font-semibold text-text-primary md:text-lg")],
                                [text.title],
                              ),
                              h.p([h.Class("text-sm text-text-tertiary")], [text.description]),
                            ],
                          ),
                          h.button(
                            [
                              h.AriaLabel(text.close),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("share-project-menu-close", ""),
                              h.OnClick(props.onDismiss),
                              h.Type("button"),
                            ],
                            [closeIcon(h)],
                          ),
                        ],
                      ),
                      h.main(
                        [
                          h.Class(
                            "flex size-full flex-col gap-6 overflow-y-auto overscroll-auto px-4 md:px-6",
                          ),
                        ],
                        [
                          h.div(
                            [
                              h.Class(
                                "relative flex gap-2 rounded-lg bg-bg-secondary p-3 ring-1 ring-border-secondary ring-inset",
                              ),
                            ],
                            [
                              linkIcon(h),
                              h.div(
                                [],
                                [
                                  h.div(
                                    [h.Class("flex items-center gap-1")],
                                    [
                                      h.span(
                                        [h.Class("text-sm font-semibold text-text-primary")],
                                        [text.linkAccess],
                                      ),
                                      permissionMenu(props, "link", props.linkPermission, h),
                                    ],
                                  ),
                                  h.p([h.Class("text-sm text-text-tertiary")], [props.shareUrl]),
                                ],
                              ),
                              h.div(
                                [h.Class("absolute top-2 right-2")],
                                [
                                  buttonUtility(
                                    {
                                      color: "tertiary",
                                      icon: (builder) => copyIcon(props.copied, builder),
                                      onPress: props.onCopy,
                                      size: "xs",
                                      tooltip: props.copied ? text.copied : text.copy,
                                    },
                                    h,
                                  ),
                                ],
                              ),
                            ],
                          ),
                          h.svg(
                            [h.AriaHidden(true), h.Attribute("height", "2"), h.Class("w-full")],
                            [
                              h.line([
                                h.Attribute("x1", "0"),
                                h.Attribute("x2", "100%"),
                                h.Attribute("y1", "1"),
                                h.Attribute("y2", "1"),
                                h.Class("stroke-border-primary"),
                                h.Stroke("currentColor"),
                                h.StrokeDasharray("0,6"),
                                h.StrokeLinecap("round"),
                                h.StrokeLinejoin("round"),
                                h.StrokeWidth("2"),
                              ]),
                            ],
                          ),
                          h.div(
                            [h.Class("flex flex-col gap-4")],
                            [
                              h.div(
                                [],
                                [
                                  h.p(
                                    [h.Class("text-sm font-semibold text-text-primary")],
                                    [text.accessTitle],
                                  ),
                                  h.p(
                                    [h.Class("text-sm text-text-tertiary")],
                                    [text.accessDescription],
                                  ),
                                ],
                              ),
                              h.div(
                                [
                                  h.Class(
                                    "flex w-full items-center gap-1 rounded-lg bg-bg-primary px-3 py-2 text-sm shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
                                  ),
                                ],
                                [
                                  searchIcon(h),
                                  h.input([
                                    h.AriaLabel(text.search),
                                    h.Class(
                                      "min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-placeholder",
                                    ),
                                    h.Id(`${props.id}-search`),
                                    h.Name(`${props.id}-search`),
                                    h.OnInput(props.onSearch),
                                    h.Placeholder(text.search),
                                    h.Type("search"),
                                    h.Value(props.searchQuery),
                                  ]),
                                ],
                              ),
                              h.ul(
                                [h.Class("flex flex-col gap-3")],
                                members.map((member) =>
                                  h.keyed("li")(
                                    member.id,
                                    [h.Class("flex items-start gap-3")],
                                    [
                                      avatarLabel(member, props.avatars[member.id], h),
                                      permissionMenu(
                                        props,
                                        member.id,
                                        props.memberPermissions[member.id],
                                        h,
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      h.footer(
                        [
                          h.Class(
                            "flex w-full items-center gap-3 p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6",
                          ),
                        ],
                        [
                          button(
                            {
                              className: "mr-auto",
                              color: "link-gray",
                              iconLeadingElement: codeIcon(h),
                              label: text.embed,
                              onPress: props.onEmbed,
                              size: "sm",
                            },
                            h,
                          ),
                          button(
                            {
                              color: "secondary",
                              label: text.cancel,
                              onPress: props.onCancel,
                              size: "sm",
                            },
                            h,
                          ),
                          button(
                            {
                              color: "primary",
                              label: text.done,
                              onPress: props.onDone,
                              size: "sm",
                            },
                            h,
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ]
      : [],
  );
};
