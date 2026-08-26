/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the authenticated signup dialog anatomy. */
import { symbol } from "brand";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { input } from "../base/fields.ts";
import { socialButton } from "../base/social-button.ts";

export type Signup01ModalField = "email" | "name" | "password";

export interface Signup01ModalProps<Message> {
  readonly email: string;
  readonly id: string;
  readonly invalidFields: readonly Signup01ModalField[];
  readonly isOpen: boolean;
  readonly isPasswordVisible: boolean;
  readonly name: string;
  readonly onDismiss: NoInfer<Message>;
  readonly onFieldInput: (field: Signup01ModalField, value: string) => NoInfer<Message>;
  readonly onGoogleSignIn: NoInfer<Message>;
  readonly onPasswordVisibilityToggle: NoInfer<Message>;
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

export const signup01Modal = <Message>(
  props: Signup01ModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  const formId = `${props.id}-form`;
  const isInvalid = (field: Signup01ModalField): boolean => props.invalidFields.includes(field);
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
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-[247px] max-w-[calc(100%-32px)] overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 shadow-xl outline-hidden sm:m-auto sm:w-[263px] sm:max-w-100 sm:rounded-2xl",
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
                    [h.Class("flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6")],
                    [
                      h.img([
                        h.Alt("Siglata"),
                        h.Class("size-8 rounded-lg object-cover"),
                        h.Src(symbol.url.href),
                      ]),
                      h.div(
                        [h.Class("flex flex-col gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            ["Sign up"],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            ["Start your 30-day free trial."],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.form(
                    [
                      h.Class("flex flex-col gap-4 px-4 sm:px-6"),
                      h.Id(formId),
                      h.OnSubmit(props.onSubmit),
                    ],
                    [
                      input(
                        {
                          autocomplete: "name",
                          hideRequiredIndicator: true,
                          isInvalid: isInvalid("name"),
                          isRequired: true,
                          label: "Name",
                          name: "name",
                          onInput: (value) => props.onFieldInput("name", value),
                          placeholder: "Enter your name",
                          size: "md",
                          value: props.name,
                        },
                        h,
                      ),
                      input(
                        {
                          autocomplete: "email",
                          hideRequiredIndicator: true,
                          isInvalid: isInvalid("email"),
                          isRequired: true,
                          label: "Email",
                          name: "email",
                          onInput: (value) => props.onFieldInput("email", value),
                          placeholder: "Enter your email",
                          size: "lg",
                          type: "email",
                          value: props.email,
                        },
                        h,
                      ),
                      input(
                        {
                          autocomplete: "new-password",
                          hideRequiredIndicator: true,
                          hint: "Must be at least 8 characters.",
                          isInvalid: isInvalid("password"),
                          isPasswordVisible: props.isPasswordVisible,
                          isRequired: true,
                          label: "Password",
                          name: "password",
                          onInput: (value) => props.onFieldInput("password", value),
                          onTogglePassword: props.onPasswordVisibilityToggle,
                          placeholder: "Create a password",
                          size: "lg",
                          type: "password",
                          value: props.password,
                          visibilityIconSize: "sm",
                        },
                        h,
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
                          theme: "brand",
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
