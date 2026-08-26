/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- The controlled renderer preserves the authenticated plan-01 anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { radioGroups } from "../base/radio-groups.ts";

export type Plan01 = "basic" | "business" | "enterprise";

export interface Plan01ModalProps<Message> {
  readonly id: string;
  readonly isOpen: boolean;
  readonly onCancel: NoInfer<Message>;
  readonly onConfirm: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onSelect: (plan: Plan01) => NoInfer<Message>;
  readonly selectedPlan: Plan01;
}

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

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon("M18 6 6 18M6 6l12 12", "size-5", h);

const cardRefreshIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M22 10H2m9 9h7.8c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 17.48 22 16.92 22 15.8V8.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 5 19.92 5 18.8 5H17m-6 14 2 2m-2-2 2-2m-6 2H5.2c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C2 17.48 2 16.92 2 15.8V8.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 5 4.08 5 5.2 5H13m0 0-2 2m2-2-2-2",
    "size-5",
    h,
  );

export const plan01Modal = <Message>(
  props: Plan01ModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  const plans = [
    {
      description: "Up to 10 users and 20 GB individual data.",
      featuredIcon: "layers-two",
      message: props.onSelect("basic"),
      secondaryTitle: "$10/month",
      title: "Basic plan",
      value: "basic",
    },
    {
      description: "Up to 20 users and 40 GB individual data.",
      featuredIcon: "layers-three",
      message: props.onSelect("business"),
      secondaryTitle: "$20/month",
      title: "Business plan",
      value: "business",
    },
    {
      description: "Unlimited users and unlimited individual data.",
      featuredIcon: "zap",
      message: props.onSelect("enterprise"),
      secondaryTitle: "$40/month",
      title: "Enterprise plan",
      value: "enterprise",
    },
  ] as const;
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-end justify-center bg-overlay/70 px-4 pt-4 pb-[clamp(16px,8vh,64px)] outline-hidden backdrop-blur-[6px] sm:items-center sm:px-8 sm:py-8",
              ),
            ],
            [
              h.div([h.AriaHidden(true), h.Class("absolute inset-0"), h.OnClick(props.onDismiss)]),
              h.dialog(
                [
                  h.AriaDescribedBy(descriptionId),
                  h.AriaLabelledBy(titleId),
                  h.Class(
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-max max-w-[calc(100%-32px)] overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:max-w-120 sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.button(
                    [
                      h.AriaLabel("Close dialog"),
                      h.Autofocus(true),
                      h.Class(
                        "absolute top-3 right-3 z-20 flex size-9 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 sm:top-4 sm:right-4",
                      ),
                      h.OnClick(props.onDismiss),
                      h.Type("button"),
                    ],
                    [closeIcon(h)],
                  ),
                  h.div(
                    [h.Class("flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6")],
                    [
                      h.div(
                        [
                          h.Class(
                            "flex size-10 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
                          ),
                        ],
                        [cardRefreshIcon(h)],
                      ),
                      h.div(
                        [h.Class("z-10 flex flex-col gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            ["Change your plan"],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            ["Flexible pricing that grows with you."],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div(
                    [h.Class("px-4 sm:px-6")],
                    [
                      radioGroups(
                        {
                          ariaLabel: "Pricing plans",
                          items: plans,
                          name: `${props.id}-plans`,
                          selectedValue: props.selectedPlan,
                          variant: "icon-simple",
                        },
                        h,
                      ),
                    ],
                  ),
                  h.footer(
                    [
                      h.Class(
                        "z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 sm:grid sm:grid-cols-2 sm:px-6 sm:pt-8 sm:pb-6",
                      ),
                    ],
                    [
                      button(
                        {
                          color: "secondary",
                          label: "Cancel",
                          onPress: props.onCancel,
                          size: "md",
                        },
                        h,
                      ),
                      button(
                        {
                          color: "primary",
                          label: "Confirm",
                          onPress: props.onConfirm,
                          size: "md",
                        },
                        h,
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
