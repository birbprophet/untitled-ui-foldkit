/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled native slideout preserves the authenticated fixed integration fixture and icon branches directly. */
import { blobatarDataUri } from "avatar";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { buttonUtility } from "../base/button-utility.ts";

export type IntegrationMenuLocale = "en-US" | "pt-BR";

export interface IntegrationMenuProps<Message> {
  readonly copied: boolean;
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale: IntegrationMenuLocale;
  readonly onConnect: NoInfer<Message>;
  readonly onCopy: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onDocumentation: NoInfer<Message>;
}

const linearIconUrl = "https://www.untitledui.com/logos/images/Linear.png";
const linkUrl = "siglata.com/integrations/linear";

const copyByLocale = {
  "en-US": {
    close: "Close",
    connect: "Connect",
    copy: "Copy",
    description:
      "Prioritize work based on customer needs and build a tighter feedback loop with customers.",
    documentation: "Documentation",
    permissions: [
      "Access basic information and details",
      "Access bug reports and create issues",
      "Change issue status and assignee of issues",
      "Open and resolve Intercom conversations",
      "Add or remove users and change user roles",
    ],
    permissionsTitle: "Siglata would like to",
    slideout: "Slideout menu",
    title: "Connect Siglata to Linear",
  },
  "pt-BR": {
    close: "Fechar",
    connect: "Conectar",
    copy: "Copiar",
    description:
      "Priorize o trabalho com base nas necessidades dos clientes e crie um ciclo de feedback mais próximo com eles.",
    documentation: "Documentação",
    permissions: [
      "Acessar informações e detalhes básicos",
      "Acessar relatórios de bugs e criar problemas",
      "Alterar o status e a pessoa responsável pelos problemas",
      "Abrir e resolver conversas do Intercom",
      "Adicionar ou remover usuários e alterar suas funções",
    ],
    permissionsTitle: "Siglata gostaria de",
    slideout: "Menu lateral",
    title: "Conectar Siglata ao Linear",
  },
} as const;

const lineIcon = <Message>(
  kind: "book" | "check" | "close" | "copy" | "link" | "switch",
  className: string,
  h: HtmlBuilder<Message>,
): Html => {
  const paths = {
    book: "m12 21-.1-.15c-.695-1.042-1.042-1.563-1.5-1.94a4 4 0 0 0-1.378-.737C8.453 18 7.827 18 6.575 18H5.2c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C2 16.48 2 15.92 2 14.8V6.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 3 4.08 3 5.2 3h.4c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C12 6.04 12 7.16 12 9.4M12 21V9.4M12 21l.1-.15c.695-1.042 1.042-1.563 1.5-1.94a3.999 3.999 0 0 1 1.378-.737C15.547 18 16.173 18 17.425 18H18.8c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 16.48 22 15.92 22 14.8V6.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 3 19.92 3 18.8 3h-.4c-2.24 0-3.36 0-4.216.436a4 4 0 0 0-1.748 1.748C12 6.04 12 7.16 12 9.4",
    check: "M20 6 9 17l-5-5",
    close: "M18 6 6 18M6 6l12 12",
    copy: "M5 15c-.932 0-1.398 0-1.765-.152a2 2 0 0 1-1.083-1.083C2 13.398 2 12.932 2 12V5.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 2 4.08 2 5.2 2H12c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C15 3.602 15 4.068 15 5m-2.8 17h6.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 20.48 22 19.92 22 18.8v-6.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 9 19.92 9 18.8 9h-6.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C9 10.52 9 11.08 9 12.2v6.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C10.52 22 11.08 22 12.2 22Z",
    link: "m12.708 18.364-1.415 1.414a5 5 0 1 1-7.07-7.07l1.413-1.415m12.728 1.414 1.415-1.414a5 5 0 0 0-7.071-7.071l-1.415 1.414M8.5 15.5l7-7",
    switch: "M20 17H4m0 0 4-4m-4 4 4 4M4 7h16m0 0-4-4m4 4-4 4",
  } as const;
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class(className),
      h.DataAttribute("icon", kind),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(paths[kind]),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );
};

const appIcon = <Message>(src: string, alt: string, h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Class(
        "relative size-12 rounded-xl bg-bg-primary-alt p-1 ring-1 ring-border-primary ring-inset sm:size-14 sm:rounded-[14px]",
      ),
    ],
    [
      h.img([
        h.Alt(alt),
        h.Class(
          "size-full rounded-lg object-cover shadow-[0_-2px_2px_0_rgba(0,0,0,0.10)_inset,1px_8px_5px_0_rgba(0,0,0,0.05),0_3px_3px_0_rgba(0,0,0,0.10),0_1px_2px_0_rgba(0,0,0,0.10)] sm:rounded-[10px]",
        ),
        h.Src(src),
      ]),
    ],
  );

