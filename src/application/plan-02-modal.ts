/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- The controlled renderer preserves the authenticated plan-02 anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export type Plan02 = "basic" | "business";

export interface Plan02ModalProps<Message> {
  readonly id: string;
  readonly isOpen: boolean;
  readonly onCancel: NoInfer<Message>;
  readonly onChat: NoInfer<Message>;
  readonly onConfirm: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onSelect: (plan: Plan02) => NoInfer<Message>;
  readonly selectedPlan: Plan02;
}

const pathIcon = <Message>(path: string, className: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(className),
      h.DataAttribute("icon", "leading"),
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
  pathIcon("M18 6 6 18M6 6l12 12", "size-5", h);
const layersTwoIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "m2 14.5 9.642 4.821c.131.066.197.099.266.111.06.012.123.012.184 0 .069-.012.135-.045.266-.11L22 14.5m-20-5 9.642-4.821c.131-.066.197-.098.266-.111a.5.5 0 0 1 .184 0c.069.013.135.045.266.111L22 9.5l-9.642 4.821a1.028 1.028 0 0 1-.266.111.501.501 0 0 1-.184 0c-.069-.012-.135-.045-.266-.11L2 9.5Z",
    "size-5",
    h,
  );
const chatIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M6.094 11.229A8.01 8.01 0 0 1 6 10c0-4.418 3.605-8 8.053-8 4.447 0 8.052 3.582 8.052 8a7.94 7.94 0 0 1-.52 2.835c-.07.182-.105.274-.12.345a.897.897 0 0 0-.024.194c-.002.073.008.153.028.314l.403 3.27c.043.355.065.532.006.66a.5.5 0 0 1-.257.252c-.13.055-.306.03-.66-.022l-3.184-.467c-.167-.024-.25-.037-.326-.036a.898.898 0 0 0-.2.021 2.989 2.989 0 0 0-.358.122 8.174 8.174 0 0 1-4.07.42M7.632 22C10.597 22 13 19.538 13 16.5S10.597 11 7.632 11c-2.965 0-5.369 2.462-5.369 5.5 0 .61.097 1.198.277 1.747.075.232.113.348.126.427.013.083.015.13.01.213-.005.08-.025.17-.065.351L2 22l2.995-.409c.163-.022.245-.034.316-.033.076 0 .115.005.19.02.07.013.173.05.381.123a5.246 5.246 0 0 0 1.75.299Z",
    "size-5",
    h,
  );
const checkIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "m7.5 12 3 3 6-6m5.5 3c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z",
    "size-5 shrink-0 text-fg-brand-primary",
    h,
  );

const radioMark = <Message>(selected: boolean, h: HtmlBuilder<Message>): Html =>
  h.span(
    [
      h.Class(
        `absolute top-4 right-4 z-10 flex size-4 items-center justify-center rounded-full ring-1 ring-inset ${selected ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"}`,
      ),
    ],
    [h.span([h.Class(`size-1.5 rounded-full bg-fg-white ${selected ? "" : "opacity-0"}`)])],
  );

const planCard = <Message>(
  plan: {
    readonly features: readonly string[];
    readonly price: string;
    readonly title: string;
    readonly value: Plan02;
  },
  props: Plan02ModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const selected = props.selectedPlan === plan.value;
  const labelId = `${props.id}-${plan.value}-label`;
  return h.label(
    [
      h.Class(
        `relative flex cursor-pointer flex-col items-start rounded-xl bg-bg-primary shadow-xs ring-inset ${selected ? "ring-2 ring-border-brand" : "ring-1 ring-border-secondary"}`,
      ),
    ],
    [
      h.input([
        h.Attribute("aria-labelledby", labelId),
        h.Checked(selected),
        h.Class("peer sr-only"),
        h.Name(`${props.id}-plans`),
        h.OnChange(() => props.onSelect(plan.value)),
        h.Type("radio"),
        h.Value(plan.value),
      ]),
      h.div(
        [h.Class("flex w-full flex-col gap-1 p-4 sm:gap-2 sm:px-5 sm:pt-5 sm:pb-0")],
        [
          h.h3([h.Class("text-xl font-semibold text-text-primary"), h.Id(labelId)], [plan.price]),
          h.div(
            [h.Class("flex items-center gap-0.5 sm:flex-col sm:items-start")],
            [
              h.p([h.Class("w-full text-sm font-semibold text-text-primary")], [plan.title]),
              h.p([h.Class("text-sm whitespace-nowrap text-text-tertiary")], ["Billed annually"]),
            ],
          ),
        ],
      ),
      radioMark(selected, h),
      h.ul(
        [h.Class("flex flex-col gap-2 p-5 pt-4 max-sm:hidden")],
        plan.features.map((feature) =>
          h.li(
            [h.Class("flex gap-2")],
            [checkIcon(h), h.span([h.Class("text-sm text-text-tertiary")], [feature])],
          ),
        ),
      ),
    ],
  );
};

export const plan02Modal = <Message>(
  props: Plan02ModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  const plans = [
    {
      features: [
        "Basic features",
        "Basic reporting",
        "Up to 10 individual users",
        "20 GB data per user",
      ],
      price: "$10/mth",
      title: "Basic plan",
      value: "basic",
    },
    {
      features: [
        "Advanced features",
        "Advanced reporting",
        "Up to 20 individual users",
        "40 GB data per user",
      ],
      price: "$20/mth",
      title: "Business plan",
      value: "business",
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
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-max max-w-[calc(100%-32px)] overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:max-w-140 sm:rounded-2xl",
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
                    [h.Class("flex items-start gap-4 px-4 pt-5 max-sm:flex-col sm:px-6 sm:pt-6")],
                    [
                      h.div(
                        [
                          h.Class(
                            "flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
                          ),
                        ],
                        [layersTwoIcon(h)],
                      ),
                      h.div(
                        [h.Class("z-10 flex flex-col gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            ["Select plan"],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            ["Simple and flexible per-user pricing."],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div([h.Class("w-full border-t border-border-secondary")]),
                  h.fieldset(
                    [
                      h.Class(
                        "grid size-full grid-cols-1 gap-3 px-4 pt-5 pb-6 sm:grid-cols-2 sm:gap-4 sm:px-6 sm:pb-8",
                      ),
                    ],
                    [
                      h.legend([h.Class("sr-only")], ["Pricing plans"]),
                      planCard(plans[0], props, h),
                      planCard(plans[1], props, h),
                    ],
                  ),
                  h.footer(
                    [
                      h.Class(
                        "z-10 flex w-full flex-1 flex-col-reverse gap-3 px-4 pb-4 sm:flex-row sm:px-6 sm:pb-6",
                      ),
                    ],
                    [
                      h.div(
                        [h.Class("max-sm:hidden")],
                        [
                          button(
                            {
                              color: "secondary",
                              iconLeadingElement: chatIcon(h),
                              label: "Chat to us",
                              onPress: props.onChat,
                              size: "md",
                            },
                            h,
                          ),
                        ],
                      ),
                      h.div(
                        [h.Class("flex w-full flex-col-reverse justify-end gap-3 sm:flex-row")],
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
                              label: "Select plan",
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
            ],
          ),
        ]
      : [],
  );
};
