/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the authenticated fixed project fixture and native slideout/select behavior directly. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import { button } from "../base/button.ts";
import { input, textarea } from "../base/fields.ts";
import { select } from "../base/select.ts";

export type ProjectDetailsMenuLocale = "en-US" | "pt-BR";
export type ProjectDetailsMemberId = "candice-wu" | "demi-wilkinson" | "drew-cano";
export type ProjectDetailsStatus = "cancelled" | "completed" | "draft" | "in-progress";

export interface ProjectDetailsMember {
  readonly email: string;
  readonly id: ProjectDetailsMemberId;
  readonly name: string;
  readonly seed: string;
}

export interface ProjectDetailsMenuProps<Message> {
  readonly copied: boolean;
  readonly description: string;
  readonly heading: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale: ProjectDetailsMenuLocale;
  readonly members: readonly ProjectDetailsMember[];
  readonly name: string;
  readonly onAddTeamMember: NoInfer<Message>;
  readonly onApply: NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onCopy: NoInfer<Message>;
  readonly onDescriptionInput: (value: string) => NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onNameInput: (value: string) => NoInfer<Message>;
  readonly onRemoveMember: (id: ProjectDetailsMemberId) => NoInfer<Message>;
  readonly onSaveFilter: NoInfer<Message>;
  readonly onStatusFocus: (status: ProjectDetailsStatus) => NoInfer<Message>;
  readonly onStatusOpenChanged: (isOpen: boolean) => NoInfer<Message>;
  readonly onStatusSelect: (status: ProjectDetailsStatus) => NoInfer<Message>;
  readonly selectedStatus: ProjectDetailsStatus;
  readonly shareUrl: string;
  readonly subtitle: string;
}

export const projectDetailsMembers: readonly ProjectDetailsMember[] = [
  {
    email: "candice@siglata.com",
    id: "candice-wu",
    name: "Candice Wu",
    seed: "project-details-candice-wu",
  },
  {
    email: "demi@siglata.com",
    id: "demi-wilkinson",
    name: "Demi Wilkinson",
    seed: "project-details-demi-wilkinson",
  },
  {
    email: "drew@siglata.com",
    id: "drew-cano",
    name: "Drew Cano",
    seed: "project-details-drew-cano",
  },
] as const;

const copyByLocale = {
  "en-US": {
    addMember: "Add team member",
    apply: "Apply",
    cancel: "Cancel",
    close: "Close",
    copied: "Copied",
    copyLink: "Copy link",
    description: "Description",
    descriptionTooltip: "This will be public",
    name: "Name of project",
    projectStatus: "Project status",
    remove: "Remove",
    saveFilter: "Save filter",
    shareProject: "Share project",
    slideout: "Slideout menu",
    status: {
      cancelled: "Cancelled",
      completed: "Completed",
      draft: "Draft",
      "in-progress": "In progress",
    },
    teamDescription: "The following are working on this project.",
    teamMembers: "Team members",
  },
  "pt-BR": {
    addMember: "Adicionar membro da equipe",
    apply: "Aplicar",
    cancel: "Cancelar",
    close: "Fechar",
    copied: "Copiado",
    copyLink: "Copiar link",
    description: "Descrição",
    descriptionTooltip: "Isso será público",
    name: "Nome do projeto",
    projectStatus: "Status do projeto",
    remove: "Remover",
    saveFilter: "Salvar filtro",
    shareProject: "Compartilhar projeto",
    slideout: "Menu lateral",
    status: {
      cancelled: "Cancelado",
      completed: "Concluído",
      draft: "Rascunho",
      "in-progress": "Em andamento",
    },
    teamDescription: "As pessoas a seguir estão trabalhando neste projeto.",
    teamMembers: "Membros da equipe",
  },
} as const;

