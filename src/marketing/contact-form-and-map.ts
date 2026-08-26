/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Native placeholder copy and closed visual states come from the authenticated Untitled UI contact form and map. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { input, textarea } from "../base/fields.ts";

export interface ContactFormAndMapPhoneOption {
  readonly code: string;
  readonly label: string;
  readonly placeholder: string;
}

export interface ContactFormAndMapProps<Message> {
  readonly countryCodeLabel: string;
  readonly description: string;
  readonly email: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly firstName: string;
  readonly firstNameLabel: string;
  readonly firstNamePlaceholder: string;
  readonly heading: string;
  readonly lastName: string;
  readonly lastNameLabel: string;
  readonly lastNamePlaceholder: string;
  readonly mapSrc: string;
  readonly mapTitle: string;
  readonly message: string;
  readonly messageLabel: string;
  readonly messagePlaceholder: string;
  readonly onCountryCodeChange: (code: string) => NoInfer<Message>;
  readonly onEmailInput: (email: string) => NoInfer<Message>;
  readonly onFirstNameInput: (firstName: string) => NoInfer<Message>;
  readonly onLastNameInput: (lastName: string) => NoInfer<Message>;
  readonly onMessageInput: (message: string) => NoInfer<Message>;
  readonly onPhoneInput: (phone: string) => NoInfer<Message>;
  readonly onPrivacyPolicy: NoInfer<Message>;
  readonly onPrivacyToggle: NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly phone: string;
  readonly phoneLabel: string;
  readonly phoneOptions: readonly ContactFormAndMapPhoneOption[];
  readonly privacyChecked: boolean;
  readonly privacyCopy: string;
  readonly privacyHref: string;
  readonly privacyLabel: string;
  readonly selectedCountryCode: string;
  readonly submitLabel: string;
}

const chevron = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("pointer-events-none absolute right-0 size-4 text-fg-quaternary stroke-[2.625px]"),
      h.Fill("none"),
      h.ViewBox("0 0 16 16"),
    ],
    [
      h.path([
        h.D("m4 6 4 4 4-4"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.33"),
      ]),
    ],
  );

const phoneField = <Message>(
  props: ContactFormAndMapProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const selected = props.phoneOptions.find((option) => option.code === props.selectedCountryCode);
  return h.div(
    [h.Class("flex h-max w-full flex-col items-start justify-start gap-1.5")],
    [
      h.label(
        [h.Class("text-sm font-medium text-text-secondary"), h.For("contact-phone")],
        [props.phoneLabel],
      ),
      h.div(
        [
          h.Class(
            "relative flex h-max w-full flex-row justify-center rounded-lg bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
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
                  h.OnChange(props.onCountryCodeChange),
                  h.Value(props.selectedCountryCode),
                ],
                props.phoneOptions.map((option) =>
                  h.option([h.Value(option.code)], [option.label]),
                ),
              ),
              chevron(h),
            ],
          ),
          h.input([
            h.AriaLabel(props.phoneLabel),
            h.Class(
              "m-0 w-full rounded-r-lg bg-transparent py-2.5 pr-3.5 pl-3 text-md text-text-primary outline-none placeholder:text-text-placeholder",
            ),
            h.Id("contact-phone"),
            h.Name("phone"),
            h.OnInput(props.onPhoneInput),
            h.Placeholder(selected?.placeholder ?? ""),
            h.Type("tel"),
            h.Value(props.phone),
          ]),
        ],
      ),
    ],
  );
};

const privacyControl = <Message>(
  props: ContactFormAndMapProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.label(
    [h.Class("relative flex cursor-pointer items-start gap-3")],
    [
      h.input([
        h.AriaDescribedBy("contact-privacy-hint"),
        h.Attribute("aria-labelledby", "contact-privacy-hint"),
        h.Checked(props.privacyChecked),
        h.Class("peer sr-only"),
        h.Name("privacy"),
        h.OnChange(() => props.onPrivacyToggle),
        h.Type("checkbox"),
      ]),
      h.span(
        [
          h.Class(
            `relative mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md ring-1 ring-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring ${props.privacyChecked ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"}`,
          ),
        ],
        props.privacyChecked
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
          `${props.privacyCopy} `,
          h.a(
            [
              h.Class(
                "rounded-xs underline underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
              ),
              h.Href(props.privacyHref),
              h.OnClick(props.onPrivacyPolicy),
            ],
            [props.privacyLabel],
          ),
        ],
      ),
    ],
  );

export const contactFormAndMap = <Message>(
  props: ContactFormAndMapProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("grid grid-cols-1 overflow-hidden bg-bg-primary lg:grid-cols-2"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("self-center px-4 py-16 md:px-8 md:py-24")],
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
                [props.description],
              ),
              h.form(
                [h.Class("mt-12 flex flex-col gap-8"), h.OnSubmit(props.onSubmit)],
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
      h.iframe([
        h.Class(
          "-my-px -mr-px hidden h-240 w-full border-none outline-1 -outline-offset-1 outline-border-secondary-alt lg:block",
        ),
        h.DataAttribute("chromatic", "ignore"),
        h.Src(props.mapSrc),
        h.Title(props.mapTitle),
      ]),
    ],
  );
