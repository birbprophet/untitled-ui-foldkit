/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity -- The direct port preserves authenticated placeholders, controlled fields, and native validation. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { input, textarea } from "../base/fields.ts";

export type ContactSimpleForm04ContactIcon = "chat" | "office" | "phone";
export type ContactSimpleForm04Field = "email" | "firstName" | "lastName" | "message" | "phone";
export type ContactSimpleForm04SocialIcon = "dribbble" | "facebook" | "linkedin" | "x" | "youtube";

export interface ContactSimpleForm04Contact {
  readonly cta: string;
  readonly href: string;
  readonly icon: ContactSimpleForm04ContactIcon;
  readonly id: string;
  readonly subtitle: string;
  readonly title: string;
}

export interface ContactSimpleForm04Country {
  readonly id: string;
  readonly label: string;
  readonly phoneMask: string;
}

export interface ContactSimpleForm04Social {
  readonly href: string;
  readonly icon: ContactSimpleForm04SocialIcon;
  readonly id: string;
  readonly title: string;
}

export interface ContactSimpleForm04Values {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly message: string;
  readonly phone: string;
  readonly privacyAccepted: boolean;
  readonly selectedCountryPhone: string;
}

export interface ContactSimpleForm04Props<Message> {
  readonly contacts: readonly ContactSimpleForm04Contact[];
  readonly countries: readonly ContactSimpleForm04Country[];
  readonly countryCodeLabel: string;
  readonly desktopDescription: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly firstNameLabel: string;
  readonly firstNamePlaceholder: string;
  readonly heading: string;
  readonly lastNameLabel: string;
  readonly lastNamePlaceholder: string;
  readonly messageLabel: string;
  readonly messagePlaceholder: string;
  readonly mobileDescription: string;
  readonly onContact: (id: string) => NoInfer<Message>;
  readonly onCountryChange: (id: string) => NoInfer<Message>;
  readonly onFieldInput: (field: ContactSimpleForm04Field, value: string) => NoInfer<Message>;
  readonly onPrivacyPolicy: NoInfer<Message>;
  readonly onPrivacyToggle: NoInfer<Message>;
  readonly onSocial: (id: string) => NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly phoneLabel: string;
  readonly privacyHref: string;
  readonly privacyLabel: string;
  readonly privacyPrefix: string;
  readonly socials: readonly ContactSimpleForm04Social[];
  readonly submitLabel: string;
  readonly values: ContactSimpleForm04Values;
}

export const contactSimpleForm04Contacts = [
  {
    cta: "hi@siglata.com",
    href: "mailto:hi@siglata.com",
    icon: "chat",
    id: "chat",
    subtitle: "Our friendly team is here to help.",
    title: "Chat to us",
  },
  {
    cta: "100 Smith Street\nCollingwood VIC 3066 AU",
    href: "https://goo.gl/maps/zTXmPKVdUvCQH9Wd6",
    icon: "office",
    id: "office",
    subtitle: "Come say hello at our office HQ.",
    title: "Office",
  },
  {
    cta: "+1 (555) 000-0000",
    href: "tel:+1 (555) 000-0000",
    icon: "phone",
    id: "phone",
    subtitle: "Mon-Fri from 8am to 5pm.",
    title: "Phone",
  },
] as const satisfies readonly ContactSimpleForm04Contact[];

export const contactSimpleForm04Countries = [
  { id: "US", label: "US", phoneMask: "+1 (###) ###-####" },
  { id: "BR", label: "BR", phoneMask: "+55 (##) 9####-####" },
  { id: "AU", label: "AU", phoneMask: "+61-#-####-####" },
  { id: "GB", label: "GB", phoneMask: "+44-####-######" },
  { id: "CA", label: "CA", phoneMask: "+1 (###) ###-####" },
] as const satisfies readonly ContactSimpleForm04Country[];

export const contactSimpleForm04Socials = [
  { href: "#", icon: "facebook", id: "facebook", title: "Facebook" },
  { href: "#", icon: "x", id: "x", title: "X" },
  { href: "#", icon: "linkedin", id: "linkedin", title: "LinkedIn" },
  { href: "#", icon: "youtube", id: "youtube", title: "YouTube" },
  { href: "#", icon: "dribbble", id: "dribbble", title: "Dribbble" },
] as const satisfies readonly ContactSimpleForm04Social[];

