/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled native slideout preserves the authenticated calendar-event-menu anatomy and fixture. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import { buttonGroup } from "../base/button-group.ts";
import { buttonUtility } from "../base/button-utility.ts";

export type CalendarEventMenuLocale = "en-US" | "pt-BR";
export type CalendarEventResponse = "maybe" | "no" | "yes";

export interface CalendarEventMenuProps<Message> {
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale: CalendarEventMenuLocale;
  readonly onAddAttendee: NoInfer<Message>;
  readonly onCopyLink: NoInfer<Message>;
  readonly onDelete: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onEdit: NoInfer<Message>;
  readonly onResponse: (response: CalendarEventResponse) => NoInfer<Message>;
  readonly onUnmount: NoInfer<Message>;
  readonly response: CalendarEventResponse;
}

const copy = {
  "en-US": {
    about: "About this event",
    add: "Add user",
    attendees: "Attendees",
    awaiting: "1 awaiting",
    close: "Close",
    copyLink: "Copy link",
    date: "Friday, Jan 10, 2027",
    delete: "Delete",
    details: "Details",
    dialog: "Slideout menu",
    edit: "Edit",
    guests: "6 guests",
    invitation: "Sienna is inviting you to a scheduled Zoom meeting.",
    join: "Join Zoom Meeting:",
    maybe: "Maybe",
    meetingId: "Meeting ID: 863 4196 9512",
    month: "JAN",
    no: "No",
    organizer: "Organizer",
    reminder: "10 min before",
    response: "Going?",
    time: "1:30 PM - 3:30 PM",
    title: "Product demo",
    topic: "Topic: Product demo for the new dashboard and Q&A session.",
    yes: "Yes",
    yesCount: "5 yes",
  },
  "pt-BR": {
    about: "Sobre este evento",
    add: "Adicionar usuário",
    attendees: "Participantes",
    awaiting: "1 aguardando",
    close: "Fechar",
    copyLink: "Copiar link",
    date: "sexta-feira, 10 de jan. de 2027",
    delete: "Excluir",
    details: "Detalhes",
    dialog: "Menu lateral",
    edit: "Editar",
    guests: "6 convidados",
    invitation: "Sienna está convidando você para uma reunião agendada no Zoom.",
    join: "Entrar na reunião do Zoom:",
    maybe: "Talvez",
    meetingId: "ID da reunião: 863 4196 9512",
    month: "JAN",
    no: "Não",
    organizer: "Organizador",
    reminder: "10 min antes",
    response: "Vai participar?",
    time: "13:30 - 15:30",
    title: "Demonstração do produto",
    topic: "Tópico: Demonstração do produto para o novo painel e sessão de perguntas e respostas.",
    yes: "Sim",
    yesCount: "5 sim",
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
  pathIcon("M17 7 7 17M7 7l10 10", "size-5", h);
const calendarIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M21 10H3m13-8v4M8 2v4m-.2 16h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 19.72 21 18.88 21 17.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 4 17.88 4 16.2 4H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 6.28 3 7.12 3 8.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 22 6.12 22 7.8 22Z",
    "size-5 shrink-0 text-fg-quaternary",
    h,
  );
const clockIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M12 6v6l4 2m6-2c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z",
    "size-5 shrink-0 text-fg-quaternary",
    h,
  );
const bellIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M9.354 21A3.99 3.99 0 0 0 12 22c1.015 0 1.94-.378 2.646-1M2.294 5.82A4.007 4.007 0 0 1 4.326 2.3m17.376 3.52A4.007 4.007 0 0 0 19.67 2.3M18 8A6 6 0 1 0 6 8c0 3.09-.78 5.206-1.65 6.605-.735 1.18-1.102 1.771-1.088 1.936.014.182.053.252.2.36.133.099.73.099 1.927.099h13.222c1.197 0 1.795 0 1.927-.098.147-.11.186-.179.2-.361.014-.165-.353-.755-1.087-1.936C18.78 13.206 18 11.09 18 8Z",
    "size-5 shrink-0 text-fg-quaternary",
    h,
  );
const copyIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M5 15c-.932 0-1.398 0-1.765-.152a2 2 0 0 1-1.083-1.083C2 13.398 2 12.932 2 12V5.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 2 4.08 2 5.2 2H12c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C15 3.602 15 4.068 15 5m-2.8 17h6.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 20.48 22 19.92 22 18.8v-6.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 9 19.92 9 18.8 9h-6.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C9 10.52 9 11.08 9 12.2v6.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C10.52 22 11.08 22 12.2 22Z",
    "size-4",
    h,
  );
const trashIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M16 6v-.8c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C14.48 2 13.92 2 12.8 2h-1.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C8 3.52 8 4.08 8 5.2V6m2 5.5v5m4-5v5M3 6h18m-2 0v11.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C16.72 22 15.88 22 14.2 22H9.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C5 19.72 5 18.88 5 17.2V6",
    "size-4",
    h,
  );
const editIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M2.876 18.116c.046-.414.069-.62.131-.814a2 2 0 0 1 .234-.485c.111-.17.259-.317.553-.61L17 3a2.828 2.828 0 1 1 4 4L7.794 20.206c-.294.294-.442.442-.611.553a2 2 0 0 1-.485.233c-.193.063-.4.086-.814.132L2.5 21.5l.376-3.384Z",
    "size-4",
    h,
  );
const plusIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon("M12 5v14M5 12h14", "size-5", h);

const detail = <Message>(icon: Html, detailText: string, h: HtmlBuilder<Message>): Html =>
  h.span(
    [h.Class("flex items-center gap-2")],
    [icon, h.p([h.Class("text-sm text-text-tertiary")], [detailText])],
  );

const attendeeNames = [
  "Sienna Hewitt",
  "Ammar Foley",
  "Pippa Wilkinson",
  "Olly Schroeder",
  "Mathilde Lewis",
] as const;

const attendeeList = <Message>(
  props: CalendarEventMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const labels = copy[props.locale];
  return h.section(
    [h.Class("flex gap-2")],
    [
      h.section(
        [h.Class("flex flex-row -space-x-3")],
        [
          ...attendeeNames.map((name) =>
            h.span(
              [h.Class("flex size-10 rounded-full ring-[1.5px] ring-bg-primary")],
              [
                avatar(
                  {
                    alt: `${name}, Siglata agent`,
                    entityKind: "agent",
                    seed: `calendar-event-${name.toLowerCase().replaceAll(" ", "-")}`,
                    size: "md",
                  },
                  h,
                ),
              ],
            ),
          ),
          h.span(
            [h.Class("flex size-10 rounded-full ring-[1.5px] ring-bg-primary")],
            [avatar({ alt: "OR", initials: "OR", size: "md" }, h)],
          ),
        ],
      ),
      h.button(
        [
          h.AriaLabel(labels.add),
          h.Class(
            "flex size-10 cursor-pointer items-center justify-center rounded-full border border-dashed border-border-primary bg-bg-primary text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.OnClick(props.onAddAttendee),
          h.Title(labels.add),
          h.Type("button"),
        ],
        [plusIcon(h)],
      ),
    ],
  );
};

const organizer = <Message>(h: HtmlBuilder<Message>): Html =>
  h.figure(
    [h.Class("group flex min-w-0 flex-1 items-center gap-2")],
    [
      avatar(
        {
          alt: "Sienna Hewitt, Siglata agent",
          border: true,
          entityKind: "agent",
          seed: "calendar-event-sienna-hewitt",
          size: "md",
        },
        h,
      ),
      h.figcaption(
        [h.Class("min-w-0 flex-1")],
        [
          h.p([h.Class("text-sm font-semibold text-text-primary")], ["Sienna Hewitt"]),
          h.p([h.Class("truncate text-sm text-text-tertiary")], ["sienna@siglata.com"]),
        ],
      ),
    ],
  );

export const calendarEventMenu = <Message>(
  props: CalendarEventMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const labels = copy[props.locale];
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-end bg-overlay/70 pl-6 outline-hidden ease-linear md:pl-10",
              ),
              h.DataAttribute("calendar-event-overlay", props.id),
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
                  h.AriaLabel(labels.dialog),
                  h.Dir("ltr"),
                  h.Class(
                    "fixed inset-y-0 right-0 left-auto m-0 h-full w-[calc(100%-1.5rem)] max-w-100 overflow-hidden border-0 bg-transparent p-0 shadow-xl outline-hidden md:w-[calc(100%-2.5rem)]",
                  ),
                  h.Id(props.id),
                  h.Lang(props.locale),
                  h.OnCancel(props.onDismiss),
                  h.OnUnmount(props.onUnmount),
                ],
                [
                  h.div(
                    [
                      h.Class(
                        "relative flex size-full flex-col items-start gap-0 overflow-y-auto bg-bg-primary ring-1 ring-border-secondary-alt outline-hidden",
                      ),
                    ],
                    [
                      h.header(
                        [
                          h.Class(
                            "relative z-1 flex w-full flex-col items-start gap-3 px-4 pt-5 md:px-6",
                          ),
                        ],
                        [
                          h.div(
                            [
                              h.Class(
                                "flex h-max w-16 flex-col overflow-hidden rounded-lg border border-border-secondary",
                              ),
                            ],
                            [
                              h.span(
                                [
                                  h.Class(
                                    "z-0 bg-bg-secondary px-[7px] pt-[3px] pb-0.5 text-center",
                                  ),
                                ],
                                [
                                  h.p(
                                    [h.Class("text-xs font-semibold text-text-quaternary")],
                                    [labels.month],
                                  ),
                                ],
                              ),
                              h.span(
                                [h.Class("px-[7px] pt-px pb-[2px] text-center")],
                                [
                                  h.p(
                                    [h.Class("text-lg font-bold text-text-brand-secondary")],
                                    ["10"],
                                  ),
                                ],
                              ),
                            ],
                          ),
                          h.h1(
                            [h.Class("text-md font-semibold text-text-primary md:text-lg")],
                            [labels.title],
                          ),
                          h.button(
                            [
                              h.AriaLabel(labels.close),
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("calendar-event-close", ""),
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
                            "flex size-full flex-col gap-6 overflow-y-auto overscroll-auto px-4 py-6 md:px-6",
                          ),
                        ],
                        [
                          h.div(
                            [h.Class("flex flex-col gap-4")],
                            [
                              h.section(
                                [h.Class("flex w-full justify-between")],
                                [
                                  h.p(
                                    [h.Class("text-sm font-semibold text-text-primary")],
                                    [labels.details],
                                  ),
                                  h.span(
                                    [h.Class("-mt-2 -mb-1 flex gap-0.5")],
                                    [
                                      buttonUtility(
                                        {
                                          color: "tertiary",
                                          icon: copyIcon,
                                          onPress: props.onCopyLink,
                                          size: "xs",
                                          tooltip: labels.copyLink,
                                        },
                                        h,
                                      ),
                                      buttonUtility(
                                        {
                                          color: "tertiary",
                                          icon: trashIcon,
                                          onPress: props.onDelete,
                                          size: "xs",
                                          tooltip: labels.delete,
                                        },
                                        h,
                                      ),
                                      buttonUtility(
                                        {
                                          color: "tertiary",
                                          icon: editIcon,
                                          onPress: props.onEdit,
                                          size: "xs",
                                          tooltip: labels.edit,
                                        },
                                        h,
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              h.section(
                                [h.Class("flex flex-col gap-2")],
                                [
                                  detail(calendarIcon(h), labels.date, h),
                                  detail(clockIcon(h), labels.time, h),
                                  detail(bellIcon(h), labels.reminder, h),
                                ],
                              ),
                            ],
                          ),
                          h.section(
                            [h.Class("flex flex-col gap-4")],
                            [
                              h.p(
                                [h.Class("text-sm font-semibold text-text-primary")],
                                [labels.organizer],
                              ),
                              organizer(h),
                            ],
                          ),
                          h.div(
                            [h.Class("flex flex-col gap-4")],
                            [
                              h.p(
                                [h.Class("text-sm font-semibold text-text-primary")],
                                [labels.attendees],
                              ),
                              h.div(
                                [h.Class("flex flex-col gap-3")],
                                [
                                  attendeeList(props, h),
                                  h.section(
                                    [h.Class("flex items-center gap-2")],
                                    [
                                      h.p(
                                        [h.Class("text-sm font-semibold text-text-primary")],
                                        [labels.guests],
                                      ),
                                      h.span([
                                        h.AriaHidden(true),
                                        h.Class("h-[13px] border-l border-border-primary"),
                                      ]),
                                      h.p(
                                        [h.Class("text-sm text-text-tertiary")],
                                        [labels.yesCount],
                                      ),
                                      h.span([
                                        h.AriaHidden(true),
                                        h.Class("h-[13px] border-l border-border-primary"),
                                      ]),
                                      h.p(
                                        [h.Class("text-sm text-text-tertiary")],
                                        [labels.awaiting],
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ],
                          ),
                          h.section(
                            [h.Class("flex flex-col gap-3")],
                            [
                              h.p(
                                [h.Class("text-sm font-semibold text-text-primary")],
                                [labels.about],
                              ),
                              h.div(
                                [h.Class("text-sm text-text-tertiary")],
                                [
                                  h.p([], [labels.invitation]),
                                  h.br([]),
                                  h.p([], [labels.topic]),
                                  h.br([]),
                                  h.p(
                                    [h.Class("break-words whitespace-normal")],
                                    [
                                      `${labels.join} `,
                                      h.a(
                                        [
                                          h.Class(
                                            "break-all underline outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                                          ),
                                          h.Href("https://us02web.zoom.us/j/86341969512"),
                                        ],
                                        ["https://us02web.zoom.us/j/86341969512"],
                                      ),
                                      " ",
                                    ],
                                  ),
                                  h.br([]),
                                  h.p([], [labels.meetingId]),
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                      h.footer(
                        [
                          h.Class(
                            "flex w-full items-center gap-4 p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6",
                          ),
                        ],
                        [
                          h.p(
                            [h.Class("w-full text-sm font-medium text-text-secondary")],
                            [labels.response],
                          ),
                          buttonGroup(
                            {
                              items: [
                                {
                                  id: "yes",
                                  label: labels.yes,
                                  message: props.onResponse("yes"),
                                },
                                {
                                  id: "no",
                                  label: labels.no,
                                  message: props.onResponse("no"),
                                },
                                {
                                  id: "maybe",
                                  label: labels.maybe,
                                  message: props.onResponse("maybe"),
                                },
                              ],
                              label: labels.response,
                              selectedId: props.response,
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
