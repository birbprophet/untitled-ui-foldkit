/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Placeholder is the authenticated empty composer state; the controlled native dialog keeps explicit prompt and composer anatomy. */
import type { BrandLockup } from "../internal/brand.ts";
import type { Html, HtmlBuilder } from "foldkit/html";

export type AssistantPrompt =
  | "create-image"
  | "analyze-data"
  | "make-plan"
  | "summarize-text"
  | "help-write"
  | "more";

export interface AIAssistantModalProps<Message> {
  readonly accountAvatarUrl: string;
  readonly accountName: string;
  readonly brand: BrandLockup;
  readonly id: string;
  readonly inputValue: string;
  readonly isOpen: boolean;
  readonly onAccount: NoInfer<Message>;
  readonly onAttach: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onInput: (value: string) => NoInfer<Message>;
  readonly onMicrophone: NoInfer<Message>;
  readonly onPrompt: (prompt: AssistantPrompt) => NoInfer<Message>;
  readonly onShortcuts: NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly userName: string;
}

type IconKind =
  | "analyze"
  | "attach"
  | "chevron"
  | "create"
  | "more"
  | "plan"
  | "shortcuts"
  | "summarize"
  | "write"
  | "microphone";

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

const icon = <Message>(kind: IconKind, size: string, h: HtmlBuilder<Message>): Html =>
  kind === "chevron"
    ? h.svg(
        [h.AriaHidden(true), h.Class(size), h.Fill("none"), h.ViewBox("0 0 24 24")],
        [
          h.path([
            h.D("m6 9 6 6 6-6"),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeLinejoin("round"),
            h.StrokeWidth("2"),
          ]),
        ],
      )
    : h.svg(
        [h.AriaHidden(true), h.Class(size), h.Fill("none"), h.ViewBox("0 0 24 24")],
        [
          h.path([
            h.D(iconPath[kind]),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeLinejoin("round"),
            h.StrokeWidth("2"),
          ]),
        ],
      );

const promptSpecs: readonly {
  readonly color: string;
  readonly icon: IconKind;
  readonly id: AssistantPrompt;
  readonly label: string;
}[] = [
  { color: "text-utility-green-500", icon: "create", id: "create-image", label: "Create image" },
  { color: "text-utility-blue-500", icon: "analyze", id: "analyze-data", label: "Analyze data" },
  { color: "text-utility-purple-500", icon: "plan", id: "make-plan", label: "Make a plan" },
  {
    color: "text-utility-pink-500",
    icon: "summarize",
    id: "summarize-text",
    label: "Summarize text",
  },
  { color: "text-utility-orange-500", icon: "write", id: "help-write", label: "Help me write" },
  { color: "text-utility-neutral-500", icon: "more", id: "more", label: "More" },
];

const promptButton = <Message>(
  spec: (typeof promptSpecs)[number],
  message: Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.Class(
        "cursor-pointer rounded-md outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.OnClick(message),
      h.Type("button"),
    ],
    [
      h.span(
        [
          h.Class(
            "flex size-max items-center gap-1 rounded-lg bg-bg-primary py-1 pr-2.5 pl-2 text-sm font-medium text-text-secondary shadow-xs ring-1 ring-border-primary ring-inset",
          ),
        ],
        [h.span([h.Class(spec.color)], [icon(spec.icon, "size-3 stroke-[3px]", h)]), spec.label],
      ),
    ],
  );

const utilityButton = <Message>(
  label: string,
  kind: IconKind,
  message: Message,
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
  message: Message,
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

export const aiAssistantModal = <Message>(
  props: AIAssistantModalProps<Message>,
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
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-[calc(100%-32px)] max-w-120 overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:w-full sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.div(
                    [
                      h.Class(
                        "flex flex-col items-center gap-5 px-4 py-6 text-center md:px-6 md:pt-8",
                      ),
                    ],
                    [
                      h.img([
                        h.Alt(props.brand.mark.alt),
                        h.Autofocus(true),
                        h.Class("size-10 rounded-lg shadow-lg md:size-14 md:rounded-xl"),
                        h.Src(props.brand.mark.src),
                        h.Tabindex(0),
                      ]),
                      h.div(
                        [h.Class("w-full md:max-w-xs")],
                        [
                          h.p(
                            [h.Class("text-md font-semibold text-text-quaternary md:text-lg")],
                            [`Hi ${props.userName},`],
                          ),
                          h.h2(
                            [
                              h.Class("text-md font-semibold text-text-primary md:text-lg"),
                              h.Id(titleId),
                            ],
                            ["Welcome back! How can I help?"],
                          ),
                          h.p(
                            [h.Class("mt-2 text-sm text-text-tertiary"), h.Id(descriptionId)],
                            [
                              "I'm here to help tackle your tasks. Choose from the prompts below or tell me what you need!",
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div(
                    [h.Class("flex flex-col px-4 pb-8 md:px-6")],
                    [
                      h.div(
                        [h.Class("flex flex-wrap justify-center gap-2")],
                        promptSpecs.map((spec) => promptButton(spec, props.onPrompt(spec.id), h)),
                      ),
                    ],
                  ),
                  h.div(
                    [h.Class("flex flex-col px-4 pb-4 md:px-5 md:pb-5")],
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
                                h.AriaLabel("Message"),
                                h.Class(
                                  "h-32 w-full resize-y rounded-xl bg-bg-primary px-3.5 py-3 text-md text-text-primary shadow-xs ring-1 ring-border-primary ring-inset outline-none placeholder:text-text-placeholder focus:ring-2 focus:ring-border-brand",
                                ),
                                h.Name("message"),
                                h.OnInput(props.onInput),
                                h.Placeholder("Ask me anything..."),
                                h.Value(props.inputValue),
                              ]),
                              h.div(
                                [h.Class("absolute top-2 right-2")],
                                [
                                  utilityButton(
                                    "Use microphone",
                                    "microphone",
                                    props.onMicrophone,
                                    h,
                                  ),
                                ],
                              ),
                            ],
                          ),
                          h.div(
                            [h.Class("flex w-full items-center justify-between gap-3 px-3 py-2")],
                            [
                              h.button(
                                [
                                  h.AriaLabel(`Choose account, ${props.accountName} selected`),
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
                                    h.Src(props.accountAvatarUrl),
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
                                      icon("chevron", "size-3 stroke-[3px] text-fg-quaternary", h),
                                    ],
                                  ),
                                ],
                              ),
                              h.div(
                                [h.Class("flex items-center gap-3")],
                                [
                                  linkButton("Shortcuts", "shortcuts", props.onShortcuts, h),
                                  linkButton("Attach", "attach", props.onAttach, h),
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
