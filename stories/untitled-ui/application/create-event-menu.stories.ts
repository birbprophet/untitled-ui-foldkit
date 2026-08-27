/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-low-signal-variable-names, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native slideout commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  createEventDateTimeNavigationTarget,
  createEventMenu,
  inputCreateEventDateTimeSegment,
} from "ui/application";

import { componentMeta, liveCommandStory, waitForStoryReady } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({
  canInviteOthers: S.Boolean,
  canModifyEvent: S.Boolean,
  canSeeGuestList: S.Boolean,
  description: S.String,
  endDateTime: S.String,
  enteredKeys: S.String,
  entryField: S.Literals(["endDateTime", "none", "startDateTime"]),
  entrySegment: S.Number,
  isOpen: S.Boolean,
  locale: Locale,
  location: S.String,
  shouldReopen: S.Boolean,
  startDateTime: S.String,
  title: S.String,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const Shown = m("CreateEventMenuShown");
const ShowFailed = m("CreateEventMenuShowFailed");
const Closed = m("CreateEventMenuClosed");
const CloseFailed = m("CreateEventMenuCloseFailed");
const Released = m("CreateEventMenuReleased");
const Reopen = m("CreateEventMenuReopen");
const SegmentFocused = m("CreateEventMenuSegmentFocused");
const SegmentFocusFailed = m("CreateEventMenuSegmentFocusFailed");
type Field = "description" | "endDateTime" | "location" | "startDateTime" | "title";
type DateTimeField = "endDateTime" | "startDateTime";
type FixtureState = "activated" | "inactive" | "partial";
type Message =
  | Readonly<{
      _tag:
        | "Cancel"
        | "Create"
        | "Dismiss"
        | "Open"
        | "ToggleInvite"
        | "ToggleList"
        | "ToggleModify"
        | "Unmount";
    }>
  | Readonly<{ _tag: "FieldChanged"; field: Field; value: string }>
  | Readonly<{ _tag: "SegmentDigit"; digit: number; field: DateTimeField; segment: number }>
  | Readonly<{
      _tag: "SegmentNavigate";
      direction: -1 | 1;
      field: DateTimeField;
      segment: number;
    }>
  | Readonly<{ _tag: "SegmentReceivedFocus"; field: DateTimeField; segment: number }>
  | typeof Shown.Type
  | typeof ShowFailed.Type
  | typeof Closed.Type
  | typeof CloseFailed.Type
  | typeof Released.Type
  | typeof Reopen.Type
  | typeof SegmentFocused.Type
  | typeof SegmentFocusFailed.Type;

const ShowCreateEventMenu = Command.define("ShowCreateEventMenu", {
  args: { selector: S.String, triggerSelector: S.String },
  execute: ({ selector, triggerSelector }) =>
    Effect.gen(function* execute() {
      yield* Dom.focus(triggerSelector);
      yield* Dom.showDialog(selector, { focusSelector: "[data-create-event-close]" });
      yield* Dom.lockScroll;
      yield* Dom.inertOthers("create-event-menu-story", [selector]);
    }).pipe(Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() })),
  messages: [Shown, ShowFailed],
});
const CloseCreateEventMenu = Command.define("CloseCreateEventMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Effect.gen(function* close() {
      yield* Dom.restoreInert("create-event-menu-story");
      yield* Dom.closeDialog(selector);
      yield* Dom.unlockScroll;
    }).pipe(
      Effect.matchEffect({
        onFailure: () =>
          Effect.all(
            [
              Dom.releaseDialogResources("create-event-menu-story"),
              Dom.restoreInert("create-event-menu-story"),
            ],
            { concurrency: 1 },
          ).pipe(Effect.map(() => CloseFailed())),
        onSuccess: () => Effect.succeed(Closed()),
      }),
    ),
  messages: [Closed, CloseFailed],
});
const ReleaseCreateEventMenu = Command.define("ReleaseCreateEventMenu", {
  args: { id: S.String },
  execute: ({ id }) =>
    Effect.all([Dom.releaseDialogResources(id), Dom.restoreInert(id)], {
      concurrency: 1,
    }).pipe(Effect.map(() => Released())),
  messages: [Released],
});
const ReopenCreateEventMenu = Command.define("ReopenCreateEventMenu", {
  args: { id: S.String },
  execute: () => Effect.sleep("700 millis").pipe(Effect.map(() => Reopen())),
  messages: [Reopen],
});
const FocusCreateEventSegment = Command.define("FocusCreateEventSegment", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.focus(selector).pipe(
      Effect.match({ onFailure: () => SegmentFocusFailed(), onSuccess: () => SegmentFocused() }),
    ),
  messages: [SegmentFocused, SegmentFocusFailed],
});
const action = (
  tag:
    | "Cancel"
    | "Create"
    | "Dismiss"
    | "Open"
    | "ToggleInvite"
    | "ToggleList"
    | "ToggleModify"
    | "Unmount",
): Message => ({ _tag: tag });
const fieldChanged = (field: Field, value: string): Message => ({
  _tag: "FieldChanged",
  field,
  value,
});
const segmentDigit = (field: DateTimeField, segment: number, digit: number): Message => ({
  _tag: "SegmentDigit",
  digit,
  field,
  segment,
});
const segmentNavigate = (field: DateTimeField, segment: number, direction: -1 | 1): Message => ({
  _tag: "SegmentNavigate",
  direction,
  field,
  segment,
});
const segmentReceivedFocus = (field: DateTimeField, segment: number): Message => ({
  _tag: "SegmentReceivedFocus",
  field,
  segment,
});

