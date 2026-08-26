/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Placeholder copy and the controlled native slideout preserve the authenticated assistant-intro anatomy. */
import { blobatarDataUri } from "avatar";
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";

export type AIAssistantIntroLocale = "en-US" | "pt-BR";
export type AIAssistantIntroPrompt =
  | "create-image"
  | "analyze-data"
  | "make-plan"
  | "summarize-text"
  | "help-write"
  | "more";

export interface AIAssistantIntroMenuProps<Message> {
  readonly accountName: string;
  readonly accountSeed: string;
  readonly id: string;
  readonly inputValue: string;
  readonly isOpen: boolean;
  readonly locale: AIAssistantIntroLocale;
  readonly onAccount: NoInfer<Message>;
  readonly onAttach: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onInput: (value: string) => NoInfer<Message>;
  readonly onMicrophone: NoInfer<Message>;
  readonly onPrompt: (prompt: AIAssistantIntroPrompt) => NoInfer<Message>;
  readonly onShortcuts: NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly userName: string;
}

type IconKind =
  | "analyze"
  | "attach"
  | "chevron"
  | "create"
  | "microphone"
  | "more"
  | "plan"
  | "shortcuts"
  | "summarize"
  | "write";

const iconPath: Record<Exclude<IconKind, "chevron">, string> = {
  analyze: "M3 11v10m12-10v10M9 3v18M21 3v18",
  attach:
    "m21.152 10.9-9.015 9.015a5.25 5.25 0 0 1-7.425-7.425l9.016-9.015a3.5 3.5 0 1 1 4.95 4.95l-8.662 8.662a1.75 1.75 0 1 1-2.475-2.475l7.601-7.602",
  create:
    "M4 21.817C4.603 22 5.416 22 6.8 22h10.4c1.384 0 2.197 0 2.8-.183m-16 0a2.18 2.18 0 0 1-.362-.144 3 3 0 0 1-1.311-1.311C2 19.72 2 18.88 2 17.2V6.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C4.28 2 5.12 2 6.8 2h10.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C22 4.28 22 5.12 22 6.8v10.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311 2.18 2.18 0 0 1-.362.144m-16 0c0-.809.005-1.237.077-1.597a4 4 0 0 1 3.143-3.143C7.606 17 8.07 17 9 17h6c.93 0 1.394 0 1.78.077a4 4 0 0 1 3.143 3.143c.072.36.077.788.077 1.597M16 9.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  microphone: "M20 12v1a8 8 0 1 1-16 0v-1m8 5a4 4 0 0 1-4-4V7a4 4 0 1 1 8 0v6a4 4 0 0 1-4 4Z",
  more: "M4.5 22v-5m0-10V2M2 4.5h5m-5 15h5M13 3l-1.734 4.509c-.282.733-.423 1.1-.643 1.408a3 3 0 0 1-.706.707c-.308.219-.675.36-1.408.642L4 12l4.509 1.734c.733.282 1.1.423 1.408.643.273.194.512.433.707.706.219.308.36.675.642 1.408L13 21l1.734-4.509c.282-.733.423-1.1.643-1.408.194-.273.433-.512.706-.707.308-.219.675-.36 1.408-.642L22 12l-4.509-1.734c-.733-.282-1.1-.423-1.408-.642a3 3 0 0 1-.706-.707c-.22-.308-.36-.675-.643-1.408L13 3Z",
  plan: "M13 2 4.093 12.688c-.348.418-.523.628-.525.804a.5.5 0 0 0 .185.397c.138.111.41.111.955.111H12l-1 8 8.907-10.688c.348-.418.523-.628.525-.804a.5.5 0 0 0-.185-.397c-.138-.111-.41-.111-.955-.111H12l1-8Z",
  shortcuts:
    "m14 7-4 10m-2.2 4h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 18.72 21 17.88 21 16.2V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 3 17.88 3 16.2 3H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21Z",
  summarize:
    "M14 11H8m2 4H8m8-8H8m12-.2v10.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C17.72 22 16.88 22 15.2 22H8.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C4 19.72 4 18.88 4 17.2V6.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C6.28 2 7.12 2 8.8 2h6.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C20 4.28 20 5.12 20 6.8Z",
  write:
    "m21 18-1 1.094A2.71 2.71 0 0 1 18 20c-.75 0-1.47-.326-2-.906a2.716 2.716 0 0 0-2-.904c-.75 0-1.469.325-2 .904M3 20h1.675c.489 0 .733 0 .964-.055.204-.05.399-.13.578-.24.201-.123.374-.296.72-.642L19.5 6.5a2.121 2.121 0 0 0-3-3L3.937 16.063c-.346.346-.519.519-.642.72a2 2 0 0 0-.24.578c-.055.23-.055.475-.055.965V20Z",
};

