/* oxlint-disable effect/noGlobals, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, mps/use-clock-service -- Explicit event dates and the fixed fixture day drive the upstream 48 half-hour slots without reading the clock. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { scrollCalendarToFirstEvent } from "../internal/calendar-runtime.ts";
import { calendarColumnHeader } from "./calendar-primitives.ts";
import {
  addCalendarDays,
  calendarFormat,
  calendarTime,
  calendarWeekStart,
  eventsForDate,
} from "./calendar-types.ts";
import type { CalendarEvent, CalendarProps } from "./calendar-types.ts";

const slotHeight = 48;

const timeLabel = (hour: number, locale: "en-US" | "pt-BR"): string =>
  new Intl.DateTimeFormat(locale, { hour: "numeric", hour12: true }).format(
    new Date(2026, 7, 24, hour),
  );

const cell = <Message>(lastColumn: boolean, lastRow: boolean, h: HtmlBuilder<Message>): Html =>
  h.div([
    h.Class(
      `group relative flex h-12 flex-col bg-bg-primary p-1.5 hover:bg-bg-primary-hover before:pointer-events-none before:absolute before:inset-0 before:border-r before:border-b before:border-border-secondary ${lastColumn ? "before:border-r-0" : ""} ${lastRow ? "before:border-b-0" : ""}`,
    ),
  ]);

const positionedEvent = <Message>(
  event: CalendarEvent,
  locale: "en-US" | "pt-BR",
  h: HtmlBuilder<Message>,
): Html => {
  const start = new Date(event.start);
  const end = new Date(event.end);
  const minutes = start.getHours() * 60 + start.getMinutes();
  const duration = Math.max(15, (end.getTime() - start.getTime()) / 60_000);
  const color = event.color ?? "gray";
  const colors = {
    blue: "bg-utility-blue-50 ring-utility-blue-200 text-utility-blue-700",
    brand: "bg-utility-brand-50 ring-utility-brand-200 text-utility-brand-700",
    gray: "bg-utility-neutral-50 ring-utility-neutral-200 text-utility-neutral-700",
    green: "bg-utility-green-50 ring-utility-green-200 text-utility-green-700",
    indigo: "bg-utility-indigo-50 ring-utility-indigo-200 text-utility-indigo-700",
    orange: "bg-utility-orange-50 ring-utility-orange-200 text-utility-orange-700",
    pink: "bg-utility-pink-50 ring-utility-pink-200 text-utility-pink-700",
    purple: "bg-utility-purple-50 ring-utility-purple-200 text-utility-purple-700",
    yellow: "bg-utility-yellow-50 ring-utility-yellow-200 text-utility-yellow-700",
  } as const;
  return h.div(
    [
      h.Class("absolute z-10 w-full px-1.5 py-1.5"),
      h.Style({
        height: `${String(Math.max(24, (duration / 30) * slotHeight))}px`,
        top: `${String((minutes / 30) * slotHeight)}px`,
      }),
    ],
    [
      h.div(
        [
          h.Class(
            `flex h-full w-full flex-col gap-0.5 rounded-md px-2 py-1.5 ring-1 ring-inset ${colors[color]}`,
          ),
        ],
        [
          h.span([h.Class("truncate text-xs font-semibold")], [event.title]),
          ...(duration <= 30
            ? []
            : [h.time([h.Class("text-xs")], [calendarTime(event.start, locale)])]),
        ],
      ),
    ],
  );
};

const dayColumn = <Message>(
  props: CalendarProps<Message>,
  iso: string,
  lastColumn: boolean,
  h: HtmlBuilder<Message>,
): Html => {
  const locale = props.locale ?? "en-US";
  const events = eventsForDate(props.events, iso);
  return h.div(
    [
      h.Class("relative flex flex-col bg-bg-primary"),
      h.Style({ "min-height": `${String(48 * slotHeight)}px` }),
    ],
    [
      ...Array.from({ length: 48 }, (_, index) => cell(lastColumn, index === 47, h)),
      ...events.map((event) => positionedEvent(event, locale, h)),
    ],
  );
};

const headers = <Message>(
  dates: readonly string[],
  props: CalendarProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const locale = props.locale ?? "en-US";
  return h.div(
    [
      h.Class(
        `sticky top-0 z-10 grid bg-bg-primary shadow-xs dark:border-b dark:border-border-secondary ${dates.length === 7 ? "grid-cols-7 pl-18" : "grid-cols-7 lg:hidden"}`,
      ),
    ],
    dates.map((date) =>
      calendarColumnHeader(
        calendarFormat(date, locale, { weekday: "short" }),
        Number(date.slice(8, 10)),
        props.selectedDate === date ? "selected" : date === "2026-08-24" ? "current" : "default",
        props.onSelectDate(date),
        h,
      ),
    ),
  );
};

const gutter = <Message>(locale: "en-US" | "pt-BR", h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class("flex h-max w-14 shrink-0 flex-col border-r border-border-secondary md:w-18")],
    Array.from({ length: 24 }, (_, hour) =>
      h.div(
        [h.Class("group relative flex h-24 items-start justify-end bg-bg-secondary pr-2")],
        [
          h.span(
            [
              h.Class(
                "-translate-y-1/2 text-right text-xs font-medium whitespace-nowrap text-text-quaternary group-first:translate-y-1",
              ),
            ],
            [timeLabel(hour, locale)],
          ),
        ],
      ),
    ),
  );

export const calendarTimeGrid = <Message>(
  props: CalendarProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const locale = props.locale ?? "en-US";
  const start =
    props.view === "week" ? calendarWeekStart(props.anchorDate, locale) : props.anchorDate;
  const dates =
    props.view === "week"
      ? Array.from({ length: 7 }, (_, index) => addCalendarDays(start, index))
      : [start];
  const weekHeaderDates = Array.from({ length: 7 }, (_, index) =>
    addCalendarDays(calendarWeekStart(start, locale), index),
  );
  return h.div(
    [h.Class("flex flex-1 flex-col overflow-auto")],
    [
      headers(props.view === "week" ? dates : weekHeaderDates, props, h),
      h.div(
        [
          h.Class("relative -mt-px flex flex-1 overflow-y-auto"),
          h.OnMount(scrollCalendarToFirstEvent(props.onInitialScroll)),
        ],
        [
          gutter(locale, h),
          h.div(
            [h.Class(props.view === "week" ? "grid flex-1 grid-cols-7" : "relative flex-1")],
            dates.map((date, index) => dayColumn(props, date, index === dates.length - 1, h)),
          ),
        ],
      ),
    ],
  );
};
