/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The authenticated plan fixtures and controlled slideout anatomy remain explicit. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { radioGroups } from "../base/radio-groups.ts";

export type PlanMenuLocale = "en-US" | "pt-BR";
export type PlanMenuPlan = "basic" | "business" | "enterprise";

export interface PlanMenuProps<Message> {
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale: PlanMenuLocale;
  readonly onCancel: NoInfer<Message>;
  readonly onConfirm: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onPlanSelect: (plan: PlanMenuPlan) => NoInfer<Message>;
  readonly selectedPlan: PlanMenuPlan;
}

const copy = {
  "en-US": {
    cancel: "Cancel",
    close: "Close",
    confirm: "Confirm",
    description: "Flexible pricing that grows with you.",
    dialog: "Slideout menu",
    paymentMethods: "Payment methods",
    plans: {
      basic: {
        badge: "Limited time only",
        description: "Includes up to 10 users, 20 GB individual data and access to all features.",
        price: "$10",
        secondaryTitle: "per month",
        title: "Basic plan",
      },
      business: {
        description: "Includes up to 20 users, 40 GB individual data and access to all features.",
        price: "$20",
        secondaryTitle: "per month",
        title: "Business plan",
      },
      enterprise: {
        description: "Unlimited users, unlimited individual data and access to all features.",
        price: "$40",
        secondaryTitle: "per month",
        title: "Enterprise plan",
      },
    },
    title: "Change your plan",
  },
  "pt-BR": {
    cancel: "Cancelar",
    close: "Fechar",
    confirm: "Confirmar",
    description: "Preços flexíveis que crescem com você.",
    dialog: "Menu lateral",
    paymentMethods: "Planos",
    plans: {
      basic: {
        badge: "Somente por tempo limitado",
        description:
          "Inclui até 10 usuários, 20 GB de dados individuais e acesso a todos os recursos.",
        price: "$10",
        secondaryTitle: "por mês",
        title: "Plano básico",
      },
      business: {
        description:
          "Inclui até 20 usuários, 40 GB de dados individuais e acesso a todos os recursos.",
        price: "$20",
        secondaryTitle: "por mês",
        title: "Plano empresarial",
      },
      enterprise: {
        description:
          "Usuários ilimitados, dados individuais ilimitados e acesso a todos os recursos.",
        price: "$40",
        secondaryTitle: "por mês",
        title: "Plano corporativo",
      },
    },
    title: "Altere seu plano",
  },
} as const;

const planOrder: readonly PlanMenuPlan[] = ["basic", "business", "enterprise"];
const planIcons = {
  basic: "layers-two",
  business: "layers-three",
  enterprise: "zap",
} as const;

const pathIcon = <Message>(path: string, className: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class(className), h.Fill("none"), h.ViewBox("0 0 24 24")],
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

const creditCardIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M22 10H2m9 4H6M2 8.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C3.52 19 4.08 19 5.2 19h13.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 17.48 22 16.92 22 15.8V8.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 5 19.92 5 18.8 5H5.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C2 6.52 2 7.08 2 8.2Z",
    "size-5",
    h,
  );

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon("M18 6 6 18M6 6l12 12", "size-5", h);

export const planMenu = <Message>(props: PlanMenuProps<Message>, h: HtmlBuilder<Message>): Html => {
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
                    "fixed inset-y-0! right-0! left-auto! m-0 h-full w-[calc(100%-1.5rem)] max-w-100 overflow-hidden border-0 bg-bg-primary p-0 shadow-xl ring-1 ring-border-secondary-alt outline-hidden md:w-full",
                  ),
                  h.Id(props.id),
                  h.Lang(props.locale),
                  h.OnCancel(props.onDismiss),
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
                        [h.Class("relative z-1 flex w-full items-start gap-3 px-4 pt-6 md:px-6")],
                        [
                          h.span(
                            [
                              h.Class(
                                "relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
                              ),
                            ],
                            [creditCardIcon(h)],
                          ),
                          h.section(
                            [h.Class("flex flex-col gap-0.5")],
                            [
                              h.h1(
                                [h.Class("text-md font-semibold text-text-primary md:text-lg")],
                                [labels.title],
                              ),
                              h.p(
                                [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                                [labels.description],
                              ),
                            ],
                          ),
                          h.button(
                            [
                              h.AriaLabel(labels.close),
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("plan-menu-close", ""),
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
                          radioGroups(
                            {
                              ariaLabel: labels.paymentMethods,
                              items: planOrder.map((plan) => ({
                                badge: plan === "basic" ? labels.plans.basic.badge : undefined,
                                description: labels.plans[plan].description,
                                featuredIcon: planIcons[plan],
                                message: props.onPlanSelect(plan),
                                price: labels.plans[plan].price,
                                secondaryTitle: labels.plans[plan].secondaryTitle,
                                title: labels.plans[plan].title,
                                value: plan,
                              })),
                              name: `${props.id}-plan`,
                              selectedValue: props.selectedPlan,
                              variant: "icon-card",
                            },
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
                          button(
                            { label: labels.confirm, onPress: props.onConfirm, size: "sm" },
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
