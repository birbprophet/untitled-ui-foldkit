/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the authenticated profile-settings anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import { button } from "../base/button.ts";
import { checkbox } from "../base/controls.ts";
import { textarea } from "../base/fields.ts";
import { fileUploadDropZone } from "./file-upload-base.ts";

export type ProfileSettingsField = "introduction" | "username";

export interface ProfileSettingsModalProps<Message> {
  readonly avatarUrl: string;
  readonly consent: boolean;
  readonly copied: boolean;
  readonly id: string;
  readonly introduction: string;
  readonly isDraggingOver: boolean;
  readonly isOpen: boolean;
  readonly onCancel: NoInfer<Message>;
  readonly onConsent: NoInfer<Message>;
  readonly onCopy: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onDragState: (isDraggingOver: boolean) => NoInfer<Message>;
  readonly onFieldInput: (field: ProfileSettingsField, value: string) => NoInfer<Message>;
  readonly onPublish: NoInfer<Message>;
  readonly onUpload: (files: readonly File[]) => NoInfer<Message>;
  readonly username: string;
}

const pathIcon = <Message>(path: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5"),
      h.DataAttribute("icon", "leading"),
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
const closeIcon = <Message>(h: HtmlBuilder<Message>): Html => pathIcon("M18 6 6 18M6 6l12 12", h);
const uploadIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "m8 16 4-4m0 0 4 4m-4-4v9m8-4.257A5.5 5.5 0 0 0 16.5 7a.62.62 0 0 1-.534-.302 7.5 7.5 0 1 0-11.78 9.096",
    h,
  );
const copyIcon = <Message>(copied: boolean, h: HtmlBuilder<Message>): Html =>
  pathIcon(
    copied
      ? "M20 6 9 17l-5-5"
      : "M5 15c-.932 0-1.398 0-1.765-.152a2 2 0 0 1-1.083-1.083C2 13.398 2 12.932 2 12V5.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 2 4.08 2 5.2 2H12c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C15 3.602 15 4.068 15 5m-2.8 17h6.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 20.48 22 19.92 22 18.8v-6.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 9 19.92 9 18.8 9h-6.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C9 10.52 9 11.08 9 12.2v6.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C10.52 22 11.08 22 12.2 22Z",
    h,
  );

const requiredLabel = <Message>(label: string, inputId: string, h: HtmlBuilder<Message>): Html =>
  h.label(
    [h.Class("flex gap-0.5 text-sm font-medium text-text-secondary"), h.For(inputId)],
    [label, h.span([h.Class("text-text-brand-tertiary")], ["*"])],
  );

const usernameField = <Message>(
  props: ProfileSettingsModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const inputId = `${props.id}-username`;
  return h.div(
    [h.Class("flex w-full flex-col gap-1.5")],
    [
      requiredLabel("Username", inputId, h),
      h.div(
        [h.Class("relative flex h-max w-full flex-row justify-center rounded-lg bg-bg-primary")],
        [
          h.span(
            [
              h.Class(
                "-mr-px flex rounded-l-lg px-3 py-2 text-md text-text-tertiary shadow-xs ring-1 ring-border-primary ring-inset",
              ),
            ],
            ["siglata.com/"],
          ),
          h.div(
            [
              h.Class(
                "z-10 flex min-w-0 flex-1 items-center rounded-r-lg bg-bg-primary px-3 py-2 shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 focus-within:ring-2 focus-within:ring-border-brand",
              ),
            ],
            [
              h.input([
                h.AriaLabel("Username"),
                h.Class("min-w-0 flex-1 bg-transparent text-md text-text-primary outline-none"),
                h.Id(inputId),
                h.Name("username"),
                h.OnInput((value) => props.onFieldInput("username", value)),
                h.Required(true),
                h.Type("text"),
                h.Value(props.username),
              ]),
            ],
          ),
        ],
      ),
    ],
  );
};

