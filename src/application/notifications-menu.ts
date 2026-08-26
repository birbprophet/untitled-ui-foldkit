/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The authenticated notifications menu is a fixed localized feed with optional attachment and message anatomy. */
import { blobatarDataUri } from "avatar";
import type { AvatarKind } from "avatar";
import type { Html, HtmlBuilder } from "foldkit/html";

import { activityFeed } from "./activity-feed.ts";
import type { ActivityFeedItem } from "./activity-feed.ts";

export type NotificationsMenuLocale = "en-US" | "pt-BR";

export interface NotificationsMenuItem {
  readonly action: Readonly<{ content: string; href?: string; target?: string }>;
  readonly attachment?: Readonly<{
    readonly name: string;
    readonly size: string;
    readonly type: "mp4" | "pdf" | "txt";
  }>;
  readonly avatarKind: AvatarKind;
  readonly avatarSeed: string;
  readonly date: string;
  readonly id: string;
  readonly message?: string;
  readonly unseen?: boolean;
  readonly user: Readonly<{
    readonly href: string;
    readonly name: string;
    readonly status: "online" | "offline";
  }>;
}

export interface NotificationsMenuProps<Message> {
  readonly id: string;
  readonly isOpen: boolean;
  readonly items: readonly NotificationsMenuItem[];
  readonly locale: NotificationsMenuLocale;
  readonly onDismiss: NoInfer<Message>;
}

interface LocalizedText {
  readonly en: string;
  readonly pt: string;
}

interface SourceItem {
  readonly action: Readonly<{ content: LocalizedText; target?: LocalizedText }>;
  readonly attachment?: Readonly<{
    readonly name: LocalizedText;
    readonly size: string;
    readonly type: "mp4" | "pdf" | "txt";
  }>;
  readonly avatarKind: AvatarKind;
  readonly date: LocalizedText;
  readonly id: string;
  readonly message?: LocalizedText;
  readonly name: string;
  readonly status: "online" | "offline";
  readonly unseen?: boolean;
}

