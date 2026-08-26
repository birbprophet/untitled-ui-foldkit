/* oxlint-disable effect/noTernary -- The view union selects one of the two authenticated calendar grid anatomies. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { applicationCalendarHeader } from "./calendar-header.ts";
import { calendarMonthView } from "./calendar-month.ts";
import { calendarTimeGrid } from "./calendar-time-grid.ts";
import type { CalendarProps } from "./calendar-types.ts";

export const calendar = <Message>(props: CalendarProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.AriaLabel(props.locale === "pt-BR" ? "Calendário" : "Calendar"),
      h.Class(
        `isolate flex flex-col overflow-hidden rounded-xl bg-bg-primary shadow-xs ring-1 ring-border-secondary ${props.view === "month" ? "h-full md:min-h-[912px]" : "h-[912px]"}`,
      ),
      h.Role("application"),
    ],
    [
      applicationCalendarHeader(props, h),
      h.main(
        [h.Class("flex flex-1 overflow-hidden")],
        [props.view === "month" ? calendarMonthView(props, h) : calendarTimeGrid(props, h)],
      ),
    ],
  );

export type {
  CalendarEvent,
  CalendarEventColor,
  CalendarProps,
  CalendarView,
} from "./calendar-types.ts";
