/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/prefer-option-over-null -- Placeholder copy is part of the authenticated empty composer; fixed fixture branches and the controlled native slideout follow the source directly. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import type { MessagingAction } from "./messaging.ts";
import { tabs } from "./tabs.ts";

export type MessageChatMenuLocale = "en-US" | "pt-BR";
export type MessageChatMenuTab = "archive" | "groups" | "recent";

export type MessageChatPersonKey = "demi" | "lana" | "olivia" | "phoenix";

const personKeyOfName: Partial<Record<string, MessageChatPersonKey>> = {
  "Demi Wilkinson": "demi",
  "Lana Steiner": "lana",
  "Olivia Rhye": "olivia",
  "Phoenix Baker": "phoenix",
};
const avatarUrlFor = (
  fixture: MessageChatMenuFixture,
  avatars: Partial<Record<MessageChatPersonKey, string>>,
): string | undefined => {
  const personKey = personKeyOfName[fixture.name];
  return personKey === undefined ? undefined : avatars[personKey];
};

export interface MessageChatMenuProps<Message> {
  readonly draft: string;
  readonly focusedTab: MessageChatMenuTab;
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale: MessageChatMenuLocale;
  readonly messageForDraft: (value: string) => NoInfer<Message>;
  readonly messageForTabFocus: (tab: MessageChatMenuTab) => NoInfer<Message>;
  readonly messageForTabSelection: (tab: MessageChatMenuTab) => NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onMessageAction: (messageId: string, action: MessagingAction) => NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly avatars: Partial<Record<MessageChatPersonKey, string>>;
  readonly selectedTab: MessageChatMenuTab;
}

interface Copy {
  readonly archive: string;
  readonly close: string;
  readonly conversation: string;
  readonly download: string;
  readonly edit: string;
  readonly generate: string;
  readonly groups: string;
  readonly heading: string;
  readonly message: string;
  readonly recent: string;
  readonly read: string;
  readonly reply: string;
  readonly send: string;
  readonly slideout: string;
  readonly today: string;
  readonly you: string;
  readonly copy: string;
}

export interface MessageChatMenuFixture {
  readonly attachment?: { readonly name: string; readonly size: string };
  readonly id: string;
  readonly isSelf?: boolean;
  readonly name: string;
  readonly sentAt: string;
  readonly text?: string;
}

const copyByLocale: Record<MessageChatMenuLocale, Copy> = {
  "en-US": {
    archive: "Archive",
    close: "Close",
    conversation: "Conversation",
    copy: "Copy",
    download: "Download",
    edit: "Edit message",
    generate: "Generate with AI",
    groups: "Groups",
    heading: "Group chat",
    message: "Message",
    read: "Read",
    recent: "Recent",
    reply: "Reply",
    send: "Send message",
    slideout: "Slideout menu",
    today: "Today",
    you: "You",
  },
  "pt-BR": {
    archive: "Arquivo",
    close: "Fechar",
    conversation: "Conversa",
    copy: "Copiar",
    download: "Baixar",
    edit: "Editar mensagem",
    generate: "Gerar com IA",
    groups: "Grupos",
    heading: "Chat em grupo",
    message: "Mensagem",
    read: "Lida",
    recent: "Recentes",
    reply: "Responder",
    send: "Enviar mensagem",
    slideout: "Menu lateral",
    today: "Hoje",
    you: "Você",
  },
};

