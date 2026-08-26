/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-negated-condition, eslint/no-nested-ternary, mps/no-length-comparison, mps/prefer-arr-match, mps/prefer-option-over-null, unicorn/no-negated-condition -- The renderer follows the upstream mutually exclusive message-content branches and optional adornments directly. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";

export type MessagingStatus = "sent" | "read" | "failed";
export type MessagingAction = "ai" | "edit" | "download" | "reply" | "copy" | "play";

export interface MessagingUser {
  readonly me?: boolean;
  readonly name?: string;
  readonly seed?: string;
  readonly status?: "online" | "offline";
}

export interface MessagingMessage {
  readonly attachment?: {
    readonly name: string;
    readonly size: string;
    readonly type: "jpg" | "txt" | "pdf" | "mp4";
  };
  readonly audio?: { readonly duration: string };
  readonly id: string;
  readonly image?: {
    readonly alt: string;
    readonly name: string;
    readonly size: string;
    readonly src: string;
  };
  readonly reactions?: readonly { readonly content: string; readonly count: number }[];
  readonly readAt?: string;
  readonly reply?: { readonly text: string };
  readonly sentAt?: string;
  readonly status?: MessagingStatus;
  readonly text?: string;
  readonly typing?: boolean;
  readonly urlPreview?: { readonly description: string; readonly title: string };
  readonly user?: MessagingUser;
}

export interface MessagingProps<Message> {
  readonly actionLabels?: {
    readonly copy: string;
    readonly download: string;
    readonly edit: string;
    readonly generate: string;
    readonly play: string;
    readonly reply: string;
  };
  readonly message: MessagingMessage;
  readonly onAction: (messageId: string, action: MessagingAction) => NoInfer<Message>;
  readonly onReaction?: (messageId: string, content: string) => NoInfer<Message>;
  readonly showUserLabel?: boolean;
}

type IconKind = "ai" | "copy" | "download" | "edit" | "link" | "reply";

