/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled native slideout preserves the authenticated notification-settings checkbox anatomy and duplicate source fixture. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { checkbox } from "../base/controls.ts";

export type NotificationSettingsCheckboxMenuLocale = "en-US" | "pt-BR";
export type NotificationSettingsCheckbox =
  | "email-message-mentions"
  | "email-message-replies"
  | "email-outstanding-tasks"
  | "in-app-message-mentions"
  | "in-app-message-replies"
  | "in-app-new-projects"
  | "in-app-outstanding-tasks"
  | "in-app-outstanding-tasks-with-interval";
export type NotificationSettingsInterval = "1-hour" | "1-week" | "24-hours";

export interface NotificationSettingsCheckboxMenuProps<Message> {
  readonly id: string;
  readonly interval: NotificationSettingsInterval;
  readonly isOpen: boolean;
  readonly locale: NotificationSettingsCheckboxMenuLocale;
  readonly messageForInterval: (interval: NotificationSettingsInterval) => NoInfer<Message>;
  readonly messageForToggle: (setting: NotificationSettingsCheckbox) => NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onSave: NoInfer<Message>;
  readonly selectedSettings: readonly NotificationSettingsCheckbox[];
}

const copy = {
  "en-US": {
    cancel: "Cancel",
    close: "Close",
    dialog: "Slideout menu",
    email: "Email notifications",
    emailSubtitle: "Select when you'll be notified in-app.",
    inApp: "In-app notifications",
    inAppSubtitle: "Select when you'll be notified in-app.",
    intervals: {
      "1-hour": "1 hour",
      "1-week": "1 week",
      "24-hours": "24 hours",
    },
    messageMentions: "Message mentions",
    messageMentionsHint: "I'm mentioned in a message or comment.",
    messageReplies: "Message replies",
    messageRepliesHint: "Someone replies to any message or comment.",
    newProjects: "New projects",
    newProjectsHint: "New projects are created on my team.",
    outstandingTasks: "Outstanding tasks",
    outstandingTasksHint: "I've had outstanding tasks for more than:",
    save: "Save",
    subtitle: "Manage when you'll receive notifications.",
    title: "Notifications",
  },
  "pt-BR": {
    cancel: "Cancelar",
    close: "Fechar",
    dialog: "Menu lateral",
    email: "Notificações por e-mail",
    emailSubtitle: "Selecione quando você receberá notificações no aplicativo.",
    inApp: "Notificações no aplicativo",
    inAppSubtitle: "Selecione quando você receberá notificações no aplicativo.",
    intervals: {
      "1-hour": "1 hora",
      "1-week": "1 semana",
      "24-hours": "24 horas",
    },
    messageMentions: "Menções em mensagens",
    messageMentionsHint: "Meu nome é mencionado em uma mensagem ou comentário.",
    messageReplies: "Respostas a mensagens",
    messageRepliesHint: "Alguém responde a uma mensagem ou comentário.",
    newProjects: "Novos projetos",
    newProjectsHint: "Novos projetos são criados na minha equipe.",
    outstandingTasks: "Tarefas pendentes",
    outstandingTasksHint: "Tenho tarefas pendentes há mais de:",
    save: "Salvar",
    subtitle: "Gerencie quando você receberá notificações.",
    title: "Notificações",
  },
} as const;

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 transition-inherit-all"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("M18 6 6 18M6 6l12 12"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const intervalOptions = ["1-hour", "24-hours", "1-week"] as const;

const intervalGroup = <Message>(
  props: NotificationSettingsCheckboxMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const labels = copy[props.locale];
  return h.fieldset(
    [h.Class("flex flex-col gap-3 pl-6")],
    [
      h.legend([h.Class("sr-only")], [labels.outstandingTasks]),
      ...intervalOptions.map((interval) => {
        const selected = props.interval === interval;
        return h.label(
          [h.Class("relative flex cursor-pointer items-start gap-2")],
          [
            h.input([
              h.Attribute("aria-labelledby", `${props.id}-${interval}-label`),
              h.Checked(selected),
              h.Class("peer sr-only"),
              h.Name(`${props.id}-outstanding-tasks-interval`),
              h.OnChange(() => props.messageForInterval(interval)),
              h.Type("radio"),
              h.Value(interval),
            ]),
            h.span(
              [
                h.Class(
                  `mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full ring-1 ring-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring ${selected ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"}`,
                ),
              ],
              [
                h.span([
                  h.Class(
                    `size-1.5 rounded-full bg-fg-white ${selected ? "opacity-100" : "opacity-0"}`,
                  ),
                ]),
              ],
            ),
            h.span(
              [
                h.Class("text-sm font-medium text-text-secondary select-none"),
                h.Id(`${props.id}-${interval}-label`),
              ],
              [labels.intervals[interval]],
            ),
          ],
        );
      }),
    ],
  );
};