export const messageChatMenuFixture = (
  locale: MessageChatMenuLocale,
): readonly MessageChatMenuFixture[] =>
  locale === "pt-BR"
    ? [
        {
          id: "message-001",
          name: "Lana Steiner",
          sentAt: "quinta-feira, 11:40",
          text: "Olá, equipe! Terminei o documento de requisitos.",
        },
        {
          attachment: { name: "Requisitos técnicos.pdf", size: "1,2 MB" },
          id: "message-002",
          name: "Lana Steiner",
          sentAt: "quinta-feira, 11:40",
        },
        {
          id: "message-003",
          isSelf: true,
          name: "Você",
          sentAt: "quinta-feira, 11:41",
          text: "Ótimo! Obrigado.",
        },
        {
          id: "message-004",
          name: "Demi Wilkinson",
          sentAt: "quinta-feira, 11:44",
          text: "Boa hora — eu estava olhando isso agora.",
        },
        {
          id: "message-005",
          name: "Phoenix Baker",
          sentAt: "sexta-feira, 14:20",
          text: "Olá, Olivia. Você pode revisar o design mais recente quando puder?",
        },
        {
          id: "message-006",
          isSelf: true,
          name: "Você",
          sentAt: "sexta-feira, 14:20",
          text: "Claro, vou dar uma olhada hoje.",
        },
      ]
    : [
        {
          id: "message-001",
          name: "Lana Steiner",
          sentAt: "Thursday 11:40am",
          text: "Hey team, I've finished with the requirements doc!",
        },
        {
          attachment: { name: "Tech requirements.pdf", size: "1.2 MB" },
          id: "message-002",
          name: "Lana Steiner",
          sentAt: "Thursday 11:40am",
        },
        {
          id: "message-003",
          isSelf: true,
          name: "You",
          sentAt: "Thursday 11:41am",
          text: "Awesome! Thanks.",
        },
        {
          id: "message-004",
          name: "Demi Wilkinson",
          sentAt: "Thursday 11:44am",
          text: "Good timing—was just looking at this.",
        },
        {
          id: "message-005",
          name: "Phoenix Baker",
          sentAt: "Friday 2:20pm",
          text: "Hey Olivia, can you please review the latest design when you can?",
        },
        {
          id: "message-006",
          isSelf: true,
          name: "You",
          sentAt: "Friday 2:20pm",
          text: "Sure thing, I'll have a look today.",
        },
      ];

