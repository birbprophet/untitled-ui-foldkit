/* oxlint-disable effect/noGlobals, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/prefer-option-over-null, mps/use-clock-service -- Explicit civil dates drive locale formatting; the header never reads the clock. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";
import { button } from "../base/button.ts";
import { calendarIcon, calendarViewLabel } from "./calendar-primitives.ts";
import { calendarFormat, calendarWeekStart, addCalendarDays } from "./calendar-types.ts";
import type { CalendarProps } from "./calendar-types.ts";

const calendarView = (selectedView: string): "month" | "week" | "day" => {
  if (selectedView === "day" || selectedView === "week") {
    return selectedView;
  }
  return "month";
};

const iconButton = <Message>(
  label: string,
  icon: "left" | "right" | "search",
  message: Message,
  h: HtmlBuilder<Message>,
  className = "",
): Html =>
  h.button(
    [
      h.AriaLabel(label),
      h.Class(
        `inline-flex h-9 cursor-pointer items-center justify-center rounded-lg text-text-secondary outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 ${icon === "search" ? "w-9 text-text-tertiary" : "w-10 bg-bg-primary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset"} ${className}`,
      ),
      h.OnClick(message),
      h.Type("button"),
    ],
    [calendarIcon(icon, h)],
  );

const dateIcon = <Message>(iso: string, locale: "en-US" | "pt-BR", h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Class(
        "inline-flex min-w-16 flex-col items-center overflow-hidden rounded-lg ring-1 ring-border-secondary max-md:hidden",
      ),
    ],
    [
      h.div(
        [h.Class("flex w-full justify-center bg-bg-secondary px-2 pt-1 pb-0.5")],
        [
          h.span(
            [h.Class("text-xs font-semibold text-text-quaternary")],
            [calendarFormat(iso, locale, { month: "short" }).toUpperCase()],
          ),
        ],
      ),
      h.div(
        [h.Class("flex w-full justify-center px-2 pt-px pb-[3px]")],
        [
          h.span(
            [h.Class("text-lg leading-7 font-bold text-text-brand-secondary")],
            [String(Number(iso.slice(8, 10)))],
          ),
        ],
      ),
    ],
  );

const period = (props: CalendarProps<unknown>, locale: "en-US" | "pt-BR"): string => {
  const options = { day: "numeric", month: "short", year: "numeric" } as const;
  if (props.view === "day") {
    return calendarFormat(props.anchorDate, locale, { weekday: "long" });
  }
  if (props.view === "week") {
    const start = calendarWeekStart(props.anchorDate, locale);
    return `${calendarFormat(start, locale, options)} – ${calendarFormat(addCalendarDays(start, 6), locale, options)}`;
  }
  const date = new Date(`${props.anchorDate}T12:00:00`);
  const start = `${String(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 12);
  const end = `${String(endDate.getFullYear())}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
  return `${calendarFormat(start, locale, options)} – ${calendarFormat(end, locale, options)}`;
};

const viewSelect = <Message>(props: CalendarProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class("relative")],
    [
      h.button(
        [
          h.AriaHasPopup("listbox"),
          h.Class(
            "inline-flex h-9 items-center gap-1 rounded-lg bg-bg-primary px-3.5 text-sm font-semibold text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
          ),
          h.Type("button"),
        ],
        [
          calendarViewLabel(props.view),
          h.span([h.Class("size-4 [&>svg]:size-4")], [calendarIcon("down", h)]),
        ],
      ),
      h.select(
        [
          h.AriaLabel(props.locale === "pt-BR" ? "Visualização" : "Calendar view"),
          h.Class("absolute inset-0 cursor-pointer opacity-0"),
          h.OnInput((value) => props.onViewChange(calendarView(value))),
          h.Value(props.view),
        ],
        (["day", "week", "month"] as const).map((view) =>
          h.option([h.Value(view)], [calendarViewLabel(view)]),
        ),
      ),
    ],
  );

export const applicationCalendarHeader = <Message>(
  props: CalendarProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const locale = props.locale ?? "en-US";
  const todayLabel = "Today";
  return h.header(
    [
      h.Class(
        "relative flex flex-col items-start justify-between gap-4 bg-bg-primary px-4 py-5 md:px-6 lg:flex-row",
      ),
    ],
    [
      h.div(
        [h.Class("flex items-start gap-3")],
        [
          dateIcon(props.anchorDate, locale, h),
          h.div(
            [h.Class("flex flex-col gap-0.5")],
            [
              h.div(
                [
                  h.Class(
                    "flex items-center gap-2 text-lg font-semibold whitespace-nowrap text-text-primary",
                  ),
                ],
                [
                  `${calendarFormat(props.anchorDate, locale, { month: "long" })} ${props.anchorDate.slice(0, 4)}`,
                  badge(
                    {
                      color: "gray",
                      label: `Week ${String(Math.ceil(Number(props.anchorDate.slice(8, 10)) / 7))}`,
                      size: "sm",
                      type: "modern",
                    },
                    h,
                  ),
                ],
              ),
              h.span([h.Class("text-sm text-text-tertiary")], [period(props, locale)]),
            ],
          ),
        ],
      ),
      h.div(
        [h.Class("flex flex-wrap items-center gap-3 gap-y-4 max-lg:w-full")],
        [
          iconButton(
            locale === "pt-BR" ? "Pesquisar" : "Search",
            "search",
            props.onSearch,
            h,
            "order-1 lg:order-none",
          ),
          h.div(
            [h.Class("order-last flex min-w-full flex-1 lg:order-none lg:min-w-0 lg:flex-none")],
            [
              iconButton(
                locale === "pt-BR" ? "Anterior" : "Previous",
                "left",
                props.onNavigate("previous"),
                h,
              ),
              h.div(
                [h.Class("flex flex-1 *:w-full")],
                [
                  button(
                    {
                      color: "secondary",
                      label: todayLabel,
                      onPress: props.onNavigate("today"),
                      size: "sm",
                    },
                    h,
                  ),
                ],
              ),
              iconButton(
                locale === "pt-BR" ? "Próximo" : "Next",
                "right",
                props.onNavigate("next"),
                h,
              ),
            ],
          ),
          viewSelect(props, h),
          button(
            {
              iconLeadingElement: calendarIcon("plus", h),
              label: "Add event",
              onPress: props.onAddEvent,
              size: "sm",
            },
            h,
          ),
        ],
      ),
      h.div([
        h.Class(
          "pointer-events-none absolute bottom-0 left-0 w-full border-t border-border-secondary",
        ),
      ]),
    ],
  );
};
