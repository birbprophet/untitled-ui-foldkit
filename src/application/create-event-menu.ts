/* oxlint-disable @rikalabs/no-low-signal-variable-names, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity -- The controlled native slideout preserves the authenticated localized event form and segmented date inputs. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { checkbox } from "../base/controls.ts";
import { input, textarea } from "../base/fields.ts";

export type CreateEventMenuLocale = "en-US" | "pt-BR";

export interface CreateEventMenuProps<Message> {
  readonly canInviteOthers: boolean;
  readonly canModifyEvent: boolean;
  readonly canSeeGuestList: boolean;
  readonly description: string;
  readonly endDateTime: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale: CreateEventMenuLocale;
  readonly location: string;
  readonly messageForDescription: (value: string) => NoInfer<Message>;
  readonly messageForEndDateTime: (value: string) => NoInfer<Message>;
  readonly messageForEndDateTimeDigit: (segment: number, digit: number) => NoInfer<Message>;
  readonly messageForEndDateTimeNavigation: (
    segment: number,
    direction: -1 | 1,
  ) => NoInfer<Message>;
  readonly messageForEndDateTimeSegmentFocus: (segment: number) => NoInfer<Message>;
  readonly messageForLocation: (value: string) => NoInfer<Message>;
  readonly messageForStartDateTime: (value: string) => NoInfer<Message>;
  readonly messageForStartDateTimeDigit: (segment: number, digit: number) => NoInfer<Message>;
  readonly messageForStartDateTimeNavigation: (
    segment: number,
    direction: -1 | 1,
  ) => NoInfer<Message>;
  readonly messageForStartDateTimeSegmentFocus: (segment: number) => NoInfer<Message>;
  readonly messageForTitle: (value: string) => NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onCreate: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onToggleInviteOthers: NoInfer<Message>;
  readonly onToggleModifyEvent: NoInfer<Message>;
  readonly onToggleSeeGuestList: NoInfer<Message>;
  readonly onUnmount: NoInfer<Message>;
  readonly startDateTime: string;
  readonly title: string;
}

const copy = {
  "en-US": {
    cancel: "Cancel",
    close: "Close",
    create: "Create event",
    dateRange: "Event date range",
    description: "Description",
    descriptionPlaceholder: "Enter a description",
    descriptionTooltip: "Add event details and agenda",
    endDate: "End date",
    guestPermissions: "Guest permissions",
    inviteOthers: "Invite others",
    location: "Location",
    locationPlaceholder: "Add location",
    modifyEvent: "Modify event",
    seeGuestList: "See guest list",
    slideout: "Slideout menu",
    startDate: "Start date",
    subtitle: "Add details to schedule your event.",
    title: "Create event",
    titleField: "Title",
    titlePlaceholder: "Event name",
  },
  "pt-BR": {
    cancel: "Cancelar",
    close: "Fechar",
    create: "Criar evento",
    dateRange: "Intervalo de datas do evento",
    description: "Descrição",
    descriptionPlaceholder: "Insira uma descrição",
    descriptionTooltip: "Adicione detalhes e a agenda do evento",
    endDate: "Data final",
    guestPermissions: "Permissões dos convidados",
    inviteOthers: "Convidar outras pessoas",
    location: "Local",
    locationPlaceholder: "Adicionar local",
    modifyEvent: "Modificar evento",
    seeGuestList: "Ver lista de convidados",
    slideout: "Menu lateral",
    startDate: "Data inicial",
    subtitle: "Adicione detalhes para agendar seu evento.",
    title: "Criar evento",
    titleField: "Título",
    titlePlaceholder: "Nome do evento",
  },
} as const;

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 transition-inherit-all"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
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
      h.Class("size-4 shrink-0 text-fg-quaternary"),
      h.DataAttribute("icon", ""),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2.25"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([h.D("M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z")]),
      h.path([h.D("M12 22c4-4 8-7.582 8-12a8 8 0 1 0-16 0c0 4.418 4 8 8 12Z")]),
    ],
  );

export const createEventDateTimeParts = (
  value: string,
  locale: CreateEventMenuLocale,
): readonly string[] => {
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
  return [
    String(Number(month)),
    " / ",
    String(Number(day)),
    " / ",
    year,
    " , ",
    String(hour % 12 || 12),
    " : ",
    minute,
    " ",
    meridiem,
  ];
};

const pad = (value: number): string => String(value).padStart(2, "0");

const dateSegmentConfig = {
  "en-US": [
    { label: "month", max: 12, min: 1 },
    { label: "day", max: 31, min: 1 },
    { label: "year", max: 9999, min: 1 },
    { label: "hour", max: 12, min: 1 },
    { label: "minute", max: 59, min: 0 },
    { label: "AM/PM", max: 1, min: 0 },
  ],
  "pt-BR": [
    { label: "dia", max: 31, min: 1 },
    { label: "mês", max: 12, min: 1 },
    { label: "ano", max: 9999, min: 1 },
    { label: "hora", max: 23, min: 0 },
    { label: "minuto", max: 59, min: 0 },
  ],
} as const;

const daysInMonth = (year: number, month: number): number => {
  if (month === 2) {
    return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0) ? 29 : 28;
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
};

const segmentKinds = {
  "en-US": ["month", "day", "year", "hour", "minute", "meridiem"],
  "pt-BR": ["day", "month", "year", "hour", "minute"],
} as const;

export interface CreateEventDateTimeInputResult {
  readonly enteredKeys: string;
  readonly focusNext: boolean;
  readonly value: string;
}

export const createEventDateTimeNavigationTarget = (
  locale: CreateEventMenuLocale,
  segment: number,
  direction: -1 | 1,
): number => Math.max(0, Math.min(segmentKinds[locale].length - 1, segment + direction));

export const inputCreateEventDateTimeSegment = (
  value: string,
  locale: CreateEventMenuLocale,
  segment: number,
  digit: number,
  enteredKeys: string,
): CreateEventDateTimeInputResult => {
  const kind = segmentKinds[locale][segment];
  if (kind === undefined || kind === "meridiem" || digit < 0 || digit > 9) {
    return { enteredKeys, focusNext: false, value };
  }
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
  let maximum = 59;
  if (kind === "day") {
    maximum = daysInMonth(values.year, values.month);
  } else if (kind === "month") {
    maximum = 12;
  } else if (kind === "year") {
    maximum = 9999;
  } else if (kind === "hour") {
    maximum = locale === "en-US" ? 12 : 23;
  }
  const minimum = kind === "day" || kind === "month" || kind === "year" ? 1 : 0;
  const nextEnteredKeys = `${enteredKeys}${String(digit)}`;
  const parsed = Number(nextEnteredKeys);
  const segmentValue = parsed > maximum ? digit : parsed;
  if (segmentValue >= minimum) {
    if (kind === "hour" && locale === "en-US") {
      const isPm = values.hour >= 12;
      if (segmentValue === 12) {
        values.hour = isPm ? 12 : 0;
      } else {
        values.hour = segmentValue + (isPm ? 12 : 0);
      }
    } else {
      values[kind] = segmentValue;
      if (kind === "month" || kind === "year") {
        values.day = Math.min(values.day, daysInMonth(values.year, values.month));
      }
    }
  }
  const focusNext = parsed * 10 > maximum || nextEnteredKeys.length >= String(maximum).length;
  return {
    enteredKeys: focusNext ? "" : nextEnteredKeys,
    focusNext,
    value: `${String(values.year).padStart(4, "0")}-${pad(values.month)}-${pad(values.day)}T${pad(values.hour)}:${pad(values.minute)}`,
  };
};

export const adjustCreateEventDateTime = (
  value: string,
  locale: CreateEventMenuLocale,
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
    values.day = Math.min(values.day, daysInMonth(values.year, values.month));
  }
  if (part === "day") {
    const maximumDay = daysInMonth(values.year, values.month);
    values.day = ((values.day - 1 + delta + maximumDay) % maximumDay) + 1;
  }
  if (part === "year") {
    values.year = Math.max(1, values.year + delta);
    values.day = Math.min(values.day, daysInMonth(values.year, values.month));
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
  return `${String(values.year).padStart(4, "0")}-${pad(values.month)}-${pad(values.day)}T${pad(values.hour)}:${pad(values.minute)}`;
};

const dateTimeField = <Message>(
  props: {
    readonly label: string;
    readonly locale: CreateEventMenuLocale;
    readonly messageForDigit: (segment: number, digit: number) => Message;
    readonly messageForNavigation: (segment: number, direction: -1 | 1) => Message;
    readonly messageForSegmentFocus: (segment: number) => Message;
    readonly messageForValue: (value: string) => Message;
    readonly name: string;
    readonly value: string;
  },
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("flex h-max w-full flex-col items-start justify-start gap-1.5")],
    [
      h.label(
        [h.Class("text-sm font-medium text-text-secondary"), h.For(props.name)],
        [props.label, h.span([h.Class("text-text-brand-tertiary")], [" *"])],
      ),
      h.div(
        [
          h.AriaLabel(props.label),
          h.AriaRequired(true),
          h.Class(
            "flex w-full rounded-lg bg-bg-primary px-3 py-2 text-sm shadow-xs ring-1 ring-border-primary ring-inset transition-shadow duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
          ),
          h.Id(props.name),
          h.Role("group"),
        ],
        createEventDateTimeParts(props.value, props.locale).map((part, index) => {
          const segment = index % 2 === 0 ? dateSegmentConfig[props.locale][index / 2] : undefined;
          const numericPart = Number(part);
          const valueNow = Number.isNaN(numericPart) ? Number(part === "PM") : numericPart;
          return h.span(
            [
              h.Class(
                `rounded px-0.5 tabular-nums ${segment === undefined ? "text-fg-quaternary" : "text-text-primary focus:bg-bg-brand-solid focus:font-medium focus:text-white focus:outline-hidden"}`,
              ),
              ...(segment === undefined
                ? [h.AriaHidden(true)]
                : [
                    h.Attribute("aria-label", `${props.label}, ${segment.label}`),
                    h.Attribute("aria-valuemax", String(segment.max)),
                    h.Attribute("aria-valuemin", String(segment.min)),
                    h.Attribute("aria-valuenow", String(valueNow)),
                    h.Attribute("aria-valuetext", part),
                    h.Id(`${props.name}-segment-${String(index / 2)}`),
                    h.InputMode(segment.label === "AM/PM" ? "text" : "numeric"),
                    h.OnFocus(props.messageForSegmentFocus(index / 2)),
                    h.OnKeyDownPreventDefault((key) => {
                      if (key === "ArrowUp" || key === "ArrowDown") {
                        return Option.some(
                          props.messageForValue(
                            adjustCreateEventDateTime(
                              props.value,
                              props.locale,
                              index / 2,
                              key === "ArrowUp" ? 1 : -1,
                            ),
                          ),
                        );
                      }
                      if (key === "ArrowLeft" || key === "ArrowRight") {
                        return Option.some(
                          props.messageForNavigation(index / 2, key === "ArrowLeft" ? -1 : 1),
                        );
                      }
                      if (/^\d$/u.test(key)) {
                        return Option.some(props.messageForDigit(index / 2, Number(key)));
                      }
                      return Option.none();
                    }),
                    h.Role("spinbutton"),
                    h.Tabindex(0),
                  ]),
            ],
            [part],
          );
        }),
      ),
    ],
  );

export const createEventMenu = <Message>(
  props: CreateEventMenuProps<Message>,
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
                "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-end bg-overlay/70 pl-6 outline-hidden md:pl-10",
              ),
              h.DataAttribute("slideout-overlay", props.id),
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
                  h.AriaLabel(text.slideout),
                  h.Dir("ltr"),
                  h.Class(
                    "fixed inset-y-0 !right-0 !left-auto m-0 h-full w-[calc(100%-24px)] max-w-100 overflow-hidden border-0 bg-bg-primary p-0 shadow-xl ring-1 ring-border-secondary-alt outline-hidden",
                  ),
                  h.Id(props.id),
                  h.Lang(props.locale),
                  h.OnCancel(props.onDismiss),
                  h.OnUnmount(props.onUnmount),
                  h.Style({ width: "calc(100% - 24px)" }),
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
                        [h.Class("relative z-1 flex w-full items-start gap-3 px-4 pt-6 md:px-6")],
                        [
                          h.div(
                            [
                              h.Class(
                                "relative hidden size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset md:flex",
                              ),
                              h.DataAttribute("featured-icon", ""),
                            ],
                            [calendarIcon(h)],
                          ),
                          h.section(
                            [h.Class("flex flex-col gap-0.5")],
                            [
                              h.h1(
                                [
                                  h.Class("text-md font-semibold text-text-primary md:text-lg"),
                                  h.Id(titleId),
                                ],
                                [text.title],
                              ),
                              h.p(
                                [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                                [text.subtitle],
                              ),
                            ],
                          ),
                          h.button(
                            [
                              h.AriaLabel(text.close),
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary transition duration-100 ease-linear outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("create-event-close", ""),
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
                            [h.Class("flex flex-col gap-4")],
                            [
                              input(
                                {
                                  isRequired: true,
                                  label: text.titleField,
                                  name: `${props.id}-title-field`,
                                  onInput: props.messageForTitle,
                                  placeholder: text.titlePlaceholder,
                                  size: "sm",
                                  value: props.title,
                                },
                                h,
                              ),
                              h.div(
                                [h.AriaLabel(text.dateRange), h.Class("contents"), h.Role("group")],
                                [
                                  dateTimeField(
                                    {
                                      label: text.startDate,
                                      locale: props.locale,
                                      messageForDigit: props.messageForStartDateTimeDigit,
                                      messageForNavigation: props.messageForStartDateTimeNavigation,
                                      messageForSegmentFocus:
                                        props.messageForStartDateTimeSegmentFocus,
                                      messageForValue: props.messageForStartDateTime,
                                      name: `${props.id}-start-date`,
                                      value: props.startDateTime,
                                    },
                                    h,
                                  ),
                                  dateTimeField(
                                    {
                                      label: text.endDate,
                                      locale: props.locale,
                                      messageForDigit: props.messageForEndDateTimeDigit,
                                      messageForNavigation: props.messageForEndDateTimeNavigation,
                                      messageForSegmentFocus:
                                        props.messageForEndDateTimeSegmentFocus,
                                      messageForValue: props.messageForEndDateTime,
                                      name: `${props.id}-end-date`,
                                      value: props.endDateTime,
                                    },
                                    h,
                                  ),
                                ],
                              ),
                              input(
                                {
                                  label: text.location,
                                  leadingIconElement: pinIcon(h),
                                  name: `${props.id}-location`,
                                  onInput: props.messageForLocation,
                                  placeholder: text.locationPlaceholder,
                                  size: "sm",
                                  value: props.location,
                                },
                                h,
                              ),
                              textarea(
                                {
                                  label: text.description,
                                  name: `${props.id}-description-field`,
                                  onInput: props.messageForDescription,
                                  placeholder: text.descriptionPlaceholder,
                                  size: "sm",
                                  textAreaClassName: "h-29.5",
                                  tooltip: text.descriptionTooltip,
                                  value: props.description,
                                },
                                h,
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
                            [h.Class("flex flex-col gap-3")],
                            [
                              h.p(
                                [h.Class("text-sm font-medium text-text-secondary")],
                                [text.guestPermissions],
                              ),
                              h.div(
                                [h.Class("flex flex-col gap-3 pl-3")],
                                [
                                  checkbox(
                                    {
                                      isSelected: props.canModifyEvent,
                                      label: text.modifyEvent,
                                      name: `${props.id}-modify-event`,
                                      onToggle: props.onToggleModifyEvent,
                                    },
                                    h,
                                  ),
                                  checkbox(
                                    {
                                      isSelected: props.canInviteOthers,
                                      label: text.inviteOthers,
                                      name: `${props.id}-invite-others`,
                                      onToggle: props.onToggleInviteOthers,
                                    },
                                    h,
                                  ),
                                  checkbox(
                                    {
                                      isSelected: props.canSeeGuestList,
                                      label: text.seeGuestList,
                                      name: `${props.id}-see-guest-list`,
                                      onToggle: props.onToggleSeeGuestList,
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
                            "flex w-full items-center justify-end gap-3 p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6",
                          ),
                        ],
                        [
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
                              label: text.create,
                              onPress: props.onCreate,
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
