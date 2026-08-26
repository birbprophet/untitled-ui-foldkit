/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Authenticated form copy includes literal placeholders and controlled validation branches. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { input, textarea } from "../base/fields.ts";

export type ContactIconsAndFormIcon = "chat" | "mail" | "phone" | "pin";

export interface ContactIconsAndFormMethod {
  readonly cta: string;
  readonly href: string;
  readonly icon: ContactIconsAndFormIcon;
  readonly id: string;
  readonly subtitle: string;
  readonly title: string;
}

export interface ContactIconsAndFormErrors {
  readonly email?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly message?: string;
  readonly privacy?: string;
}

export interface ContactIconsAndFormProps<Message> {
  readonly contactMethods: readonly ContactIconsAndFormMethod[];
  readonly description: string;
  readonly email: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly errors?: ContactIconsAndFormErrors;
  readonly eyebrow: string;
  readonly firstName: string;
  readonly firstNameLabel: string;
  readonly firstNamePlaceholder: string;
  readonly heading: string;
  readonly lastName: string;
  readonly lastNameLabel: string;
  readonly lastNamePlaceholder: string;
  readonly message: string;
  readonly messageLabel: string;
  readonly messagePlaceholder: string;
  readonly onContact: (id: string) => NoInfer<Message>;
  readonly onEmailInput: (email: string) => NoInfer<Message>;
  readonly onFirstNameInput: (firstName: string) => NoInfer<Message>;
  readonly onLastNameInput: (lastName: string) => NoInfer<Message>;
  readonly onMessageInput: (message: string) => NoInfer<Message>;
  readonly onPrivacyToggle: NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly privacyAccepted: boolean;
  readonly privacyHref: string;
  readonly privacyLabel: string;
  readonly privacyPrefix: string;
  readonly submitLabel: string;
}

const iconPaths: Readonly<Record<ContactIconsAndFormIcon, string>> = {
  chat: "M8 10.5h8M8 14h5m9-2c0 4.97-4.477 9-10 9a11 11 0 0 1-4.4-.9L2 22l1.7-4.5A8.6 8.6 0 0 1 2 12c0-4.97 4.477-9 10-9s10 4.03 10 9Z",
  mail: "m2 7 7.835 5.484c.786.55 1.18.826 1.608.932a2.3 2.3 0 0 0 1.114 0c.429-.106.822-.381 1.608-.932L22 7M6.2 21h11.6c2.24 0 3.2-.96 3.2-3.2V6.2C21 3.96 20.04 3 17.8 3H6.2C3.96 3 3 3.96 3 6.2v11.6C3 20.04 3.96 21 6.2 21Z",
  phone:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.78a2 2 0 0 1-.45 2.11L8.09 9.87a16 16 0 0 0 6 6l1.26-1.26a2 2 0 0 1 2.11-.45c.88.33 1.82.56 2.78.69A2 2 0 0 1 22 16.92Z",
  pin: "M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 22c2-4 8-6.582 8-12a8 8 0 1 0-16 0c0 5.418 6 8 8 12Z",
};

const methodIcon = <Message>(kind: ContactIconsAndFormIcon, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-6 text-icon-fg-brand"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(iconPaths[kind]),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const privacyCheckbox = <Message>(
  props: ContactIconsAndFormProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("flex flex-col gap-1.5")],
    [
      h.label(
        [h.Class("relative flex cursor-pointer items-start gap-3")],
        [
          h.input([
            h.AriaDescribedBy("contact-icons-privacy-hint"),
            h.AriaInvalid(props.errors?.privacy !== undefined),
            h.Checked(props.privacyAccepted),
            h.Class("peer sr-only"),
            h.Name("privacy"),
            h.OnChange(() => props.onPrivacyToggle),
            h.Type("checkbox"),
          ]),
          h.span(
            [
              h.Class(
                `relative mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md ring-1 ring-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring ${props.privacyAccepted ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"}`,
              ),
            ],
            props.privacyAccepted
              ? [
                  h.svg(
                    [
                      h.AriaHidden(true),
                      h.Class("size-3.5 text-fg-white"),
                      h.Fill("none"),
                      h.ViewBox("0 0 14 14"),
                    ],
                    [
                      h.path([
                        h.D("M11.667 3.5 5.25 9.917 2.333 7"),
                        h.Stroke("currentColor"),
                        h.StrokeLinecap("round"),
                        h.StrokeLinejoin("round"),
                        h.StrokeWidth("2"),
                      ]),
                    ],
                  ),
                ]
              : [],
          ),
          h.span(
            [h.Class("text-md text-text-tertiary"), h.Id("contact-icons-privacy-hint")],
            [
              `${props.privacyPrefix} `,
              h.a(
                [
                  h.Class(
                    "rounded-xs underline underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Href(props.privacyHref),
                ],
                [props.privacyLabel],
              ),
            ],
          ),
        ],
      ),
      ...(props.errors?.privacy === undefined
        ? []
        : [
            h.span(
              [h.Class("text-sm text-text-error-primary"), h.Role("alert")],
              [props.errors.privacy],
            ),
          ]),
    ],
  );