const copy = {
  "en-US": {
    account: (name: string) => `Choose account, ${name} selected`,
    attach: "Attach",
    close: "Close slideout menu",
    description:
      "I'm here to help tackle your tasks. Choose from the prompts below or tell me what you need!",
    greeting: (name: string) => `Hi ${name},`,
    message: "Message",
    microphone: "Use microphone",
    placeholder: "Ask me anything...",
    prompts: {
      "analyze-data": "Analyze data",
      "create-image": "Create image",
      "help-write": "Help me write",
      "make-plan": "Make a plan",
      more: "More",
      "summarize-text": "Summarize text",
    },
    shortcuts: "Shortcuts",
    slideout: "Slideout menu",
    title: "Welcome back! How can I help?",
  },
  "pt-BR": {
    account: (name: string) => `Escolher conta, ${name} selecionada`,
    attach: "Anexar",
    close: "Fechar menu lateral",
    description:
      "Estou aqui para ajudar com suas tarefas. Escolha uma das sugestões abaixo ou diga o que você precisa!",
    greeting: (name: string) => `Olá, ${name},`,
    message: "Mensagem",
    microphone: "Usar microfone",
    placeholder: "Pergunte o que quiser...",
    prompts: {
      "analyze-data": "Analisar dados",
      "create-image": "Criar imagem",
      "help-write": "Ajudar a escrever",
      "make-plan": "Criar um plano",
      more: "Mais",
      "summarize-text": "Resumir texto",
    },
    shortcuts: "Atalhos",
    slideout: "Menu lateral",
    title: "Boas-vindas de volta! Como posso ajudar?",
  },
} as const;

