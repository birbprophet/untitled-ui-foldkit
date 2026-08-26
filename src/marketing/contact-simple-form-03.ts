/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Authenticated form copy includes placeholders and explicit controlled validation. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { checkbox } from "../base/controls.ts";
import { input, textarea } from "../base/fields.ts";

export type ContactSimpleForm03Field = "email" | "firstName" | "lastName" | "message" | "phone";

export interface ContactSimpleForm03Country {
  readonly code: string;
  readonly phoneMask: string;
}

export interface ContactSimpleForm03Service {
  readonly id: string;
  readonly label: string;
}

export interface ContactSimpleForm03Values {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly message: string;
  readonly phone: string;
  readonly selectedCountryPhone: string;
  readonly selectedServices: readonly string[];
}

export interface ContactSimpleForm03Errors {
  readonly email?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly message?: string;
  readonly phone?: string;
}

export interface ContactSimpleForm03Props<Message> {
  readonly contactEmail: string;
  readonly countries: readonly ContactSimpleForm03Country[];
  readonly countryCodeLabel: string;
  readonly descriptionPrefix: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly errors: ContactSimpleForm03Errors;
  readonly firstNameLabel: string;
  readonly firstNamePlaceholder: string;
  readonly heading: string;
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly lastNameLabel: string;
  readonly lastNamePlaceholder: string;
  readonly messageLabel: string;
  readonly messagePlaceholder: string;
  readonly onCountryChange: (code: string) => NoInfer<Message>;
  readonly onFieldInput: (field: ContactSimpleForm03Field, value: string) => NoInfer<Message>;
  readonly onServiceToggle: (id: string) => NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly phoneLabel: string;
  readonly services: readonly ContactSimpleForm03Service[];
  readonly servicesLabel: string;
  readonly submitLabel: string;
  readonly values: ContactSimpleForm03Values;
}

export const contactSimpleForm03Countries: readonly ContactSimpleForm03Country[] = [
  { code: "US", phoneMask: "+1 (###) ###-####" },
  { code: "BR", phoneMask: "+55 (##) 9####-####" },
  { code: "GB", phoneMask: "+44-####-######" },
  { code: "AU", phoneMask: "+61-#-####-####" },
];

export const contactSimpleForm03Services: readonly ContactSimpleForm03Service[] = [
  { id: "design", label: "Website design" },
  { id: "content", label: "Content creation" },
  { id: "ux", label: "UX design" },
  { id: "consulting", label: "Strategy & consulting" },
  { id: "research", label: "User research" },
  { id: "other", label: "Other" },
];

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

const phoneField = <Message>(
  props: ContactSimpleForm03Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const selected = props.countries.find(
    (country) => country.code === props.values.selectedCountryPhone,
  );
  const error = props.errors.phone;
  return h.label(
    [h.Class("flex flex-col gap-1.5")],
    [
      h.span([h.Class("text-sm font-medium text-text-secondary")], [props.phoneLabel]),
      h.div(
        [
          h.Class(
            `flex w-full items-center rounded-lg bg-bg-primary shadow-xs ring-1 ring-inset transition duration-100 ease-linear focus-within:ring-2 ${error === undefined ? "ring-border-primary focus-within:ring-border-brand" : "ring-border-error-subtle focus-within:ring-border-error-subtle"}`,
          ),
        ],
        [
          h.span(
            [h.Class("relative flex items-center pl-3.5")],
            [
              h.select(
                [
                  h.AriaLabel(props.countryCodeLabel),
                  h.Class(
                    "appearance-none bg-transparent pr-7 text-md text-text-primary outline-none",
                  ),
                  h.Name("countryCode"),
                  h.OnChange(props.onCountryChange),
                  h.Value(props.values.selectedCountryPhone),
                ],
                props.countries.map((country) => h.option([h.Value(country.code)], [country.code])),
              ),
              chevron(h),
            ],
          ),
          h.input([
            h.AriaInvalid(error !== undefined),
            ...(error === undefined
              ? []
              : [h.AriaDescribedBy("contact-simple-form-03-phone-error")]),
            h.Class(
              "min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-md text-text-primary outline-none placeholder:text-text-placeholder",
            ),
            h.Name("phone"),
            h.OnInput((value) => props.onFieldInput("phone", value)),
            h.Placeholder(selected?.phoneMask.replaceAll("#", "0") ?? ""),
            h.Type("tel"),
            h.Value(props.values.phone),
          ]),
        ],
      ),
      ...(error === undefined
        ? []
        : [
            h.span(
              [
                h.Class("text-sm text-text-error-primary"),
                h.Id("contact-simple-form-03-phone-error"),
                h.Role("alert"),
              ],
              [error],
            ),
          ]),
    ],
  );
};

export const contactSimpleForm03 = <Message>(
  props: ContactSimpleForm03Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("grid grid-cols-1 bg-bg-primary lg:grid-cols-2"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("w-full px-4 py-16 md:px-8 md:py-24")],
        [
          h.div(
            [h.Class("mx-auto md:max-w-120")],
            [
              h.h2(
                [h.Class("text-display-sm font-semibold text-text-primary md:text-display-md")],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg whitespace-pre-line text-text-tertiary md:mt-5 md:text-xl")],
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
                        [h.Class("flex flex-col gap-x-8 gap-y-6 sm:flex-row")],
                        [
                          h.div(
                            [h.Class("flex-1")],
                            [
                              input(
                                {
                                  hint: props.errors.firstName,
                                  isInvalid: props.errors.firstName !== undefined,
                                  isRequired: true,
                                  label: props.firstNameLabel,
                                  name: "firstName",
                                  onInput: (value) => props.onFieldInput("firstName", value),
                                  placeholder: props.firstNamePlaceholder,
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
                                  label: props.lastNameLabel,
                                  name: "lastName",
                                  onInput: (value) => props.onFieldInput("lastName", value),
                                  placeholder: props.lastNamePlaceholder,
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
                          label: props.emailLabel,
                          name: "email",
                          onInput: (value) => props.onFieldInput("email", value),
                          placeholder: props.emailPlaceholder,
                          size: "lg",
                          type: "email",
                          value: props.values.email,
                        },
                        h,
                      ),
                      phoneField(props, h),
                      textarea(
                        {
                          hint: props.errors.message,
                          isInvalid: props.errors.message !== undefined,
                          isRequired: true,
                          label: props.messageLabel,
                          name: "message",
                          onInput: (value) => props.onFieldInput("message", value),
                          placeholder: props.messagePlaceholder,
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
                            [props.servicesLabel],
                          ),
                          h.div(
                            [h.Class("mt-4 grid grid-cols-1 gap-x-16 gap-y-4 sm:grid-cols-2")],
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
                  button({ label: props.submitLabel, size: "xl", type: "submit" }, h),
                ],
              ),
            ],
          ),
        ],
      ),
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
    ],
  );
