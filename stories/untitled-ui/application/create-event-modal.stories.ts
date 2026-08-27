/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-low-signal-variable-names, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook play functions and native dialog commands use promise-based browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { createEventModal } from "../../../src/application.ts";
import type { DateRangeValue } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({ locale: Locale });
const Range = S.Struct({ end: S.String, start: S.String });
const Model = S.Struct({
  canAttendeesInvite: S.Boolean,
  description: S.String,
  endDateTime: S.String,
  focusedDate: S.String,
  isOpen: S.Boolean,
  locale: Locale,
  location: S.String,
  month: S.Number,
  range: Range,
  startDateTime: S.String,
  title: S.String,
  year: S.Number,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const DialogShown = m("CreateEventDialogShown");
const DialogClosed = m("CreateEventDialogClosed");
type Field = "description" | "endDateTime" | "location" | "startDateTime" | "title";
type Message =
  | Readonly<{
      _tag: "Cancel" | "Create" | "Dismiss" | "NextMonth" | "PreviousMonth" | "ToggleInvites";
    }>
  | Readonly<{ _tag: "FieldChanged"; field: Field; value: string }>
  | Readonly<{ _tag: "FocusDate" | "SelectDate"; date: string }>
  | Readonly<{ _tag: "Preset"; value: DateRangeValue }>
  | typeof DialogShown.Type
  | typeof DialogClosed.Type;

const ShowCreateEventDialog = Command.define("ShowCreateEventDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => DialogShown(), onSuccess: () => DialogShown() }),
    ),
  messages: [DialogShown],
});

const CloseCreateEventDialog = Command.define("CloseCreateEventDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => DialogClosed(), onSuccess: () => DialogClosed() }),
    ),
  messages: [DialogClosed],
});

const simple = (
  tag: "Cancel" | "Create" | "Dismiss" | "NextMonth" | "PreviousMonth" | "ToggleInvites",
): Message => ({ _tag: tag });

const moveMonth = (model: Model, offset: -1 | 1): Pick<Model, "month" | "year"> => {
  const value = model.month + offset;
  if (value === 0) {
    return { month: 12, year: model.year - 1 };
  }
  if (value === 13) {
    return { month: 1, year: model.year + 1 };
  }
  return { month: value, year: model.year };
};

const fieldUpdate = (model: Model, field: Field, value: string): Model => ({
  ...model,
  [field]: value,
});

const fieldChanged = (field: Field, value: string): Message => ({
  _tag: "FieldChanged",
  field,
  value,
});
const focusDate = (date: string): Message => ({ _tag: "FocusDate", date });
const selectDate = (date: string): Message => ({ _tag: "SelectDate", date });
const preset = (value: DateRangeValue): Message => ({ _tag: "Preset", value });

const nextRange = (range: DateRangeValue, date: string): DateRangeValue =>
  date < range.start || range.start !== range.end
    ? { end: date, start: date }
    : { end: date, start: range.start };

const definitionWith = (attendeesCanInvite: boolean, description: string) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      {
        canAttendeesInvite: attendeesCanInvite,
        description,
        endDateTime: "2027-01-14T12:00",
        focusedDate: "2027-01-08",
        isOpen: true,
        locale: args.locale,
        location: "",
        month: 1,
        range: { end: "2027-01-14", start: "2027-01-08" },
        startDateTime: "2027-01-08T10:00",
        title: "Company retreat",
        year: 2027,
      } satisfies Model,
      [ShowCreateEventDialog({ selector: "#create-event-modal-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "FieldChanged") {
      return [fieldUpdate(model, message.field, message.value), []] as const;
    }
    if (message._tag === "FocusDate") {
      return [{ ...model, focusedDate: message.date }, []] as const;
    }
    if (message._tag === "Preset") {
      return [{ ...model, focusedDate: message.value.start, range: message.value }, []] as const;
    }
    if (message._tag === "SelectDate") {
      return [
        { ...model, focusedDate: message.date, range: nextRange(model.range, message.date) },
        [],
      ] as const;
    }
    if (message._tag === "NextMonth" || message._tag === "PreviousMonth") {
      return [
        {
          ...model,
          ...moveMonth(model, message._tag === "NextMonth" ? 1 : -1),
        },
        [],
      ] as const;
    }
    if (message._tag === "ToggleInvites") {
      return [{ ...model, canAttendeesInvite: !model.canAttendeesInvite }, []] as const;
    }
    const next = {
      ...model,
      isOpen: message._tag === "CreateEventDialogClosed" ? false : model.isOpen,
    } satisfies Model;
    return message._tag === "Cancel" || message._tag === "Create" || message._tag === "Dismiss"
      ? ([next, [CloseCreateEventDialog({ selector: "#create-event-modal-story" })]] as const)
      : ([next, []] as const);
  },
  view: (model: Model, h: Parameters<typeof createEventModal<Message>>[1]) =>
    createEventModal(
      {
        attendeesCanInvite: model.canAttendeesInvite,
        description: model.description,
        endDateTime: model.endDateTime,
        focusedDate: model.focusedDate,
        id: "create-event-modal-story",
        isOpen: model.isOpen,
        locale: model.locale,
        location: model.location,
        messageForDescription: (value) => fieldChanged("description", value),
        messageForEndDateTime: (value) => fieldChanged("endDateTime", value),
        messageForFocusDate: focusDate,
        messageForLocation: (value) => fieldChanged("location", value),
        messageForPreset: preset,
        messageForSelectDate: selectDate,
        messageForStartDateTime: (value) => fieldChanged("startDateTime", value),
        messageForTitle: (value) => fieldChanged("title", value),
        month: model.month,
        onCancel: simple("Cancel"),
        onCreate: simple("Create"),
        onDismiss: simple("Dismiss"),
        onNextMonth: simple("NextMonth"),
        onPreviousMonth: simple("PreviousMonth"),
        onToggleAttendeeInvites: simple("ToggleInvites"),
        range: model.range,
        startDateTime: model.startDateTime,
        title: model.title,
        today: "2027-01-08",
        year: model.year,
      },
      h,
    ),
});

const fixture = { locale: "en-US" } satisfies Args;
const definition = definitionWith(false, "");

export default {
  ...componentMeta("create-event-modal"),
  title: "Untitled UI/Application/Create Event Modal",
};

export const AllVariants = { ...liveCommandStory(definition), args: fixture };

export const States = {
  ...liveCommandStory(definitionWith(true, "Annual company planning retreat.")),
  args: fixture,
};

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
  args: { locale: "pt-BR" } satisfies Args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const dialog = await canvas.findByRole("dialog", { name: "Criar evento" });
    await expect(dialog).toBeVisible();
    await expect(await canvas.findByText("janeiro 2027")).toBeVisible();
    await expect(await canvas.findByRole("group", { name: "Data inicial" })).toHaveTextContent(
      "8 / 1 / 2027 , 10 : 00",
    );
    const startHour = await canvas.findByRole("spinbutton", {
      name: "Data inicial segment 4",
    });
    startHour.focus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(await canvas.findByRole("group", { name: "Data inicial" })).toHaveTextContent(
      "8 / 1 / 2027 , 11 : 00",
    );
    const title = await canvas.findByRole("textbox", { name: /Título/u });
    await userEvent.clear(title);
    await userEvent.type(title, "Retiro da empresa");
    await expect(title).toHaveValue("Retiro da empresa");
    await userEvent.click(
      await canvas.findByRole("checkbox", {
        name: "Participantes podem convidar outras pessoas",
      }),
    );
    await userEvent.click(await canvas.findByRole("button", { name: "Criar evento" }));
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
  },
};