const setting = <Message>(
  props: NotificationSettingsCheckboxMenuProps<Message>,
  id: NotificationSettingsCheckbox,
  label: string,
  hint: string,
  h: HtmlBuilder<Message>,
): Html =>
  checkbox(
    {
      hint,
      isSelected: props.selectedSettings.includes(id),
      label,
      name: `${props.id}-${id}`,
      onToggle: props.messageForToggle(id),
      value: id,
    },
    h,
  );

export const notificationSettingsCheckboxMenu = <Message>(
  props: NotificationSettingsCheckboxMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const labels = copy[props.locale];
  const titleId = `${props.id}-title`;
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
              h.button([
                h.AriaHidden(true),
                h.Class("fixed inset-0 cursor-default border-0 bg-transparent p-0"),
                h.OnClick(props.onDismiss),
                h.Tabindex(-1),
                h.Type("button"),
              ]),
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
                            [
                              h.Class("text-md font-semibold text-text-primary md:text-lg"),
                              h.Id(titleId),
                            ],
                            [labels.title],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            [labels.subtitle],
                          ),
                          h.button(
                            [
                              h.AriaLabel(labels.close),
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("notification-settings-checkbox-close", ""),
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
                            "flex size-full flex-col gap-6 overflow-y-auto overscroll-auto px-4 md:px-6",
                          ),
                        ],
                        [
                          h.form(
                            [h.Class("flex flex-col gap-6")],
                            [
                              h.div(
                                [h.Class("flex flex-col gap-4")],
                                [
                                  h.span(
                                    [h.Class("flex flex-col gap-1")],
                                    [
                                      h.p(
                                        [h.Class("text-sm font-semibold text-text-primary")],
                                        [labels.inApp],
                                      ),
                                      h.p(
                                        [h.Class("text-sm text-text-tertiary")],
                                        [labels.inAppSubtitle],
                                      ),
                                    ],
                                  ),
                                  h.section(
                                    [h.Class("flex flex-col gap-3 pl-2")],
                                    [
                                      setting(
                                        props,
                                        "in-app-message-mentions",
                                        labels.messageMentions,
                                        labels.messageMentionsHint,
                                        h,
                                      ),
                                      setting(
                                        props,
                                        "in-app-message-replies",
                                        labels.messageReplies,
                                        labels.messageRepliesHint,
                                        h,
                                      ),
                                      setting(
                                        props,
                                        "in-app-new-projects",
                                        labels.newProjects,
                                        labels.newProjectsHint,
                                        h,
                                      ),
                                      setting(
                                        props,
                                        "in-app-outstanding-tasks-with-interval",
                                        labels.outstandingTasks,
                                        labels.outstandingTasksHint,
                                        h,
                                      ),
                                      intervalGroup(props, h),
                                      setting(
                                        props,
                                        "in-app-outstanding-tasks",
                                        labels.outstandingTasks,
                                        labels.outstandingTasksHint,
                                        h,
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              h.span([
                                h.Class("w-full border-t border-border-secondary"),
                                h.Id("divider"),
                              ]),
                              h.div(
                                [h.Class("flex flex-col gap-4")],
                                [
                                  h.span(
                                    [h.Class("flex flex-col gap-1")],
                                    [
                                      h.p(
                                        [h.Class("text-sm font-semibold text-text-primary")],
                                        [labels.email],
                                      ),
                                      h.p(
                                        [h.Class("text-sm text-text-tertiary")],
                                        [labels.emailSubtitle],
                                      ),
                                    ],
                                  ),
                                  h.section(
                                    [h.Class("flex flex-col gap-3 pl-2")],
                                    [
                                      setting(
                                        props,
                                        "email-message-mentions",
                                        labels.messageMentions,
                                        labels.messageMentionsHint,
                                        h,
                                      ),
                                      setting(
                                        props,
                                        "email-message-replies",
                                        labels.messageReplies,
                                        labels.messageRepliesHint,
                                        h,
                                      ),
                                      setting(
                                        props,
                                        "email-outstanding-tasks",
                                        labels.outstandingTasks,
                                        labels.outstandingTasksHint,
                                        h,
                                      ),
                                    ],
                                  ),
                                ],
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
                          button(
                            {
                              color: "primary",
                              label: labels.save,
                              onPress: props.onSave,
                              size: "sm",
                            },
                            h,
                          ),
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
