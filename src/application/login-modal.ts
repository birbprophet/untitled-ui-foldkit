/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the authenticated login dialog anatomy. */
import { symbol } from "brand";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { checkbox } from "../base/controls.ts";
import { input } from "../base/fields.ts";
import { socialButton } from "../base/social-button.ts";

export interface LoginModalProps<Message> {
  readonly email: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly isRemembered: boolean;
  readonly onDismiss: NoInfer<Message>;
  readonly onEmailInput: (value: string) => NoInfer<Message>;
  readonly onForgotPassword: NoInfer<Message>;
  readonly onGoogleSignIn: NoInfer<Message>;
  readonly onPasswordInput: (value: string) => NoInfer<Message>;
  readonly onRememberToggle: NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly password: string;
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

export const loginModal = <Message>(
  props: LoginModalProps<Message>,
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
                      h.AriaLabel("Close dialog"),
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
                        h.Alt("Siglata"),
                        h.Class("size-8 rounded-lg object-cover"),
                        h.Src(symbol.url.href),
                      ]),
                      h.div(
                        [h.Class("flex flex-col items-center justify-center gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            ["Log in to your account"],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            ["Welcome back! Please enter your details."],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.form(
                    [
                      h.Class("flex flex-col gap-5 px-4 sm:px-6"),
                      h.Id(formId),
                      h.OnSubmit(props.onSubmit),
                    ],
                    [
                      h.div(
                        [h.Class("flex flex-col gap-4")],
                        [
                          input(
                            {
                              hideRequiredIndicator: true,
                              isRequired: true,
                              label: "Email",
                              name: "email",
                              onInput: props.onEmailInput,
                              placeholder: "Enter your email",
                              size: "md",
                              type: "email",
                              value: props.email,
                            },
                            h,
                          ),
                          input(
                            {
                              autocomplete: "current-password",
                              hideRequiredIndicator: true,
                              isRequired: true,
                              label: "Password",
                              name: "password",
                              onInput: props.onPasswordInput,
                              placeholder: "••••••••",
                              size: "lg",
                              type: "password",
                              value: props.password,
                              visibilityIconSize: "sm",
                            },
                            h,
                          ),
                        ],
                      ),
                      h.div(
                        [h.Class("flex justify-between")],
                        [
                          checkbox(
                            {
                              isSelected: props.isRemembered,
                              label: "Remember for 30 days",
                              name: "remember-me-checkbox",
                              onToggle: props.onRememberToggle,
                            },
                            h,
                          ),
                          button(
                            {
                              color: "link-color",
                              label: "Forgot password",
                              onPress: props.onForgotPassword,
                              size: "md",
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
                        "flex flex-1 flex-col gap-3 p-4 pt-6 sm:px-6 sm:pt-8 sm:pb-6 [&>*]:grow",
                      ),
                    ],
                    [
                      button(
                        {
                          color: "primary",
                          form: formId,
                          label: "Sign in",
                          size: "md",
                          type: "submit",
                        },
                        h,
                      ),
                      socialButton(
                        {
                          accessibleLabel: "Sign in with Google",
                          label: "Sign in with Google",
                          onPress: props.onGoogleSignIn,
                          size: "lg",
                          social: "google",
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
        ]
      : [],
  );
};