const icon = <Message>(
  kind: "ai" | "close" | "copy" | "download" | "edit" | "reply" | "send",
  className: string,
  h: HtmlBuilder<Message>,
): Html => {
  const paths = {
    ai: "M4.5 22v-5m0-10V2M2 4.5h5m-5 15h5M13 3l-1.734 4.509c-.282.733-.423 1.1-.643 1.408a3 3 0 0 1-.706.707c-.308.219-.675.36-1.408.642L4 12l4.509 1.734c.733.282 1.1.423 1.408.643.273.194.512.433.707.706.219.308.36.675.642 1.408L13 21l1.734-4.509c.282-.733.423-1.1.643-1.408.194-.273.433-.512.706-.707.308-.219.675-.36 1.408-.642L22 12l-4.509-1.734c-.733-.282-1.1-.423-1.408-.642a3 3 0 0 1-.706-.707c-.22-.308-.36-.675-.643-1.408L13 3Z",
    close: "M18 6 6 18M6 6l12 12",
    copy: "M5 15c-.932 0-1.398 0-1.765-.152a2 2 0 0 1-1.083-1.083C2 13.398 2 12.932 2 12V5.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 2 4.08 2 5.2 2H12c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C15 3.602 15 4.068 15 5m-2.8 17h6.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 20.48 22 19.92 22 18.8v-6.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 9 19.92 9 18.8 9h-6.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C9 10.52 9 11.08 9 12.2v6.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C10.52 22 11.08 22 12.2 22Z",
    download:
      "m8 17 4 4m0 0 4-4m-4 4v-9m8 4.743A5.5 5.5 0 0 0 16.5 7a.62.62 0 0 1-.534-.302 7.5 7.5 0 1 0-11.78 9.096",
    edit: "m21 18-1 1.094A2.71 2.71 0 0 1 18 20c-.75 0-1.47-.326-2-.906a2.716 2.716 0 0 0-2-.904c-.75 0-1.469.325-2 .904M3 20h1.675c.489 0 .733 0 .964-.055.204-.05.399-.13.578-.24.201-.123.374-.296.72-.642L19.5 6.5a2.121 2.121 0 0 0-3-3L3.937 16.063c-.346.346-.519.519-.642.72a2 2 0 0 0-.24.578c-.055.23-.055.475-.055.965V20Z",
    reply:
      "M2 10s.121-.85 3.636-4.364A9 9 0 0 1 20.776 10M2 10V4m0 6h6m14 4s-.121.85-3.636 4.364A9 9 0 0 1 3.224 14M22 14v6m0-6h-6",
    send: "m22 2-7 20-4-9-9-4 20-7Zm0 0L11 13",
  } as const;
  return h.svg(
    [h.AriaHidden(true), h.Class(className), h.Fill("none"), h.ViewBox("0 0 24 24")],
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

const readIcon = <Message>(copy: Copy, h: HtmlBuilder<Message>): Html =>
  h.button(
    [
      h.AriaLabel(copy.read),
      h.Class("rounded focus:outline-hidden"),
      h.Title(copy.read),
      h.Type("button"),
    ],
    [
      h.svg(
        [
          h.AriaHidden(true),
          h.Class("text-fg-brand-secondary"),
          h.Fill("none"),
          h.Height("16"),
          h.ViewBox("0 0 16 16"),
          h.Width("16"),
        ],
        [
          h.path([
            h.D("M10.5 5 4.5 11 1.5 8M14.5 5 8.5 11 6.5 9"),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeLinejoin("round"),
            h.StrokeWidth("1.5"),
          ]),
        ],
      ),
    ],
  );

const actionButton = <Message>(
  label: string,
  kind: "ai" | "copy" | "download" | "edit" | "reply",
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
    [icon(kind, "size-4", h)],
  );

const actions = <Message>(
  fixture: MessageChatMenuFixture,
  copy: Copy,
  onAction: MessageChatMenuProps<Message>["onMessageAction"],
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "absolute right-2 -bottom-5 z-1 flex gap-1.5 rounded-lg bg-bg-primary-solid px-2 py-1.5 opacity-0 shadow-xl transition duration-100 ease-linear group-hover/msg:opacity-100 group-focus-within/msg:opacity-100",
      ),
      h.DataAttribute("theme", "dark"),
    ],
    [
      actionButton(copy.generate, "ai", onAction(fixture.id, "ai"), h),
      actionButton(
        fixture.text === undefined ? copy.download : copy.edit,
        fixture.text === undefined ? "download" : "edit",
        onAction(fixture.id, fixture.text === undefined ? "download" : "edit"),
        h,
      ),
      actionButton(copy.reply, "reply", onAction(fixture.id, "reply"), h),
      actionButton(copy.copy, "copy", onAction(fixture.id, "copy"), h),
    ],
  );

const fileIcon = <Message>(h: HtmlBuilder<Message>): Html =>
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
      h.rect([h.Fill("#d92d20"), h.Height("16"), h.Rx("2"), h.Width("26"), h.X("1"), h.Y("18")]),
      h.path([
        h.D(
          "M4.832 30v-7.273h2.87q.826 0 1.41.316.582.314.887.87.31.555.31 1.279t-.313 1.278q-.313.555-.906.863-.59.309-1.427.309h-1.83V26.41h1.581q.444 0 .732-.153.29-.156.433-.43.145-.276.145-.635 0-.363-.145-.632a.97.97 0 0 0-.433-.423q-.291-.153-.74-.153H6.37V30zm9.053 0h-2.578v-7.273h2.6q1.095 0 1.889.437.791.433 1.218 1.246.43.814.43 1.947 0 1.136-.43 1.953a2.95 2.95 0 0 1-1.226 1.253q-.795.437-1.903.437m-1.04-1.317h.976q.682 0 1.147-.242.47-.244.703-.756.238-.516.238-1.328 0-.807-.238-1.318a1.54 1.54 0 0 0-.7-.753q-.465-.24-1.146-.241h-.98zM18.582 30v-7.273h4.816v1.268H20.12v1.733h2.958v1.268H20.12V30Z",
        ),
        h.Fill("white"),
      ]),
    ],
  );

