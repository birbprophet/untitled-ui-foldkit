/* oxlint-disable @rikalabs/no-low-signal-variable-names, @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, mps/no-length-comparison, mps/prefer-arr-match, mps/prefer-option-over-null -- The repeated seven-column grids and segmented placeholder fields preserve the authenticated responsive range-calendar anatomy. */
import * as Option from "effect/Option";
import * as Calendar from "foldkit/calendar";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import {
  calendarChevron,
  calendarIso,
  calendarLocaleConfig,
  calendarVisibleDates,
  calendarWeekdayNames,
} from "./date-picker-calendar.ts";
import type { CalendarLocale } from "./date-picker-calendar.ts";

export interface DateRangeValue {
  readonly end: string;
  readonly start: string;
}

export interface RangeCalendarPreset {
  readonly label: string;
  readonly value: DateRangeValue;
}

export interface RangeCalendarProps<Message> {
  readonly compactMobile?: boolean;
  readonly focusedDate: string;
  readonly highlightedDates?: readonly string[];
  readonly locale?: CalendarLocale;
  readonly month: number;
  readonly onFocusDate: (date: string) => NoInfer<Message>;
  readonly onNextMonth: NoInfer<Message>;
  readonly onPreset?: (value: DateRangeValue) => NoInfer<Message>;
  readonly onPreviousMonth: NoInfer<Message>;
  readonly onSelectDate: (date: string) => NoInfer<Message>;
  readonly presets?: readonly RangeCalendarPreset[];
  readonly range?: DateRangeValue;
  readonly showOutOfRangeDates?: boolean;
  readonly showFocusRing?: boolean;
  readonly showPresetsOnDesktop?: boolean;
  readonly today: string;
  readonly visibleMonths?: 1 | 2;
  readonly year: number;
}

const monthAfter = (year: number, month: number): readonly [number, number] =>
  month === 12 ? [year + 1, 1] : [year, month + 1];

const localizedAriaLabel = (date: Calendar.CalendarDate, locale: Calendar.LocaleConfig): string => {
  const dayIndex = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ].indexOf(Calendar.dayOfWeek(date));
  return `${locale.dayNames[dayIndex]}, ${String(date.day)} de ${locale.monthNames[date.month - 1]} de ${String(date.year)}`;
};

const navigation = <Message>(
  label: string,
  direction: "left" | "right",
  message: Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.AriaLabel(label),
      h.Class(
        "inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-sm leading-5 text-text-tertiary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.OnClick(message),
      h.Type("button"),
    ],
    [calendarChevron(direction, h)],
  );

const mobileDateField = <Message>(
  value: string | undefined,
  label: string,
  locale: CalendarLocale,
  h: HtmlBuilder<Message>,
): Html => {
  const [year = "", month = "", day = ""] = value?.split("-") ?? [];
  const first = locale === "pt-BR" ? day : month;
  const second = locale === "pt-BR" ? month : day;
  const segment = (text: string, placeholder: string) =>
    h.span(
      [
        h.Class(
          `rounded px-0.5 tabular-nums ${text === "" ? "text-text-placeholder uppercase" : "text-text-primary"}`,
        ),
      ],
      [text || placeholder],
    );
  return h.div(
    [
      h.AriaLabel(label),
      h.Class(
        "relative flex min-w-[137px] flex-1 flex-row place-content-center place-items-center rounded-lg bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset",
      ),
      h.Role("group"),
    ],
    [
      h.div(
        [h.Class("flex w-full px-3 py-2 text-sm")],
        [
          segment(first, locale === "pt-BR" ? "DD" : "MM"),
          h.span([h.Class("rounded px-0.5 tabular-nums text-text-quaternary")], [" / "]),
          segment(second, locale === "pt-BR" ? "MM" : "DD"),
          h.span([h.Class("rounded px-0.5 tabular-nums text-text-quaternary")], [" / "]),
          segment(year, locale === "pt-BR" ? "AAAA" : "YYYY"),
        ],
      ),
    ],
  );
};

const moveDate = <Message>(
  props: RangeCalendarProps<Message>,
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
    focusSelector: `[data-range-date="${next}"]`,
    message: props.onFocusDate(next),
  });
};

const mobilePresetList = <Message>(
  presets: readonly RangeCalendarPreset[],
  onPreset: (value: DateRangeValue) => Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("mt-1 flex justify-between gap-3 px-2 md:hidden")],
    presets.map((preset) =>
      button(
        {
          color: "link-color",
          label: preset.label,
          onPress: onPreset(preset.value),
          size: "sm",
        },
        h,
      ),
    ),
  );

const desktopPresetList = <Message>(
  presets: readonly RangeCalendarPreset[],
  onPreset: (value: DateRangeValue) => Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("mt-1 hidden justify-between gap-3 px-2 md:flex")],
    presets.map((preset) =>
      button(
        {
          color: "link-color",
          label: preset.label,
          onPress: onPreset(preset.value),
          size: "sm",
        },
        h,
      ),
    ),
  );