const icon = <Message>(
  kind: "check" | "close" | "copy" | "link" | "plus",
  className: string,
  h: HtmlBuilder<Message>,
): Html => {
  const paths = {
    check: "M20 6 9 17l-5-5",
    close: "M18 6 6 18M6 6l12 12",
    copy: "M5 15c-.932 0-1.398 0-1.765-.152a2 2 0 0 1-1.083-1.083C2 13.398 2 12.932 2 12V5.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 2 4.08 2 5.2 2H12c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C15 3.602 15 4.068 15 5m-2.8 17h6.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 20.48 22 19.92 22 18.8v-6.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 9 19.92 9 18.8 9h-6.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C9 10.52 9 11.08 9 12.2v6.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C10.52 22 11.08 22 12.2 22Z",
    link: "m12.708 18.364-1.415 1.414a5 5 0 1 1-7.07-7.07l1.413-1.415m12.728 1.414 1.415-1.414a5 5 0 0 0-7.071-7.071l-1.415 1.414M8.5 15.5l7-7",
    plus: "M12 5v14m-7-7h14",
  } as const;
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class(className),
      h.DataAttribute("icon", kind),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(paths[kind]),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );
};

const statusDot = <Message>(status: ProjectDetailsStatus, h: HtmlBuilder<Message>): Html => {
  const color = {
    cancelled: "text-fg-error-secondary",
    completed: "text-fg-brand-secondary",
    draft: "text-fg-warning-secondary",
    "in-progress": "text-fg-success-secondary",
  }[status];
  return h.svg(
    [h.AriaHidden(true), h.Class(`size-2.5 ${color}`), h.Fill("none"), h.ViewBox("0 0 10 10")],
    [h.circle([h.Cx("5"), h.Cy("5"), h.Fill("currentColor"), h.R("4"), h.Stroke("currentColor")])],
  );
};

