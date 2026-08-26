/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- The controlled dialog preserves the authenticated password prompt anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { input } from "../base/fields.ts";

export interface PasswordPromptModalProps<Message> {
  readonly email: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly isPasswordVisible: boolean;
  readonly onCancel: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onEmailInput: (value: string) => NoInfer<Message>;
  readonly onPasswordInput: (value: string) => NoInfer<Message>;
  readonly onPasswordVisibilityToggle: NoInfer<Message>;
  readonly onVerify: NoInfer<Message>;
  readonly password: string;
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

const shieldIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M11.302 21.615c.221.129.332.194.488.227.122.026.298.026.42 0 .156-.034.267-.098.488-.227C14.646 20.478 20 16.908 20 12V7.217c0-.799 0-1.199-.13-1.542a2 2 0 0 0-.548-.79c-.275-.243-.65-.383-1.398-.664l-5.362-2.01c-.208-.078-.312-.117-.419-.133a1 1 0 0 0-.286 0c-.107.016-.21.055-.419.133L6.076 4.22c-.748.28-1.122.421-1.398.664a2 2 0 0 0-.547.79C4 6.018 4 6.418 4 7.217V12c0 4.908 5.354 8.478 7.302 9.615Z",
    "size-5",
    h,
  );

const mailIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "m2 7 8.165 5.715c.661.463.992.695 1.351.784a2 2 0 0 0 .968 0c.36-.09.69-.32 1.351-.784L22 7M6.8 20h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 17.72 22 16.88 22 15.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 4 18.88 4 17.2 4H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 6.28 2 7.12 2 8.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 20 5.12 20 6.8 20Z",
    "size-5 shrink-0 text-fg-quaternary",
    h,
  );

const lockIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M17 11V8A5 5 0 0 0 7 8v3m1.8 10h6.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C20 18.72 20 17.88 20 16.2v-.4c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C17.72 11 16.88 11 15.2 11H8.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C4 13.28 4 14.12 4 15.8v.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C6.28 21 7.12 21 8.8 21Z",
    "size-5 shrink-0 text-fg-quaternary",
    h,
  );

export const passwordPromptModal = <Message>(
  props: PasswordPromptModalProps<Message>,
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
            ],
            [
              h.div([h.AriaHidden(true), h.Class("absolute inset-0"), h.OnClick(props.onDismiss)]),
              h.dialog(
                [
                  h.AriaDescribedBy(descriptionId),
                  h.AriaLabelledBy(titleId),
                  h.Class(
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-max max-w-[calc(100%-32px)] overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:max-w-100 sm:rounded-2xl",
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
                  h.div(
                    [
                      h.Class(
                        "flex flex-col items-center justify-center gap-4 px-4 pt-5 sm:px-6 sm:pt-6",
                      ),
                    ],
                    [
                      h.div(
                        [
                          h.Class(
                            "flex size-10 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
                          ),
                        ],
                        [shieldIcon(h)],
                      ),
                      h.div(
                        [h.Class("z-10 flex flex-col items-center justify-center gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            ["Please enter your password"],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            ["Enter your password to make this change."],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.form(
                    [
                      h.Class("z-10 flex flex-col gap-4 px-4 sm:px-6"),
                      h.Id(formId),
                      h.OnSubmit(props.onVerify),
                    ],
                    [
                      input(
                        {
                          autocomplete: "email",
                          hideRequiredIndicator: true,
                          isRequired: true,
                          label: "Email or username",
                          leadingIconElement: mailIcon(h),
                          name: "email",
                          onInput: props.onEmailInput,
                          placeholder: "Email or username",
                          size: "lg",
                          type: "email",
                          value: props.email,
                        },
                        h,
                      ),
                      input(
                        {
                          autocomplete: "current-password",
                          hideRequiredIndicator: true,
                          isPasswordVisible: props.isPasswordVisible,
                          isRequired: true,
                          label: "Password",
                          leadingIconElement: lockIcon(h),
                          name: "password",
                          onInput: props.onPasswordInput,
                          onTogglePassword: props.onPasswordVisibilityToggle,
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
                        {
                          color: "primary",
                          form: formId,
                          label: "Verify",
                          size: "md",
                          type: "submit",
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
