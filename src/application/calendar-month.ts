/* oxlint-disable effect/noGlobals, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, eslint/no-unmodified-loop-condition, mps/imperative-loops, mps/no-length-comparison, mps/prefer-arr-match, mps/use-clock-service -- Explicit civil dates and the seven-column loop follow the authenticated Calendar month anatomy without reading the clock. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { calendarEvent, calendarEventDot } from "./calendar-primitives.ts";
import {
  calendarDate,
  calendarFormat,
  calendarTime,
  dateIso,
  eventsForDate,
} from "./calendar-types.ts";
import type { CalendarEvent, CalendarProps } from "./calendar-types.ts";

const monthDates = (anchor: string, locale: "en-US" | "pt-BR"): readonly string[] => {
  const date = calendarDate(anchor);
  const first = new Date(date.getFullYear(), date.getMonth(), 1, 12);
  const target = { "en-US": 0, "pt-BR": 0 }[locale];
  first.setDate(first.getDate() - ((first.getDay() - target + 7) % 7));
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0, 12);
  last.setDate(last.getDate() + ((target + 6 - last.getDay() + 7) % 7));
  const dates: string[] = [];
  for (const cursor = new Date(first); cursor <= last; cursor.setDate(cursor.getDate() + 1)) {
    dates.push(dateIso(cursor));
  }
  return dates;
};

const weekdays = (locale: "en-US" | "pt-BR"): readonly string[] => {
  const start = new Date("2026-08-23T12:00:00");
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(date.getDate() + index);
    return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);
  });
};

const eventSpecimen = <Message>(
  event: CalendarEvent,
  locale: "en-US" | "pt-BR",
  h: HtmlBuilder<Message>,
): readonly Html[] => [
  calendarEventDot(event, h),
  calendarEvent(event, calendarTime(event.start, locale), h),
];

const monthCell = <Message>(
  props: CalendarProps<Message>,
  iso: string,
  index: number,
  dates: readonly string[],
  h: HtmlBuilder<Message>,
): Html => {
  const locale = props.locale ?? "en-US";
  const events = eventsForDate(props.events, iso);
  const inMonth = iso.slice(0, 7) === props.anchorDate.slice(0, 7);
  const selected = props.selectedDate === iso;
  const current = iso === "2026-08-24";
  const lastRow = index >= dates.length - 7;
  const lastColumn = (index + 1) % 7 === 0;
  return h.button(
    [
      h.AriaLabel(
        calendarFormat(iso, locale, {
          day: "numeric",
          month: "long",
          weekday: "long",
          year: "numeric",
        }),
      ),
      h.AriaSelected(selected),
      h.Class(
        `group relative flex min-h-22 flex-col gap-1.5 bg-bg-primary p-1.5 text-left outline-focus-ring hover:bg-bg-primary-hover md:gap-1 md:p-2 before:pointer-events-none before:absolute before:inset-0 before:border-r before:border-b before:border-border-secondary ${lastRow ? "before:border-b-0" : ""} ${lastColumn ? "before:border-r-0" : ""} ${inMonth ? "cursor-pointer" : "pointer-events-none bg-bg-secondary-alt"}`,
      ),
      h.Disabled(!inMonth),
      h.OnClick(props.onSelectDate(iso)),
      h.Type("button"),
    ],
    [
      h.span(
        [
          h.Class(
            `flex size-6 items-center justify-center rounded-full text-xs font-semibold text-text-secondary ${selected ? "bg-bg-brand-solid text-white" : current ? "bg-bg-secondary" : ""} ${inMonth ? "" : "opacity-50"}`,
          ),
        ],
        [String(Number(iso.slice(8, 10)))],
      ),
      h.div(
        [h.Class("flex gap-1 max-md:pl-1 md:flex-col")],
        events.slice(0, 3).flatMap((event) => eventSpecimen(event, locale, h)),
      ),
      ...(events.length <= 3
        ? []
        : [
            h.div(
              [h.Class("truncate text-xs font-semibold text-utility-neutral-500 max-md:pl-1")],
              [`${String(events.length - 3)} more...`],
            ),
          ]),
    ],
  );
};

const mobileFooter = <Message>(props: CalendarProps<Message>, h: HtmlBuilder<Message>): Html => {
  const locale = props.locale ?? "en-US";
  const selected = props.selectedDate ?? "2026-08-24";
  const events = eventsForDate(props.events, selected);
  return h.div(
    [h.Class("border-t border-border-secondary px-4 py-5 md:hidden")],
    [
      h.h3(
        [h.Class("text-sm font-semibold text-text-primary")],
        [
          calendarFormat(selected, locale, {
            day: "numeric",
            month: "long",
            weekday: "long",
            year: "numeric",
          }),
        ],
      ),
      ...(events.length === 0
        ? [
            h.p(
              [h.Class("mt-4 text-xs font-semibold text-text-quaternary")],
              ["No events for this day."],
            ),
          ]
        : [
            h.div(
              [h.Class("mt-4 flex flex-col gap-1.5")],
              events
                .slice(0, 3)
                .map((event) => calendarEvent(event, calendarTime(event.start, locale), h, false)),
            ),
          ]),
    ],
  );
};

export const calendarMonthView = <Message>(
  props: CalendarProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const locale = props.locale ?? "en-US";
  const dates = monthDates(props.anchorDate, locale);
  return h.div(
    [h.Class("flex flex-1 flex-col")],
    [
      h.div(
        [h.Class("grid grid-cols-7")],
        weekdays(locale).map((weekday) =>
          h.div(
            [
              h.Class(
                "relative flex w-full items-center justify-center bg-bg-primary p-2 before:absolute before:inset-0 before:border-r before:border-b before:border-border-secondary",
              ),
            ],
            [h.span([h.Class("text-xs font-medium text-text-quaternary")], [weekday])],
          ),
        ),
      ),
      h.div(
        [h.Class(`grid flex-1 grid-cols-7 ${dates.length > 35 ? "grid-rows-6" : "grid-rows-5"}`)],
        dates.map((date, index) => monthCell(props, date, index, dates, h)),
      ),
      mobileFooter(props, h),
    ],
  );
};
