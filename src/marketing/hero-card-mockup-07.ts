/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-unused-vars -- Direct FoldKit transcription of the authenticated Untitled UI header section. */
/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- Direct FoldKit transcription of the authenticated Untitled UI hero section. */
import type { Html, HtmlBuilder } from "foldkit/html";
import { button } from "../base/button.ts";

export interface HeroCardMockup07Props<Message> {
  readonly description: string;
  readonly heading: string;
  readonly imageAlt: string;
  readonly imageUrl: string;
  readonly onPrimary: NoInfer<Message>;
  readonly onSecondary: NoInfer<Message>;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
  readonly navigation: Html;
}

const playIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D(
          "M2.2 2.863c0-1.251 1.372-2.018 2.438-1.362l8.348 5.136c1.015.625 1.015 2.101 0 2.726l-8.348 5.136C3.572 15.155 2.2 14.388 2.2 13.137V2.863Z",
        ),
        h.Fill("currentColor"),
      ]),
    ],
  );

export const heroCardMockup07 = <Message>(
  props: HeroCardMockup07Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("relative overflow-hidden bg-brand-section"), h.Dir("ltr")],
    [
      h.img([
        h.Alt("Grid of dots"),
        h.AriaHidden(true),
        h.Class(
          "pointer-events-none absolute top-0 left-1/2 z-0 hidden max-w-none -translate-x-1/2 md:block",
        ),
        h.Loading("lazy"),
        h.Src("https://www.untitledui.com/patterns/light/grid-dot-sm-desktop.svg"),
      ]),
      h.img([
        h.Alt("Grid of dots"),
        h.AriaHidden(true),
        h.Class(
          "pointer-events-none absolute top-0 left-1/2 z-0 max-w-none -translate-x-1/2 md:hidden",
        ),
        h.Loading("lazy"),
        h.Src("https://www.untitledui.com/patterns/light/grid-dot-sm-mobile.svg"),
      ]),
      props.navigation,
      h.section(
        [h.Class("relative py-16 md:py-24")],
        [
          h.div(
            [h.Class("mx-auto w-full max-w-container px-4 md:px-8")],
            [
              h.div(
                [h.Class("flex max-w-5xl flex-col")],
                [
                  h.h1(
                    [
                      h.Class(
                        "text-display-md font-semibold text-primary_on-brand md:text-display-lg lg:text-display-xl",
                      ),
                    ],
                    [props.heading],
                  ),
                  h.p(
                    [
                      h.Class(
                        "mt-4 max-w-3xl text-lg text-balance text-tertiary_on-brand md:mt-6 md:text-xl",
                      ),
                    ],
                    [props.description],
                  ),
                  h.div(
                    [
                      h.Class(
                        "mt-8 flex w-full flex-col-reverse items-stretch gap-3 sm:w-auto sm:flex-row sm:items-start md:mt-12",
                      ),
                    ],
                    [
                      button(
                        {
                          color: "secondary",
                          iconLeadingElement: playIcon(h),
                          label: props.secondaryLabel,
                          onPress: props.onSecondary,
                          size: "xl",
                        },
                        h,
                      ),
                      button(
                        { label: props.primaryLabel, onPress: props.onPrimary, size: "xl" },
                        h,
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("mx-auto mt-16 w-full max-w-container md:px-8")],
            [
              h.div(
                [
                  h.Class(
                    "flex h-68 items-center justify-center bg-quaternary md:h-120 md:items-end",
                  ),
                ],
                [
                  h.img([
                    h.Alt(props.imageAlt),
                    h.Class("max-h-full w-auto object-contain"),
                    h.Src(props.imageUrl),
                  ]),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
