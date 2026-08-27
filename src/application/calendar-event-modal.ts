/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled native dialog preserves the authenticated modal anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import { button } from "../base/button.ts";

export type CalendarEventLocale = "en-US" | "pt-BR";

/** A person rendered through a host-supplied avatar image and display name. */
export interface CalendarEventPerson {
  readonly avatarUrl: string;
  readonly name: string;
}

export interface CalendarEventModalProps<Message> {
  readonly attendees: readonly CalendarEventPerson[];
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale: CalendarEventLocale;
  readonly onAccept: NoInfer<Message>;
  readonly onAddAttendee: NoInfer<Message>;
  readonly onDecline: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onMaybe: NoInfer<Message>;
  readonly organizer: CalendarEventPerson;
  readonly organizerEmail: string;
}

const copy = {
  "en-US": {
    accept: "Accept",
    add: "Add user",
    attendees: "Attendees",
    awaiting: "1 awaiting",
    byline: "Sienna Hewitt @ Friday, Jan 8, 2028",
    date: "Friday, Jan 10, 2027",
    decline: "Decline",
    details: "Details",
    guests: "6 guests",
    maybe: "Maybe",
    month: "JAN",
    organizer: "Organizer",
    reminder: "10 min before",
    time: "1:30 PM - 3:30 PM",
    title: "Invitation: Product demo",
    yes: "5 yes",
  },
  "pt-BR": {
    accept: "Aceitar",
    add: "Adicionar participante",
    attendees: "Participantes",
    awaiting: "1 aguardando",
    byline: "Sienna Hewitt @ sexta-feira, 8 de jan. de 2028",
    date: "sexta-feira, 10 de jan. de 2027",
    decline: "Recusar",
    details: "Detalhes",
    guests: "6 convidados",
    maybe: "Talvez",
    month: "JAN",
    organizer: "Organizador",
    reminder: "10 min antes",
    time: "13:30 - 15:30",
    title: "Convite: Demonstração do produto",
    yes: "5 sim",
  },
} as const;

const calendarIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          "M21 10H3m13-8v4M8 2v4m-.2 16h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 19.72 21 18.88 21 17.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 4 17.88 4 16.2 4H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 6.28 3 7.12 3 8.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 22 6.12 22 7.8 22Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const clockIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("M12 6v6l4 2m6-2c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const bellIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          "M9.354 21A3.99 3.99 0 0 0 12 22c1.015 0 1.94-.378 2.646-1M2.294 5.82A4.007 4.007 0 0 1 4.326 2.3m17.376 3.52A4.007 4.007 0 0 0 19.67 2.3M18 8A6 6 0 1 0 6 8c0 3.09-.78 5.206-1.65 6.605-.735 1.18-1.102 1.771-1.088 1.936.014.182.053.252.2.36.133.099.73.099 1.927.099h13.222c1.197 0 1.795 0 1.927-.098.147-.11.186-.179.2-.361.014-.165-.353-.755-1.087-1.936C18.78 13.206 18 11.09 18 8Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const plusIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("M12 5v14M5 12h14"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const detail = <Message>(icon: Html, label: string, h: HtmlBuilder<Message>): Html =>
  h.span([h.Class("flex gap-2")], [icon, h.p([h.Class("text-sm text-text-tertiary")], [label])]);

