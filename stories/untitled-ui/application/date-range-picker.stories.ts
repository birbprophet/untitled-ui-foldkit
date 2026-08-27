/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook Controls expose only upstream props; open, range, focus, and preset state remain in the FoldKit Model. */
import * as S from "effect/Schema";
import { dateRangePicker } from "../../../src/application.ts";
import type { DateRangeValue } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory } from "../story.ts";

const Range = S.Struct({ end: S.String, start: S.String });
const Args = S.Struct({
  locale: S.Literals(["en-US", "pt-BR"]),
  size: S.Literals(["sm", "md"]),
  visibleMonths: S.Literals([1, 2]),
});
const Model = S.Struct({
  ...Args.fields,
  focusedDate: S.String,
  isOpen: S.Boolean,
  month: S.Number,
  range: S.optional(Range),
  rangeStart: S.optional(S.String),
  year: S.Number,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Applied" }>
  | Readonly<{ _tag: "Cancelled" }>
  | Readonly<{ _tag: "Focused"; date: string }>
  | Readonly<{ _tag: "NextMonth" }>
  | Readonly<{ _tag: "Opened" }>
  | Readonly<{ _tag: "Preset"; value: DateRangeValue }>
  | Readonly<{ _tag: "PreviousMonth" }>
  | Readonly<{ _tag: "Selected"; date: string }>;

const applied: Message = { _tag: "Applied" };
const cancelled: Message = { _tag: "Cancelled" };
const focused = (date: string): Message => ({ _tag: "Focused", date });
const nextMonth: Message = { _tag: "NextMonth" };
const opened: Message = { _tag: "Opened" };
const preset = (dateRange: DateRangeValue): Message => ({ _tag: "Preset", value: dateRange });
const previousMonth: Message = { _tag: "PreviousMonth" };
const selected = (date: string): Message => ({ _tag: "Selected", date });

const update = (model: Model, message: Message): Model => {
  if (message._tag === "Applied" || message._tag === "Cancelled") {
    return { ...model, isOpen: false };
  }
  if (message._tag === "Opened") {
    return { ...model, isOpen: true };
  }
  if (message._tag === "Focused") {
    return { ...model, focusedDate: message.date };
  }
  if (message._tag === "Preset") {
    return {
      ...model,
      focusedDate: message.value.start,
      range: message.value,
      rangeStart: undefined,
    };
  }
  if (message._tag === "Selected") {
    if (model.rangeStart === undefined) {
      return { ...model, focusedDate: message.date, range: undefined, rangeStart: message.date };
    }
    const start = model.rangeStart <= message.date ? model.rangeStart : message.date;
    const end = model.rangeStart <= message.date ? message.date : model.rangeStart;
    return { ...model, focusedDate: message.date, range: { end, start }, rangeStart: undefined };
  }
  if (message._tag === "NextMonth") {
    return model.month === 12
      ? { ...model, focusedDate: `${String(model.year + 1)}-01-01`, month: 1, year: model.year + 1 }
      : {
          ...model,
          focusedDate: `${String(model.year)}-${String(model.month + 1).padStart(2, "0")}-01`,
          month: model.month + 1,
        };
  }
  return model.month === 1
    ? { ...model, focusedDate: `${String(model.year - 1)}-12-01`, month: 12, year: model.year - 1 }
    : {
        ...model,
        focusedDate: `${String(model.year)}-${String(model.month - 1).padStart(2, "0")}-01`,
        month: model.month - 1,
      };
};

const presets = [
  { label: "Today", value: { end: "2026-08-24", start: "2026-08-24" } },
  { label: "Yesterday", value: { end: "2026-08-23", start: "2026-08-23" } },
  { label: "This week", value: { end: "2026-08-29", start: "2026-08-23" } },
  { label: "Last week", value: { end: "2026-08-22", start: "2026-08-16" } },
  { label: "This month", value: { end: "2026-08-31", start: "2026-08-01" } },
  { label: "Last month", value: { end: "2026-07-31", start: "2026-07-01" } },
  { label: "This year", value: { end: "2026-12-31", start: "2026-01-01" } },
  { label: "Last year", value: { end: "2025-12-31", start: "2025-01-01" } },
  { label: "All time", value: { end: "2026-08-24", start: "2000-01-01" } },
] as const;

const view = (model: Model, h: Parameters<typeof dateRangePicker<Message>>[1]) =>
  dateRangePicker(
    {
      focusedDate: model.focusedDate,
      highlightedDates: ["2026-08-24"],
      id: "storybook-date-range-picker",
      isOpen: model.isOpen,
      locale: model.locale,
      month: model.month,
      onApply: applied,
      onCancel: cancelled,
      onFocusDate: focused,
      onNextMonth: nextMonth,
      onOpen: opened,
      onPreset: preset,
      onPreviousMonth: previousMonth,
      onSelectDate: selected,
      presets,
      range: model.range,
      size: model.size,
      today: "2026-08-24",
      visibleMonths: model.visibleMonths,
      year: model.year,
    },
    h,
  );

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    focusedDate: "2026-08-24",
    isOpen: true,
    month: 8,
    year: 2026,
  }),
  update,
  view,
} as const;
const args: typeof Args.Type = { locale: "en-US", size: "sm", visibleMonths: 2 };

export default {
  ...componentMeta("date-range-picker"),
  argTypes: {
    locale: { control: "select", options: ["en-US", "pt-BR"] },
    size: { control: "select", options: ["sm", "md"] },
    visibleMonths: { control: "select", options: [1, 2] },
  },
  title: "Untitled UI/Application/Date Range Picker",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs: typeof Args.Type): Model => ({
      ...storyArgs,
      focusedDate: "2026-08-18",
      isOpen: true,
      month: 8,
      range: { end: "2026-08-24", start: "2026-08-18" },
      year: 2026,
    }),
  }),
  args,
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [
          h.Class("fixed inset-0 bg-bg-primary p-16"),
          h.DataAttribute("theme", "dark"),
          h.Style({ "--date-picker-inset": "4rem" }),
        ],
        [view(model, h)],
      ),
  }),
  args,
};
export const Responsive = {
  ...liveStory(definition),
  args,
};
export const Interactions = {
  ...liveStory({
    ...definition,
    init: (storyArgs: typeof Args.Type): Model => ({
      ...storyArgs,
      focusedDate: "2026-08-18",
      isOpen: false,
      month: 8,
      year: 2026,
    }),
  }),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Select dates" }));
    await expect(await canvas.findByRole("dialog", { name: "Date range picker" })).toBeVisible();
    await userEvent.click(await canvas.findByRole("button", { name: "This week" }));
    await userEvent.click(await canvas.findByRole("button", { name: "Apply" }));
    await waitFor(async () => {
      await expect(
        canvas.queryByRole("dialog", { name: "Date range picker" }),
      ).not.toBeInTheDocument();
    });
    await expect(
      await canvas.findByRole("button", { name: "Aug 23, 2026 – Aug 29, 2026" }),
    ).toBeVisible();
  },
};
