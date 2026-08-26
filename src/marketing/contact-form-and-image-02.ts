/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, mps/prefer-option-over-null -- The direct port keeps upstream placeholders and optional validation copy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { checkbox } from "../base/controls.ts";
import { input, textarea } from "../base/fields.ts";

export interface ContactFormAndImage02Country {
  readonly code: string;
  readonly phoneMask: string;
}

export interface ContactFormAndImage02Service {
  readonly id: string;
  readonly label: string;
}

export interface ContactFormAndImage02Values {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly message: string;
  readonly phone: string;
  readonly privacyAccepted: boolean;
  readonly selectedCountryPhone: string;
  readonly selectedServices: readonly string[];
}

export interface ContactFormAndImage02Errors {
  readonly email?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly message?: string;
}

export interface ContactFormAndImage02Props<Message> {
  readonly contactEmail: string;
  readonly countries: readonly ContactFormAndImage02Country[];
  readonly descriptionPrefix: string;
  readonly desktopSubmitLabel: string;
  readonly errors: ContactFormAndImage02Errors;
  readonly heading: string;
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly mobileSubmitLabel: string;
  readonly onCountryChange: (code: string) => NoInfer<Message>;
  readonly onFieldInput: (
    field: "email" | "firstName" | "lastName" | "message" | "phone",
    value: string,
  ) => NoInfer<Message>;
  readonly onPrivacyToggle: NoInfer<Message>;
  readonly onServiceToggle: (id: string) => NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly privacyHref: string;
  readonly services: readonly ContactFormAndImage02Service[];
  readonly values: ContactFormAndImage02Values;
}

const chevron = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("pointer-events-none size-5 text-fg-quaternary"),
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

const privacyCheckbox = <Message>(
  props: ContactFormAndImage02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("lg:hidden")],
    [
      h.label(
        [h.Class("relative flex cursor-pointer items-start gap-3")],
        [
          h.input([
            h.AriaDescribedBy("contact-privacy-hint"),
            h.Checked(props.values.privacyAccepted),
            h.Class("peer sr-only"),
            h.Name("privacy"),
            h.OnChange(() => props.onPrivacyToggle),
            h.Type("checkbox"),
          ]),
          h.span(
            [
              h.Class(
                `relative mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md ring-1 ring-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring ${props.values.privacyAccepted ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"}`,
              ),
            ],
            props.values.privacyAccepted
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
                        h.D("M11.6666 3.5 5.24992 9.91667 2.33325 7"),
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
              "You agree to our friendly ",
              h.a(
                [
                  h.Class(
                    "rounded-xs underline underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Href(props.privacyHref),
                ],
                ["privacy policy."],
              ),
            ],
          ),
        ],
      ),
    ],
  );

