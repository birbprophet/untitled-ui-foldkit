/* oxlint-disable @rikalabs/no-low-signal-variable-names, @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, mps/no-length-comparison, mps/prefer-arr-match, mps/prefer-option-over-null -- The seven-column date grid and locale branches mirror the authenticated React Aria calendar anatomy; optional controlled values stay aligned with the public renderer contract. */
import * as Option from "effect/Option";
import * as Calendar from "foldkit/calendar";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export type CalendarLocale = "en-US" | "pt-BR";

export interface DatePickerCalendarProps<Message> {
  readonly focusedDate: string;
  readonly highlightedDates?: readonly string[];
  readonly locale?: CalendarLocale;
  readonly month: number;
  readonly onFocusDate: (date: string) => NoInfer<Message>;
  readonly onNextMonth: NoInfer<Message>;
  readonly onPreviousMonth: NoInfer<Message>;
  readonly onSelectDate: (date: string) => NoInfer<Message>;
  readonly onToday: NoInfer<Message>;
  readonly selectedDate?: string;
  readonly today: string;
  readonly year: number;
}

const ptBrLocale: Calendar.LocaleConfig = {
  dayNames: [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ],
  firstDayOfWeek: "Monday",
  monthNames: [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ],
  shortDayNames: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
  shortMonthNames: [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ],
};

export const calendarLocaleConfig = (locale: CalendarLocale): Calendar.LocaleConfig =>
  locale === "pt-BR" ? ptBrLocale : Calendar.defaultEnglishLocale;

