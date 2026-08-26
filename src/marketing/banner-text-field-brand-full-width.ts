/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI banner. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface BannerTextFieldBrandFullWidthProps<Message> {
  readonly description: string;
  readonly dismissLabel: string;
  readonly email: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly id: string;
  readonly onDismiss: NoInfer<Message>;
  readonly onEmailInput: (email: string) => NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly subscribeLabel: string;
  readonly title: string;
  readonly titleSuffix: string;
}

const icon = <Message>(path: string, className: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class(className), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D(path),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const mail = <Message>(h: HtmlBuilder<Message>): Html =>
  icon(
    "m2 7 7.835 5.484c.786.55 1.18.826 1.608.932a2.3 2.3 0 0 0 1.114 0c.429-.106.822-.381 1.608-.932L22 7m-15.8 14h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C21 19.48 21 18.92 21 17.8V6.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C19.48 3 18.92 3 17.8 3H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C1 4.52 1 5.08 1 6.2v11.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C4.52 21 5.08 21 6.2 21Z",
    "z-1 size-5",
    h,
  );

export const bannerTextFieldBrandFullWidth = <Message>(
  props: BannerTextFieldBrandFullWidthProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "relative border-t border-brand_alt bg-brand-section_subtle md:border-t-0 md:border-b md:border-brand",
      ),
      h.Dir("ltr"),
    ],
    [
      h.div(
        [
          h.Class(
            "mx-auto flex max-w-container flex-col gap-4 p-4 md:flex-row md:items-center md:gap-3 md:px-8 md:py-3",
          ),
        ],
        [
          h.div(
            [h.Class("flex flex-1 items-center gap-3 md:w-0")],
            [
              h.div(
                [
                  h.Class(
                    "relative hidden size-10 shrink-0 items-center justify-center rounded-lg bg-brand-solid text-white shadow-xs-skeuomorphic before:absolute before:inset-px before:rounded-[7px] before:border before:border-white/12 before:mask-b-from-0% md:flex",
                  ),
                ],
                [mail(h)],
              ),
              h.div(
                [h.Class("flex flex-col gap-0.5 overflow-auto")],
                [
                  h.p(
                    [
                      h.Class(
                        "pr-8 text-sm font-semibold text-primary_on-brand md:truncate md:pr-0",
                      ),
                    ],
                    [`${props.title} `, h.span([h.Class("hidden md:inline")], [props.titleSuffix])],
                  ),
                  h.p([h.Class("text-sm text-tertiary_on-brand md:truncate")], [props.description]),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("flex gap-2")],
            [
              h.form(
                [
                  h.Class("flex flex-1 flex-col gap-3 md:w-90 md:flex-row md:gap-3"),
                  h.Id(`${props.id}-form`),
                  h.OnSubmit(props.onSubmit),
                ],
                [
                  h.div(
                    [h.Class("flex-1")],
                    [
                      h.div(
                        [
                          h.Class(
                            "relative flex w-full flex-row place-content-center place-items-center rounded-lg bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset transition-shadow duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
                          ),
                        ],
                        [
                          h.input([
                            h.AriaLabel(props.emailLabel),
                            h.Class(
                              "m-0 w-full border-white bg-transparent px-3 py-2 text-sm text-text-primary ring-0 outline-hidden placeholder:text-text-placeholder autofill:rounded-lg autofill:text-text-primary",
                            ),
                            h.Id(`${props.id}-email`),
                            h.Name("email"),
                            h.OnInput(props.onEmailInput),
                            h.Placeholder(props.emailPlaceholder),
                            h.Required(true),
                            h.Type("email"),
                            h.Value(props.email),
                          ]),
                        ],
                      ),
                    ],
                  ),
                  h.button(
                    [
                      h.Class(
                        "group relative inline-flex h-max cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-bg-primary px-3 py-2 text-sm font-semibold text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Type("submit"),
                    ],
                    [h.span([h.Class("px-0.5")], [props.subscribeLabel])],
                  ),
                ],
              ),
              h.div(
                [
                  h.Class(
                    "absolute top-2 right-2 flex shrink-0 items-center justify-center md:static",
                  ),
                ],
                [
                  h.button(
                    [
                      h.AriaLabel(props.dismissLabel),
                      h.Class(
                        "flex size-9 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-white/70 outline-focus-ring transition duration-100 ease-linear hover:bg-white/20 hover:text-fg-white focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.OnClick(props.onDismiss),
                      h.Type("button"),
                    ],
                    [icon("M18 6 6 18M6 6l12 12", "size-5 shrink-0", h)],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
