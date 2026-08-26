/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity -- The controlled renderer preserves the authenticated slideout and upload-state anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export type FileUploadMenuLocale = "en-US" | "pt-BR";
export type FileUploadMenuStatus = "complete" | "failed" | "uploading";

export interface FileUploadMenuFile<Message> {
  readonly id: string;
  readonly name: string;
  readonly onDelete: NoInfer<Message>;
  readonly onRetry: NoInfer<Message>;
  readonly progress: number;
  readonly size: number;
  readonly status: FileUploadMenuStatus;
  readonly type: string;
}

export interface FileUploadMenuProps<Message> {
  readonly files: readonly FileUploadMenuFile<Message>[];
  readonly id: string;
  readonly isDraggingOver: boolean;
  readonly isInvalid: boolean;
  readonly isOpen: boolean;
  readonly locale: FileUploadMenuLocale;
  readonly onAttach: NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onDragState: (isDraggingOver: boolean) => NoInfer<Message>;
  readonly onFilesSelected: (files: readonly File[]) => NoInfer<Message>;
}

const copy = {
  "en-US": {
    attach: "Attach to project",
    cancel: "Cancel",
    click: "Click to upload",
    clickAccessible: "Click to upload and attach files",
    close: "Close",
    delete: "Delete",
    description: "Upload and attach files to this project.",
    drag: "or drag and drop",
    failed: "Upload failed, please try again",
    hint: "SVG, PNG, JPG or GIF (max. 800x400px)",
    mobileAttach: "and attach files",
    retry: "Try again",
    title: "Upload and attach files",
  },
  "pt-BR": {
    attach: "Anexar ao projeto",
    cancel: "Cancelar",
    click: "Clique para carregar",
    clickAccessible: "Clique para carregar e anexar arquivos",
    close: "Fechar",
    delete: "Excluir",
    description: "Carregue e anexe arquivos a este projeto.",
    drag: "ou arraste e solte",
    failed: "Falha no carregamento. Tente novamente",
    hint: "SVG, PNG, JPG ou GIF (máx. 800 × 400 px)",
    mobileAttach: "e anexar arquivos",
    retry: "Tentar novamente",
    title: "Carregar e anexar arquivos",
  },
} as const;

const readableFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return "0 KB";
  }
  const suffixes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${String(Math.floor(bytes / 1024 ** index))} ${suffixes[index] ?? "YB"}`;
};

const pathIcon = <Message>(path: string, className: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class(className), h.Fill("none"), h.ViewBox("0 0 24 24")],
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

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon("M18 6 6 18M6 6l12 12", "size-5 shrink-0 transition-inherit-all", h);
const trashIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M16 6v-.8c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C14.48 2 13.92 2 12.8 2h-1.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C8 3.52 8 4.08 8 5.2V6m2 5.5v5m4-5v5M3 6h18m-2 0v11.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C16.72 22 15.88 22 14.2 22H9.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C5 19.72 5 18.88 5 17.2V6",
    "size-4",
    h,
  );
const uploadIcon = <Message>(className: string, h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "m8 16 4-4m0 0 4 4m-4-4v9m8-4.257A5.5 5.5 0 0 0 16.5 7a.62.62 0 0 1-.534-.302 7.5 7.5 0 1 0-11.78 9.096",
    className,
    h,
  );

const fileLabels: Readonly<Record<string, Readonly<{ color: string; path: string }>>> = {
  fig: {
    color: "#7F56D9",
    path: "M13.252 32v-6.546h4.334v1.142h-2.95v1.56h2.662v1.14h-2.662V32zm6.649-6.546V32h-1.384v-6.546zm5.478 2.116a1.4 1.4 0 0 0-.188-.412 1.27 1.27 0 0 0-.694-.502 1.7 1.7 0 0 0-.489-.067q-.501 0-.882.25a1.64 1.64 0 0 0-.588.725q-.21.472-.21 1.157 0 .684.207 1.163.207.48.588.732.38.25.898.25.47 0 .802-.167.335-.169.512-.476.178-.306.178-.726l.282.042h-1.688v-1.042h2.74v.825q0 .863-.365 1.483a2.5 2.5 0 0 1-1.004.952q-.64.333-1.463.332-.92 0-1.618-.405a2.8 2.8 0 0 1-1.086-1.16q-.387-.755-.387-1.79 0-.796.23-1.42a3 3 0 0 1 .652-1.06q.42-.434.975-.662.555-.227 1.205-.227.556 0 1.035.163.48.16.85.454.375.295.61.7.238.402.305.888z",
  },
  mp4: {
    color: "#155EEF",
    path: "M10.488 25.455h1.707l1.802 4.397h.077l1.802-4.398h1.707V32h-1.342v-4.26h-.055l-1.694 4.228h-.914l-1.694-4.244h-.054V32h-1.342zM18.723 32v-6.546h2.583q.744 0 1.268.285.524.281.8.783.277.498.277 1.15 0 .653-.28 1.151a1.94 1.94 0 0 1-.816.777q-.53.278-1.285.278h-1.645v-1.11h1.422q.399 0 .658-.137a.9.9 0 0 0 .39-.386 1.2 1.2 0 0 0 .131-.572 1.2 1.2 0 0 0-.131-.57.88.88 0 0 0-.39-.38q-.262-.137-.665-.137h-.933V32zm5.69-1.15v-1.09l2.732-4.306h.94v1.51h-.556l-1.723 2.725v.051h3.883v1.11zM27.555 32v-1.483l.025-.483v-4.58h1.298V32z",
  },
  pdf: {
    color: "#D92D20",
    path: "M11.75 32v-6.546h2.582q.744 0 1.268.285.524.281.8.783.277.498.277 1.15 0 .653-.28 1.151a1.94 1.94 0 0 1-.816.777q-.53.278-1.285.278H12.65v-1.11h1.423q.399 0 .658-.137a.9.9 0 0 0 .39-.386q.13-.25.13-.572 0-.326-.13-.57a.88.88 0 0 0-.39-.38q-.262-.137-.665-.137h-.933V32zm8.147 0h-2.32v-6.546h2.339q.987 0 1.7.394.712.39 1.096 1.122.387.731.387 1.75 0 1.024-.387 1.759-.384.735-1.102 1.128-.717.393-1.713.393m-.937-1.186h.879q.614 0 1.032-.217.422-.22.633-.68.214-.464.214-1.196 0-.726-.214-1.186a1.4 1.4 0 0 0-.63-.677q-.418-.218-1.032-.218h-.882zM24.124 32v-6.546h4.334v1.142h-2.95v1.56h2.662v1.14h-2.662V32z",
  },
  png: {
    color: "#7F56D9",
    path: "M10.923 32v-6.546h2.582q.745 0 1.27.285.523.281.798.783.278.498.278 1.15 0 .653-.281 1.151a1.94 1.94 0 0 1-.815.777q-.53.278-1.285.278h-1.646v-1.11h1.422q.4 0 .659-.137a.9.9 0 0 0 .39-.386 1.2 1.2 0 0 0 .13-.572 1.2 1.2 0 0 0-.13-.57.88.88 0 0 0-.39-.38q-.262-.137-.665-.137h-.933V32zm11.302-6.546V32h-1.196l-2.847-4.12h-.048V32H16.75v-6.546h1.215l2.825 4.117h.057v-4.117zm5.483 2.116a1.4 1.4 0 0 0-.188-.412 1.27 1.27 0 0 0-.694-.502 1.7 1.7 0 0 0-.489-.067q-.501 0-.882.25a1.64 1.64 0 0 0-.588.725q-.21.472-.21 1.157 0 .684.207 1.163.207.48.588.732.38.25.898.25.47 0 .802-.167.336-.169.512-.476.179-.306.179-.726l.28.042h-1.687v-1.042h2.74v.825q0 .863-.365 1.483a2.5 2.5 0 0 1-1.003.952q-.64.333-1.464.332-.921 0-1.617-.405a2.8 2.8 0 0 1-1.087-1.16q-.387-.755-.387-1.79 0-.796.23-1.42a3 3 0 0 1 .652-1.06q.42-.434.975-.662.555-.227 1.205-.227.556 0 1.035.163.48.16.85.454.374.295.611.7.237.402.304.888z",
  },
};

const fileIcon = <Message>(type: string, h: HtmlBuilder<Message>): Html => {
  const appearance = fileLabels[type.toLowerCase()] ?? fileLabels.fig;
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class("relative size-10 shrink-0"),
      h.Fill("none"),
      h.ViewBox("0 0 40 40"),
    ],
    [
      h.path([
        h.D("M4 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"),
        h.Fill(appearance?.color ?? "#7F56D9"),
      ]),
      h.path([h.D("m24 0 12 12h-8a4 4 0 0 1-4-4z"), h.Fill("white"), h.Opacity("0.3")]),
      ...(appearance === undefined ? [] : [h.path([h.D(appearance.path), h.Fill("white")])]),
    ],
  );
};

const statusIcon = <Message>(status: FileUploadMenuStatus, h: HtmlBuilder<Message>): Html =>
  status === "uploading"
    ? uploadIcon("size-4 stroke-[2.5px]", h)
    : pathIcon(
        status === "complete"
          ? "m7.5 12 3 3 6-6m5.5 3c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"
          : "m15 9-6 6m0-6 6 6m7-3c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z",
        status === "complete" ? "size-4 stroke-[2.5px]" : "size-4",
        h,
      );

const dropZone = <Message>(props: FileUploadMenuProps<Message>, h: HtmlBuilder<Message>): Html => {
  const labels = copy[props.locale];
  const inputId = `${props.id}-files`;
  return h.div(
    [
      h.AllowDrop(),
      h.Class(
        `relative flex flex-col items-center gap-3 rounded-xl bg-bg-primary px-6 py-4 text-text-tertiary transition duration-100 ease-linear ring-inset ${props.isDraggingOver ? "ring-2 ring-border-brand" : "ring-1 ring-border-secondary"}`,
      ),
      h.DataAttribute("dropzone", ""),
      h.OnDragEnter(props.onDragState(true)),
      h.OnDragEnd(props.onDragState(false)),
      h.OnDragLeave(props.onDragState(false)),
      h.OnDragOver(props.onDragState(true)),
      h.OnDropFiles(props.onFilesSelected),
    ],
    [
      h.div(
        [
          h.Class(
            "flex size-10 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
          ),
        ],
        [uploadIcon("size-6", h)],
      ),
      h.div(
        [h.Class("flex flex-col gap-1 text-center")],
        [
          h.div(
            [h.Class("flex justify-center gap-1 text-center")],
            [
              h.input([
                h.Class("peer sr-only"),
                h.Id(inputId),
                h.Multiple(true),
                h.OnFileChange(props.onFilesSelected),
                h.Type("file"),
              ]),
              h.label(
                [
                  h.AriaLabel(labels.clickAccessible),
                  h.Class(
                    "flex cursor-pointer gap-[3.53125px] text-sm font-semibold text-text-brand-secondary outline-focus-ring hover:text-text-brand-secondary-hover peer-focus-visible:outline-2",
                  ),
                  h.For(inputId),
                ],
                [labels.click, h.span([h.Class("md:hidden")], [labels.mobileAttach])],
              ),
              h.span([h.Class("text-sm max-md:hidden")], [labels.drag]),
            ],
          ),
          h.p(
            [
              h.Class(
                `text-xs transition duration-100 ease-linear ${props.isInvalid ? "text-text-error-primary" : ""}`,
              ),
              ...(props.isInvalid ? [h.Role("alert")] : []),
            ],
            [labels.hint],
          ),
        ],
      ),
    ],
  );
};

const fileItem = <Message>(
  file: FileUploadMenuFile<Message>,
  locale: FileUploadMenuLocale,
  h: HtmlBuilder<Message>,
): Html => {
  const labels = copy[locale];
  const complete = file.status === "complete";
  const failed = file.status === "failed";
  return h.li(
    [h.Class("relative flex gap-3 overflow-hidden rounded-xl bg-bg-primary p-4")],
    [
      h.div([
        h.AriaValuemax(100),
        h.AriaValuemin(0),
        h.AriaValuenow(file.progress),
        h.Class(
          `absolute inset-0 size-full bg-bg-secondary transition duration-75 ease-linear ${complete ? "opacity-0" : ""}`,
        ),
        h.Role("progressbar"),
        h.Style({ transform: `translateX(-${String(100 - file.progress)}%)` }),
      ]),
      h.div([
        h.Class(
          `absolute inset-0 size-full rounded-[inherit] transition duration-100 ease-linear ring-inset ${failed ? "ring-2 ring-border-error" : "ring-1 ring-border-secondary"}`,
        ),
      ]),
      fileIcon(file.type, h),
      h.div(
        [h.Class("relative flex min-w-0 flex-1")],
        [
          h.div(
            [h.Class("relative flex min-w-0 flex-1 flex-col items-start")],
            [
              h.div(
                [h.Class("w-full min-w-0 flex-1")],
                [
                  h.p([h.Class("truncate text-sm font-medium text-text-secondary")], [file.name]),
                  h.div(
                    [h.Class("mt-0.5 flex items-center gap-2")],
                    [
                      h.p(
                        [h.Class("text-sm text-text-tertiary")],
                        [failed ? labels.failed : readableFileSize(file.size)],
                      ),
                      ...(failed
                        ? []
                        : [
                            h.hr([h.Class("h-3 w-px rounded-full border-none bg-border-primary")]),
                            h.div(
                              [h.Class("flex items-center gap-1")],
                              [
                                h.span(
                                  [
                                    h.Class(
                                      complete ? "text-fg-success-primary" : "text-fg-quaternary",
                                    ),
                                  ],
                                  [statusIcon(file.status, h)],
                                ),
                                h.p(
                                  [h.Class("text-sm text-text-tertiary")],
                                  [`${String(file.progress)}%`],
                                ),
                              ],
                            ),
                          ]),
                    ],
                  ),
                ],
              ),
              ...(failed
                ? [
                    h.button(
                      [
                        h.Class(
                          "mt-1.5 rounded text-sm font-semibold text-text-error-primary outline-focus-ring hover:text-text-error-primary-hover focus-visible:outline-2",
                        ),
                        h.OnClick(file.onRetry),
                        h.Type("button"),
                      ],
                      [labels.retry],
                    ),
                  ]
                : []),
            ],
          ),
          h.button(
            [
              h.AriaLabel(labels.delete),
              h.Class(
                "-mt-2 -mr-2 flex size-7 shrink-0 self-start items-center justify-center rounded-md p-1.5 text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-primary focus-visible:outline-2 focus-visible:outline-offset-2",
              ),
              h.OnClick(file.onDelete),
              h.Type("button"),
            ],
            [trashIcon(h)],
          ),
        ],
      ),
    ],
  );
};

export const fileUploadMenu = <Message>(
  props: FileUploadMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const labels = copy[props.locale];
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-end bg-overlay/70 pl-6 outline-hidden ease-linear md:pl-10",
              ),
              h.DataAttribute("file-upload-overlay", props.id),
            ],
            [
              h.div([h.AriaHidden(true), h.Class("absolute inset-0"), h.OnClick(props.onDismiss)]),
              h.dialog(
                [
                  h.AriaDescribedBy(descriptionId),
                  h.AriaLabel(props.locale === "en-US" ? "Slideout menu" : "Menu lateral"),
                  h.Class(
                    "fixed inset-y-0 !right-0 !left-auto m-0 h-full w-full max-w-[calc(100%-1.5rem)] overflow-hidden border-0 bg-transparent p-0 shadow-xl outline-hidden transition md:max-w-100",
                  ),
                  h.Id(props.id),
                  h.Lang(props.locale),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.div(
                    [
                      h.Class(
                        "relative flex size-full flex-col items-start gap-6 overflow-y-auto bg-bg-primary outline-hidden ring-1 ring-border-secondary-alt",
                      ),
                    ],
                    [
                      h.header(
                        [h.Class("relative z-1 flex w-full flex-col gap-0.5 px-4 pt-6 md:px-6")],
                        [
                          h.h1(
                            [
                              h.Class("text-md font-semibold text-text-primary md:text-lg"),
                              h.Id(titleId),
                            ],
                            [labels.title],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            [labels.description],
                          ),
                          h.button(
                            [
                              h.AriaLabel(labels.close),
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("file-upload-menu-close", ""),
                              h.OnClick(props.onDismiss),
                              h.Type("button"),
                            ],
                            [closeIcon(h)],
                          ),
                        ],
                      ),
                      h.main(
                        [
                          h.Class(
                            "flex size-full flex-col gap-6 overflow-y-auto overscroll-auto px-4 pb-6 md:px-6",
                          ),
                        ],
                        [
                          h.div(
                            [h.Class("flex flex-col gap-4")],
                            [
                              dropZone(props, h),
                              h.ul(
                                [h.Class("flex flex-col gap-3")],
                                props.files.map((file) => fileItem(file, props.locale, h)),
                              ),
                            ],
                          ),
                        ],
                      ),
                      h.footer(
                        [
                          h.Class(
                            "flex w-full items-center justify-end gap-3 p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6",
                          ),
                        ],
                        [
                          button(
                            {
                              color: "secondary",
                              label: labels.cancel,
                              onPress: props.onCancel,
                              size: "sm",
                            },
                            h,
                          ),
                          button({ label: labels.attach, onPress: props.onAttach, size: "sm" }, h),
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
