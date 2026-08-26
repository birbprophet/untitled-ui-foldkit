/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the authenticated link-field dialog anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { input } from "../base/fields.ts";

export interface LinkFieldModalProps<Message> {
  readonly copied: boolean;
  readonly id: string;
  readonly isOpen: boolean;
  readonly link: string;
  readonly onCancel: NoInfer<Message>;
  readonly onConfirm: NoInfer<Message>;
  readonly onCopy: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onLinkInput: (value: string) => NoInfer<Message>;
}

const lineIcon = <Message>(kind: "check" | "close" | "copy", h: HtmlBuilder<Message>): Html => {
  const paths = {
    check: "M20 6 9 17l-5-5",
    close: "M18 6 6 18M6 6l12 12",
    copy: "M5 15c-.932 0-1.398 0-1.765-.152a2 2 0 0 1-1.083-1.083C2 13.398 2 12.932 2 12V5.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 2 4.08 2 5.2 2H12c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C15 3.602 15 4.068 15 5m-2.8 17h6.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 20.48 22 19.92 22 18.8v-6.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 9 19.92 9 18.8 9h-6.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C9 10.52 9 11.08 9 12.2v6.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C10.52 22 11.08 22 12.2 22Z",
  } as const;
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class(kind === "close" ? "size-5" : "size-5 shrink-0"),
      h.DataAttribute("icon", kind),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(paths[kind]),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );
};

const successIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Class(
        "relative flex size-10 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
      ),
    ],
    [
      h.svg(
        [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
        [
          h.path([
            h.D(
              "m7.5 12 3 3 6-6m5.5 3c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z",
            ),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeLinejoin("round"),
            h.StrokeWidth("2"),
          ]),
        ],
      ),
    ],
  );

export const linkFieldModal = <Message>(
  props: LinkFieldModalProps<Message>,
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
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-max max-w-[calc(100%-32px)] overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 shadow-xl outline-hidden sm:m-auto sm:max-w-100 sm:rounded-2xl",
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
                        "absolute top-3 right-3 z-20 flex size-9 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 sm:top-4 sm:right-4",
                      ),
                      h.OnClick(props.onDismiss),
                      h.Type("button"),
                    ],
                    [lineIcon("close", h)],
                  ),
                  h.header(
                    [h.Class("flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6")],
                    [
                      h.div([h.Class("relative w-max")], [successIcon(h)]),
                      h.div(
                        [h.Class("z-10 flex flex-col gap-0.5")],
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
                            [h.Class("text-sm text-text-tertiary sm:hidden")],
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
                    [
                      h.Class(
                        "flex flex-row items-end justify-end gap-1 px-4 sm:gap-[5px] sm:px-6",
                      ),
                    ],
                    [
                      input(
                        {
                          isReadOnly: true,
                          label: "Share link",
                          name: `${props.id}-share-link`,
                          onInput: props.onLinkInput,
                          size: "md",
                          value: props.link,
                        },
                        h,
                      ),
                      h.button(
                        [
                          h.AriaLabel(props.copied ? "Link copied" : "Copy link"),
                          h.Class(
                            "relative inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-text-tertiary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-text-tertiary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                          ),
                          h.OnClick(props.onCopy),
                          h.Type("button"),
                        ],
                        [lineIcon(props.copied ? "check" : "copy", h)],
                      ),
                    ],
                  ),
                  h.footer(
                    [
                      h.Class(
                        "z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 sm:grid sm:grid-cols-2 sm:px-6 sm:pt-8 sm:pb-6 [&>*]:grow",
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
