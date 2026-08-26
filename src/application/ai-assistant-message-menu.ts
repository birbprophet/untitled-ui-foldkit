/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Placeholder styles are part of the authenticated empty composer state; the fixed fixture and controlled native dialog preserve the upstream message-menu branches directly. */
import { blobatarDataUri } from "avatar";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import type { MessagingAction, MessagingMessage } from "./messaging.ts";
import { messaging } from "./messaging.ts";

export type AIAssistantMessageMenuLocale = "en-US" | "pt-BR";
export type AIAssistantMessageMenuDecision = "cancel" | "update";

export interface AIAssistantMessageMenuProps<Message> {
  readonly id: string;
  readonly inputValue: string;
  readonly isOpen: boolean;
  readonly locale: AIAssistantMessageMenuLocale;
  readonly onAccount: NoInfer<Message>;
  readonly onAttach: NoInfer<Message>;
  readonly onDecision: (decision: AIAssistantMessageMenuDecision) => NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onInput: (value: string) => NoInfer<Message>;
  readonly onMessageAction: (messageId: string, action: MessagingAction) => NoInfer<Message>;
  readonly onMicrophone: NoInfer<Message>;
  readonly onShortcuts: NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
}

interface Copy {
  readonly account: string;
  readonly ask: string;
  readonly attach: string;
  readonly cancel: string;
  readonly close: string;
  readonly conversation: string;
  readonly copyAction: string;
  readonly editAction: string;
  readonly generateAction: string;
  readonly downloadAction: string;
  readonly message: string;
  readonly microphone: string;
  readonly playAction: string;
  readonly recommendation: string;
  readonly replyAction: string;
  readonly request: string;
  readonly shortcuts: string;
  readonly slideout: string;
  readonly strategyDescription: string;
  readonly strategyTitle: string;
  readonly syncDescription: string;
  readonly syncTitle: string;
  readonly update: string;
  readonly updateQuestion: string;
  readonly welcome: string;
}

const copyByLocale: Record<AIAssistantMessageMenuLocale, Copy> = {
  "en-US": {
    account: "Choose account, Olivia selected",
    ask: "Ask me anything...",
    attach: "Attach",
    cancel: "Cancel",
    close: "Close",
    conversation: "Conversation",
    copyAction: "Copy",
    downloadAction: "Download",
    editAction: "Edit message",
    generateAction: "Generate with AI",
    message: "Message",
    microphone: "Use microphone",
    playAction: "Play audio message",
    recommendation: "Okay! Here’s what I recommend:",
    replyAction: "Reply",
    request: "Yes, but can we do the strategy session on Friday instead?",
    shortcuts: "Shortcuts",
    slideout: "Slideout menu",
    strategyDescription: "move to Thursday at 3 PM",
    strategyTitle: "Strategy session with Sienna",
    syncDescription: "move to 1:30 PM",
    syncTitle: "Sync with Rhea",
    update: "Yes, update",
    updateQuestion: "Shall I update your calendar and notify Sienna and the team?",
    welcome: "Welcome back! How can I help?",
  },
  "pt-BR": {
    account: "Escolher conta, Olivia selecionada",
    ask: "Pergunte o que quiser...",
    attach: "Anexar",
    cancel: "Cancelar",
    close: "Fechar",
    conversation: "Conversa",
    copyAction: "Copiar",
    downloadAction: "Baixar",
    editAction: "Editar mensagem",
    generateAction: "Gerar com IA",
    message: "Mensagem",
    microphone: "Usar microfone",
    playAction: "Reproduzir mensagem de áudio",
    recommendation: "Certo! Eis o que recomendo:",
    replyAction: "Responder",
    request: "Sim, mas podemos fazer a sessão de estratégia na sexta-feira?",
    shortcuts: "Atalhos",
    slideout: "Menu lateral",
    strategyDescription: "mover para quinta-feira às 15h",
    strategyTitle: "Sessão de estratégia com Sienna",
    syncDescription: "mover para 13h30",
    syncTitle: "Sincronização com Rhea",
    update: "Sim, atualizar",
    updateQuestion: "Devo atualizar seu calendário e avisar Sienna e a equipe?",
    welcome: "Boas-vindas de volta! Como posso ajudar?",
  },
};