const messageItem = <Message>(
  fixture: MessageChatMenuFixture,
  copy: Copy,
  avatars: MessageChatMenuProps<Message>["avatars"],
  onAction: MessageChatMenuProps<Message>["onMessageAction"],
  h: HtmlBuilder<Message>,
): Html =>
  h.li(
    [
      h.Class(
        `relative flex items-start gap-3 ${fixture.isSelf === true ? "self-end pl-10" : "pr-8 lg:pr-10"}`,
      ),
    ],
    [
      ...(fixture.isSelf === true
        ? []
        : [
            avatar(
              {
                alt: fixture.name,
                size: "sm",
                src: avatarUrlFor(fixture, avatars),
                status: "online",
              },
              h,
            ),
          ]),
      h.article(
        [h.Class("flex min-w-0 flex-1 flex-col gap-1.5")],
        [
          h.header(
            [h.Class("flex items-center gap-2")],
            [
              h.cite(
                [h.Class("flex-1 truncate text-sm font-medium text-text-secondary not-italic")],
                [fixture.isSelf === true ? copy.you : fixture.name],
              ),
              h.div(
                [h.Class("flex items-center gap-0.5")],
                [
                  h.time(
                    [h.Class("text-xs text-text-tertiary"), h.Datetime(fixture.sentAt)],
                    [fixture.sentAt],
                  ),
                  ...(fixture.isSelf === true ? [readIcon(copy, h)] : []),
                ],
              ),
            ],
          ),
          ...(fixture.text === undefined
            ? []
            : [
                h.div(
                  [
                    h.Class(
                      `group/msg relative rounded-lg px-3 py-2 text-md wrap-break-word text-text-primary ring-1 ring-border-secondary ring-inset ${fixture.isSelf === true ? "rounded-tr-none bg-bg-primary pr-4" : "rounded-tl-none bg-bg-secondary"}`,
                    ),
                  ],
                  [fixture.text, actions(fixture, copy, onAction, h)],
                ),
              ]),
          ...(fixture.attachment === undefined
            ? []
            : [
                h.div(
                  [
                    h.Class(
                      "group/msg relative flex gap-3 rounded-lg rounded-tl-none bg-bg-primary px-3.5 py-2.5 ring-1 ring-border-secondary",
                    ),
                  ],
                  [
                    fileIcon(h),
                    h.div(
                      [h.Class("min-w-0 flex-1")],
                      [
                        h.p(
                          [h.Class("truncate text-sm font-medium text-text-secondary")],
                          [fixture.attachment.name],
                        ),
                        h.p([h.Class("text-sm text-text-tertiary")], [fixture.attachment.size]),
                      ],
                    ),
                    actions(fixture, copy, onAction, h),
                  ],
                ),
              ]),
        ],
      ),
    ],
  );

