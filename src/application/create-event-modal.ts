/* oxlint-disable @rikalabs/no-low-signal-variable-names, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity -- The controlled dialog preserves the authenticated responsive event form and calendar anatomy. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { checkbox } from "../base/controls.ts";
import { textarea } from "../base/fields.ts";
import { rangeCalendar } from "./range-calendar.ts";
import type { DateRangeValue, RangeCalendarPreset } from "./range-calendar.ts";

export type CreateEventLocale = "en-US" | "pt-BR";

export interface CreateEventModalProps<Message> {
  readonly attendeesCanInvite: boolean;
  readonly description: string;
  readonly endDateTime: string;
  readonly focusedDate: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale: CreateEventLocale;
  readonly location: string;
  readonly messageForDescription: (value: string) => NoInfer<Message>;
  readonly messageForEndDateTime: (value: string) => NoInfer<Message>;
  readonly messageForFocusDate: (date: string) => NoInfer<Message>;
  readonly messageForLocation: (value: string) => NoInfer<Message>;
  readonly messageForPreset: (value: DateRangeValue) => NoInfer<Message>;
  readonly messageForSelectDate: (date: string) => NoInfer<Message>;
  readonly messageForStartDateTime: (value: string) => NoInfer<Message>;
  readonly messageForTitle: (value: string) => NoInfer<Message>;
  readonly month: number;
  readonly onCancel: NoInfer<Message>;
  readonly onCreate: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onNextMonth: NoInfer<Message>;
  readonly onPreviousMonth: NoInfer<Message>;
  readonly onToggleAttendeeInvites: NoInfer<Message>;
  readonly range: DateRangeValue;
  readonly startDateTime: string;
  readonly title: string;
  readonly today: string;
  readonly year: number;
}

const copy = {
  "en-US": {
    attendeeInvites: "Attendees can invite others",
    cancel: "Cancel",
    close: "Close dialog",
    create: "Create event",
    description: "Description",
    descriptionPlaceholder: "Enter a description",
    descriptionTooltip: "Add event details and agenda",
    endDate: "End date",
    location: "Location",
    locationPlaceholder: "Add location",
    presets: ["Last week", "Last month", "Last year"],
    startDate: "Start date",
    subtitleDesktop: "Choose dates, time, and add details to schedule your event.",
    subtitleMobile: "Choose dates, time, and add details.",
    title: "Create event",
    titleField: "Title",
    titlePlaceholder: "Event name",
  },
  "pt-BR": {
    attendeeInvites: "Participantes podem convidar outras pessoas",
    cancel: "Cancelar",
    close: "Fechar diálogo",
    create: "Criar evento",
    description: "Descrição",
    descriptionPlaceholder: "Insira uma descrição",
    descriptionTooltip: "Adicione detalhes e a agenda do evento",
    endDate: "Data final",
    location: "Local",
    locationPlaceholder: "Adicionar local",
    presets: ["Semana passada", "Mês passado", "Ano passado"],
    startDate: "Data inicial",
    subtitleDesktop: "Escolha datas, horários e adicione detalhes para agendar seu evento.",
    subtitleMobile: "Escolha datas, horários e adicione detalhes.",
    title: "Criar evento",
    titleField: "Título",
    titlePlaceholder: "Nome do evento",
  },
} as const;

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-6"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("M17 7 7 17M7 7l10 10"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const calendarIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("z-1 size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
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

const pinIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("pointer-events-none absolute left-3 size-4 text-fg-quaternary"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([h.D("M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z")]),
      h.path([h.D("M12 22c4-4 8-7.582 8-12a8 8 0 1 0-16 0c0 4.418 4 8 8 12Z")]),
    ],
  );

const textField = <Message>(
  props: {
    readonly label: string;
    readonly leadingPin?: boolean;
    readonly messageForValue: (value: string) => Message;
    readonly name: string;
    readonly placeholder: string;
    readonly required?: boolean;
    readonly value: string;
  },
  h: HtmlBuilder<Message>,
): Html => {
  const id = `create-event-${props.name}`;
  return h.div(
    [h.Class("flex w-full flex-col gap-1.5")],
    [
      h.label(
        [h.Class("text-sm font-medium text-text-secondary"), h.For(id)],
        [
          props.label,
          ...(props.required === true
            ? [h.span([h.Class("text-text-brand-tertiary")], ["*"])]
            : []),
        ],
      ),
      h.div(
        [
          h.Class(
            "relative flex items-center rounded-lg bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset focus-within:ring-2 focus-within:ring-border-brand",
          ),
        ],
        [
          ...(props.leadingPin === true ? [pinIcon(h)] : []),
          h.input([
            h.Class(
              `min-w-0 flex-1 bg-transparent py-2 pr-3 text-sm text-text-primary outline-none placeholder:text-text-placeholder ${props.leadingPin === true ? "pl-9" : "pl-3"}`,
            ),
            h.Id(id),
            h.Name(props.name),
            h.OnInput(props.messageForValue),
            h.Placeholder(props.placeholder),
            h.Required(props.required === true),
            h.Type("text"),
            h.Value(props.value),
          ]),
        ],
      ),
    ],
  );
};

const dateTimeParts = (value: string, locale: CreateEventLocale): readonly string[] => {
  const [date = "", time = ""] = value.split("T");
  const [year = "", month = "", day = ""] = date.split("-");
  const [hourText = "0", minute = "00"] = time.split(":");
  const hour = Number(hourText);
  if (locale === "pt-BR") {
    return [
      String(Number(day)),
      " / ",
      String(Number(month)),
      " / ",
      year,
      " , ",
      hourText,
      " : ",
      minute,
    ];
  }
  const meridiem = hour >= 12 ? "PM" : "AM";
  const twelveHour = hour % 12 || 12;
  return [
    String(Number(month)),
    " / ",
    String(Number(day)),
    " / ",
    year,
    " , ",
    String(twelveHour),
    " : ",
    minute,
    " ",
    meridiem,
  ];
};

const padDatePart = (number: number): string => String(number).padStart(2, "0");

const adjustedDateTime = (
  value: string,
  locale: CreateEventLocale,
  segment: number,
  delta: -1 | 1,
): string => {
  const [date = "", time = ""] = value.split("T");
  const [yearText = "2027", monthText = "1", dayText = "1"] = date.split("-");
  const [hourText = "0", minuteText = "0"] = time.split(":");
  const values = {
    day: Number(dayText),
    hour: Number(hourText),
    minute: Number(minuteText),
    month: Number(monthText),
    year: Number(yearText),
  };
  const part =
    locale === "pt-BR"
      ? ["day", "month", "year", "hour", "minute"][segment]
      : ["month", "day", "year", "hour", "minute", "meridiem"][segment];
  if (part === "month") {
    values.month = ((values.month - 1 + delta + 12) % 12) + 1;
  }
  if (part === "day") {
    values.day = ((values.day - 1 + delta + 31) % 31) + 1;
  }
  if (part === "year") {
    values.year = Math.max(1, values.year + delta);
  }
  if (part === "hour") {
    values.hour = (values.hour + delta + 24) % 24;
  }
  if (part === "minute") {
    values.minute = (values.minute + delta + 60) % 60;
  }
  if (part === "meridiem") {
    values.hour = (values.hour + 12) % 24;
  }
  return `${String(values.year).padStart(4, "0")}-${padDatePart(values.month)}-${padDatePart(values.day)}T${padDatePart(values.hour)}:${padDatePart(values.minute)}`;
};

const dateTimeField = <Message>(
  props: {
    readonly label: string;
    readonly locale: CreateEventLocale;
    readonly messageForValue: (value: string) => Message;
    readonly name: string;
    readonly value: string;
  },
  h: HtmlBuilder<Message>,
): Html => {
  const id = `create-event-${props.name}`;
  return h.div(
    [h.Class("flex w-full flex-col gap-1.5")],
    [
      h.label(
        [h.Class("text-sm font-medium text-text-secondary"), h.For(id)],
        [props.label, h.span([h.Class("text-text-brand-tertiary")], ["*"])],
      ),
      h.div(
        [
          h.AriaLabel(props.label),
          h.Class(
            "flex w-full rounded-lg bg-bg-primary px-3 py-2 text-sm shadow-xs ring-1 ring-border-primary ring-inset outline-none focus-within:ring-2 focus-within:ring-border-brand",
          ),
          h.Id(id),
          h.Role("group"),
        ],
        dateTimeParts(props.value, props.locale).map((part, index) =>
          h.span(
            [
              h.Class(
                `rounded px-0.5 tabular-nums ${index % 2 === 0 ? "text-text-primary" : "text-fg-quaternary"}`,
              ),
              ...(index % 2 === 0
                ? [
                    h.Attribute("aria-label", `${props.label} segment ${String(index / 2 + 1)}`),
                    h.Attribute("aria-valuetext", part),
                    h.OnKeyDownPreventDefault((key) =>
                      key === "ArrowUp" || key === "ArrowDown"
                        ? Option.some(
                            props.messageForValue(
                              adjustedDateTime(
                                props.value,
                                props.locale,
                                index / 2,
                                key === "ArrowUp" ? 1 : -1,
                              ),
                            ),
                          )
                        : Option.none(),
                    ),
                    h.Role("spinbutton"),
                    h.Tabindex(0),
                  ]
                : [h.AriaHidden(true)]),
            ],
            [part],
          ),
        ),
      ),
    ],
  );
};

const presetsFor = (locale: CreateEventLocale): readonly RangeCalendarPreset[] =>
  copy[locale].presets.map((label, index) => {
    const values = [
      { end: "2027-01-03", start: "2026-12-28" },
      { end: "2026-12-31", start: "2026-12-01" },
      { end: "2026-12-31", start: "2026-01-01" },
    ] as const;
    return { label, value: values[index] ?? values[0] };
  });

export const createEventModal = <Message>(
  props: CreateEventModalProps<Message>,
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
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-[calc(100%-120.406px)] max-w-200 overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:w-[calc(100%-64px)] sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.button(
                    [
                      h.AriaLabel(localized.close),
                      h.Autofocus(true),
                      h.Class(
                        "absolute top-3 right-3 z-10 flex size-11 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.OnClick(props.onDismiss),
                      h.Type("button"),
                    ],
                    [closeIcon(h)],
                  ),
                  h.header(
                    [h.Class("flex gap-4 px-4 pt-5 sm:px-6 sm:pt-6")],
                    [
                      h.div(
                        [
                          h.Class(
                            "relative hidden size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset sm:flex",
                          ),
                        ],
                        [calendarIcon(h)],
                      ),
                      h.div(
                        [h.Class("z-1 flex flex-col gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            [localized.title],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary sm:hidden"), h.Id(descriptionId)],
                            [localized.subtitleMobile],
                          ),
                          h.p(
                            [
                              h.AriaHidden(true),
                              h.Class("hidden text-sm text-text-tertiary sm:block"),
                            ],
                            [localized.subtitleDesktop],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div(
                    [
                      h.Class(
                        "flex flex-col gap-5 border-t border-border-secondary px-4 md:flex-row md:gap-0 md:px-0",
                      ),
                    ],
                    [
                      h.div(
                        [
                          h.Class(
                            "hidden w-82 shrink-0 flex-col overflow-hidden border-r border-border-secondary md:flex [&_[data-range-calendar]>div]:px-6 [&_[data-range-calendar]>div]:py-5",
                          ),
                        ],
                        [
                          rangeCalendar(
                            {
                              focusedDate: props.focusedDate,
                              highlightedDates: [],
                              locale: props.locale,
                              month: props.month,
                              onFocusDate: props.messageForFocusDate,
                              onNextMonth: props.onNextMonth,
                              onPreset: props.messageForPreset,
                              onPreviousMonth: props.onPreviousMonth,
                              onSelectDate: props.messageForSelectDate,
                              presets: presetsFor(props.locale),
                              range: props.range,
                              showOutOfRangeDates: true,
                              showPresetsOnDesktop: true,
                              today: props.today,
                              visibleMonths: 1,
                              year: props.year,
                            },
                            h,
                          ),
                        ],
                      ),
                      h.div(
                        [h.Class("flex flex-1 flex-col gap-4 md:p-6")],
                        [
                          textField(
                            {
                              label: localized.titleField,
                              messageForValue: props.messageForTitle,
                              name: "title",
                              placeholder: localized.titlePlaceholder,
                              required: true,
                              value: props.title,
                            },
                            h,
                          ),
                          h.div(
                            [h.Class("grid grid-cols-1 gap-4 md:grid-cols-2")],
                            [
                              dateTimeField(
                                {
                                  label: localized.startDate,
                                  locale: props.locale,
                                  messageForValue: props.messageForStartDateTime,
                                  name: "start-date",
                                  value: props.startDateTime,
                                },
                                h,
                              ),
                              dateTimeField(
                                {
                                  label: localized.endDate,
                                  locale: props.locale,
                                  messageForValue: props.messageForEndDateTime,
                                  name: "end-date",
                                  value: props.endDateTime,
                                },
                                h,
                              ),
                            ],
                          ),
                          textField(
                            {
                              label: localized.location,
                              leadingPin: true,
                              messageForValue: props.messageForLocation,
                              name: "location",
                              placeholder: localized.locationPlaceholder,
                              value: props.location,
                            },
                            h,
                          ),
                          h.div(
                            [h.Class("[&_textarea]:h-[118px]")],
                            [
                              textarea(
                                {
                                  label: localized.description,
                                  name: "description",
                                  onInput: props.messageForDescription,
                                  placeholder: localized.descriptionPlaceholder,
                                  rows: 4,
                                  size: "sm",
                                  tooltip: localized.descriptionTooltip,
                                  value: props.description,
                                },
                                h,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.footer(
                    [
                      h.Class(
                        "z-1 flex flex-1 flex-col-reverse gap-3 border-t border-border-secondary p-4 pt-6 sm:flex-row sm:items-center sm:p-6",
                      ),
                    ],
                    [
                      h.div(
                        [h.Class("mr-auto hidden sm:block")],
                        [
                          checkbox(
                            {
                              isSelected: props.attendeesCanInvite,
                              label: localized.attendeeInvites,
                              name: "attendee-invites",
                              onToggle: props.onToggleAttendeeInvites,
                              size: "sm",
                            },
                            h,
                          ),
                        ],
                      ),
                      button(
                        {
                          color: "secondary",
                          label: localized.cancel,
                          onPress: props.onCancel,
                          size: "md",
                        },
                        h,
                      ),
                      button(
                        {
                          color: "primary",
                          label: localized.create,
                          onPress: props.onCreate,
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
