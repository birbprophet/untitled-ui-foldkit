/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- The controlled renderer preserves the authenticated payment-details-with-image anatomy. */
import { wordmarkHorizontal } from "brand";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { paymentDetailsFields } from "./payment-details-modal.ts";
import type { PaymentDetailsModalProps } from "./payment-details-modal.ts";

export type PaymentDetailsWithImageModalProps<Message> = PaymentDetailsModalProps<Message>;

const contactlessIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-7 text-white"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("M8.4 8.8a4.5 4.5 0 0 1 0 6.4M11.4 6a8.4 8.4 0 0 1 0 12M14.4 3a12.7 12.7 0 0 1 0 18"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const whiteMastercard = <Message>(h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.AriaHidden(true),
      h.Class("flex h-8 w-11.5 items-center justify-center rounded bg-white/10"),
    ],
    [
      h.span([h.Class("size-4 rounded-full bg-white")]),
      h.span([h.Class("-ml-1.5 size-4 rounded-full bg-white/70")]),
    ],
  );

const creditCard = <Message>(
  props: PaymentDetailsWithImageModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "relative z-10 flex h-47.5 w-79 flex-col justify-between overflow-hidden rounded-2xl bg-black/10 bg-linear-to-br from-white/30 to-transparent p-4 text-white shadow-sm ring-1 ring-white/30 ring-inset backdrop-blur-[6px]",
      ),
    ],
    [
      h.div(
        [h.Class("flex items-start justify-between px-1 pt-1")],
        [
          h.img([
            h.Alt("Siglata"),
            h.Class("h-5 w-auto rounded-sm"),
            h.Src(wordmarkHorizontal.url.href),
          ]),
          contactlessIcon(h),
        ],
      ),
      h.div(
        [h.Class("flex items-end justify-between gap-3")],
        [
          h.div(
            [h.Class("flex min-w-0 flex-1 flex-col gap-2")],
            [
              h.div(
                [h.Class("flex items-end gap-1")],
                [
                  h.p(
                    [h.Class("text-xs leading-snug font-semibold tracking-[0.6px] uppercase")],
                    [props.name],
                  ),
                  h.p(
                    [
                      h.Class(
                        "ml-auto text-right text-xs leading-normal font-semibold tracking-[0.6px] tabular-nums",
                      ),
                    ],
                    [props.expiry],
                  ),
                ],
              ),
              h.div(
                [h.Class("text-md leading-normal font-semibold tracking-[1px] tabular-nums")],
                [props.card],
              ),
            ],
          ),
          whiteMastercard(h),
        ],
      ),
    ],
  );

export const paymentDetailsWithImageModal = <Message>(
  props: PaymentDetailsWithImageModalProps<Message>,
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
                  h.Tabindex(-1),
                ],
                [
                  h.span([
                    h.AriaHidden(true),
                    h.Autofocus(true),
                    h.Class("sr-only"),
                    h.Id(`${props.id}-focus`),
                    h.Tabindex(-1),
                  ]),
                  h.div(
                    [h.Class("w-full px-4 pt-4 max-sm:hidden sm:px-6 sm:pt-6")],
                    [
                      h.div(
                        [
                          h.Class(
                            "relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-brand-100 via-brand-300 to-utility-yellow-200 py-8",
                          ),
                        ],
                        [creditCard(props, h)],
                      ),
                    ],
                  ),
                  h.div(
                    [h.Class("flex flex-col gap-0.5 px-4 pt-5 sm:px-6 sm:pt-6")],
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
                  h.div([h.Class("h-5 w-full")]),
                  paymentDetailsFields(props, h),
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
