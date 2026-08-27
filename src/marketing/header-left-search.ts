/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-unused-vars -- Direct FoldKit transcription of the authenticated Untitled UI header section. */
/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI header section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface HeaderLeftSearchProps<Message> {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly onSearch: (value: string) => NoInfer<Message>;
  readonly searchLabel: string;
  readonly searchPlaceholder: string;
  readonly searchValue: string;
}

export const headerLeftSearch = <Message>(
  props: HeaderLeftSearchProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("flex w-full max-w-3xl flex-col")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-text-brand-secondary md:text-md")],
                [props.eyebrow],
              ),
              h.h1(
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
              h.div(
                [h.Class("mt-8 w-full sm:mt-12 sm:w-80")],
                [
                  h.div(
                    [
                      h.Class(
                        "relative flex w-full items-center rounded-lg bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
                      ),
                    ],
                    [
                      h.svg(
                        [
                          h.AriaHidden(true),
                          h.Class(
                            "pointer-events-none absolute left-3.5 size-5 text-fg-quaternary",
                          ),
                          h.Fill("none"),
                          h.ViewBox("0 0 24 24"),
                        ],
                        [
                          h.path([
                            h.D("m21 21-3.5-3.5m2.5-6a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z"),
                            h.Stroke("currentColor"),
                            h.StrokeLinecap("round"),
                            h.StrokeLinejoin("round"),
                            h.StrokeWidth("2"),
                          ]),
                        ],
                      ),
                      h.input([
                        h.AriaLabel(props.searchLabel),
                        h.Class(
                          "m-0 w-full rounded-lg bg-transparent py-2.5 pr-3.5 pl-10 text-md text-text-primary outline-none placeholder:text-text-placeholder",
                        ),
                        h.Name("search"),
                        h.OnInput(props.onSearch),
                        h.Placeholder(props.searchPlaceholder),
                        h.Type("search"),
                        h.Value(props.searchValue),
                      ]),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
