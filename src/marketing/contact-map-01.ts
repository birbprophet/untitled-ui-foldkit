/* oxlint-disable effect/noReturnInArrow -- This section directly transcribes the authenticated Untitled UI map layout. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContactMap01Location {
  readonly address: string;
  readonly href: string;
  readonly id: string;
  readonly schedule: string;
  readonly title: string;
}

export interface ContactMap01Props<Message> {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly locations: readonly ContactMap01Location[];
  readonly mapSrc: string;
  readonly mapTitle: string;
  readonly onLocation: (id: string) => NoInfer<Message>;
}

export const contactMap01Locations = [
  {
    address: "150 Brunswick Street\nFitzroy VIC 3065 AU",
    href: "https://goo.gl/maps/zTXmPKVdUvCQH9Wd6",
    id: "retail-store",
    schedule: "Mon-Sat 9am to 5pm.",
    title: "Retail store",
  },
  {
    address: "50 Flinders Street\nMelbourne VIC 3000 AU",
    href: "https://goo.gl/maps/zTXmPKVdUvCQH9Wd6",
    id: "showroom",
    schedule: "Mon-Fri 9am to 5pm.",
    title: "Showroom",
  },
  {
    address: "100 Smith Street\nCollingwood VIC 3066 AU",
    href: "https://goo.gl/maps/zTXmPKVdUvCQH9Wd6",
    id: "head-office",
    schedule: "Mon-Fri 9am to 5pm.",
    title: "Head office",
  },
] as const satisfies readonly ContactMap01Location[];

export const contactMap01MapSrc = "https://snazzymaps.com/embed/451894";

const markerPin02 = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-6 text-fg-brand-primary"),
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

export const contactMap01 = <Message>(
  props: ContactMap01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("w-full bg-bg-primary py-16 md:py-24")],
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
          h.div(
            [h.Class("mt-16 flex flex-col gap-12 md:mt-24 md:gap-16")],
            [
              h.iframe([
                h.Class("h-80 w-full border-none md:h-100"),
                h.DataAttribute("chromatic", "ignore"),
                h.Src(props.mapSrc),
                h.Title(props.mapTitle),
              ]),
              h.ul(
                [
                  h.Class(
                    "grid w-full grid-cols-1 justify-items-center gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3",
                  ),
                ],
                props.locations.map((location) =>
                  h.keyed("li")(
                    location.id,
                    [h.Class("flex max-w-sm flex-col items-center text-center")],
                    [
                      markerPin02(h),
                      h.h3(
                        [h.Class("mt-3 text-lg font-semibold text-text-primary md:mt-4")],
                        [location.title],
                      ),
                      h.p([h.Class("mt-1 text-md text-text-tertiary")], [location.schedule]),
                      h.a(
                        [
                          h.Class(
                            "mt-3 inline-flex h-max items-center whitespace-pre rounded text-md font-semibold text-text-brand-secondary outline-focus-ring transition duration-100 ease-linear hover:text-text-brand-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 md:mt-4",
                          ),
                          h.Href(location.href),
                          h.OnClick(props.onLocation(location.id)),
                        ],
                        [location.address],
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
