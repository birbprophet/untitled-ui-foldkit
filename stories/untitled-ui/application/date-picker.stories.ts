/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook Controls expose only upstream props; open, selection, and navigation remain in the FoldKit Model. */
import * as S from "effect/Schema";
import { datePicker } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory } from "../story.ts";

const Args = S.Struct({
  locale: S.Literals(["en-US", "pt-BR"]),
  size: S.Literals(["sm", "md"]),
});
const Model = S.Struct({
  ...Args.fields,
  focusedDate: S.String,
  isOpen: S.Boolean,
  month: S.Number,
  selectedDate: S.optional(S.String),
  year: S.Number,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Applied" }>
  | Readonly<{ _tag: "Cancelled" }>
  | Readonly<{ _tag: "Focused"; date: string }>
  | Readonly<{ _tag: "NextMonth" }>
  | Readonly<{ _tag: "Opened" }>
  | Readonly<{ _tag: "PreviousMonth" }>
  | Readonly<{ _tag: "Selected"; date: string }>
  | Readonly<{ _tag: "Today" }>;

const applied: Message = { _tag: "Applied" };
const cancelled: Message = { _tag: "Cancelled" };
const focused = (date: string): Message => ({ _tag: "Focused", date });
const nextMonth: Message = { _tag: "NextMonth" };
const opened: Message = { _tag: "Opened" };
const previousMonth: Message = { _tag: "PreviousMonth" };
const selected = (date: string): Message => ({ _tag: "Selected", date });
const today: Message = { _tag: "Today" };

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

const view = (model: Model, h: Parameters<typeof datePicker<Message>>[1]) =>
  datePicker(
    {
      focusedDate: model.focusedDate,
      highlightedDates: ["2026-08-24"],
      id: "storybook-date-picker",
      isOpen: model.isOpen,
      locale: model.locale,
      month: model.month,
      onApply: applied,
      onCancel: cancelled,
      onFocusDate: focused,
      onNextMonth: nextMonth,
      onOpen: opened,
      onPreviousMonth: previousMonth,
      onSelectDate: selected,
      onToday: today,
      selectedDate: model.selectedDate,
      size: model.size,
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
    isOpen: true,
    month: 8,
    year: 2026,
  }),
  update,
  view,
} as const;
const args: typeof Args.Type = { locale: "en-US", size: "sm" };

export default {
  ...componentMeta("date-picker"),
  argTypes: {
    locale: { control: "select", options: ["en-US", "pt-BR"] },
    size: { control: "select", options: ["sm", "md"] },
  },
  title: "Untitled UI/Application/Date Picker",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs: typeof Args.Type): Model => ({
      ...storyArgs,
      focusedDate: "2026-08-24",
      isOpen: true,
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
export const Interactions = {
  ...liveStory({
    ...definition,
    init: (storyArgs: typeof Args.Type): Model => ({
      ...storyArgs,
      focusedDate: "2026-08-24",
      isOpen: false,
      month: 8,
      year: 2026,
    }),
  }),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Select date" }));
    await expect(await canvas.findByRole("dialog", { name: "Date picker" })).toBeVisible();
    await userEvent.click(await canvas.findByRole("gridcell", { name: "Monday, August 24, 2026" }));
    await userEvent.click(await canvas.findByRole("button", { name: "Apply" }));
    await waitFor(async () => {
      await expect(canvas.queryByRole("dialog", { name: "Date picker" })).not.toBeInTheDocument();
    });
    await expect(await canvas.findByRole("button", { name: "Aug 24, 2026" })).toBeVisible();
  },
};
