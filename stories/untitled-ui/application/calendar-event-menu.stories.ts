/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noGlobals, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { calendarEventMenu } from "../../../src/application.ts";
import type { CalendarEventResponse } from "../../../src/application.ts";

import { componentMeta, liveCommandStory, waitForStoryReady } from "../story.ts";
import { agentFace } from "../../fixtures/brand.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Response = S.Literals(["maybe", "no", "yes"]);
const Args = S.Struct({ locale: Locale, response: Response });
const Model = S.Struct({ isOpen: S.Boolean, locale: Locale, response: Response });
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const Shown = m("CalendarEventMenuShown");
const ShowFailed = m("CalendarEventMenuShowFailed");
const Closed = m("CalendarEventMenuClosed");
const CloseFailed = m("CalendarEventMenuCloseFailed");
const CloseFinished = m("CalendarEventMenuCloseFinished");
const CloseFinishFailed = m("CalendarEventMenuCloseFinishFailed");
const Released = m("CalendarEventMenuReleased");
type Message =
  | Readonly<{
      _tag: "AddAttendee" | "CopyLink" | "Delete" | "Dismiss" | "Edit" | "Open" | "Unmount";
    }>
  | Readonly<{ _tag: "ResponseChanged"; response: CalendarEventResponse }>
  | typeof Shown.Type
  | typeof ShowFailed.Type
  | typeof Closed.Type
  | typeof CloseFailed.Type
  | typeof CloseFinished.Type
  | typeof CloseFinishFailed.Type
  | typeof Released.Type;

const ShowCalendarEventMenu = Command.define("ShowCalendarEventMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Effect.gen(function* execute() {
      yield* Dom.showDialog(selector, { focusSelector: "[data-calendar-event-close]" });
      yield* Effect.sync(() => {
        const dialog = document.querySelector<HTMLDialogElement>(selector);
        if (dialog !== null) {
          dialog.style.inset = "0 0 0 auto";
        }
      });
      yield* Dom.lockScroll;
      yield* Dom.inertOthers("calendar-event-menu-story", [selector]);
    }).pipe(Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() })),
  messages: [Shown, ShowFailed],
});
const CloseCalendarEventMenu = Command.define("CloseCalendarEventMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed, CloseFailed],
});
const FinishCalendarEventMenuClose = Command.define("FinishCalendarEventMenuClose", {
  args: { focusSelector: S.String, restoreFocus: S.Boolean },
  execute: ({ focusSelector, restoreFocus }) =>
    Effect.gen(function* execute() {
      yield* Dom.restoreInert("calendar-event-menu-story");
      yield* Dom.unlockScroll;
      if (restoreFocus) {
        yield* Dom.focus(focusSelector);
      }
    }).pipe(
      Effect.match({ onFailure: () => CloseFinishFailed(), onSuccess: () => CloseFinished() }),
    ),
  messages: [CloseFinished, CloseFinishFailed],
});
const ReleaseCalendarEventMenu = Command.define("ReleaseCalendarEventMenu", {
  args: { id: S.String },
  execute: ({ id }) =>
    Effect.all([Dom.releaseDialogResources(id), Dom.restoreInert(id)], { concurrency: 1 }).pipe(
      Effect.map(() => Released()),
    ),
  messages: [Released],
});
const action = (
  tag: "AddAttendee" | "CopyLink" | "Delete" | "Dismiss" | "Edit" | "Open" | "Unmount",
): Message => ({ _tag: tag });
const responseChanged = (response: CalendarEventResponse): Message => ({
  _tag: "ResponseChanged",
  response,
});

