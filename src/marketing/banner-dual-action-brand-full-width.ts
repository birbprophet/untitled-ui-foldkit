/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI full-width brand dual-action banner. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export interface BannerDualActionBrandFullWidthProps<Message> {
  readonly allowLabel: string;
  readonly declineLabel: string;
  readonly description: string;
  readonly dismissLabel: string;
  readonly onAllow: NoInfer<Message>;
  readonly onDecline: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly policyHref: string;
  readonly policyLabel: string;
  readonly title: string;
}

const verifiedIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 text-brand-200"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          "m9 12 2 2 4.5-4.5m2.401-4.501a2.03 2.03 0 0 0 1.1 1.1l1.744.723a2.033 2.033 0 0 1 1.1 2.656l-.722 1.744a2.03 2.03 0 0 0 0 1.556l.722 1.744a2.033 2.033 0 0 1-1.1 2.656L19 17.901A2.033 2.033 0 0 0 17.9 19l-.723 1.745a2.032 2.032 0 0 1-2.656 1.1l-1.744-.722a2.032 2.032 0 0 0-1.555 0l-1.745.723a2.033 2.033 0 0 1-2.654-1.1L6.1 19.001A2.033 2.033 0 0 0 5 17.9l-1.744-.723a2.033 2.033 0 0 1-1.1-2.654l.721-1.744a2.033 2.033 0 0 0 0-1.556l-.722-1.746a2.033 2.033 0 0 1 1.1-2.657L5 6.098A2.03 2.03 0 0 0 6.1 5l.723-1.745a2.033 2.033 0 0 1 2.656-1.1l1.744.722a2.033 2.033 0 0 0 1.555-.001l1.746-.72a2.032 2.032 0 0 1 2.655 1.1l.723 1.746v-.003Z",
        ),
      ]),
    ],
  );

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5 shrink-0"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("M18 6 6 18M6 6l12 12"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

export const bannerDualActionBrandFullWidth = <Message>(
  props: BannerDualActionBrandFullWidthProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "relative border-t border-brand_alt bg-brand-section_subtle in-data-[theme=dark]:border-neutral-700 md:border-t-0 md:border-b md:border-brand md:in-data-[theme=dark]:border-neutral-700",
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
            [h.Class("flex flex-1 flex-col gap-3 md:w-0 md:flex-row md:items-center md:gap-2")],
            [
              verifiedIcon(h),
              h.div(
                [h.Class("flex flex-col gap-2 overflow-hidden lg:flex-row lg:gap-1.5")],
                [
                  h.p(
                    [
                      h.Class(
                        "pr-8 text-sm font-semibold text-primary_on-brand md:truncate md:pr-0",
                      ),
                    ],
                    [props.title],
                  ),
                  h.p(
                    [h.Class("text-sm text-tertiary_on-brand md:truncate")],
                    [
                      props.description,
                      " ",
                      h.a(
                        [
                          h.Class(
                            "rounded-xs underline decoration-utility-brand-500_alt underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
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
          h.div(
            [h.Class("flex gap-2")],
            [
              h.div(
                [h.Class("flex w-full flex-col-reverse gap-2 md:flex-row md:gap-3")],
                [
                  button(
                    {
                      className: "shadow-xs! ring-0",
                      color: "secondary",
                      label: props.declineLabel,
                      onPress: props.onDecline,
                      size: "sm",
                    },
                    h,
                  ),
                  button(
                    {
                      color: "primary",
                      label: props.allowLabel,
                      onPress: props.onAllow,
                      size: "sm",
                    },
                    h,
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
                    [closeIcon(h)],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
