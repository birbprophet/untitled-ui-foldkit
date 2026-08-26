/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled native dialog preserves the authenticated stacked team-and-invites anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import { button } from "../base/button.ts";

export interface StackedWithTeamAndInvitesMember {
  readonly avatarSeed: string;
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly username: string;
}

export interface StackedWithTeamAndInvitesFeaturedMember {
  readonly avatarSeed: string;
  readonly name: string;
}

export interface StackedWithTeamAndInvitesModalProps<Message> {
  readonly featuredMembers: readonly StackedWithTeamAndInvitesFeaturedMember[];
  readonly id: string;
  readonly isOpen: boolean;
  readonly members: readonly StackedWithTeamAndInvitesMember[];
  readonly onAddToProject: NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onMemberToggle: (memberId: string) => NoInfer<Message>;
  readonly selectedMemberIds: readonly string[];
}

const selectionMark = <Message>(selected: boolean, h: HtmlBuilder<Message>): Html =>
  h.span(
    [
      h.Class(
        `relative flex size-4 shrink-0 items-center justify-center rounded ring-1 ring-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring ${selected ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"}`,
      ),
    ],
    selected
      ? [
          h.svg(
            [
              h.AriaHidden(true),
              h.Class("pointer-events-none absolute size-3 text-fg-white"),
              h.Fill("none"),
              h.ViewBox("0 0 14 14"),
            ],
            [
              h.path([
                h.D("M11.6666 3.5 5.24992 9.91667 2.33325 7"),
                h.Stroke("currentColor"),
                h.StrokeLinecap("round"),
                h.StrokeLinejoin("round"),
                h.StrokeWidth("2"),
              ]),
            ],
          ),
        ]
      : [],
  );

const featuredAvatars = <Message>(
  members: readonly StackedWithTeamAndInvitesFeaturedMember[],
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("flex flex-row items-end justify-center -space-x-2 px-4 pt-5 sm:px-6 sm:pt-6")],
    members
      .slice(0, 3)
      .map((member, index) =>
        index === 1
          ? h.span(
              [h.Class("relative z-10 inline-flex rounded-full ring-[1.5px] ring-bg-primary")],
              [
                avatar(
                  { alt: member.name, entityKind: "agent", seed: member.avatarSeed, size: "lg" },
                  h,
                ),
              ],
            )
          : avatar(
              { alt: member.name, entityKind: "agent", seed: member.avatarSeed, size: "md" },
              h,
            ),
      ),
  );

const memberRow = <Message>(
  props: StackedWithTeamAndInvitesModalProps<Message>,
  member: StackedWithTeamAndInvitesMember,
  h: HtmlBuilder<Message>,
): Html => {
  const selected = props.selectedMemberIds.includes(member.id);
  const nameId = `${props.id}-${member.id}-name`;
  return h.div(
    [h.Class("flex items-center justify-between")],
    [
      h.div(
        [h.Class("flex min-w-0 flex-row items-center justify-center gap-3")],
        [
          h.label(
            [h.Class("relative flex cursor-pointer items-start")],
            [
              h.input([
                h.Attribute("aria-labelledby", nameId),
                h.Checked(selected),
                h.Class("peer sr-only"),
                h.Name(`${props.id}-members`),
                h.OnChange(() => props.onMemberToggle(member.id)),
                h.Type("checkbox"),
                h.Value(member.id),
              ]),
              selectionMark(selected, h),
            ],
          ),
          h.figure(
            [h.Class("group flex min-w-0 flex-1 items-center gap-2")],
            [
              avatar(
                {
                  alt: member.name,
                  border: true,
                  entityKind: "agent",
                  seed: member.avatarSeed,
                  size: "md",
                },
                h,
              ),
              h.figcaption(
                [h.Class("min-w-0 flex-1")],
                [
                  h.p(
                    [h.Class("text-sm font-semibold text-text-primary"), h.Id(nameId)],
                    [member.name],
                  ),
                  h.p([h.Class("truncate text-sm text-text-tertiary")], [member.username]),
                ],
              ),
            ],
          ),
        ],
      ),
      h.p([h.Class("shrink-0 text-xs font-medium text-text-tertiary")], [member.role]),
    ],
  );
};

export const stackedWithTeamAndInvitesModal = <Message>(
  props: StackedWithTeamAndInvitesModalProps<Message>,
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
                  featuredAvatars(props.featuredMembers, h),
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
                        ["Add your team members"],
                      ),
                      h.p(
                        [h.Class("text-center text-sm text-text-tertiary"), h.Id(descriptionId)],
                        [
                          "You've created a new project! Invite colleagues to collaborate on this project.",
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div(
                    [h.Class("flex flex-col gap-3 px-4 sm:px-6")],
                    props.members.map((member) => memberRow(props, member, h)),
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
                              label: "Add to project",
                              onPress: props.onAddToProject,
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
