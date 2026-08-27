/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the authenticated signup dialog anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { input } from "../base/fields.ts";
import { socialButton } from "../base/social-button.ts";

export interface Signup02ModalProps<Message> {
  readonly email: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly onAppleSignup: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onEmailInput: (value: string) => NoInfer<Message>;
  readonly onFacebookSignup: NoInfer<Message>;
  readonly onGoogleSignup: NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly wordmarkAlt: string;
  readonly wordmarkSrc: string;
}

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("M18 6 6 18M6 6l12 12"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const divider = <Message>(h: HtmlBuilder<Message>): Html => {
  const line = h.span([h.AriaHidden(true), h.Class("h-px flex-1 bg-border-secondary")]);
  return h.div(
    [h.AriaLabel("OR"), h.Class("flex w-full shrink-0 items-center gap-x-2"), h.Role("separator")],
    [line, h.span([h.Class("text-sm font-medium text-text-tertiary")], ["OR"]), line],
  );
};

export const signup02Modal = <Message>(
  props: Signup02ModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  const formId = `${props.id}-form`;
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
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-max max-w-[calc(100%-32px)] overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 shadow-xl outline-hidden sm:m-auto sm:max-w-100 sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.button(
                    [
                      h.AriaLabel("Close"),
                      h.Autofocus(true),
                      h.Class(
                        "absolute top-3 right-3 z-20 flex size-9 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 sm:top-4 sm:right-4",
                      ),
                      h.OnClick(props.onDismiss),
                      h.Type("button"),
                    ],
                    [closeIcon(h)],
                  ),
                  h.header(
                    [
                      h.Class(
                        "flex flex-col items-center justify-center gap-4 px-4 pt-5 sm:px-6 sm:pt-6",
                      ),
                    ],
                    [
                      h.img([
                        h.Alt(props.wordmarkAlt),
                        h.Class("size-8 rounded-lg object-cover"),
                        h.Src(props.wordmarkSrc),
                      ]),
                      h.div(
                        [h.Class("flex flex-col items-center justify-center gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            ["Create an account"],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            ["Start your free 30-day trial. Cancel anytime."],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div(
                    [h.Class("flex flex-col gap-4 px-4 pb-4 sm:gap-5 sm:px-6 sm:pb-6")],
                    [
                      h.form(
                        [h.Class("flex flex-col gap-4"), h.Id(formId), h.OnSubmit(props.onSubmit)],
                        [
                          h.label([h.Class("sr-only"), h.For("input-email")], ["Email"]),
                          input(
                            {
                              hideRequiredIndicator: true,
                              isRequired: true,
                              name: "email",
                              onInput: props.onEmailInput,
                              placeholder: "Enter your email",
                              size: "md",
                              type: "email",
                              value: props.email,
                            },
                            h,
                          ),
                          button(
                            {
                              color: "primary",
                              label: "Get started",
                              size: "md",
                              type: "submit",
                            },
                            h,
                          ),
                        ],
                      ),
                      divider(h),
                      h.div(
                        [h.Class("flex flex-col gap-3")],
                        [
                          socialButton(
                            {
                              accessibleLabel: "Sign up with Google",
                              label: "Sign up with Google",
                              onPress: props.onGoogleSignup,
                              size: "md",
                              social: "google",
                              theme: "color",
                            },
                            h,
                          ),
                          socialButton(
                            {
                              accessibleLabel: "Sign up with Facebook",
                              label: "Sign up with Facebook",
                              onPress: props.onFacebookSignup,
                              size: "md",
                              social: "facebook",
                              theme: "color",
                            },
                            h,
                          ),
                          socialButton(
                            {
                              accessibleLabel: "Sign up with Apple",
                              label: "Sign up with Apple",
                              onPress: props.onAppleSignup,
                              size: "md",
                              social: "apple",
                              theme: "color",
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
