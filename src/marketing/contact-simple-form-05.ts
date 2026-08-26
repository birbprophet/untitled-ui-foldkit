/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Authenticated form placeholders, responsive branches, and controlled validation stay explicit. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { checkbox } from "../base/controls.ts";
import { input, textarea } from "../base/fields.ts";

export type ContactSimpleForm05Field = "email" | "firstName" | "lastName" | "message" | "phone";
export type ContactSimpleForm05ContactIcon = "chat" | "office" | "phone";
export type ContactSimpleForm05SocialIcon = "dribbble" | "facebook" | "linkedin" | "x" | "youtube";

export interface ContactSimpleForm05Country {
  readonly code: string;
  readonly phoneMask: string;
}

export interface ContactSimpleForm05Contact {
  readonly cta: string;
  readonly href: string;
  readonly icon: ContactSimpleForm05ContactIcon;
  readonly id: string;
  readonly subtitle: string;
  readonly title: string;
}

export interface ContactSimpleForm05Service {
  readonly id: string;
  readonly label: string;
}

export interface ContactSimpleForm05Social {
  readonly href: string;
  readonly icon: ContactSimpleForm05SocialIcon;
  readonly id: string;
  readonly label: string;
}

export interface ContactSimpleForm05Values {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly message: string;
  readonly phone: string;
  readonly privacyAccepted: boolean;
  readonly selectedCountryPhone: string;
  readonly selectedServices: readonly string[];
}

export interface ContactSimpleForm05Errors {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly message: string;
  readonly phone: string;
}

export interface ContactSimpleForm05Props<Message> {
  readonly contactEmail: string;
  readonly contacts: readonly ContactSimpleForm05Contact[];
  readonly countries: readonly ContactSimpleForm05Country[];
  readonly errors: ContactSimpleForm05Errors;
  readonly onContact: (id: string) => NoInfer<Message>;
  readonly onCountryChange: (code: string) => NoInfer<Message>;
  readonly onFieldInput: (field: ContactSimpleForm05Field, value: string) => NoInfer<Message>;
  readonly onPrivacyToggle: NoInfer<Message>;
  readonly onServiceToggle: (id: string) => NoInfer<Message>;
  readonly onSocial: (id: string) => NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly privacyHref: string;
  readonly services: readonly ContactSimpleForm05Service[];
  readonly socials: readonly ContactSimpleForm05Social[];
  readonly submitDesktopLabel: string;
  readonly submitMobileLabel: string;
  readonly values: ContactSimpleForm05Values;
}

const contactPaths = {
  chat: "M6.094 11.229A8.01 8.01 0 0 1 6 10c0-4.418 3.605-8 8.053-8 4.447 0 8.052 3.582 8.052 8a7.94 7.94 0 0 1-.52 2.835c-.07.182-.105.274-.12.345a.897.897 0 0 0-.024.194c-.002.073.008.153.028.314l.403 3.27c.043.355.065.532.006.66a.5.5 0 0 1-.257.252c-.13.055-.306.03-.66-.022l-3.184-.467c-.167-.024-.25-.037-.326-.036a.898.898 0 0 0-.2.021 2.989 2.989 0 0 0-.358.122 8.174 8.174 0 0 1-4.07.42M7.632 22C10.597 22 13 19.538 13 16.5S10.597 11 7.632 11c-2.965 0-5.369 2.462-5.369 5.5 0 .61.097 1.198.277 1.747.075.232.113.348.126.427.013.083.015.13.01.213-.005.08-.025.17-.065.351L2 22l2.995-.409c.163-.022.245-.034.316-.033.076 0 .115.005.19.02.07.013.173.05.381.123a5.246 5.246 0 0 0 1.75.299Z",
  office:
    "M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 22c2-4 8-6.582 8-12a8 8 0 1 0-16 0c0 5.418 6 8 8 12Z",
  phone:
    "M8.38 8.853a14.603 14.603 0 0 0 2.847 4.01 14.603 14.603 0 0 0 4.01 2.847c.124.06.187.09.265.112.28.082.625.023.862-.147.067-.048.124-.105.239-.219.35-.35.524-.524.7-.639a2 2 0 0 1 2.18 0c.176.115.35.29.7.64l.195.194c.532.531.797.797.942 1.082a2 2 0 0 1 0 1.806c-.145.285-.41.551-.942 1.082l-.157.158c-.53.53-.795.794-1.155.997-.4.224-1.02.386-1.478.384-.413-.001-.695-.081-1.26-.241a19.038 19.038 0 0 1-8.283-4.874A19.039 19.039 0 0 1 3.17 7.761c-.16-.564-.24-.846-.241-1.26a3.377 3.377 0 0 1 .384-1.477c.202-.36.467-.625.997-1.155l.157-.158c.532-.53.798-.797 1.083-.941a2 2 0 0 1 1.805 0c.286.144.551.41 1.083.942l.195.194c.35.35.524.525.638.7a2 2 0 0 1 0 2.18c-.114.177-.289.352-.638.701a2.037 2.037 0 0 0-.22.238 1.05 1.05 0 0 0-.147.862c.023.08.053.142.113.266Z",
} as const;

