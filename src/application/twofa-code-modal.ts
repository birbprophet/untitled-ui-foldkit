/* oxlint-disable @rikalabs/no-low-signal-variable-names, @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-negated-condition, eslint/no-nested-ternary, typescript/no-misused-spread, unicorn/no-nested-ternary -- The controlled native dialog preserves the authenticated two-factor-code anatomy and its six explicit PIN slots. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export type TwofaCodeModalLocale = "en-US" | "pt-BR";

export interface TwofaCodeModalProps<Message> {
  readonly code: string;
  readonly id: string;
  readonly isCodeFocused: boolean;
  readonly isOpen: boolean;
  readonly locale: TwofaCodeModalLocale;
  readonly onCancel: NoInfer<Message>;
  readonly onCodeBlur: NoInfer<Message>;
  readonly onCodeFocus: NoInfer<Message>;
  readonly onCodeInput: (code: string) => NoInfer<Message>;
  readonly onConfirm: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onResend: NoInfer<Message>;
}

const copy = {
  "en-US": {
    cancel: "Cancel",
    close: "Close",
    confirm: "Confirm",
    description:
      "To authorize transactions, please scan this QR code with your Google Authenticator App and enter the verification code below.",
    pinLabel: "Enter your pin",
    qrLabel: "Scan this QR code with an authenticator app",
    resend: "Click to resend",
    resendLead: "Didn't get a code?\u00A0",
    title: "Set up two-factor authentication",
    verificationCode: "Verification code",
  },
  "pt-BR": {
    cancel: "Cancelar",
    close: "Fechar",
    confirm: "Confirmar",
    description:
      "Para autorizar transações, escaneie este código QR com o Google Authenticator e insira o código de verificação abaixo.",
    pinLabel: "Insira seu código",
    qrLabel: "Escaneie este código QR com um aplicativo autenticador",
    resend: "Clique para reenviar",
    resendLead: "Não recebeu um código?\u00A0",
    title: "Configure a autenticação de dois fatores",
    verificationCode: "Código de verificação",
  },
} as const;

const qrRows = [
  "11111110000110110011001111111",
  "10000010011011111100101000001",
  "10111010110101101111101011101",
  "10111010001000111001101011101",
  "10111010110000001010001011101",
  "10000010100101010011001000001",
  "11111110101010101010101111111",
  "00000000001000001111100000000",
  "01001010110111001011010110100",
  "11110100111100100101101110111",
  "11111110100101100010110010001",
  "10000001001000101100010011011",
  "10101010011010011101000101001",
  "01000001000101111100001010111",
  "11000110010001010010100010001",
  "00110001001101101001101101001",
  "11000110001010111001100000000",
  "10010100111111100011001111101",
  "00111010111101010001000011001",
  "00111100101010111111100100011",
  "11010011010010100100111111001",
  "00000000100100011010100010101",
  "11111110010001010101101010001",
  "10000010010111100111100011011",
  "10111010100111100011111110011",
  "10111010010110101100000100010",
  "10111010011000001101110000111",
  "10000010100110000110000101011",
  "11111110010110110101111011010",
] as const;

const qrPath = qrRows
  .flatMap((row, y) =>
    [...row].map((cell, x) => (cell === "1" ? `M${String(x)} ${String(y)}h1v1h-1z` : "")),
  )
  .join("");

const pathIcon = <Message>(path: string, className: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(className),
      h.DataAttribute("icon", ""),
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
const lockIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M17 10V8A5 5 0 0 0 7 8v2m5 4.5v2M8.8 21h6.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C20 18.72 20 17.88 20 16.2v-1.4c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C17.72 10 16.88 10 15.2 10H8.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C4 12.28 4 13.12 4 14.8v1.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C6.28 21 7.12 21 8.8 21Z",
    "z-1 size-5",
    h,
  );

const frameHandle = <Message>(position: string, h: HtmlBuilder<Message>): Html =>
  h.div([
    h.AriaHidden(true),
    h.Class(`absolute size-3 rounded-tl border-t-2 border-l-2 border-fg-brand-primary ${position}`),
  ]);

const qrCode = <Message>(size: "md" | "lg", label: string, h: HtmlBuilder<Message>): Html => {
  const large = size === "lg";
  const dimension = large ? 128 : 96;
  const scale = large ? 4 : 3;
  const offset = large ? 6 : 4;
  return h.div(
    [
      h.Class(
        `relative items-center justify-center ${large ? "hidden p-3 sm:flex" : "flex p-2 sm:hidden"}`,
      ),
    ],
    [
      h.svg(
        [
          h.AriaLabel(label),
          h.Class(large ? "size-32" : "size-24"),
          h.Role("img"),
          h.ViewBox(`0 0 ${String(dimension)} ${String(dimension)}`),
        ],
        [
          h.rect([
            h.Fill("white"),
            h.Height(String(dimension)),
            h.Width(String(dimension)),
            h.X("0"),
            h.Y("0"),
          ]),
          h.path([
            h.D(qrPath),
            h.Fill("black"),
            h.Transform(`translate(${String(offset)} ${String(offset)}) scale(${String(scale)})`),
          ]),
        ],
      ),
      frameHandle("top-0 left-0", h),
      frameHandle("top-0 right-0 rotate-90", h),
      frameHandle("right-0 bottom-0 rotate-180", h),
      frameHandle("bottom-0 left-0 -rotate-90", h),
    ],
  );
};

const codeSlot = <Message>(
  props: TwofaCodeModalProps<Message>,
  index: number,
  h: HtmlBuilder<Message>,
): Html => {
  const code = props.code.slice(0, 6);
  const character = code.at(index);
  const active = props.isCodeFocused && index === Math.min(code.length, 5);
  const state =
    character === undefined
      ? active
        ? "text-text-placeholder/40 ring-2 ring-border-brand outline-2 outline-offset-2 outline-border-brand"
        : "text-text-placeholder/40 ring-1 ring-border-primary"
      : "text-text-brand-tertiary-alt ring-2 ring-border-brand";
  return h.div(
    [
      h.AriaHidden(true),
      h.Class(
        `relative flex size-20 items-center justify-center rounded-xl bg-bg-primary px-2 py-2.5 text-center text-display-lg font-medium shadow-xs ring-inset transition-[box-shadow,background-color] duration-100 ease-linear max-[400px]:size-max max-sm:px-3.5 max-sm:py-2.5 max-sm:text-display-xs max-sm:font-medium ${state}`,
      ),
    ],
    character === undefined
      ? [
          active
            ? h.span([
                h.AriaHidden(true),
                h.Class(
                  "pointer-events-none h-[1em] w-0.5 animate-caret-blink bg-fg-brand-primary text-display-lg font-medium max-sm:text-display-xs",
                ),
              ])
            : "0",
        ]
      : [character],
  );
};

const codeInput = <Message>(props: TwofaCodeModalProps<Message>, h: HtmlBuilder<Message>): Html => {
  const strings = copy[props.locale];
  const inputId = `${props.id}-code`;
  const labelId = `${inputId}-label`;
  const descriptionId = `${inputId}-description`;
  return h.div(
    [h.Class("relative z-10 flex flex-col gap-1.5"), h.Role("group")],
    [
      h.label(
        [
          h.Class(
            "flex cursor-default items-center gap-0.5 text-sm font-medium text-text-secondary",
          ),
          h.For(inputId),
          h.Id(labelId),
        ],
        [
          strings.verificationCode,
          h.span([h.AriaHidden(true), h.Class("text-text-brand-tertiary")], ["*"]),
        ],
      ),
      h.div(
        [h.Class("relative flex h-20.5 flex-row gap-3 overflow-hidden max-sm:h-max")],
        [
          h.input([
            h.AriaDescribedBy(descriptionId),
            h.AriaLabel(strings.pinLabel),
            h.AriaLabelledBy(labelId),
            h.Autocomplete("one-time-code"),
            h.Class("absolute inset-0 z-10 cursor-text"),
            h.Id(inputId),
            h.InputMode("numeric"),
            h.Maxlength(6),
            h.OnBlur(props.onCodeBlur),
            h.OnFocus(props.onCodeFocus),
            h.OnInput((value) => props.onCodeInput(value.replaceAll(/\D/gu, "").slice(0, 6))),
            h.Pattern("[0-9]*"),
            h.Style({
              background: "transparent",
              border: "0 solid transparent",
              "box-shadow": "none",
              "caret-color": "transparent",
              "clip-path": "inset(0 40px 0 0)",
              color: "transparent",
              "font-family": "monospace",
              "font-size": "var(--root-height)",
              "font-variant-numeric": "tabular-nums",
              height: "100%",
              "letter-spacing": "-0.5em",
              "line-height": "1",
              opacity: "1",
              outline: "transparent solid 0",
              "pointer-events": "all",
              "text-align": "left",
              width: "calc(100% + 40px)",
            }),
            h.Type("text"),
            h.Value(props.code.slice(0, 6)),
          ]),
          codeSlot(props, 0, h),
          codeSlot(props, 1, h),
          codeSlot(props, 2, h),
          h.div(
            [
              h.Class(
                "text-center text-display-xl font-medium text-utility-neutral-300 max-[400px]:size-max max-sm:py-2.5 max-sm:text-display-xs max-sm:font-medium",
              ),
              h.Role("separator"),
            ],
            ["-"],
          ),
          codeSlot(props, 3, h),
          codeSlot(props, 4, h),
          codeSlot(props, 5, h),
        ],
      ),
      h.p(
        [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId), h.Role("description")],
        [
          strings.resendLead,
          h.button(
            [
              h.Class(
                "cursor-pointer rounded-xs underline underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
              ),
              h.OnClick(props.onResend),
              h.Type("button"),
            ],
            [strings.resend],
          ),
          ".",
        ],
      ),
    ],
  );
};

export const twofaCodeModal = <Message>(
  props: TwofaCodeModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const strings = copy[props.locale];
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
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-[calc(100%-32px)] max-w-128 overflow-x-hidden overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:w-full sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.Lang(props.locale),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.button(
                    [
                      h.AriaLabel(strings.close),
                      h.Class(
                        "absolute top-3 right-3 z-20 flex size-9 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 sm:top-4 sm:right-4",
                      ),
                      h.DataAttribute("twofa-close", ""),
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
                            "relative flex size-10 w-max items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
                          ),
                        ],
                        [lockIcon(h)],
                      ),
                      h.div(
                        [h.Class("z-10 flex flex-col gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            [strings.title],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            [strings.description],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div(
                    [h.Class("flex flex-col gap-4 px-4 sm:gap-5 sm:px-6")],
                    [
                      h.div(
                        [
                          h.Class(
                            "relative flex w-full items-center justify-center rounded-lg bg-bg-secondary p-5",
                          ),
                        ],
                        [
                          qrCode("lg", strings.qrLabel, h),
                          qrCode("md", strings.qrLabel, h),
                          h.div([
                            h.AriaHidden(true),
                            h.Class(
                              "absolute bottom-0 h-1/2 w-full border-t border-border-brand bg-bg-brand-solid/10 md:max-w-[calc(100%-40px)]",
                            ),
                            h.Style({
                              "-webkit-mask-image":
                                "radial-gradient(52.19% 100% at 50% 0%, #000 0%, rgba(0,0,0,0) 95.31%)",
                              "mask-image":
                                "radial-gradient(52.19% 100% at 50% 0%, #000 0%, rgba(0,0,0,0) 95.31%)",
                            }),
                          ]),
                        ],
                      ),
                      codeInput(props, h),
                    ],
                  ),
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
                          label: strings.cancel,
                          onPress: props.onCancel,
                          size: "md",
                        },
                        h,
                      ),
                      button(
                        {
                          color: "primary",
                          label: strings.confirm,
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