const contactIconPaths: Record<ContactSimpleForm04ContactIcon, readonly string[]> = {
  chat: [
    "M6.094 11.229A8.01 8.01 0 0 1 6 10c0-4.418 3.605-8 8.053-8 4.447 0 8.052 3.582 8.052 8a7.94 7.94 0 0 1-.52 2.835c-.07.182-.105.274-.12.345a.897.897 0 0 0-.024.194c-.002.073.008.153.028.314l.403 3.27c.043.355.065.532.006.66a.5.5 0 0 1-.257.252c-.13.055-.306.03-.66-.022l-3.184-.467c-.167-.024-.25-.037-.326-.036a.898.898 0 0 0-.2.021 2.989 2.989 0 0 0-.358.122 8.174 8.174 0 0 1-4.07.42M7.632 22C10.597 22 13 19.538 13 16.5S10.597 11 7.632 11c-2.965 0-5.369 2.462-5.369 5.5 0 .61.097 1.198.277 1.747.075.232.113.348.126.427.013.083.015.13.01.213-.005.08-.025.17-.065.351L2 22l2.995-.409c.163-.022.245-.034.316-.033.076 0 .115.005.19.02.07.013.173.05.381.123a5.246 5.246 0 0 0 1.75.299Z",
  ],
  office: [
    "M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    "M12 22c2-4 8-6.582 8-12a8 8 0 1 0-16 0c0 5.418 6 8 8 12Z",
  ],
  phone: [
    "M8.38 8.853a14.603 14.603 0 0 0 2.847 4.01 14.603 14.603 0 0 0 4.01 2.847c.124.06.187.09.265.112.28.082.625.023.862-.147.067-.048.124-.105.239-.219.35-.35.524-.524.7-.639a2 2 0 0 1 2.18 0c.176.115.35.29.7.64l.195.194c.532.531.797.797.942 1.082a2 2 0 0 1 0 1.806c-.145.285-.41.551-.942 1.082l-.157.158c-.53.53-.795.794-1.155.997-.4.224-1.02.386-1.478.384-.413-.001-.695-.081-1.26-.241a19.038 19.038 0 0 1-8.283-4.874A19.039 19.039 0 0 1 3.17 7.761c-.16-.564-.24-.846-.241-1.26a3.377 3.377 0 0 1 .384-1.477c.202-.36.467-.625.997-1.155l.157-.158c.532-.53.798-.797 1.083-.941a2 2 0 0 1 1.805 0c.286.144.551.41 1.083.942l.195.194c.35.35.524.525.638.7a2 2 0 0 1 0 2.18c-.114.177-.289.352-.638.701a2.037 2.037 0 0 0-.22.238 1.05 1.05 0 0 0-.147.862c.023.08.053.142.113.266Z",
  ],
};

