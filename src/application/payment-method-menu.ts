/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, unicorn/no-nested-ternary -- The controlled native slideout preserves the authenticated payment-method-menu anatomy and fixture. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { input } from "../base/fields.ts";

export type PaymentMethodMenuLocale = "en-US" | "pt-BR";
export type PaymentMethodMenuCard = "card-1" | "card-2" | "card-3" | "card-4";

export interface PaymentMethodMenuProps<Message> {
  readonly billingEmail: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale: PaymentMethodMenuLocale;
  readonly onAddPaymentMethod: NoInfer<Message>;
  readonly onBillingEmailInput: (value: string) => NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onConfirm: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onEdit: (card: PaymentMethodMenuCard) => NoInfer<Message>;
  readonly onSelect: (card: PaymentMethodMenuCard) => NoInfer<Message>;
  readonly onSetDefault: (card: PaymentMethodMenuCard) => NoInfer<Message>;
  readonly onUnmount: NoInfer<Message>;
  readonly selectedCard: PaymentMethodMenuCard;
}

const copy = {
  "en-US": {
    add: "Add payment method",
    billingContact: "Billing contact",
    billingDescription: "Add a second billing contact email.",
    cancel: "Cancel",
    close: "Close",
    confirm: "Confirm",
    description: "Update your plan payment details.",
    dialog: "Slideout menu",
    edit: "Edit",
    email: "Email address",
    expiry: "Expiry",
    methods: "Payment methods",
    setDefault: "Set as default",
    title: "Payment method",
  },
  "pt-BR": {
    add: "Adicionar forma de pagamento",
    billingContact: "Contato de cobrança",
    billingDescription: "Adicione um segundo email de contato para cobrança.",
    cancel: "Cancelar",
    close: "Fechar",
    confirm: "Confirmar",
    description: "Atualize os dados de pagamento do seu plano.",
    dialog: "Menu lateral",
    edit: "Editar",
    email: "Endereço de email",
    expiry: "Validade",
    methods: "Formas de pagamento",
    setDefault: "Definir como padrão",
    title: "Forma de pagamento",
  },
} as const;

const cards = [
  { brand: "visa", expiry: "06/2028", id: "card-1", title: "Visa ending in 1234" },
  { brand: "mastercard", expiry: "08/2029", id: "card-2", title: "Mastercard ending in 1234" },
  { brand: "apple-pay", expiry: "10/2028", id: "card-3", title: "Visa ending in 1234" },
  { brand: "stripe", expiry: "02/2029", id: "card-4", title: "Stripe (Visa ending 1234)" },
] as const satisfies readonly {
  readonly brand: "apple-pay" | "mastercard" | "stripe" | "visa";
  readonly expiry: string;
  readonly id: PaymentMethodMenuCard;
  readonly title: string;
}[];

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
const plusIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon("M12 5v14M5 12h14", "size-5", h);
const cardIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M22 10H2m9 4H6M2 8.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C3.52 19 4.08 19 5.2 19h13.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 17.48 22 16.92 22 15.8V8.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 5 19.92 5 18.8 5H5.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C2 6.52 2 7.08 2 8.2Z",
    "size-5",
    h,
  );
const mailIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "m2 7 8.165 5.715c.661.463.992.695 1.351.784a2 2 0 0 0 .968 0c.36-.09.69-.32 1.351-.784L22 7M6.8 20h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 17.72 22 16.88 22 15.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 4 18.88 4 17.2 4H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 6.28 2 7.12 2 8.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 20 5.12 20 6.8 20Z",
    "pointer-events-none size-5 shrink-0 text-fg-quaternary",
    h,
  );