const definition = (showTrigger = false) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      { isOpen: !showTrigger, locale: args.locale, response: args.response } satisfies Model,
      showTrigger ? [] : [ShowCalendarEventMenu({ selector: "#calendar-event-menu-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "Open") {
      return [
        { ...model, isOpen: true },
        [ShowCalendarEventMenu({ selector: "#calendar-event-menu-story" })],
      ] as const;
    }
    if (message._tag === "ResponseChanged") {
      return [{ ...model, response: message.response }, []] as const;
    }
    if (message._tag === "Dismiss") {
      return [
        model,
        [
          CloseCalendarEventMenu({
            selector: "#calendar-event-menu-story",
          }),
        ],
      ] as const;
    }
    if (message._tag === "Unmount") {
      return [model, [ReleaseCalendarEventMenu({ id: "calendar-event-menu-story" })]] as const;
    }
    if (
      message._tag === "CalendarEventMenuClosed" ||
      message._tag === "CalendarEventMenuCloseFailed"
    ) {
      return [
        { ...model, isOpen: false },
        [
          FinishCalendarEventMenuClose({
            focusSelector: "[data-calendar-event-menu-trigger]",
            restoreFocus: showTrigger,
          }),
        ],
      ] as const;
    }
    if (message._tag === "CalendarEventMenuShowFailed") {
      return [{ ...model, isOpen: false }, []] as const;
    }
    return [model, []] as const;
  },
  view: (model: Model, h: Parameters<typeof calendarEventMenu<Message>>[1]) =>
    h.div(
      [h.Class("min-h-24")],
      [
        ...(showTrigger
          ? [
              h.button(
                [
                  h.Class(
                    model.isOpen
                      ? "pointer-events-none opacity-0"
                      : "rounded-lg bg-brand-solid px-4 py-2.5 text-sm font-semibold text-white shadow-xs outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.DataAttribute("calendar-event-menu-trigger", ""),
                  h.OnClick(action("Open")),
                  h.Type("button"),
                ],
                ["Abrir evento"],
              ),
            ]
          : []),
        calendarEventMenu(
          {
            avatars: {
              "ammar-foley": agentFace("Ammar Foley"),
              "mathilde-lewis": agentFace("Mathilde Lewis"),
              "olly-schroeder": agentFace("Olly Schroeder"),
              "pippa-wilkinson": agentFace("Pippa Wilkinson"),
              "sienna-hewitt": agentFace("Sienna Hewitt"),
            },
            id: "calendar-event-menu-story",
            isOpen: model.isOpen,
            locale: model.locale,
            onAddAttendee: action("AddAttendee"),
            onCopyLink: action("CopyLink"),
            onDelete: action("Delete"),
            onDismiss: action("Dismiss"),
            onEdit: action("Edit"),
            onResponse: responseChanged,
            onUnmount: action("Unmount"),
            response: model.response,
          },
          h,
        ),
      ],
    ),
});

const inactive = { locale: "en-US", response: "yes" } as const satisfies Args;
const partial = { locale: "en-US", response: "no" } satisfies Args;
const activated = { locale: "en-US", response: "maybe" } satisfies Args;
const localizedInteraction = { locale: "pt-BR", response: "yes" } satisfies Args;
export default {
  ...componentMeta("calendar-event-menu"),
  argTypes: {
    locale: { control: "select", options: ["en-US", "pt-BR"] },
    response: { control: "select", options: ["yes", "no", "maybe"] },
  },
  title: "Untitled UI/Application/Calendar Event Menu",
};
export const AllVariants = { ...liveCommandStory(definition()), args: inactive };
export const States = { ...liveCommandStory(definition()), args: partial };
export const Dark = {
  ...liveCommandStory({
    ...definition(),
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition().view(model, h)],
      ),
  }),
  args: activated,
};
export const Responsive = { ...liveCommandStory(definition()), args: inactive };
export const Interactions = {
  ...liveCommandStory(definition(true)),
  args: localizedInteraction,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const currentDialog = () =>
      page.findByRole("dialog", { name: "Menu lateral" }, { timeout: 15_000 });
    const currentResponse = async (name: "Não" | "Sim" | "Talvez") =>
      await within(await currentDialog()).findByRole("button", { name });
    const trigger = await page.findByRole("button", { name: "Abrir evento" });

    await userEvent.click(trigger);
    await expect(
      within(await currentDialog()).getByRole("button", { name: "Fechar" }),
    ).toHaveFocus();
    await expect(await currentDialog()).toHaveAttribute("dir", "ltr");
    await expect(await currentDialog()).toHaveAttribute("lang", "pt-BR");
    await expect(
      within(await currentDialog()).getByText("sexta-feira, 10 de jan. de 2027"),
    ).toBeVisible();
    await expect(within(await currentDialog()).getByText("13:30 - 15:30")).toBeVisible();
    await expect(await currentResponse("Sim")).toHaveAttribute("aria-pressed", "true");

    const keyboardResponse = await currentResponse("Talvez");
    keyboardResponse.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(async () => {
      await expect(await currentResponse("Talvez")).toHaveAttribute("aria-pressed", "true");
    });

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("dialog", { name: "Menu lateral" })).toBeNull(), {
      timeout: 15_000,
    });
    await waitFor(() => expect(trigger).not.toHaveClass("pointer-events-none"), {
      timeout: 15_000,
    });
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    await expect(await currentDialog()).toBeVisible();
    const overlayDismiss = canvasElement.ownerDocument.querySelector<HTMLButtonElement>(
      '[data-calendar-event-overlay="calendar-event-menu-story"] > button',
    );
    await expect(overlayDismiss).not.toBeNull();
    if (overlayDismiss !== null) {
      await userEvent.click(overlayDismiss);
    }
    await waitFor(() => expect(page.queryByRole("dialog", { name: "Menu lateral" })).toBeNull(), {
      timeout: 15_000,
    });
    await waitFor(() => expect(trigger).not.toHaveClass("pointer-events-none"), {
      timeout: 15_000,
    });
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    await expect(await currentDialog()).toBeVisible();
    const finalResponse = await currentResponse("Talvez");
    finalResponse.focus();
    await expect(await currentResponse("Talvez")).toHaveAttribute("aria-pressed", "true");
    await expect(await currentDialog()).toBeVisible();
  },
};
