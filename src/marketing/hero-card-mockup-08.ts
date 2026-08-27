/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-unused-vars -- Direct FoldKit transcription of the authenticated Untitled UI header section. */
/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- Direct FoldKit transcription of the authenticated Untitled UI hero section. */
import type { Html, HtmlBuilder } from "foldkit/html";
import { button } from "../base/button.ts";

export interface HeroCardMockup08Props<Message> {
  readonly description: string;
  readonly heading: string;
  readonly imageAlt: string;
  readonly imageUrl: string;
  readonly onPrimary: NoInfer<Message>;
  readonly onSecondary: NoInfer<Message>;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
  readonly navigation: Html;
  readonly email: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly hintPrefix: string;
  readonly onEmailInput: (email: string) => NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly policyHref: string;
  readonly policyLabel: string;
  readonly submitLabel: string;
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

export const heroCardMockup08 = <Message>(
  props: HeroCardMockup08Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("relative overflow-hidden bg-bg-primary"), h.Dir("ltr")],
    [
      h.img([
        h.Alt("Grid of dots"),
        h.AriaHidden(true),
        h.Class(
          "pointer-events-none absolute top-0 left-1/2 z-0 hidden max-w-none -translate-x-1/2 md:block",
        ),
        h.Loading("lazy"),
        h.Src("https://www.untitledui.com/patterns/light/grid-sm-desktop.svg"),
      ]),
      h.img([
        h.Alt("Grid of dots"),
        h.AriaHidden(true),
        h.Class(
          "pointer-events-none absolute top-0 left-1/2 z-0 max-w-none -translate-x-1/2 md:hidden",
        ),
        h.Loading("lazy"),
        h.Src("https://www.untitledui.com/patterns/light/grid-sm-mobile.svg"),
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
                        "text-display-md font-semibold text-text-primary md:text-display-lg lg:text-display-xl",
                      ),
                    ],
                    [props.heading],
                  ),
                  h.p(
                    [
                      h.Class(
                        "mt-4 max-w-3xl text-lg text-balance text-text-tertiary md:mt-6 md:text-xl",
                      ),
                    ],
                    [props.description],
                  ),
                  h.form(
                    [
                      h.Class(
                        "mt-8 flex w-full flex-col items-stretch gap-4 md:mt-12 md:max-w-120 md:flex-row md:items-start",
                      ),
                      h.OnSubmit(props.onSubmit),
                    ],
                    [
                      h.div(
                        [h.Class("flex-1")],
                        [
                          h.div(
                            [h.Class("flex w-full flex-col gap-1.5")],
                            [
                              h.div(
                                [
                                  h.Class(
                                    "relative flex w-full flex-row place-content-center place-items-center rounded-lg bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
                                  ),
                                  h.DataAttribute("input-size", "lg"),
                                ],
                                [
                                  h.input([
                                    h.AriaLabel(props.emailLabel),
                                    h.Class(
                                      "m-0 w-full rounded-lg bg-transparent px-3.5 py-2.5 text-md text-text-primary outline-none placeholder:text-text-placeholder",
                                    ),
                                    h.Name("email"),
                                    h.OnInput(props.onEmailInput),
                                    h.Placeholder(props.emailPlaceholder),
                                    h.Required(true),
                                    h.Type("email"),
                                    h.Value(props.email),
                                  ]),
                                ],
                              ),
                              h.p(
                                [h.Class("text-sm text-text-tertiary")],
                                [
                                  props.hintPrefix,
                                  " ",
                                  h.a(
                                    [
                                      h.Class(
                                        "rounded-xs underline underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                                      ),
                                      h.Href(props.policyHref),
                                    ],
                                    [props.policyLabel],
                                  ),
                                  ".",
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                      button(
                        {
                          label: props.submitLabel,
                          onPress: props.onSubmit,
                          size: "xl",
                          type: "submit",
                        },
                        h,
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("mx-auto mt-16 w-full max-w-container px-4 md:px-8")],
            [
              h.img([
                h.Alt(props.imageAlt),
                h.Class("h-60 w-full object-cover md:h-[360px] lg:h-129"),
                h.Src(props.imageUrl),
              ]),
            ],
          ),
        ],
      ),
    ],
  );
