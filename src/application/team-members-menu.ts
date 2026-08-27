/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/prefer-option-over-null -- The authenticated slideout, grouped member fixture, and controlled combobox stay explicit. */
import * as HashSet from "effect/HashSet";
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import { button } from "../base/button.ts";
import { combobox } from "../base/combobox.ts";

export type TeamMembersMenuLocale = "en-US" | "pt-BR";
export type TeamMembersMenuGroup = "design" | "product" | "marketing";

export type TeamMembersMenuMemberId =
  | "andi-lane"
  | "candice-wu"
  | "demi-wilkinson"
  | "drew-cano"
  | "kate-morrison"
  | "kelly-williams"
  | "lana-steiner"
  | "natali-craig"
  | "olivia-rhye"
  | "orlando-diggs"
  | "phoenix-baker";

export interface TeamMembersMenuMember {
  readonly group: TeamMembersMenuGroup;
  readonly id: TeamMembersMenuMemberId;
  readonly name: string;
  readonly role: string;
  readonly searchable: boolean;
}

export interface TeamMembersMenuProps<Message> {
  readonly avatars: Partial<Record<TeamMembersMenuMemberId, string>>;
  readonly focusedMemberId?: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly isSearchOpen: boolean;
  readonly locale: TeamMembersMenuLocale;
  readonly members: readonly TeamMembersMenuMember[];
  readonly onCancel: NoInfer<Message>;
  readonly onConfirm: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onEmailMember: (memberId: string) => NoInfer<Message>;
  readonly onMemberFocus: (memberId: string) => NoInfer<Message>;
  readonly onMemberSelect: (memberId: string) => NoInfer<Message>;
  readonly onSaveFilter: NoInfer<Message>;
  readonly onSearchClose: NoInfer<Message>;
  readonly onSearchInput: (value: string) => NoInfer<Message>;
  readonly onSearchOpen: NoInfer<Message>;
  readonly searchQuery: string;
  readonly selectedMemberId?: string;
}

const copy = {
  "en-US": {
    cancel: "Cancel",
    close: "Close",
    confirm: "Confirm",
    dialog: "Slideout menu",
    email: (name: string) => `Email ${name}`,
    groups: { design: "Design", marketing: "Marketing", product: "Product" },
    roles: {
      backend: "Backend Developer",
      frontend: "Frontend Developer",
      fullstack: "Fullstack Developer",
      growth: "Growth Marketer",
      productDesigner: "Product Designer",
      productManager: "Product Manager",
      qa: "QA Engineer",
      ui: "UI Designer",
      ux: "UX Designer",
    },
    saveFilter: "Save filter",
    search: "Search",
    title: "Team members",
  },
  "pt-BR": {
    cancel: "Cancelar",
    close: "Fechar",
    confirm: "Confirmar",
    dialog: "Menu lateral",
    email: (name: string) => `Enviar e-mail para ${name}`,
    groups: { design: "Design", marketing: "Marketing", product: "Produto" },
    roles: {
      backend: "Desenvolvimento backend",
      frontend: "Desenvolvimento frontend",
      fullstack: "Desenvolvimento full stack",
      growth: "Marketing de crescimento",
      productDesigner: "Design de produto",
      productManager: "Gestão de produto",
      qa: "Engenharia de qualidade",
      ui: "Design de UI",
      ux: "Design de UX",
    },
    saveFilter: "Salvar filtro",
    search: "Buscar",
    title: "Membros da equipe",
  },
} as const;

interface SourceMember {
  readonly group: TeamMembersMenuGroup;
  readonly id: TeamMembersMenuMemberId;
  readonly name: string;
  readonly role: keyof (typeof copy)["en-US"]["roles"];
}

const sourceMembers: readonly SourceMember[] = [
  { group: "design", id: "olivia-rhye", name: "Olivia Rhye", role: "productDesigner" },
  { group: "design", id: "natali-craig", name: "Natali Craig", role: "ux" },
  { group: "design", id: "drew-cano", name: "Drew Cano", role: "ux" },
  { group: "design", id: "orlando-diggs", name: "Orlando Diggs", role: "ui" },
  { group: "product", id: "phoenix-baker", name: "Phoenix Baker", role: "productManager" },
  { group: "product", id: "lana-steiner", name: "Lana Steiner", role: "frontend" },
  { group: "product", id: "demi-wilkinson", name: "Demi Wilkinson", role: "backend" },
  { group: "product", id: "candice-wu", name: "Candice Wu", role: "fullstack" },
  { group: "product", id: "andi-lane", name: "Andi Lane", role: "productManager" },
  { group: "product", id: "kate-morrison", name: "Kate Morrison", role: "qa" },
  { group: "marketing", id: "kelly-williams", name: "Kelly Wiliams", role: "growth" },
];

const searchableMemberIds = HashSet.make(
  "olivia-rhye",
  "natali-craig",
  "drew-cano",
  "orlando-diggs",
  "phoenix-baker",
  "lana-steiner",
  "demi-wilkinson",
  "candice-wu",
  "andi-lane",
);