export const messageChatMenu = <Message>(
  props: MessageChatMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const copy = copyByLocale[props.locale];
  const messages = messageChatMenuFixture(props.locale);
  const tabItems = (["recent", "groups", "archive"] as const).map((tab) => ({
    focusMessage: props.messageForTabFocus(tab),
    id: tab,
    label: copy[tab],
    selectMessage: props.messageForTabSelection(tab),
  }));
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-end bg-overlay/70 pl-6 outline-hidden md:pl-10",
              ),
              h.DataAttribute("slideout-overlay", props.id),
            ],
            [
              h.div([h.AriaHidden(true), h.Class("absolute inset-0"), h.OnClick(props.onDismiss)]),
              h.dialog(
                [
                  h.AriaLabel(copy.slideout),
                  h.Attribute("dir", "ltr"),
                  h.Class(
                    "fixed inset-y-0 !right-0 !left-auto m-0 h-full w-[calc(100%-24px)] max-w-100 overflow-hidden border-0 bg-bg-primary p-0 shadow-xl ring-1 ring-border-secondary-alt outline-hidden",
                  ),
                  h.Id(props.id),
                  h.Lang(props.locale),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.div(
                    [h.Class("relative flex size-full flex-col items-start gap-0 overflow-hidden")],
                    [
                      h.header(
                        [
                          h.Class(
                            "relative z-1 flex w-full flex-col gap-5 bg-bg-primary p-4 pt-6 shadow-[0px_1px_0px_0px] shadow-border-secondary-alt md:pr-3 md:pl-6",
                          ),
                        ],
                        [
                          h.section(
                            [h.Class("flex flex-col gap-0.5")],
                            [
                              h.h1(
                                [h.Class("text-md font-semibold text-text-primary md:text-lg")],
                                [copy.heading],
                              ),
                            ],
                          ),
                          tabs(
                            {
                              ariaLabel: copy.heading,
                              focusedId: props.focusedTab,
                              fullWidth: true,
                              id: `${props.id}-tabs`,
                              items: tabItems,
                              selectedId: props.selectedTab,
                              size: "sm",
                              type: "button-minimal",
                            },
                            h,
                          ),
                          h.button(
                            [
                              h.AriaLabel(copy.close),
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("message-chat-menu-close", ""),
                              h.OnClick(props.onDismiss),
                              h.Type("button"),
                            ],
                            [icon("close", "size-5", h)],
                          ),
                        ],
                      ),
                      h.ol(
                        [
                          h.AriaLabel(copy.conversation),
                          h.Class(
                            "flex h-full w-full flex-col gap-4 overflow-y-auto px-4 py-6 md:px-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-bg-primary",
                          ),
                        ],
                        [
                          ...messages
                            .slice(0, 4)
                            .map((fixture) =>
                              messageItem(fixture, copy, props.avatars, props.onMessageAction, h),
                            ),
                          h.li(
                            [
                              h.AriaHidden(true),
                              h.Class("my-4 flex w-full shrink-0 items-center gap-x-2"),
                            ],
                            [
                              h.div([h.Class("h-px flex-1 bg-border-secondary")]),
                              h.span(
                                [h.Class("text-sm font-medium text-text-tertiary")],
                                [copy.today],
                              ),
                              h.div([h.Class("h-px flex-1 bg-border-secondary")]),
                            ],
                          ),
                          ...messages
                            .slice(4, 6)
                            .map((fixture) =>
                              messageItem(fixture, copy, props.avatars, props.onMessageAction, h),
                            ),
                        ],
                      ),
                      h.footer(
                        [
                          h.Class(
                            "w-full p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6",
                          ),
                        ],
                        [
                          h.form(
                            [
                              h.Class("flex h-max w-90 items-center gap-3"),
                              h.OnSubmit(props.onSubmit),
                            ],
                            [
                              h.div(
                                [
                                  h.Class(
                                    "flex w-full items-center gap-2 rounded-lg bg-bg-primary px-3 py-2 text-md shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
                                  ),
                                ],
                                [
                                  h.input([
                                    h.AriaLabel(copy.message),
                                    h.Class(
                                      "min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-placeholder",
                                    ),
                                    h.Name("message"),
                                    h.OnInput(props.messageForDraft),
                                    h.Placeholder(copy.message),
                                    h.Type("text"),
                                    h.Value(props.draft),
                                  ]),
                                ],
                              ),
                              h.button(
                                [
                                  h.AriaLabel(copy.send),
                                  h.Class(
                                    "relative inline-flex cursor-pointer items-center justify-center rounded-lg bg-bg-primary p-2.5 text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                                  ),
                                  h.Type("submit"),
                                ],
                                [icon("send", "size-5", h)],
                              ),
                            ],
                          ),
                        ],
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
