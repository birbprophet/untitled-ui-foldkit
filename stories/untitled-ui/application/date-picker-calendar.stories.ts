/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- The story keeps calendar navigation and selection in the FoldKit Model while exposing only the real locale prop. */
import * as S from "effect/Schema";
import { datePickerCalendar } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory } from "../story.ts";

const Args = S.Struct({ locale: S.Literals(["en-US", "pt-BR"]) });
const Model = S.Struct({
  ...Args.fields,
  focusedDate: S.String,
  month: S.Number,
  selectedDate: S.optional(S.String),
  year: S.Number,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Focused"; date: string }>
  | Readonly<{ _tag: "NextMonth" }>
  | Readonly<{ _tag: "PreviousMonth" }>
  | Readonly<{ _tag: "Selected"; date: string }>
  | Readonly<{ _tag: "Today" }>;

const focused = (date: string): Message => ({ _tag: "Focused", date });
const nextMonth: Message = { _tag: "NextMonth" };
const previousMonth: Message = { _tag: "PreviousMonth" };
const selected = (date: string): Message => ({ _tag: "Selected", date });
const today: Message = { _tag: "Today" };

const update = (model: Model, message: Message): Model => {
  if (message._tag === "Focused") {
    return { ...model, focusedDate: message.date };
  }
  if (message._tag === "Selected") {
    return { ...model, focusedDate: message.date, selectedDate: message.date };
  }
  if (message._tag === "Today") {
    return {
      ...model,
      focusedDate: "2026-08-24",
      month: 8,
      selectedDate: "2026-08-24",
      year: 2026,
    };
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

const view = (model: Model, h: Parameters<typeof datePickerCalendar<Message>>[1]) =>
  datePickerCalendar(
    {
      focusedDate: model.focusedDate,
      highlightedDates: ["2026-08-24"],
      locale: model.locale,
      month: model.month,
      onFocusDate: focused,
      onNextMonth: nextMonth,
      onPreviousMonth: previousMonth,
      onSelectDate: selected,
      onToday: today,
      selectedDate: model.selectedDate,
      today: "2026-08-24",
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
    month: 8,
    year: 2026,
  }),
  update,
  view,
} as const;

const args: typeof Args.Type = { locale: "en-US" };

export default {
  ...componentMeta("date-picker-calendar"),
  argTypes: {
    locale: { control: "select", options: ["en-US", "pt-BR"] },
  },
  title: "Untitled UI/Application/Date Picker Calendar",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs: typeof Args.Type): Model => ({
      ...storyArgs,
      focusedDate: "2026-08-24",
      month: 8,
      selectedDate: "2026-08-24",
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
export const Interactions = {
  ...liveStory(definition),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Next month" }));
    await expect(await canvas.findByRole("heading", { name: "September 2026" })).toBeVisible();
    const target = await canvas.findByRole("gridcell", { name: "Tuesday, September 15, 2026" });
    await userEvent.click(target);
    await waitFor(async () => {
      await expect(
        await canvas.findByRole("gridcell", { name: "Tuesday, September 15, 2026" }),
      ).toHaveAttribute("aria-selected", "true");
    });
    await userEvent.keyboard("{ArrowRight}");
    await expect(
      await canvas.findByRole("gridcell", { name: "Wednesday, September 16, 2026" }),
    ).toHaveFocus();
    await userEvent.click(await canvas.findByRole("button", { name: "Today" }));
    await expect(await canvas.findByRole("heading", { name: "August 2026" })).toBeVisible();
  },
};
