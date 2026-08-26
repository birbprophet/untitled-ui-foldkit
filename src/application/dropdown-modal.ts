/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- The controlled dialog preserves the authenticated dropdown modal anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { select } from "../base/select.ts";

export interface DropdownModalProps<Message> {
  readonly id: string;
  readonly isOpen: boolean;
  readonly onCancel: NoInfer<Message>;
  readonly onConfirm: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onFocusPerson: (id: string) => NoInfer<Message>;
  readonly onSelectOpenChanged: (isOpen: boolean) => NoInfer<Message>;
  readonly onSelectPerson: (id: string) => NoInfer<Message>;
  readonly selectedPersonId: string;
}

const people = [
  { id: "@phoenix", label: "Phoenix Baker" },
  { id: "@olivia", label: "Olivia Rhye" },
  { id: "@lana", label: "Lana Steiner" },
  { id: "@demi", label: "Demi Wilkinson" },
  { id: "@candice", label: "Candice Wu" },
  { id: "@natali", label: "Natali Craig" },
  { id: "@abraham", label: "Abraham Baker" },
  { id: "@adem", label: "Adem Lane" },
  { id: "@jackson", label: "Jackson Reed" },
  { id: "@jessie", label: "Jessie Meyton" },
] as const;

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("M18 6 6 18M6 6l12 12"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const checkCircleIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("z-1 size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D(
          "m8 12 2.667 2.667L16 9.333M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const userIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 20 20"),
    ],
    [
      h.path([
        h.D(
          "M16.667 17.5c0-2.761-2.985-5-6.667-5s-6.667 2.239-6.667 5M10 10a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

export const dropdownModal = <Message>(
  props: DropdownModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  const personItems = people.map((person) => ({
    iconElement: userIcon(h),
    id: person.id,
    label: person.label,
    onFocus: props.onFocusPerson(person.id),
    onSelect: props.onSelectPerson(person.id),
  }));
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
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-max max-w-[calc(100%-32px)] overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:max-w-100 sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.button(
                    [
                      h.AriaLabel("Close dialog"),
                      h.Autofocus(true),
                      h.Class(
                        "absolute top-3 right-3 z-20 flex size-9 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 sm:top-4 sm:right-4",
                      ),
                      h.OnClick(props.onDismiss),
                      h.Type("button"),
                    ],
                    [closeIcon(h)],
                  ),
                  h.div(
                    [h.Class("flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6")],
                    [
                      h.div(
                        [
                          h.Class(
                            "relative flex size-10 w-max items-center justify-center rounded-lg bg-bg-primary text-fg-success-primary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
                          ),
                        ],
                        [checkCircleIcon(h)],
                      ),
                      h.div(
                        [h.Class("z-10 flex flex-col gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            ["Blog post published"],
                          ),
                          h.p(
                            [
                              h.Class("hidden text-sm text-text-tertiary sm:flex"),
                              h.Id(descriptionId),
                            ],
                            [
                              "This blog post has been published. Team members will be able to edit this post and republish changes.",
                            ],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary sm:hidden")],
                            [
                              "This blog post has been published. Team members will be able to edit this post.",
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div(
                    [h.Class("flex flex-col px-4 sm:px-6")],
                    [
                      select(
                        {
                          items: personItems,
                          label: "Team member",
                          name: `${props.id}-team-member`,
                          onOpenChanged: props.onSelectOpenChanged,
                          placeholder: "Select team member",
                          selectedId: props.selectedPersonId,
                          size: "md",
                        },
                        h,
                      ),
                    ],
                  ),
                  h.footer(
                    [
                      h.Class(
                        "z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pt-8 sm:pb-6",
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
                          label: "Confirm",
                          onPress: props.onConfirm,
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
        ]
      : [],
  );
};
