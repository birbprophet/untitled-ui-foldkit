/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the authenticated compose-dialog anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { buttonUtility } from "../base/button-utility.ts";
import { tagSelect } from "../base/tag-select.ts";

export interface NewMessageContact {
  readonly avatarUrl: string;
  readonly id: string;
  readonly label: string;
  readonly supportingText: string;
}

export interface NewMessageAccount {
  readonly avatarUrl: string;
  readonly id: string;
  readonly label: string;
}

export type NewMessageRecipientField = "to" | "cc";

export interface NewMessageEmptyStateModalProps<Message> {
  readonly accountMenuOpen: boolean;
  readonly accounts: readonly NewMessageAccount[];
  readonly body: string;
  readonly ccFocusedId?: string;
  readonly ccInput: string;
  readonly ccOpen: boolean;
  readonly ccSelectedIds: readonly string[];
  readonly contacts: readonly NewMessageContact[];
  readonly id: string;
  readonly isOpen: boolean;
  readonly onAccountMenuToggle: NoInfer<Message>;
  readonly onAccountSelect: (id: string) => NoInfer<Message>;
  readonly onAttach: NoInfer<Message>;
  readonly onBodyInput: (value: string) => NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onDiscard: NoInfer<Message>;
  readonly onRecipientClose: (field: NewMessageRecipientField) => NoInfer<Message>;
  readonly onRecipientFocus: (field: NewMessageRecipientField, id: string) => NoInfer<Message>;
  readonly onRecipientInput: (field: NewMessageRecipientField, value: string) => NoInfer<Message>;
  readonly onRecipientOpen: (field: NewMessageRecipientField) => NoInfer<Message>;
  readonly onRecipientRemove: (field: NewMessageRecipientField, id: string) => NoInfer<Message>;
  readonly onRecipientSelect: (field: NewMessageRecipientField, id: string) => NoInfer<Message>;
  readonly onSave: NoInfer<Message>;
  readonly onSchedule: NoInfer<Message>;
  readonly onSend: NoInfer<Message>;
  readonly onSendLater: NoInfer<Message>;
  readonly onSubjectInput: (value: string) => NoInfer<Message>;
  readonly onUseSnippet: NoInfer<Message>;
  readonly selectedAccountId: string;
  readonly subject: string;
  readonly toFocusedId?: string;
  readonly toInput: string;
  readonly toOpen: boolean;
  readonly toSelectedIds: readonly string[];
}

export const composePathIcon = <Message>(
  path: string,
  h: HtmlBuilder<Message>,
  className?: string,
): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      ...(className === undefined ? [] : [h.Class(className)]),
      h.DataAttribute("icon", ""),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(path),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

export const composeIconPaths = {
  brackets:
    "M18.57 20a2.286 2.286 0 0 0 2.287-2.286v-4.571L22 12l-1.143-1.143V6.286A2.285 2.285 0 0 0 18.57 4M5.429 4a2.285 2.285 0 0 0-2.286 2.286v4.571L2 12l1.143 1.143v4.571A2.285 2.285 0 0 0 5.429 20",
  chevronDown: "m6 9 6 6 6-6",
  chevronUp: "m18 15-6-6-6 6",
  clock: "m22.7 11.5-2 2-2-2m2.245 1.5A9 9 0 1 0 19 17.657M12 7v5l3 2",
  close: "M18 6 6 18M6 6l12 12",
  paperclip:
    "m21.152 10.9-9.015 9.015a5.25 5.25 0 0 1-7.425-7.425l9.016-9.015a3.5 3.5 0 1 1 4.95 4.95l-8.662 8.662a1.75 1.75 0 1 1-2.475-2.475l7.601-7.602",
  plus: "M12 5v14m-7-7h14",
  save: "M7 3v3.4c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437C7.76 8 8.04 8 8.6 8h6.8c.56 0 .84 0 1.054-.109a1 1 0 0 0 .437-.437C17 7.24 17 6.96 17 6.4V4m0 17v-6.4c0-.56 0-.84-.109-1.054a1 1 0 0 0-.437-.437C16.24 13 15.96 13 15.4 13H8.6c-.56 0-.84 0-1.054.109a1 1 0 0 0-.437.437C7 13.76 7 14.04 7 14.6V21M21 9.325V16.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 21 17.88 21 16.2 21H7.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C3 18.72 3 17.88 3 16.2V7.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C5.28 3 6.12 3 7.8 3h6.875c.489 0 .733 0 .963.055.204.05.4.13.579.24.201.123.374.296.72.642l3.126 3.126c.346.346.519.519.642.72.11.18.19.374.24.579.055.23.055.474.055.963Z",
  trash:
    "M16 6v-.8c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C14.48 2 13.92 2 12.8 2h-1.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C8 3.52 8 4.08 8 5.2V6m2 5.5v5m4-5v5M3 6h18m-2 0v11.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C16.72 22 15.88 22 14.2 22H9.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C5 19.72 5 18.88 5 17.2V6",
} as const;

