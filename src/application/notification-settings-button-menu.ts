/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer keeps the authenticated slideout and setting anatomy explicit. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export type NotificationSettingsButtonMenuLocale = "en-US" | "pt-BR";
export type NotificationChannel = "none" | "in-app" | "email";
export type NotificationIntervalUnit = "hours" | "days" | "weeks" | "months" | "years";
export type NotificationSetting =
  | "message-mentions"
  | "message-replies"
  | "new-projects"
  | "outstanding-tasks"
  | "new-team-members";

export interface NotificationSettingsButtonMenuProps<Message> {
  readonly channels: Readonly<Record<NotificationSetting, NotificationChannel>>;
  readonly focusedChannels: Readonly<Record<NotificationSetting, NotificationChannel>>;
  readonly id: string;
  readonly intervalAmount: string;
  readonly intervalUnit: NotificationIntervalUnit;
  readonly isOpen: boolean;
  readonly locale: NotificationSettingsButtonMenuLocale;
  readonly onAddCustom: NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onChannelChange: (
    setting: NotificationSetting,
    channel: NotificationChannel,
  ) => NoInfer<Message>;
  readonly onChannelFocus: (
    setting: NotificationSetting,
    channel: NotificationChannel,
  ) => NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onIntervalAmountInput: (value: string) => NoInfer<Message>;
  readonly onIntervalUnitChange: (unit: NotificationIntervalUnit) => NoInfer<Message>;
  readonly onSave: NoInfer<Message>;
}

const copy = {
  "en-US": {
    addCustom: "Add custom notification",
    cancel: "Cancel",
    channels: { email: "Email", "in-app": "In-app", none: "None" },
    close: "Close",
    description: "Manage when you'll receive notifications.",
    dialog: "Slideout menu",
    intervalAmount: "Custom notification interval amount",
    intervalUnit: "Custom notification interval unit",
    save: "Save",
    settings: {
      "message-mentions": {
        description: "I'm mentioned in a message or comment.",
        title: "Message mentions",
      },
      "message-replies": {
        description: "Someone replies to any message or comment.",
        title: "Message replies",
      },
      "new-projects": {
        description: "New projects are created on my team.",
        title: "New projects",
      },
      "new-team-members": {
        description: "New users have been added to my team.",
        title: "New team members",
      },
      "outstanding-tasks": {
        description: "I've had outstanding tasks for more than.",
        title: "Outstanding tasks",
      },
    },
    title: "Notifications",
    units: { days: "Days", hours: "Hours", months: "Months", weeks: "Weeks", years: "Years" },
  },
  "pt-BR": {
    addCustom: "Adicionar notificação personalizada",
    cancel: "Cancelar",
    channels: { email: "E-mail", "in-app": "No aplicativo", none: "Nenhuma" },
    close: "Fechar",
    description: "Gerencie quando você receberá notificações.",
    dialog: "Menu lateral",
    intervalAmount: "Quantidade do intervalo de notificação personalizada",
    intervalUnit: "Unidade do intervalo de notificação personalizada",
    save: "Salvar",
    settings: {
      "message-mentions": {
        description: "Sou mencionado em uma mensagem ou comentário.",
        title: "Menções em mensagens",
      },
      "message-replies": {
        description: "Alguém responde a uma mensagem ou comentário.",
        title: "Respostas a mensagens",
      },
      "new-projects": {
        description: "Novos projetos são criados na minha equipe.",
        title: "Novos projetos",
      },
      "new-team-members": {
        description: "Novos usuários foram adicionados à minha equipe.",
        title: "Novos membros da equipe",
      },
      "outstanding-tasks": {
        description: "Tenho tarefas pendentes há mais de.",
        title: "Tarefas pendentes",
      },
    },
    title: "Notificações",
    units: { days: "Dias", hours: "Horas", months: "Meses", weeks: "Semanas", years: "Anos" },
  },
} as const;

