/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native slideout commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { notificationSettingsCheckboxMenu } from "../../../src/application.ts";
import type {
  NotificationSettingsCheckbox,
  NotificationSettingsInterval,
} from "../../../src/application.ts";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Setting = S.Literals([
  "email-message-mentions",
  "email-message-replies",
  "email-outstanding-tasks",
  "in-app-message-mentions",
  "in-app-message-replies",
  "in-app-new-projects",
  "in-app-outstanding-tasks",
  "in-app-outstanding-tasks-with-interval",
]);
const Interval = S.Literals(["1-hour", "1-week", "24-hours"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({
  interval: Interval,
  isOpen: S.Boolean,
  locale: Locale,
  selectedSettings: S.Array(Setting),
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const Shown = m("NotificationSettingsCheckboxMenuShown");
const Closed = m("NotificationSettingsCheckboxMenuClosed");
const ShowFailed = m("NotificationSettingsCheckboxMenuShowFailed");
const CloseFailed = m("NotificationSettingsCheckboxMenuCloseFailed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Dismiss" | "Open" | "Save" }>
  | Readonly<{ _tag: "IntervalChanged"; interval: NotificationSettingsInterval }>
  | Readonly<{ _tag: "SettingToggled"; setting: NotificationSettingsCheckbox }>
  | typeof Shown.Type
  | typeof Closed.Type
  | typeof ShowFailed.Type
  | typeof CloseFailed.Type;

const ShowNotificationSettingsCheckboxMenu = Command.define(
  "ShowNotificationSettingsCheckboxMenu",
  {
    args: { selector: S.String },
    execute: ({ selector }) =>
      Dom.showDialog(selector, {
        focusSelector: "[data-notification-settings-checkbox-close]",
      }).pipe(
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
  },
);
const CloseNotificationSettingsCheckboxMenu = Command.define(
  "CloseNotificationSettingsCheckboxMenu",
  {
    args: { selector: S.String },
    execute: ({ selector }) =>
      Dom.closeDialog(selector).pipe(
        Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
      ),
    messages: [Closed, CloseFailed],
  },
);

const action = (tag: "Cancel" | "Dismiss" | "Open" | "Save"): Message => ({ _tag: tag });
const intervalChanged = (interval: NotificationSettingsInterval): Message => ({
  _tag: "IntervalChanged",
  interval,
});
const settingToggled = (setting: NotificationSettingsCheckbox): Message => ({
  _tag: "SettingToggled",
  setting,
});

const allSettings: readonly NotificationSettingsCheckbox[] = [
  "in-app-message-mentions",
  "in-app-message-replies",
  "in-app-new-projects",
  "in-app-outstanding-tasks-with-interval",
  "in-app-outstanding-tasks",
  "email-message-mentions",
  "email-message-replies",
  "email-outstanding-tasks",
];

const definitionWith = (
  interval: NotificationSettingsInterval,
  initialSettings: readonly NotificationSettingsCheckbox[],
  showTrigger = false,
) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      {
        interval,
        isOpen: true,
        locale: args.locale,
        selectedSettings: [...initialSettings],
      } satisfies Model,
      showTrigger
        ? []
        : [
            ShowNotificationSettingsCheckboxMenu({
              selector: "#notification-settings-checkbox-menu-story",
            }),
          ],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "IntervalChanged") {
      return [{ ...model, interval: message.interval }, []] as const;
    }
    if (message._tag === "SettingToggled") {
      const nextSelectedSettings = model.selectedSettings.includes(message.setting)
        ? model.selectedSettings.filter((setting) => setting !== message.setting)
        : [...model.selectedSettings, message.setting];
      return [{ ...model, selectedSettings: nextSelectedSettings }, []] as const;
    }
    if (message._tag === "Open") {
      return [
        { ...model, isOpen: true },
        [
          ShowNotificationSettingsCheckboxMenu({
            selector: "#notification-settings-checkbox-menu-story",
          }),
        ],
      ] as const;
    }
    const updated = {
      ...model,
      isOpen: message._tag === "NotificationSettingsCheckboxMenuClosed" ? false : model.isOpen,
    } satisfies Model;
    return message._tag === "Cancel" || message._tag === "Dismiss" || message._tag === "Save"
      ? ([
          updated,
          [
            CloseNotificationSettingsCheckboxMenu({
              selector: "#notification-settings-checkbox-menu-story",
            }),
          ],
        ] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof notificationSettingsCheckboxMenu<Message>>[1]) =>
    h.div(
      [],
      [
        ...(showTrigger
          ? [
              h.button(
                [
                  h.Class(
                    `rounded-lg bg-bg-brand-solid px-3.5 py-2.5 text-sm font-semibold text-white outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 ${model.isOpen ? "opacity-0" : ""}`,
                  ),
                  h.OnClick(action("Open")),
                  h.Type("button"),
                ],
                [model.locale === "pt-BR" ? "Abrir notificações" : "Open notifications"],
              ),
            ]
          : []),
        notificationSettingsCheckboxMenu(
          {
            id: "notification-settings-checkbox-menu-story",
            interval: model.interval,
            isOpen: model.isOpen,
            locale: model.locale,
            messageForInterval: intervalChanged,
            messageForToggle: settingToggled,
            onCancel: action("Cancel"),
            onDismiss: action("Dismiss"),
            onSave: action("Save"),
            selectedSettings: model.selectedSettings,
          },
          h,
        ),
      ],
    ),
});

const definition = definitionWith("1-hour", allSettings);
const enUs = { locale: "en-US" } satisfies Args;
const ptBr = { locale: "pt-BR" } satisfies Args;
export default {
  ...componentMeta("notification-settings-checkbox-menu"),
  argTypes: { locale: { control: "select", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/Notification Settings Checkbox Menu",
};
export const AllVariants = { ...liveCommandStory(definition), args: enUs };
export const States = {
  ...liveCommandStory(
    definitionWith("1-week", ["in-app-message-mentions", "email-message-replies"]),
  ),
  args: enUs,
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
  args: enUs,
};
export const Responsive = { ...liveCommandStory(definition), args: ptBr };
export const Interactions = {
  ...liveCommandStory(definitionWith("1-hour", [], true)),
  args: ptBr,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = await page.findByRole("button", { name: "Abrir notificações" });
    await userEvent.click(trigger);
    const currentDialog = async () => await page.findByRole("dialog", { name: "Menu lateral" });
    let dialog = await currentDialog();
    await expect(within(dialog).getByRole("button", { name: "Fechar" })).toHaveFocus();
    await userEvent.tab();
    const messageMentionCheckboxes = within(dialog).getAllByRole("checkbox", {
      name: "Menções em mensagens",
    });
    await expect(messageMentionCheckboxes).toHaveLength(2);
    await expect(messageMentionCheckboxes[0]).toHaveFocus();
    await expect(within(dialog).getAllByRole("checkbox")).toHaveLength(8);
    await expect(
      within(dialog)
        .getAllByRole("checkbox")
        .every((control) => !control.matches(":checked")),
    ).toBe(true);
    await userEvent.click(within(dialog).getByRole("checkbox", { name: "Novos projetos" }));
    dialog = await currentDialog();
    await expect(within(dialog).getByRole("checkbox", { name: "Novos projetos" })).toBeChecked();
    const firstInterval = within(dialog).getByRole("radio", { name: "1 hora" });
    firstInterval.focus();
    await userEvent.keyboard("{ArrowDown}");
    dialog = await currentDialog();
    await expect(within(dialog).getByRole("radio", { name: "24 horas" })).toBeChecked();
    dialog = await currentDialog();
    await userEvent.click(within(dialog).getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await currentDialog();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    dialog = await currentDialog();
    await expect(within(dialog).getByRole("checkbox", { name: "Novos projetos" })).toBeChecked();
    await expect(within(dialog).getByRole("radio", { name: "24 horas" })).toBeChecked();
  },
};
