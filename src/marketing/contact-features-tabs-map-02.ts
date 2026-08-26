/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- This dedicated renderer directly mirrors the authenticated locations-and-map section. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContactFeaturesTabsMap02Location {
  readonly address: string;
  readonly ctaLabel: string;
  readonly href: string;
  readonly id: string;
  readonly title: string;
}

export interface ContactFeaturesTabsMap02Props<Message> {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly locations: readonly ContactFeaturesTabsMap02Location[];
  readonly mapTitle: string;
  readonly mapUrl: string;
  readonly onLocationSelect: (id: string) => NoInfer<Message>;
  readonly onViewLocation: (id: string) => NoInfer<Message>;
  readonly selectedLocationId: string;
}

const arrowRight = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0"),
      h.DataAttribute("icon", "trailing"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("M5 12h14m0 0-6-6m6 6-6 6"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const keyboardSelection = <Message>(
  props: ContactFeaturesTabsMap02Props<Message>,
  index: number,
  key: string,
): Option.Option<Message> => {
  if (key === "ArrowUp" || key === "ArrowLeft") {
    const previous = props.locations[Math.max(0, index - 1)];
    return previous === undefined
      ? Option.none()
      : Option.some(props.onLocationSelect(previous.id));
  }
  if (key === "ArrowDown" || key === "ArrowRight") {
    const next = props.locations[Math.min(props.locations.length - 1, index + 1)];
    return next === undefined ? Option.none() : Option.some(props.onLocationSelect(next.id));
  }
  return Option.none();
};

export const contactFeaturesTabsMap02 = <Message>(
  props: ContactFeaturesTabsMap02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("flex w-full flex-col lg:w-192")],
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
                "mt-12 grid grid-cols-1 gap-12 md:mt-16 md:gap-16 lg:grid-cols-3 lg:items-center",
              ),
            ],
            [
              h.ul(
                [h.AriaLabel("Store locations"), h.Class("flex flex-col"), h.Role("tablist")],
                props.locations.map((location, index) => {
                  const selected = location.id === props.selectedLocationId;
                  return h.keyed("li")(
                    location.id,
                    [
                      h.Class(
                        `flex max-w-lg flex-col border-l-4 py-4 pl-5 transition duration-150 ease-in-out hover:border-border-brand ${selected ? "border-border-brand" : "border-border-tertiary"}`,
                      ),
                      h.Role("presentation"),
                    ],
                    [
                      h.button(
                        [
                          h.AriaControls("contact-locations-map"),
                          h.AriaSelected(selected),
                          h.Class(
                            "cursor-pointer rounded-xs text-left outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                          ),
                          h.OnClick(props.onLocationSelect(location.id)),
                          h.OnKeyDownPreventDefault((key) => keyboardSelection(props, index, key)),
                          h.Role("tab"),
                          h.Tabindex(selected ? 0 : -1),
                          h.Type("button"),
                        ],
                        [
                          h.h3(
                            [h.Class("text-lg font-semibold text-text-primary")],
                            [location.title],
                          ),
                          h.p(
                            [h.Class("mt-1 text-md whitespace-pre text-text-tertiary")],
                            [location.address],
                          ),
                        ],
                      ),
                      h.a(
                        [
                          h.Class(
                            "group mt-4 inline-flex h-max w-max cursor-pointer items-center gap-1.5 rounded p-0 text-md font-semibold text-text-brand-secondary outline-focus-ring transition duration-100 ease-linear hover:text-text-brand-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                          ),
                          h.Href(location.href),
                          h.OnClick(props.onViewLocation(location.id)),
                        ],
                        [
                          h.span(
                            [
                              h.Class(
                                "px-0.5 underline decoration-transparent underline-offset-4 hover:decoration-fg-brand-secondary-alt",
                              ),
                            ],
                            [location.ctaLabel],
                          ),
                          arrowRight(h),
                        ],
                      ),
                    ],
                  );
                }),
              ),
              h.iframe([
                h.Attribute("data-chromatic", "ignore"),
                h.Class("col-span-2 h-60 w-full border-none lg:h-full"),
                h.Id("contact-locations-map"),
                h.Src(props.mapUrl),
                h.Title(props.mapTitle),
              ]),
            ],
          ),
        ],
      ),
    ],
  );