const settingOrder: readonly NotificationSetting[] = [
  "message-mentions",
  "message-replies",
  "new-projects",
  "outstanding-tasks",
  "new-team-members",
];
const channelOrder: readonly NotificationChannel[] = ["none", "in-app", "email"];
const channelFocusDelta: Readonly<Record<string, number>> = { ArrowLeft: -1, ArrowRight: 1 };
const unitOrder: readonly NotificationIntervalUnit[] = [
  "hours",
  "days",
  "weeks",
  "months",
  "years",
];

const intervalUnitFrom = (candidate: string): NotificationIntervalUnit =>
  unitOrder.find((unit) => unit === candidate) ?? "hours";

const pathIcon = <Message>(path: string, className: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(className),
      h.DataAttribute("icon", ""),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(path),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon("M18 6 6 18M6 6l12 12", "size-5 shrink-0 transition-inherit-all", h);
const plusIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon("M12 5v14m-7-7h14", "size-5", h);
const chevronIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "m8 10 4 4 4-4",
    "pointer-events-none absolute top-2.5 right-2.5 size-5 text-fg-quaternary",
    h,
  );

const intervalFields = <Message>(
  props: NotificationSettingsButtonMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const labels = copy[props.locale];
  return h.span(
    [h.Class("flex justify-start gap-3")],
    [
      h.input([
        h.AriaLabel(labels.intervalAmount),
        h.Class(
          "w-13 rounded-lg bg-bg-primary px-3 py-2 text-md text-text-primary shadow-xs ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
        ),
        h.Attribute("inputmode", "numeric"),
        h.OnInput(props.onIntervalAmountInput),
        h.Type("text"),
        h.Value(props.intervalAmount),
      ]),
      h.span(
        [h.Class("relative w-26")],
        [
          h.select(
            [
              h.AriaLabel(labels.intervalUnit),
              h.Class(
                "w-full appearance-none rounded-lg bg-bg-primary py-2 pr-9 pl-3 text-md text-text-primary shadow-xs ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
              ),
              h.OnChange((unit: string) => props.onIntervalUnitChange(intervalUnitFrom(unit))),
              h.Value(props.intervalUnit),
            ],
            unitOrder.map((unit) => h.option([h.Value(unit)], [labels.units[unit]])),
          ),
          chevronIcon(h),
        ],
      ),
    ],
  );
};

const channelGroup = <Message>(
  setting: NotificationSetting,
  props: NotificationSettingsButtonMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const labels = copy[props.locale];
  return h.div(
    [
      h.AriaLabel(labels.settings[setting].title),
      h.Attribute("aria-orientation", "horizontal"),
      h.Class("relative z-0 inline-flex w-max -space-x-px rounded-lg shadow-xs"),
      h.Role("radiogroup"),
    ],
    channelOrder.map((channel, index) => {
      const selected = props.channels[setting] === channel;
      const focused = props.focusedChannels[setting] === channel;
      return h.button(
        [
          h.AriaChecked(selected),
          h.Class(
            `inline-flex h-max cursor-pointer items-center gap-1.5 bg-bg-primary py-2 pl-3.5 text-sm font-semibold whitespace-nowrap text-text-secondary shadow-skeuomorphic ring-1 ring-border-primary outline-focus-ring transition duration-100 ease-linear ring-inset hover:bg-bg-primary-hover hover:text-text-secondary-hover focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 ${selected ? "bg-bg-primary-hover text-text-secondary-hover" : ""} ${index === 0 ? "rounded-l-lg" : ""} ${index === channelOrder.length - 1 ? "rounded-r-lg pr-3.5" : "pr-[15px]"}`,
          ),
          h.DataAttribute("channel", channel),
          h.DataAttribute("setting", setting),
          h.OnClick(props.onChannelChange(setting, channel)),
          h.OnKeyDownFocus((key) => {
            const delta = channelFocusDelta[key] ?? 0;
            if (delta === 0) {
              return Option.none();
            }
            const next = channelOrder[(index + delta + channelOrder.length) % channelOrder.length];
            return next === undefined
              ? Option.none()
              : Option.some({
                  focusSelector: `[data-setting="${setting}"][data-channel="${next}"]`,
                  message: props.onChannelFocus(setting, next),
                });
          }),
          h.Role("radio"),
          h.Tabindex(focused ? 0 : -1),
          h.Type("button"),
        ],
        [labels.channels[channel]],
      );
    }),
  );
};

