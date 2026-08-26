/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- The controlled renderer preserves the authenticated payment-method anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { radioGroups } from "../base/radio-groups.ts";

export type PaymentMethod = "mastercard" | "visa-primary" | "visa-secondary";

export interface PaymentMethodModalProps<Message> {
  readonly id: string;
  readonly isOpen: boolean;
  readonly onCancel: NoInfer<Message>;
  readonly onConfirm: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onEdit: (method: PaymentMethod) => NoInfer<Message>;
  readonly onSelect: (method: PaymentMethod) => NoInfer<Message>;
  readonly onSetDefault: (method: PaymentMethod) => NoInfer<Message>;
  readonly selectedMethod: PaymentMethod;
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

const currencyIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M16 8.5C16 7.12 14.21 6 12 6S8 7.12 8 8.5s1.79 2.5 4 2.5 4 1.12 4 2.5S14.21 16 12 16s-4-1.12-4-2.5M12 4v2m0 10v2m10-6c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z",
    "size-5",
    h,
  );

export const paymentMethodModal = <Message>(
  props: PaymentMethodModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  const methods = [
    {
      description: "Expiry 06/2028",
      editMessage: props.onEdit("visa-primary"),
      message: props.onSelect("visa-primary"),
      paymentBrand: "visa",
      setDefaultMessage: props.onSetDefault("visa-primary"),
      title: "Visa ending in 1234",
      value: "visa-primary",
    },
    {
      description: "Expiry 06/2028",
      editMessage: props.onEdit("mastercard"),
      message: props.onSelect("mastercard"),
      paymentBrand: "mastercard",
      setDefaultMessage: props.onSetDefault("mastercard"),
      title: "Mastercard ending in 1234",
      value: "mastercard",
    },
    {
      description: "Expiry 06/2028",
      editMessage: props.onEdit("visa-secondary"),
      message: props.onSelect("visa-secondary"),
      paymentBrand: "visa",
      setDefaultMessage: props.onSetDefault("visa-secondary"),
      title: "Visa ending in 1234",
      value: "visa-secondary",
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
                        [currencyIcon(h)],
                      ),
                      h.div(
                        [h.Class("z-10 flex flex-col gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            ["Change your payment method"],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            ["Update your plan payment details."],
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
                          ariaLabel: "Payment methods",
                          items: methods,
                          name: `${props.id}-methods`,
                          selectedValue: props.selectedMethod,
                          variant: "payment-icon",
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
