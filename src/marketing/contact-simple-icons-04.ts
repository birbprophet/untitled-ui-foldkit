/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI contact section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContactSimpleIcons04Location {
  readonly address: string;
  readonly name: string;
}

export interface ContactSimpleIcons04Props {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly locations: readonly ContactSimpleIcons04Location[];
}

export const contactSimpleIcons04Locations = [
  { address: "100 Flinders Street\nMelbourne VIC 3000 AU", name: "Melbourne" },
  { address: "100 George Street\nSydney NSW 2000 AU", name: "Sydney" },
  { address: "100 Jonson Street\nByron Bay NSW 2481 AU", name: "Byron Bay" },
  { address: "100 Oxford Street\nLondon W1D 1LL UK", name: "London" },
  { address: "100 Market Street\nSan Francisco, CA 94105 USA", name: "San Francisco" },
  { address: "Drottninggatan 100\n111 60 Stockholm SE", name: "Sweden" },
] as const satisfies readonly ContactSimpleIcons04Location[];

export const contactSimpleIcons04 = <Message>(
  props: ContactSimpleIcons04Props,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("flex flex-col gap-12 lg:flex-row lg:gap-16")],
            [
              h.div(
                [h.Class("w-full max-w-90")],
                [
                  h.div(
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
                [
                  h.Class(
                    "grid w-full grid-cols-1 gap-x-16 gap-y-6 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-3 md:gap-y-8 lg:grid-cols-2 lg:px-11",
                  ),
                ],
                props.locations.map((location) =>
                  h.keyed("li")(
                    location.name,
                    [h.Class("flex max-w-sm flex-col")],
                    [
                      h.h3([h.Class("text-lg font-semibold text-text-primary")], [location.name]),
                      h.p(
                        [h.Class("mt-1 text-md whitespace-pre text-text-tertiary")],
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
