/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled dialog preserves the authenticated access list and person selector anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import { button } from "../base/button.ts";
import { select } from "../base/select.ts";

export interface UserInviteMember {
  readonly avatarUrl?: string;
  readonly email: string;
  readonly id: string;
  readonly initials?: string;
  readonly name: string;
}

export type UserInviteLocale = "en-US" | "pt-BR";

/** A selectable person option whose identity comes entirely from the host. */
export interface UserInvitePersonOption {
  readonly avatarUrl: string;
  readonly id: string;
  readonly label: string;
}

export interface UserInviteModalProps<Message> {
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale: UserInviteLocale;
  readonly members: readonly UserInviteMember[];
  readonly onCancel: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onDone: NoInfer<Message>;
  readonly onFocusPerson: (id: string) => NoInfer<Message>;
  readonly onRemoveMember: (id: string) => NoInfer<Message>;
  readonly onSelectOpenChanged: (isOpen: boolean) => NoInfer<Message>;
  readonly onSelectPerson: (id: string) => NoInfer<Message>;
  readonly people: readonly UserInvitePersonOption[];
  readonly selectedPersonId?: string;
}

const copy = {
  "en-US": {
    cancel: "Cancel",
    close: "Close dialog",
    description: "The following users have access to this project:",
    done: "Done",
    remove: "Remove",
    selectLabel: "Team member",
    selectPlaceholder: "Select team member",
    title: "Share with people",
  },
  "pt-BR": {
    cancel: "Cancelar",
    close: "Fechar caixa de diálogo",
    description: "As pessoas a seguir têm acesso a este projeto:",
    done: "Concluir",
    remove: "Remover",
    selectLabel: "Membro da equipe",
    selectPlaceholder: "Selecione um membro da equipe",
    title: "Compartilhar com pessoas",
  },
} as const;

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("M18 6 6 18M6 6l12 12"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const usersPlusIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("z-1 size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D(
          "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m19-10v6m3-3h-6M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const userIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 20 20"),
    ],
    [
      h.path([
        h.D(
          "M16.667 17.5c0-2.761-2.985-5-6.667-5s-6.667 2.239-6.667 5M10 10a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const memberRow = <Message>(
  member: UserInviteMember,
  removeLabel: string,
  onRemove: NoInfer<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.keyed("div")(
    member.id,
    [h.Class("flex w-full flex-row items-start gap-3"), h.DataAttribute("member", member.id)],
    [
      h.figure(
        [h.Class("group flex min-w-0 flex-1 items-center gap-2")],
        [
          avatar(
            {
              alt: member.name,
              border: true,
              initials: member.initials,
              size: "md",
              src: member.avatarUrl,
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
      button(
        {
          color: "link-destructive",
          label: removeLabel,
          onPress: onRemove,
          size: "sm",
        },
        h,
      ),
    ],
  );

export const userInviteModal = <Message>(
  props: UserInviteModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const text = copy[props.locale];
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  const personItems = props.people.map((person) => ({
    iconElement: avatar({ alt: "", size: "xs", src: person.avatarUrl }, h),
    id: person.id,
    label: person.label,
    onFocus: props.onFocusPerson(person.id),
    onSelect: props.onSelectPerson(person.id),
  }));
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-end justify-center bg-overlay/70 px-4 pt-4 pb-[clamp(16px,8vh,64px)] outline-hidden backdrop-blur-[6px] sm:items-center sm:px-8 sm:py-8",
              ),
              h.DataAttribute("modal-overlay", props.id),
            ],
            [
              h.div([h.AriaHidden(true), h.Class("absolute inset-0"), h.OnClick(props.onDismiss)]),
              h.dialog(
                [
                  h.AriaDescribedBy(descriptionId),
                  h.AriaLabelledBy(titleId),
                  h.Attribute("dir", "ltr"),
                  h.Class(
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-max max-w-[calc(100%-32px)] overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:max-w-100 sm:rounded-2xl",
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
                        "absolute top-3 right-3 z-20 flex size-9 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary transition duration-100 ease-linear outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 sm:top-4 sm:right-4",
                      ),
                      h.DataAttribute("user-invite-close", ""),
                      h.OnClick(props.onDismiss),
                      h.Type("button"),
                    ],
                    [closeIcon(h)],
                  ),
                  h.div(
                    [h.Class("flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6")],
                    [
                      h.div(
                        [h.Class("relative w-max")],
                        [
                          h.div(
                            [
                              h.Class(
                                "relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
                              ),
                            ],
                            [usersPlusIcon(h)],
                          ),
                        ],
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
                  h.div([h.Class("h-5 w-full")]),
                  h.div(
                    [h.Class("relative flex flex-col gap-4 px-4 sm:gap-5 sm:px-6")],
                    [
                      h.div(
                        [h.Class("flex flex-col gap-3")],
                        props.members.map((member) =>
                          memberRow(member, text.remove, props.onRemoveMember(member.id), h),
                        ),
                      ),
                      h.div(
                        [
                          h.Class(
                            `relative ${props.selectedPersonId === undefined ? "[&>div>button]:pl-10" : ""}`,
                          ),
                        ],
                        [
                          ...(props.selectedPersonId === undefined
                            ? [
                                h.div(
                                  [
                                    h.AriaHidden(true),
                                    h.Class("pointer-events-none absolute bottom-2.5 left-3 z-10"),
                                  ],
                                  [userIcon(h)],
                                ),
                              ]
                            : []),
                          select(
                            {
                              items: personItems,
                              label: text.selectLabel,
                              name: `${props.id}-team-member`,
                              onOpenChanged: props.onSelectOpenChanged,
                              placeholder: text.selectPlaceholder,
                              selectedId: props.selectedPersonId,
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
                        "z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pt-8 sm:pb-6",
                      ),
                    ],
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
        ]
      : [],
  );
};
