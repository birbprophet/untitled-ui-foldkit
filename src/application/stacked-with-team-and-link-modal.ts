/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the authenticated team-and-link dialog anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import { button } from "../base/button.ts";
import { input } from "../base/fields.ts";

export type StackedWithTeamAndLinkModalLocale = "en-US" | "pt-BR";

export interface StackedWithTeamAndLinkMember {
  readonly avatarUrl: string;
  readonly name: string;
}

export interface StackedWithTeamAndLinkModalProps<Message> {
  readonly copied: boolean;
  readonly id: string;
  readonly isOpen: boolean;
  readonly link: string;
  readonly locale: StackedWithTeamAndLinkModalLocale;
  readonly members: readonly StackedWithTeamAndLinkMember[];
  readonly onCancel: NoInfer<Message>;
  readonly onContinue: NoInfer<Message>;
  readonly onCopy: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onLinkInput: (value: string) => NoInfer<Message>;
}

const copy = {
  "en-US": {
    cancel: "Cancel",
    continue: "Continue",
    copyLink: "Copy link",
    description: "You've created a new project! Invite colleagues to collaborate on this project.",
    linkCopied: "Link copied",
    shareLink: "Share link",
    title: "Invite your team",
  },
  "pt-BR": {
    cancel: "Cancelar",
    continue: "Continuar",
    copyLink: "Copiar link",
    description: "Você criou um novo projeto! Convide colegas para colaborar neste projeto.",
    linkCopied: "Link copiado",
    shareLink: "Compartilhar link",
    title: "Convide sua equipe",
  },
} as const;

const lineIcon = <Message>(kind: "check" | "copy", h: HtmlBuilder<Message>): Html => {
  const paths = {
    check: "M20 6 9 17l-5-5",
    copy: "M5 15c-.932 0-1.398 0-1.765-.152a2 2 0 0 1-1.083-1.083C2 13.398 2 12.932 2 12V5.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 2 4.08 2 5.2 2H12c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C15 3.602 15 4.068 15 5m-2.8 17h6.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 20.48 22 19.92 22 18.8v-6.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 9 19.92 9 18.8 9h-6.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C9 10.52 9 11.08 9 12.2v6.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C10.52 22 11.08 22 12.2 22Z",
  } as const;
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0"),
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

export const stackedWithTeamAndLinkModal = <Message>(
  props: StackedWithTeamAndLinkModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const text = copy[props.locale];
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
                  h.div(
                    [
                      h.Class(
                        "flex flex-row items-end justify-center -space-x-2 px-4 pt-5 sm:px-6 sm:pt-6",
                      ),
                    ],
                    props.members.slice(0, 3).map((member, index) =>
                      index === 1
                        ? h.div(
                            [
                              h.Class(
                                "relative z-10 inline-flex rounded-full ring-[1.5px] ring-bg-primary",
                              ),
                            ],
                            [
                              avatar(
                                {
                                  alt: member.name,
                                  size: "lg",
                                  src: member.avatarUrl,
                                },
                                h,
                              ),
                            ],
                          )
                        : avatar(
                            {
                              alt: member.name,
                              size: "md",
                              src: member.avatarUrl,
                            },
                            h,
                          ),
                    ),
                  ),
                  h.header(
                    [
                      h.Class(
                        "z-10 flex flex-col items-center justify-center gap-0.5 px-4 pt-4 sm:px-6",
                      ),
                    ],
                    [
                      h.h2(
                        [
                          h.Class("text-center text-md font-semibold text-text-primary"),
                          h.Id(titleId),
                        ],
                        [text.title],
                      ),
                      h.p(
                        [h.Class("text-center text-sm text-text-tertiary"), h.Id(descriptionId)],
                        [text.description],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div(
                    [h.Class("flex flex-row items-end justify-end gap-1 px-4 sm:px-6")],
                    [
                      input(
                        {
                          inputClassName: "py-2.5",
                          isReadOnly: true,
                          label: text.shareLink,
                          name: `${props.id}-invite-link`,
                          onInput: props.onLinkInput,
                          size: "md",
                          value: props.link,
                        },
                        h,
                      ),
                      h.button(
                        [
                          h.AriaLabel(props.copied ? text.linkCopied : text.copyLink),
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
                  h.div(
                    [h.Class("pt-6 sm:pt-8")],
                    [
                      h.footer(
                        [
                          h.Class(
                            "z-10 flex flex-1 flex-col-reverse gap-3 border-t border-border-secondary p-4 *:grow sm:grid sm:grid-cols-2 sm:p-6",
                          ),
                        ],
                        [
                          button(
                            {
                              color: "secondary",
                              label: text.cancel,
                              onPress: props.onCancel,
                              size: "md",
                            },
                            h,
                          ),
                          button(
                            {
                              color: "primary",
                              label: text.continue,
                              onPress: props.onContinue,
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
            ],
          ),
        ]
      : [],
  );
};
