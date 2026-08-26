/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- Featured-icon sizes are a closed two-variant table. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export type ContactIconsAndMap01Icon = "mail" | "phone" | "pin";

export interface ContactIconsAndMap01Method {
  readonly cta: string;
  readonly href: string;
  readonly icon: ContactIconsAndMap01Icon;
  readonly id: string;
  readonly subtitle: string;
  readonly title: string;
}

export interface ContactIconsAndMap01Props<Message> {
  readonly contactMethods: readonly ContactIconsAndMap01Method[];
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly mapSrc: string;
  readonly mapTitle: string;
  readonly onContact: (id: string) => NoInfer<Message>;
}

const iconPaths: Readonly<Record<ContactIconsAndMap01Icon, readonly string[]>> = {
  mail: [
    "m2 7 7.835 5.484c.786.55 1.18.826 1.608.932a2.3 2.3 0 0 0 1.114 0c.429-.106.822-.381 1.608-.932L22 7",
    "M6.2 21h11.6c2.24 0 3.2-.96 3.2-3.2V6.2C21 3.96 20.04 3 17.8 3H6.2C3.96 3 3 3.96 3 6.2v11.6C3 20.04 3.96 21 6.2 21Z",
  ],
  phone: [
    "M8.38 8.853a14.603 14.603 0 0 0 2.847 4.01 14.603 14.603 0 0 0 4.01 2.847c.124.06.187.09.265.112.28.082.625.023.862-.147.067-.048.124-.105.239-.219.35-.35.524-.524.7-.639a2 2 0 0 1 2.18 0c.176.115.35.29.7.64l.195.194c.532.531.797.797.942 1.082a2 2 0 0 1 0 1.806c-.145.285-.41.551-.942 1.082l-.157.158c-.53.53-.795.794-1.155.997-.4.224-1.02.386-1.478.384-.413-.001-.695-.081-1.26-.241a19.038 19.038 0 0 1-8.283-4.874A19.039 19.039 0 0 1 3.17 7.761c-.16-.564-.24-.846-.241-1.26a3.377 3.377 0 0 1 .384-1.477c.202-.36.467-.625.997-1.155l.157-.158c.532-.53.798-.797 1.083-.941a2 2 0 0 1 1.805 0c.286.144.551.41 1.083.942l.195.194c.35.35.524.525.638.7a2 2 0 0 1 0 2.18c-.114.177-.289.352-.638.701a2.037 2.037 0 0 0-.22.238 1.05 1.05 0 0 0-.147.862c.023.08.053.142.113.266Z",
  ],
  pin: [
    "M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    "M12 22c2-4 8-6.582 8-12a8 8 0 1 0-16 0c0 5.418 6 8 8 12Z",
  ],
};

const featuredIcon = <Message>(
  kind: ContactIconsAndMap01Icon,
  size: "md" | "lg",
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        `relative shrink-0 items-center justify-center rounded-full bg-brand-secondary text-featured-icon-light-fg-brand ${size === "lg" ? "hidden size-12 md:flex" : "flex size-10 md:hidden"}`,
      ),
      h.DataAttribute("featured-icon", ""),
    ],
    [
      h.svg(
        [
          h.AriaHidden(true),
          h.Class(`z-1 ${size === "lg" ? "size-6" : "size-5"}`),
          h.DataAttribute("icon", ""),
          h.Fill("none"),
          h.Stroke("currentColor"),
          h.StrokeLinecap("round"),
          h.StrokeLinejoin("round"),
          h.StrokeWidth("2"),
          h.ViewBox("0 0 24 24"),
        ],
        iconPaths[kind].map((path) => h.path([h.D(path)])),
      ),
    ],
  );

export const contactIconsAndMap01 = <Message>(
  props: ContactIconsAndMap01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("flex w-full max-w-3xl flex-col")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-brand-secondary md:text-md")],
                [props.eyebrow],
              ),
              h.h2(
                [h.Class("mt-3 text-display-sm font-semibold text-primary md:text-display-md")],
                [props.heading],
              ),
              h.p([h.Class("mt-4 text-lg text-tertiary md:mt-5 md:text-xl")], [props.description]),
            ],
          ),
          h.div(
            [
              h.Class(
                "mt-12 grid grid-cols-1 items-start gap-12 md:mt-16 md:gap-16 lg:grid-cols-3",
              ),
            ],
            [
              h.ul(
                [
                  h.Class(
                    "col-span-1 grid w-full grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-1 lg:gap-y-12",
                  ),
                ],
                props.contactMethods.map((method) =>
                  h.keyed("li")(
                    method.id,
                    [h.Class("flex max-w-sm flex-col items-start gap-4 lg:flex-row")],
                    [
                      featuredIcon(method.icon, "lg", h),
                      featuredIcon(method.icon, "md", h),
                      h.div(
                        [h.Class("lg:pt-2.5")],
                        [
                          h.h3([h.Class("text-lg font-semibold text-primary")], [method.title]),
                          h.p([h.Class("mt-1 text-md text-tertiary")], [method.subtitle]),
                          h.div(
                            [h.Class("mt-4 whitespace-pre lg:mt-5")],
                            [
                              button(
                                {
                                  color: "link-color",
                                  href: method.href,
                                  label: method.cta,
                                  onPress: props.onContact(method.id),
                                  size: "lg",
                                },
                                h,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              h.iframe([
                h.Attribute("data-chromatic", "ignore"),
                h.Class("col-span-2 h-60 w-full border-none lg:h-full"),
                h.Src(props.mapSrc),
                h.Title(props.mapTitle),
              ]),
            ],
          ),
        ],
      ),
    ],
  );
