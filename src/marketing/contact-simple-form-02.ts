/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Direct FoldKit transcription preserves the authenticated form and validation anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { input, textarea } from "../base/fields.ts";

export interface ContactSimpleForm02Country {
  readonly id: string;
  readonly label: string;
  readonly phoneMask: string;
}

export interface ContactSimpleForm02Values {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly message: string;
  readonly phone: string;
  readonly privacyAccepted: boolean;
  readonly selectedCountryId: string;
}

export interface ContactSimpleForm02Errors {
  readonly email?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly message?: string;
  readonly privacy?: string;
}

export interface ContactSimpleForm02Props<Message> {
  readonly countries: readonly ContactSimpleForm02Country[];
  readonly description: string;
  readonly errors: ContactSimpleForm02Errors;
  readonly heading: string;
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly onCountryChange: (countryId: string) => NoInfer<Message>;
  readonly onFieldInput: (
    field: "email" | "firstName" | "lastName" | "message" | "phone",
    value: string,
  ) => NoInfer<Message>;
  readonly onPrivacy: NoInfer<Message>;
  readonly onPrivacyToggle: NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly privacyHref: string;
  readonly privacyLabel: string;
  readonly privacyPrefix: string;
  readonly submitLabel: string;
  readonly values: ContactSimpleForm02Values;
}

export const contactSimpleForm02Countries: readonly ContactSimpleForm02Country[] = [
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

const privacyControl = <Message>(
  props: ContactSimpleForm02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("flex flex-col gap-1.5")],
    [
      h.label(
        [h.Class("relative flex cursor-pointer items-start gap-3")],
        [
          h.input([
            h.AriaDescribedBy("contact-simple-form-02-privacy-hint"),
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
            [h.Class("text-md text-text-tertiary"), h.Id("contact-simple-form-02-privacy-hint")],
            [
              props.privacyPrefix,
              " ",
              h.a(
                [
                  h.Class(
                    "rounded-xs underline underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Href(props.privacyHref),
                  h.OnClick(props.onPrivacy),
                ],
                [props.privacyLabel],
              ),
            ],
          ),
        ],
      ),
      ...(props.errors.privacy === undefined
        ? []
        : [
            h.span(
              [h.Class("text-sm text-text-error-primary"), h.Role("alert")],
              [props.errors.privacy],
            ),
          ]),
    ],
  );

export const contactSimpleForm02 = <Message>(
  props: ContactSimpleForm02Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const selectedCountry = props.countries.find(
    (country) => country.id === props.values.selectedCountryId,
  );
  return h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("grid grid-cols-1 gap-16 lg:grid-cols-2")],
            [
              h.div(
                [h.Class("max-lg:hidden lg:h-192")],
                [
                  h.img([
                    h.Alt(props.imageAlt),
                    h.Class("size-full object-cover"),
                    h.Src(props.imageSrc),
                  ]),
                ],
              ),
              h.div(
                [h.Class("flex items-center justify-center")],
                [
                  h.div(
                    [h.Class("w-full md:max-w-120")],
                    [
                      h.h2(
                        [
                          h.Class(
                            "text-display-sm font-semibold text-text-primary md:text-display-md",
                          ),
                        ],
                        [props.heading],
                      ),
                      h.p(
                        [h.Class("mt-4 text-lg text-text-tertiary md:mt-5 md:text-xl")],
                        [props.description],
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
                                          label: "First name",
                                          name: "firstName",
                                          onInput: (value) =>
                                            props.onFieldInput("firstName", value),
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
                                              h.Value(props.values.selectedCountryId),
                                            ],
                                            props.countries.map((country) =>
                                              h.option([h.Value(country.id)], [country.label]),
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
                              privacyControl(props, h),
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
          ),
        ],
      ),
    ],
  );
};
