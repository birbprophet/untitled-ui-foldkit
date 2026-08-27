/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { notificationSettingsButtonMenu } from "../../../src/application.ts";
import type {
  NotificationChannel,
  NotificationIntervalUnit,
  NotificationSetting,
} from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({ locale: S.Literals(["en-US", "pt-BR"]) });
const Channels = S.Struct({
  "message-mentions": S.Literals(["none", "in-app", "email"]),
  "message-replies": S.Literals(["none", "in-app", "email"]),
  "new-projects": S.Literals(["none", "in-app", "email"]),
  "new-team-members": S.Literals(["none", "in-app", "email"]),
  "outstanding-tasks": S.Literals(["none", "in-app", "email"]),
});
const Model = S.Struct({
  canReopen: S.Boolean,
  channels: Channels,
  focusedChannels: Channels,
  intervalAmount: S.String,
  intervalUnit: S.Literals(["hours", "days", "weeks", "months", "years"]),
  isOpen: S.Boolean,
  locale: S.Literals(["en-US", "pt-BR"]),
  shouldReopen: S.Boolean,
});
type Model = typeof Model.Type;
const Shown = m("NotificationSettingsButtonMenuShown");
const Closed = m("NotificationSettingsButtonMenuClosed");
const ShowFailed = m("NotificationSettingsButtonMenuShowFailed");
const CloseFailed = m("NotificationSettingsButtonMenuCloseFailed");
type Message =
  | Readonly<{ _tag: "AddCustom" | "Cancel" | "Dismiss" | "Save" }>
  | Readonly<{ _tag: "ChannelChange"; channel: NotificationChannel; setting: NotificationSetting }>
  | Readonly<{ _tag: "ChannelFocus"; channel: NotificationChannel; setting: NotificationSetting }>
  | Readonly<{ _tag: "IntervalAmountInput"; value: string }>
  | Readonly<{ _tag: "IntervalUnitChange"; unit: NotificationIntervalUnit }>
  | typeof Shown.Type
  | typeof Closed.Type
  | typeof ShowFailed.Type
  | typeof CloseFailed.Type;

const ShowNotificationSettingsButtonMenu = Command.define("ShowNotificationSettingsButtonMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[data-notification-settings-button-close]" }).pipe(
      Effect.tap(() =>
        Effect.sync(() => {
          const dialog = document.querySelector<HTMLDialogElement>(selector);
          if (dialog?.localName === "dialog") {
            dialog.style.left = "auto";
          }
        }),
      ),
      Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() }),
    ),
  messages: [Shown, ShowFailed],
});
const CloseNotificationSettingsButtonMenu = Command.define("CloseNotificationSettingsButtonMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed, CloseFailed],
});
const action = (tag: "AddCustom" | "Cancel" | "Dismiss" | "Save"): Message => ({ _tag: tag });
const channelChange = (setting: NotificationSetting, channel: NotificationChannel): Message => ({
  _tag: "ChannelChange",
  channel,
  setting,
});
const channelFocus = (setting: NotificationSetting, channel: NotificationChannel): Message => ({
  _tag: "ChannelFocus",
  channel,
  setting,
});
const intervalAmountInput = (intervalAmount: string): Message => ({
  _tag: "IntervalAmountInput",
  value: intervalAmount,
});
const intervalUnitChange = (unit: NotificationIntervalUnit): Message => ({
  _tag: "IntervalUnitChange",
  unit,
});

const sourceChannels: Readonly<Record<NotificationSetting, NotificationChannel>> = {
  "message-mentions": "email",
  "message-replies": "email",
  "new-projects": "in-app",
  "new-team-members": "in-app",
  "outstanding-tasks": "in-app",
};
const stateChannels: Readonly<Record<NotificationSetting, NotificationChannel>> = {
  "message-mentions": "in-app",
  "message-replies": "none",
  "new-projects": "email",
  "new-team-members": "none",
  "outstanding-tasks": "email",
};
const inactiveChannels: Readonly<Record<NotificationSetting, NotificationChannel>> = {
  "message-mentions": "none",
  "message-replies": "none",
  "new-projects": "none",
  "new-team-members": "none",
  "outstanding-tasks": "none",
};
const channelFixtures = {
  inactive: inactiveChannels,
  source: sourceChannels,
  states: stateChannels,
} as const;