export const composeAgent = <Message>(src: string, h: HtmlBuilder<Message>): Html =>
  h.img([h.Alt(""), h.Class("size-5 shrink-0 rounded-full object-cover"), h.Src(src)]);

const recipient = <Message>(
  field: NewMessageRecipientField,
  props: NewMessageEmptyStateModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const isTo = field === "to";
  const items = props.contacts.map((contact) => ({
    ...contact,
    onFocus: props.onRecipientFocus(field, contact.id),
    onRemove: props.onRecipientRemove(field, contact.id),
    onSelect: props.onRecipientSelect(field, contact.id),
  }));
  return h.div(
    [h.Class("flex items-center gap-1")],
    [
      h.span(
        [h.Class("w-8 shrink-0 text-sm font-semibold text-text-secondary")],
        [field.toUpperCase()],
      ),
      h.div(
        [h.Class("flex-1")],
        [
          tagSelect(
            {
              ariaLabel: field.toUpperCase(),
              focusedId: isTo ? props.toFocusedId : props.ccFocusedId,
              inputValue: isTo ? props.toInput : props.ccInput,
              isOpen: isTo ? props.toOpen : props.ccOpen,
              items,
              name: `${props.id}-${field}`,
              onClose: props.onRecipientClose(field),
              onInput: (value) => props.onRecipientInput(field, value),
              onOpen: props.onRecipientOpen(field),
              placeholder: "",
              selectedIds: isTo ? props.toSelectedIds : props.ccSelectedIds,
              showSearchIcon: false,
              size: "md",
            },
            h,
          ),
        ],
      ),
      ...(isTo
        ? []
        : [
            buttonUtility(
              {
                color: "tertiary",
                icon: (builder) =>
                  composePathIcon(
                    props.ccOpen ? composeIconPaths.chevronUp : composeIconPaths.chevronDown,
                    builder,
                  ),
                onPress: props.ccOpen ? props.onRecipientClose("cc") : props.onRecipientOpen("cc"),
                size: "xs",
                tooltip: props.ccOpen ? "Close CC contacts" : "Open CC contacts",
              },
              h,
            ),
          ]),
    ],
  );
};

