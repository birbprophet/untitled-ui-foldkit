/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The upstream fixture includes its Lorem description; the authenticated menu is a fixed composition of shared tabs and activity-feed anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { activityFeed } from "./activity-feed.ts";
import type { ActivityFeedItem } from "./activity-feed.ts";
import { tabs } from "./tabs.ts";

export type MessagesMenuLocale = "en-US" | "pt-BR";
export type MessagesMenuTabId = "archive" | "groups" | "recent";

export type MessagesMenuPersonKey =
  | "@andi"
  | "@ava"
  | "@candice"
  | "@demi"
  | "@drew"
  | "@eve"
  | "@joshua"
  | "@kate"
  | "@koray"
  | "@lana"
  | "@natali"
  | "@orlando"
  | "@phoenix"
  | "@rene"
  | "@zahir";

export interface MessagesMenuMessage {
  readonly attachment?: Readonly<{
    readonly name: string;
    readonly size: string;
    readonly type: "jpg" | "pdf";
  }>;
  readonly avatarUrl: string;
  readonly date: string;
  readonly id: string;
  readonly message?: string;
  readonly unseen?: boolean;
  readonly user: Readonly<{
    readonly href: string;
    readonly name: string;
    readonly status: "online" | "offline";
    readonly username: string;
  }>;
}

export interface MessagesMenuProps<Message> {
  readonly focusedTabId?: MessagesMenuTabId;
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale: MessagesMenuLocale;
  readonly messages: readonly MessagesMenuMessage[];
  readonly onDismiss: NoInfer<Message>;
  readonly onTabFocus: (tabId: MessagesMenuTabId) => NoInfer<Message>;
  readonly onTabSelect: (tabId: MessagesMenuTabId) => NoInfer<Message>;
  readonly selectedTabId: MessagesMenuTabId;
}

const copy = {
  "en-US": {
    archive: "Archive",
    close: "Close slideout menu",
    description: "Lorem ipsum dolor sit amet.",
    dialog: "Slideout menu",
    groups: "Groups",
    messages: "Messages",
    recent: "Recent",
    tabs: "Message views",
  },
  "pt-BR": {
    archive: "Arquivo",
    close: "Fechar menu lateral",
    description: "Lorem ipsum dolor sit amet.",
    dialog: "Menu lateral",
    groups: "Grupos",
    messages: "Mensagens",
    recent: "Recentes",
    tabs: "Visualizações de mensagens",
  },
} as const;

interface LocalizedMessage {
  readonly attachment?: Readonly<{
    readonly en: string;
    readonly pt: string;
    readonly size: string;
    readonly type: "jpg" | "pdf";
  }>;
  readonly date: Readonly<{ readonly en: string; readonly pt: string }>;
  readonly id: string;
  readonly message?: Readonly<{ readonly en: string; readonly pt: string }>;
  readonly name: string;
  readonly status: "online" | "offline";
  readonly unseen?: boolean;
  readonly username: MessagesMenuPersonKey;
}