const icon = <Message>(kind: IconKind, h: HtmlBuilder<Message>): Html => {
  const paths: Record<IconKind, string> = {
    ai: "M4.5 22v-5m0-10V2M2 4.5h5m-5 15h5M13 3l-1.734 4.509c-.282.733-.423 1.1-.643 1.408a3 3 0 0 1-.706.707c-.308.219-.675.36-1.408.642L4 12l4.509 1.734c.733.282 1.1.423 1.408.643.273.194.512.433.707.706.219.308.36.675.642 1.408L13 21l1.734-4.509c.282-.733.423-1.1.643-1.408.194-.273.433-.512.706-.707.308-.219.675-.36 1.408-.642L22 12l-4.509-1.734c-.733-.282-1.1-.423-1.408-.642a3 3 0 0 1-.706-.707c-.22-.308-.36-.675-.643-1.408L13 3Z",
    copy: "M5 15c-.932 0-1.398 0-1.765-.152a2 2 0 0 1-1.083-1.083C2 13.398 2 12.932 2 12V5.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 2 4.08 2 5.2 2H12c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C15 3.602 15 4.068 15 5m-2.8 17h6.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 20.48 22 19.92 22 18.8v-6.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 9 19.92 9 18.8 9h-6.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C9 10.52 9 11.08 9 12.2v6.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C10.52 22 11.08 22 12.2 22Z",
    download:
      "m8 17 4 4m0 0 4-4m-4 4v-9m8 4.743A5.5 5.5 0 0 0 16.5 7a.62.62 0 0 1-.534-.302 7.5 7.5 0 1 0-11.78 9.096",
    edit: "m21 18-1 1.094A2.71 2.71 0 0 1 18 20c-.75 0-1.47-.326-2-.906a2.716 2.716 0 0 0-2-.904c-.75 0-1.469.325-2 .904M3 20h1.675c.489 0 .733 0 .964-.055.204-.05.399-.13.578-.24.201-.123.374-.296.72-.642L19.5 6.5a2.121 2.121 0 0 0-3-3L3.937 16.063c-.346.346-.519.519-.642.72a2 2 0 0 0-.24.578c-.055.23-.055.475-.055.965V20Z",
    link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
    reply:
      "M2 10s.121-.85 3.636-4.364A9 9 0 0 1 20.776 10M2 10V4m0 6h6m14 4s-.121.85-3.636 4.364A9 9 0 0 1 3.224 14M22 14v6m0-6h-6",
  };
  return h.svg(
    [h.AriaHidden(true), h.Class("size-4"), h.Fill("none"), h.ViewBox("0 0 24 24")],
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

const actionButton = <Message>(
  label: string,
  kind: IconKind,
  message: Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.AriaLabel(label),
      h.Class(
        "cursor-pointer rounded p-0.5 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.OnClick(message),
      h.Title(label),
      h.Type("button"),
    ],
    [icon(kind, h)],
  );

const actions = <Message>(props: MessagingProps<Message>, h: HtmlBuilder<Message>): Html => {
  const { message } = props;
  const labels = props.actionLabels ?? {
    copy: "Copy",
    download: "Download",
    edit: "Edit message",
    generate: "Generate with AI",
    play: "Play audio message",
    reply: "Reply",
  };
  const hasDownload =
    message.text === undefined &&
    (message.attachment !== undefined ||
      message.audio !== undefined ||
      message.image !== undefined);
  return h.div(
    [
      h.Class(
        "absolute right-2 -bottom-5 z-10 flex gap-1.5 rounded-lg bg-bg-primary-solid px-2 py-1.5 opacity-0 shadow-xl transition duration-100 ease-linear group-hover/msg:opacity-100 group-focus-within/msg:opacity-100",
      ),
      h.DataAttribute("theme", "dark"),
    ],
    [
      actionButton(labels.generate, "ai", props.onAction(message.id, "ai"), h),
      ...(message.text === undefined
        ? hasDownload
          ? [actionButton(labels.download, "download", props.onAction(message.id, "download"), h)]
          : []
        : [actionButton(labels.edit, "edit", props.onAction(message.id, "edit"), h)]),
      actionButton(labels.reply, "reply", props.onAction(message.id, "reply"), h),
      actionButton(labels.copy, "copy", props.onAction(message.id, "copy"), h),
    ],
  );
};

const messageStatus = <Message>(
  status: MessagingStatus,
  readAt: string | undefined,
  h: HtmlBuilder<Message>,
): Html => {
  const label =
    status === "sent"
      ? "Unread"
      : status === "read"
        ? `Read${readAt !== undefined ? ` ${readAt}` : ""}`
        : "Failed";
  const path = status === "sent" ? "M13 5 7 11 4 8" : "M10.5 5 4.5 11 1.5 8M14.5 5 8.5 11 6.5 9";
  return h.button(
    [h.AriaLabel(label), h.Class("rounded focus:outline-hidden"), h.Title(label), h.Type("button")],
    [
      h.svg(
        [
          h.Class(
            status === "failed"
              ? "text-fg-error-primary"
              : status === "read"
                ? "text-fg-brand-secondary"
                : "text-fg-quaternary",
          ),
          h.Fill("none"),
          h.ViewBox("0 0 16 16"),
          h.Width("16"),
          h.Height("16"),
        ],
        status === "failed"
          ? [
              h.path([
                h.D(
                  "M8 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM7.25 5a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0V5ZM8 11.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z",
                ),
                h.Fill("currentColor"),
              ]),
            ]
          : [
              h.path([
                h.D(path),
                h.Stroke("currentColor"),
                h.StrokeLinecap("round"),
                h.StrokeLinejoin("round"),
                h.StrokeWidth("1.5"),
              ]),
            ],
      ),
    ],
  );
};

const fileIcon = <Message>(
  type: MessagingMessage["attachment"] extends infer _ ? string : never,
  h: HtmlBuilder<Message>,
): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-10 shrink-0 text-border-secondary"),
      h.Fill("none"),
      h.ViewBox("0 0 40 40"),
    ],
    [
      h.path([
        h.D(
          "M7.75 4A3.25 3.25 0 0 1 11 .75h16l11.25 11.25v24A3.25 3.25 0 0 1 35 39.25H11A3.25 3.25 0 0 1 7.75 36Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeWidth("1.5"),
      ]),
      h.path([h.D("M27 .5V8a4 4 0 0 0 4 4h7.5"), h.Stroke("currentColor"), h.StrokeWidth("1.5")]),
      h.rect([
        h.Fill(type === "pdf" ? "#d92d20" : "#1570ef"),
        h.Height("16"),
        h.Rx("2"),
        h.Width("26"),
        h.X("1"),
        h.Y("18"),
      ]),
      ...(type === "pdf"
        ? [
            h.path([
              h.D(
                "M4.832 30v-7.273h2.87q.826 0 1.41.316.582.314.887.87.31.555.31 1.279t-.313 1.278q-.313.555-.906.863-.59.309-1.427.309h-1.83V26.41h1.581q.444 0 .732-.153.29-.156.433-.43.145-.276.145-.635 0-.363-.145-.632a.97.97 0 0 0-.433-.423q-.291-.153-.74-.153H6.37V30zm9.053 0h-2.578v-7.273h2.6q1.095 0 1.889.437.791.433 1.218 1.246.43.814.43 1.947 0 1.136-.43 1.953a2.95 2.95 0 0 1-1.226 1.253q-.795.437-1.903.437m-1.04-1.317h.976q.682 0 1.147-.242.47-.244.703-.756.238-.516.238-1.328 0-.807-.238-1.318a1.54 1.54 0 0 0-.7-.753q-.465-.24-1.146-.241h-.98zM18.582 30v-7.273h4.816v1.268H20.12v1.733h2.958v1.268H20.12V30Z",
              ),
              h.Fill("white"),
            ]),
          ]
        : [
            h.text(
              [
                h.Attribute("x", "5"),
                h.Attribute("y", "29.5"),
                h.Fill("white"),
                h.Class("text-[9px] font-bold uppercase"),
              ],
              [type],
            ),
          ]),
    ],
  );

const waveform = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.Class("min-w-0 flex-1 text-fg-brand-primary-alt"),
      h.Fill("none"),
      h.Height("34"),
      h.ViewBox("0 0 206 34"),
      h.Width("206"),
    ],
    [
      h.path([
        h.D(
          "M1 15V19M5 15V19M9 15V19M13 15V19M17 9.00005V25M21 5.00005V29M25 1.00005V33M29 1.00005V33M33 5.00005V29M37 13V21M41 9.00005V25M45 13V21M49 5.00005V29M53 5.00005V29M57 9.00005V25M61 9.00005V25M65 1.00005V33M69 1.00005V33M73 5.00005V29M77 1.00005V33M81 9.00005V25M85 13V21M89 15V19.0001M93 15V19.0001M97 13V21.0001M101 13V21.0001M105 9V25.0001M109 5V29.0001M113 1V33.0001M117 5V29.0001M121 5V29.0001M125 5V29.0001M129 9V25.0001M133 13V21.0001M137 9V25.0001M141 13V21.0001M145 9V25.0001M149 5V29.0001M153 5V29.0001M157 9V25.0001M161 1V33.0001M165 5V29.0001M169 9V25.0001M173 13V21.0001M177 15V19.0001M181 9V25.0001M185 5V29.0001M189 5V29.0001M193 9V25.0001M197 15V19.0001M201 15V19.0001M205 15V19.0001",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
      ]),
    ],
  );

