/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/require-is-prefix-for-boolean-schema-field -- showOutOfRangeDates is the exact authenticated upstream prop; Controls preserve its public name while selection and focus stay in the FoldKit Model. */
import * as S from "effect/Schema";
import { rangeCalendar } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory } from "../story.ts";

const Range = S.Struct({ end: S.String, start: S.String });
const Args = S.Struct({
  locale: S.Literals(["en-US", "pt-BR"]),
  showOutOfRangeDates: S.Boolean,
  visibleMonths: S.Literals([1, 2]),
});
const Model = S.Struct({
  ...Args.fields,
  focusedDate: S.String,
  month: S.Number,
  range: S.optional(Range),
  rangeStart: S.optional(S.String),
  year: S.Number,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Focused"; date: string }>
  | Readonly<{ _tag: "NextMonth" }>
  | Readonly<{ _tag: "PreviousMonth" }>
  | Readonly<{ _tag: "Selected"; date: string }>;

const focused = (date: string): Message => ({ _tag: "Focused", date });
const nextMonth: Message = { _tag: "NextMonth" };
const previousMonth: Message = { _tag: "PreviousMonth" };
const selected = (date: string): Message => ({ _tag: "Selected", date });

const update = (model: Model, message: Message): Model => {
  if (message._tag === "Focused") {
    return { ...model, focusedDate: message.date };
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

const view = (model: Model, h: Parameters<typeof rangeCalendar<Message>>[1]) =>
  rangeCalendar(
    {
      focusedDate: model.focusedDate,
      highlightedDates: ["2026-08-24"],
      locale: model.locale,
      month: model.month,
      onFocusDate: focused,
      onNextMonth: nextMonth,
      onPreviousMonth: previousMonth,
      onSelectDate: selected,
      range: model.range,
      showOutOfRangeDates: model.showOutOfRangeDates,
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
    focusedDate: "2026-08-18",
    month: 8,
    year: 2026,
  }),
  update,
  view,
} as const;
const args: typeof Args.Type = {
  locale: "en-US",
  showOutOfRangeDates: false,
  visibleMonths: 2,
};

export default {
  ...componentMeta("range-calendar"),
  argTypes: {
    locale: { control: "select", options: ["en-US", "pt-BR"] },
    showOutOfRangeDates: { control: "boolean" },
    visibleMonths: { control: "select", options: [1, 2] },
  },
  title: "Untitled UI/Application/Range Calendar",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs: typeof Args.Type): Model => ({
      ...storyArgs,
      focusedDate: "2026-08-18",
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
        [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
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
  ...liveStory(definition),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole("gridcell", { name: "Tuesday, August 18, 2026" }),
    );
    await userEvent.click(await canvas.findByRole("gridcell", { name: "Monday, August 24, 2026" }));
    await waitFor(async () => {
      await expect(
        await canvas.findByRole("gridcell", { name: "Monday, August 24, 2026" }),
      ).toHaveAttribute("aria-selected", "true");
    });
    await userEvent.keyboard("{ArrowRight}");
    await expect(
      await canvas.findByRole("gridcell", { name: "Tuesday, August 25, 2026" }),
    ).toHaveFocus();
  },
};
