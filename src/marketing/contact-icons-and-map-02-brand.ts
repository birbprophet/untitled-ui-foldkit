/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- Direct FoldKit transcription preserves the authenticated branded contact-map anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContactIconsAndMap02BrandLocation {
  readonly id: string;
  readonly subtitle: string;
  readonly title: string;
}

export interface ContactIconsAndMap02BrandProps {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly locations: readonly ContactIconsAndMap02BrandLocation[];
  readonly mapSrc: string;
  readonly mapTitle: string;
}

export const contactIconsAndMap02BrandLocations: readonly ContactIconsAndMap02BrandLocation[] = [
  {
    id: "melbourne",
    subtitle: "100 Flinders Street, Melbourne VIC 3000 AU",
    title: "Melbourne",
  },
  {
    id: "sydney",
    subtitle: "100 George Street, Sydney NSW 2000 AU",
    title: "Sydney",
  },
];

export const contactIconsAndMap02BrandMap = {
  src: "https://snazzymaps.com/embed/451871",
  title: "Our address",
} as const;

const markerPin = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("z-1"),
      h.DataAttribute("icon", ""),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
      h.path([
        h.D("M12 22c2-4 8-6.582 8-12a8 8 0 1 0-16 0c0 5.418 6 8 8 12Z"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const featuredIcon = <Message>(size: "md" | "lg", h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Class(
        `relative shrink-0 items-center justify-center bg-bg-brand-solid text-fg-white shadow-xs-skeuomorphic before:absolute before:inset-px before:border before:border-utility-brand-200/12 before:mask-b-from-0% ${size === "md" ? "flex size-10 rounded-lg before:rounded-[7px] md:hidden *:data-icon:size-5" : "hidden size-12 rounded-[10px] before:rounded-[9px] md:flex *:data-icon:size-6"}`,
      ),
      h.DataAttribute("featured-icon", ""),
    ],
    [markerPin(h)],
  );

export const contactIconsAndMap02Brand = <Message>(
  props: ContactIconsAndMap02BrandProps,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("bg-brand-section pt-16 pb-[112px] md:pt-24 md:pb-40")],
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
                  h.ul(
                    [h.Class("grid grid-cols-1 gap-10 md:gap-8")],
                    props.locations.map((location) =>
                      h.keyed("li")(
                        location.id,
                        [
                          h.Class("flex items-start gap-4"),
                          h.DataAttribute("location-id", location.id),
                        ],
                        [
                          featuredIcon("md", h),
                          featuredIcon("lg", h),
                          h.div(
                            [h.Class("pt-1.5 md:pt-2.5")],
                            [
                              h.h3(
                                [h.Class("text-lg font-semibold text-primary_on-brand")],
                                [location.title],
                              ),
                              h.p(
                                [h.Class("mt-1 text-md text-tertiary_on-brand")],
                                [location.subtitle],
                              ),
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
              h.iframe([
                h.Class("h-60 w-full border-none md:h-129"),
                h.DataAttribute("chromatic", "ignore"),
                h.Src(props.mapSrc),
                h.Title(props.mapTitle),
              ]),
            ],
          ),
        ],
      ),
    ],
  );