const dottedDivider = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("w-full"), h.Height("2")],
    [
      h.line([
        h.Class("stroke-border-primary"),
        h.Stroke("currentColor"),
        h.StrokeDasharray("0,6"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
        h.X1("0"),
        h.X2("100%"),
        h.Y1("1"),
        h.Y2("1"),
      ]),
    ],
  );

export const integrationMenu = <Message>(
  props: IntegrationMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const copy = copyByLocale[props.locale];
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  const robotLogo = blobatarDataUri("siglata-integration-menu-logo", {
    background: "squircle",
    kind: "robot",
    size: 112,
    title: "Siglata robot logo",
  });
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
                  h.AriaLabel(copy.slideout),
                  h.Attribute("dir", "ltr"),
                  h.Class(
                    "fixed inset-y-0 right-0 left-auto my-0 mr-0 ml-auto h-full w-[calc(100%-1.5rem)] max-w-100 overflow-hidden border-0 bg-transparent p-0 shadow-xl outline-hidden transition md:w-[calc(100%-2.5rem)]",
                  ),
                  h.Id(props.id),
                  h.Lang(props.locale),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.div(
                    [
                      h.Class(
                        "relative flex size-full flex-col items-start gap-6 overflow-y-auto bg-bg-primary outline-hidden ring-1 ring-border-secondary-alt",
                      ),
                    ],
                    [
                      h.header(
                        [
                          h.Class(
                            "relative z-1 flex w-full flex-col items-center gap-4 px-4 pt-6 md:px-6 md:pt-8",
                          ),
                        ],
                        [
                          h.button(
                            [
                              h.AriaLabel(copy.close),
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("integration-menu-close", ""),
                              h.OnClick(props.onDismiss),
                              h.Type("button"),
                            ],
                            [lineIcon("close", "size-5", h)],
                          ),
                          h.div(
                            [h.Class("flex items-center gap-3")],
                            [
                              appIcon(robotLogo, "Siglata robot logo", h),
                              lineIcon("switch", "size-5 text-fg-quaternary", h),
                              appIcon(linearIconUrl, "Linear", h),
                            ],
                          ),
                          h.div(
                            [h.Class("flex flex-col gap-0.5 text-center")],
                            [
                              h.h1(
                                [
                                  h.Class("text-md font-semibold text-text-primary md:text-lg"),
                                  h.Id(titleId),
                                ],
                                [copy.title],
                              ),
                              h.p(
                                [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                                [copy.description],
                              ),
                            ],
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
                          dottedDivider(h),
                          h.section(
                            [h.Class("flex flex-col gap-3")],
                            [
                              h.p(
                                [h.Class("text-sm font-semibold text-text-primary")],
                                [copy.permissionsTitle],
                              ),
                              h.div(
                                [h.Class("flex flex-col gap-2")],
                                copy.permissions.map((permission) =>
                                  h.div(
                                    [h.Class("flex gap-2")],
                                    [
                                      lineIcon(
                                        "check",
                                        "mt-0.5 size-4 shrink-0 text-fg-quaternary",
                                        h,
                                      ),
                                      h.p([h.Class("text-sm text-text-tertiary")], [permission]),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                          dottedDivider(h),
                          h.div(
                            [
                              h.Class(
                                "relative flex items-start gap-2 rounded-lg bg-bg-secondary p-3 ring-1 ring-border-secondary ring-inset",
                              ),
                            ],
                            [
                              lineIcon("link", "mt-0.5 size-4 shrink-0 text-fg-quaternary", h),
                              h.p(
                                [h.Class("flex-1 text-sm font-semibold text-text-primary")],
                                [linkUrl],
                              ),
                              h.div(
                                [h.Class("absolute top-2 right-2")],
                                [
                                  buttonUtility(
                                    {
                                      color: "tertiary",
                                      icon: (builder) =>
                                        lineIcon(
                                          props.copied ? "check" : "copy",
                                          "size-4",
                                          builder,
                                        ),
                                      onPress: props.onCopy,
                                      size: "xs",
                                      tooltip: copy.copy,
                                    },
                                    h,
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
                            "flex w-full items-center justify-between gap-3 p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6",
                          ),
                        ],
                        [
                          button(
                            {
                              color: "secondary",
                              iconLeadingElement: lineIcon("book", "size-5", h),
                              label: copy.documentation,
                              onPress: props.onDocumentation,
                              size: "sm",
                            },
                            h,
                          ),
                          button(
                            {
                              color: "primary",
                              label: copy.connect,
                              onPress: props.onConnect,
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