const socialPaths = {
  dribbble:
    "M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12c6.612 0 12-5.375 12-12S18.612 0 12 0Zm7.926 5.531a10.2 10.2 0 0 1 2.317 6.378c-.338-.065-3.722-.755-7.132-.326-.078-.169-.143-.351-.221-.533-.208-.495-.443-1.002-.677-1.484 3.774-1.536 5.492-3.748 5.713-4.035ZM12 1.77c2.603 0 4.985.976 6.794 2.577-.182.26-1.731 2.329-5.375 3.696-1.679-3.084-3.54-5.609-3.827-6 .768-.182 1.575-.273 2.408-.273ZM7.64 2.733c.273.365 2.095 2.903 3.8 5.922-4.789 1.276-9.019 1.25-9.475 1.25.664-3.176 2.812-5.818 5.675-7.172ZM1.744 12.013v-.312c.443.013 5.414.078 10.529-1.458.3.573.573 1.158.833 1.744l-.403.117c-5.284 1.705-8.096 6.365-8.33 6.755-1.627-1.809-2.629-4.217-2.629-6.846ZM12 22.256a10.19 10.19 0 0 1-6.286-2.16c.182-.378 2.264-4.387 8.043-6.404l.065-.026c1.445 3.735 2.03 6.872 2.187 7.77A10.16 10.16 0 0 1 12 22.256Zm5.714-1.757c-.104-.625-.651-3.618-1.992-7.302 3.215-.507 6.026.326 6.378.443-.443 2.85-2.083 5.31-4.386 6.859Z",
  facebook:
    "M24 12C24 5.373 18.627 0 12 0S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.955.925-1.955 1.875V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12Z",
  linkedin:
    "M22.223 0H1.772C.792 0 0 .773 0 1.73v20.536C0 23.222.792 24 1.772 24h20.451C23.203 24 24 23.222 24 22.27V1.73C24 .773 23.203 0 22.223 0ZM7.12 20.452H3.558V8.995H7.12v11.457ZM5.34 7.434a2.067 2.067 0 1 1 0-4.125 2.063 2.063 0 1 1 0 4.125Zm15.112 13.018h-3.558v-5.569c0-1.327-.023-3.038-1.852-3.038-1.851 0-2.133 1.449-2.133 2.944v5.663H9.356V8.995h3.413v1.566h.047c.473-.9 1.636-1.852 3.365-1.852 3.605 0 4.271 2.372 4.271 5.457v6.286Z",
  x: "M15.946 22 10.396 14.09 3.449 22H.51l8.582-9.769L.51 0h7.546l5.23 7.455L19.84 0h2.939l-8.184 9.316L23.49 22h-7.545Zm3.273-2.23H17.24L4.718 2.23h1.979l5.015 7.023.867 1.219 6.64 9.298Z",
  youtube:
    "M23.761 7.2s-.234-1.655-.956-2.381c-.914-.956-1.936-.961-2.405-1.017-3.356-.244-8.395-.244-8.395-.244h-.01s-5.039 0-8.395.244c-.469.056-1.491.06-2.405 1.017C.473 5.545.244 7.2.244 7.2S0 9.145 0 11.086v1.819c0 1.94.239 3.886.239 3.886s.234 1.654.952 2.38c.914.957 2.114.924 2.648 1.027 1.922.183 8.161.24 8.161.24s5.044-.01 8.4-.249c.469-.056 1.491-.06 2.405-1.017.722-.727.956-2.381.956-2.381S24 14.85 24 12.905v-1.819c0-1.94-.239-3.886-.239-3.886ZM9.52 15.113V8.367l6.483 3.385-6.483 3.36Z",
} as const;

const contactIcon = <Message>(
  kind: ContactSimpleForm05ContactIcon,
  h: HtmlBuilder<Message>,
): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("mt-0.5 size-5 text-primary_on-brand md:size-6"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D(contactPaths[kind])])],
  );

