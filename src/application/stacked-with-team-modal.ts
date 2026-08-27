/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- The controlled native dialog preserves the authenticated stacked-with-team anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import { button } from "../base/button.ts";

export interface StackedWithTeamMember {
  readonly avatarUrl: string;
  readonly name: string;
}

export interface StackedWithTeamModalProps<Message> {
  readonly id: string;
  readonly isOpen: boolean;
  readonly onCancel: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onGetStarted: NoInfer<Message>;
  readonly teamMembers: readonly StackedWithTeamMember[];
}

const teamAvatars = <Message>(
  members: readonly StackedWithTeamMember[],
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("flex flex-row items-end justify-center -space-x-2 px-4 pt-5 sm:px-6 sm:pt-6")],
    members
      .slice(0, 3)
      .map((member, index) =>
        index === 1
          ? h.div(
              [h.Class("z-10 inline-flex rounded-full ring-[1.5px] ring-bg-primary")],
              [avatar({ alt: member.name, size: "lg", src: member.avatarUrl }, h)],
            )
          : avatar({ alt: member.name, size: "md", src: member.avatarUrl }, h),
      ),
  );

export const stackedWithTeamModal = <Message>(
  props: StackedWithTeamModalProps<Message>,
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
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-[calc(100%-32px)] max-w-100 overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:w-full sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  teamAvatars(props.teamMembers, h),
                  h.div(
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
                        ["You've been added to the team!"],
                      ),
                      h.p(
                        [h.Class("text-center text-sm text-text-tertiary"), h.Id(descriptionId)],
                        [
                          "Thanks for accepting the invite. You've now been added to the team as an editor.",
                        ],
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
                              label: "Cancel",
                              onPress: props.onCancel,
                              size: "md",
                            },
                            h,
                          ),
                          button(
                            {
                              color: "primary",
                              label: "Get started",
                              onPress: props.onGetStarted,
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
