/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noGlobals, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/use-clock-service -- Parsing a supplied ISO date is deterministic; the controlled renderer preserves the authenticated responsive date-picker modal anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { rangeCalendar } from "./range-calendar.ts";
import type { DateRangeValue, RangeCalendarPreset } from "./range-calendar.ts";

export type DatePickerModalLocale = "en-US" | "pt-BR";

export interface DatePickerModalProps<Message> {
  readonly focusedDate: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale: DatePickerModalLocale;
  readonly messageForFocusDate: (date: string) => NoInfer<Message>;
  readonly messageForPreset: (range: DateRangeValue) => NoInfer<Message>;
  readonly messageForSelectDate: (date: string) => NoInfer<Message>;
  readonly month: number;
  readonly onApply: NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onNextMonth: NoInfer<Message>;
  readonly onPreviousMonth: NoInfer<Message>;
  readonly range: DateRangeValue;
  readonly today: string;
  readonly year: number;
}

const labels = {
  "en-US": {
    allTime: "All time",
    apply: "Apply",
    cancel: "Cancel",
    lastMonth: "Last month",
    lastWeek: "Last week",
    lastYear: "Last year",
    thisMonth: "This month",
    thisWeek: "This week",
    thisYear: "This year",
    title: "Date picker",
    today: "Today",
    yesterday: "Yesterday",
  },
  "pt-BR": {
    allTime: "Todo o período",
    apply: "Aplicar",
    cancel: "Cancelar",
    lastMonth: "Mês passado",
    lastWeek: "Semana passada",
    lastYear: "Ano passado",
    thisMonth: "Este mês",
    thisWeek: "Esta semana",
    thisYear: "Este ano",
    title: "Seletor de período",
    today: "Hoje",
    yesterday: "Ontem",
  },
} as const;

const addDays = (iso: string, days: number): string => {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const presetsFor = (
  locale: DatePickerModalLocale,
  today: string,
): readonly RangeCalendarPreset[] => {
  const copy = labels[locale];
  const [yearText = "2027", monthText = "1"] = today.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const monthStart = `${yearText}-${String(month).padStart(2, "0")}-01`;
  const previousMonth = month === 1 ? 12 : month - 1;
  const previousYear = month === 1 ? year - 1 : year;
  const previousMonthStart = `${String(previousYear)}-${String(previousMonth).padStart(2, "0")}-01`;
  const previousMonthEnd = addDays(monthStart, -1);
  return [
    { label: copy.today, value: { end: today, start: today } },
    { label: copy.yesterday, value: { end: addDays(today, -1), start: addDays(today, -1) } },
    { label: copy.thisWeek, value: { end: addDays(today, 6), start: today } },
    { label: copy.lastWeek, value: { end: addDays(today, -1), start: addDays(today, -7) } },
    {
      label: copy.thisMonth,
      value: {
        end: addDays(`${yearText}-${String(month + 1).padStart(2, "0")}-01`, -1),
        start: monthStart,
      },
    },
    { label: copy.lastMonth, value: { end: previousMonthEnd, start: previousMonthStart } },
    { label: copy.thisYear, value: { end: `${yearText}-12-31`, start: `${yearText}-01-01` } },
    {
      label: copy.lastYear,
      value: { end: `${String(year - 1)}-12-31`, start: `${String(year - 1)}-01-01` },
    },
    { label: copy.allTime, value: { end: today, start: "2000-01-01" } },
  ];
};

const dateField = <Message>(
  isoDate: string,
  locale: DatePickerModalLocale,
  label: string,
  h: HtmlBuilder<Message>,
): Html => {
  const [year = "", month = "", day = ""] = isoDate.split("-");
  const parts = locale === "pt-BR" ? [day, month, year] : [month, day, year];
  return h.div(
    [
      h.AriaLabel(label),
      h.Class(
        "flex items-center rounded-lg bg-bg-primary px-3 py-2 text-sm shadow-xs ring-1 ring-border-primary ring-inset",
      ),
      h.Role("group"),
    ],
    parts.flatMap((part, index) =>
      index === 0
        ? [h.span([h.Class("tabular-nums text-text-primary")], [String(Number(part))])]
        : [
            h.span([h.Class("px-1 text-text-quaternary")], ["/"]),
            h.span(
              [h.Class("tabular-nums text-text-primary")],
              [index === 2 ? part : String(Number(part))],
            ),
          ],
    ),
  );
};

export const datePickerModal = <Message>(
  props: DatePickerModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  if (!props.isOpen) {
    return h.div([]);
  }
  const copy = labels[props.locale];
  const presets = presetsFor(props.locale, props.today);
  const compactPresets = presets.filter((_, index) => [3, 5, 7].includes(index));
  return h.div(
    [
      h.Class(
        "fixed inset-0 z-50 flex min-h-dvh items-center justify-center bg-overlay/70 p-4 backdrop-blur-[6px]",
      ),
      h.DataAttribute("modal-overlay", props.id),
    ],
    [
      h.dialog(
        [
          h.AriaLabel(copy.title),
          h.Class(
            "fixed !top-1/2 !right-auto !bottom-auto !left-1/2 m-0 flex max-h-[calc(100dvh-32px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border-0 bg-bg-primary p-0 shadow-xl ring-1 ring-border-secondary-alt outline-hidden max-md:!top-auto max-md:!bottom-[clamp(16px,8vh,64px)] max-md:translate-y-0",
          ),
          h.Id(props.id),
          h.OnCancel(props.onDismiss),
          h.Open(true),
        ],
        [
          h.aside(
            [
              h.Class(
                "hidden w-38 shrink-0 flex-col gap-0.5 border-r border-border-secondary p-3 md:flex",
              ),
            ],
            presets.map((preset) =>
              h.button(
                [
                  h.Class(
                    "cursor-pointer rounded-md px-3 py-2 text-left text-sm font-medium text-text-secondary outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2",
                  ),
                  h.OnClick(props.messageForPreset(preset.value)),
                  h.Type("button"),
                ],
                [preset.label],
              ),
            ),
          ),
          h.div(
            [h.Class("flex min-w-0 flex-col")],
            [
              rangeCalendar(
                {
                  compactMobile: true,
                  focusedDate: props.focusedDate,
                  highlightedDates: [props.today],
                  locale: props.locale,
                  month: props.month,
                  onFocusDate: props.messageForFocusDate,
                  onNextMonth: props.onNextMonth,
                  onPreset: props.messageForPreset,
                  onPreviousMonth: props.onPreviousMonth,
                  onSelectDate: props.messageForSelectDate,
                  presets: compactPresets,
                  range: props.range,
                  today: props.today,
                  visibleMonths: 2,
                  year: props.year,
                },
                h,
              ),
              h.footer(
                [h.Class("flex justify-between gap-3 border-t border-border-secondary p-4")],
                [
                  h.div(
                    [h.Class("hidden items-center gap-3 md:flex")],
                    [
                      dateField(
                        props.range.start,
                        props.locale,
                        props.locale === "pt-BR" ? "Data inicial" : "Start date",
                        h,
                      ),
                      h.span([h.Class("text-md text-text-quaternary")], ["–"]),
                      dateField(
                        props.range.end,
                        props.locale,
                        props.locale === "pt-BR" ? "Data final" : "End date",
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
                          label: copy.cancel,
                          onPress: props.onCancel,
                          size: "sm",
                        },
                        h,
                      ),
                      button(
                        { color: "primary", label: copy.apply, onPress: props.onApply, size: "sm" },
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
    ],
  );
};