const triggerClassName = (showTrigger: boolean, isOpen: boolean): string => {
  if (!showTrigger) {
    return "sr-only";
  }
  return isOpen
    ? "pointer-events-none opacity-0"
    : "rounded-lg bg-brand-solid px-4 py-2.5 text-sm font-semibold text-white shadow-xs outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2";
};

const segmentSelector = (field: DateTimeField, segment: number): string =>
  `#create-event-menu-story-${field === "startDateTime" ? "start" : "end"}-date-segment-${String(segment)}`;

type DateTimeSegmentMessage = Extract<
  Message,
  { readonly _tag: "SegmentDigit" | "SegmentNavigate" | "SegmentReceivedFocus" }
>;
const isDateTimeSegmentMessage = (message: Message): message is DateTimeSegmentMessage =>
  message._tag === "SegmentDigit" ||
  message._tag === "SegmentNavigate" ||
  message._tag === "SegmentReceivedFocus";

const updateDateTimeSegment = (model: Model, next: DateTimeSegmentMessage) => {
  if (next._tag === "SegmentReceivedFocus") {
    return [
      { ...model, enteredKeys: "", entryField: next.field, entrySegment: next.segment },
      [],
    ] as const;
  }
  if (next._tag === "SegmentNavigate") {
    const target = createEventDateTimeNavigationTarget(model.locale, next.segment, next.direction);
    return [
      { ...model, enteredKeys: "", entryField: next.field, entrySegment: target },
      [FocusCreateEventSegment({ selector: segmentSelector(next.field, target) })],
    ] as const;
  }
  const enteredKeys =
    model.entryField === next.field && model.entrySegment === next.segment ? model.enteredKeys : "";
  const result = inputCreateEventDateTimeSegment(
    model[next.field],
    model.locale,
    next.segment,
    next.digit,
    enteredKeys,
  );
  const target = createEventDateTimeNavigationTarget(model.locale, next.segment, 1);
  return [
    {
      ...model,
      [next.field]: result.value,
      enteredKeys: result.enteredKeys,
      entryField: next.field,
      entrySegment: result.focusNext ? target : next.segment,
    },
    result.focusNext
      ? [FocusCreateEventSegment({ selector: segmentSelector(next.field, target) })]
      : [],
  ] as const;
};

