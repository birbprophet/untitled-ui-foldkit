/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-unused-vars -- Direct FoldKit transcription of the authenticated Untitled UI header section. */
/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI header section. */
import type { Html, HtmlBuilder } from "foldkit/html";
import { button } from "../base/button.ts";

export interface HeaderSpaceBetweenEmailProps<Message> {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
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

export const headerSpaceBetweenEmail = <Message>(
  props: HeaderSpaceBetweenEmailProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("mb-3 text-sm font-semibold text-text-brand-secondary md:text-md")],
            [props.eyebrow],
          ),
          h.div(
            [h.Class("grid grid-cols-[minmax(auto,768px)] gap-x-16 lg:grid-cols-[1fr_480px]")],
            [
              h.h1(
                [h.Class("text-display-md font-semibold text-text-primary md:text-display-lg")],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-text-tertiary md:mt-6 md:text-xl lg:mt-3 lg:h-0")],
                [props.description],
              ),
              h.form(
                [
                  h.Class("mt-8 flex w-full flex-col gap-4 sm:mt-8 sm:max-w-120 sm:flex-row"),
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
                              h.DataAttribute("input-wrapper", ""),
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
    ],
  );