const icon = <Message>(kind: IconKind, className: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class(className), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D(kind === "chevron" ? "m6 9 6 6 6-6" : iconPath[kind]),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const promptSpecs: readonly {
  readonly color: "success" | "blue" | "purple" | "pink" | "orange" | "gray";
  readonly icon: IconKind;
  readonly iconClass: string;
  readonly id: AIAssistantIntroPrompt;
}[] = [
  {
    color: "success",
    icon: "create",
    iconClass: "text-utility-green-500",
    id: "create-image",
  },
  {
    color: "blue",
    icon: "analyze",
    iconClass: "text-utility-blue-500",
    id: "analyze-data",
  },
  {
    color: "purple",
    icon: "plan",
    iconClass: "text-utility-purple-500",
    id: "make-plan",
  },
  {
    color: "pink",
    icon: "summarize",
    iconClass: "text-utility-pink-500",
    id: "summarize-text",
  },
  {
    color: "orange",
    icon: "write",
    iconClass: "text-utility-orange-500",
    id: "help-write",
  },
  {
    color: "gray",
    icon: "more",
    iconClass: "text-utility-neutral-500",
    id: "more",
  },
];

const promptButton = <Message>(
  props: AIAssistantIntroMenuProps<Message>,
  spec: (typeof promptSpecs)[number],
  h: HtmlBuilder<Message>,
): Html => {
  const label = copy[props.locale].prompts[spec.id];
  return h.button(
    [
      h.Class(
        "cursor-pointer rounded-md outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.OnClick(props.onPrompt(spec.id)),
      h.Type("button"),
    ],
    [
      badge(
        {
          adornment: "leading-icon",
          color: spec.color,
          iconElement: h.span(
            [h.Class(spec.iconClass)],
            [icon(spec.icon, "size-3 stroke-[3px]", h)],
          ),
          label,
          size: "lg",
          type: "modern",
        },
        h,
      ),
    ],
  );
};

const xIcon = <Message>(h: HtmlBuilder<Message>): Html =>
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

const utilityButton = <Message>(
  label: string,
  kind: IconKind,
  message: NoInfer<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.AriaLabel(label),
      h.Class(
        "inline-flex h-max cursor-pointer items-center justify-center rounded-md p-1.5 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.OnClick(message),
      h.Type("button"),
    ],
    [icon(kind, "size-4", h)],
  );

const linkButton = <Message>(
  label: string,
  kind: IconKind,
  message: NoInfer<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.Class(
        "inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg text-xs font-semibold text-text-tertiary outline-focus-ring hover:text-text-tertiary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.OnClick(message),
      h.Type("button"),
    ],
    [icon(kind, "size-4", h), label],
  );

export const aiAssistantIntroMenu = <Message>(
  props: AIAssistantIntroMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const text = copy[props.locale];
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  const robotLogo = blobatarDataUri("siglata-ai-assistant-intro-logo", {
    background: "squircle",
    kind: "robot",
    size: 112,
    title: "Siglata robot logo",
  });
  const accountImage = blobatarDataUri(props.accountSeed, {
    background: "circle",
    kind: "agent",
    size: 64,
    title: `${props.accountName}, Siglata agent`,
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
              h.DataAttribute("ai-assistant-intro-overlay", props.id),
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
                  h.AriaLabel(text.slideout),
                  h.Class(
                    "fixed inset-y-0! right-0! left-auto! m-0 h-full w-[calc(100%-1.5rem)] max-w-100 overflow-hidden border-0 bg-bg-primary p-0 shadow-xl ring-1 ring-border-secondary-alt outline-hidden md:w-full",
                  ),
                  h.Id(props.id),
                  h.Lang(props.locale),
                  h.OnCancel(props.onDismiss),
                  h.Tabindex(-1),
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
                        [
                          h.Class(
                            "relative z-1 flex w-full flex-col items-center gap-5 px-4 pt-12 pb-2 text-center md:px-6 md:pt-16",
                          ),
                        ],
                        [
                          h.img([
                            h.Alt("Siglata robot logo"),
                            h.Class("size-14 rounded-xl shadow-lg"),
                            h.Src(robotLogo),
                          ]),
                          h.div(
                            [h.Class("w-full")],
                            [
                              h.p(
                                [h.Class("text-lg font-semibold text-text-quaternary")],
                                [text.greeting(props.userName)],
                              ),
                              h.h2(
                                [h.Class("text-lg font-semibold text-text-primary"), h.Id(titleId)],
                                [text.title],
                              ),
                              h.p(
                                [h.Class("mt-2 text-sm text-text-tertiary"), h.Id(descriptionId)],
                                [text.description],
                              ),
                            ],
                          ),
                          h.button(
                            [
                              h.AriaLabel(text.close),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("ai-assistant-intro-close", ""),
                              h.OnClick(props.onDismiss),
                              h.Type("button"),
                            ],
                            [xIcon(h)],
                          ),
                        ],
                      ),
                      h.main(
                        [
                          h.Class(
                            "flex size-full flex-col gap-0 overflow-y-auto overscroll-auto px-4 md:px-6",
                          ),
                        ],
                        [
                          h.div(
                            [h.Class("flex flex-wrap justify-center gap-2")],
                            promptSpecs.map((spec) => promptButton(props, spec, h)),
                          ),
                          h.div(
                            [h.Class("mt-auto flex flex-col pb-4 md:pb-5")],
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
                                        h.AriaLabel(text.message),
                                        h.Class(
                                          "h-32 w-full resize-y rounded-xl bg-bg-primary px-3.5 py-3 text-md text-text-primary shadow-xs ring-1 ring-border-primary ring-inset outline-none placeholder:text-text-placeholder focus:ring-2 focus:ring-border-brand",
                                        ),
                                        h.Name("message"),
                                        h.OnInput(props.onInput),
                                        h.Placeholder(text.placeholder),
                                        h.Value(props.inputValue),
                                      ]),
                                      h.div(
                                        [h.Class("absolute top-2 right-2")],
                                        [
                                          utilityButton(
                                            text.microphone,
                                            "microphone",
                                            props.onMicrophone,
                                            h,
                                          ),
                                        ],
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
                                          h.AriaLabel(text.account(props.accountName)),
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
                                                [props.accountName],
                                              ),
                                              icon(
                                                "chevron",
                                                "size-3 stroke-[3px] text-fg-quaternary",
                                                h,
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                      h.div(
                                        [h.Class("flex items-center gap-3")],
                                        [
                                          linkButton(
                                            text.shortcuts,
                                            "shortcuts",
                                            props.onShortcuts,
                                            h,
                                          ),
                                          linkButton(text.attach, "attach", props.onAttach, h),
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
