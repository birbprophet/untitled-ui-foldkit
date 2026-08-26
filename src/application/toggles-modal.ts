/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled native dialog and toggle list preserve the authenticated modal anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { toggle } from "../base/controls.ts";

export type TogglesModalChannel = "facebook" | "medium" | "twitter";

export interface TogglesModalProps<Message> {
  readonly id: string;
  readonly isOpen: boolean;
  readonly messageForToggle: (channel: TogglesModalChannel) => NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onConfirm: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly selectedChannels: readonly TogglesModalChannel[];
}

const channels = [
  ["twitter", "Share on X", "@yourcompany"],
  ["medium", "Share on Medium", "yourcompany.medium.com"],
  ["facebook", "Share on Facebook", "@yourcompany"],
] as const;

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("M18 6 6 18M6 6l12 12"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const checkCircleIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("z-1 size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("m9 12 2 2 4.5-4.5M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

export const togglesModal = <Message>(
  props: TogglesModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-end justify-center bg-overlay/70 px-4 pt-4 pb-[clamp(16px,8vh,64px)] outline-hidden backdrop-blur-[6px] sm:items-center sm:px-8 sm:py-8",
              ),
              h.DataAttribute("modal-overlay", props.id),
            ],
            [
              h.div([h.AriaHidden(true), h.Class("absolute inset-0"), h.OnClick(props.onDismiss)]),
              h.dialog(
                [
                  h.AriaDescribedBy(descriptionId),
                  h.AriaLabelledBy(titleId),
                  h.Class(
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-[calc(100%-32px)] max-w-100 overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:w-full sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.button(
                    [
                      h.AriaLabel("Close dialog"),
                      h.Autofocus(true),
                      h.Class(
                        "absolute top-3 right-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2 sm:top-4 sm:right-4",
                      ),
                      h.OnClick(props.onDismiss),
                      h.Type("button"),
                    ],
                    [closeIcon(h)],
                  ),
                  h.div(
                    [h.Class("flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6")],
                    [
                      h.div(
                        [
                          h.Class(
                            "relative flex size-10 w-max shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-success-primary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
                          ),
                        ],
                        [checkCircleIcon(h)],
                      ),
                      h.div(
                        [h.Class("z-1 flex flex-col gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            ["Blog post published"],
                          ),
                          h.p(
                            [
                              h.Class("hidden text-sm text-text-tertiary sm:flex"),
                              h.Id(descriptionId),
                            ],
                            [
                              "This blog post has been published. Team members will be able to edit this post and republish changes.",
                            ],
                          ),
                          h.p(
                            [h.AriaHidden(true), h.Class("text-sm text-text-tertiary sm:hidden")],
                            [
                              "This blog post has been published. Team members will be able to edit this post.",
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div(
                    [h.Class("relative flex flex-col gap-3 px-4 sm:px-6")],
                    channels.map(([channel, label, hint]) =>
                      toggle(
                        {
                          hint,
                          isSelected: props.selectedChannels.includes(channel),
                          label,
                          name: channel,
                          onToggle: props.messageForToggle(channel),
                          size: "sm",
                        },
                        h,
                      ),
                    ),
                  ),
                  h.footer(
                    [
                      h.Class(
                        "flex flex-1 flex-col-reverse gap-3 p-4 pt-6 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pt-8 sm:pb-6",
                      ),
                    ],
                    [
                      button(
                        {
                          color: "secondary",
                          label: "Cancel",
                          onPress: props.onCancel,
                          size: "md",
                        },
                        h,
                      ),
                      button(
                        {
                          color: "primary",
                          label: "Confirm",
                          onPress: props.onConfirm,
                          size: "md",
                        },
                        h,
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ]
      : [],
  );
};
