/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Authenticated form copy includes literal placeholders and controlled validation branches. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { input, textarea } from "../base/fields.ts";

export interface ContactFormAndImage01Country {
  readonly id: string;
  readonly label: string;
  readonly phoneMask: string;
}

export interface ContactFormAndImage01Errors {
  readonly email?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly message?: string;
  readonly phone?: string;
}

export interface ContactFormAndImage01Props<Message> {
  readonly countries: readonly ContactFormAndImage01Country[];
  readonly countryCodeLabel: string;
  readonly description: string;
  readonly email: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly errors?: ContactFormAndImage01Errors;
  readonly firstName: string;
  readonly firstNameLabel: string;
  readonly firstNamePlaceholder: string;
  readonly heading: string;
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly lastName: string;
  readonly lastNameLabel: string;
  readonly lastNamePlaceholder: string;
  readonly message: string;
  readonly messageLabel: string;
  readonly messagePlaceholder: string;
  readonly onCountryChange: (countryId: string) => NoInfer<Message>;
  readonly onEmailInput: (email: string) => NoInfer<Message>;
  readonly onFirstNameInput: (firstName: string) => NoInfer<Message>;
  readonly onLastNameInput: (lastName: string) => NoInfer<Message>;
  readonly onMessageInput: (message: string) => NoInfer<Message>;
  readonly onPhoneInput: (phone: string) => NoInfer<Message>;
  readonly onPrivacyToggle: NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly phone: string;
  readonly phoneLabel: string;
  readonly privacyAccepted: boolean;
  readonly privacyHref: string;
  readonly privacyLabel: string;
  readonly privacyPrefix: string;
  readonly selectedCountryId: string;
  readonly submitLabel: string;
}

export const contactFormAndImage01Countries: readonly ContactFormAndImage01Country[] = [
  { id: "US", label: "US", phoneMask: "+1 (###) ###-####" },
  { id: "BR", label: "BR", phoneMask: "+55 (##) 9####-####" },
  { id: "AU", label: "AU", phoneMask: "+61-#-####-####" },
  { id: "GB", label: "GB", phoneMask: "+44-##-####-####" },
  { id: "CA", label: "CA", phoneMask: "+1 (###) ###-####" },
];

const chevron = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("pointer-events-none absolute right-0 size-4 text-fg-quaternary stroke-[2.625px]"),
      h.Fill("none"),
      h.ViewBox("0 0 20 20"),
    ],
    [
      h.path([
        h.D("m5.5 7.5 4.5 4.5 4.5-4.5"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const phoneField = <Message>(
  props: ContactFormAndImage01Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const selected = props.countries.find((country) => country.id === props.selectedCountryId);
  const error = props.errors?.phone;
  return h.div(
    [h.Class("flex w-full flex-col gap-1.5")],
    [
      h.label(
        [h.Class("text-sm font-medium text-text-secondary"), h.For("contact-phone")],
        [props.phoneLabel],
      ),
      h.div(
        [
          h.Class(
            `relative flex h-max w-full flex-row items-center rounded-lg bg-bg-primary shadow-xs ring-1 ring-inset transition-all duration-100 ease-linear focus-within:ring-2 ${error === undefined ? "ring-border-primary focus-within:ring-border-brand" : "ring-border-error-subtle focus-within:ring-border-error-subtle"}`,
          ),
        ],
        [
          h.div(
            [h.Class("relative grid h-full w-max shrink-0 items-center")],
            [
              h.select(
                [
                  h.AriaLabel(props.countryCodeLabel),
                  h.Class(
                    "h-full appearance-none rounded-l-lg bg-inherit py-2.5 pr-6 pl-3.5 text-md text-text-tertiary outline-none",
                  ),
                  h.OnChange(props.onCountryChange),
                  h.Value(props.selectedCountryId),
                ],
                props.countries.map((country) => h.option([h.Value(country.id)], [country.label])),
              ),
              chevron(h),
            ],
          ),
          h.input([
            h.AriaInvalid(error !== undefined),
            ...(error === undefined ? [] : [h.AriaDescribedBy("contact-phone-error")]),
            h.Class(
              "min-w-0 flex-1 rounded-r-lg bg-transparent px-3 py-2.5 text-md text-text-primary outline-none placeholder:text-text-placeholder",
            ),
            h.Id("contact-phone"),
            h.Name("phone"),
            h.OnInput(props.onPhoneInput),
            h.Placeholder(selected?.phoneMask.replaceAll("#", "0") ?? ""),
            h.Type("tel"),
            h.Value(props.phone),
          ]),
        ],
      ),
      ...(error === undefined
        ? []
        : [
            h.span(
              [
                h.Class("text-sm text-text-error-primary"),
                h.Id("contact-phone-error"),
                h.Role("alert"),
              ],
              [error],
            ),
          ]),
    ],
  );
};

const privacyCheckbox = <Message>(
  props: ContactFormAndImage01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.label(
    [h.Class("relative flex cursor-pointer items-start gap-3")],
    [
      h.input([
        h.AriaDescribedBy("contact-privacy-hint"),
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
        [h.Class("text-md text-text-tertiary"), h.Id("contact-privacy-hint")],
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
  );

export const contactFormAndImage01 = <Message>(
  props: ContactFormAndImage01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:pt-16 md:pb-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("grid gap-16 lg:grid-cols-2")],
            [
              h.div(
                [h.Class("flex w-full flex-col gap-12 md:w-120 md:justify-self-center lg:py-11")],
                [
                  h.div(
                    [h.Class("flex flex-col")],
                    [
                      h.h2(
                        [h.Class("text-display-md font-semibold text-text-primary")],
                        [props.heading],
                      ),
                      h.p(
                        [h.Class("mt-4 text-lg text-text-tertiary md:mt-5 md:text-xl")],
                        [props.description],
                      ),
                    ],
                  ),
                  h.form(
                    [
                      h.Attribute("novalidate", ""),
                      h.Class("flex flex-col gap-8"),
                      h.OnSubmit(props.onSubmit),
                    ],
                    [
                      h.div(
                        [h.Class("flex flex-col gap-6")],
                        [
                          h.div(
                            [h.Class("flex flex-col gap-x-8 gap-y-6 md:flex-row")],
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
                          phoneField(props, h),
                          textarea(
                            {
                              hint: props.errors?.message,
                              isInvalid: props.errors?.message !== undefined,
                              isRequired: true,
                              label: props.messageLabel,
                              name: "message",
                              onInput: props.onMessageInput,
                              placeholder: props.messagePlaceholder,
                              rows: 4,
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
              h.div(
                [h.Class("max-lg:hidden lg:h-200")],
                [
                  h.img([
                    h.Alt(props.imageAlt),
                    h.Class("size-full object-cover"),
                    h.Src(props.imageSrc),
                  ]),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
