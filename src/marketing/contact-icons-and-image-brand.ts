/* oxlint-disable effect/noReturnInArrow, foldkit/keyed-required-for-mapped-rows -- This section directly transcribes the authenticated Untitled UI brand contact layout. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContactIconsAndImageBrandLocation {
  readonly address: string;
  readonly id: string;
  readonly title: string;
}

export interface ContactIconsAndImageBrandProps {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly imageAlt: string;
  readonly imageUrl: string;
  readonly locations: readonly ContactIconsAndImageBrandLocation[];
}

export const contactIconsAndImageBrandLocations = [
  {
    address: "100 Flinders Street, Melbourne VIC 3000 AU",
    id: "melbourne",
    title: "Melbourne",
  },
  {
    address: "100 George Street, Sydney NSW 2000 AU",
    id: "sydney",
    title: "Sydney",
  },
] as const satisfies readonly ContactIconsAndImageBrandLocation[];

export const contactIconsAndImageBrandImageUrl =
  "https://www.untitledui.com/marketing/interview-2.webp";

const markerPin02 = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-6 pt-0.5 text-white"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([h.D("M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z")]),
      h.path([h.D("M12 22c2-4 8-6.582 8-12a8 8 0 1 0-16 0c0 5.418 6 8 8 12Z")]),
    ],
  );

export const contactIconsAndImageBrand = <Message>(
  props: ContactIconsAndImageBrandProps,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("w-full bg-bg-primary")],
    [
      h.div(
        [h.Class("bg-brand-800 pt-16 pb-[112px] md:pt-24 md:pb-40")],
        [
          h.div(
            [h.Class("mx-auto max-w-container px-4 md:px-8")],
            [
              h.div(
                [h.Class("grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-24")],
                [
                  h.div(
                    [h.Class("flex w-full max-w-3xl flex-col")],
                    [
                      h.span(
                        [h.Class("text-sm font-semibold text-brand-200 md:text-md")],
                        [props.eyebrow],
                      ),
                      h.h2(
                        [
                          h.Class(
                            "mt-3 text-display-sm font-semibold text-white md:text-display-md",
                          ),
                        ],
                        [props.heading],
                      ),
                      h.p(
                        [h.Class("mt-4 text-lg text-brand-200 md:mt-5 md:text-xl")],
                        [props.description],
                      ),
                    ],
                  ),
                  h.ul(
                    [h.Class("grid grid-cols-1 gap-10 md:gap-8")],
                    props.locations.map((location) =>
                      h.li(
                        [h.Class("flex items-start gap-4")],
                        [
                          markerPin02(h),
                          h.div(
                            [],
                            [
                              h.h3([h.Class("text-lg font-semibold text-white")], [location.title]),
                              h.p([h.Class("mt-1 text-md text-brand-200")], [location.address]),
                            ],
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
      ),
      h.div(
        [h.Class("-mt-16 pb-16 md:-mt-24 md:pb-24")],
        [
          h.div(
            [h.Class("mx-auto max-w-container px-4 md:px-8")],
            [
              h.img([
                h.Alt(props.imageAlt),
                h.Class("h-60 w-full object-cover md:h-120 lg:h-140"),
                h.Src(props.imageUrl),
              ]),
            ],
          ),
        ],
      ),
    ],
  );
