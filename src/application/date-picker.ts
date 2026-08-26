/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/prefer-option-over-null -- The controlled wrapper preserves the upstream trigger, anchored dialog, calendar, and action footer. */
import * as Option from "effect/Option";
import * as Calendar from "foldkit/calendar";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import type { ButtonSize } from "../base/button.ts";
import { calendarLocaleConfig, datePickerCalendar } from "./date-picker-calendar.ts";
import type { CalendarLocale, DatePickerCalendarProps } from "./date-picker-calendar.ts";

export interface DatePickerProps<Message> extends Omit<
  DatePickerCalendarProps<Message>,
  "locale" | "selectedDate"
> {
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale?: CalendarLocale;
  readonly onApply: NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onOpen: NoInfer<Message>;
  readonly selectedDate?: string;
  readonly size?: ButtonSize;
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
          "M6.667 1.667v2.5m6.666-2.5v2.5M2.917 7.083h14.166M5.833 10h.009m3.325 0h.008m3.325 0h.008m-6.675 3.333h.009m3.325 0h.008m3.325 0h.008M5.667 17.5h8.666c.934 0 1.401 0 1.758-.182.314-.16.569-.415.729-.729.18-.356.18-.823.18-1.756V6.167c0-.934 0-1.401-.18-1.758a1.667 1.667 0 0 0-.73-.729c-.356-.18-.823-.18-1.757-.18H5.667c-.934 0-1.401 0-1.758.18-.314.16-.569.415-.729.73C3 4.765 3 5.232 3 6.166v8.666c0 .934 0 1.401.18 1.758.16.314.415.569.73.729.356.18.823.18 1.757.18Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const triggerLabel = (date: string | undefined, locale: CalendarLocale): string => {
  if (date === undefined) {
    return locale === "pt-BR" ? "Selecionar data" : "Select date";
  }
  const [year = 0, month = 1, day = 1] = date.split("-").map(Number);
  const value = Calendar.make(year, month, day);
  if (locale === "pt-BR") {
    return `${String(day)} de ${calendarLocaleConfig(locale).shortMonthNames[month - 1]} de ${String(year)}`;
  }
  return Calendar.formatShort(value, calendarLocaleConfig(locale));
};

export const datePicker = <Message>(
  props: DatePickerProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const locale = props.locale ?? "en-US";
  const dialogId = `${props.id}-dialog`;
  const anchor = `--${props.id}-trigger`;
  return h.div(
    [
      h.Class("relative inline-flex flex-col items-end"),
      h.DataAttribute("date-picker", ""),
      h.Style({ "anchor-name": anchor }),
    ],
    [
      button(
        {
          color: "secondary",
          iconLeadingElement: calendarIcon(h),
          label: triggerLabel(props.selectedDate, locale),
          onPress: props.onOpen,
          size: props.size ?? "sm",
        },
        h,
      ),
      ...(props.isOpen
        ? [
            h.div(
              [
                h.AriaLabel(locale === "pt-BR" ? "Seletor de data" : "Date picker"),
                h.Class(
                  "fixed z-50 overflow-hidden rounded-2xl bg-bg-primary shadow-xl ring-1 ring-border-secondary-alt",
                ),
                h.Id(dialogId),
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
                  [h.Class("flex px-6 py-5")],
                  [
                    datePickerCalendar(
                      {
                        focusedDate: props.focusedDate,
                        highlightedDates: props.highlightedDates,
                        locale,
                        month: props.month,
                        onFocusDate: props.onFocusDate,
                        onNextMonth: props.onNextMonth,
                        onPreviousMonth: props.onPreviousMonth,
                        onSelectDate: props.onSelectDate,
                        onToday: props.onToday,
                        selectedDate: props.selectedDate,
                        today: props.today,
                        year: props.year,
                      },
                      h,
                    ),
                  ],
                ),
                h.div(
                  [h.Class("grid grid-cols-2 gap-3 border-t border-border-secondary p-4")],
                  [
                    button(
                      {
                        color: "secondary",
                        label: locale === "pt-BR" ? "Cancelar" : "Cancel",
                        onPress: props.onCancel,
                        size: "md",
                      },
                      h,
                    ),
                    button(
                      {
                        color: "primary",
                        label: locale === "pt-BR" ? "Aplicar" : "Apply",
                        onPress: props.onApply,
                        size: "md",
                      },
                      h,
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