export const newMessageEmptyStateModal = <Message>(
  props: NewMessageEmptyStateModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const titleId = `${props.id}-title`;
  const account = props.accounts.find((item) => item.id === props.selectedAccountId);
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
                  h.AriaLabelledBy(titleId),
                  h.Class(
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-32px)] w-max max-w-[calc(100%-32px)] overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 shadow-xl outline-hidden sm:m-auto sm:max-w-160 sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.header(
                    [h.Class("flex flex-col px-4 pt-5 sm:px-6 sm:pt-6")],
                    [
                      h.button(
                        [
                          h.AriaLabel("Close dialog"),
                          h.Autofocus(true),
                          h.Class(
                            "absolute top-3 right-3 z-20 flex size-9 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 sm:top-4 sm:right-4",
                          ),
                          h.OnClick(props.onDismiss),
                          h.Type("button"),
                        ],
                        [composePathIcon(composeIconPaths.close, h, "size-5")],
                      ),
                      h.h2(
                        [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                        ["New message"],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div(
                    [h.Class("flex flex-col gap-3 px-4 sm:px-6")],
                    [
                      recipient("to", props, h),
                      recipient("cc", props, h),
                      h.div(
                        [h.Class("flex flex-col gap-1.5")],
                        [
                          h.div([h.Class("border-t border-border-secondary")]),
                          h.input([
                            h.AriaLabel("Subject"),
                            h.Class(
                              "w-full bg-transparent py-2 text-md text-text-primary outline-hidden placeholder:text-text-placeholder",
                            ),
                            h.OnInput(props.onSubjectInput),
                            h.Placeholder("Subject"),
                            h.Type("text"),
                            h.Value(props.subject),
                          ]),
                          h.div([h.Class("border-t border-border-secondary")]),
                        ],
                      ),
                    ],
                  ),
                  h.div(
                    [h.Class("flex flex-col px-4 py-5 sm:px-6")],
                    [
                      h.textarea([
                        h.AriaLabel("Message"),
                        h.Class(
                          "h-86 w-full resize-y bg-transparent p-0 text-md text-text-primary outline-hidden placeholder:text-text-placeholder sm:h-77",
                        ),
                        h.OnInput(props.onBodyInput),
                        h.Placeholder("Say hello"),
                        h.Value(props.body),
                      ]),
                    ],
                  ),
                  h.footer(
                    [
                      h.Class(
                        "flex items-center gap-2 border-t border-border-secondary p-4 sm:px-6 sm:py-5",
                      ),
                    ],
                    [
                      ...(account === undefined
                        ? []
                        : [
                            h.div(
                              [h.Class("relative hidden sm:block")],
                              [
                                h.button(
                                  [
                                    h.AriaExpanded(props.accountMenuOpen),
                                    h.AriaHasPopup("listbox"),
                                    h.Class(
                                      "relative flex w-38 cursor-pointer items-center gap-1.5 rounded-lg bg-bg-primary-alt p-2 text-left ring-1 ring-border-secondary ring-inset outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                                    ),
                                    h.OnClick(props.onAccountMenuToggle),
                                    h.Type("button"),
                                  ],
                                  [
                                    composeAgent(account.avatarUrl, h),
                                    h.p(
                                      [h.Class("text-sm font-semibold text-text-primary")],
                                      [account.label],
                                    ),
                                    h.span(
                                      [
                                        h.Class(
                                          "absolute top-1 right-1 flex size-7 items-center justify-center rounded-md text-fg-quaternary",
                                        ),
                                      ],
                                      [
                                        composePathIcon(
                                          composeIconPaths.chevronDown,
                                          h,
                                          "size-4 shrink-0 stroke-[2.25px]",
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                                ...(props.accountMenuOpen
                                  ? [
                                      h.div(
                                        [
                                          h.AriaLabel("Switch Account"),
                                          h.Class(
                                            "absolute bottom-full left-0 z-30 mb-1 w-50 rounded-lg bg-bg-primary p-1 shadow-lg ring-1 ring-border-secondary-alt",
                                          ),
                                          h.Role("listbox"),
                                        ],
                                        [
                                          ...props.accounts.map((item) =>
                                            h.button(
                                              [
                                                h.AriaSelected(item.id === props.selectedAccountId),
                                                h.Class(
                                                  "flex w-full items-center gap-2 rounded-md p-2 text-left text-sm font-medium text-text-secondary hover:bg-bg-primary-hover",
                                                ),
                                                h.OnClick(props.onAccountSelect(item.id)),
                                                h.Role("option"),
                                                h.Type("button"),
                                              ],
                                              [composeAgent(item.avatarUrl, h), item.label],
                                            ),
                                          ),
                                          h.button(
                                            [
                                              h.Class(
                                                "flex w-full items-center gap-2 rounded-md p-2 text-left text-sm font-medium text-text-secondary hover:bg-bg-primary-hover",
                                              ),
                                              h.OnClick(props.onAccountMenuToggle),
                                              h.Role("option"),
                                              h.Type("button"),
                                            ],
                                            [
                                              composePathIcon(composeIconPaths.plus, h),
                                              "Add account",
                                            ],
                                          ),
                                        ],
                                      ),
                                    ]
                                  : []),
                              ],
                            ),
                          ]),
                      h.div(
                        [h.Class("mr-auto flex items-center gap-0.5 sm:mr-0 sm:ml-auto")],
                        [
                          buttonUtility(
                            {
                              color: "tertiary",
                              icon: (x) => composePathIcon(composeIconPaths.trash, x),
                              onPress: props.onDiscard,
                              size: "sm",
                              tooltip: "Discard",
                            },
                            h,
                          ),
                          buttonUtility(
                            {
                              color: "tertiary",
                              icon: (x) => composePathIcon(composeIconPaths.save, x),
                              onPress: props.onSave,
                              size: "sm",
                              tooltip: "Save",
                            },
                            h,
                          ),
                          h.span(
                            [h.Class("max-sm:hidden")],
                            [
                              buttonUtility(
                                {
                                  color: "tertiary",
                                  icon: (x) => composePathIcon(composeIconPaths.brackets, x),
                                  onPress: props.onUseSnippet,
                                  size: "sm",
                                  tooltip: "Use snippet",
                                },
                                h,
                              ),
                            ],
                          ),
                          buttonUtility(
                            {
                              color: "tertiary",
                              icon: (x) => composePathIcon(composeIconPaths.paperclip, x),
                              onPress: props.onAttach,
                              size: "sm",
                              tooltip: "Attach",
                            },
                            h,
                          ),
                          h.span(
                            [h.Class("max-sm:hidden")],
                            [
                              buttonUtility(
                                {
                                  color: "tertiary",
                                  icon: (x) => composePathIcon(composeIconPaths.clock, x),
                                  onPress: props.onSchedule,
                                  size: "sm",
                                  tooltip: "Schedule",
                                },
                                h,
                              ),
                            ],
                          ),
                        ],
                      ),
                      h.div(
                        [h.Class("flex items-center gap-3")],
                        [
                          button(
                            {
                              color: "secondary",
                              label: "Send later",
                              onPress: props.onSendLater,
                              size: "sm",
                            },
                            h,
                          ),
                          button(
                            { color: "primary", label: "Send", onPress: props.onSend, size: "sm" },
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
