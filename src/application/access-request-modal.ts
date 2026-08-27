/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled native dialog preserves the authenticated modal anatomy without a React Aria runtime. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import { button } from "../base/button.ts";

export interface AccessRequestModalProps<Message> {
  readonly avatarUrl: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly onCancel: NoInfer<Message>;
  readonly onConfirm: NoInfer<Message>;
  readonly projectName: string;
  readonly requesterEmail: string;
  readonly requesterFirstName: string;
  readonly requesterName: string;
}

const userPlusIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("z-1 size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("M15 19a6 6 0 0 0-12 0m6-7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm9-1v6m3-3h-6"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

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

export const accessRequestModal = <Message>(
  props: AccessRequestModalProps<Message>,
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
              h.div([h.AriaHidden(true), h.Class("absolute inset-0"), h.OnClick(props.onCancel)]),
              h.dialog(
                [
                  h.AriaDescribedBy(descriptionId),
                  h.AriaLabelledBy(titleId),
                  h.Class(
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-[calc(100%-32px)] max-w-100 overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:w-full sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onCancel),
                ],
                [
                  h.button(
                    [
                      h.AriaLabel("Close dialog"),
                      h.Autofocus(true),
                      h.Class(
                        "absolute top-3 right-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2 sm:top-4 sm:right-4",
                      ),
                      h.OnClick(props.onCancel),
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
                            "relative flex size-10 w-max shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
                          ),
                        ],
                        [userPlusIcon(h)],
                      ),
                      h.div(
                        [h.Class("z-1 flex flex-col gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            [`${props.requesterFirstName} has requested edit access`],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            [
                              "One of your team has requested edit access to your project ",
                              h.span(
                                [h.Class("text-sm font-semibold text-text-brand-secondary")],
                                [`${props.projectName}.`],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div(
                    [h.Class("px-4 sm:px-6")],
                    [
                      h.figure(
                        [h.Class("group flex min-w-0 flex-1 items-center gap-2")],
                        [
                          avatar(
                            {
                              alt: props.requesterName,
                              border: true,
                              size: "md",
                              src: props.avatarUrl,
                            },
                            h,
                          ),
                          h.figcaption(
                            [h.Class("min-w-0 flex-1")],
                            [
                              h.p(
                                [h.Class("text-sm font-semibold text-text-primary")],
                                [props.requesterName],
                              ),
                              h.p(
                                [h.Class("truncate text-sm text-text-tertiary")],
                                [props.requesterEmail],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div(
                    [
                      h.Class(
                        "z-1 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 sm:flex-row sm:justify-end sm:px-6 sm:pt-8 sm:pb-6",
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
