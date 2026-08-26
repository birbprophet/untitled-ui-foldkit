/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- The controlled renderer preserves the authenticated payment-details anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { input } from "../base/fields.ts";

export type PaymentDetailsField = "card" | "cvv" | "expiry" | "name";

export interface PaymentDetailsModalProps<Message> {
  readonly card: string;
  readonly cvv: string;
  readonly expiry: string;
  readonly id: string;
  readonly isCvvFocused: boolean;
  readonly isOpen: boolean;
  readonly name: string;
  readonly onCancel: NoInfer<Message>;
  readonly onCvvBlur: NoInfer<Message>;
  readonly onCvvFocus: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onFieldInput: (field: PaymentDetailsField, value: string) => NoInfer<Message>;
  readonly onUpdate: NoInfer<Message>;
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

const cardShieldIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M22 10H2m20 1V8.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 5 19.92 5 18.8 5H5.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C2 6.52 2 7.08 2 8.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C3.52 19 4.08 19 5.2 19h6.3m6.5 2s3-1.43 3-3.575v-2.502l-2.188-.782a2.41 2.41 0 0 0-1.626 0L15 14.923v2.502C15 19.57 18 21 18 21Z",
    "size-5",
    h,
  );

const mastercardIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("h-6 w-8.5"), h.Fill("none"), h.ViewBox("0 0 34 24")],
    [
      h.path([
        h.D(
          "M.5 4A3.5 3.5 0 0 1 4 .5h26A3.5 3.5 0 0 1 33.5 4v16a3.5 3.5 0 0 1-3.5 3.5H4A3.5 3.5 0 0 1 .5 20V4Z",
        ),
        h.Fill("white"),
      ]),
      h.path([
        h.D(
          "M.5 4A3.5 3.5 0 0 1 4 .5h26A3.5 3.5 0 0 1 33.5 4v16a3.5 3.5 0 0 1-3.5 3.5H4A3.5 3.5 0 0 1 .5 20V4Z",
        ),
        h.Class("stroke-border-secondary"),
        h.StrokeWidth(".75"),
      ]),
      h.path([
        h.ClipRule("evenodd"),
        h.D("M17.179 16.829A6.8 6.8 0 1 1 17.18 6.63a6.8 6.8 0 1 1 0 10.199Z"),
        h.Fill("#ED0006"),
        h.FillRule("evenodd"),
      ]),
      h.path([
        h.ClipRule("evenodd"),
        h.D(
          "M17.179 16.829a6.67 6.67 0 0 0 2.382-5.099 6.67 6.67 0 0 0-2.382-5.1 6.8 6.8 0 1 1 0 10.2Z",
        ),
        h.Fill("#F9A000"),
        h.FillRule("evenodd"),
      ]),
      h.path([
        h.ClipRule("evenodd"),
        h.D(
          "M17.179 16.829a6.67 6.67 0 0 0 2.383-5.099 6.67 6.67 0 0 0-2.383-5.1 6.67 6.67 0 0 0-2.382 5.1 6.67 6.67 0 0 0 2.382 5.099Z",
        ),
        h.Fill("#FF5E00"),
        h.FillRule("evenodd"),
      ]),
    ],
  );

const paymentInput = <Message>(
  props: PaymentDetailsModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const inputId = `${props.id}-card`;
  return h.div(
    [h.Class("order-2 col-span-1 flex w-full flex-col gap-1.5 max-sm:col-span-2 sm:order-3")],
    [
      h.div(
        [h.Class("flex items-center gap-0.5 text-sm font-medium text-text-secondary")],
        [
          h.label([h.For(inputId)], ["Card number"]),
          h.span([h.Class("text-text-brand-tertiary")], ["*"]),
        ],
      ),
      h.div(
        [
          h.Class(
            "flex w-full items-center gap-2 rounded-lg bg-bg-primary py-2 pr-3 pl-2 shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
          ),
        ],
        [
          mastercardIcon(h),
          h.input([
            h.Class("min-w-0 flex-1 bg-transparent text-md text-text-primary outline-none"),
            h.Id(inputId),
            h.InputMode("numeric"),
            h.Maxlength(19),
            h.OnInput((value) => props.onFieldInput("card", value)),
            h.Required(true),
            h.Type("tel"),
            h.Value(props.card),
          ]),
        ],
      ),
    ],
  );
};

export const paymentDetailsFields = <Message>(
  props: PaymentDetailsModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "relative grid grid-flow-row grid-cols-2 gap-4 px-4 sm:grid-cols-[1fr_112px] sm:px-6",
      ),
    ],
    [
      h.div(
        [h.Class("order-first max-sm:col-span-2")],
        [
          input(
            {
              isRequired: true,
              label: "Name on card",
              name: `${props.id}-name`,
              onInput: (value) => props.onFieldInput("name", value),
              requiredMarkCompact: true,
              size: "lg",
              value: props.name,
            },
            h,
          ),
        ],
      ),
      h.div(
        [h.Class("order-3 col-span-1 sm:order-2")],
        [
          input(
            {
              isRequired: true,
              label: "Expiry",
              maxLength: 9,
              name: `${props.id}-expiry`,
              onInput: (value) => props.onFieldInput("expiry", value),
              requiredMarkCompact: true,
              size: "lg",
              type: "tel",
              value: props.expiry,
            },
            h,
          ),
        ],
      ),
      paymentInput(props, h),
      h.div(
        [h.Class("order-last col-span-1")],
        [
          input(
            {
              isRequired: true,
              label: "CVV",
              maxLength: 3,
              name: `${props.id}-cvv`,
              onBlur: props.onCvvBlur,
              onFocus: props.onCvvFocus,
              onInput: (value) => props.onFieldInput("cvv", value),
              placeholder: "•••",
              requiredMarkCompact: true,
              size: "lg",
              type: props.isCvvFocused ? "tel" : "password",
              value: props.cvv,
              visibilityIconSize: "sm",
            },
            h,
          ),
        ],
      ),
    ],
  );

export const paymentDetailsModal = <Message>(
  props: PaymentDetailsModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
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
                        [cardShieldIcon(h)],
                      ),
                      h.div(
                        [h.Class("z-10 flex flex-col gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            ["Update payment method"],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            ["Update your card details."],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  paymentDetailsFields(props, h),
                  h.footer(
                    [
                      h.Class(
                        "z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pt-8 sm:pb-6",
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
                        { color: "primary", label: "Update", onPress: props.onUpdate, size: "md" },
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