const memberRow = <Message>(
  member: ProjectDetailsMember,
  removeLabel: string,
  onRemove: NoInfer<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("flex items-center justify-between")],
    [
      h.figure(
        [h.Class("group flex min-w-0 flex-1 items-center gap-2")],
        [
          avatar(
            {
              alt: member.name,
              border: true,
              entityKind: "agent",
              seed: member.seed,
              size: "md",
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
      ),
      button({ color: "link-destructive", label: removeLabel, onPress: onRemove, size: "sm" }, h),
    ],
  );

export const projectDetailsMenu = <Message>(
  props: ProjectDetailsMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const copy = copyByLocale[props.locale];
  const descriptionId = `${props.id}-description`;
  const titleId = `${props.id}-title`;
  const statuses: readonly ProjectDetailsStatus[] = [
    "draft",
    "in-progress",
    "completed",
    "cancelled",
  ];
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-end bg-overlay/70 pl-6 outline-hidden ease-linear md:pl-10",
              ),
              h.DataAttribute("project-details-menu-overlay", props.id),
            ],
            [
              h.button([
                h.AriaHidden(true),
                h.Class("fixed inset-0 cursor-default border-0 bg-transparent p-0"),
                h.OnClick(props.onDismiss),
                h.Tabindex(-1),
                h.Type("button"),
              ]),
              h.dialog(
                [
                  h.AriaDescribedBy(descriptionId),
                  h.AriaLabel(copy.slideout),
                  h.Attribute("dir", "ltr"),
                  h.Class(
                    "fixed inset-y-0 right-0 left-auto my-0 mr-0 ml-auto h-full w-[calc(100%-1.5rem)] max-w-100 overflow-hidden border-0 bg-transparent p-0 shadow-xl outline-hidden md:w-[calc(100%-2.5rem)]",
                  ),
                  h.Id(props.id),
                  h.Lang(props.locale),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.div(
                    [
                      h.Class(
                        "relative flex size-full flex-col items-start gap-6 overflow-y-auto bg-bg-primary ring-1 ring-border-secondary-alt outline-hidden",
                      ),
                    ],
                    [
                      h.header(
                        [h.Class("relative z-1 flex w-full flex-col gap-0.5 px-4 pt-6 md:px-6")],
                        [
                          h.h1(
                            [
                              h.Class("text-md font-semibold text-text-primary md:text-lg"),
                              h.Id(titleId),
                            ],
                            [props.heading],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            [props.subtitle],
                          ),
                          h.button(
                            [
                              h.AriaLabel(copy.close),
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("project-details-menu-close", ""),
                              h.OnClick(props.onDismiss),
                              h.Type("button"),
                            ],
                            [icon("close", "size-5", h)],
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
                          h.section(
                            [h.Class("flex flex-col gap-4")],
                            [
                              h.div(
                                [h.Class("flex flex-col gap-1")],
                                [
                                  h.p(
                                    [h.Class("text-sm font-semibold text-text-primary")],
                                    [copy.shareProject],
                                  ),
                                  h.div(
                                    [h.Class("flex items-center gap-1.5")],
                                    [
                                      icon("link", "size-4 text-fg-quaternary", h),
                                      h.p(
                                        [h.Class("text-sm text-text-tertiary")],
                                        [props.shareUrl],
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              h.div(
                                [h.Class("w-max")],
                                [
                                  button(
                                    {
                                      color: "secondary",
                                      iconLeadingElement: icon(
                                        props.copied ? "check" : "copy",
                                        "size-5",
                                        h,
                                      ),
                                      label: props.copied ? copy.copied : copy.copyLink,
                                      onPress: props.onCopy,
                                      size: "sm",
                                    },
                                    h,
                                  ),
                                ],
                              ),
                            ],
                          ),
                          h.form(
                            [h.Class("flex flex-col gap-4"), h.OnSubmit(props.onApply)],
                            [
                              input(
                                {
                                  isRequired: true,
                                  label: copy.name,
                                  name: `${props.id}-name`,
                                  onInput: props.onNameInput,
                                  size: "md",
                                  value: props.name,
                                },
                                h,
                              ),
                              h.div(
                                [h.Class("h-36 [&>div]:h-full")],
                                [
                                  textarea(
                                    {
                                      label: copy.description,
                                      name: `${props.id}-description-field`,
                                      onInput: props.onDescriptionInput,
                                      textAreaClassName: "min-h-0 flex-1",
                                      tooltip: copy.descriptionTooltip,
                                      value: props.description,
                                    },
                                    h,
                                  ),
                                ],
                              ),
                              select(
                                {
                                  items: statuses.map((status) => ({
                                    iconElement: statusDot(status, h),
                                    id: status,
                                    label: copy.status[status],
                                    onFocus: props.onStatusFocus(status),
                                    onSelect: props.onStatusSelect(status),
                                  })),
                                  label: copy.projectStatus,
                                  name: `${props.id}-status`,
                                  onOpenChanged: props.onStatusOpenChanged,
                                  selectedId: props.selectedStatus,
                                  size: "md",
                                },
                                h,
                              ),
                            ],
                          ),
                          h.div(
                            [h.Class("flex flex-col gap-4")],
                            [
                              h.div(
                                [h.Class("flex flex-col gap-1")],
                                [
                                  h.p(
                                    [h.Class("text-sm font-semibold text-text-primary")],
                                    [copy.teamMembers],
                                  ),
                                  h.p(
                                    [h.Class("text-sm text-text-tertiary")],
                                    [copy.teamDescription],
                                  ),
                                ],
                              ),
                              h.section(
                                [h.Class("flex flex-col gap-3")],
                                [
                                  h.span([h.Class("w-full border-t border-border-secondary")]),
                                  ...props.members.flatMap((member) => [
                                    memberRow(
                                      member,
                                      copy.remove,
                                      props.onRemoveMember(member.id),
                                      h,
                                    ),
                                    h.span([h.Class("w-full border-t border-border-secondary")]),
                                  ]),
                                ],
                              ),
                              button(
                                {
                                  color: "link-color",
                                  iconLeadingElement: icon("plus", "size-5", h),
                                  label: copy.addMember,
                                  onPress: props.onAddTeamMember,
                                  size: "md",
                                },
                                h,
                              ),
                            ],
                          ),
                        ],
                      ),
                      h.footer(
                        [
                          h.Class(
                            "flex w-full items-center justify-end gap-3 p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6",
                          ),
                        ],
                        [
                          h.div(
                            [h.Class("mr-auto")],
                            [
                              button(
                                {
                                  color: "link-color",
                                  label: copy.saveFilter,
                                  onPress: props.onSaveFilter,
                                  size: "sm",
                                },
                                h,
                              ),
                            ],
                          ),
                          button(
                            {
                              color: "secondary",
                              label: copy.cancel,
                              onPress: props.onCancel,
                              size: "sm",
                            },
                            h,
                          ),
                          button({ label: copy.apply, onPress: props.onApply, size: "sm" }, h),
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
