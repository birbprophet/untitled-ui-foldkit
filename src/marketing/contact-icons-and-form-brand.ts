/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Literal form placeholders and controlled validation mirror the authenticated source. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { input, textarea } from "../base/fields.ts";

export type ContactIconsAndFormBrandField =
  | "email"
  | "firstName"
  | "lastName"
  | "message"
  | "privacy";
export type ContactIconsAndFormBrandIcon = "chat" | "email" | "office" | "phone";

export interface ContactIconsAndFormBrandContact {
  readonly cta: string;
  readonly href: string;
  readonly icon: ContactIconsAndFormBrandIcon;
  readonly id: string;
  readonly subtitle: string;
  readonly title: string;
}

export interface ContactIconsAndFormBrandProps<Message> {
  readonly contacts: readonly ContactIconsAndFormBrandContact[];
  readonly description: string;
  readonly email: string;
  readonly eyebrow: string;
  readonly firstName: string;
  readonly heading: string;
  readonly invalidFields: readonly ContactIconsAndFormBrandField[];
  readonly lastName: string;
  readonly message: string;
  readonly onContact: (id: string) => NoInfer<Message>;
  readonly onFieldInput: (
    field: Exclude<ContactIconsAndFormBrandField, "privacy">,
    value: string,
  ) => NoInfer<Message>;
  readonly onPrivacyToggle: NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly privacyAccepted: boolean;
  readonly privacyHref: string;
  readonly privacyLabel: string;
  readonly privacyPrefix: string;
  readonly submitLabel: string;
}

const iconPaths = {
  chat: "M6.094 11.229A8.01 8.01 0 0 1 6 10c0-4.418 3.605-8 8.053-8 4.447 0 8.052 3.582 8 8a7.94 7.94 0 0 1-.52 2.835c-.07.182-.105.274-.12.345a.897.897 0 0 0-.024.194c-.002.073.008.153.028.314l.403 3.27c.043.355.065.532.006.66a.5.5 0 0 1-.257.252c-.13.055-.306.03-.66-.022l-3.184-.467c-.167-.024-.25-.037-.326-.036a.898.898 0 0 0-.2.021 2.989 2.989 0 0 0-.358.122 8.174 8.174 0 0 1-4.07.42M7.632 22C10.597 22 13 19.538 13 16.5S10.597 11 7.632 11c-2.965 0-5.369 2.462-5.369 5.5 0 .61.097 1.198.277 1.747.075.232.113.348.126.427.013.083.015.13.01.213-.005.08-.025.17-.065.351L2 22l2.995-.409c.163-.022.245-.034.316-.033.076 0 .115.005.19.02.07.013.173.05.381.123a5.246 5.246 0 0 0 1.75.299Z",
  email:
    "m2 7 8.165 5.715c.661.463.992.695 1.351.784a2 2 0 0 0 .968 0c.36-.09.69-.32 1.351-.784L22 7M6.8 20h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 17.72 22 16.88 22 15.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 4 18.88 4 17.2 4H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 6.28 2 7.12 2 8.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 20 5.12 20 6.8 20Z",
  office:
    "M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 22c2-4 8-6.582 8-12a8 8 0 1 0-16 0c0 5.418 6 8 8 12Z",
  phone:
    "M8.38 8.853a14.603 14.603 0 0 0 2.847 4.01 14.603 14.603 0 0 0 4.01 2.847c.124.06.187.09.265.112.28.082.625.023.862-.147.067-.048.124-.105.239-.219.35-.35.524-.524.7-.639a2 2 0 0 1 2.18 0c.176.115.35.29.7.64l.195.194c.532.531.797.797.942 1.082a2 2 0 0 1 0 1.806c-.145.285-.41.551-.942 1.082l-.157.158c-.53.53-.795.794-1.155.997-.4.224-1.02.386-1.478.384-.413-.001-.695-.081-1.26-.241a19.038 19.038 0 0 1-8.283-4.874A19.039 19.039 0 0 1 3.17 7.761c-.16-.564-.24-.846-.241-1.26a3.377 3.377 0 0 1 .384-1.477c.202-.36.467-.625.997-1.155l.157-.158c.532-.53.798-.797 1.083-.941a2 2 0 0 1 1.805 0c.286.144.551.41 1.083.942l.195.194c.35.35.524.525.638.7a2 2 0 0 1 0 2.18c-.114.177-.289.352-.638.701a2.037 2.037 0 0 0-.22.238 1.05 1.05 0 0 0-.147.862c.023.08.053.142.113.266Z",
} as const;

const contactIcon = <Message>(kind: ContactIconsAndFormBrandIcon, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-6 text-brand-200"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D(iconPaths[kind])])],
  );