const settingSection = <Message>(
  setting: NotificationSetting,
  props: NotificationSettingsButtonMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const labels = copy[props.locale];
  const text = labels.settings[setting];
  return h.section(
    [h.Class("flex flex-col gap-4")],
    [
      h.span(
        [h.Class("flex flex-col gap-1")],
        [
          h.p([h.Class("text-sm font-semibold text-text-primary")], [text.title]),
          h.p([h.Class("text-sm text-text-tertiary")], [text.description]),
        ],
      ),
      ...(setting === "outstanding-tasks" ? [intervalFields(props, h)] : []),
      channelGroup(setting, props, h),
    ],
  );
};

export const notificationSettingsButtonMenu = <Message>(
  props: NotificationSettingsButtonMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const labels = copy[props.locale];
  const descriptionId = `${props.id}-description`;
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-end bg-overlay/70 pl-6 outline-hidden ease-linear md:pl-10",
              ),
              h.DataAttribute("slideout-overlay", props.id),
            ],
            [
              h.div([h.AriaHidden(true), h.Class("absolute inset-0"), h.OnClick(props.onDismiss)]),
              h.dialog(
                [
                  h.AriaDescribedBy(descriptionId),
                  h.AriaLabel(labels.dialog),
                  h.Attribute("dir", "ltr"),
                  h.Class(
                    "fixed inset-y-0 right-0 left-auto m-0 h-full w-[calc(100%-1.5rem)] max-w-100 overflow-hidden border-0 bg-bg-primary p-0 shadow-xl ring-1 ring-border-secondary-alt outline-hidden md:w-full",
                  ),
                  h.Id(props.id),
                  h.Lang(props.locale),
                  h.OnCancel(props.onDismiss),
                  h.Style({ left: "auto" }),
                ],
                [
                  h.div(
                    [
                      h.Class(
                        "relative flex size-full flex-col items-start gap-6 overflow-y-auto bg-bg-primary outline-hidden",
                      ),
                    ],
                    [
                      h.header(
                        [h.Class("relative z-1 flex w-full flex-col gap-0.5 px-4 pt-6 md:px-6")],
                        [
                          h.h1(
                            [h.Class("text-md font-semibold text-text-primary md:text-lg")],
                            [labels.title],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            [labels.description],
                          ),
                          h.button(
                            [
                              h.AriaLabel(labels.close),
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("notification-settings-button-close", ""),
                              h.OnClick(props.onDismiss),
                              h.Type("button"),
                            ],
                            [closeIcon(h)],
                          ),
                        ],
                      ),
                      h.main(
                        [
                          h.Class(
                            "flex size-full flex-col gap-6 overflow-y-auto overscroll-auto px-4 pb-6 md:px-6",
                          ),
                        ],
                        [
                          ...settingOrder.map((setting) => settingSection(setting, props, h)),
                          h.span(
                            [h.Class("w-max")],
                            [
                              button(
                                {
                                  color: "link-color",
                                  iconLeadingElement: plusIcon(h),
                                  label: labels.addCustom,
                                  onPress: props.onAddCustom,
                                  size: "md",
                                },
                                h,
                              ),
                            ],
                          ),
                        ],
                      ),
                      h.footer(
                        [
                          h.Class(
                            "flex w-full items-center justify-end gap-3 p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6",
                          ),
                        ],
                        [
                          button(
                            {
                              color: "secondary",
                              label: labels.cancel,
                              onPress: props.onCancel,
                              size: "sm",
                            },
                            h,
                          ),
                          button({ label: labels.save, onPress: props.onSave, size: "sm" }, h),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ]
      : [],
  );
};