const sourceItems: readonly SourceItem[] = [
  {
    action: {
      content: { en: "Added a file to", pt: "Adicionou um arquivo a" },
      target: { en: "Marketing site redesign", pt: "Redesign do site de marketing" },
    },
    attachment: {
      name: { en: "Tech requirements.pdf", pt: "Requisitos técnicos.pdf" },
      size: "720 KB",
      type: "pdf",
    },
    avatarKind: "agent",
    date: { en: "Just now", pt: "Agora" },
    id: "user-1",
    name: "Phoenix Baker",
    status: "online",
    unseen: true,
  },
  {
    action: {
      content: { en: "Was invited to the team by", pt: "Recebeu convite para a equipe de" },
      target: { en: "Alina Hester", pt: "Alina Hester" },
    },
    avatarKind: "robot",
    date: { en: "2 mins ago", pt: "Há 2 min" },
    id: "user-2",
    name: "Lana Steiner",
    status: "offline",
    unseen: true,
  },
  {
    action: {
      content: { en: "Was invited to the team by", pt: "Recebeu convite para a equipe de" },
      target: { en: "Alina Hester", pt: "Alina Hester" },
    },
    avatarKind: "agent",
    date: { en: "2 mins ago", pt: "Há 2 min" },
    id: "user-3",
    name: "Demi Wilkinson",
    status: "online",
    unseen: true,
  },
  {
    action: {
      content: { en: "Commented in", pt: "Comentou em" },
      target: { en: "Marketing site redesign", pt: "Redesign do site de marketing" },
    },
    avatarKind: "robot",
    date: { en: "3 hours ago", pt: "Há 3 horas" },
    id: "user-4",
    name: "Candice Wu",
    status: "offline",
    unseen: true,
  },
  {
    action: {
      content: { en: "Was added to", pt: "Foi adicionado a" },
      target: { en: "Marketing site redesign", pt: "Redesign do site de marketing" },
    },
    avatarKind: "robot",
    date: { en: "3 hours ago", pt: "Há 3 horas" },
    id: "user-41",
    name: "Candice Wu",
    status: "offline",
  },
  {
    action: {
      content: { en: "Added 3 labels to the project", pt: "Adicionou 3 rótulos ao projeto" },
      target: { en: "Marketing site redesign", pt: "Redesign do site de marketing" },
    },
    avatarKind: "agent",
    date: { en: "6 hours ago", pt: "Há 6 horas" },
    id: "user-5",
    name: "Natali Craig",
    status: "online",
  },
  {
    action: {
      content: { en: "Invited to the team", pt: "Convidou para a equipe" },
      target: { en: "Lana Steiner", pt: "Lana Steiner" },
    },
    avatarKind: "agent",
    date: { en: "6 hours ago", pt: "Há 6 horas" },
    id: "user-511",
    name: "Natali Craig",
    status: "online",
  },
  {
    action: {
      content: { en: "Created 7 tasks in", pt: "Criou 7 tarefas em" },
      target: { en: "Marketing site redesign", pt: "Redesign do site de marketing" },
    },
    avatarKind: "robot",
    date: { en: "11 hours ago", pt: "Há 11 horas" },
    id: "user-512",
    name: "Orlando Diggs",
    status: "online",
  },
  {
    action: {
      content: { en: "Added a file to", pt: "Adicionou um arquivo a" },
      target: { en: "Marketing site redesign", pt: "Redesign do site de marketing" },
    },
    attachment: {
      name: {
        en: "Design brief and ideas.txt",
        pt: "Briefing de design e ideias.txt",
      },
      size: "2.2 MB",
      type: "txt",
    },
    avatarKind: "agent",
    date: { en: "12 hours ago", pt: "Há 12 horas" },
    id: "user-7",
    name: "Drew Cano",
    status: "online",
  },
  {
    action: {
      content: { en: "Created the project", pt: "Criou o projeto" },
      target: { en: "Marketing site redesign", pt: "Redesign do site de marketing" },
    },
    avatarKind: "agent",
    date: { en: "12 hours ago", pt: "Há 12 horas" },
    id: "user-70",
    name: "Drew Cano",
    status: "online",
  },
  {
    action: { content: { en: "Sent you a message", pt: "Enviou uma mensagem para você" } },
    avatarKind: "robot",
    date: { en: "5:20pm 20 Jan 2027", pt: "17h20, 20 jan 2027" },
    id: "user-6",
    message: {
      en: '"We should ask Oli about this today."',
      pt: '"Devemos perguntar ao Oli sobre isso hoje."',
    },
    name: "Kate Morrison",
    status: "online",
  },
  {
    action: { content: { en: "Sent you a file", pt: "Enviou um arquivo para você" } },
    attachment: {
      name: { en: "Prototype draft 03.mp4", pt: "Rascunho do protótipo 03.mp4" },
      size: "6.6 MB",
      type: "mp4",
    },
    avatarKind: "robot",
    date: { en: "4:16pm 20 Jan 2027", pt: "16h16, 20 jan 2027" },
    id: "user-78",
    name: "Koray Okumus",
    status: "online",
  },
  {
    action: { content: { en: "Sent you a message", pt: "Enviou uma mensagem para você" } },
    avatarKind: "robot",
    date: { en: "4:16pm 20 Jan 2027", pt: "16h16, 20 jan 2027" },
    id: "user-71",
    message: {
      en: "@olivia This is starting to look really good! I'll polish it up a bit and send it.",
      pt: "@olivia Isto está ficando muito bom! Vou fazer alguns ajustes e enviar.",
    },
    name: "Koray Okumus",
    status: "online",
  },
  {
    action: {
      content: { en: "Invited to the team", pt: "Convidou para a equipe" },
      target: { en: "Alisa Hester", pt: "Alisa Hester" },
    },
    avatarKind: "agent",
    date: { en: "2 mins ago", pt: "Há 2 min" },
    id: "user-72",
    name: "Ava Wright",
    status: "online",
  },
  {
    action: {
      content: { en: "Invited to the team", pt: "Convidou para a equipe" },
      target: { en: "Ava Wright", pt: "Ava Wright" },
    },
    avatarKind: "robot",
    date: { en: "2 mins ago", pt: "Há 2 min" },
    id: "user-73",
    name: "Eve Leroy",
    status: "online",
    unseen: true,
  },
];