export const contactIconsAndForm = <Message>(
  props: ContactIconsAndFormProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("flex w-full max-w-xl flex-col sm:mx-auto lg:mx-0 lg:max-w-3xl")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-brand-secondary md:text-md")],
                [props.eyebrow],
              ),
              h.h2(
                [h.Class("mt-3 text-display-sm font-semibold text-primary md:text-display-md")],
                [props.heading],
              ),
              h.p([h.Class("mt-4 text-lg text-tertiary md:mt-5 md:text-xl")], [props.description]),
            ],
          ),
          h.div(
            [
              h.Class(
                "mx-auto mt-12 grid max-w-xl grid-cols-1 items-start gap-12 md:mt-16 md:gap-16 lg:mx-0 lg:max-w-none lg:grid-cols-2",
              ),
            ],
            [
              h.ul(
                [h.Class("grid w-full grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:gap-y-12")],
                props.contactMethods.map((method) =>
                  h.keyed("li")(
                    method.id,
                    [h.Class("flex max-w-sm flex-col items-start")],
                    [
                      methodIcon(method.icon, h),
                      h.h3(
                        [h.Class("mt-3 text-lg font-semibold text-primary md:mt-4 md:text-xl")],
                        [method.title],
                      ),
                      h.p([h.Class("mt-1 text-md text-tertiary md:mt-2")], [method.subtitle]),
                      h.div(
                        [h.Class("mt-3 whitespace-pre md:mt-4")],
                        [
                          button(
                            {
                              color: "link-color",
                              href: method.href,
                              label: method.cta,
                              onPress: props.onContact(method.id),
                              size: "lg",
                            },
                            h,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              h.form(
                [
                  h.Class("flex flex-col gap-8 rounded-2xl sm:bg-secondary sm:px-8 sm:py-10"),
                  h.OnSubmit(props.onSubmit),
                ],
                [
                  h.div(
                    [h.Class("flex flex-col gap-6")],
                    [
                      h.div(
                        [h.Class("flex flex-col gap-x-8 gap-y-6 sm:flex-row")],
                        [
                          h.div(
                            [h.Class("flex-1")],
                            [
                              input(
                                {
                                  hint: props.errors?.firstName,
                                  isInvalid: props.errors?.firstName !== undefined,
                                  isRequired: true,
                                  label: props.firstNameLabel,
                                  name: "firstName",
                                  onInput: props.onFirstNameInput,
                                  placeholder: props.firstNamePlaceholder,
                                  size: "lg",
                                  value: props.firstName,
                                },
                                h,
                              ),
                            ],
                          ),
                          h.div(
                            [h.Class("flex-1")],
                            [
                              input(
                                {
                                  hint: props.errors?.lastName,
                                  isInvalid: props.errors?.lastName !== undefined,
                                  isRequired: true,
                                  label: props.lastNameLabel,
                                  name: "lastName",
                                  onInput: props.onLastNameInput,
                                  placeholder: props.lastNamePlaceholder,
                                  size: "lg",
                                  value: props.lastName,
                                },
                                h,
                              ),
                            ],
                          ),
                        ],
                      ),
                      input(
                        {
                          hint: props.errors?.email,
                          isInvalid: props.errors?.email !== undefined,
                          isRequired: true,
                          label: props.emailLabel,
                          name: "email",
                          onInput: props.onEmailInput,
                          placeholder: props.emailPlaceholder,
                          size: "lg",
                          type: "email",
                          value: props.email,
                        },
                        h,
                      ),
                      textarea(
                        {
                          hint: props.errors?.message,
                          isInvalid: props.errors?.message !== undefined,
                          isRequired: true,
                          label: props.messageLabel,
                          name: "message",
                          onInput: props.onMessageInput,
                          placeholder: props.messagePlaceholder,
                          rows: 5,
                          value: props.message,
                        },
                        h,
                      ),
                      privacyCheckbox(props, h),
                    ],
                  ),
                  button({ label: props.submitLabel, size: "xl", type: "submit" }, h),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