export const contactFormAndImage02 = <Message>(
  props: ContactFormAndImage02Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const selectedCountry = props.countries.find(
    (country) => country.code === props.values.selectedCountryPhone,
  );
  return h.section(
    [h.Class("grid grid-cols-1 bg-bg-primary lg:grid-cols-2"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("relative max-lg:hidden")],
        [
          h.img([
            h.Alt(props.imageAlt),
            h.Class("absolute inset-0 h-full max-w-full object-cover"),
            h.Src(props.imageSrc),
          ]),
        ],
      ),
      h.div(
        [h.Class("w-full px-4 py-16 md:px-8 md:py-24")],
        [
          h.div(
            [h.Class("mx-auto w-full md:max-w-120")],
            [
              h.h2(
                [h.Class("text-display-md font-semibold text-text-primary md:text-display-lg")],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg whitespace-pre-line text-text-tertiary md:mt-6 md:text-xl")],
                [
                  `${props.descriptionPrefix} `,
                  button(
                    {
                      className: "text-lg font-medium md:text-xl",
                      color: "link-color",
                      href: `mailto:${props.contactEmail}`,
                      label: props.contactEmail,
                      size: "xl",
                    },
                    h,
                  ),
                ],
              ),
              h.form(
                [
                  h.Attribute("novalidate", ""),
                  h.Class("mt-12 flex flex-col gap-8"),
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
                                  hint: props.errors.firstName,
                                  isInvalid: props.errors.firstName !== undefined,
                                  isRequired: true,
                                  label: "First name",
                                  name: "firstName",
                                  onInput: (value) => props.onFieldInput("firstName", value),
                                  placeholder: "First name",
                                  size: "lg",
                                  value: props.values.firstName,
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
                                  hint: props.errors.lastName,
                                  isInvalid: props.errors.lastName !== undefined,
                                  isRequired: true,
                                  label: "Last name",
                                  name: "lastName",
                                  onInput: (value) => props.onFieldInput("lastName", value),
                                  placeholder: "Last name",
                                  size: "lg",
                                  value: props.values.lastName,
                                },
                                h,
                              ),
                            ],
                          ),
                        ],
                      ),
                      input(
                        {
                          hint: props.errors.email,
                          isInvalid: props.errors.email !== undefined,
                          isRequired: true,
                          label: "Email",
                          name: "email",
                          onInput: (value) => props.onFieldInput("email", value),
                          placeholder: "you@company.com",
                          size: "lg",
                          type: "email",
                          value: props.values.email,
                        },
                        h,
                      ),
                      h.label(
                        [h.Class("flex flex-col gap-1.5")],
                        [
                          h.span(
                            [h.Class("text-sm font-medium text-text-secondary")],
                            ["Phone number"],
                          ),
                          h.div(
                            [
                              h.Class(
                                "flex w-full items-center rounded-lg bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
                              ),
                            ],
                            [
                              h.span(
                                [h.Class("relative flex items-center pl-3.5")],
                                [
                                  h.select(
                                    [
                                      h.AriaLabel("Country code"),
                                      h.Class(
                                        "appearance-none bg-transparent pr-7 text-md text-text-primary outline-none",
                                      ),
                                      h.Name("countryCode"),
                                      h.OnChange(props.onCountryChange),
                                      h.Value(props.values.selectedCountryPhone),
                                    ],
                                    props.countries.map((country) =>
                                      h.option([h.Value(country.code)], [country.code]),
                                    ),
                                  ),
                                  chevron(h),
                                ],
                              ),
                              h.input([
                                h.Class(
                                  "min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-md text-text-primary outline-none placeholder:text-text-placeholder",
                                ),
                                h.Name("phone"),
                                h.OnInput((value) => props.onFieldInput("phone", value)),
                                h.Placeholder(
                                  selectedCountry?.phoneMask.replaceAll("#", "0") ?? "",
                                ),
                                h.Type("tel"),
                                h.Value(props.values.phone),
                              ]),
                            ],
                          ),
                        ],
                      ),
                      textarea(
                        {
                          hint: props.errors.message,
                          isInvalid: props.errors.message !== undefined,
                          isRequired: true,
                          label: "Message",
                          name: "message",
                          onInput: (value) => props.onFieldInput("message", value),
                          placeholder: "Leave us a message...",
                          rows: 5,
                          value: props.values.message,
                        },
                        h,
                      ),
                      h.fieldset(
                        [h.Class("max-md:hidden")],
                        [
                          h.legend(
                            [h.Class("text-sm font-medium text-text-secondary")],
                            ["Services"],
                          ),
                          h.div(
                            [h.Class("mt-4 grid grid-cols-1 gap-x-16 gap-y-4 md:grid-cols-2")],
                            props.services.map((service) =>
                              checkbox(
                                {
                                  isSelected: props.values.selectedServices.includes(service.id),
                                  label: service.label,
                                  name: service.id,
                                  onToggle: props.onServiceToggle(service.id),
                                  size: "md",
                                },
                                h,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  privacyCheckbox(props, h),
                  h.button(
                    [
                      h.Class(
                        "group relative inline-flex h-max cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-bg-brand-solid px-4.5 py-3 text-md font-semibold text-white shadow-xs-skeuomorphic ring-1 ring-transparent ring-inset outline-focus-ring transition duration-100 ease-linear before:absolute before:inset-px before:rounded-[7px] before:border before:border-white/12 before:mask-b-from-0% hover:bg-bg-brand-solid-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Type("submit"),
                    ],
                    [
                      h.span([h.Class("hidden px-0.5 lg:inline")], [props.desktopSubmitLabel]),
                      h.span([h.Class("px-0.5 lg:hidden")], [props.mobileSubmitLabel]),
                    ],
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
