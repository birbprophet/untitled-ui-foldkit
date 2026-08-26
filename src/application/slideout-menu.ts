/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled native dialog preserves the upstream slideout anatomy without a client framework. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface SlideoutMenuProps<Message> {
  readonly content: readonly Html[];
  readonly description?: string;
  readonly footer?: readonly Html[];
  readonly id: string;
  readonly isOpen: boolean;
  readonly nativeTopLayer?: boolean;
  readonly onCancel: NoInfer<Message>;
  readonly onOpen?: NoInfer<Message>;
  readonly responsiveTitle?: boolean;
  readonly title: string;
  readonly triggerLabel?: string;
}

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 20 20")],
    [
      h.path([
        h.D("m5 5 10 10M15 5 5 15"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

export const slideoutMenu = <Message>(
  props: SlideoutMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  return h.div(
    [],
    [
      ...(props.triggerLabel === undefined || props.onOpen === undefined
        ? []
        : [
            h.button(
              [
                h.Class(
                  "group relative inline-flex h-max cursor-pointer items-center justify-center rounded-lg bg-bg-primary px-3 py-2 text-sm font-semibold text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                ),
                h.OnClick(props.onOpen),
                h.Type("button"),
              ],
              [h.span([h.Class("px-0.5")], [props.triggerLabel])],
            ),
          ]),
      ...(props.isOpen
        ? [
            h.div(
              [
                h.Class(
                  "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-end bg-overlay/70 pl-6 outline-hidden backdrop-blur-[6px] md:pl-10",
                ),
                h.DataAttribute("slideout-overlay", props.id),
              ],
              [
                h.button([
                  h.AriaHidden(true),
                  h.Class("fixed inset-0 cursor-default border-0 bg-transparent p-0"),
                  h.OnClick(props.onCancel),
                  h.Tabindex(-1),
                  h.Type("button"),
                ]),
                h.dialog(
                  [
                    ...(props.description === undefined ? [] : [h.AriaDescribedBy(descriptionId)]),
                    h.AriaLabel("Slideout menu"),
                    h.Class(
                      `fixed !top-0 !right-0 !bottom-0 !left-auto m-0 h-full max-w-100 overflow-hidden border-0 bg-bg-primary p-0 shadow-xl ring-1 ring-border-secondary-alt outline-hidden ${props.nativeTopLayer === true ? "w-[calc(100%-24px)] md:w-full" : "w-full"}`,
                    ),
                    h.Id(props.id),
                    h.OnCancel(props.onCancel),
                    ...(props.nativeTopLayer === true ? [] : [h.Open(true)]),
                  ],
                  [
                    h.div(
                      [
                        h.Class(
                          "relative flex size-full flex-col items-start gap-6 overflow-y-auto bg-bg-primary outline-hidden",
                        ),
                      ],
                      [
                        h.header(
                          [h.Class("relative z-1 w-full px-4 pt-6 md:px-6")],
                          [
                            h.h2(
                              [
                                h.Class(
                                  `${props.responsiveTitle === true ? "text-md md:text-lg" : "text-lg"} font-semibold text-text-primary`,
                                ),
                                h.Id(titleId),
                              ],
                              [props.title],
                            ),
                            ...(props.description === undefined
                              ? []
                              : [
                                  h.p(
                                    [
                                      h.Class("mt-1 text-sm text-text-tertiary"),
                                      h.Id(descriptionId),
                                    ],
                                    [props.description],
                                  ),
                                ]),
                            h.button(
                              [
                                h.AriaLabel("Close slideout menu"),
                                h.Class(
                                  "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                                ),
                                h.OnClick(props.onCancel),
                                h.Type("button"),
                              ],
                              [closeIcon(h)],
                            ),
                          ],
                        ),
                        h.main(
                          [
                            h.Class(
                              "flex size-full flex-col gap-6 overflow-y-auto overscroll-auto px-4 md:px-6",
                            ),
                          ],
                          [...props.content],
                        ),
                        ...(props.footer === undefined
                          ? []
                          : [
                              h.footer(
                                [
                                  h.Class(
                                    "w-full p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6",
                                  ),
                                ],
                                [...props.footer],
                              ),
                            ]),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ]
        : []),
    ],
  );
};