const socialIconPaths: Record<ContactSimpleForm04SocialIcon, string> = {
  dribbble:
    "M12 0C5.37527 0 0 5.37527 0 12C0 18.6248 5.37527 24 12 24C18.6117 24 24 18.6248 24 12C24 5.37527 18.6117 0 12 0ZM19.9262 5.53145C21.3579 7.27549 22.217 9.50107 22.243 11.9089C21.9046 11.8438 18.5206 11.154 15.1106 11.5835C15.0325 11.4143 14.9675 11.2321 14.8894 11.0499C14.6811 10.5554 14.4469 10.0477 14.2126 9.56617C17.9869 8.0304 19.705 5.81779 19.9262 5.53145ZM12 1.77007C14.603 1.77007 16.9848 2.74621 18.7939 4.34708C18.6117 4.60738 17.0629 6.67679 13.4186 8.04337C11.7397 4.95878 9.87855 2.43384 9.5922 2.04338C10.3601 1.86117 11.1671 1.77007 12 1.77007ZM7.63995 2.73319C7.91325 3.09761 9.73538 5.63558 11.4404 8.65508C6.65076 9.9306 2.42083 9.90458 1.96529 9.90458C2.62906 6.72885 4.77657 4.08676 7.63995 2.73319ZM1.74404 12.0131C1.74404 11.9089 1.74404 11.8048 1.74404 11.7007C2.18655 11.7136 7.15835 11.7787 12.2733 10.243C12.5727 10.8156 12.846 11.4013 13.1063 11.987C12.9761 12.026 12.8329 12.0651 12.7028 12.1041C7.41865 13.8091 4.60738 18.4685 4.3731 18.859C2.7462 17.0499 1.74404 14.6421 1.74404 12.0131ZM12 22.256C9.6312 22.256 7.44469 21.449 5.71366 20.0954C5.89588 19.718 7.97827 15.7094 13.757 13.692C13.783 13.679 13.7961 13.679 13.8221 13.666C15.2668 17.4013 15.8525 20.5379 16.0087 21.436C14.7722 21.9696 13.4186 22.256 12 22.256ZM17.7137 20.4989C17.6096 19.8742 17.0629 16.8807 15.7223 13.1974C18.9371 12.6898 21.7484 13.5228 22.0998 13.6399C21.6573 16.4902 20.0174 18.9501 17.7137 20.4989Z",
  facebook:
    "M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z",
  linkedin:
    "M22.2234 0H1.77187C0.792187 0 0 0.773438 0 1.72969V22.2656C0 23.2219 0.792187 24 1.77187 24H22.2234C23.2031 24 24 23.2219 24 22.2703V1.72969C24 0.773438 23.2031 0 22.2234 0ZM7.12031 20.4516H3.55781V8.99531H7.12031V20.4516ZM5.33906 7.43438C4.19531 7.43438 3.27188 6.51094 3.27188 5.37187C3.27188 4.23281 4.19531 3.30937 5.33906 3.30937C6.47813 3.30937 7.40156 4.23281 7.40156 5.37187C7.40156 6.50625 6.47813 7.43438 5.33906 7.43438ZM20.4516 20.4516H16.8937V14.8828C16.8937 13.5563 16.8703 11.8453 15.0422 11.8453C13.1906 11.8453 12.9094 13.2938 12.9094 14.7891V20.4516H9.35625V8.99531H12.7687V10.5609H12.8156C13.2891 9.66094 14.4516 8.70938 16.1813 8.70938C19.7859 8.70938 20.4516 11.0813 20.4516 14.1656V20.4516V20.4516Z",
  x: "M15.9455 22L10.396 14.0901L3.44886 22H0.509766L9.09209 12.2311L0.509766 0H8.05571L13.286 7.45502L19.8393 0H22.7784L14.5943 9.31648L23.4914 22H15.9455ZM19.2185 19.77H17.2398L4.71811 2.23H6.6971L11.7121 9.25316L12.5793 10.4719L19.2185 19.77Z",
  youtube:
    "M23.7609 7.20005C23.7609 7.20005 23.5266 5.54536 22.8047 4.8188C21.8906 3.86255 20.8688 3.85786 20.4 3.80161C17.0438 3.55786 12.0047 3.55786 12.0047 3.55786H11.9953C11.9953 3.55786 6.95625 3.55786 3.6 3.80161C3.13125 3.85786 2.10938 3.86255 1.19531 4.8188C0.473438 5.54536 0.24375 7.20005 0.24375 7.20005C0.24375 7.20005 0 9.14536 0 11.086V12.9047C0 14.8454 0.239062 16.7907 0.239062 16.7907C0.239062 16.7907 0.473437 18.4454 1.19062 19.1719C2.10469 20.1282 3.30469 20.0954 3.83906 20.1985C5.76094 20.3813 12 20.4375 12 20.4375C12 20.4375 17.0438 20.4282 20.4 20.1891C20.8688 20.1329 21.8906 20.1282 22.8047 19.1719C23.5266 18.4454 23.7609 16.7907 23.7609 16.7907C23.7609 16.7907 24 14.85 24 12.9047V11.086C24 9.14536 23.7609 7.20005 23.7609 7.20005ZM9.52031 15.1125V8.36724L16.0031 11.7516L9.52031 15.1125Z",
};

const contactIcon = <Message>(
  kind: ContactSimpleForm04ContactIcon,
  h: HtmlBuilder<Message>,
): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("mt-0.5 size-5 shrink-0 text-fg-brand-primary md:size-6"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    contactIconPaths[kind].map((path) => h.path([h.D(path)])),
  );

const socialIcon = <Message>(
  kind: ContactSimpleForm04SocialIcon,
  label: string,
  h: HtmlBuilder<Message>,
): Html =>
  h.svg(
    [
      h.AriaLabel(label),
      h.Class("size-6"),
      h.Fill("none"),
      h.ViewBox(kind === "x" ? "0 0 24 22" : "0 0 24 24"),
    ],
    [
      h.path([
        ...(kind === "dribbble" ? [h.ClipRule("evenodd"), h.FillRule("evenodd")] : []),
        h.D(socialIconPaths[kind]),
        h.Fill("currentColor"),
      ]),
    ],
  );

