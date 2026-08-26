/* oxlint-disable effect/noReturnInArrow, effect/noTernary, effect/noSpread -- The native dialog keeps the upstream trigger, overlay, modal, and dialog anatomy in one controlled renderer. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ModalProps<Message> {
  readonly content: readonly Html[];
  readonly description?: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly onCancel: NoInfer<Message>;
  readonly onOpen?: NoInfer<Message>;
  readonly title: string;
  readonly triggerLabel?: string;
  readonly width?: "sm" | "md" | "lg";
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

export const modal = <Message>(props: ModalProps<Message>, h: HtmlBuilder<Message>): Html => {
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  const width = {
    lg: "max-w-2xl",
    md: "max-w-lg",
    sm: "max-w-sm",
  }[props.width ?? "md"];
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
                  "fixed inset-0 z-50 flex min-h-dvh w-full items-end justify-center bg-overlay/70 px-4 pt-4 pb-[clamp(16px,8vh,64px)] outline-hidden backdrop-blur-[6px] sm:items-center sm:justify-center sm:px-8 sm:py-8",
                ),
                h.DataAttribute("modal-overlay", props.id),
              ],
              [
                h.dialog(
                  [
                    ...(props.description === undefined ? [] : [h.AriaDescribedBy(descriptionId)]),
                    h.AriaLabelledBy(titleId),
                    h.Class(
                      `${width} relative m-0 -translate-y-[3px] max-h-[calc(100dvh-64px)] w-full overflow-hidden rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:translate-y-0 sm:rounded-2xl`,
                    ),
                    h.Id(props.id),
                    h.OnCancel(props.onCancel),
                    h.Open(true),
                  ],
                  [
                    h.div(
                      [h.Class("relative max-h-[inherit] w-full overflow-y-auto outline-hidden")],
                      [
                        h.div(
                          [h.Class("flex flex-col gap-2 p-6 pr-14")],
                          [
                            h.h2(
                              [h.Class("text-lg font-semibold text-text-primary"), h.Id(titleId)],
                              [props.title],
                            ),
                            ...(props.description === undefined
                              ? []
                              : [
                                  h.p(
                                    [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                                    [props.description],
                                  ),
                                ]),
                          ],
                        ),
                        h.button(
                          [
                            h.AriaLabel("Close dialog"),
                            h.Class(
                              "absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                            ),
                            h.OnClick(props.onCancel),
                            h.Type("button"),
                          ],
                          [closeIcon(h)],
                        ),
                        ...props.content,
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