export const profileSettingsModal = <Message>(
  props: ProfileSettingsModalProps<Message>,
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
            ],
            [
              h.div([h.AriaHidden(true), h.Class("absolute inset-0"), h.OnClick(props.onDismiss)]),
              h.dialog(
                [
                  h.AriaDescribedBy(descriptionId),
                  h.AriaLabelledBy(titleId),
                  h.Class(
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-max max-w-[calc(100%-32px)] overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:max-w-120 sm:rounded-2xl",
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
                        "absolute top-3 right-3 z-20 flex size-9 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 sm:top-4 sm:right-4",
                      ),
                      h.OnClick(props.onDismiss),
                      h.Type("button"),
                    ],
                    [closeIcon(h)],
                  ),
                  h.div(
                    [h.Class("flex flex-col gap-0.5 px-4 pt-5 sm:px-6 sm:pt-6")],
                    [
                      h.h2(
                        [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                        ["Complete your profile"],
                      ),
                      h.p(
                        [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                        ["Choose a username and write a brief intro."],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.form(
                    [
                      h.Class("flex flex-col gap-4 px-4 sm:px-6"),
                      h.Id(`${props.id}-form`),
                      h.OnSubmit(props.onPublish),
                    ],
                    [
                      h.div(
                        [h.Class("flex w-full items-center gap-5 md:items-start")],
                        [
                          avatar(
                            {
                              alt: "Profile photo",
                              size: "2xl",
                              src: props.avatarUrl,
                              verified: true,
                            },
                            h,
                          ),
                          h.div(
                            [h.Class("md:hidden")],
                            [
                              button(
                                {
                                  color: "secondary",
                                  iconLeadingElement: uploadIcon(h),
                                  label: "Upload photo",
                                  onPress: props.onUpload([]),
                                  size: "md",
                                },
                                h,
                              ),
                            ],
                          ),
                          h.div(
                            [h.Class("w-full max-md:hidden")],
                            [
                              fileUploadDropZone(
                                {
                                  id: `${props.id}-upload`,
                                  isDraggingOver: props.isDraggingOver,
                                  messageForDragState: props.onDragState,
                                  messageForFiles: (result) => props.onUpload(result.accepted),
                                },
                                h,
                              ),
                            ],
                          ),
                        ],
                      ),
                      usernameField(props, h),
                      textarea(
                        {
                          isRequired: true,
                          label: "Introduction",
                          name: "intro",
                          onInput: (value) => props.onFieldInput("introduction", value),
                          placeholder: "Write a brief introduction to show on your profile...",
                          requiredMarkCompact: true,
                          textAreaClassName: "min-h-31.5 md:min-h-45",
                          value: props.introduction,
                        },
                        h,
                      ),
                      h.span(
                        [h.Class("flex items-center gap-2")],
                        [
                          checkbox(
                            {
                              isSelected: props.consent,
                              name: "consent",
                              onToggle: props.onConsent,
                            },
                            h,
                          ),
                          h.span(
                            [h.Class("text-sm font-medium text-text-secondary")],
                            [
                              "I agree with the ",
                              h.a(
                                [
                                  h.Class(
                                    "rounded-xs underline underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                                  ),
                                  h.Href("#"),
                                ],
                                ["terms and conditions"],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.footer(
                    [
                      h.Class(
                        "z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 sm:flex sm:flex-row sm:items-center sm:justify-end sm:px-6 sm:pt-8 sm:pb-6",
                      ),
                    ],
                    [
                      h.div(
                        [h.Class("mr-auto flex h-10 items-center max-md:hidden")],
                        [
                          button(
                            {
                              color: "link-gray",
                              iconLeadingElement: copyIcon(props.copied, h),
                              label: props.copied ? "Copied" : "Copy link",
                              onPress: props.onCopy,
                              size: "lg",
                            },
                            h,
                          ),
                        ],
                      ),
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
                          form: `${props.id}-form`,
                          label: "Publish profile",
                          size: "md",
                          type: "submit",
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
