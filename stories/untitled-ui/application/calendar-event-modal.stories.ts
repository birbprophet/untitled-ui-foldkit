/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook play functions and native dialog commands use promise-based browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { calendarEventModal } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const CalendarEventLocale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({ locale: CalendarEventLocale });
const Model = S.Struct({ isOpen: S.Boolean, locale: CalendarEventLocale });
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const DialogShown = m("CalendarEventDialogShown");
const DialogClosed = m("CalendarEventDialogClosed");
type Message =
  | Readonly<{ _tag: "Accept" | "AddAttendee" | "Decline" | "Dismiss" | "Maybe" }>
  | typeof DialogShown.Type
  | typeof DialogClosed.Type;
const simple = (tag: "Accept" | "AddAttendee" | "Decline" | "Dismiss" | "Maybe"): Message => ({
  _tag: tag,
});

const ShowCalendarEventDialog = Command.define("ShowCalendarEventDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "button" }).pipe(
      Effect.match({ onFailure: () => DialogShown(), onSuccess: () => DialogShown() }),
    ),
  messages: [DialogShown],
});

const CloseCalendarEventDialog = Command.define("CloseCalendarEventDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => DialogClosed(), onSuccess: () => DialogClosed() }),
    ),
  messages: [DialogClosed],
});

const fixture = { locale: "en-US" } satisfies Args;

const definition = {
  Args,
  Model,
  init: (args: Args) =>
    [
      { ...args, isOpen: true } satisfies Model,
      [ShowCalendarEventDialog({ selector: "#calendar-event-modal-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    const next = {
      ...model,
      isOpen: message._tag === "CalendarEventDialogClosed" ? false : model.isOpen,
    } satisfies Model;
    return message._tag === "Accept" || message._tag === "Decline" || message._tag === "Dismiss"
      ? ([next, [CloseCalendarEventDialog({ selector: "#calendar-event-modal-story" })]] as const)
      : ([next, []] as const);
  },
  view: (model: Model, h: Parameters<typeof calendarEventModal<Message>>[1]) =>
    calendarEventModal(
      {
        id: "calendar-event-modal-story",
        isOpen: model.isOpen,
        locale: model.locale,
        onAccept: simple("Accept"),
        onAddAttendee: simple("AddAttendee"),
        onDecline: simple("Decline"),
        onDismiss: simple("Dismiss"),
        onMaybe: simple("Maybe"),
      },
      h,
    ),
};

export default {
  ...componentMeta("calendar-event-modal"),
  title: "Untitled UI/Application/Calendar Event Modal",
};

export const AllVariants = { ...liveCommandStory(definition), args: fixture };

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
    const dialog = await canvas.findByRole("dialog", { name: "Convite: Demonstração do produto" });
    await expect(dialog).toBeVisible();
    await expect(await canvas.findByText("sexta-feira, 10 de jan. de 2027")).toBeVisible();
    await expect(await canvas.findByText("13:30 - 15:30")).toBeVisible();
    await userEvent.click(await canvas.findByRole("button", { name: "Adicionar participante" }));
    await userEvent.click(await canvas.findByRole("button", { name: "Aceitar" }));
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
  },
};