const definitionWith = (fixtureState: FixtureState, shouldReopen = false, showTrigger = false) => ({
  Args,
  Model,
  init: (args: Args) => {
    const localizedDescription =
      args.locale === "pt-BR"
        ? "Retiro anual de planejamento da empresa."
        : "Annual company planning retreat.";
    const localizedTitle = args.locale === "pt-BR" ? "Retiro da empresa" : "Company retreat";
    return [
      {
        canInviteOthers: fixtureState !== "inactive",
        canModifyEvent: fixtureState === "activated",
        canSeeGuestList: fixtureState !== "inactive",
        description: fixtureState === "activated" ? localizedDescription : "",
        endDateTime: "2027-01-14T12:00",
        enteredKeys: "",
        entryField: "none",
        entrySegment: -1,
        isOpen: !showTrigger,
        locale: args.locale,
        location: fixtureState === "activated" ? "Serra da Mantiqueira" : "",
        shouldReopen,
        startDateTime: "2027-01-08T09:00",
        title: fixtureState === "inactive" ? "" : localizedTitle,
      } satisfies Model,
      showTrigger
        ? []
        : [
            ShowCreateEventMenu({
              selector: "#create-event-menu-story",
              triggerSelector: "#create-event-menu-trigger",
            }),
          ],
    ] as const;
  },
  update: (model: Model, next: Message) => {
    if (isDateTimeSegmentMessage(next)) {
      return updateDateTimeSegment(model, next);
    }
    if (next._tag === "FieldChanged") {
      return [{ ...model, [next.field]: next.value }, []] as const;
    }
    if (next._tag === "ToggleInvite") {
      return [{ ...model, canInviteOthers: !model.canInviteOthers }, []] as const;
    }
    if (next._tag === "ToggleList") {
      return [{ ...model, canSeeGuestList: !model.canSeeGuestList }, []] as const;
    }
    if (next._tag === "ToggleModify") {
      return [{ ...model, canModifyEvent: !model.canModifyEvent }, []] as const;
    }
    if (next._tag === "Cancel" || next._tag === "Create" || next._tag === "Dismiss") {
      return [model, [CloseCreateEventMenu({ selector: "#create-event-menu-story" })]] as const;
    }
    if (next._tag === "Open" || next._tag === "CreateEventMenuReopen") {
      return [
        { ...model, isOpen: true },
        [
          ShowCreateEventMenu({
            selector: "#create-event-menu-story",
            triggerSelector: "#create-event-menu-trigger",
          }),
        ],
      ] as const;
    }
    if (next._tag === "CreateEventMenuClosed") {
      return model.shouldReopen
        ? ([
            { ...model, isOpen: false },
            [ReopenCreateEventMenu({ id: "create-event-menu-story" })],
          ] as const)
        : ([{ ...model, isOpen: false }, []] as const);
    }
    if (next._tag === "Unmount") {
      return [model, [ReleaseCreateEventMenu({ id: "create-event-menu-story" })]] as const;
    }
    if (next._tag === "CreateEventMenuCloseFailed" || next._tag === "CreateEventMenuShowFailed") {
      return [{ ...model, isOpen: false }, []] as const;
    }
    return [model, []] as const;
  },
  view: (model: Model, h: Parameters<typeof createEventMenu<Message>>[1]) =>
    h.div(
      [],
      [
        h.button(
          [
            h.AriaLabel(model.locale === "pt-BR" ? "Abrir menu de evento" : "Open event menu"),
            h.Class(triggerClassName(showTrigger, model.isOpen)),
            h.Id("create-event-menu-trigger"),
            h.OnClick(action("Open")),
            h.Type("button"),
          ],
          [model.locale === "pt-BR" ? "Abrir menu de evento" : "Open event menu"],
        ),
        createEventMenu(
          {
            canInviteOthers: model.canInviteOthers,
            canModifyEvent: model.canModifyEvent,
            canSeeGuestList: model.canSeeGuestList,
            description: model.description,
            endDateTime: model.endDateTime,
            id: "create-event-menu-story",
            isOpen: model.isOpen,
            locale: model.locale,
            location: model.location,
            messageForDescription: (value: string) => fieldChanged("description", value),
            messageForEndDateTime: (value: string) => fieldChanged("endDateTime", value),
            messageForEndDateTimeDigit: (segment, digit) =>
              segmentDigit("endDateTime", segment, digit),
            messageForEndDateTimeNavigation: (segment, direction) =>
              segmentNavigate("endDateTime", segment, direction),
            messageForEndDateTimeSegmentFocus: (segment) =>
              segmentReceivedFocus("endDateTime", segment),
            messageForLocation: (value: string) => fieldChanged("location", value),
            messageForStartDateTime: (value: string) => fieldChanged("startDateTime", value),
            messageForStartDateTimeDigit: (segment, digit) =>
              segmentDigit("startDateTime", segment, digit),
            messageForStartDateTimeNavigation: (segment, direction) =>
              segmentNavigate("startDateTime", segment, direction),
            messageForStartDateTimeSegmentFocus: (segment) =>
              segmentReceivedFocus("startDateTime", segment),
            messageForTitle: (value: string) => fieldChanged("title", value),
            onCancel: action("Cancel"),
            onCreate: action("Create"),
            onDismiss: action("Dismiss"),
            onToggleInviteOthers: action("ToggleInvite"),
            onToggleModifyEvent: action("ToggleModify"),
            onToggleSeeGuestList: action("ToggleList"),
            onUnmount: action("Unmount"),
            startDateTime: model.startDateTime,
            title: model.title,
          },
          h,
        ),
      ],
    ),
});