const invalid = (
  props: ContactIconsAndFormBrandProps<unknown>,
  field: ContactIconsAndFormBrandField,
): boolean => props.invalidFields.includes(field);

const privacyCheckbox = <Message>(
  props: ContactIconsAndFormBrandProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const isInvalid = invalid(props, "privacy");
  return h.div(
    [h.Class("flex flex-col gap-1.5")],
    [
      h.label(
        [h.Class("relative flex cursor-pointer items-start gap-3")],
        [
          h.input([
            h.AriaDescribedBy(
              isInvalid ? "contact-brand-privacy-error" : "contact-brand-privacy-hint",
            ),
            h.AriaInvalid(isInvalid),
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
            [h.Class("text-md text-text-tertiary"), h.Id("contact-brand-privacy-hint")],
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
      ...(isInvalid
        ? [
            h.span(
              [
                h.Class("text-sm text-text-error-primary"),
                h.Id("contact-brand-privacy-error"),
                h.Role("alert"),
              ],
              ["Accept the privacy policy to continue."],
            ),
          ]
        : []),
    ],
  );
};

export const contactIconsAndFormBrand = <Message>(
  props: ContactIconsAndFormBrandProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-brand-800 py-16 in-data-[theme=dark]:bg-bg-primary md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container md:px-8")],
        [
          h.div(
            [h.Class("flex w-full max-w-xl flex-col px-4 sm:mx-auto md:px-0 lg:mx-0 lg:max-w-3xl")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-tertiary_on-brand md:text-md")],
                [props.eyebrow],
              ),
              h.h2(
                [
                  h.Class(
                    "mt-3 text-display-sm font-semibold text-primary_on-brand md:text-display-md",
                  ),
                ],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-tertiary_on-brand md:mt-5 md:text-xl")],
                [props.description],
              ),
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
                [
                  h.Class(
                    "grid w-full grid-cols-1 gap-x-8 gap-y-10 px-4 sm:grid-cols-2 md:gap-y-12 md:px-0",
                  ),
                ],
                props.contacts.map((contact) =>
                  h.keyed("li")(
                    contact.id,
                    [h.Class("flex max-w-sm flex-col items-start")],
                    [
                      contactIcon(contact.icon, h),
                      h.h3(
                        [h.Class("mt-3 text-lg font-semibold text-primary_on-brand md:mt-4")],
                        [contact.title],
                      ),
                      h.p([h.Class("mt-1 text-md text-tertiary_on-brand")], [contact.subtitle]),
                      h.a(
                        [
                          h.Class(
                            "mt-3 whitespace-pre rounded text-md font-semibold text-primary_on-brand outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 md:mt-4",
                          ),
                          h.Href(contact.href),
                          h.OnClick(props.onContact(contact.id)),
                        ],
                        [contact.cta],
                      ),
                    ],
                  ),
                ),
              ),
              h.form(
                [
                  h.Class(
                    "flex flex-col gap-8 bg-bg-primary px-4 py-8 md:rounded-2xl md:px-8 md:py-10",
                  ),
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
                                  hint: invalid(props, "firstName")
                                    ? "Enter your first name."
                                    : undefined,
                                  isInvalid: invalid(props, "firstName"),
                                  isRequired: true,
                                  label: "First name",
                                  name: "firstName",
                                  onInput: (value) => props.onFieldInput("firstName", value),
                                  placeholder: "First name",
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
                                  hint: invalid(props, "lastName")
                                    ? "Enter your last name."
                                    : undefined,
                                  isInvalid: invalid(props, "lastName"),
                                  isRequired: true,
                                  label: "Last name",
                                  name: "lastName",
                                  onInput: (value) => props.onFieldInput("lastName", value),
                                  placeholder: "Last name",
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
                          hint: invalid(props, "email")
                            ? "Enter a valid email address."
                            : undefined,
                          isInvalid: invalid(props, "email"),
                          isRequired: true,
                          label: "Email",
                          name: "email",
                          onInput: (value) => props.onFieldInput("email", value),
                          placeholder: "you@company.com",
                          size: "lg",
                          type: "email",
                          value: props.email,
                        },
                        h,
                      ),
                      textarea(
                        {
                          hint: invalid(props, "message") ? "Enter a message." : undefined,
                          isInvalid: invalid(props, "message"),
                          isRequired: true,
                          label: "Message",
                          name: "message",
                          onInput: (value) => props.onFieldInput("message", value),
                          placeholder: "Leave us a message...",
                          rows: 5,
                          value: props.message,
                        },
                        h,
                      ),
                      privacyCheckbox(props, h),
                    ],
                  ),
                  button(
                    { color: "primary", label: props.submitLabel, size: "xl", type: "submit" },
                    h,
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