const paymentLogo = <Message>(
  brand: (typeof cards)[number]["brand"],
  h: HtmlBuilder<Message>,
): Html => {
  const logoPath =
    brand === "visa"
      ? "M10.75 15.858H8.69L7.146 9.792c-.073-.279-.229-.525-.458-.642A6.6 6.6 0 0 0 4.8 8.508v-.233h3.318c.458 0 .801.35.859.758l.801 4.376 2.059-5.134h2.002l-3.089 7.583Zm4.234 0h-1.945l1.602-7.583h1.945l-1.602 7.583Zm4.119-5.482c.057-.409.4-.642.801-.642.63-.059 1.316.058 1.888.35l.343-1.633a4.9 4.9 0 0 0-1.773-.351c-1.888 0-3.262 1.05-3.262 2.508 0 1.11.973 1.692 1.66 2.042.743.35 1.03.584.972.934 0 .525-.572.758-1.144.758a4.8 4.8 0 0 1-2.002-.467l-.344 1.633c.687.292 1.43.409 2.117.409 2.117.057 3.433-.992 3.433-2.567 0-1.984-2.689-2.1-2.689-2.974Zm9.497 5.482-1.545-7.583h-1.659c-.343 0-.687.233-.801.583l-2.86 7h2.002l.4-1.108h2.46l.229 1.108H28.6Zm-2.918-5.541.572 2.858h-1.602l1.03-2.858Z"
      : brand === "stripe"
        ? "M18.268 8.142l-1.727.381V7.082l1.727-.374v1.434Zm3.592.798c-.674 0-1.108.325-1.349.552l-.089-.439h-1.514v8.239l1.72-.374.007-2c.248.184.613.445 1.218.445 1.232 0 2.354-1.017 2.354-3.257-.007-2.05-1.143-3.166-2.347-3.166Zm-.413 4.869c-.406 0-.647-.149-.812-.332l-.007-2.622c.179-.205.427-.346.819-.346.626 0 1.06.721 1.06 1.646 0 .947-.427 1.654-1.06 1.654Zm8.182-1.632c0-1.809-.853-3.237-2.484-3.237-1.638 0-2.629 1.428-2.629 3.223 0 2.126 1.17 3.2 2.849 3.2.819 0 1.438-.19 1.906-.459v-1.413c-.468.24-1.005.389-1.686.389-.667 0-1.259-.24-1.335-1.074h3.365c0-.093.014-.488.014-.629Zm-3.399-.671c0-.799.475-1.131.908-1.131.42 0 .867.332.867 1.131h-1.775ZM16.541 9.06h1.727v6.183h-1.727V9.06Zm-1.961 0 .11.523c.406-.763 1.211-.607 1.432-.523v1.626c-.214-.078-.902-.177-1.308.367v4.19h-1.72V9.06h1.486Zm-3.33-1.533-1.679.368-.007 5.66c0 1.045.764 1.816 1.782 1.816.564 0 .977-.107 1.204-.234v-1.434c-.22.092-1.307.417-1.307-.629v-2.508h1.307V9.06h-1.307l.007-1.533Zm-4.067 2.947c-.365 0-.585.106-.585.381 0 .787 2.629.515 2.629 2.523 0 1.265-.984 1.993-2.415 1.993-.592 0-1.239-.121-1.879-.403v-1.682c.578.325 1.308.565 1.879.565.385 0 .66-.106.66-.431 0-.842-2.615-.6-2.615-2.48 0-1.251.929-2 2.326-2 .571 0 1.135.092 1.707.325v1.661c-.523-.29-1.184-.452-1.707-.452Z"
        : brand === "apple-pay"
          ? "M9.45 8.343c-.286.352-.743.63-1.199.59-.057-.476.166-.981.428-1.294.285-.361.784-.619 1.189-.639.047.496-.138.981-.419 1.343Zm.413.684c-.661-.04-1.168.392-1.541.392-.324 0-.852-.372-1.322-.362-.68.01-1.313.411-1.66 1.051-.713 1.278-.185 3.172.504 4.213.338.515.742 1.08 1.275 1.06.504-.02.694-.342 1.312-.342.61 0 .78.342 1.323.332.551-.01.899-.515 1.236-1.03.391-.595.552-1.17.562-1.2-.01-.01-1.075-.417-1.084-1.685-.01-1.06.846-1.568.87-1.586-.476-.734-1.218-.813-1.475-.833Zm3.819 6.29V7.59h2.783c1.436 0 2.44 1.031 2.44 2.538s-1.023 2.548-2.478 2.548h-1.594v2.642h-1.151Zm1.151-6.716v3.068h1.322c1.004 0 1.575-.56 1.575-1.536s-.571-1.531-1.57-1.531h-1.327Zm7.872 5.789c-.304.604-.975.986-1.698.986-1.07 0-1.817-.664-1.817-1.665 0-.991.723-1.561 2.06-1.646l1.436-.089v-.426c0-.63-.395-.972-1.099-.972-.58 0-1.003.313-1.089.789h-1.037c.034-1.002.937-1.73 2.16-1.73 1.317 0 2.173.718 2.173 1.834v3.846h-1.065v-.927h-.024Zm-1.389.069c-.613 0-1.003-.307-1.003-.778 0-.486.375-.768 1.094-.813l1.279-.084v.436c0 .724-.59 1.239-1.37 1.239Zm6.012 1.16c-.461 1.353-.989 1.799-2.111 1.799-.086 0-.371-.01-.438-.03v-.927c.071.01.247.02.338.02.508 0 .794-.223.97-.803l.104-.342-1.95-5.625h1.204l1.355 4.565h.024l1.356-4.565h1.17l-2.022 5.908Z"
          : "";
  return h.svg(
    [h.AriaHidden(true), h.Class("h-8 w-11.5 shrink-0"), h.Fill("none"), h.ViewBox("0 0 34 24")],
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
      ...(brand === "mastercard"
        ? [
            h.path([
              h.D("M17.179 16.829A6.8 6.8 0 1 1 17.18 6.63a6.8 6.8 0 1 1 0 10.199Z"),
              h.Fill("#ED0006"),
              h.FillRule("evenodd"),
            ]),
            h.path([
              h.D(
                "M17.179 16.829a6.67 6.67 0 0 0 2.382-5.099 6.67 6.67 0 0 0-2.382-5.1 6.8 6.8 0 1 1 0 10.2Z",
              ),
              h.Fill("#F9A000"),
              h.FillRule("evenodd"),
            ]),
            h.path([
              h.D(
                "M17.179 16.829a6.67 6.67 0 0 0 2.383-5.099 6.67 6.67 0 0 0-2.383-5.1 6.67 6.67 0 0 0-2.382 5.1 6.67 6.67 0 0 0 2.382 5.099Z",
              ),
              h.Fill("#FF5E00"),
              h.FillRule("evenodd"),
            ]),
          ]
        : [
            h.path([
              h.ClipRule("evenodd"),
              h.D(logoPath),
              h.Fill(brand === "stripe" ? "#6461FC" : brand === "visa" ? "#172B85" : "black"),
              h.FillRule("evenodd"),
            ]),
          ]),
    ],
  );
};

const checkIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-3 text-fg-white"), h.Fill("none"), h.ViewBox("0 0 14 14")],
    [
      h.path([
        h.D("M11.667 3.5 5.25 9.917 2.333 7"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const paymentCard = <Message>(
  props: PaymentMethodMenuProps<Message>,
  card: (typeof cards)[number],
  h: HtmlBuilder<Message>,
): Html => {
  const text = copy[props.locale];
  const selected = props.selectedCard === card.id;
  const inputId = `${props.id}-${card.id}`;
  return h.label(
    [
      h.Class(
        `relative block cursor-pointer rounded-xl bg-bg-primary outline-focus-ring ring-inset has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${selected ? "ring-2 ring-border-brand" : "ring-1 ring-border-secondary"}`,
      ),
    ],
    [
      h.input([
        h.Checked(selected),
        h.Class("peer sr-only"),
        h.Id(inputId),
        h.Name(`${props.id}-payment-methods`),
        h.OnChange(() => props.onSelect(card.id)),
        h.Type("radio"),
        h.Value(card.id),
      ]),
      h.span(
        [h.Class("flex items-start gap-1 p-4")],
        [
          h.span(
            [h.Class("flex min-w-0 flex-1 gap-3")],
            [
              paymentLogo(card.brand, h),
              h.span(
                [h.Class("flex min-w-0 flex-1 flex-col")],
                [
                  h.span([h.Class("text-sm font-medium text-text-secondary")], [card.title]),
                  h.span(
                    [h.Class("text-sm text-text-tertiary")],
                    [`${text.expiry} ${card.expiry}`],
                  ),
                  h.span(
                    [h.Class("mt-2 flex gap-3")],
                    [
                      h.button(
                        [
                          h.Class(
                            "text-sm font-semibold text-text-tertiary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                          ),
                          h.OnClick(props.onSetDefault(card.id)),
                          h.Type("button"),
                        ],
                        [text.setDefault],
                      ),
                      h.button(
                        [
                          h.Class(
                            "text-sm font-semibold text-text-brand-secondary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                          ),
                          h.OnClick(props.onEdit(card.id)),
                          h.Type("button"),
                        ],
                        [text.edit],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
          h.span(
            [
              h.Class(
                `mt-0.5 flex size-4 shrink-0 items-center justify-center rounded ring-1 ring-inset ${selected ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"}`,
              ),
            ],
            selected ? [checkIcon(h)] : [],
          ),
        ],
      ),
    ],
  );
};

export const paymentMethodMenu = <Message>(
  props: PaymentMethodMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const text = copy[props.locale];
  const titleId = `${props.id}-title`;
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
              h.DataAttribute("payment-method-menu-overlay", props.id),
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
                  h.AriaLabel(text.dialog),
                  h.Attribute("dir", "ltr"),
                  h.Class(
                    "fixed inset-y-0 right-0 left-auto my-0 mr-0 ml-auto h-full w-[calc(100%-1.5rem)] max-w-100 overflow-hidden border-0 bg-transparent p-0 shadow-xl outline-hidden md:w-[calc(100%-2.5rem)]",
                  ),
                  h.Id(props.id),
                  h.Lang(props.locale),
                  h.OnCancel(props.onDismiss),
                  h.OnUnmount(props.onUnmount),
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
                          h.div(
                            [
                              h.Class(
                                "relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
                              ),
                            ],
                            [cardIcon(h)],
                          ),
                          h.section(
                            [h.Class("flex flex-col gap-0.5")],
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
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("payment-method-menu-close", ""),
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
                          h.section(
                            [h.Class("flex flex-col items-end gap-4")],
                            [
                              h.fieldset(
                                [h.Class("flex w-full flex-col gap-3")],
                                [
                                  h.legend([h.Class("sr-only")], [text.methods]),
                                  ...cards.map((card) => paymentCard(props, card, h)),
                                ],
                              ),
                              button(
                                {
                                  color: "link-color",
                                  iconLeadingElement: plusIcon(h),
                                  label: text.add,
                                  onPress: props.onAddPaymentMethod,
                                  size: "md",
                                },
                                h,
                              ),
                            ],
                          ),
                          h.div([
                            h.Class("w-full border-t border-border-secondary"),
                            h.Id("divider"),
                          ]),
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
                                  h.p(
                                    [h.Class("text-sm text-text-tertiary")],
                                    [text.billingDescription],
                                  ),
                                ],
                              ),
                              input(
                                {
                                  isRequired: true,
                                  label: text.email,
                                  leadingIconElement: mailIcon(h),
                                  name: `${props.id}-billing-email`,
                                  onInput: props.onBillingEmailInput,
                                  placeholder: "Email",
                                  size: "md",
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
                            "flex w-full justify-end gap-3 p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6",
                          ),
                        ],
                        [
                          button(
                            {
                              color: "secondary",
                              label: text.cancel,
                              onPress: props.onCancel,
                              size: "sm",
                            },
                            h,
                          ),
                          button(
                            {
                              color: "primary",
                              label: text.confirm,
                              onPress: props.onConfirm,
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
