/* oxlint-disable effect/noReturnInArrow, effect/noTernary, effect/noSpread -- The controlled renderer mirrors the authenticated Untitled UI slideout anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { input } from "../base/fields.ts";

const cardMockupUrl = new URL("payment-details-menu-assets/card-mockup.webp", import.meta.url).href;
const paymentIconUrls = {
  amex: new URL("payment-details-menu-assets/amex-icon.svg", import.meta.url).href,
  discover: new URL("payment-details-menu-assets/discover-icon.svg", import.meta.url).href,
  mastercard: new URL("payment-details-menu-assets/mastercard-icon.svg", import.meta.url).href,
  unionpay: new URL("payment-details-menu-assets/union-pay-icon.svg", import.meta.url).href,
  unknown: new URL("payment-details-menu-assets/mastercard-icon.svg", import.meta.url).href,
  visa: new URL("payment-details-menu-assets/visa-icon.svg", import.meta.url).href,
} as const;

export type PaymentDetailsMenuLocale = "en-US" | "pt-BR";
export type PaymentDetailsMenuField = "billingEmail" | "card" | "cvv" | "expiry" | "name";
export type PaymentDetailsMenuCardBrand =
  | "amex"
  | "discover"
  | "mastercard"
  | "unionpay"
  | "unknown"
  | "visa";

export interface PaymentDetailsMenuProps<Message> {
  readonly billingEmail: string;
  readonly card: string;
  readonly cvv: string;
  readonly expiry: string;
  readonly id: string;
  readonly isCvvVisible: boolean;
  readonly isOpen: boolean;
  readonly locale: PaymentDetailsMenuLocale;
  readonly name: string;
  readonly onCancel: NoInfer<Message>;
  readonly onConfirm: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onFieldInput: (field: PaymentDetailsMenuField, value: string) => NoInfer<Message>;
  readonly onToggleCvv: NoInfer<Message>;
  readonly wordmarkAlt?: string;
  readonly wordmarkSrc?: string;
}

const copy = {
  "en-US": {
    billingContact: "Billing contact",
    billingDescription: "Add a second billing contact email.",
    cancel: "Cancel",
    cardNumber: "Card number",
    close: "Close slideout menu",
    confirm: "Confirm",
    cvv: "CVV",
    description: "Update your plan payment details.",
    email: "Email address",
    emailPlaceholder: "Email",
    expiry: "Expiry",
    name: "Name on card",
    title: "Payment details",
    tooltip: "This is tooltip",
  },
  "pt-BR": {
    billingContact: "Contato de cobrança",
    billingDescription: "Adicione um segundo e-mail de contato para cobrança.",
    cancel: "Cancelar",
    cardNumber: "Número do cartão",
    close: "Fechar menu lateral",
    confirm: "Confirmar",
    cvv: "CVV",
    description: "Atualize os dados de pagamento do seu plano.",
    email: "Endereço de e-mail",
    emailPlaceholder: "E-mail",
    expiry: "Validade",
    name: "Nome no cartão",
    title: "Detalhes do pagamento",
    tooltip: "Esta é uma dica.",
  },
} as const;

const digits = (fieldValue: string): string => fieldValue.replaceAll(/\D/gu, "");

const cardTypes = [
  { brand: "visa", pattern: /^4[0-9]{3,}$/u },
  { brand: "mastercard", pattern: /^5[1-5][0-9]{2,}$/u },
  { brand: "amex", pattern: /^3[47][0-9]{2,}$/u },
  { brand: "discover", pattern: /^6(?:011|5[0-9]{2}|4[4-9][0-9])[0-9]{12}$/u },
  { brand: "unionpay", pattern: /^(?:62|88)[0-9]{14,17}$/u },
] as const satisfies readonly {
  readonly brand: Exclude<PaymentDetailsMenuCardBrand, "unknown">;
  readonly pattern: RegExp;
}[];

export const detectPaymentDetailsMenuCardBrand = (
  cardNumber: string,
): PaymentDetailsMenuCardBrand =>
  cardTypes.find((cardType) => cardType.pattern.test(digits(cardNumber)))?.brand ?? "unknown";

export const formatPaymentDetailsMenuField = (
  field: PaymentDetailsMenuField,
  fieldValue: string,
): string => {
  if (field === "card") {
    return digits(fieldValue).slice(0, 16);
  }
  if (field === "expiry") {
    const compact = digits(fieldValue).slice(0, 6);
    return compact.length > 2 ? `${compact.slice(0, 2)} / ${compact.slice(2)}` : compact;
  }
  if (field === "cvv") {
    return digits(fieldValue).slice(0, 3);
  }
  return fieldValue;
};

const formatCardNumber = (cardNumber: string): string =>
  (
    digits(cardNumber)
      .slice(0, 16)
      .match(/\d{1,4}/gu) ?? []
  ).join(" ");

const lineIcon = <Message>(path: string, className: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(className),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D(path)])],
  );

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  lineIcon("M18 6 6 18M6 6l12 12", "size-5", h);

const creditCardIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  lineIcon(
    "M22 10H2m20-2.2v8.4c0 .98 0 1.47-.19 1.84a1.75 1.75 0 0 1-.77.77c-.37.19-.86.19-1.84.19H4.8c-.98 0-1.47 0-1.84-.19a1.75 1.75 0 0 1-.77-.77C2 17.67 2 17.18 2 16.2V7.8c0-.98 0-1.47.19-1.84a1.75 1.75 0 0 1 .77-.77C3.33 5 3.82 5 4.8 5h14.4c.98 0 1.47 0 1.84.19.33.17.6.44.77.77.19.37.19.86.19 1.84Z",
    "size-5",
    h,
  );

const mailIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  lineIcon(
    "m22 7-8.32 5.29c-.6.38-.9.57-1.22.64a2 2 0 0 1-.92 0c-.32-.07-.62-.26-1.22-.64L2 7m5.2 12h9.6c1.12 0 1.68 0 2.1-.22.38-.19.69-.5.88-.87.22-.43.22-.99.22-2.11V8.2c0-1.12 0-1.68-.22-2.1a2 2 0 0 0-.87-.88C18.48 5 17.92 5 16.8 5H7.2c-1.12 0-1.68 0-2.1.22a2 2 0 0 0-.88.87C4 6.52 4 7.08 4 8.2v7.6c0 1.12 0 1.68.22 2.1.19.38.5.69.87.88.43.22.99.22 2.11.22Z",
    "pointer-events-none size-5 shrink-0 text-fg-quaternary",
    h,
  );

const contactlessIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("h-6 w-5 text-white"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeWidth("2.57143"),
      h.ViewBox("0 0 20 24"),
    ],
    [
      h.path([
        h.D(
          "M15.1429 1.28571C17.0236 4.54326 18.0138 8.23849 18.0138 12C18.0138 15.7615 17.0236 19.4567 15.1429 22.7143M10.4286 3.64285C11.8956 6.18374 12.6679 9.06602 12.6679 12C12.6679 14.934 11.8956 17.8162 10.4286 20.3571M5.92859 5.80713C6.98933 7.66394 7.54777 9.77022 7.54777 11.9143C7.54777 14.0583 6.98933 16.1646 5.92859 18.0214M1.42859 8.14285C2.19306 9.29983 2.59834 10.6362 2.59834 12C2.59834 13.3638 2.19306 14.7002 1.42859 15.8571",
        ),
      ]),
    ],
  );

const mastercard = <Message>(h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.AriaHidden(true),
      h.Class("flex h-8 w-11.5 items-center justify-center rounded bg-white/10"),
    ],
    [
      h.svg(
        [h.AriaHidden(true), h.Fill("none"), h.Height("19"), h.ViewBox("0 0 30 19"), h.Width("30")],
        [
          h.path([
            h.ClipRule("evenodd"),
            h.D(
              "M14.9053 16.4392C13.3266 17.7699 11.2787 18.5733 9.04092 18.5733C4.04776 18.5733 0 14.5737 0 9.63994C0 4.70619 4.04776 0.706604 9.04092 0.706604C11.2787 0.706604 13.3266 1.50993 14.9053 2.84066C16.484 1.50993 18.5319 0.706604 20.7697 0.706604C25.7629 0.706604 29.8106 4.70619 29.8106 9.63994C29.8106 14.5737 25.7629 18.5733 20.7697 18.5733C18.5319 18.5733 16.484 17.7699 14.9053 16.4392Z",
            ),
            h.Fill("white"),
            h.FillRule("evenodd"),
            h.Opacity("0.5"),
          ]),
          h.path([
            h.ClipRule("evenodd"),
            h.D(
              "M14.9053 16.4392C16.8492 14.8007 18.0818 12.3625 18.0818 9.63994C18.0818 6.91733 16.8492 4.47919 14.9053 2.84066C16.484 1.50993 18.5319 0.706604 20.7697 0.706604C25.7628 0.706604 29.8106 4.70619 29.8106 9.63994C29.8106 14.5737 25.7628 18.5733 20.7697 18.5733C18.5319 18.5733 16.484 17.7699 14.9053 16.4392Z",
            ),
            h.Fill("white"),
            h.FillRule("evenodd"),
            h.Opacity("0.5"),
          ]),
          h.path([
            h.ClipRule("evenodd"),
            h.D(
              "M14.9053 16.4392C16.8492 14.8007 18.0818 12.3625 18.0818 9.63995C18.0818 6.91736 16.8492 4.47924 14.9053 2.8407C12.9614 4.47924 11.7288 6.91736 11.7288 9.63995C11.7288 12.3625 12.9614 14.8007 14.9053 16.4392Z",
            ),
            h.Fill("white"),
            h.FillRule("evenodd"),
          ]),
        ],
      ),
    ],
  );

const paymentInputIcon = <Message>(cardNumber: string, h: HtmlBuilder<Message>): Html => {
  const brand = detectPaymentDetailsMenuCardBrand(cardNumber);
  return h.img([
    h.Alt(""),
    h.AriaHidden(true),
    h.Class("h-6 w-8.5 shrink-0"),
    h.DataAttribute("payment-card-brand", brand),
    h.Src(paymentIconUrls[brand]),
  ]);
};

const cardWordmark = <Message>(
  props: PaymentDetailsMenuProps<Message>,
  h: HtmlBuilder<Message>,
): readonly Html[] =>
  props.wordmarkSrc === undefined
    ? []
    : [
        h.img([
          h.Alt(props.wordmarkAlt ?? ""),
          h.Class("h-5 w-auto rounded-sm"),
          h.Src(props.wordmarkSrc),
        ]),
      ];

const creditCard = <Message>(
  props: PaymentDetailsMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("relative flex h-[163.54px] w-68 md:h-47.5 md:w-79")],
    [
      h.div(
        [
          h.Class(
            "absolute top-0 left-0 flex h-47.5 w-79 origin-top-left scale-[0.8608] flex-col justify-between overflow-hidden rounded-2xl bg-black/10 bg-linear-to-br from-white/30 to-transparent p-4 text-white backdrop-blur-[6px] before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset md:scale-100",
          ),
        ],
        [
          h.div(
            [h.Class("relative flex items-start justify-between px-1 pt-1")],
            [...cardWordmark(props, h), contactlessIcon(h)],
          ),
          h.div(
            [h.Class("relative flex items-end justify-between gap-3")],
            [
              h.div(
                [h.Class("flex min-w-0 translate-y-0.5 flex-col gap-2")],
                [
                  h.div(
                    [h.Class("flex items-end gap-1")],
                    [
                      h.p(
                        [
                          h.Class("text-xs leading-snug font-semibold tracking-[0.6px] uppercase"),
                          h.Style({ "word-break": "break-word" }),
                        ],
                        [props.name],
                      ),
                      h.p(
                        [
                          h.Class(
                            "ml-auto shrink-0 text-right text-xs leading-normal font-semibold tracking-[0.6px] tabular-nums",
                          ),
                        ],
                        [props.expiry],
                      ),
                    ],
                  ),
                  h.div(
                    [h.Class("text-md leading-normal font-semibold tracking-[1px] tabular-nums")],
                    [
                      formatCardNumber(props.card),
                      h.span(
                        [
                          h.AriaHidden(true),
                          h.Class(
                            "pointer-events-none invisible inline-block w-0 max-w-0 opacity-0",
                          ),
                        ],
                        ["1"],
                      ),
                    ],
                  ),
                ],
              ),
              mastercard(h),
            ],
          ),
        ],
      ),
    ],
  );

const cardNumberField = <Message>(
  props: PaymentDetailsMenuProps<Message>,
  label: string,
  h: HtmlBuilder<Message>,
): Html => {
  const id = `${props.id}-card`;
  return h.div(
    [h.Class("flex w-full flex-col gap-1.5")],
    [
      h.div(
        [h.Class("flex items-center gap-0.5 text-sm font-medium text-text-secondary")],
        [h.label([h.For(id)], [label]), h.span([h.Class("text-text-brand-tertiary")], ["*"])],
      ),
      h.div(
        [
          h.Class(
            "flex w-full items-center gap-2 rounded-lg bg-bg-primary py-2 pr-3 pl-2 shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
          ),
        ],
        [
          paymentInputIcon(props.card, h),
          h.input([
            h.Class("min-w-0 flex-1 bg-transparent text-md text-text-primary outline-none"),
            h.Id(id),
            h.InputMode("numeric"),
            h.Maxlength(19),
            h.OnInput((value) =>
              props.onFieldInput("card", formatPaymentDetailsMenuField("card", value)),
            ),
            h.Required(true),
            h.Type("tel"),
            h.Value(formatCardNumber(props.card)),
          ]),
        ],
      ),
    ],
  );
};

export const paymentDetailsMenu = <Message>(
  props: PaymentDetailsMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  if (!props.isOpen) {
    return h.div([]);
  }
  const text = copy[props.locale];
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  return h.div(
    [
      h.Class(
        "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-end pl-6 outline-hidden md:pl-10",
      ),
    ],
    [
      h.button([
        h.AriaHidden(true),
        h.Class("absolute inset-0 cursor-default bg-overlay/70"),
        h.DataAttribute("payment-details-menu-backdrop", ""),
        h.OnClick(props.onDismiss),
        h.Tabindex(-1),
        h.Type("button"),
      ]),
      h.dialog(
        [
          h.AriaDescribedBy(descriptionId),
          h.AriaLabelledBy(titleId),
          h.Class(
            "fixed inset-y-0! right-0! left-auto! m-0 h-full w-[calc(100%-1.5rem)] max-w-100 border-0 bg-bg-primary p-0 shadow-xl outline-hidden md:w-full",
          ),
          h.Id(props.id),
          h.Dir("ltr"),
          h.Lang(props.locale),
          h.OnCancel(props.onDismiss),
          h.Tabindex(-1),
        ],
        [
          h.div(
            [h.Class("flex size-full flex-col items-start gap-6 overflow-y-auto bg-bg-primary")],
            [
              h.header(
                [h.Class("relative z-10 flex w-full items-start gap-4 px-4 pt-6 md:px-6")],
                [
                  h.div(
                    [
                      h.Class(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
                      ),
                    ],
                    [creditCardIcon(h)],
                  ),
                  h.section(
                    [h.Class("flex min-w-0 flex-col gap-0.5 pr-8")],
                    [
                      h.h1(
                        [
                          h.Class("text-md font-semibold text-text-primary md:text-lg"),
                          h.Id(titleId),
                        ],
                        [text.title],
                      ),
                      h.p(
                        [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                        [text.description],
                      ),
                    ],
                  ),
                  h.button(
                    [
                      h.AriaLabel(text.close),
                      h.Class(
                        "absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2",
                      ),
                      h.DataAttribute("payment-details-menu-close", ""),
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
                  h.div(
                    [
                      h.Class(
                        "relative flex min-h-53 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl py-6 md:min-h-59.5",
                      ),
                    ],
                    [
                      h.img([
                        h.Alt(""),
                        h.AriaHidden(true),
                        h.Class("absolute inset-0 size-full object-cover"),
                        h.Src(cardMockupUrl),
                      ]),
                      creditCard(props, h),
                    ],
                  ),
                  h.div(
                    [h.Class("flex flex-col gap-4")],
                    [
                      input(
                        {
                          isRequired: true,
                          label: text.name,
                          name: `${props.id}-name`,
                          onInput: (value) => props.onFieldInput("name", value),
                          requiredMarkCompact: true,
                          size: "md",
                          value: props.name,
                        },
                        h,
                      ),
                      cardNumberField(props, text.cardNumber, h),
                      h.div(
                        [h.Class("flex gap-4")],
                        [
                          h.div(
                            [h.Class("w-28")],
                            [
                              input(
                                {
                                  isRequired: true,
                                  label: text.expiry,
                                  maxLength: 9,
                                  name: `${props.id}-expiry`,
                                  onInput: (value) =>
                                    props.onFieldInput(
                                      "expiry",
                                      formatPaymentDetailsMenuField("expiry", value),
                                    ),
                                  requiredMarkCompact: true,
                                  size: "md",
                                  type: "tel",
                                  value: props.expiry,
                                },
                                h,
                              ),
                            ],
                          ),
                          h.div(
                            [h.Class("w-28")],
                            [
                              input(
                                {
                                  isPasswordVisible: props.isCvvVisible,
                                  isRequired: true,
                                  label: text.cvv,
                                  maxLength: 3,
                                  name: `${props.id}-cvv`,
                                  onInput: (value) =>
                                    props.onFieldInput(
                                      "cvv",
                                      formatPaymentDetailsMenuField("cvv", value),
                                    ),
                                  onTogglePassword: props.onToggleCvv,
                                  requiredMarkCompact: true,
                                  size: "md",
                                  type: "password",
                                  value: props.cvv,
                                  visibilityIconSize: "sm",
                                },
                                h,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("w-full border-t border-border-secondary")]),
                  h.div(
                    [h.Class("flex flex-col gap-4")],
                    [
                      h.section(
                        [h.Class("flex flex-col gap-1")],
                        [
                          h.p(
                            [h.Class("text-sm font-semibold text-text-primary")],
                            [text.billingContact],
                          ),
                          h.p([h.Class("text-sm text-text-tertiary")], [text.billingDescription]),
                        ],
                      ),
                      input(
                        {
                          autocomplete: "email",
                          isRequired: true,
                          label: text.email,
                          leadingIconElement: mailIcon(h),
                          name: `${props.id}-billing-email`,
                          onInput: (value) => props.onFieldInput("billingEmail", value),
                          placeholder: text.emailPlaceholder,
                          requiredMarkCompact: true,
                          size: "md",
                          tooltip: text.tooltip,
                          type: "email",
                          value: props.billingEmail,
                        },
                        h,
                      ),
                    ],
                  ),
                ],
              ),
              h.footer(
                [
                  h.Class(
                    "flex w-full shrink-0 justify-end gap-3 border-t border-border-secondary bg-bg-primary p-4 shadow-[0_-4px_6px_-2px_rgb(16_24_40/0.03)] md:px-6",
                  ),
                ],
                [
                  button(
                    { color: "secondary", label: text.cancel, onPress: props.onCancel, size: "sm" },
                    h,
                  ),
                  button(
                    { color: "primary", label: text.confirm, onPress: props.onConfirm, size: "sm" },
                    h,
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
};
