/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- This section directly transcribes the authenticated Untitled UI brand contact layout. */
import type { Html, HtmlBuilder } from "foldkit/html";

export type ContactSimpleIcons03BrandIcon = "email" | "location" | "phone";

export interface ContactSimpleIcons03BrandItem {
  readonly cta: string;
  readonly href: string;
  readonly icon: ContactSimpleIcons03BrandIcon;
  readonly id: string;
  readonly subtitle: string;
  readonly title: string;
}

export interface ContactSimpleIcons03BrandProps<Message> {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly items: readonly ContactSimpleIcons03BrandItem[];
  readonly onActivate: (id: string) => NoInfer<Message>;
}

export const contactSimpleIcons03BrandItems = [
  {
    cta: "hi@siglata.com",
    href: "mailto:hi@siglata.com",
    icon: "email",
    id: "email",
    subtitle: "Our friendly team is here to help.",
    title: "Email",
  },
  {
    cta: "100 Smith Street\nCollingwood VIC 3066 AU",
    href: "https://goo.gl/maps/zTXmPKVdUvCQH9Wd6",
    icon: "location",
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
] as const satisfies readonly ContactSimpleIcons03BrandItem[];

const iconPath: Record<ContactSimpleIcons03BrandIcon, readonly string[]> = {
  email: [
    "m2 7 8.165 5.715c.661.463.992.695 1.351.784a2 2 0 0 0 .968 0c.36-.09.69-.32 1.351-.784L22 7M6.8 20h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 17.72 22 16.88 22 15.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 4 18.88 4 17.2 4H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 6.28 2 7.12 2 8.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 20 5.12 20 6.8 20Z",
  ],
  location: [
    "M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    "M12 22c2-4 8-6.582 8-12a8 8 0 1 0-16 0c0 5.418 6 8 8 12Z",
  ],
  phone: [
    "M8.38 8.853a14.603 14.603 0 0 0 2.847 4.01 14.603 14.603 0 0 0 4.01 2.847c.124.06.187.09.265.112.28.082.625.023.862-.147.067-.048.124-.105.239-.219.35-.35.524-.524.7-.639a2 2 0 0 1 2.18 0c.176.115.35.29.7.64l.195.194c.532.531.797.797.942 1.082a2 2 0 0 1 0 1.806c-.145.285-.41.551-.942 1.082l-.157.158c-.53.53-.795.794-1.155.997-.4.224-1.02.386-1.478.384-.413-.001-.695-.081-1.26-.241a19.038 19.038 0 0 1-8.283-4.874A19.039 19.039 0 0 1 3.17 7.761c-.16-.564-.24-.846-.241-1.26a3.377 3.377 0 0 1 .384-1.477c.202-.36.467-.625.997-1.155l.157-.158c.532-.53.798-.797 1.083-.941a2 2 0 0 1 1.805 0c.286.144.551.41 1.083.942l.195.194c.35.35.524.525.638.7a2 2 0 0 1 0 2.18c-.114.177-.289.352-.638.701a2.037 2.037 0 0 0-.22.238 1.05 1.05 0 0 0-.147.862c.023.08.053.142.113.266Z",
  ],
};

const featuredIcon = <Message>(
  icon: ContactSimpleIcons03BrandIcon,
  desktop: boolean,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        `relative shrink-0 items-center justify-center bg-bg-brand-solid text-white shadow-xs-skeuomorphic before:absolute before:inset-px before:border before:border-utility-brand-200/12 before:mask-b-from-0% ${desktop ? "hidden size-12 rounded-[10px] before:rounded-[9px] md:flex" : "flex size-10 rounded-lg before:rounded-[7px] md:hidden"}`,
      ),
      h.DataAttribute("featured-icon", ""),
    ],
    [
      h.svg(
        [
          h.AriaHidden(true),
          h.Class(`z-1 ${desktop ? "size-6" : "size-5"}`),
          h.DataAttribute("icon", ""),
          h.Fill("none"),
          h.Stroke("currentColor"),
          h.StrokeLinecap("round"),
          h.StrokeLinejoin("round"),
          h.StrokeWidth("2"),
          h.ViewBox("0 0 24 24"),
        ],
        iconPath[icon].map((path) => h.path([h.D(path)])),
      ),
    ],
  );

export const contactSimpleIcons03Brand = <Message>(
  props: ContactSimpleIcons03BrandProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [
      h.Class("w-full bg-brand-800 py-16 in-data-[theme=dark]:bg-neutral-950 md:py-24"),
      h.Dir("ltr"),
    ],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("flex w-full max-w-3xl flex-col")],
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
            [h.Class("mt-12 md:mt-16")],
            [
              h.ul(
                [
                  h.Class(
                    "grid w-full grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:gap-y-16 lg:grid-cols-3",
                  ),
                ],
                props.items.map((item) =>
                  h.keyed("li")(
                    item.id,
                    [h.Class("flex max-w-sm flex-col items-start")],
                    [
                      featuredIcon(item.icon, false, h),
                      featuredIcon(item.icon, true, h),
                      h.h3(
                        [h.Class("mt-4 text-lg font-semibold text-primary_on-brand md:mt-5")],
                        [item.title],
                      ),
                      h.p([h.Class("mt-1 text-md text-tertiary_on-brand")], [item.subtitle]),
                      h.a(
                        [
                          h.Class(
                            "mt-4 inline-flex h-max items-center whitespace-pre rounded text-md font-semibold text-primary_on-brand outline-focus-ring transition duration-100 ease-linear hover:text-text-tertiary-hover focus-visible:outline-2 focus-visible:outline-offset-2 md:mt-5",
                          ),
                          h.Href(item.href),
                          h.OnClick(props.onActivate(item.id)),
                        ],
                        [item.cta],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    ],
  );