const attendees = <Message>(
  props: CalendarEventModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const localized = copy[props.locale];
  return h.div(
    [h.Class("flex gap-2")],
    [
      h.div(
        [h.Class("flex flex-row -space-x-3")],
        [
          ...props.attendees.map((person) =>
            h.span(
              [h.Class("flex size-10 rounded-full ring-[1.5px] ring-bg-primary")],
              [avatar({ alt: person.name, size: "md", src: person.avatarUrl }, h)],
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
          h.AriaLabel(localized.add),
          h.Class(
            "flex size-10 cursor-pointer items-center justify-center rounded-full border border-dashed border-border-primary bg-bg-primary text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.OnClick(props.onAddAttendee),
          h.Title(localized.add),
          h.Type("button"),
        ],
        [plusIcon(h)],
      ),
    ],
  );
};

export const calendarEventModal = <Message>(
  props: CalendarEventModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const localized = copy[props.locale];
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
              h.DataAttribute("modal-overlay", props.id),
            ],
            [
              h.div([h.AriaHidden(true), h.Class("absolute inset-0"), h.OnClick(props.onDismiss)]),
              h.dialog(
                [
                  h.AriaDescribedBy(descriptionId),
                  h.AriaLabelledBy(titleId),
                  h.Class(
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-[271.656px] max-w-[calc(100%-32px)] overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:w-[287.656px] sm:max-w-100 sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.div(
                    [h.Class("flex justify-center px-4 pt-5 sm:px-6 sm:pt-6")],
                    [
                      h.div(
                        [
                          h.Class(
                            "flex h-max w-16 flex-col overflow-hidden rounded-lg border border-border-secondary",
                          ),
                        ],
                        [
                          h.span(
                            [h.Class("z-0 bg-bg-secondary px-[7px] pt-[3px] pb-0.5 text-center")],
                            [
                              h.p(
                                [h.Class("text-xs font-semibold text-text-quaternary")],
                                [localized.month],
                              ),
                            ],
                          ),
                          h.span(
                            [h.Class("px-[7px] pt-px pb-[2px] text-center")],
                            [h.p([h.Class("text-lg font-bold text-text-brand-secondary")], ["10"])],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.header(
                    [h.Class("mt-4 flex flex-col gap-0.5 px-4 sm:px-6")],
                    [
                      h.h2(
                        [
                          h.Class("text-center text-md font-semibold text-text-primary"),
                          h.Id(titleId),
                        ],
                        [localized.title],
                      ),
                      h.p(
                        [h.Class("text-center text-sm text-text-tertiary"), h.Id(descriptionId)],
                        [localized.byline],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div(
                    [
                      h.Class(
                        "flex flex-col items-start justify-start gap-4 px-4 sm:px-6 md:gap-5",
                      ),
                    ],
                    [
                      h.section(
                        [h.Class("flex flex-col gap-3")],
                        [
                          h.h3(
                            [h.Class("text-sm font-semibold text-text-primary")],
                            [localized.details],
                          ),
                          h.div(
                            [h.Class("flex flex-col gap-2")],
                            [
                              detail(calendarIcon(h), localized.date, h),
                              detail(clockIcon(h), localized.time, h),
                              detail(bellIcon(h), localized.reminder, h),
                            ],
                          ),
                        ],
                      ),
                      h.section(
                        [h.Class("flex flex-col gap-3")],
                        [
                          h.h3(
                            [h.Class("text-sm font-semibold text-text-primary")],
                            [localized.organizer],
                          ),
                          h.figure(
                            [h.Class("group flex min-w-0 flex-1 items-center gap-2")],
                            [
                              avatar(
                                {
                                  alt: props.organizer.name,
                                  border: true,
                                  size: "md",
                                  src: props.organizer.avatarUrl,
                                },
                                h,
                              ),
                              h.figcaption(
                                [h.Class("min-w-0 flex-1")],
                                [
                                  h.p(
                                    [h.Class("text-sm font-semibold text-text-primary")],
                                    [props.organizer.name],
                                  ),
                                  h.p(
                                    [h.Class("truncate text-sm text-text-tertiary")],
                                    [props.organizerEmail],
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
                          h.h3(
                            [h.Class("text-sm font-semibold text-text-primary")],
                            [localized.attendees],
                          ),
                          attendees(props, h),
                          h.div(
                            [h.Class("flex items-center gap-2")],
                            [
                              h.p(
                                [h.Class("text-sm font-semibold text-text-primary")],
                                [localized.guests],
                              ),
                              h.span([
                                h.AriaHidden(true),
                                h.Class("h-[13px] border-l border-border-primary"),
                              ]),
                              h.p([h.Class("text-sm text-text-tertiary")], [localized.yes]),
                              h.span([
                                h.AriaHidden(true),
                                h.Class("h-[13px] border-l border-border-primary"),
                              ]),
                              h.p([h.Class("text-sm text-text-tertiary")], [localized.awaiting]),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.footer(
                    [
                      h.Class(
                        "z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 sm:flex-row sm:items-center sm:justify-end sm:px-6 sm:pt-8 sm:pb-6",
                      ),
                    ],
                    [
                      h.div(
                        [h.Class("relative -top-px mr-auto hidden sm:block")],
                        [
                          button(
                            {
                              color: "link-gray",
                              label: localized.maybe,
                              onPress: props.onMaybe,
                              size: "md",
                            },
                            h,
                          ),
                        ],
                      ),
                      button(
                        {
                          color: "secondary",
                          label: localized.decline,
                          onPress: props.onDecline,
                          size: "md",
                        },
                        h,
                      ),
                      button(
                        {
                          color: "primary",
                          label: localized.accept,
                          onPress: props.onAccept,
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