const icon = <Message>(
  kind:
    | "ai"
    | "attach"
    | "chevron"
    | "close"
    | "copy"
    | "edit"
    | "microphone"
    | "reply"
    | "shortcuts",
  className: string,
  h: HtmlBuilder<Message>,
): Html => {
  const paths = {
    ai: "M4.5 22v-5m0-10V2M2 4.5h5m-5 15h5M13 3l-1.734 4.509c-.282.733-.423 1.1-.643 1.408a3 3 0 0 1-.706.707c-.308.219-.675.36-1.408.642L4 12l4.509 1.734c.733.282 1.1.423 1.408.643.273.194.512.433.707.706.219.308.36.675.642 1.408L13 21l1.734-4.509c.282-.733.423-1.1.643-1.408.194-.273.433-.512.706-.707.308-.219.675-.36 1.408-.642L22 12l-4.509-1.734c-.733-.282-1.1-.423-1.408-.642a3 3 0 0 1-.706-.707c-.22-.308-.36-.675-.643-1.408L13 3Z",
    attach:
      "m21.152 10.9-9.015 9.015a5.25 5.25 0 0 1-7.425-7.425l9.016-9.015a3.5 3.5 0 1 1 4.95 4.95l-8.662 8.662a1.75 1.75 0 1 1-2.475-2.475l7.601-7.602",
    chevron: "m6 9 6 6 6-6",
    close: "M18 6 6 18M6 6l12 12",
    copy: "M5 15c-.932 0-1.398 0-1.765-.152a2 2 0 0 1-1.083-1.083C2 13.398 2 12.932 2 12V5.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 2 4.08 2 5.2 2H12c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C15 3.602 15 4.068 15 5m-2.8 17h6.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 20.48 22 19.92 22 18.8v-6.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 9 19.92 9 18.8 9h-6.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C9 10.52 9 11.08 9 12.2v6.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C10.52 22 11.08 22 12.2 22Z",
    edit: "m21 18-1 1.094A2.71 2.71 0 0 1 18 20c-.75 0-1.47-.326-2-.906a2.716 2.716 0 0 0-2-.904c-.75 0-1.469.325-2 .904M3 20h1.675c.489 0 .733 0 .964-.055.204-.05.399-.13.578-.24.201-.123.374-.296.72-.642L19.5 6.5a2.121 2.121 0 0 0-3-3L3.937 16.063c-.346.346-.519.519-.642.72a2 2 0 0 0-.24.578c-.055.23-.055.475-.055.965V20Z",
    microphone: "M20 12v1a8 8 0 1 1-16 0v-1m8 5a4 4 0 0 1-4-4V7a4 4 0 1 1 8 0v6a4 4 0 0 1-4 4Z",
    reply:
      "M2 10s.121-.85 3.636-4.364A9 9 0 0 1 20.776 10M2 10V4m0 6h6m14 4s-.121.85-3.636 4.364A9 9 0 0 1 3.224 14M22 14v6m0-6h-6",
    shortcuts:
      "m14 7-4 10m-2.2 4h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 18.72 21 17.88 21 16.2V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 3 17.88 3 16.2 3H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21Z",
  } as const;
  return h.svg(
    [h.AriaHidden(true), h.Class(className), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D(paths[kind]),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth(kind === "chevron" ? "3" : "2"),
      ]),
    ],
  );
};