const chevron = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("pointer-events-none absolute right-0 size-4 text-fg-quaternary"),
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
  props: ContactSimpleForm04Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const country = props.countries.find(
    (candidate) => candidate.id === props.values.selectedCountryPhone,
  );
  return h.div(
    [h.Class("flex h-max w-full flex-col items-start justify-start gap-1.5")],
    [
      h.label(
        [h.Class("text-sm font-medium text-text-secondary"), h.For("contact-simple-form-04-phone")],
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
                  h.OnChange(props.onCountryChange),
                  h.Value(props.values.selectedCountryPhone),
                ],
                props.countries.map((option) => h.option([h.Value(option.id)], [option.label])),
              ),
              chevron(h),
            ],
          ),
          h.input([
            h.AriaLabel(props.phoneLabel),
            h.Class(
              "m-0 w-full rounded-r-lg bg-transparent py-2.5 pr-3.5 pl-3 text-md text-text-primary outline-none placeholder:text-text-placeholder",
            ),
            h.Id("contact-simple-form-04-phone"),
            h.Name("phone"),
            h.OnInput((value) => props.onFieldInput("phone", value)),
            h.Placeholder(country?.phoneMask.replaceAll("#", "0") ?? ""),
            h.Type("tel"),
            h.Value(props.values.phone),
          ]),
        ],
      ),
    ],
  );
};

const privacyControl = <Message>(
  props: ContactSimpleForm04Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.label(
    [h.Class("relative flex cursor-pointer items-start gap-3")],
    [
      h.input([
        h.AriaDescribedBy("contact-simple-form-04-privacy-hint"),
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
        [h.Class("text-md text-text-tertiary"), h.Id("contact-simple-form-04-privacy-hint")],
        [
          `${props.privacyPrefix} `,
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

export const contactSimpleForm04 = <Message>(
  props: ContactSimpleForm04Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("grid min-h-screen grid-cols-1 bg-bg-primary lg:grid-cols-[416px_1fr]"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("max-lg:hidden bg-bg-secondary px-4 py-16 lg:p-12")],
        [
          h.div(
            [h.Class("mx-auto flex max-w-128 flex-col lg:h-full")],
            [
              h.h2(
                [h.Class("text-display-sm font-semibold text-text-primary lg:text-display-xs")],
                [props.heading],
              ),
              h.p([h.Class("mt-4 text-lg text-text-tertiary")], [props.desktopDescription]),
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
                            [h.Class("text-lg font-semibold text-text-primary")],
                            [contact.title],
                          ),
                          h.p([h.Class("mt-1 text-md text-text-tertiary")], [contact.subtitle]),
                          h.a(
                            [
                              h.Class(
                                "group relative mt-4 inline-flex h-max cursor-pointer items-center justify-normal gap-1.5 rounded p-0! text-md font-semibold whitespace-pre text-text-brand-secondary outline-focus-ring transition duration-100 ease-linear before:absolute before:rounded-[7px] hover:text-text-brand-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 *:data-text:underline *:data-text:decoration-transparent *:data-text:underline-offset-4 hover:*:data-text:decoration-fg-brand-secondary-alt md:mt-5",
                              ),
                              h.Href(contact.href),
                              h.OnClick(props.onContact(contact.id)),
                            ],
                            [h.span([h.DataAttribute("text", "")], [contact.cta])],
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
                          h.AriaLabel(social.title),
                          h.Class(
                            "rounded-xs text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                          ),
                          h.Href(social.href),
                          h.OnClick(props.onSocial(social.id)),
                        ],
                        [socialIcon(social.icon, social.title, h)],
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
              h.div(
                [h.Class("mb-12 lg:hidden")],
                [
                  h.h2(
                    [h.Class("text-display-sm font-semibold text-text-primary lg:text-display-xs")],
                    [props.heading],
                  ),
                  h.p([h.Class("mt-4 text-lg text-text-tertiary")], [props.mobileDescription]),
                ],
              ),
              h.form(
                [h.Class("flex flex-col gap-8"), h.OnSubmit(props.onSubmit)],
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
  );
