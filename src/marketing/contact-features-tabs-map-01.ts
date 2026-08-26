/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- Direct FoldKit transcription of the authenticated Untitled UI contact map. */
import * as Arr from "effect/Array";
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";

export interface ContactFeaturesTabsMap01Location {
  readonly id: string;
  readonly subtitle: string;
  readonly title: string;
}

export interface ContactFeaturesTabsMap01Props<Message> {
  readonly badgeLabel: string;
  readonly description: string;
  readonly heading: string;
  readonly locations: readonly ContactFeaturesTabsMap01Location[];
  readonly mapSrc: string;
  readonly mapTitle: string;
  readonly onSelect: (id: string) => NoInfer<Message>;
  readonly selectedId: string;
}

const locationSelector = (id: string): string => `[data-location-id="${id}"]`;

const moveFocus = <Message>(
  props: ContactFeaturesTabsMap01Props<Message>,
  index: number,
  key: string,
): Option.Option<Readonly<{ focusSelector: string; message: Message }>> => {
  const delta = { ArrowLeft: -1, ArrowRight: 1 }[key] ?? 0;
  if (delta === 0 || Arr.isReadonlyArrayEmpty(props.locations)) {
    return Option.none();
  }
  const nextIndex = (index + delta + props.locations.length) % props.locations.length;
  const next = props.locations[nextIndex];
  return next === undefined
    ? Option.none()
    : Option.some({ focusSelector: locationSelector(next.id), message: props.onSelect(next.id) });
};

export const contactFeaturesTabsMap01 = <Message>(
  props: ContactFeaturesTabsMap01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("mx-auto flex w-full max-w-3xl flex-col items-center text-center")],
            [
              h.div(
                [h.Class("hidden md:flex")],
                [badge({ color: "gray", label: props.badgeLabel, size: "lg" }, h)],
              ),
              h.div(
                [h.Class("md:hidden")],
                [badge({ color: "gray", label: props.badgeLabel, size: "md" }, h)],
              ),
              h.h2(
                [h.Class("mt-4 text-display-sm font-semibold text-primary md:text-display-md")],
                [props.heading],
              ),
              h.p([h.Class("mt-4 text-lg text-tertiary md:mt-5 md:text-xl")], [props.description]),
            ],
          ),
          h.div(
            [h.Class("mt-12 flex flex-col gap-12 md:mt-16 md:gap-20")],
            [
              h.iframe([
                h.Attribute("data-chromatic", "ignore"),
                h.Class("h-60 w-full border-none md:h-120"),
                h.Src(props.mapSrc),
                h.Title(props.mapTitle),
              ]),
              h.ul(
                [
                  h.AriaLabel("Locations"),
                  h.Class("grid grid-cols-1 gap-y-10 md:grid-cols-3"),
                  h.Role("tablist"),
                ],
                props.locations.map((location, index) => {
                  const selected = location.id === props.selectedId;
                  return h.keyed("li")(
                    location.id,
                    [],
                    [
                      h.button(
                        [
                          h.AriaControls("location-map-panel"),
                          h.AriaSelected(selected),
                          h.Class(
                            `flex w-full flex-1 cursor-pointer flex-col items-center border-t-4 pt-5 text-center outline-focus-ring transition duration-100 ease-linear hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 md:px-4 ${selected ? "border-brand" : "border-tertiary"}`,
                          ),
                          h.DataAttribute("location-id", location.id),
                          h.Id(`location-tab-${location.id}`),
                          h.OnClick(props.onSelect(location.id)),
                          h.OnFocus(props.onSelect(location.id)),
                          h.OnKeyDownFocus((key) => moveFocus(props, index, key)),
                          h.Role("tab"),
                          h.Tabindex(selected ? 0 : -1),
                          h.Type("button"),
                        ],
                        [
                          h.h3([h.Class("text-lg font-semibold text-primary")], [location.title]),
                          h.p(
                            [h.Class("mt-1 text-md whitespace-pre text-tertiary")],
                            [location.subtitle],
                          ),
                        ],
                      ),
                    ],
                  );
                }),
              ),
              h.div(
                [
                  h.Attribute("aria-labelledby", `location-tab-${props.selectedId}`),
                  h.Class("sr-only"),
                  h.Id("location-map-panel"),
                  h.Role("tabpanel"),
                ],
                [props.locations.find((location) => location.id === props.selectedId)?.title ?? ""],
              ),
            ],
          ),
        ],
      ),
    ],
  );
