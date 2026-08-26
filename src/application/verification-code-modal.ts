/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled native dialog preserves the authenticated verification-code anatomy and its responsive PIN slots. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export type VerificationCodeModalLocale = "en-US" | "pt-BR";

export interface VerificationCodeModalProps<Message> {
  readonly code: string;
  readonly id: string;
  readonly isCodeFocused: boolean;
  readonly isCodeInvalid: boolean;
  readonly isOpen: boolean;
  readonly locale: VerificationCodeModalLocale;
  readonly onCancel: NoInfer<Message>;
  readonly onCodeBlur: NoInfer<Message>;
  readonly onCodeFocus: NoInfer<Message>;
  readonly onCodeInput: (code: string) => NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onResend: NoInfer<Message>;
  readonly onVerify: NoInfer<Message>;
}

const copy = {
  "en-US": {
    cancel: "Cancel",
    close: "Close dialog",
    codeLabel: "Enter your pin",
    description: "We've sent a code to ",
    digitLead: "Enter digit ",
    digitSuffix: " of 4",
    resend: "Click to resend",
    resendLead: "Didn't get a code? ",
    title: "Please check your email.",
    verify: "Verify",
  },
  "pt-BR": {
    cancel: "Cancelar",
    close: "Fechar diálogo",
    codeLabel: "Digite seu código",
    description: "Enviamos um código para ",
    digitLead: "Digite o dígito ",
    digitSuffix: " de 4",
    resend: "Clique para reenviar",
    resendLead: "Não recebeu o código? ",
    title: "Confira seu e-mail.",
    verify: "Verificar",
  },
} as const;

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

const mailIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "m2 7 8.165 5.715c.661.463.992.695 1.351.784a2 2 0 0 0 .968 0c.36-.09.69-.32 1.351-.784L22 7M6.8 20h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 17.72 22 16.88 22 15.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 4 18.88 4 17.2 4H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 6.28 2 7.12 2 8.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 20 5.12 20 6.8 20Z",
    "z-1 size-5",
    h,
  );

const codeSlot = <Message>(
  props: VerificationCodeModalProps<Message>,
  index: number,
  size: "lg" | "md",
  h: HtmlBuilder<Message>,
): Html => {
  const code = props.code.slice(0, 4);
  const character = code.at(index);
  const active = props.isCodeFocused && index === Math.min(code.length, 3);
  const text = copy[props.locale];
  const digitLabel = `${text.digitLead}${String(index + 1)}${text.digitSuffix}`;
  const emptyState = active
    ? "text-text-placeholder/40 ring-2 ring-border-brand outline-2 outline-offset-2 outline-border-brand"
    : "text-text-placeholder/40 ring-1 ring-border-primary";
  const filledState = active
    ? "text-text-brand-tertiary-alt ring-2 ring-border-brand outline-2 outline-offset-2 outline-border-brand"
    : "text-text-brand-tertiary-alt ring-2 ring-border-brand";
  const visualState = character === undefined ? emptyState : filledState;
  const invalidState = props.isCodeInvalid
    ? "text-text-error-primary ring-border-error-subtle"
    : "";
  const sizeClass =
    size === "lg" ? "size-24 px-2 py-3 text-display-xl" : "size-20 px-2 py-2.5 text-display-lg";
  return h.div(
    [
      h.AriaInvalid(props.isCodeInvalid),
      h.AriaLabel(digitLabel),
      h.Class(
        `relative flex items-center justify-center rounded-xl bg-bg-primary text-center font-mono font-medium shadow-xs ring-inset transition-[box-shadow,background-color] duration-100 ease-linear ${sizeClass} ${visualState} ${invalidState}`,
      ),
    ],
    character === undefined
      ? [
          active
            ? h.span([
                h.AriaHidden(true),
                h.Class(
                  `pointer-events-none h-[1em] w-0.5 animate-caret-blink bg-fg-brand-primary font-medium ${size === "lg" ? "text-display-xl" : "text-display-lg"}`,
                ),
              ])
            : "0",
        ]
      : [character],
  );
};

