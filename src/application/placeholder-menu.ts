/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noTernary -- placeholder-menu is the authenticated Untitled UI component ID, and its skeleton surfaces are the source fixture. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export type PlaceholderMenuLocale = "en-US" | "pt-BR";

export interface PlaceholderMenuProps<Message> {
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale: PlaceholderMenuLocale;
  readonly onCancel: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onSave: NoInfer<Message>;
}

const copy = {
  "en-US": {
    cancel: "Cancel",
    close: "Close",
    description: "Configure your project preferences.",
    integrationDescription:
      "Connect your project with external services like Slack, GitHub, or Figma. Enable notifications and sync data automatically to keep your team updated on changes.",
    integrationDescriptionMobile:
      "Connect your project with external services like Slack, GitHub, or Figma. Enable notifications and sync data automatically.",
    integrationTitle: "Integration settings",
    nameDescription:
      "Update your project name and description. This will be visible to all team members and appears in your dashboard and shared links. Changes will take effect immediately.",
    nameDescriptionMobile:
      "Update your project name and description. This will be visible to all team members and appears in your dashboard.",
    nameTitle: "Project name",
    permissionsDescription:
      "Manage who can view, edit, and share your project. You can invite new team members or update existing permissions for current collaborators at any time.",
    permissionsDescriptionMobile:
      "Manage who can view, edit, and share your project. You can invite new team members or update existing permissions.",
    permissionsTitle: "Team permissions",
    save: "Save",
    slideout: "Slideout menu",
    title: "Project settings",
  },
  "pt-BR": {
    cancel: "Cancelar",
    close: "Fechar",
    description: "Configure as preferências do seu projeto.",
    integrationDescription:
      "Conecte seu projeto a serviços externos como Slack, GitHub ou Figma. Ative notificações e sincronize dados automaticamente para manter sua equipe informada sobre as alterações.",
    integrationDescriptionMobile:
      "Conecte seu projeto a serviços externos como Slack, GitHub ou Figma. Ative notificações e sincronize dados automaticamente.",
    integrationTitle: "Configurações de integração",
    nameDescription:
      "Atualize o nome e a descrição do seu projeto. Isso ficará visível para todos os membros da equipe e aparecerá no painel e nos links compartilhados. As alterações entrarão em vigor imediatamente.",
    nameDescriptionMobile:
      "Atualize o nome e a descrição do seu projeto. Isso ficará visível para todos os membros da equipe e aparecerá no painel.",
    nameTitle: "Nome do projeto",
    permissionsDescription:
      "Gerencie quem pode visualizar, editar e compartilhar seu projeto. Você pode convidar novos membros da equipe ou atualizar as permissões de colaboradores atuais a qualquer momento.",
    permissionsDescriptionMobile:
      "Gerencie quem pode visualizar, editar e compartilhar seu projeto. Você pode convidar novos membros da equipe ou atualizar as permissões existentes.",
    permissionsTitle: "Permissões da equipe",
    save: "Salvar",
    slideout: "Menu lateral",
    title: "Configurações do projeto",
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

const featuredIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Class(
        "relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
      ),
    ],
    [
      h.svg(
        [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
        [
          h.path([
            h.D("M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeLinejoin("round"),
            h.StrokeWidth("2"),
          ]),
        ],
      ),
    ],
  );

const settingsSection = <Message>(
  title: string,
  description: string,
  mobileDescription: string,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("flex flex-col gap-4")],
    [
      h.span(
        [h.Class("flex flex-col gap-1")],
        [
          h.p([h.Class("text-sm font-medium text-text-secondary")], [title]),
          h.p([h.Class("text-sm text-text-tertiary max-md:hidden")], [description]),
          h.p([h.Class("text-sm text-text-tertiary md:hidden")], [mobileDescription]),
        ],
      ),
      h.span([h.AriaHidden(true), h.Class("h-20 w-full rounded-lg bg-bg-secondary")]),
    ],
  );

const divider = <Message>(h: HtmlBuilder<Message>): Html =>
  h.div([h.AriaHidden(true), h.Class("w-full border-t border-border-secondary")]);

export const placeholderMenu = <Message>(
  props: PlaceholderMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const labels = copy[props.locale];
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-end bg-overlay/70 pl-6 outline-hidden ease-linear md:pl-10",
              ),
              h.DataAttribute("placeholder-menu-overlay", props.id),
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
                  h.AriaLabel(labels.slideout),
                  h.Class(
                    "fixed inset-y-0 !right-0 !left-auto m-0 h-full w-full max-w-[calc(100%-1.5rem)] overflow-hidden border-0 bg-transparent p-0 shadow-xl outline-hidden transition md:max-w-100",
                  ),
                  h.Id(props.id),
                  h.Lang(props.locale),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.div(
                    [
                      h.Class(
                        "relative flex size-full flex-col items-start gap-6 overflow-y-auto bg-bg-primary ring-1 ring-border-secondary-alt outline-hidden",
                      ),
                    ],
                    [
                      h.header(
                        [h.Class("relative z-1 flex w-full items-start gap-3 px-4 pt-6 md:px-6")],
                        [
                          featuredIcon(h),
                          h.section(
                            [h.Class("flex flex-col gap-0.5")],
                            [
                              h.h1(
                                [h.Class("text-md font-semibold text-text-primary md:text-lg")],
                                [labels.title],
                              ),
                              h.p([h.Class("text-sm text-text-tertiary")], [labels.description]),
                            ],
                          ),
                          h.button(
                            [
                              h.AriaLabel(labels.close),
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("placeholder-menu-close", ""),
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
                          settingsSection(
                            labels.nameTitle,
                            labels.nameDescription,
                            labels.nameDescriptionMobile,
                            h,
                          ),
                          divider(h),
                          settingsSection(
                            labels.permissionsTitle,
                            labels.permissionsDescription,
                            labels.permissionsDescriptionMobile,
                            h,
                          ),
                          divider(h),
                          settingsSection(
                            labels.integrationTitle,
                            labels.integrationDescription,
                            labels.integrationDescriptionMobile,
                            h,
                          ),
                        ],
                      ),
                      h.footer(
                        [
                          h.Class(
                            "flex w-full justify-end gap-3 p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6",
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
