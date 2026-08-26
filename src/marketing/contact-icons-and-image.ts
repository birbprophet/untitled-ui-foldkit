/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription preserves the authenticated contact anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContactIconsAndImageLocation {
  readonly id: string;
  readonly subtitle: string;
  readonly title: string;
}

export interface ContactIconsAndImageProps {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly locations: readonly ContactIconsAndImageLocation[];
}

export const contactIconsAndImageLocations: readonly ContactIconsAndImageLocation[] = [
  {
    id: "melbourne",
    subtitle: "100 Flinders Street, \nMelbourne VIC 3000 AU",
    title: "Melbourne",
  },
  {
    id: "sydney",
    subtitle: "100 George Street, \nSydney NSW 2000 AU",
    title: "Sydney",
  },
];

export const contactIconsAndImageImage = {
  alt: "Team discussing a topic",
  src: "https://www.untitledui.com/marketing/smiling-girl-3.webp",
} as const;

const markerPin = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-6 pt-0.5 text-icon-fg-brand"),
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

export const contactIconsAndImage = <Message>(
  props: ContactIconsAndImageProps,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("bg-bg-primary"), h.Dir("ltr")],
    [
      h.section(
        [h.Class("bg-bg-secondary pt-16 pb-28 md:pt-24 md:pb-40")],
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
                        [h.Class("text-sm font-semibold text-text-brand-secondary md:text-md")],
                        [props.eyebrow],
                      ),
                      h.h2(
                        [
                          h.Class(
                            "mt-3 text-display-sm font-semibold text-text-primary md:text-display-md",
                          ),
                        ],
                        [props.heading],
                      ),
                      h.p(
                        [h.Class("mt-4 text-lg text-text-tertiary md:mt-5 md:text-xl")],
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
                          markerPin(h),
                          h.div(
                            [],
                            [
                              h.h3(
                                [h.Class("text-lg font-semibold text-text-primary")],
                                [location.title],
                              ),
                              h.p(
                                [
                                  h.Class(
                                    "mt-1 text-md whitespace-pre text-text-tertiary md:whitespace-normal",
                                  ),
                                ],
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
      h.section(
        [h.Class("-mt-16 pb-16 md:-mt-24 md:pb-24")],
        [
          h.div(
            [h.Class("mx-auto max-w-container px-4 md:px-8")],
            [
              h.img([
                h.Alt(props.imageAlt),
                h.Class("h-60 w-full object-cover shadow-3xl md:h-120 lg:h-140"),
                h.Src(props.imageSrc),
              ]),
            ],
          ),
        ],
      ),
    ],
  );