const monthGrid = <Message>(
  props: RangeCalendarProps<Message>,
  year: number,
  month: number,
  h: HtmlBuilder<Message>,
): Html => {
  const locale = calendarLocaleConfig(props.locale ?? "en-US");
  const dates = calendarVisibleDates(year, month, locale);
  const weeks = Array.from({ length: dates.length / 7 }, (_, index) =>
    dates.slice(index * 7, index * 7 + 7),
  );
  const highlighted = props.highlightedDates ?? [props.today];
  return h.table(
    [
      h.AriaLabel(`${locale.monthNames[month - 1]} ${String(year)}`),
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
                    [day.slice(0, props.locale === "pt-BR" ? 3 : 2)],
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
            week.map((date, dayIndex) => {
              const value = calendarIso(date);
              const outside = date.month !== month;
              const hidden = outside && props.showOutOfRangeDates !== true;
              const start = value === props.range?.start;
              const end = value === props.range?.end;
              const selected =
                props.range !== undefined && value >= props.range.start && value <= props.range.end;
              const rangeStartsRow = selected && (start || dayIndex === 0);
              const rangeEndsRow = selected && (end || dayIndex === 6);
              const focused = value === props.focusedDate;
              const today = value === props.today;
              return h.td(
                [
                  h.AriaLabel(
                    props.locale === "pt-BR"
                      ? localizedAriaLabel(date, locale)
                      : Calendar.formatAriaLabel(date, locale),
                  ),
                  h.AriaSelected(selected),
                  h.Class(
                    `relative size-10 p-0 focus:outline-hidden ${hidden ? "invisible" : outside ? "opacity-50" : ""} ${selected ? "bg-bg-secondary" : ""} ${rangeStartsRow ? "rounded-l-full" : ""} ${rangeEndsRow ? "rounded-r-full" : ""}`,
                  ),
                  h.DataAttribute("range-date", value),
                  h.OnClick(props.onSelectDate(value)),
                  h.OnKeyDownFocus((key) => moveDate(props, date, key)),
                  h.Role("gridcell"),
                  h.Tabindex(focused ? 0 : -1),
                ],
                [
                  h.div(
                    [
                      h.Class(
                        `relative flex size-10 items-center justify-center rounded-full text-sm text-text-secondary outline-focus-ring hover:text-text-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 ${focused && props.showFocusRing === true ? "z-10 outline-2 outline-offset-2" : ""} ${start || end ? "bg-bg-brand-solid font-medium text-white hover:bg-bg-brand-solid-hover hover:text-white" : selected ? "font-medium" : today ? "bg-bg-secondary font-medium hover:bg-bg-secondary-hover" : "hover:bg-bg-primary-hover hover:font-medium"}`,
                      ),
                    ],
                    [
                      String(date.day),
                      ...(highlighted.includes(value)
                        ? [
                            h.span([
                              h.Class(
                                `absolute bottom-1 left-1/2 size-1.25 -translate-x-1/2 rounded-full ${start || end ? "bg-fg-white" : "bg-fg-brand-primary"}`,
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
  );
};

const panel = <Message>(
  props: RangeCalendarProps<Message>,
  year: number,
  month: number,
  part: "first" | "second",
  h: HtmlBuilder<Message>,
): Html => {
  const locale = calendarLocaleConfig(props.locale ?? "en-US");
  const twoMonths = (props.visibleMonths ?? 2) === 2;
  const previousLabel = props.locale === "pt-BR" ? "Mês anterior" : "Previous month";
  const nextLabel = props.locale === "pt-BR" ? "Próximo mês" : "Next month";
  return h.div(
    [
      h.Class(
        `flex flex-col px-6 py-5 ${part === "second" ? "hidden gap-3 border-l border-border-secondary md:flex" : "gap-3 md:gap-2"}`,
      ),
    ],
    [
      h.header(
        [
          h.Class(
            `relative flex items-center ${part === "second" ? "justify-end" : twoMonths ? "justify-between md:justify-start" : "justify-between"}`,
          ),
        ],
        [
          ...(part === "first"
            ? [navigation(previousLabel, "left", props.onPreviousMonth, h)]
            : []),
          h.h2(
            [
              h.Class(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-fg-secondary",
              ),
            ],
            [`${locale.monthNames[month - 1]} ${String(year)}`],
          ),
          ...(!twoMonths || part === "second"
            ? [navigation(nextLabel, "right", props.onNextMonth, h)]
            : [
                h.div(
                  [h.Class("md:hidden")],
                  [navigation(nextLabel, "right", props.onNextMonth, h)],
                ),
              ]),
        ],
      ),
      ...(part === "first" &&
      props.showPresetsOnDesktop === true &&
      props.presets !== undefined &&
      props.onPreset !== undefined
        ? [desktopPresetList(props.presets, props.onPreset, h)]
        : []),
      ...(part === "first"
        ? [
            h.div(
              [
                h.Class(
                  `flex items-center gap-2 md:hidden ${props.compactMobile === true ? "w-[280px]" : "w-[299px]"}`,
                ),
              ],
              [
                mobileDateField(
                  props.range?.start,
                  props.locale === "pt-BR" ? "Data inicial" : "Start date",
                  props.locale ?? "en-US",
                  h,
                ),
                h.div([h.Class("text-md text-text-quaternary")], ["–"]),
                mobileDateField(
                  props.range?.end,
                  props.locale === "pt-BR" ? "Data final" : "End date",
                  props.locale ?? "en-US",
                  h,
                ),
              ],
            ),
            ...(props.presets !== undefined && props.onPreset !== undefined
              ? [mobilePresetList(props.presets, props.onPreset, h)]
              : []),
          ]
        : []),
      monthGrid(props, year, month, h),
    ],
  );
};

export const rangeCalendar = <Message>(
  props: RangeCalendarProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const [nextYear, nextMonth] = monthAfter(props.year, props.month);
  const twoMonths = (props.visibleMonths ?? 2) === 2;
  return h.div(
    [h.Class("flex items-start"), h.DataAttribute("range-calendar", "")],
    [
      panel(props, props.year, props.month, "first", h),
      ...(twoMonths ? [panel(props, nextYear, nextMonth, "second", h)] : []),
    ],
  );
};
