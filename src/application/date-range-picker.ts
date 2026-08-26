/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, mps/prefer-arr-match, mps/prefer-option-over-null -- The controlled composition mirrors the authenticated preset rail, two-month range calendar, date fields, and action footer. */
import * as Option from "effect/Option";
import * as Calendar from "foldkit/calendar";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import type { ButtonSize } from "../base/button.ts";
import { calendarLocaleConfig } from "./date-picker-calendar.ts";
import type { CalendarLocale } from "./date-picker-calendar.ts";
import { rangeCalendar } from "./range-calendar.ts";
import type { DateRangeValue, RangeCalendarPreset } from "./range-calendar.ts";
import { rangePreset } from "./range-preset.ts";

export interface DateRangePickerProps<Message> {
  readonly focusedDate: string;
  readonly highlightedDates?: readonly string[];
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale?: CalendarLocale;
  readonly month: number;
  readonly onApply: NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onFocusDate: (date: string) => NoInfer<Message>;
  readonly onNextMonth: NoInfer<Message>;
  readonly onOpen: NoInfer<Message>;
  readonly onPreset: (value: DateRangeValue) => NoInfer<Message>;
  readonly onPreviousMonth: NoInfer<Message>;
  readonly onSelectDate: (date: string) => NoInfer<Message>;
  readonly presets: readonly RangeCalendarPreset[];
  readonly range?: DateRangeValue;
  readonly size?: ButtonSize;
  readonly today: string;
  readonly visibleMonths?: 1 | 2;
  readonly year: number;
}

const calendarIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5"),
      h.DataAttribute("icon", "calendar"),
      h.Fill("none"),
      h.ViewBox("0 0 20 20"),
    ],
    [
      h.path([
        h.D(
          "M6.667 1.667v2.5m6.666-2.5v2.5M2.917 7.083h14.166M5.667 17.5h8.666c.934 0 1.401 0 1.758-.182.314-.16.569-.415.729-.729.18-.356.18-.823.18-1.756V6.167c0-.934 0-1.401-.18-1.758a1.667 1.667 0 0 0-.73-.729c-.356-.18-.823-.18-1.757-.18H5.667c-.934 0-1.401 0-1.758.18-.314.16-.569.415-.729.73C3 4.765 3 5.232 3 6.166v8.666c0 .934 0 1.401.18 1.758.16.314.415.569.73.729.356.18.823.18 1.757.18Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const formatted = (date: string, locale: CalendarLocale): string => {
  const [year = 0, month = 1, day = 1] = date.split("-").map(Number);
  const value = Calendar.make(year, month, day);
  if (locale === "pt-BR") {
    return `${String(day)} de ${calendarLocaleConfig(locale).shortMonthNames[month - 1]} de ${String(year)}`;
  }
  return Calendar.formatShort(value, calendarLocaleConfig(locale));
};

const dateField = <Message>(
  date: string | undefined,
  label: string,
  locale: CalendarLocale,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.AriaLabel(label),
      h.Class(
        "flex w-36 rounded-lg bg-bg-primary px-3 py-2 text-sm text-text-primary shadow-xs ring-1 ring-border-primary ring-inset",
      ),
      h.Role("group"),
    ],
    [
      h.span(
        [h.Class(date === undefined ? "text-text-placeholder" : "tabular-nums")],
        [
          date === undefined
            ? locale === "pt-BR"
              ? "DD / MM / AAAA"
              : "MM / DD / YYYY"
            : formatted(date, locale),
        ],
      ),
    ],
  );

export const dateRangePicker = <Message>(
  props: DateRangePickerProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const locale = props.locale ?? "en-US";
  const anchor = `--${props.id}-trigger`;
  const selectedLabel =
    props.range === undefined
      ? locale === "pt-BR"
        ? "Selecionar datas"
        : "Select dates"
      : `${formatted(props.range.start, locale)} – ${formatted(props.range.end, locale)}`;
  return h.div(
    [
      h.Class("relative inline-flex flex-col items-end"),
      h.DataAttribute("date-range-picker", ""),
      h.Style({ "anchor-name": anchor }),
    ],
    [
      button(
        {
          color: "secondary",
          iconLeadingElement: calendarIcon(h),
          label: selectedLabel,
          onPress: props.onOpen,
          size: props.size ?? "sm",
        },
        h,
      ),
      ...(props.isOpen
        ? [
            h.div(
              [
                h.AriaLabel(locale === "pt-BR" ? "Seletor de intervalo" : "Date range picker"),
                h.Class(
                  "fixed z-50 flex overflow-hidden rounded-2xl bg-bg-primary shadow-xl ring-1 ring-border-secondary-alt focus:outline-hidden",
                ),
                h.Id(`${props.id}-dialog`),
                h.OnKeyDownPreventDefault((key) =>
                  key === "Escape" ? Option.some(props.onCancel) : Option.none(),
                ),
                h.Role("dialog"),
                h.Style({
                  "position-anchor": anchor,
                  right: "var(--date-picker-inset, 2rem)",
                  top: "calc(anchor(bottom) + 0.5rem)",
                }),
              ],
              [
                h.div(
                  [
                    h.Class(
                      "hidden w-38 flex-col gap-0.5 border-r border-border-secondary p-3 lg:flex",
                    ),
                  ],
                  props.presets.map((preset) =>
                    rangePreset(
                      {
                        isSelected:
                          props.range?.start === preset.value.start &&
                          props.range.end === preset.value.end,
                        label: preset.label,
                        onPress: props.onPreset(preset.value),
                      },
                      h,
                    ),
                  ),
                ),
                h.div(
                  [h.Class("flex flex-col")],
                  [
                    rangeCalendar(
                      {
                        focusedDate: props.focusedDate,
                        highlightedDates: props.highlightedDates,
                        locale,
                        month: props.month,
                        onFocusDate: props.onFocusDate,
                        onNextMonth: props.onNextMonth,
                        onPreset: props.onPreset,
                        onPreviousMonth: props.onPreviousMonth,
                        onSelectDate: props.onSelectDate,
                        presets: props.presets.filter(
                          (_preset, index) => index === 3 || index === 5 || index === 7,
                        ),
                        range: props.range,
                        showFocusRing: true,
                        today: props.today,
                        visibleMonths: props.visibleMonths,
                        year: props.year,
                      },
                      h,
                    ),
                    h.div(
                      [h.Class("flex justify-between gap-3 border-t border-border-secondary p-4")],
                      [
                        h.div(
                          [h.Class("hidden items-center gap-2 md:flex")],
                          [
                            dateField(
                              props.range?.start,
                              locale === "pt-BR" ? "Data inicial" : "Start date",
                              locale,
                              h,
                            ),
                            h.div([h.Class("text-md text-text-quaternary")], ["–"]),
                            dateField(
                              props.range?.end,
                              locale === "pt-BR" ? "Data final" : "End date",
                              locale,
                              h,
                            ),
                          ],
                        ),
                        h.div(
                          [h.Class("grid w-full grid-cols-2 gap-3 md:flex md:w-auto")],
                          [
                            button(
                              {
                                color: "secondary",
                                label: locale === "pt-BR" ? "Cancelar" : "Cancel",
                                onPress: props.onCancel,
                                size: "sm",
                              },
                              h,
                            ),
                            button(
                              {
                                color: "primary",
                                label: locale === "pt-BR" ? "Aplicar" : "Apply",
                                onPress: props.onApply,
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
        : []),
    ],
  );
};
