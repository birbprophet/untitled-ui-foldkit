/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, mps/no-length-comparison, mps/prefer-arr-match -- The controlled renderer preserves the authenticated filled compose-dialog anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { buttonUtility } from "../base/button-utility.ts";
import { tagSelect } from "../base/tag-select.ts";
import { textEditor } from "../base/text-editor.ts";
import type {
  TextEditorChange,
  TextEditorCommandRequest,
  TextEditorSelection,
} from "../internal/text-editor-runtime.ts";
import { getReadableFileSize } from "./file-upload-base.ts";
import {
  composeAgent,
  composeIconPaths,
  composePathIcon,
} from "./new-message-empty-state-modal.ts";
import type {
  NewMessageAccount,
  NewMessageContact,
  NewMessageRecipientField,
} from "./new-message-empty-state-modal.ts";

export interface NewMessageAttachment {
  readonly id: string;
  readonly name: string;
  readonly progress: number;
  readonly size: number;
}

export interface NewMessageFilledModalProps<Message> {
  readonly accountMenuOpen: boolean;
  readonly accounts: readonly NewMessageAccount[];
  readonly attachments: readonly NewMessageAttachment[];
  readonly bodyHtml: string;
  readonly bodySelection: TextEditorSelection;
  readonly bodyText: string;
  readonly ccFocusedId?: string;
  readonly ccInput: string;
  readonly ccOpen: boolean;
  readonly ccSelectedIds: readonly string[];
  readonly contacts: readonly NewMessageContact[];
  readonly id: string;
  readonly isDraggingOver: boolean;
  readonly isOpen: boolean;
  readonly onAccountMenuToggle: NoInfer<Message>;
  readonly onAccountSelect: (id: string) => NoInfer<Message>;
  readonly onAttachmentRemove: (id: string) => NoInfer<Message>;
  readonly onBodyChange: (change: TextEditorChange) => NoInfer<Message>;
  readonly onBodyCommand: (request: TextEditorCommandRequest) => NoInfer<Message>;
  readonly onBodySelectionChange: (selection: TextEditorSelection) => NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onDiscard: NoInfer<Message>;
  readonly onDragStateChange: (isDraggingOver: boolean) => NoInfer<Message>;
  readonly onFilesSelected: (files: readonly File[]) => NoInfer<Message>;
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

const attachmentIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  composePathIcon(composeIconPaths.paperclip, h, "size-4 shrink-0 text-fg-quaternary");

const closeTagIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-3"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D(composeIconPaths.close),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2.86"),
      ]),
    ],
  );

const spinner = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-4 shrink-0 animate-spin motion-reduce:animate-none"),
      h.Fill("none"),
      h.ViewBox("0 0 16 16"),
    ],
    [
      h.circle([
        h.Class("text-utility-neutral-300"),
        h.Cx("8"),
        h.Cy("8"),
        h.R("6"),
        h.Stroke("currentColor"),
        h.StrokeWidth("2"),
      ]),
      h.path([
        h.Class("text-fg-brand-primary"),
        h.D("M14 8a6 6 0 0 0-6-6"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const attachmentChip = <Message>(
  attachment: NewMessageAttachment,
  onRemove: NoInfer<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const isUploading = attachment.progress < 100;
  const loaded = getReadableFileSize(Math.floor((attachment.size * attachment.progress) / 100));
  const total = getReadableFileSize(attachment.size);
  return h.span(
    [
      h.Class(
        "flex items-center gap-1 rounded-md bg-bg-secondary px-1.5 py-1 ring-[0.5px] ring-border-secondary ring-inset",
      ),
    ],
    [
      h.span(
        [h.Class("flex items-center gap-1.5")],
        [
          attachmentIcon(h),
          h.span(
            [h.Class("text-sm font-medium whitespace-nowrap text-text-primary")],
            [attachment.name],
          ),
          ...(isUploading
            ? [
                h.span(
                  [h.Class("flex items-center gap-1")],
                  [
                    spinner(h),
                    h.span(
                      [h.Class("text-sm whitespace-nowrap text-text-quaternary")],
                      [`${loaded} of ${total}`],
                    ),
                  ],
                ),
              ]
            : []),
        ],
      ),
      h.button(
        [
          h.AriaLabel("Remove this tag"),
          h.Class(
            "flex size-4 cursor-pointer items-center justify-center rounded-[3px] p-0.5 text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2",
          ),
          h.OnClick(onRemove),
          h.Type("button"),
        ],
        [closeTagIcon(h)],
      ),
    ],
  );
};

const recipient = <Message>(
  field: NewMessageRecipientField,
  props: NewMessageFilledModalProps<Message>,
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
              useSupportingTextOnMobile: true,
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

const accountPicker = <Message>(
  props: NewMessageFilledModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html[] => {
  const account = props.accounts.find((item) => item.id === props.selectedAccountId);
  return account === undefined
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
                composeAgent(account.avatarSeed, account.label, h),
                h.p([h.Class("text-sm font-semibold text-text-primary")], [account.label]),
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
                          [composeAgent(item.avatarSeed, item.label, h), item.label],
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
                        [composePathIcon(composeIconPaths.plus, h), "Add account"],
                      ),
                    ],
                  ),
                ]
              : []),
          ],
        ),
      ];
};