const sourceMessages: readonly LocalizedMessage[] = [
  {
    date: { en: "Just now", pt: "Agora" },
    id: "message-001",
    message: { en: "Looks good!", pt: "Parece ótimo!" },
    name: "Phoenix Baker",
    status: "online",
    unseen: true,
    username: "@phoenix",
  },
  {
    date: { en: "2 mins ago", pt: "Há 2 min" },
    id: "message-002",
    message: { en: "Thanks so much, happy with that.", pt: "Muito obrigada, ficou ótimo." },
    name: "Lana Steiner",
    status: "offline",
    unseen: true,
    username: "@lana",
  },
  {
    date: { en: "2 mins ago", pt: "Há 2 min" },
    id: "message-003",
    message: { en: "Got you a coffee", pt: "Trouxe um café para você" },
    name: "Demi Wilkinson",
    status: "online",
    unseen: true,
    username: "@demi",
  },
  {
    date: { en: "3 hours ago", pt: "Há 3 horas" },
    id: "message-004",
    message: { en: "Great to see you again!", pt: "Que bom ver você de novo!" },
    name: "Candice Wu",
    status: "offline",
    username: "@candice",
  },
  {
    date: { en: "6 hours ago", pt: "Há 6 horas" },
    id: "message-005",
    message: {
      en: "We should ask Oli about this...",
      pt: "Devemos perguntar ao Oli sobre isso...",
    },
    name: "Natali Craig",
    status: "online",
    username: "@natali",
  },
  {
    date: { en: "12 hours ago", pt: "Há 12 horas" },
    id: "message-006",
    message: { en: "Okay, see you then.", pt: "Certo, vejo você lá." },
    name: "Drew Cano",
    status: "online",
    username: "@drew",
  },
  {
    attachment: {
      en: "Datasheet_draft_02.pdf",
      pt: "Ficha_tecnica_rascunho_02.pdf",
      size: "720 KB",
      type: "pdf",
    },
    date: { en: "3:42pm 20 Jan 2027", pt: "15h42, 20 jan 2027" },
    id: "message-007",
    name: "Orlando Diggs",
    status: "online",
    username: "@orlando",
  },
  {
    date: { en: "3:42pm 20 Jan 2027", pt: "15h42, 20 jan 2027" },
    id: "message-008",
    message: {
      en: "We should ask Oli about this...",
      pt: "Devemos perguntar ao Oli sobre isso...",
    },
    name: "Andi Lane",
    status: "online",
    username: "@andi",
  },
  {
    date: { en: "2:12pm 20 Jan 2027", pt: "14h12, 20 jan 2027" },
    id: "message-009",
    message: { en: "That sounds like a good plan!", pt: "Parece um bom plano!" },
    name: "Kate Morrison",
    status: "online",
    username: "@kate",
  },
  {
    date: { en: "12:10pm 20 Jan 2027", pt: "12h10, 20 jan 2027" },
    id: "message-010",
    message: { en: "Yep! That checks out.", pt: "Sim! Está tudo certo." },
    name: "Koray Okumus",
    status: "online",
    username: "@koray",
  },
  {
    date: { en: "11:38am 20 Jan 2027", pt: "11h38, 20 jan 2027" },
    id: "message-011",
    message: {
      en: "We should ask Oli about this today.",
      pt: "Devemos perguntar ao Oli sobre isso hoje.",
    },
    name: "Ava Wright",
    status: "online",
    username: "@ava",
  },
  {
    attachment: {
      en: "Design screenshot.jpg",
      pt: "Captura de tela do design.jpg",
      size: "720 KB",
      type: "jpg",
    },
    date: { en: "11:30am 20 Jan 2027", pt: "11h30, 20 jan 2027" },
    id: "message-012",
    name: "Eve Leroy",
    status: "online",
    username: "@eve",
  },
  {
    date: { en: "10:02am 20 Jan 2027", pt: "10h02, 20 jan 2027" },
    id: "message-013",
    message: { en: "Thanks for helping out with that!", pt: "Obrigada por ajudar com isso!" },
    name: "Zahir Mays",
    status: "online",
    username: "@zahir",
  },
  {
    date: { en: "9:40am 20 Jan 2027", pt: "9h40, 20 jan 2027" },
    id: "message-014",
    message: {
      en: "Hey I've sent everything off now. All done.",
      pt: "Enviei tudo agora. Está concluído.",
    },
    name: "Joshua Wilson",
    status: "online",
    username: "@joshua",
  },
  {
    date: { en: "9:24am 20 Jan 2027", pt: "9h24, 20 jan 2027" },
    id: "message-015",
    message: {
      en: "Hey @olivia—just wanted to say thanks for your help on this. Really buried under!",
      pt: "Olá, @olivia. Queria agradecer pela ajuda. Eu estava realmente sobrecarregada!",
    },
    name: "Rene Wells",
    status: "online",
    username: "@rene",
  },
];

