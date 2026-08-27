/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-unused-vars -- Direct FoldKit transcription of the authenticated Untitled UI header section. */
/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- Direct FoldKit transcription of the authenticated Untitled UI hero section. */
import type { Html, HtmlBuilder } from "foldkit/html";
import { button } from "../base/button.ts";

export interface HeroColorCard02Props<Message> {
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

export const heroColorCard02 = <Message>(
  props: HeroColorCard02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("relative overflow-hidden bg-brand-section"), h.Dir("ltr")],
    [
      props.navigation,
      h.section(
        [h.Class("relative py-16 md:py-24")],
        [
          h.div(
            [h.Class("mx-auto w-full max-w-container px-4 md:px-8")],
            [
              h.div(
                [h.Class("mx-auto flex max-w-5xl flex-col md:items-center md:text-center")],
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