const footer = <Message>(
  props: NewMessageFilledModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const fileInputId = `${props.id}-attachment-input`;
  return h.footer(
    [h.Class("flex items-center gap-2 border-t border-border-secondary p-4 sm:px-6 sm:py-5")],
    [
      ...accountPicker(props, h),
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
          h.input([
            h.AriaLabel("Attach files"),
            h.Class("sr-only"),
            h.Id(fileInputId),
            h.Multiple(true),
            h.OnFileChange((files) => props.onFilesSelected(files)),
            h.Type("file"),
          ]),
          h.label(
            [
              h.AriaLabel("Attach"),
              h.Class(
                "group/control relative inline-flex h-max cursor-pointer items-center justify-center rounded-md p-1.5 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-primary focus-visible:outline-2 focus-visible:outline-offset-2 *:data-icon:size-5 *:data-icon:shrink-0",
              ),
              h.For(fileInputId),
              h.Tabindex(0),
            ],
            [composePathIcon(composeIconPaths.paperclip, h)],
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
          button({ color: "primary", label: "Send", onPress: props.onSend, size: "sm" }, h),
        ],
      ),
    ],
  );
};

export const newMessageFilledModal = <Message>(
  props: NewMessageFilledModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const titleId = `${props.id}-title`;
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
                  h.div(
                    [
                      h.AriaLabel("Drop files to attach"),
                      h.Class(
                        `w-full outline-hidden ${props.isDraggingOver ? "ring-2 ring-border-brand" : ""}`,
                      ),
                      h.Role("button"),
                      h.Tabindex(-1),
                      h.AllowDrop(),
                      h.OnDragEnter(props.onDragStateChange(true)),
                      h.OnDragOver(props.onDragStateChange(true)),
                      h.OnDragLeave(props.onDragStateChange(false)),
                      h.OnDropFiles((files) => props.onFilesSelected(files)),
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
                            [h.Class("border-y border-border-secondary py-1.5")],
                            [
                              h.input([
                                h.AriaLabel("Subject"),
                                h.Class(
                                  "w-full bg-transparent px-0 py-2 text-md text-text-primary outline-hidden placeholder:text-text-placeholder",
                                ),
                                h.OnInput(props.onSubjectInput),
                                h.Placeholder("Subject"),
                                h.Type("text"),
                                h.Value(props.subject),
                              ]),
                            ],
                          ),
                        ],
                      ),
                      h.div(
                        [h.Class("flex flex-col gap-3 pt-5 pb-7")],
                        [
                          h.div(
                            [h.Class("flex flex-col px-4 sm:px-6")],
                            [
                              textEditor(
                                {
                                  appearance: "bare-compose",
                                  editorId: `${props.id}-body`,
                                  html: props.bodyHtml,
                                  onChange: props.onBodyChange,
                                  onCommand: props.onBodyCommand,
                                  onSelectionChange: props.onBodySelectionChange,
                                  placeholder: "Say hello",
                                  selection: props.bodySelection,
                                  text: props.bodyText,
                                },
                                h,
                              ),
                            ],
                          ),
                          ...(props.attachments.length === 0
                            ? []
                            : [
                                h.div(
                                  [
                                    h.Class(
                                      "flex items-center gap-2 overflow-x-auto px-4 sm:flex-wrap sm:px-6",
                                    ),
                                  ],
                                  props.attachments.map((attachment) =>
                                    attachmentChip(
                                      attachment,
                                      props.onAttachmentRemove(attachment.id),
                                      h,
                                    ),
                                  ),
                                ),
                              ]),
                        ],
                      ),
                      footer(props, h),
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
