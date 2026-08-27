/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the authenticated modal anatomy and native upload/select behavior. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { badge } from "../base/badges.ts";
import { input, textarea } from "../base/fields.ts";
import { select } from "../base/select.ts";
import { fileUploadDropZone } from "./file-upload-base.ts";
import type { FileUploadResult } from "./file-upload-base.ts";

export interface NewProjectUpload {
  readonly name: string;
  readonly previewUrl: string;
  readonly progress: number;
}

export type NewProjectModalTeamId = "ephemeral" | "leapyear" | "watchtower";

export interface NewProjectModalProps<Message> {
  readonly id: string;
  readonly isDraggingOver: boolean;
  readonly isOpen: boolean;
  readonly name: string;
  readonly onCreate: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onDragState: (isDraggingOver: boolean) => NoInfer<Message>;
  readonly onFilesSelected: (result: FileUploadResult) => NoInfer<Message>;
  readonly onNameInput: (value: string) => NoInfer<Message>;
  readonly onSaveDraft: NoInfer<Message>;
  readonly onSchedule: NoInfer<Message>;
  readonly onTagInput: (value: string) => NoInfer<Message>;
  readonly onTagSelect: (tag: string) => NoInfer<Message>;
  readonly onTeamFocus: (id: string) => NoInfer<Message>;
  readonly onTeamOpenChanged: (isOpen: boolean) => NoInfer<Message>;
  readonly onTeamSelect: (id: string) => NoInfer<Message>;
  readonly selectedTeamId: string;
  readonly tagInput: string;
  readonly teamLogos: Partial<Record<NewProjectModalTeamId, string>>;
  readonly upload?: NewProjectUpload;
}

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

const plusIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-3 stroke-[3px] text-utility-neutral-500"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("M12 5v14m-7-7h14"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const calendarIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D(
          "M21 10H3m18 2.5V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 4 17.88 4 16.2 4H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 6.28 3 7.12 3 8.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 22 6.12 22 7.8 22H12m4-20v4M8 2v4m6.5 13 2 2 4.5-4.5",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const uploadPreview = <Message>(upload: NewProjectUpload, h: HtmlBuilder<Message>): Html => {
  const remainingClip = `inset(0 0 0 ${String(upload.progress)}%)`;
  const pending = upload.progress < 100;
  return h.div(
    [h.Class("px-4 sm:px-6")],
    [
      h.div(
        [h.Class("relative aspect-[1.33] w-full overflow-hidden rounded-xl")],
        [
          h.img([h.Alt(upload.name), h.Class("size-full object-cover"), h.Src(upload.previewUrl)]),
          h.img([
            h.Alt(""),
            h.AriaHidden(true),
            h.Class(
              "absolute inset-0 size-full object-cover blur-xs transition-all duration-200 ease-linear",
            ),
            h.Src(upload.previewUrl),
            h.Style({ "clip-path": remainingClip, opacity: pending ? "1" : "0" }),
          ]),
          h.div([
            h.AriaHidden(true),
            h.Class("absolute inset-0 bg-white/70 transition-all duration-200 ease-linear"),
            h.Style({ "clip-path": remainingClip, opacity: pending ? "1" : "0" }),
          ]),
          h.p(
            [
              h.Class(
                "absolute right-4 bottom-3 text-display-2xl font-semibold text-fg-quaternary text-shadow-[0px_0px_48px_rgba(0,0,0,.1)]",
              ),
              h.Style({ opacity: pending ? "1" : "0" }),
            ],
            [`${String(upload.progress)}%`],
          ),
          h.div([h.Class("absolute inset-0 rounded-xl border border-border-secondary-alt")]),
        ],
      ),
    ],
  );
};

