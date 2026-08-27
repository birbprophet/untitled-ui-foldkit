/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-low-signal-variable-names, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { datePickerModal } from "ui/application";
import type { DateRangeValue } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({ locale: Locale });
const Range = S.Struct({ end: S.String, start: S.String });
const Model = S.Struct({
  focusedDate: S.String,
  isOpen: S.Boolean,
  locale: Locale,
  month: S.Number,
  range: Range,
  year: S.Number,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const Shown = m("DatePickerModalShown");
const Closed = m("DatePickerModalClosed");
type Message =
  | Readonly<{ _tag: "Apply" | "Cancel" | "Dismiss" | "Next" | "Previous" }>
  | Readonly<{ _tag: "Focus" | "Select"; date: string }>
  | Readonly<{ _tag: "Preset"; range: DateRangeValue }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowDatePickerModal = Command.define("ShowDatePickerModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseDatePickerModal = Command.define("CloseDatePickerModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const simple = (tag: "Apply" | "Cancel" | "Dismiss" | "Next" | "Previous"): Message => ({
  _tag: tag,
});
const moveMonth = (model: Model, delta: -1 | 1): Model => {
  const value = model.month + delta;
  if (value === 0) {
    return { ...model, month: 12, year: model.year - 1 };
  }
  if (value === 13) {
    return { ...model, month: 1, year: model.year + 1 };
  }
  return {
    ...model,
    month: value,
  };
};
const focus = (date: string): Message => ({ _tag: "Focus", date });
const preset = (range: DateRangeValue): Message => ({ _tag: "Preset", range });
const select = (date: string): Message => ({ _tag: "Select", date });
const nextRange = (range: DateRangeValue, date: string): DateRangeValue =>
  date < range.start || range.start !== range.end
    ? { end: date, start: date }
    : { end: date, start: range.start };

const definition = {
  Args,
  Model,
  init: (args: Args) =>
    [
      {
        focusedDate: "2026-08-25",
        isOpen: true,
        locale: args.locale,
        month: 8,
        range: { end: "2026-08-25", start: "2026-08-18" },
        year: 2026,
      } satisfies Model,
      [ShowDatePickerModal({ selector: "#date-picker-modal-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "Focus") {
      return [{ ...model, focusedDate: message.date }, []] as const;
    }
    if (message._tag === "Preset") {
      const [year = model.year, month = model.month] = message.range.start.split("-").map(Number);
      return [
        { ...model, focusedDate: message.range.start, month, range: message.range, year },
        [],
      ] as const;
    }
    if (message._tag === "Select") {
      return [
        { ...model, focusedDate: message.date, range: nextRange(model.range, message.date) },
        [],
      ] as const;
    }
    if (message._tag === "Next" || message._tag === "Previous") {
      return [moveMonth(model, message._tag === "Next" ? 1 : -1), []] as const;
    }
    const next = {
      ...model,
      isOpen: message._tag === "DatePickerModalClosed" ? false : model.isOpen,
    };
    return message._tag === "Apply" || message._tag === "Cancel" || message._tag === "Dismiss"
      ? ([next, [CloseDatePickerModal({ selector: "#date-picker-modal-story" })]] as const)
      : ([next, []] as const);
  },
  view: (model: Model, h: Parameters<typeof datePickerModal<Message>>[1]) =>
    datePickerModal(
      {
        focusedDate: model.focusedDate,
        id: "date-picker-modal-story",
        isOpen: model.isOpen,
        locale: model.locale,
        messageForFocusDate: focus,
        messageForPreset: preset,
        messageForSelectDate: select,
        month: model.month,
        onApply: simple("Apply"),
        onCancel: simple("Cancel"),
        onDismiss: simple("Dismiss"),
        onNextMonth: simple("Next"),
        onPreviousMonth: simple("Previous"),
        range: model.range,
        today: "2026-08-25",
        year: model.year,
      },
      h,
    ),
};
const fixture = { locale: "en-US" } satisfies Args;

export default {
  ...componentMeta("date-picker-modal"),
  title: "Untitled UI/Application/Date Picker Modal",
};
export const AllVariants = { ...liveCommandStory(definition), args: fixture };
export const States = { ...liveCommandStory(definition), args: fixture };
export const Dark = {
  ...liveCommandStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: fixture,
};
export const Responsive = { ...liveCommandStory(definition), args: fixture };
export const Interactions = {
  ...liveCommandStory(definition),
  args: fixture,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement.ownerDocument.body);
    const dialog = await canvas.findByRole("dialog", { name: "Date picker" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Last month" }));
    await waitFor(async () => {
      const currentDialog = canvas.getByRole("dialog", { name: "Date picker" });
      await expect(
        within(currentDialog).getByRole("gridcell", { name: /July 1, 2026/u }),
      ).toHaveAttribute("aria-selected", "true");
    });
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#date-picker-modal-story")).toBeNull(),
    );
  },
};