const makeDefinition = (state: "inactive" | "source" | "states", canReopen = false) => ({
  Args,
  Model,
  init: (args: typeof Args.Type) =>
    [
      {
        canReopen,
        channels: channelFixtures[state],
        focusedChannels: inactiveChannels,
        intervalAmount: state === "source" ? "24" : "2",
        intervalUnit: state === "source" ? "hours" : "weeks",
        isOpen: true,
        locale: args.locale,
        shouldReopen: false,
      } satisfies Model,
      [
        ShowNotificationSettingsButtonMenu({
          selector: "#notification-settings-button-menu-story",
        }),
      ],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "ChannelChange") {
      return [
        { ...model, channels: { ...model.channels, [next.setting]: next.channel } },
        [],
      ] as const;
    }
    if (next._tag === "ChannelFocus") {
      return [
        {
          ...model,
          focusedChannels: { ...model.focusedChannels, [next.setting]: next.channel },
        },
        [],
      ] as const;
    }
    if (next._tag === "IntervalAmountInput") {
      return [{ ...model, intervalAmount: next.value }, []] as const;
    }
    if (next._tag === "IntervalUnitChange") {
      return [{ ...model, intervalUnit: next.unit }, []] as const;
    }
    if (next._tag === "NotificationSettingsButtonMenuClosed" && model.shouldReopen) {
      return [
        { ...model, isOpen: true, shouldReopen: false },
        [
          ShowNotificationSettingsButtonMenu({
            selector: "#notification-settings-button-menu-story",
          }),
        ],
      ] as const;
    }
    const updated = {
      ...model,
      isOpen:
        next._tag === "NotificationSettingsButtonMenuClosed" ||
        next._tag === "NotificationSettingsButtonMenuCloseFailed" ||
        next._tag === "NotificationSettingsButtonMenuShowFailed"
          ? false
          : model.isOpen,
      shouldReopen: next._tag === "Dismiss" ? model.canReopen : false,
    };
    return next._tag === "Cancel" || next._tag === "Dismiss" || next._tag === "Save"
      ? ([
          updated,
          [
            CloseNotificationSettingsButtonMenu({
              selector: "#notification-settings-button-menu-story",
            }),
          ],
        ] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof notificationSettingsButtonMenu<Message>>[1]) =>
    notificationSettingsButtonMenu(
      {
        channels: model.channels,
        focusedChannels: model.focusedChannels,
        id: "notification-settings-button-menu-story",
        intervalAmount: model.intervalAmount,
        intervalUnit: model.intervalUnit,
        isOpen: model.isOpen,
        locale: model.locale,
        onAddCustom: action("AddCustom"),
        onCancel: action("Cancel"),
        onChannelChange: channelChange,
        onChannelFocus: channelFocus,
        onDismiss: action("Dismiss"),
        onIntervalAmountInput: intervalAmountInput,
        onIntervalUnitChange: intervalUnitChange,
        onSave: action("Save"),
      },
      h,
    ),
});

const definition = makeDefinition("source");
const meta = componentMeta("notification-settings-button-menu");
export default {
  ...meta,
  argTypes: { locale: { control: "inline-radio", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/Notification Settings Button Menu",
};
export const AllVariants = { ...liveCommandStory(definition), args: { locale: "en-US" } };
export const States = {
  ...liveCommandStory(makeDefinition("states")),
  args: { locale: "en-US" },
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
  args: { locale: "en-US" },
};
export const Responsive = { ...liveCommandStory(definition), args: { locale: "en-US" } };
export const Interactions = {
  ...liveCommandStory(makeDefinition("inactive", true)),
  args: { locale: "pt-BR" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const currentDialog = async () => await page.findByRole("dialog", { name: "Menu lateral" });
    const currentAmount = async () =>
      within(await currentDialog()).getByLabelText(
        "Quantidade do intervalo de notificação personalizada",
      );
    let dialog = await currentDialog();
    await expect(within(dialog).getByRole("button", { name: "Fechar" })).toHaveFocus();
    let mentions = within(dialog).getByRole("radiogroup", { name: "Menções em mensagens" });
    await userEvent.tab();
    await expect(within(mentions).getByRole("radio", { name: "Nenhuma" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    dialog = await currentDialog();
    mentions = within(dialog).getByRole("radiogroup", { name: "Menções em mensagens" });
    await expect(within(mentions).getByRole("radio", { name: "No aplicativo" })).toHaveFocus();
    await expect(within(mentions).getByRole("radio", { name: "Nenhuma" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await userEvent.keyboard(" ");
    await waitFor(() =>
      expect(
        within(page.getByRole("radiogroup", { name: "Menções em mensagens" })).getByRole("radio", {
          name: "No aplicativo",
        }),
      ).toHaveAttribute("aria-checked", "true"),
    );
    let amount = await currentAmount();
    await userEvent.clear(amount);
    amount = await currentAmount();
    await userEvent.type(amount, "4");
    amount = await currentAmount();
    await userEvent.type(amount, "8");
    dialog = await currentDialog();
    await userEvent.selectOptions(
      within(dialog).getByLabelText("Unidade do intervalo de notificação personalizada"),
      "days",
    );
    await expect(await currentAmount()).toHaveValue("48");
    dialog = await currentDialog();
    const unit = within(dialog).getByLabelText("Unidade do intervalo de notificação personalizada");
    await expect(unit).toHaveValue("days");
    const outstanding = within(dialog).getByRole("radiogroup", { name: "Tarefas pendentes" });
    await userEvent.click(within(outstanding).getByRole("radio", { name: "E-mail" }));
    dialog = await currentDialog();
    await waitFor(() =>
      expect(
        within(page.getByRole("radiogroup", { name: "Tarefas pendentes" })).getByRole("radio", {
          name: "E-mail",
        }),
      ).toHaveAttribute("aria-checked", "true"),
    );
    await userEvent.click(within(dialog).getByRole("button", { name: "Fechar" }));
    await currentDialog();
    await waitFor(() =>
      expect(
        within(page.getByRole("radiogroup", { name: "Menções em mensagens" })).getByRole("radio", {
          name: "No aplicativo",
        }),
      ).toHaveAttribute("aria-checked", "true"),
    );
    await waitFor(() =>
      expect(
        within(page.getByRole("radiogroup", { name: "Menções em mensagens" })).getByRole("radio", {
          name: "No aplicativo",
        }),
      ).toBeVisible(),
    );
    await waitFor(() =>
      expect(
        within(page.getByRole("radiogroup", { name: "Tarefas pendentes" })).getByRole("radio", {
          name: "E-mail",
        }),
      ).toHaveAttribute("aria-checked", "true"),
    );
  },
};
