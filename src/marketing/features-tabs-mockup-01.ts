/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Direct FoldKit transcription of the authenticated Untitled UI features section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface FeaturesTabsMockup01Tab {
  readonly description: string;
  readonly id: string;
  readonly imageAlt: string;
  readonly imageDarkSrc: string;
  readonly imageLightSrc: string;
  readonly title: string;
}

export interface FeaturesTabsMockup01Props<Message> {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly onSelect: (id: string) => NoInfer<Message>;
  readonly selectedId: string;
  readonly tabs: readonly FeaturesTabsMockup01Tab[];
}

export const featuresTabsMockup01 = <Message>(
  props: FeaturesTabsMockup01Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const selected = props.tabs.find((tab) => tab.id === props.selectedId) ?? props.tabs[0];
  return h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
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
            [h.Class("mt-12 flex flex-col gap-8 md:mt-16")],
            [
              h.ul(
                [
                  h.AriaLabel("Feature tabs"),
                  h.Class("flex flex-wrap justify-center gap-2"),
                  h.Role("tablist"),
                ],
                props.tabs.map((tab) => {
                  const active = tab.id === props.selectedId;
                  return h.keyed("li")(
                    tab.id,
                    [],
                    [
                      h.button(
                        [
                          h.AriaSelected(active),
                          h.Class(
                            `${
                              active ? "bg-bg-brand-solid text-fg-white" : "text-text-tertiary"
                            } rounded-lg px-4 py-2 text-sm font-semibold outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2`,
                          ),
                          h.Id(`tab-${tab.id}`),
                          h.OnClick(props.onSelect(tab.id)),
                          h.Role("tab"),
                          h.Tabindex(active ? 0 : -1),
                          h.Type("button"),
                        ],
                        [tab.title],
                      ),
                    ],
                  );
                }),
              ),
              ...(selected === undefined
                ? []
                : [
                    h.div(
                      [
                        h.Attribute("aria-labelledby", `tab-${selected.id}`),
                        h.Class("flex flex-col items-center gap-6"),
                        h.Role("tabpanel"),
                      ],
                      [
                        h.p(
                          [h.Class("max-w-2xl text-center text-md text-text-tertiary")],
                          [selected.description],
                        ),
                        h.img([
                          h.Alt(selected.imageAlt),
                          h.Class("w-full max-w-4xl object-contain dark:hidden"),
                          h.Src(selected.imageLightSrc),
                        ]),
                        h.img([
                          h.Alt(selected.imageAlt),
                          h.Class("w-full max-w-4xl object-contain not-dark:hidden"),
                          h.Src(selected.imageDarkSrc),
                        ]),
                      ],
                    ),
                  ]),
            ],
          ),
        ],
      ),
    ],
  );
};