export const messagesMenuFixture = (
  locale: MessagesMenuLocale,
  avatars: Readonly<Record<MessagesMenuPersonKey, string>>,
): readonly MessagesMenuMessage[] =>
  sourceMessages.map((item) => ({
    ...(item.attachment === undefined
      ? {}
      : {
          attachment: {
            name: locale === "pt-BR" ? item.attachment.pt : item.attachment.en,
            size: item.attachment.size,
            type: item.attachment.type,
          },
        }),
    avatarUrl: avatars[item.username],
    date: locale === "pt-BR" ? item.date.pt : item.date.en,
    id: item.id,
    ...(item.message === undefined
      ? {}
      : { message: locale === "pt-BR" ? item.message.pt : item.message.en }),
    unseen: item.unseen,
    user: {
      href: "#",
      name: item.name,
      status: item.status,
      username: item.username,
    },
  }));

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

const feedItem = (message: MessagesMenuMessage): ActivityFeedItem => ({
  attachment: message.attachment,
  date: message.date,
  id: message.id,
  message: message.message,
  unseen: message.unseen,
  user: {
    avatarUrl: message.avatarUrl,
    href: message.user.href,
    name: message.user.name,
    status: message.user.status,
    username: message.user.username,
  },
});

export const messagesMenu = <Message>(
  props: MessagesMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const text = copy[props.locale];
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  const tabLabels: Record<MessagesMenuTabId, string> = {
    archive: text.archive,
    groups: text.groups,
    recent: text.recent,
  };
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
              h.button([
                h.AriaHidden(true),
                h.Class("fixed inset-0 cursor-default border-0 bg-transparent p-0"),
                h.OnClick(props.onDismiss),
                h.Tabindex(-1),
                h.Type("button"),
              ]),
              h.dialog(
                [
                  h.AriaDescribedBy(descriptionId),
                  h.AriaLabel(text.dialog),
                  h.Attribute("dir", "ltr"),
                  h.Attribute("lang", props.locale),
                  h.Class(
                    "fixed inset-y-0 !right-0 !left-auto m-0 h-full w-[calc(100%-24px)] max-w-100 overflow-hidden border-0 bg-bg-primary p-0 shadow-xl ring-1 ring-border-secondary-alt outline-hidden",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.div(
                    [h.Class("relative flex size-full flex-col items-start gap-0 overflow-y-auto")],
                    [
                      h.header(
                        [
                          h.Class(
                            "relative z-1 flex w-full flex-col gap-5 p-4 pt-6 shadow-[0px_1px_0px_0px] shadow-border-secondary-alt md:pr-3 md:pl-6",
                          ),
                        ],
                        [
                          h.section(
                            [h.Class("flex flex-col gap-0.5")],
                            [
                              h.h1(
                                [
                                  h.Class("text-md font-semibold text-text-primary md:text-lg"),
                                  h.Id(titleId),
                                ],
                                [text.messages],
                              ),
                              h.p(
                                [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                                [text.description],
                              ),
                            ],
                          ),
                          tabs(
                            {
                              ariaLabel: text.tabs,
                              focusedId: props.focusedTabId,
                              fullWidth: true,
                              id: `${props.id}-tabs`,
                              items: (["recent", "groups", "archive"] as const).map((tabId) => ({
                                focusMessage: props.onTabFocus(tabId),
                                id: tabId,
                                label: tabLabels[tabId],
                                selectMessage: props.onTabSelect(tabId),
                              })),
                              selectedId: props.selectedTabId,
                              size: "sm",
                              type: "button-minimal",
                            },
                            h,
                          ),
                          h.button(
                            [
                              h.AriaLabel(text.close),
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("messages-menu-close", ""),
                              h.OnClick(props.onDismiss),
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
                        [
                          h.ol(
                            [
                              h.AriaLabel(text.messages),
                              h.Class("flex flex-col gap-4 divide-y divide-border-secondary py-6"),
                            ],
                            props.messages.map((message) =>
                              h.keyed("li")(
                                message.id,
                                [h.Class("pb-4 last-of-type:pb-0")],
                                [activityFeed({ connector: false, item: feedItem(message) }, h)],
                              ),
                            ),
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
