/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the authenticated purchase-seats dialog anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export type UserSelectionModalLocale = "en-US" | "pt-BR";

export interface UserSelectionModalProps<Message> {
  readonly count: number;
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale: UserSelectionModalLocale;
  readonly onCancel: NoInfer<Message>;
  readonly onDecrease: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onIncrease: NoInfer<Message>;
  readonly onPurchase: NoInfer<Message>;
}

const copy = {
  "en-US": {
    cancel: "Cancel",
    close: "Close",
    decrease: "Decrease",
    description: "Select how many seats you need.",
    increase: "Increase",
    pricePerSeat: "Price per seat",
    purchase: "Purchase seats",
    title: "Purchase seats",
    total: "Total",
  },
  "pt-BR": {
    cancel: "Cancelar",
    close: "Fechar",
    decrease: "Diminuir",
    description: "Selecione quantos assentos você precisa.",
    increase: "Aumentar",
    pricePerSeat: "Preço por assento",
    purchase: "Comprar assentos",
    title: "Comprar assentos",
    total: "Total",
  },
} as const;

const usd = (amount: number, locale: UserSelectionModalLocale): string =>
  locale === "pt-BR"
    ? `US$ ${String(amount).replaceAll(/\B(?=(?:\d{3})+(?!\d))/gu, ".")}`
    : `$${String(amount)}`;

const pathIcon = <Message>(path: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("z-1 size-5"),
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

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html => pathIcon("M18 6 6 18M6 6l12 12", h);

const usersCheckIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "m16 18 2 2 4-4m-10-1H8c-1.864 0-2.796 0-3.53.305a4 4 0 0 0-2.166 2.164C2 18.204 2 19.136 2 21M15.5 3.29a4.001 4.001 0 0 1 0 7.42M13.5 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
    h,
  );

const seatIcon = <Message>(direction: "decrease" | "increase", h: HtmlBuilder<Message>): Html =>
  pathIcon(direction === "decrease" ? "M5 12h14" : "M12 5v14m-7-7h14", h);

const seatButton = <Message>(
  direction: "decrease" | "increase",
  size: "lg" | "sm",
  label: string,
  message: NoInfer<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.AriaLabel(label),
      h.Class(
        `group relative inline-flex h-max cursor-pointer items-center justify-center rounded-lg bg-bg-primary text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 ${size === "lg" ? "p-3 max-sm:hidden" : "p-2 sm:hidden"}`,
      ),
      h.OnClick(message),
      h.Type("button"),
    ],
    [seatIcon(direction, h)],
  );

export const userSelectionModal = <Message>(
  props: UserSelectionModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  const text = copy[props.locale];
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-end justify-center bg-overlay/70 px-4 pt-4 pb-[clamp(16px,8vh,64px)] outline-hidden backdrop-blur-[6px] sm:items-center sm:px-8 sm:py-8",
              ),
              h.DataAttribute("modal-overlay", props.id),
            ],
            [
              h.div([h.AriaHidden(true), h.Class("absolute inset-0"), h.OnClick(props.onDismiss)]),
              h.dialog(
                [
                  h.AriaDescribedBy(descriptionId),
                  h.AriaLabelledBy(titleId),
                  h.Attribute("lang", props.locale),
                  h.Class(
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-max max-w-[calc(100%-32px)] overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:max-w-120 sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.button(
                    [
                      h.AriaLabel(text.close),
                      h.Autofocus(true),
                      h.Class(
                        "absolute top-3 right-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2 sm:top-4 sm:right-4",
                      ),
                      h.OnClick(props.onDismiss),
                      h.Type("button"),
                    ],
                    [closeIcon(h)],
                  ),
                  h.div(
                    [h.Class("flex gap-4 px-4 pt-5 sm:px-6 sm:pt-6")],
                    [
                      h.div(
                        [
                          h.Class(
                            "relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset max-sm:hidden",
                          ),
                        ],
                        [usersCheckIcon(h)],
                      ),
                      h.div(
                        [h.Class("z-10 flex flex-col gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            [text.title],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            [text.description],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div([h.Class("w-full border-t border-border-secondary")]),
                  h.div(
                    [h.Class("flex flex-col gap-3 px-4 pt-5 sm:px-6")],
                    [
                      h.div(
                        [h.Class("flex items-center justify-center gap-6")],
                        [
                          seatButton("decrease", "lg", text.decrease, props.onDecrease, h),
                          seatButton("decrease", "sm", text.decrease, props.onDecrease, h),
                          h.h1(
                            [
                              h.Class(
                                "text-display-lg font-semibold text-text-primary tabular-nums sm:text-display-xl",
                              ),
                            ],
                            [String(props.count)],
                          ),
                          seatButton("increase", "lg", text.increase, props.onIncrease, h),
                          seatButton("increase", "sm", text.increase, props.onIncrease, h),
                        ],
                      ),
                      h.div([h.Class("w-full border-t border-border-secondary")]),
                      h.div(
                        [h.Class("flex flex-col gap-3")],
                        [
                          h.span(
                            [h.Class("flex justify-between")],
                            [
                              h.p(
                                [h.Class("text-md font-semibold text-text-primary")],
                                [text.pricePerSeat],
                              ),
                              h.p([h.Class("text-md text-text-tertiary")], [usd(10, props.locale)]),
                            ],
                          ),
                          h.span(
                            [h.Class("flex justify-between")],
                            [
                              h.p(
                                [h.Class("text-md font-semibold text-text-primary")],
                                [text.total],
                              ),
                              h.p(
                                [h.Class("text-md text-text-tertiary")],
                                [usd(props.count * 10, props.locale)],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div(
                    [h.Class("z-10 flex flex-col pt-6 pb-4 sm:pt-8 sm:pb-6")],
                    [
                      h.div([h.Class("w-full border-t border-border-secondary")]),
                      h.div([h.Class("h-4 w-full sm:h-6")]),
                      h.div(
                        [
                          h.Class(
                            "flex flex-1 flex-col-reverse gap-3 px-4 sm:grid sm:grid-cols-2 sm:px-6",
                          ),
                        ],
                        [
                          button(
                            {
                              color: "secondary",
                              label: text.cancel,
                              onPress: props.onCancel,
                              size: "md",
                            },
                            h,
                          ),
                          button(
                            {
                              color: "primary",
                              label: text.purchase,
                              onPress: props.onPurchase,
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
