/* oxlint-disable effect/noGlobals, effect/noReturnInArrow, effect/noTernary, mps/use-clock-service -- Calendar values are explicit inputs; Date supplies locale formatting and civil-date arithmetic without reading the clock. */
import type { HtmlBuilder } from "foldkit/html";

import type { CalendarLocale } from "./date-picker-calendar.ts";

export type CalendarView = "month" | "week" | "day";
export type CalendarEventColor =
  | "gray"
  | "brand"
  | "green"
  | "blue"
  | "indigo"
  | "purple"
  | "pink"
  | "orange"
  | "yellow";

export interface CalendarEvent {
  readonly color?: CalendarEventColor;
  readonly dot?: boolean;
  readonly end: string;
  readonly id: string;
  readonly start: string;
  readonly title: string;
}

export interface CalendarProps<Message> {
  readonly anchorDate: string;
  readonly events: readonly CalendarEvent[];
  readonly locale?: CalendarLocale;
  readonly onAddEvent: NoInfer<Message>;
  readonly onInitialScroll: NoInfer<Message>;
  readonly onNavigate: (direction: "previous" | "next" | "today") => NoInfer<Message>;
  readonly onSearch: NoInfer<Message>;
  readonly onSelectDate: (date: string) => NoInfer<Message>;
  readonly onViewChange: (view: CalendarView) => NoInfer<Message>;
  readonly selectedDate?: string;
  readonly view: CalendarView;
}

export type CalendarBuilder<Message> = HtmlBuilder<Message>;

export const calendarDate = (iso: string): Date => new Date(`${iso.slice(0, 10)}T12:00:00`);

export const dateIso = (date: Date): string =>
  `${String(date.getFullYear()).padStart(4, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const addCalendarDays = (iso: string, amount: number): string => {
  const date = calendarDate(iso);
  date.setDate(date.getDate() + amount);
  return dateIso(date);
};

export const calendarWeekStart = (iso: string, locale: CalendarLocale): string => {
  const date = calendarDate(iso);
  const target = { "en-US": 0, "pt-BR": 0 }[locale];
  date.setDate(date.getDate() - ((date.getDay() - target + 7) % 7));
  return dateIso(date);
};

export const eventsForDate = (
  events: readonly CalendarEvent[],
  iso: string,
): readonly CalendarEvent[] =>
  events.filter((event) => event.start.slice(0, 10) <= iso && event.end.slice(0, 10) >= iso);

export const calendarFormat = (
  iso: string,
  locale: CalendarLocale,
  options: Intl.DateTimeFormatOptions,
): string => new Intl.DateTimeFormat(locale, options).format(calendarDate(iso));

export const calendarTime = (iso: string, locale: CalendarLocale): string =>
  new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
  }).format(new Date(iso));