export const calendarIso = (date: Calendar.CalendarDate): string =>
  `${String(date.year).padStart(4, "0")}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;

export const calendarChevron = <Message>(
  direction: "left" | "right",
  h: HtmlBuilder<Message>,
): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D(direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6")])],
  );

const navigationButton = <Message>(
  label: string,
  direction: "left" | "right",
  message: Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.AriaLabel(label),
      h.Class(
        "inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-sm leading-5 text-fg-tertiary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.OnClick(message),
      h.Type("button"),
    ],
    [calendarChevron(direction, h)],
  );

export const calendarWeekdayNames = (locale: Calendar.LocaleConfig): readonly string[] => {
  const offset = locale.shortDayNames.indexOf(
    locale.firstDayOfWeek === "Monday" ? locale.shortDayNames[1] : locale.shortDayNames[0],
  );
  return [...locale.shortDayNames.slice(offset), ...locale.shortDayNames.slice(0, offset)];
};

export const calendarVisibleDates = (
  year: number,
  month: number,
  locale: Calendar.LocaleConfig,
): readonly Calendar.CalendarDate[] => {
  const first = Calendar.firstOfMonth(Calendar.make(year, month, 1));
  const start = Calendar.startOfWeek(first, locale.firstDayOfWeek);
  const last = Calendar.lastOfMonth(first);
  const end = Calendar.endOfWeek(last, locale.firstDayOfWeek);
  return Array.from({ length: Calendar.daysUntil(start, end) + 1 }, (_, index) =>
    Calendar.addDays(start, index),
  );
};

const dateInput = <Message>(
  selectedDate: string | undefined,
  locale: CalendarLocale,
  h: HtmlBuilder<Message>,
): Html => {
  const placeholder = locale === "pt-BR" ? "DD / MM / AAAA" : "MM / DD / YYYY";
  const selectedParts = selectedDate?.split("-");
  const selectedValue =
    selectedParts === undefined
      ? placeholder
      : locale === "pt-BR"
        ? [selectedParts[2], selectedParts[1], selectedParts[0]].join(" / ")
        : [selectedParts[1], selectedParts[2], selectedParts[0]].join(" / ");
  const value = selectedDate === undefined ? placeholder : selectedValue;
  return h.div(
    [
      h.AriaLabel(locale === "pt-BR" ? "Data" : "Date"),
      h.Class(
        "flex flex-1 rounded-lg bg-bg-primary px-3 py-2 text-sm text-text-primary shadow-xs ring-1 ring-border-primary ring-inset focus-within:ring-2 focus-within:ring-border-brand",
      ),
      h.Role("group"),
    ],
    [
      h.span(
        [h.Class(selectedDate === undefined ? "text-text-placeholder" : "tabular-nums")],
        [value],
      ),
    ],
  );
};

const moveDate = <Message>(
  props: DatePickerCalendarProps<Message>,
  current: Calendar.CalendarDate,
  key: string,
) => {
  const delta =
    key === "ArrowLeft"
      ? -1
      : key === "ArrowRight"
        ? 1
        : key === "ArrowUp"
          ? -7
          : key === "ArrowDown"
            ? 7
            : 0;
  if (delta === 0) {
    return Option.none();
  }
  const next = calendarIso(Calendar.addDays(current, delta));
  return Option.some({
    focusSelector: `[data-calendar-date="${next}"]`,
    message: props.onFocusDate(next),
  });
};

export const datePickerCalendar = <Message>(
  props: DatePickerCalendarProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const activeLocale = props.locale ?? "en-US";
  const locale = calendarLocaleConfig(activeLocale);
  const dates = calendarVisibleDates(props.year, props.month, locale);
  const weeks = Array.from({ length: dates.length / 7 }, (_, index) =>
    dates.slice(index * 7, index * 7 + 7),
  );
  const highlighted = props.highlightedDates ?? [props.today];
  return h.div(
    [h.Class("flex flex-col gap-3"), h.DataAttribute("date-picker-calendar", "")],
    [
      h.header(
        [h.Class("flex items-center justify-between")],
        [
          navigationButton(
            activeLocale === "pt-BR" ? "Mês anterior" : "Previous month",
            "left",
            props.onPreviousMonth,
            h,
          ),
          h.h2(
            [h.Class("text-sm font-semibold text-fg-secondary")],
            [`${locale.monthNames[props.month - 1]} ${String(props.year)}`],
          ),
          navigationButton(
            activeLocale === "pt-BR" ? "Próximo mês" : "Next month",
            "right",
            props.onNextMonth,
            h,
          ),
        ],
      ),
      h.div(
        [h.Class("flex gap-3")],
        [
          dateInput(props.selectedDate, activeLocale, h),
          button(
            {
              color: "secondary",
              label: activeLocale === "pt-BR" ? "Hoje" : "Today",
              onPress: props.onToday,
              size: "sm",
            },
            h,
          ),
        ],
      ),
      h.table(
        [
          h.AriaLabel(activeLocale === "pt-BR" ? "Calendário" : "Calendar"),
          h.Class("w-max border-collapse"),
          h.Role("grid"),
        ],
        [
          h.thead(
            [],
            [
              h.tr(
                [],
                calendarWeekdayNames(locale).map((day) =>
                  h.th(
                    [h.Class("border-b-4 border-transparent p-0"), h.Scope("col")],
                    [
                      h.div(
                        [
                          h.Class(
                            "flex size-10 items-center justify-center text-sm font-medium text-text-secondary",
                          ),
                        ],
                        [day.slice(0, 2)],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          h.tbody(
            [],
            weeks.map((week) =>
              h.tr(
                [h.Class("h-11 border-b-4 border-transparent last:h-[42px] last:border-none")],
                week.map((date) => {
                  const value = calendarIso(date);
                  const selected = value === props.selectedDate;
                  const today = value === props.today;
                  const outside = date.month !== props.month;
                  const focused = value === props.focusedDate;
                  return h.td(
                    [
                      h.AriaLabel(Calendar.formatAriaLabel(date, locale)),
                      h.AriaSelected(selected),
                      h.Class(
                        `relative size-10 p-0 focus:outline-hidden ${outside ? "opacity-50" : ""}`,
                      ),
                      h.DataAttribute("calendar-date", value),
                      h.OnClick(props.onSelectDate(value)),
                      h.OnKeyDownFocus((key) => moveDate(props, date, key)),
                      h.Role("gridcell"),
                      h.Tabindex(focused ? 0 : -1),
                    ],
                    [
                      h.div(
                        [
                          h.Class(
                            `relative flex size-10 items-center justify-center rounded-full text-sm text-text-secondary outline-focus-ring hover:bg-bg-primary-hover hover:font-medium hover:text-text-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 ${selected ? "bg-bg-brand-solid font-medium text-white hover:bg-bg-brand-solid-hover hover:text-white" : today ? "bg-bg-secondary font-medium hover:bg-bg-secondary-hover" : ""}`,
                          ),
                        ],
                        [
                          String(date.day),
                          ...(highlighted.includes(value)
                            ? [
                                h.span([
                                  h.Class(
                                    `absolute bottom-1 left-1/2 size-1.25 -translate-x-1/2 rounded-full ${selected ? "bg-fg-white" : "bg-fg-brand-primary"}`,
                                  ),
                                ]),
                              ]
                            : []),
                        ],
                      ),
                    ],
                  );
                }),
              ),
            ),
          ),
        ],
      ),
    ],
  );
};