export const teamMembersMenuFixture = (
  locale: TeamMembersMenuLocale,
): readonly TeamMembersMenuMember[] => {
  const { roles } = copy[locale];
  return sourceMembers.map((member) => ({
    group: member.group,
    id: member.id,
    name: member.name,
    role: roles[member.role],
    searchable: HashSet.has(searchableMemberIds, member.id),
  }));
};

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 20 20")],
    [
      h.path([
        h.D("m5 5 10 10M15 5 5 15"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const mailIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("-translate-y-0.5 size-5"),
      h.DataAttribute("icon", "leading"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          "m2 7 8.165 5.715c.661.463.992.695 1.351.784a2 2 0 0 0 .968 0c.36-.09.69-.32 1.351-.784L22 7M6.8 20h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 17.72 22 16.88 22 15.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 4 18.88 4 17.2 4H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 6.28 2 7.12 2 8.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 20 5.12 20 6.8 20Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const memberIdentity = <Message>(
  member: TeamMembersMenuMember,
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
          size: "md",
          src: memberAvatar,
        },
        h,
      ),
      h.figcaption(
        [h.Class("min-w-0 flex-1")],
        [
          h.p([h.Class("text-sm font-semibold text-text-primary")], [member.name]),
          h.p([h.Class("truncate text-sm text-text-tertiary")], [member.role]),
        ],
      ),
    ],
  );

const memberGroup = <Message>(
  group: TeamMembersMenuGroup,
  props: TeamMembersMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const text = copy[props.locale];
  return h.div(
    [h.Class("flex flex-col gap-4")],
    [
      h.p([h.Class("text-sm font-semibold text-text-primary")], [text.groups[group]]),
      h.ul(
        [h.Class("flex flex-col gap-3")],
        props.members
          .filter((member) => member.group === group)
          .map((member) =>
            h.keyed("li")(
              member.id,
              [h.Class("flex items-center justify-between gap-3")],
              [
                memberIdentity(member, props.avatars[member.id], h),
                button(
                  {
                    color: "tertiary",
                    iconLeadingElement: mailIcon(h),
                    isIconOnly: true,
                    label: text.email(member.name),
                    onPress: props.onEmailMember(member.id),
                    size: "sm",
                  },
                  h,
                ),
              ],
            ),
          ),
      ),
    ],
  );
};

export const teamMembersMenu = <Message>(
  props: TeamMembersMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const text = copy[props.locale];
  const titleId = `${props.id}-title`;
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-end bg-overlay/70 pl-6 outline-hidden md:pl-10",
              ),
              h.DataAttribute("slideout-overlay", props.id),
            ],
            [
              h.button([
                h.AriaHidden(true),
                h.Class("fixed inset-0 cursor-default border-0 bg-transparent p-0"),
                h.DataAttribute("team-members-menu-backdrop", ""),
                h.OnClick(props.onDismiss),
                h.Tabindex(-1),
                h.Type("button"),
              ]),
              h.dialog(
                [
                  h.AriaLabel(text.dialog),
                  h.Attribute("dir", "ltr"),
                  h.Class(
                    "fixed inset-y-0 !right-0 !left-auto m-0 h-full w-[calc(100%-24px)] max-w-100 overflow-hidden border-0 bg-bg-primary p-0 shadow-xl outline-hidden",
                  ),
                  h.Id(props.id),
                  h.Lang(props.locale),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.div(
                    [h.Class("relative flex size-full flex-col items-start gap-6 overflow-y-auto")],
                    [
                      h.header(
                        [h.Class("relative z-10 flex w-full flex-col gap-4 px-4 pt-6 md:px-6")],
                        [
                          h.h1(
                            [
                              h.Class("text-md font-semibold text-text-primary md:text-lg"),
                              h.Id(titleId),
                            ],
                            [text.title],
                          ),
                          h.button(
                            [
                              h.AriaLabel(text.close),
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("team-members-menu-close", ""),
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
                            "flex size-full flex-col gap-6 overflow-y-auto overscroll-auto px-4 pb-6 md:px-6",
                          ),
                        ],
                        [
                          h.div(
                            [h.Class("relative")],
                            [
                              combobox(
                                {
                                  ariaLabel: text.search,
                                  focusedId: props.focusedMemberId,
                                  inputValue: props.searchQuery,
                                  isOpen: props.isSearchOpen,
                                  items: props.members
                                    .filter((member) => member.searchable)
                                    .map((member) => ({
                                      id: member.id,
                                      label: member.name,
                                      onFocus: props.onMemberFocus(member.id),
                                      onSelect: props.onMemberSelect(member.id),
                                    })),
                                  name: `${props.id}-search`,
                                  onClose: props.onSearchClose,
                                  onInput: props.onSearchInput,
                                  onOpen: props.onSearchOpen,
                                  placeholder: text.search,
                                  selectedId: props.selectedMemberId,
                                  shortcut: false,
                                  size: "md",
                                },
                                h,
                              ),
                              h.span(
                                [
                                  h.AriaHidden(true),
                                  h.Class(
                                    "absolute top-2.5 right-3 hidden rounded px-1 py-px text-xs font-medium text-text-quaternary ring-1 ring-border-secondary ring-inset select-none md:inline-flex",
                                  ),
                                ],
                                ["⌘K"],
                              ),
                            ],
                          ),
                          memberGroup("design", props, h),
                          memberGroup("product", props, h),
                          memberGroup("marketing", props, h),
                        ],
                      ),
                      h.footer(
                        [
                          h.Class(
                            "flex w-full items-center justify-end gap-3 p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6",
                          ),
                        ],
                        [
                          button(
                            {
                              className: "mr-auto",
                              color: "link-color",
                              label: text.saveFilter,
                              onPress: props.onSaveFilter,
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
                          button({ label: text.confirm, onPress: props.onConfirm, size: "sm" }, h),
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