const codeInput = <Message>(
  props: VerificationCodeModalProps<Message>,
  size: "lg" | "md",
  h: HtmlBuilder<Message>,
): Html => {
  const inputId = `${props.id}-code-${size}`;
  const descriptionId = `${inputId}-description`;
  const text = copy[props.locale];
  return h.div(
    [
      h.Class(`flex h-max flex-col gap-1.5 ${size === "lg" ? "max-sm:hidden" : "sm:hidden"}`),
      h.Role("group"),
    ],
    [
      h.div(
        [
          h.Class(
            `relative flex flex-row gap-3 overflow-hidden ${size === "lg" ? "h-24.5" : "h-20.5"}`,
          ),
        ],
        [
          h.input([
            h.AriaDescribedBy(descriptionId),
            h.AriaInvalid(props.isCodeInvalid),
            h.AriaLabel(text.codeLabel),
            h.Autocomplete("one-time-code"),
            h.Class("absolute inset-0 z-10 cursor-text"),
            h.Id(inputId),
            h.InputMode("numeric"),
            h.Maxlength(4),
            h.OnBlur(props.onCodeBlur),
            h.OnFocus(props.onCodeFocus),
            h.OnInput((value) => props.onCodeInput(value.replaceAll(/\D/gu, "").slice(0, 4))),
            h.Pattern("[0-9]*"),
            h.Style({
              background: "transparent",
              border: "0 solid transparent",
              "box-shadow": "none",
              "caret-color": "transparent",
              "clip-path": "inset(0 40px 0 0)",
              color: "transparent",
              "font-family": "var(--font-mono)",
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
            h.Value(props.code.slice(0, 4)),
          ]),
          codeSlot(props, 0, size, h),
          codeSlot(props, 1, size, h),
          codeSlot(props, 2, size, h),
          codeSlot(props, 3, size, h),
        ],
      ),
      h.p(
        [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
        [
          text.resendLead,
          h.button(
            [
              h.Class(
                "cursor-pointer rounded-xs underline underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
              ),
              h.OnClick(props.onResend),
              h.Type("button"),
            ],
            [text.resend],
          ),
          ".",
        ],
      ),
    ],
  );
};

export const verificationCodeModal = <Message>(
  props: VerificationCodeModalProps<Message>,
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
                  h.Class(
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-[calc(100%-32px)] max-w-102 overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:w-full sm:rounded-2xl",
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
                        "absolute top-3 right-3 z-20 flex size-9 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2 sm:top-4 sm:right-4",
                      ),
                      h.DataAttribute("verification-code-close", ""),
                      h.OnClick(props.onDismiss),
                      h.Type("button"),
                    ],
                    [closeIcon(h)],
                  ),
                  h.header(
                    [h.Class("flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6")],
                    [
                      h.div(
                        [h.Class("relative flex w-full items-center justify-center")],
                        [
                          h.div(
                            [
                              h.Class(
                                "relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
                              ),
                            ],
                            [mailIcon(h)],
                          ),
                        ],
                      ),
                      h.div(
                        [h.Class("z-10 flex flex-col items-center justify-center gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            [text.title],
                          ),
                          h.p(
                            [
                              h.Class("text-center text-sm text-text-tertiary"),
                              h.Id(descriptionId),
                            ],
                            [
                              text.description,
                              h.span([h.Class("text-sm font-semibold")], ["olivia@siglata.com"]),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div(
                    [h.Class("relative z-10 flex flex-col gap-1.5 px-[31.5px] sm:px-6.5")],
                    [codeInput(props, "lg", h), codeInput(props, "md", h)],
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
                          label: text.cancel,
                          onPress: props.onCancel,
                          size: "md",
                        },
                        h,
                      ),
                      button(
                        {
                          color: "primary",
                          label: text.verify,
                          onPress: props.onVerify,
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
