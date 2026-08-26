/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI text-field banner. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface BannerTextFieldDefaultProps<Message> {
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

export const bannerTextFieldDefault = <Message>(
  props: BannerTextFieldDefaultProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "relative mx-2 mb-4 flex flex-col gap-4 rounded-xl bg-bg-secondary p-4 shadow-lg ring-1 ring-border-secondary-alt md:m-0 md:flex-row md:items-center md:gap-3 md:p-3",
      ),
      h.Dir("ltr"),
    ],
    [
      h.div(
        [h.Class("flex flex-1 items-center gap-3 md:w-0")],
        [
          h.div(
            [
              h.Class(
                "relative hidden size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset md:flex",
              ),
              h.DataAttribute("featured-icon", ""),
            ],
            [
              icon(
                "m2 7 8.165 5.715c.661.463.992.695 1.351.784a2 2 0 0 0 .968 0c.36-.09.69-.32 1.351-.784L22 7M6.8 20h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 17.72 22 16.88 22 15.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 4 18.88 4 17.2 4H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 6.28 2 7.12 2 8.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 20 5.12 20 6.8 20Z",
                "z-1 size-5",
                h,
              ),
            ],
          ),
          h.div(
            [h.Class("flex flex-col gap-0.5 overflow-auto")],
            [
              h.p(
                [h.Class("pr-8 text-sm font-semibold text-text-secondary md:truncate md:pr-0")],
                [`${props.title} `, h.span([h.Class("hidden md:inline")], [props.titleSuffix])],
              ),
              h.p([h.Class("text-sm text-text-tertiary md:truncate")], [props.description]),
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
                          "m-0 w-full bg-transparent px-3 py-2 text-sm text-text-primary ring-0 outline-hidden placeholder:text-text-placeholder autofill:rounded-lg autofill:text-text-primary",
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
                    "group relative inline-flex h-max cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-bg-primary px-3 py-2 text-sm font-semibold text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-text-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Type("submit"),
                ],
                [h.span([h.Class("px-0.5")], [props.subscribeLabel])],
              ),
            ],
          ),
          h.div(
            [h.Class("absolute top-2 right-2 flex shrink-0 items-center justify-center md:static")],
            [
              h.button(
                [
                  h.AriaLabel(props.dismissLabel),
                  h.Class(
                    "flex size-9 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.OnClick(props.onDismiss),
                  h.Type("button"),
                ],
                [icon("M18 6 6 18M6 6l12 12", "size-5 shrink-0 transition-inherit-all", h)],
              ),
            ],
          ),
        ],
      ),
    ],
  );