const fixture = { locale: "en-US" } satisfies Args;
const definition = definitionWith("partial");
const activatedDefinition = definitionWith("activated");
const interactiveDefinition = definitionWith("partial", true, true);
const meta = componentMeta("create-event-menu");
export default { ...meta, title: "Untitled UI/Application/Create Event Menu" };
export const AllVariants = { ...liveCommandStory(definition), args: fixture };
export const States = { ...liveCommandStory(definitionWith("inactive")), args: fixture };
export const Dark = {
  ...liveCommandStory({
    ...activatedDefinition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [activatedDefinition.view(model, h)],
      ),
  }),
  args: fixture,
};
export const Responsive = { ...liveCommandStory(definition), args: fixture };
export const Interactions = {
  ...liveCommandStory(interactiveDefinition),
  args: fixture,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = await page.findByRole("button", { name: "Open event menu" });
    await userEvent.click(trigger);
    let dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await expect(dialog).toHaveAttribute("dir", "ltr");
    await expect(dialog).toHaveAttribute("lang", "en-US");
    await expect(within(dialog).getByRole("heading", { name: "Create event" })).toBeVisible();
    await expect(within(dialog).getByRole("button", { name: "Close" })).toHaveFocus();
    await expect(within(dialog).getByRole("group", { name: "Start date" })).toHaveTextContent(
      "1 / 8 / 2027 , 9 : 00 AM",
    );
    const month = within(dialog).getByRole("spinbutton", { name: "Start date, month" });
    month.focus();
    await userEvent.keyboard("{ArrowRight}");
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await expect(within(dialog).getByRole("spinbutton", { name: "Start date, day" })).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await expect(
      within(dialog).getByRole("spinbutton", { name: "Start date, month" }),
    ).toHaveFocus();
    let hour = within(dialog).getByRole("spinbutton", { name: "Start date, hour" });
    hour.focus();
    await userEvent.keyboard("11");
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await expect(within(dialog).getByRole("group", { name: "Start date" })).toHaveTextContent(
      "1 / 8 / 2027 , 11 : 00 AM",
    );
    await expect(
      within(dialog).getByRole("spinbutton", { name: "Start date, minute" }),
    ).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    hour = within(dialog).getByRole("spinbutton", { name: "Start date, hour" });
    await expect(hour).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await expect(within(dialog).getByRole("group", { name: "Start date" })).toHaveTextContent(
      "1 / 8 / 2027 , 12 : 00 PM",
    );
    let location = within(dialog).getByRole("textbox", { name: "Location" });
    await userEvent.type(location, "New York");
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    location = within(dialog).getByRole("textbox", { name: "Location" });
    await expect(location).toHaveValue("New York");
    await userEvent.click(within(dialog).getByRole("checkbox", { name: "Modify event" }));
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await expect(within(dialog).getByRole("checkbox", { name: "Modify event" })).toBeChecked();
    await userEvent.keyboard("{Escape}");
    await waitFor(
      () => expect(page.queryByRole("dialog", { name: "Slideout menu" })).not.toBeInTheDocument(),
      { timeout: 5000 },
    );
    await expect(trigger).toHaveFocus();
    dialog = await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 5000 });
    await expect(within(dialog).getByRole("textbox", { name: "Location" })).toHaveValue("New York");
    await expect(within(dialog).getByRole("checkbox", { name: "Modify event" })).toBeChecked();
    await expect(within(dialog).getByRole("button", { name: "Close" })).toHaveFocus();
    const overlayDismiss = canvasElement.ownerDocument.querySelector<HTMLButtonElement>(
      '[data-slideout-overlay="create-event-menu-story"] > button',
    );
    await expect(overlayDismiss).not.toBeNull();
    if (overlayDismiss !== null) {
      await userEvent.click(overlayDismiss);
    }
    await waitFor(
      () => expect(page.queryByRole("dialog", { name: "Slideout menu" })).not.toBeInTheDocument(),
      { timeout: 5000 },
    );
    await expect(trigger).toHaveFocus();
    dialog = await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 5000 });
    await userEvent.click(within(dialog).getByRole("button", { name: "Create event" }));
    await waitFor(
      () => expect(page.queryByRole("dialog", { name: "Slideout menu" })).not.toBeInTheDocument(),
      { timeout: 5000 },
    );
    await expect(trigger).toHaveFocus();
    dialog = await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 5000 });
    location = within(dialog).getByRole("textbox", { name: "Location" });
    await userEvent.clear(location);
    await userEvent.click(within(dialog).getByRole("checkbox", { name: "Modify event" }));
    dialog = await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 5000 });
    await expect(within(dialog).getByRole("textbox", { name: "Location" })).toHaveValue("");
    await expect(within(dialog).getByRole("checkbox", { name: "Modify event" })).not.toBeChecked();
    hour = within(dialog).getByRole("spinbutton", { name: "Start date, hour" });
    hour.focus();
    await userEvent.keyboard("09");
    dialog = await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 5000 });
    await expect(within(dialog).getByRole("group", { name: "Start date" })).toHaveTextContent(
      "1 / 8 / 2027 , 9 : 00 AM",
    );
    within(dialog).getByRole("button", { name: "Close" }).focus();
    await expect(within(dialog).getByRole("button", { name: "Close" })).toHaveFocus();
  },
};