const localized = (text: LocalizedText, locale: NotificationsMenuLocale): string =>
  locale === "pt-BR" ? text.pt : text.en;

export const notificationsMenuFixture = (
  locale: NotificationsMenuLocale,
): readonly NotificationsMenuItem[] =>
  sourceItems.map((item) => ({
    action: {
      content: localized(item.action.content, locale),
      ...(item.action.target === undefined
        ? {}
        : { href: "#", target: localized(item.action.target, locale) }),
    },
    ...(item.attachment === undefined
      ? {}
      : {
          attachment: {
            name: localized(item.attachment.name, locale),
            size: item.attachment.size,
            type: item.attachment.type,
          },
        }),
    avatarKind: item.avatarKind,
    avatarSeed: `notifications-menu-${item.name.toLowerCase().replaceAll(" ", "-")}`,
    date: localized(item.date, locale),
    id: item.id,
    ...(item.message === undefined ? {} : { message: localized(item.message, locale) }),
    unseen: item.unseen,
    user: {
      href: "#",
      name: item.name,
      status: item.status,
    },
  }));

const copy = {
  "en-US": { close: "Close slideout menu", dialog: "Slideout menu", title: "Notifications" },
  "pt-BR": { close: "Fechar menu lateral", dialog: "Menu lateral", title: "Notificações" },
} as const;

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

const feedItem = (notification: NotificationsMenuItem): ActivityFeedItem => ({
  action: notification.action,
  attachment: notification.attachment,
  date: notification.date,
  id: notification.id,
  message: notification.message,
  unseen: notification.unseen,
  user: {
    avatarUrl: blobatarDataUri(notification.avatarSeed, {
      background: "circle",
      kind: notification.avatarKind,
      size: 128,
      title: notification.user.name,
    }),
    href: notification.user.href,
    name: notification.user.name,
    status: notification.user.status,
  },
});

export const notificationsMenu = <Message>(
  props: NotificationsMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const text = copy[props.locale];
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
                  h.AriaLabel(text.dialog),
                  h.Attribute("dir", "ltr"),
                  h.Attribute("lang", props.locale),
                  h.Class(
                    "fixed inset-y-0 right-0 left-auto m-0 h-full w-[calc(100%-24px)] max-w-100 overflow-hidden border-0 bg-bg-primary p-0 shadow-xl ring-1 ring-border-secondary-alt outline-hidden",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                  h.Style({ left: "auto" }),
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
                        [h.Class("relative z-1 flex w-full gap-0.5 px-4 pt-6 md:px-6")],
                        [
                          h.h1(
                            [h.Class("text-md font-semibold text-text-primary md:text-lg")],
                            [text.title],
                          ),
                          h.button(
                            [
                              h.AriaLabel(text.close),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("notifications-menu-close", ""),
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
                            "flex size-full flex-col gap-6 overflow-y-auto overscroll-auto px-4 pb-6 md:px-6",
                          ),
                        ],
                        [
                          h.ul(
                            [],
                            props.items.map((item, index) =>
                              h.keyed("li")(
                                item.id,
                                [],
                                [
                                  activityFeed(
                                    {
                                      connector: index !== props.items.length - 1,
                                      item: feedItem(item),
                                    },
                                    h,
                                  ),
                                ],
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
