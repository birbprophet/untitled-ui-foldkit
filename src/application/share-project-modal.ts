/* oxlint-disable @rikalabs/no-low-signal-variable-names, @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, mps/prefer-option-over-null, unicorn/no-nested-ternary -- The controlled renderer preserves the authenticated share-project modal anatomy and its native menu behavior. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import { button } from "../base/button.ts";
import { buttonUtility } from "../base/button-utility.ts";

export type ShareProjectLocale = "en-US" | "pt-BR";
export type ShareProjectMemberId = "ammar" | "mathilde" | "sienna";
export type ShareProjectMenu = "link" | ShareProjectMemberId;
export type ShareProjectPermission = "can-edit" | "can-view" | "owner";

/** A share-project row: identity and presence supplied by the host application. */
export interface ShareProjectMember {
  readonly avatarUrl: string;
  readonly email: string;
  readonly id: ShareProjectMemberId;
  readonly isOnline: boolean;
  readonly name: string;
}

export interface ShareProjectMemberPermissions {
  readonly ammar: ShareProjectPermission;
  readonly mathilde: ShareProjectPermission;
  readonly sienna: ShareProjectPermission;
}

export interface ShareProjectModalProps<Message> {
  readonly copied: boolean;
  readonly focusedPermission: ShareProjectPermission;
  readonly id: string;
  readonly isOpen: boolean;
  readonly linkPermission: Exclude<ShareProjectPermission, "owner">;
  readonly locale: ShareProjectLocale;
  readonly memberPermissions: ShareProjectMemberPermissions;
  readonly members: readonly ShareProjectMember[];
  readonly onCancel: NoInfer<Message>;
  readonly onCopy: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onDone: NoInfer<Message>;
  readonly onEmbed: NoInfer<Message>;
  readonly onFocusPermission: (permission: ShareProjectPermission) => NoInfer<Message>;
  readonly onMenuOpen: (menu: ShareProjectMenu | null) => NoInfer<Message>;
  readonly onPermissionSelect: (
    menu: ShareProjectMenu,
    permission: ShareProjectPermission,
  ) => NoInfer<Message>;
  readonly onSearch: (query: string) => NoInfer<Message>;
  readonly openMenu: ShareProjectMenu | null;
  readonly searchQuery: string;
  readonly shareUrl: string;
}

const copy = {
  "en-US": {
    accessDescription: "Invite others to view and edit this project.",
    accessTitle: "Who has access",
    cancel: "Cancel",
    close: "Close dialog",
    copied: "Copied",
    copy: "Copy",
    description: "Invite your team to review and collaborate.",
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
    close: "Fechar caixa de diálogo",
    copied: "Copiado",
    copy: "Copiar",
    description: "Convide sua equipe para revisar e colaborar.",
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

const pathIcon = <Message>(path: string, className: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(className),
      h.DataAttribute("icon", ""),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
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
  pathIcon("m17 17 5-5-5-5M7 7l-5 5 5 5m7-14-4 18", "size-5", h);
const chevronIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon("m6 9 6 6 6-6", "size-3 shrink-0 stroke-3 text-fg-quaternary", h);
const permissionIds = ["owner", "can-view", "can-edit"] as const;

const menuFocus = <Message>(
  props: ShareProjectModalProps<Message>,
  menu: ShareProjectMenu,
  available: readonly ShareProjectPermission[],
  current: ShareProjectPermission,
  key: string,
) => {
  if (key === "Escape") {
    return Option.some({
      focusSelector: `[data-share-project-trigger="${menu}"]`,
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
        focusSelector: `[data-share-project-menu="${menu}"][data-permission="${target}"]`,
        message: props.onFocusPermission(target),
      });
};

const permissionMenu = <Message>(
  props: ShareProjectModalProps<Message>,
  menu: ShareProjectMenu,
  selected: ShareProjectPermission,
  h: HtmlBuilder<Message>,
): Html => {
  const labels = copy[props.locale].permissions;
  const available = menu === "link" ? permissionIds.slice(1) : permissionIds;
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
          h.DataAttribute("share-project-trigger", menu),
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
                    h.DataAttribute("share-project-menu", menu),
                    h.OnClick(props.onPermissionSelect(menu, permission)),
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

const avatarLabel = <Message>(member: ShareProjectMember, h: HtmlBuilder<Message>): Html =>
  h.figure(
    [h.Class("group flex min-w-0 flex-1 items-center gap-2")],
    [
      avatar(
        {
          alt: member.name,
          border: true,
          size: "md",
          src: member.avatarUrl,
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

export const shareProjectModal = <Message>(
  props: ShareProjectModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const text = copy[props.locale];
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-end justify-center bg-overlay/70 px-4 pt-4 pb-[clamp(16px,8vh,64px)] outline-hidden backdrop-blur-[6px] sm:items-center sm:px-8 sm:py-8",
              ),
            ],
            [
              h.div([h.AriaHidden(true), h.Class("absolute inset-0"), h.OnClick(props.onDismiss)]),
              h.dialog(
                [
                  h.AriaDescribedBy(descriptionId),
                  h.AriaLabelledBy(titleId),
                  h.Class(
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-max max-w-[calc(100%-32px)] overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:max-w-120 sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.Lang(props.locale),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.button(
                    [
                      h.AriaLabel(text.close),
                      h.Autofocus(true),
                      h.Class(
                        "absolute top-3 right-3 z-20 flex size-9 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 sm:top-4 sm:right-4",
                      ),
                      h.DataAttribute("share-project-close", ""),
                      h.OnClick(props.onDismiss),
                      h.Type("button"),
                    ],
                    [closeIcon(h)],
                  ),
                  h.div(
                    [h.Class("flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6")],
                    [
                      h.div(
                        [
                          h.Class(
                            "relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset max-md:hidden",
                          ),
                        ],
                        [usersIcon(h)],
                      ),
                      h.div(
                        [h.Class("z-10 flex flex-col gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            [text.title],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            [text.description],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div(
                    [h.Class("flex flex-col gap-5 px-4 pt-5 pb-6 sm:px-6 sm:pb-8")],
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
                            [h.Class("flex w-full flex-col gap-1.5")],
                            [
                              h.div(
                                [
                                  h.Class(
                                    "flex w-full items-center gap-2 rounded-lg bg-bg-primary px-3 py-2 text-sm shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
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
                            ],
                          ),
                          h.ul(
                            [h.Class("flex flex-col gap-3")],
                            props.members.map((member) =>
                              h.keyed("li")(
                                member.id,
                                [h.Class("flex items-start gap-3")],
                                [
                                  avatarLabel(member, h),
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
                        "flex items-center gap-3 border-t border-border-secondary p-4 sm:flex-row sm:gap-3 sm:p-6",
                      ),
                    ],
                    [
                      h.div(
                        [h.Class("mr-auto max-sm:hidden")],
                        [
                          button(
                            {
                              color: "link-gray",
                              iconLeadingElement: codeIcon(h),
                              label: text.embed,
                              onPress: props.onEmbed,
                              size: "md",
                            },
                            h,
                          ),
                        ],
                      ),
                      h.div(
                        [h.Class("flex-1 [&>button]:w-full sm:flex-none")],
                        [
                          button(
                            {
                              color: "secondary",
                              label: text.cancel,
                              onPress: props.onCancel,
                              size: "md",
                            },
                            h,
                          ),
                        ],
                      ),
                      h.div(
                        [h.Class("flex-1 [&>button]:w-full sm:flex-none")],
                        [
                          button(
                            {
                              color: "primary",
                              label: text.done,
                              onPress: props.onDone,
                              size: "md",
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
