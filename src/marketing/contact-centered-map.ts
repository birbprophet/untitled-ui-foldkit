/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- Direct FoldKit transcription preserves the two source location-column branches. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContactCenteredMapLocation {
  readonly address: string;
  readonly name: string;
}

export interface ContactCenteredMapProps {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly leftLocations: readonly ContactCenteredMapLocation[];
  readonly mapSrc: string;
  readonly mapTitle: string;
  readonly rightLocations: readonly ContactCenteredMapLocation[];
}

const locationList = <Message>(
  locations: readonly ContactCenteredMapLocation[],
  secondColumn: boolean,
  h: HtmlBuilder<Message>,
): Html =>
  h.ul(
    [h.Class(`${secondColumn ? "mt-6 sm:mt-0" : ""} grid grid-cols-1 gap-y-6 lg:gap-y-12`)],
    locations.map((location) =>
      h.keyed("li")(
        location.name,
        [h.Class("flex max-w-sm flex-col lg:text-center")],
        [
          h.h3([h.Class("text-lg font-semibold text-text-primary")], [location.name]),
          h.p([h.Class("mt-1 text-md whitespace-pre text-text-tertiary")], [location.address]),
        ],
      ),
    ),
  );

export const contactCenteredMap = <Message>(
  props: ContactCenteredMapProps,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("flex w-full max-w-3xl flex-col lg:mx-auto lg:items-center lg:text-center")],
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
          h.div(
            [
              h.Class(
                "mt-12 grid grid-cols-1 items-start md:mt-16 md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1fr_1fr] lg:gap-16",
              ),
            ],
            [
              locationList(props.leftLocations, false, h),
              locationList(props.rightLocations, true, h),
              h.iframe([
                h.Class(
                  "mt-12 h-60 w-full border-none md:col-span-2 lg:col-auto lg:col-start-2 lg:row-start-1 lg:mt-0 lg:h-full lg:w-110 xl:w-140",
                ),
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