const suggestedTag = <Message>(label: string, message: Message, h: HtmlBuilder<Message>): Html =>
  h.button(
    [
      h.Class(
        "cursor-pointer rounded-md outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.OnClick(message),
      h.Type("button"),
    ],
    [
      badge(
        {
          adornment: "leading-icon",
          color: "gray",
          iconElement: plusIcon(h),
          label,
          size: "md",
          type: "modern",
        },
        h,
      ),
    ],
  );

export const newProjectModal = <Message>(
  props: NewProjectModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  const teams = [
    ["ephemeral", "Ephemeral"],
    ["watchtower", "Watchtower"],
    ["leapyear", "Leapyear"],
  ] as const;
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
                        "absolute top-3 right-3 z-20 flex size-9 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 sm:top-4 sm:right-4",
                      ),
                      h.OnClick(props.onDismiss),
                      h.Type("button"),
                    ],
                    [closeIcon(h)],
                  ),
                  h.div(
                    [h.Class("flex flex-col gap-0.5 px-4 pt-5 pb-5 sm:px-6 sm:pt-6")],
                    [
                      h.h2(
                        [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                        ["Create a new project"],
                      ),
                      h.p(
                        [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                        ["Upload an image to create a new project."],
                      ),
                    ],
                  ),
                  ...(props.upload === undefined
                    ? [
                        h.div(
                          [h.Class("mt-4 flex flex-col gap-4 px-4 sm:px-6")],
                          [
                            fileUploadDropZone(
                              {
                                accept: "image/*",
                                allowsMultiple: false,
                                id: `${props.id}-upload`,
                                isDraggingOver: props.isDraggingOver,
                                messageForDragState: props.onDragState,
                                messageForFiles: props.onFilesSelected,
                              },
                              h,
                            ),
                          ],
                        ),
                      ]
                    : [uploadPreview(props.upload, h)]),
                  h.div(
                    [h.Class("mt-4 flex flex-col gap-4 px-4 sm:px-6 md:mt-5")],
                    [
                      h.div(
                        [h.Class("grid grid-cols-1 gap-4 md:grid-cols-2")],
                        [
                          input(
                            {
                              isRequired: true,
                              label: "Project name",
                              name: `${props.id}-name`,
                              onInput: props.onNameInput,
                              requiredMarkCompact: true,
                              value: props.name,
                            },
                            h,
                          ),
                          select(
                            {
                              items: teams.map(([id, label]) => ({
                                avatarUrl: props.teamLogos[id],
                                id,
                                label,
                                onFocus: props.onTeamFocus(id),
                                onSelect: props.onTeamSelect(id),
                              })),
                              label: "Team",
                              name: `${props.id}-team`,
                              onOpenChanged: props.onTeamOpenChanged,
                              selectedId: props.selectedTeamId,
                            },
                            h,
                          ),
                        ],
                      ),
                      h.div(
                        [h.Class("flex flex-col gap-3")],
                        [
                          textarea(
                            {
                              isRequired: true,
                              label: "Add tags (optional)",
                              name: `${props.id}-tags`,
                              onInput: props.onTagInput,
                              placeholder: "Type to search...",
                              requiredMarkCompact: true,
                              rows: 3,
                              textAreaClassName: "h-25.5",
                              value: props.tagInput,
                            },
                            h,
                          ),
                          h.div(
                            [h.Class("flex flex-wrap gap-2")],
                            ["User interface", "Figma", "UI Design"].map((tag) =>
                              suggestedTag(tag, props.onTagSelect(tag), h),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.footer(
                    [
                      h.Class(
                        "z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 sm:flex-row sm:items-center sm:px-6 sm:pt-8 sm:pb-6",
                      ),
                    ],
                    [
                      h.div(
                        [h.Class("mr-auto max-md:hidden")],
                        [
                          button(
                            {
                              color: "link-gray",
                              label: "Save as draft",
                              onPress: props.onSaveDraft,
                              size: "md",
                            },
                            h,
                          ),
                        ],
                      ),
                      button(
                        {
                          color: "secondary",
                          iconLeadingElement: calendarIcon(h),
                          label: "Schedule",
                          onPress: props.onSchedule,
                          size: "md",
                        },
                        h,
                      ),
                      button(
                        {
                          color: "primary",
                          label: "Create project",
                          onPress: props.onCreate,
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