const textContent = <Message>(props: MessagingProps<Message>, h: HtmlBuilder<Message>): Html => {
  const { message } = props;
  return h.div(
    [
      h.Class(
        `group/msg relative rounded-lg px-3 py-2 text-md wrap-break-word text-text-primary ring-1 ring-border-secondary ring-inset ${message.user?.me === true ? "rounded-tr-none bg-bg-primary pr-4" : "rounded-tl-none bg-bg-secondary"}`,
      ),
    ],
    [
      ...(message.reply === undefined
        ? []
        : [
            h.blockquote(
              [
                h.Class(
                  "relative mb-1.5 rounded-lg bg-bg-primary px-3 py-2 text-sm text-text-tertiary ring-1 ring-border-secondary ring-inset before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border-l-[3px] before:border-brand",
                ),
              ],
              [message.reply.text],
            ),
          ]),
      ...(message.image === undefined
        ? []
        : [
            h.figure(
              [h.Class("mt-1 mb-1.5")],
              [
                h.img([
                  h.Alt(message.image.alt),
                  h.Class(
                    "w-full rounded-md object-cover outline-1 -outline-offset-[0.5px] outline-black/10",
                  ),
                  h.Src(message.image.src),
                ]),
              ],
            ),
          ]),
      ...(message.urlPreview === undefined
        ? []
        : [
            h.aside(
              [
                h.Class(
                  "mt-1 mb-1.5 flex items-start gap-1.5 rounded-lg bg-bg-primary p-2 pr-3 ring-1 ring-border-secondary ring-inset",
                ),
              ],
              [
                h.span([h.Class("mt-0.5 size-4 shrink-0 text-fg-quaternary")], [icon("link", h)]),
                h.div(
                  [h.Class("min-w-0 flex-1")],
                  [
                    h.p(
                      [h.Class("w-full truncate text-sm font-medium text-text-secondary")],
                      [message.urlPreview.title],
                    ),
                    h.p(
                      [h.Class("w-full truncate text-sm text-text-tertiary")],
                      [message.urlPreview.description],
                    ),
                  ],
                ),
              ],
            ),
          ]),
      message.text ?? "",
      actions(props, h),
    ],
  );
};

