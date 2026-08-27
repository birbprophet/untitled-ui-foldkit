/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the authenticated integration dialog anatomy and responsive permission copy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { buttonUtility } from "../base/button-utility.ts";

export interface IntegrationPermission {
  readonly long: string;
  readonly short: string;
}

export interface IntegrationModalProps<Message> {
  readonly copied: boolean;
  readonly description: string;
  readonly id: string;
  readonly integrationIconUrl: string;
  readonly integrationName: string;
  readonly isOpen: boolean;
  readonly linkUrl: string;
  readonly onConnect: NoInfer<Message>;
  readonly onCopy: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onDocumentation: NoInfer<Message>;
  readonly permissions: readonly IntegrationPermission[];
  readonly wordmarkAlt: string;
  readonly wordmarkSrc: string;
}

const lineIcon = <Message>(
  kind: "book" | "check" | "copy" | "link" | "switch",
  classes: string,
  h: HtmlBuilder<Message>,
): Html => {
  const paths = {
    book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Zm0 0A2.5 2.5 0 0 0 6.5 22H20v-5M8 7h8M8 11h6",
    check: "m5 10 3 3 7-7",
    copy: "M8 8V5.6A1.6 1.6 0 0 1 9.6 4h8.8A1.6 1.6 0 0 1 20 5.6v8.8a1.6 1.6 0 0 1-1.6 1.6H16M5.6 8h8.8A1.6 1.6 0 0 1 16 9.6v8.8a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 18.4V9.6A1.6 1.6 0 0 1 5.6 8Z",
    link: "M8.5 12.5 15.5 5.5m-5-1 1.17-1.17a4 4 0 0 1 5.66 5.66l-1.17 1.17m-2.66 5.34-1.17 1.17a4 4 0 0 1-5.66-5.66l1.17-1.17",
    switch: "M17 7H3m0 0 4-4M3 7l4 4m10 6H3m14 0-4-4m4 4-4 4",
  } as const;
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class(classes),
      h.DataAttribute("icon", kind),
      h.Fill("none"),
      h.ViewBox(kind === "check" ? "0 0 20 20" : "0 0 24 24"),
    ],
    [
      h.path([
        h.D(paths[kind]),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth(kind === "check" ? "1.67" : "2"),
      ]),
    ],
  );
};

const appIcon = <Message>(src: string, alt: string, h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Class(
        "relative size-12 rounded-xl bg-bg-primary-alt p-1 ring-1 ring-border-primary ring-inset sm:size-14 sm:rounded-[14px]",
      ),
    ],
    [
      h.img([
        h.Alt(alt),
        h.Class(
          "size-full rounded-lg object-cover shadow-[0_-2px_2px_0_rgba(0,0,0,0.10)_inset,1px_8px_5px_0_rgba(0,0,0,0.05),0_3px_3px_0_rgba(0,0,0,0.10),0_1px_2px_0_rgba(0,0,0,0.10)] sm:rounded-[10px]",
        ),
        h.Src(src),
      ]),
    ],
  );

export const integrationModal = <Message>(
  props: IntegrationModalProps<Message>,
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
                  h.Autofocus(true),
                  h.Class(
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-[361px] max-w-[calc(100%-32px)] overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 shadow-xl outline-hidden sm:m-auto sm:w-110 sm:max-w-[calc(100%-64px)] sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.div(
                    [h.Class("flex items-center justify-center gap-3 px-4 pt-6 sm:pt-8")],
                    [
                      appIcon(props.wordmarkSrc, props.wordmarkAlt, h),
                      lineIcon("switch", "size-5 text-fg-quaternary", h),
                      appIcon(props.integrationIconUrl, props.integrationName, h),
                    ],
                  ),
                  h.header(
                    [h.Class("flex flex-col items-center gap-0.5 px-4 pt-4 text-center sm:px-6")],
                    [
                      h.h2(
                        [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                        [`Connect Siglata to ${props.integrationName}`],
                      ),
                      h.p(
                        [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                        [props.description],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div(
                    [h.Class("flex flex-col gap-4 px-4 sm:gap-5 sm:px-6 sm:pb-8")],
                    [
                      h.section(
                        [h.Class("flex flex-col gap-3")],
                        [
                          h.p(
                            [h.Class("text-sm font-semibold text-text-primary")],
                            ["Siglata would like to"],
                          ),
                          h.div(
                            [h.Class("flex flex-col gap-2")],
                            props.permissions.map((permission) =>
                              h.div(
                                [h.Class("flex gap-2")],
                                [
                                  lineIcon("check", "mt-0.5 size-4 shrink-0 text-fg-quaternary", h),
                                  h.p(
                                    [h.Class("hidden text-sm text-text-tertiary sm:block")],
                                    [permission.long],
                                  ),
                                  h.p(
                                    [h.Class("text-sm text-text-tertiary sm:hidden")],
                                    [permission.short],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                      h.div(
                        [
                          h.Class(
                            "relative flex items-start gap-2 rounded-lg bg-bg-secondary p-3 ring-1 ring-border-secondary ring-inset",
                          ),
                        ],
                        [
                          lineIcon("link", "mt-0.5 size-4 shrink-0 text-fg-quaternary", h),
                          h.p(
                            [h.Class("flex-1 text-sm font-semibold text-text-primary")],
                            [props.linkUrl],
                          ),
                          h.div(
                            [h.Class("absolute top-2 right-2")],
                            [
                              buttonUtility(
                                {
                                  color: "tertiary",
                                  icon: (builder) =>
                                    lineIcon(props.copied ? "check" : "copy", "size-4", builder),
                                  onPress: props.onCopy,
                                  size: "xs",
                                  tooltip: props.copied ? "Copied" : "Copy",
                                },
                                h,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.footer(
                    [
                      h.Class(
                        "flex w-full flex-col-reverse gap-3 p-4 pt-6 sm:flex-row sm:items-center sm:justify-between sm:border-t sm:border-border-secondary sm:p-6 [&>*]:max-sm:grow",
                      ),
                    ],
                    [
                      button(
                        {
                          color: "secondary",
                          iconLeadingElement: lineIcon("book", "size-5", h),
                          label: "Documentation",
                          onPress: props.onDocumentation,
                          size: "md",
                        },
                        h,
                      ),
                      button(
                        {
                          color: "primary",
                          label: "Connect",
                          onPress: props.onConnect,
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
