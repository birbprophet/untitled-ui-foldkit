/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, eslint/prefer-destructuring, mps/prefer-option-over-null -- Closed calendar anatomy tables keep the renderer declarative. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

import type { CalendarEvent, CalendarEventColor } from "./calendar-types.ts";

const eventColors: Record<CalendarEventColor, readonly [string, string, string, string]> = {
  blue: [
    "bg-utility-blue-50 ring-utility-blue-200",
    "text-utility-blue-700",
    "text-utility-blue-600",
    "bg-utility-blue-500",
  ],
  brand: [
    "bg-utility-brand-50 ring-utility-brand-200",
    "text-utility-brand-700",
    "text-utility-brand-600",
    "bg-utility-brand-500",
  ],
  gray: [
    "bg-utility-neutral-50 ring-utility-neutral-200",
    "text-utility-neutral-700",
    "text-utility-neutral-600",
    "bg-utility-neutral-500",
  ],
  green: [
    "bg-utility-green-50 ring-utility-green-200",
    "text-utility-green-700",
    "text-utility-green-600",
    "bg-utility-green-500",
  ],
  indigo: [
    "bg-utility-indigo-50 ring-utility-indigo-200",
    "text-utility-indigo-700",
    "text-utility-indigo-600",
    "bg-utility-indigo-500",
  ],
  orange: [
    "bg-utility-orange-50 ring-utility-orange-200",
    "text-utility-orange-700",
    "text-utility-orange-600",
    "bg-utility-orange-500",
  ],
  pink: [
    "bg-utility-pink-50 ring-utility-pink-200",
    "text-utility-pink-700",
    "text-utility-pink-600",
    "bg-utility-pink-500",
  ],
  purple: [
    "bg-utility-purple-50 ring-utility-purple-200",
    "text-utility-purple-700",
    "text-utility-purple-600",
    "bg-utility-purple-500",
  ],
  yellow: [
    "bg-utility-yellow-50 ring-utility-yellow-200",
    "text-utility-yellow-700",
    "text-utility-yellow-600",
    "bg-utility-yellow-500",
  ],
};

export const calendarIcon = <Message>(
  kind: "left" | "right" | "search" | "plus" | "down",
  h: HtmlBuilder<Message>,
): Html => {
  const paths = {
    down: "m6 9 6 6 6-6",
    left: "M19 12H5m0 0 7 7m-7-7 7-7",
    plus: "M12 5v14m-7-7h14",
    right: "M5 12h14m0 0-7-7m7 7-7 7",
    search: "m21 21-3.5-3.5m2.5-6a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z",
  } as const;
  return h.svg(
    [h.AriaHidden(true), h.Class("size-5 shrink-0"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D(paths[kind]),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );
};

export const calendarEvent = <Message>(
  event: CalendarEvent,
  supportingText: string | undefined,
  h: HtmlBuilder<Message>,
  collapseOnMobile = true,
): Html => {
  const color = event.color ?? "gray";
  const classes = eventColors[color];
  return h.div(
    [
      h.Class(
        `flex w-full cursor-pointer items-center gap-1 rounded-md px-2 py-1 ring-1 ring-inset ${collapseOnMobile ? "max-md:hidden" : ""} ${classes[0]}`,
      ),
    ],
    [
      h.div(
        [h.Class("flex w-full items-center justify-between gap-0.5")],
        [
          h.span([h.Class(`flex-1 truncate text-xs font-semibold ${classes[1]}`)], [event.title]),
          ...(supportingText === undefined
            ? []
            : [h.time([h.Class(`text-xs ${classes[2]}`)], [supportingText])]),
        ],
      ),
    ],
  );
};

export const calendarEventDot = <Message>(event: CalendarEvent, h: HtmlBuilder<Message>): Html => {
  const color = event.color ?? "gray";
  const dotClass = eventColors[color][3];
  return h.div(
    [h.Class("inline-flex size-2 items-center justify-center md:hidden")],
    [h.span([h.Class(`size-1.5 rounded-full ${dotClass}`)])],
  );
};

export const calendarColumnHeader = <Message>(
  weekday: string,
  day: number | undefined,
  state: "default" | "selected" | "current",
  onSelect: Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "relative flex w-full flex-col items-center justify-center gap-1.5 bg-bg-primary p-2 md:flex-row md:gap-1 before:pointer-events-none before:absolute before:inset-0 before:border-r before:border-border-secondary",
      ),
      h.OnClick(onSelect),
      h.OnKeyDownPreventDefault((key) =>
        key === "Enter" || key === " " ? Option.some(onSelect) : Option.none(),
      ),
      h.Role("button"),
      h.Tabindex(0),
    ],
    [
      h.span([h.Class("text-xs font-medium text-text-quaternary")], [weekday]),
      ...(day === undefined
        ? []
        : [
            h.span(
              [
                h.Class(
                  `flex h-6 items-center justify-center text-xs font-semibold text-text-secondary ${state === "selected" ? "w-6 rounded-full bg-bg-brand-solid text-white" : state === "current" ? "w-6 rounded-full bg-bg-secondary" : ""}`,
                ),
              ],
              [String(day)],
            ),
          ]),
    ],
  );

export const calendarViewLabel = (view: "month" | "week" | "day"): string => {
  if (view === "month") {
    return "Month view";
  }
  if (view === "week") {
    return "Week view";
  }
  return "Day view";
};
