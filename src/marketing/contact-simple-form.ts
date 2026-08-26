/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Authenticated form copy includes literal placeholders and controlled source states. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { input, textarea } from "../base/fields.ts";

export type ContactSimpleFormField = "email" | "firstName" | "lastName" | "message" | "phone";

export interface ContactSimpleFormCountry {
  readonly id: string;
  readonly label: string;
  readonly phoneMask: string;
}

export interface ContactSimpleFormValues {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly message: string;
  readonly phone: string;
  readonly privacyAccepted: boolean;
  readonly selectedCountryId: string;
}

export interface ContactSimpleFormProps<Message> {
  readonly countries: readonly ContactSimpleFormCountry[];
  readonly countryCodeLabel: string;
  readonly description: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly eyebrow: string;
  readonly firstNameLabel: string;
  readonly firstNamePlaceholder: string;
  readonly heading: string;
  readonly lastNameLabel: string;
  readonly lastNamePlaceholder: string;
  readonly messageLabel: string;
  readonly messagePlaceholder: string;
  readonly onCountryChange: (countryId: string) => NoInfer<Message>;
  readonly onFieldInput: (field: ContactSimpleFormField, value: string) => NoInfer<Message>;
  readonly onPrivacy: NoInfer<Message>;
  readonly onPrivacyToggle: NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly phoneLabel: string;
  readonly privacyHref: string;
  readonly privacyLabel: string;
  readonly privacyPrefix: string;
  readonly submitLabel: string;
  readonly values: ContactSimpleFormValues;
}

export const contactSimpleFormCountries: readonly ContactSimpleFormCountry[] = [
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
      h.Class("pointer-events-none absolute right-0 size-4 text-fg-quaternary"),
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
  props: ContactSimpleFormProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const selected = props.countries.find((country) => country.id === props.values.selectedCountryId);
  return h.div(
    [h.Class("flex h-max w-full flex-col items-start justify-start gap-1.5")],
    [
      h.label(
        [h.Class("text-sm font-medium text-text-secondary"), h.For("contact-simple-phone")],
        [props.phoneLabel],
      ),
      h.div(
        [
          h.Class(
            "group relative flex h-max w-full flex-row justify-center rounded-lg bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
          ),
          h.DataAttribute("input-size", "lg"),
          h.DataAttribute("input-wrapper", ""),
        ],
        [
          h.section(
            [h.Class("relative grid shrink-0 items-center"), h.DataAttribute("leading", "true")],
            [
              h.select(
                [
                  h.AriaLabel(props.countryCodeLabel),
                  h.Class(
                    "h-full appearance-none rounded-l-lg bg-inherit py-2.5 pr-4.5 pl-3.5 text-md font-normal text-text-tertiary outline-none",
                  ),
                  h.OnChange(props.onCountryChange),
                  h.Value(props.values.selectedCountryId),
                ],
                props.countries.map((country) => h.option([h.Value(country.id)], [country.label])),
              ),
              chevron(h),
            ],
          ),
          h.input([
            h.AriaLabel(props.phoneLabel),
            h.Class(
              "m-0 w-full rounded-r-lg bg-transparent py-2.5 pr-3.5 pl-3 text-md text-text-primary outline-none placeholder:text-text-placeholder",
            ),
            h.Id("contact-simple-phone"),
            h.Name("phone"),
            h.OnInput((phone) => props.onFieldInput("phone", phone)),
            h.Placeholder(selected?.phoneMask.replaceAll("#", "0") ?? ""),
            h.Type("tel"),
            h.Value(props.values.phone),
          ]),
        ],
      ),
    ],
  );
};

const privacyCheckbox = <Message>(
  props: ContactSimpleFormProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.label(
    [h.Class("relative flex cursor-pointer items-start gap-3")],
    [
      h.input([
        h.AriaDescribedBy("contact-simple-privacy-hint"),
        h.AriaLabelledBy("contact-simple-privacy-hint"),
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
        [h.Class("text-md text-text-tertiary"), h.Id("contact-simple-privacy-hint")],
        [
          `${props.privacyPrefix} `,
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
  );

export const contactSimpleForm = <Message>(
  props: ContactSimpleFormProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("mx-auto flex w-full max-w-3xl flex-col items-center text-center")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-text-brand-secondary md:text-md")],
                [props.eyebrow],
              ),
              h.h2(
                [
                  h.Class(
                    "mt-3 text-display-md font-semibold text-text-primary md:text-display-lg",
                  ),
                ],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-text-tertiary md:mt-6 md:text-xl")],
                [props.description],
              ),
            ],
          ),
          h.form(
            [
              h.Class("mx-auto mt-16 flex flex-col gap-8 md:mt-24 md:max-w-120"),
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
                  privacyCheckbox(props, h),
                ],
              ),
              button({ label: props.submitLabel, size: "xl", type: "submit" }, h),
            ],
          ),
        ],
      ),
    ],
  );