const calendarIcon = <Message>(h: HtmlBuilder<Message>): Html => {
  const paths = [
    [
      "M1.5 8.967c0-2.614 0-3.92.509-4.919a4.67 4.67 0 0 1 2.039-2.039C5.046 1.5 6.353 1.5 8.967 1.5h6.066c2.614 0 3.92 0 4.919.509a4.67 4.67 0 0 1 2.039 2.039c.509.998.509 2.305.509 4.919v6.066c0 2.614 0 3.92-.509 4.919a4.67 4.67 0 0 1-2.039 2.039c-.998.509-2.305.509-4.919.509H8.967c-2.614 0-3.92 0-4.919-.509a4.67 4.67 0 0 1-2.039-2.039C1.5 18.954 1.5 17.647 1.5 15.033V8.967Z",
      "white",
    ],
    ["M18.369 4.5H15.93v3.533H19.5V5.496s-.177-.9-1.131-.996Z", "#1967D2"],
    ["M15.932 19.484v.016l3.568-3.533h-.032l-3.536 3.517Z", "#1967D2"],
    ["M19.5 15.966v-.031l-.032.031h.032Z", "#FBBC05"],
    ["M19.5 8.033h-3.568v7.902H19.5V8.033Z", "#FBBC05"],
    ["M19.468 15.967h-3.536v3.517l3.536-3.517Z", "#EA4335"],
    ["M15.9319 15.9662H19.468L19.5 15.9346H15.9319V15.9662Z", "#EA4335"],
    ["M15.9233 19.493H15.932V19.4844L15.9233 19.493Z", "#34A853"],
    ["M7.988 15.935v3.557h7.935l.009-3.557H7.988Z", "#34A853"],
    ["M15.932 15.9664V15.9346L15.9233 19.4921L15.932 19.4834V15.9664Z", "#34A853"],
    [
      "M4.5 15.9346V18.4081C4.53197 19.2107 5.40002 19.4921 5.40002 19.4921H7.9877V15.9346H4.5Z",
      "#188038",
    ],
    ["M7.988 8.033h7.944V4.5H5.5s-.936.096-1 .995v10.44h3.488V8.033Z", "#4285F4"],
    [
      "M10.5866 14.3354C10.4049 14.3354 10.2296 14.3117 10.0609 14.2643C9.89642 14.217 9.74497 14.146 9.60649 14.0513C9.46802 13.9523 9.34469 13.8296 9.2365 13.6833C9.13265 13.537 9.05259 13.367 8.99634 13.1733L9.79473 12.8569C9.85098 13.0721 9.94619 13.2357 10.0803 13.3476C10.2145 13.4552 10.3832 13.509 10.5866 13.509C10.6775 13.509 10.7641 13.4961 10.8463 13.4703C10.9285 13.4401 10.9999 13.3992 11.0605 13.3476C11.1211 13.296 11.1687 13.2357 11.2033 13.1668C11.2422 13.0937 11.2617 13.0119 11.2617 12.9215C11.2617 12.7321 11.1903 12.5836 11.0475 12.476C10.909 12.3684 10.7165 12.3146 10.4698 12.3146H10.0868V11.5464H10.4373C10.5239 11.5464 10.6083 11.5356 10.6905 11.5141C10.7727 11.4926 10.8441 11.4603 10.9047 11.4173C10.9696 11.3699 11.0194 11.3118 11.054 11.243C11.0929 11.1698 11.1124 11.0859 11.1124 10.9912C11.1124 10.8448 11.0605 10.7265 10.9566 10.6361C10.8528 10.5414 10.7121 10.4941 10.5347 10.4941C10.3443 10.4941 10.1972 10.5457 10.0933 10.649C9.99379 10.748 9.92455 10.8599 9.8856 10.9847L9.10668 10.6684C9.14563 10.5608 9.20405 10.451 9.28194 10.3391C9.35983 10.2229 9.4572 10.1196 9.57404 10.0292C9.6952 9.93455 9.83584 9.85923 9.99595 9.80327C10.1561 9.74302 10.34 9.71289 10.5477 9.71289C10.7597 9.71289 10.9523 9.74302 11.1254 9.80327C11.3028 9.86353 11.4543 9.94746 11.5798 10.0551C11.7052 10.1584 11.8026 10.2832 11.8718 10.4295C11.9411 10.5715 11.9757 10.7265 11.9757 10.8943C11.9757 11.0235 11.9584 11.1397 11.9238 11.243C11.8935 11.3462 11.8524 11.4388 11.8004 11.5206C11.7485 11.6023 11.6879 11.6734 11.6187 11.7336C11.5538 11.7896 11.4867 11.8348 11.4175 11.8692V11.9208C11.6252 12.0026 11.7961 12.1339 11.9303 12.3146C12.0687 12.4954 12.138 12.7235 12.138 12.999C12.138 13.1927 12.1012 13.3713 12.0276 13.5348C11.9541 13.6941 11.848 13.8339 11.7096 13.9545C11.5754 14.075 11.4131 14.1675 11.2227 14.2321C11.0323 14.3009 10.8203 14.3354 10.5866 14.3354Z",
      "#4285F4",
    ],
    [
      "M13.6881 14.2321V10.8104L12.9026 11.1397L12.5911 10.423L13.8958 9.81619H14.5384V14.2321H13.6881Z",
      "#4285F4",
    ],
  ] as const;
  return h.svg(
    [h.AriaHidden(true), h.Class("size-6 shrink-0"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    paths.map(([path, fill]) => h.path([h.D(path), h.Fill(fill)])),
  );
};

const linkAction = <Message>(
  label: string,
  kind: "attach" | "shortcuts",
  message: Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.Class(
        "inline-flex cursor-pointer items-center gap-1 rounded-lg text-xs font-semibold text-text-tertiary outline-focus-ring hover:text-text-tertiary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.OnClick(message),
      h.Type("button"),
    ],
    [icon(kind, "size-4", h), label],
  );

const messageActionButton = <Message>(
  label: string,
  kind: "ai" | "copy" | "edit" | "reply",
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

const assistantActionMessage = <Message>(
  text: string,
  labels: Copy,
  props: AIAssistantMessageMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("relative flex items-start gap-3 pr-8 lg:pr-10")],
    [
      h.article(
        [h.Class("flex min-w-0 flex-1 flex-col gap-1.5")],
        [
          h.div(
            [
              h.Class(
                "group/msg relative rounded-lg rounded-tl-none bg-bg-secondary px-3 py-2 text-md wrap-break-word text-text-primary ring-1 ring-border-secondary ring-inset",
              ),
            ],
            [
              text,
              h.div(
                [
                  h.Class(
                    "absolute right-2 -bottom-5 z-10 flex gap-1.5 rounded-lg bg-bg-primary-solid px-2 py-1.5 opacity-0 shadow-xl transition duration-100 ease-linear group-hover/msg:opacity-100 group-focus-within/msg:opacity-100",
                  ),
                  h.DataAttribute("theme", "dark"),
                ],
                [
                  messageActionButton(
                    labels.generateAction,
                    "ai",
                    props.onMessageAction("message-005", "ai"),
                    h,
                  ),
                  messageActionButton(
                    labels.editAction,
                    "edit",
                    props.onMessageAction("message-005", "edit"),
                    h,
                  ),
                  messageActionButton(
                    labels.replyAction,
                    "reply",
                    props.onMessageAction("message-005", "reply"),
                    h,
                  ),
                  messageActionButton(
                    labels.copyAction,
                    "copy",
                    props.onMessageAction("message-005", "copy"),
                    h,
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );

export const aiAssistantMessageMenu = <Message>(
  props: AIAssistantMessageMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const copy = copyByLocale[props.locale];
  const message = (fixture: MessagingMessage): Html =>
    messaging(
      {
        actionLabels: {
          copy: copy.copyAction,
          download: copy.downloadAction,
          edit: copy.editAction,
          generate: copy.generateAction,
          play: copy.playAction,
          reply: copy.replyAction,
        },
        message: fixture,
        onAction: props.onMessageAction,
        showUserLabel: false,
      },
      h,
    );
  const messages = {
    recommendation: { id: "message-003", text: copy.recommendation },
    request: { id: "message-006", text: copy.request, user: { me: true } },
    welcomeAssistant: { id: "message-001", text: copy.welcome },
    welcomeSelf: { id: "message-002", text: copy.welcome, user: { me: true } },
  } satisfies Record<string, MessagingMessage>;
  const accountImage = blobatarDataUri("ai-assistant-message-menu-olivia", {
    background: "circle",
    kind: "agent",
    size: 64,
    title: "Olivia, Siglata agent",
  });
  const robotLogo = blobatarDataUri("siglata-ai-assistant-message-logo", {
    background: "circle",
    kind: "robot",
    size: 112,
    title: "Siglata robot logo",
  });
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
                  h.AriaLabel(copy.slideout),
                  h.Class(
                    "fixed inset-y-0 !right-0 !left-auto m-0 h-full w-full max-w-[calc(100%-1.5rem)] overflow-y-auto border-0 bg-transparent p-0 shadow-xl outline-hidden transition md:max-w-100",
                  ),
                  h.Id(props.id),
                  h.Lang(props.locale),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.div(
                    [
                      h.Class(
                        "relative flex size-full flex-col items-start gap-6 overflow-y-auto bg-bg-primary ring-1 ring-border-secondary-alt outline-hidden",
                      ),
                    ],
                    [
                      h.header(
                        [
                          h.Class(
                            "sticky top-0 right-0 left-0 z-1 w-full bg-bg-primary/70 px-4 pt-6 pb-8 backdrop-blur-sm md:px-6",
                          ),
                        ],
                        [
                          h.img([
                            h.Alt("Siglata robot logo"),
                            h.Class("size-14 rounded-full shadow-lg"),
                            h.Src(robotLogo),
                          ]),
                          h.button(
                            [
                              h.AriaLabel(copy.close),
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("ai-assistant-message-menu-close", ""),
                              h.OnClick(props.onDismiss),
                              h.Type("button"),
                            ],
                            [icon("close", "size-5", h)],
                          ),
                        ],
                      ),
                      h.main(
                        [
                          h.Class(
                            "flex size-auto w-full flex-col gap-0 overflow-visible overscroll-none p-0 md:px-0",
                          ),
                        ],
                        [
                          h.ol(
                            [
                              h.AriaLabel(copy.conversation),
                              h.Class(
                                "flex flex-col px-4 pb-8 md:px-6 [&>:nth-child(1)]:mt-3 [&>:nth-child(2)]:mt-6 [&>:nth-child(3)]:mt-6 [&>:nth-child(4)]:mt-3 [&>:nth-child(5)]:mt-3 [&>:nth-child(6)]:mt-6 [&>:nth-child(7)]:mt-3 [&>:nth-child(8)]:mt-6",
                              ),
                            ],
                            [
                              message(messages.welcomeAssistant),
                              message(messages.welcomeSelf),
                              message(messages.recommendation),
                              h.li(
                                [
                                  h.Class(
                                    "peer flex flex-col gap-3 rounded-lg bg-bg-primary p-3 ring-1 ring-border-secondary ring-inset",
                                  ),
                                ],
                                (
                                  [
                                    [copy.syncTitle, copy.syncDescription],
                                    [copy.strategyTitle, copy.strategyDescription],
                                  ] as const
                                ).map(([title, description]) =>
                                  h.div(
                                    [h.Class("flex gap-2")],
                                    [
                                      h.div(
                                        [
                                          h.Class(
                                            "size-6 rounded-md ring-1 ring-border-secondary ring-inset",
                                          ),
                                        ],
                                        [calendarIcon(h)],
                                      ),
                                      h.p(
                                        [h.Class("mt-0.5 text-sm text-text-tertiary")],
                                        [
                                          h.span(
                                            [
                                              h.Class(
                                                "font-semibold text-text-primary underline underline-offset-2",
                                              ),
                                            ],
                                            [title],
                                          ),
                                          ` ${description}.`,
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              h.li(
                                [h.Class("peer flex flex-col gap-3")],
                                [
                                  assistantActionMessage(copy.updateQuestion, copy, props, h),
                                  h.div(
                                    [h.Class("flex gap-3")],
                                    [
                                      button(
                                        {
                                          color: "link-gray",
                                          label: copy.cancel,
                                          onPress: props.onDecision("cancel"),
                                          size: "sm",
                                        },
                                        h,
                                      ),
                                      button(
                                        {
                                          color: "link-color",
                                          label: copy.update,
                                          onPress: props.onDecision("update"),
                                          size: "sm",
                                        },
                                        h,
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              message(messages.request),
                              message({
                                audio: { duration: "00:28" },
                                id: "message-007",
                                user: { me: true },
                              }),
                              message({ id: "typing-indicator", typing: true }),
                            ],
                          ),
                          h.div(
                            [
                              h.Class(
                                "sticky bottom-0 mt-auto flex flex-col bg-bg-primary px-4 pb-4 md:px-6 md:pb-5",
                              ),
                            ],
                            [
                              h.form(
                                [
                                  h.Class(
                                    "relative flex h-max flex-col rounded-xl bg-bg-secondary ring-1 ring-border-secondary ring-inset",
                                  ),
                                  h.OnSubmit(props.onSubmit),
                                ],
                                [
                                  h.div(
                                    [h.Class("relative flex")],
                                    [
                                      h.textarea([
                                        h.AriaLabel(copy.message),
                                        h.Class(
                                          "h-32 w-full resize-y rounded-xl bg-bg-primary px-3.5 py-3 text-md text-text-primary shadow-xs ring-1 ring-border-primary ring-inset outline-none placeholder:text-text-placeholder focus:ring-2 focus:ring-border-brand",
                                        ),
                                        h.Name("message"),
                                        h.OnInput(props.onInput),
                                        h.Placeholder(copy.ask),
                                        h.Value(props.inputValue),
                                      ]),
                                      h.button(
                                        [
                                          h.AriaLabel(copy.microphone),
                                          h.Class(
                                            "absolute top-2 right-2 inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                                          ),
                                          h.OnClick(props.onMicrophone),
                                          h.Type("button"),
                                        ],
                                        [icon("microphone", "size-4", h)],
                                      ),
                                    ],
                                  ),
                                  h.div(
                                    [
                                      h.Class(
                                        "flex w-full items-center justify-between gap-3 px-3 py-2",
                                      ),
                                    ],
                                    [
                                      h.button(
                                        [
                                          h.AriaLabel(copy.account),
                                          h.Class(
                                            "flex cursor-pointer items-center gap-1 rounded outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                                          ),
                                          h.OnClick(props.onAccount),
                                          h.Type("button"),
                                        ],
                                        [
                                          h.img([
                                            h.Alt(""),
                                            h.Class("size-4 rounded-full"),
                                            h.Src(accountImage),
                                          ]),
                                          h.span(
                                            [h.Class("flex items-center gap-0.5")],
                                            [
                                              h.span(
                                                [
                                                  h.Class(
                                                    "truncate text-xs font-semibold text-text-tertiary",
                                                  ),
                                                ],
                                                ["Olivia"],
                                              ),
                                              icon("chevron", "size-3 text-fg-quaternary", h),
                                            ],
                                          ),
                                        ],
                                      ),
                                      h.div(
                                        [h.Class("flex items-center gap-3")],
                                        [
                                          linkAction(
                                            copy.shortcuts,
                                            "shortcuts",
                                            props.onShortcuts,
                                            h,
                                          ),
                                          linkAction(copy.attach, "attach", props.onAttach, h),
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