export const messaging = <Message>(
  props: MessagingProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const { message } = props;
  const showUserLabel = props.showUserLabel !== false;
  return h.li(
    [
      h.Class(
        `relative flex items-start gap-3 ${message.user?.me === true ? "self-end pl-10" : "pr-8 lg:pr-10"}`,
      ),
    ],
    [
      ...(message.user === undefined || message.user.me === true
        ? []
        : [
            avatar(
              {
                alt: message.user.name ?? "Agent",
                entityKind: "agent",
                seed: message.user.seed ?? message.id,
                size: "sm",
                status: message.user.status,
              },
              h,
            ),
          ]),
      h.article(
        [h.Class("flex min-w-0 flex-1 flex-col gap-1.5")],
        [
          ...((message.user !== undefined && showUserLabel) ||
          message.sentAt !== undefined ||
          message.status !== undefined
            ? [
                h.header(
                  [h.Class("flex items-center gap-2")],
                  [
                    ...(message.user !== undefined && showUserLabel
                      ? [
                          h.cite(
                            [
                              h.Class(
                                "flex-1 truncate text-sm font-medium text-text-secondary not-italic",
                              ),
                            ],
                            [message.user.me === true ? "You" : (message.user.name ?? "")],
                          ),
                        ]
                      : []),
                    ...(message.typing !== true &&
                    (message.sentAt !== undefined || message.status !== undefined)
                      ? [
                          h.div(
                            [h.Class("flex items-center gap-0.5")],
                            [
                              ...(message.sentAt === undefined
                                ? []
                                : [
                                    h.time(
                                      [
                                        h.Class("text-xs text-text-tertiary"),
                                        h.Datetime(message.sentAt),
                                      ],
                                      [message.sentAt],
                                    ),
                                  ]),
                              ...(message.status === undefined
                                ? []
                                : [messageStatus(message.status, message.readAt, h)]),
                            ],
                          ),
                        ]
                      : []),
                  ],
                ),
              ]
            : []),
          ...(message.text === undefined
            ? message.image !== undefined
              ? [
                  h.figure(
                    [h.Class("flex flex-col gap-1.5")],
                    [
                      h.div(
                        [h.Class("group/msg relative")],
                        [
                          h.img([
                            h.Alt(message.image.alt),
                            h.Class(
                              "w-full rounded-md object-cover outline-1 -outline-offset-[0.5px] outline-black/10",
                            ),
                            h.Src(message.image.src),
                          ]),
                          actions(props, h),
                        ],
                      ),
                      h.figcaption(
                        [h.Class("flex items-center gap-1")],
                        [
                          h.span(
                            [
                              h.Class(
                                "min-w-0 flex-1 truncate text-sm font-medium text-text-secondary",
                              ),
                            ],
                            [message.image.name],
                          ),
                          h.span([h.Class("text-sm text-text-tertiary")], [message.image.size]),
                        ],
                      ),
                    ],
                  ),
                ]
              : message.audio !== undefined
                ? [
                    h.div(
                      [
                        h.Class(
                          "group/msg relative flex items-center gap-2 rounded-lg rounded-tl-none bg-bg-primary p-3 ring-1 ring-border-secondary",
                        ),
                      ],
                      [
                        h.button(
                          [
                            h.AriaLabel(props.actionLabels?.play ?? "Play audio message"),
                            h.Class(
                              "flex size-8 cursor-pointer items-center justify-center rounded-full bg-fg-brand-primary-alt text-white outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                            ),
                            h.OnClick(props.onAction(message.id, "play")),
                            h.Type("button"),
                          ],
                          [
                            h.svg(
                              [
                                h.AriaHidden(true),
                                h.Class("size-4 translate-x-px"),
                                h.Fill("none"),
                                h.ViewBox("0 0 16 16"),
                              ],
                              [
                                h.path([
                                  h.D(
                                    "M2.2 2.863c0-1.251 1.372-2.018 2.438-1.362l8.348 5.136a1.6 1.6 0 0 1 0 2.726L4.638 14.5A1.6 1.6 0 0 1 2.2 13.137V2.863Z",
                                  ),
                                  h.Fill("currentColor"),
                                ]),
                              ],
                            ),
                          ],
                        ),
                        waveform(h),
                        h.p([h.Class("text-xs text-text-tertiary")], [message.audio.duration]),
                        actions(props, h),
                      ],
                    ),
                  ]
                : []
            : [textContent(props, h)]),
          ...(message.attachment === undefined
            ? []
            : [
                h.div(
                  [
                    h.Class(
                      "group/msg relative flex gap-3 rounded-lg rounded-tl-none bg-bg-primary px-3.5 py-2.5 ring-1 ring-border-secondary",
                    ),
                  ],
                  [
                    fileIcon(message.attachment.type, h),
                    h.div(
                      [h.Class("min-w-0 flex-1")],
                      [
                        h.p(
                          [h.Class("truncate text-sm font-medium text-text-secondary")],
                          [message.attachment.name],
                        ),
                        h.p([h.Class("text-sm text-text-tertiary")], [message.attachment.size]),
                      ],
                    ),
                    actions(props, h),
                  ],
                ),
              ]),
          ...(message.reactions === undefined || message.reactions.length === 0
            ? []
            : [
                h.ul(
                  [h.Class("flex justify-end gap-1")],
                  message.reactions.map((reaction) =>
                    h.li(
                      [],
                      [
                        h.button(
                          [
                            h.AriaLabel(`${reaction.content} ${String(reaction.count)}`),
                            h.Class(
                              "flex h-6 items-center gap-1 rounded-2xl bg-bg-secondary px-2 py-0.5 ring-1 ring-border-secondary ring-inset",
                            ),
                            ...(props.onReaction === undefined
                              ? []
                              : [h.OnClick(props.onReaction(message.id, reaction.content))]),
                            h.Type("button"),
                          ],
                          [
                            reaction.content,
                            ...(reaction.count > 1
                              ? [
                                  h.span(
                                    [h.Class("text-sm font-medium text-text-secondary")],
                                    [String(reaction.count)],
                                  ),
                                ]
                              : []),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ]),
          ...(message.typing === true
            ? [
                h.div(
                  [
                    h.AriaLabel("Typing"),
                    h.Class(
                      "flex h-7 w-10 items-center justify-center gap-1 self-start rounded-lg rounded-tl-none bg-bg-secondary text-md text-text-primary ring-1 ring-border-secondary ring-inset",
                    ),
                  ],
                  [
                    h.span([
                      h.Class(
                        "block size-1 animate-bounce rounded-full bg-fg-tertiary [animation-delay:-0.3s]",
                      ),
                    ]),
                    h.span([
                      h.Class(
                        "block size-1 animate-bounce rounded-full bg-fg-quaternary [animation-delay:-0.15s]",
                      ),
                    ]),
                    h.span([h.Class("block size-1 animate-bounce rounded-full bg-fg-tertiary")]),
                  ],
                ),
              ]
            : []),
        ],
      ),
    ],
  );
};