const socialIcon = <Message>(kind: ContactSimpleForm05SocialIcon, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-6"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [h.path([h.D(socialPaths[kind]), h.Fill("currentColor")])],
  );

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
  props: ContactSimpleForm05Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const selected = props.countries.find(
    (country) => country.code === props.values.selectedCountryPhone,
  );
  const error = props.errors.phone;
  return h.label(
    [h.Class("flex flex-col gap-1.5")],
    [
      h.span([h.Class("text-sm font-medium text-text-secondary")], ["Phone number"]),
      h.div(
        [
          h.Class(
            `flex w-full items-center rounded-lg bg-bg-primary shadow-xs ring-1 ring-inset transition duration-100 ease-linear focus-within:ring-2 ${error === "" ? "ring-border-primary focus-within:ring-border-brand" : "ring-border-error-subtle focus-within:ring-border-error-subtle"}`,
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
                props.countries.map((country) => h.option([h.Value(country.code)], [country.code])),
              ),
              chevron(h),
            ],
          ),
          h.input([
            h.AriaInvalid(error !== ""),
            ...(error === "" ? [] : [h.AriaDescribedBy("contact-simple-form-05-phone-error")]),
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
      ...(error === ""
        ? []
        : [
            h.span(
              [
                h.Class("text-sm text-text-error-primary"),
                h.Id("contact-simple-form-05-phone-error"),
                h.Role("alert"),
              ],
              [error],
            ),
          ]),
    ],
  );
};

const privacy = <Message>(
  props: ContactSimpleForm05Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.label(
    [h.Class("relative flex cursor-pointer items-start gap-3 lg:hidden")],
    [
      h.input([
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
        [h.Class("text-md text-text-tertiary")],
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
  );

export const contactSimpleForm05 = <Message>(
  props: ContactSimpleForm05Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("grid min-h-screen grid-cols-1 bg-bg-primary lg:grid-cols-[416px_1fr]"), h.Dir("ltr")],
    [
      h.div(
        [
          h.Class(
            "hidden bg-brand-800 px-4 py-16 lg:block lg:p-12 in-data-[theme=dark]:bg-bg-primary",
          ),
        ],
        [
          h.div(
            [h.Class("mx-auto flex max-w-128 flex-col lg:h-full")],
            [
              h.h2(
                [h.Class("text-display-sm font-semibold text-primary_on-brand lg:text-display-xs")],
                ["Get in touch"],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-tertiary_on-brand")],
                ["We'd love to hear from you. Our friendly team is always here to chat."],
              ),
              h.ul(
                [h.Class("mt-8 grid grid-cols-1 gap-8")],
                props.contacts.map((contact) =>
                  h.keyed("li")(
                    contact.id,
                    [h.Class("flex gap-4")],
                    [
                      contactIcon(contact.icon, h),
                      h.div(
                        [h.Class("flex flex-col items-start")],
                        [
                          h.h3(
                            [h.Class("text-lg font-semibold text-primary_on-brand")],
                            [contact.title],
                          ),
                          h.p([h.Class("mt-1 text-md text-tertiary_on-brand")], [contact.subtitle]),
                          h.a(
                            [
                              h.Class(
                                "mt-4 whitespace-pre rounded text-md font-semibold text-primary_on_brand outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 md:mt-5",
                              ),
                              h.Href(contact.href),
                              h.OnClick(props.onContact(contact.id)),
                            ],
                            [contact.cta],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              h.ul(
                [h.Class("mt-12 flex gap-8 lg:mt-auto")],
                props.socials.map((social) =>
                  h.keyed("li")(
                    social.id,
                    [],
                    [
                      h.a(
                        [
                          h.AriaLabel(social.label),
                          h.Class(
                            "rounded-xs text-icon-fg-brand_on-brand outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                          ),
                          h.Href(social.href),
                          h.OnClick(props.onSocial(social.id)),
                        ],
                        [socialIcon(social.icon, h)],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
      h.div(
        [h.Class("flex w-full px-4 py-16 md:items-center md:px-8 lg:py-24")],
        [
          h.div(
            [h.Class("mx-auto w-full md:max-w-120")],
            [
              h.h2(
                [h.Class("text-display-sm font-semibold text-text-primary md:text-display-md")],
                ["Level up your brand"],
              ),
              h.p(
                [h.Class("mt-4 text-lg whitespace-pre-line text-text-tertiary md:mt-5 md:text-xl")],
                [
                  "You can reach us anytime via ",
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
                                  hint:
                                    props.errors.firstName === ""
                                      ? undefined
                                      : props.errors.firstName,
                                  isInvalid: props.errors.firstName !== "",
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
                                  hint:
                                    props.errors.lastName === ""
                                      ? undefined
                                      : props.errors.lastName,
                                  isInvalid: props.errors.lastName !== "",
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
                          hint: props.errors.email === "" ? undefined : props.errors.email,
                          isInvalid: props.errors.email !== "",
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
                      phoneField(props, h),
                      textarea(
                        {
                          hint: props.errors.message === "" ? undefined : props.errors.message,
                          isInvalid: props.errors.message !== "",
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
                      privacy(props, h),
                    ],
                  ),
                  h.button(
                    [
                      h.Class(
                        "group relative inline-flex h-max cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-bg-brand-solid px-4.5 py-3 text-md font-semibold text-white shadow-xs-skeuomorphic ring-1 ring-transparent ring-inset outline-focus-ring transition duration-100 ease-linear before:absolute before:inset-px before:rounded-[7px] before:border before:border-white/12 before:mask-b-from-0% hover:bg-bg-brand-solid-hover focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      ),
                      h.Type("submit"),
                    ],
                    [
                      h.span([h.Class("hidden lg:inline")], [props.submitDesktopLabel]),
                      h.span([h.Class("lg:hidden")], [props.submitMobileLabel]),
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
