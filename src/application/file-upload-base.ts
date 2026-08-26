/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, unicorn/no-nested-ternary, mps/prefer-option-over-null -- The authenticated component has three exact visual branches and native file events; component messages are optional public callbacks. */
import type { Html, HtmlBuilder } from "foldkit/html";

export type FileUploadItemVariant = "progress-bar" | "progress-fill";
export type FileUploadStatus = "uploading" | "complete" | "failed";
export type FileUploadRejection = "size" | "type";

export interface FileUploadResult {
  readonly accepted: readonly File[];
  readonly oversized: readonly File[];
  readonly unaccepted: readonly File[];
}

export interface FileUploadDropZoneProps<Message> {
  readonly accept?: string;
  readonly allowsMultiple?: boolean;
  readonly hint?: string;
  readonly id: string;
  readonly isDisabled?: boolean;
  readonly isDraggingOver?: boolean;
  readonly isInvalid?: boolean;
  readonly maxSize?: number;
  readonly messageForDragState?: (isDraggingOver: boolean) => NoInfer<Message>;
  readonly messageForFiles?: (result: FileUploadResult) => NoInfer<Message>;
}

export interface FileUploadItemProps<Message> {
  readonly name: string;
  readonly onDelete?: NoInfer<Message>;
  readonly onRetry?: NoInfer<Message>;
  readonly progress: number;
  readonly size: number;
  readonly status?: FileUploadStatus;
  readonly type?: string;
  readonly variant?: FileUploadItemVariant;
}

export const getReadableFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return "0 KB";
  }
  const suffixes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${String(Math.floor(bytes / 1024 ** index))} ${suffixes[index] ?? "YB"}`;
};

const acceptsFile = (file: File, accept?: string): boolean => {
  if (accept === undefined || accept.trim() === "") {
    return true;
  }
  return accept.split(",").some((candidate) => {
    const accepted = candidate.trim().toLowerCase();
    if (accepted.startsWith(".")) {
      return file.name.toLowerCase().endsWith(accepted);
    }
    if (accepted.endsWith("/*")) {
      return file.type.startsWith(accepted.slice(0, -1));
    }
    return file.type.toLowerCase() === accepted;
  });
};

export const classifyUploadFiles = (
  files: readonly File[],
  props: Pick<FileUploadDropZoneProps<never>, "accept" | "allowsMultiple" | "maxSize">,
): FileUploadResult => {
  const selected = props.allowsMultiple === false ? files.slice(0, 1) : files;
  const oversized = selected.filter(
    (file) => props.maxSize !== undefined && file.size > props.maxSize,
  );
  const withinLimit = selected.filter(
    (file) => props.maxSize === undefined || file.size <= props.maxSize,
  );
  return {
    accepted: withinLimit.filter((file) => acceptsFile(file, props.accept)),
    oversized,
    unaccepted: withinLimit.filter((file) => !acceptsFile(file, props.accept)),
  };
};

const uploadIcon = <Message>(h: HtmlBuilder<Message>, className = "size-6"): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class(className), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("M8 16l4-4m0 0 4 4m-4-4v9m8.4-4.6A5 5 0 0 0 18 7h-1.3A8 8 0 1 0 4 14.5"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const statusIcon = <Message>(kind: FileUploadStatus, h: HtmlBuilder<Message>): Html =>
  kind === "uploading"
    ? uploadIcon(h, "size-4 stroke-[2.5px]")
    : h.svg(
        [h.AriaHidden(true), h.Class("size-4"), h.Fill("none"), h.ViewBox("0 0 20 20")],
        [
          h.path([
            h.D(kind === "complete" ? "m6 10 2.5 2.5L14 7" : "m7 7 6 6m0-6-6 6"),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeLinejoin("round"),
            h.StrokeWidth("2"),
          ]),
          h.circle([
            h.Cx("10"),
            h.Cy("10"),
            h.R("8"),
            h.Stroke("currentColor"),
            h.StrokeWidth("1.5"),
          ]),
        ],
      );

const trashIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 20 20")],
    [
      h.path([
        h.D(
          "M7.5 2.5h5m-8 3h11m-1 0-.6 10.2a1.7 1.7 0 0 1-1.7 1.6H7.8a1.7 1.7 0 0 1-1.7-1.6L5.5 5.5m3 3v5m3-5v5",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.5"),
      ]),
    ],
  );

const pdfLabelPath =
  "M4.832 30v-7.273h2.87q.826 0 1.41.316.582.314.887.87.31.555.31 1.279t-.313 1.278q-.313.555-.906.863-.59.309-1.427.309h-1.83V26.41h1.581q.444 0 .732-.153.29-.156.433-.43.145-.276.145-.635 0-.363-.145-.632a.97.97 0 0 0-.433-.423q-.291-.153-.74-.153H6.37V30zm9.053 0h-2.578v-7.273h2.6q1.095 0 1.889.437.791.433 1.218 1.246.43.814.43 1.947 0 1.136-.43 1.953a2.95 2.95 0 0 1-1.226 1.253q-.795.437-1.903.437m-1.04-1.317h.976q.682 0 1.147-.242.47-.244.703-.756.238-.516.238-1.328 0-.807-.238-1.318a1.54 1.54 0 0 0-.7-.753q-.465-.24-1.146-.241h-.98zM18.582 30v-7.273h4.816v1.268H20.12v1.733h2.958v1.268H20.12V30z";

const fileIcon = <Message>(
  solid: boolean,
  type: string | undefined,
  h: HtmlBuilder<Message>,
): Html => {
  const isPdf = type?.toLowerCase().includes("pdf") === true;
  const offset = isPdf ? 3 : 0;
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class("relative size-10 shrink-0"),
      h.Fill("none"),
      h.ViewBox("0 0 40 40"),
    ],
    solid
      ? [
          h.path([
            h.D("M4 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"),
            h.Fill("var(--color-bg-brand-solid)"),
          ]),
          h.path([h.D("m24 0 12 12h-8a4 4 0 0 1-4-4z"), h.Fill("white"), h.Opacity("0.3")]),
        ]
      : [
          h.path([
            h.D(
              `M${String(4.75 + offset)} 4A3.25 3.25 0 0 1 ${String(8 + offset)} .75h16c.121 0 .238.048.323.134l10.793 10.793a.46.46 0 0 1 .134.323v24A3.25 3.25 0 0 1 ${String(32 + offset)} 39.25H${String(8 + offset)}A3.25 3.25 0 0 1 ${String(4.75 + offset)} 36z`,
            ),
            h.Stroke("var(--color-border-secondary)"),
            h.StrokeWidth("1.5"),
          ]),
          h.path([
            h.D(`M${String(24 + offset)} .5V8a4 4 0 0 0 4 4h7.5`),
            h.Stroke("var(--color-border-secondary)"),
            h.StrokeWidth("1.5"),
          ]),
          ...(isPdf
            ? [
                h.rect([
                  h.Fill("var(--color-bg-error-solid)"),
                  h.Height("16"),
                  h.Rx("2"),
                  h.Width("26"),
                  h.X("1"),
                  h.Y("18"),
                ]),
                h.path([h.D(pdfLabelPath), h.Fill("white")]),
              ]
            : []),
        ],
  );
};

const selectionAttributes = <Message>(
  props: FileUploadDropZoneProps<Message>,
  h: HtmlBuilder<Message>,
) => {
  const { messageForFiles } = props;
  return messageForFiles === undefined || props.isDisabled === true
    ? []
    : [h.OnFileChange((files) => messageForFiles(classifyUploadFiles(files, props)))];
};

export const fileUploadDropZone = <Message>(
  props: FileUploadDropZoneProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const disabled = props.isDisabled === true;
  const drag = props.isDraggingOver === true;
  const dragMessage = props.messageForDragState;
  const dropMessage = props.messageForFiles;
  return h.div(
    [
      h.Class(
        `relative flex flex-col items-center gap-3 rounded-xl bg-bg-primary px-6 py-4 text-text-tertiary transition duration-100 ease-linear ring-inset ${drag ? "ring-2 ring-border-brand" : "ring-1 ring-border-secondary"} ${disabled ? "cursor-not-allowed bg-bg-secondary" : ""}`,
      ),
      h.DataAttribute("dropzone", ""),
      ...(disabled ? [] : [h.AllowDrop()]),
      ...(dragMessage === undefined || disabled
        ? []
        : [
            h.OnDragEnter(dragMessage(true)),
            h.OnDragOver(dragMessage(true)),
            h.OnDragLeave(dragMessage(false)),
          ]),
      ...(dropMessage === undefined || disabled
        ? []
        : [h.OnDropFiles((files) => dropMessage(classifyUploadFiles(files, props)))]),
    ],
    [
      h.div(
        [
          h.Class(
            `flex size-10 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset ${disabled ? "opacity-50" : ""}`,
          ),
        ],
        [uploadIcon(h)],
      ),
      h.div(
        [h.Class("flex flex-col gap-1 text-center")],
        [
          h.div(
            [h.Class("flex justify-center gap-1 text-center")],
            [
              h.input([
                h.Accept(props.accept ?? ""),
                h.Class("peer sr-only"),
                h.Disabled(disabled),
                h.Id(props.id),
                h.Multiple(props.allowsMultiple !== false),
                h.Type("file"),
                ...selectionAttributes(props, h),
              ]),
              h.label(
                [
                  h.AriaLabel("Click to upload and attach files"),
                  h.Class(
                    `flex cursor-pointer gap-[3.53125px] text-sm font-semibold text-text-brand-secondary outline-focus-ring peer-focus-visible:outline-2 ${disabled ? "cursor-not-allowed text-text-disabled" : "hover:text-text-brand-secondary-hover"}`,
                  ),
                  h.For(props.id),
                ],
                ["Click to upload", h.span([h.Class("md:hidden")], ["and attach files"])],
              ),
              h.span([h.Class("text-sm max-md:hidden")], ["or drag and drop"]),
            ],
          ),
          h.p(
            [
              h.Class(
                `text-xs transition duration-100 ease-linear ${props.isInvalid === true ? "text-text-error-primary" : ""}`,
              ),
            ],
            [props.hint ?? "SVG, PNG, JPG or GIF (max. 800x400px)"],
          ),
        ],
      ),
    ],
  );
};

const deleteButton = <Message>(message: Message | undefined, h: HtmlBuilder<Message>): Html =>
  h.button(
    [
      h.AriaLabel("Delete"),
      h.Class(
        "-mt-2 -mr-2 flex size-7 shrink-0 self-start items-center justify-center rounded-md p-1.5 text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-primary focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      ...(message === undefined ? [] : [h.OnClick(message)]),
      h.Type("button"),
    ],
    [trashIcon(h)],
  );

const retryButton = <Message>(message: Message | undefined, h: HtmlBuilder<Message>): Html =>
  h.button(
    [
      h.Class(
        "mt-1.5 rounded text-sm font-semibold text-text-error-primary outline-focus-ring hover:text-text-error-primary-hover focus-visible:outline-2",
      ),
      ...(message === undefined ? [] : [h.OnClick(message)]),
      h.Type("button"),
    ],
    ["Try again"],
  );

export const fileUploadItem = <Message>(
  props: FileUploadItemProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const status = props.status ?? (props.progress === 100 ? "complete" : "uploading");
  const failed = status === "failed";
  const complete = status === "complete";
  const fill = props.variant === "progress-fill";
  const statusColor = complete
    ? "text-fg-success-primary"
    : failed
      ? "text-fg-error-primary"
      : "text-fg-quaternary";
  const metadata = h.div(
    [h.Class("mt-0.5 flex items-center gap-2")],
    [
      h.p(
        [h.Class("truncate text-sm whitespace-nowrap text-text-tertiary")],
        [failed && fill ? "Upload failed, please try again" : getReadableFileSize(props.size)],
      ),
      ...(!failed || !fill
        ? [
            h.hr([h.Class("h-3 w-px rounded-full border-none bg-border-primary")]),
            h.div(
              [h.Class("flex items-center gap-1")],
              [
                h.span([h.Class(statusColor)], [statusIcon(status, h)]),
                h.p(
                  [
                    h.Class(
                      `text-sm font-medium ${complete ? "text-text-success-primary" : failed ? "text-text-error-primary" : "text-text-quaternary"}`,
                    ),
                  ],
                  [
                    fill
                      ? `${String(props.progress)}%`
                      : complete
                        ? "Complete"
                        : failed
                          ? "Failed"
                          : "Uploading...",
                  ],
                ),
              ],
            ),
          ]
        : []),
    ],
  );
  const details = h.div(
    [h.Class("min-w-0 flex-1")],
    [h.p([h.Class("truncate text-sm font-medium text-text-secondary")], [props.name]), metadata],
  );
  const progress = h.div(
    [h.Class("mt-1 flex w-full items-center gap-3")],
    [
      h.div(
        [h.Class("h-2 flex-1 overflow-hidden rounded-full bg-bg-quaternary")],
        [
          h.div([
            h.Class("h-full rounded-full bg-bg-brand-solid"),
            h.Style({ width: `${String(props.progress)}%` }),
          ]),
        ],
      ),
      h.span([h.Class("text-sm font-medium text-text-secondary")], [`${String(props.progress)}%`]),
    ],
  );
  return h.li(
    [
      h.Class(
        `relative flex gap-3 rounded-xl bg-bg-primary p-4 ${fill ? "overflow-hidden" : failed ? "ring-2 ring-border-error ring-inset" : "ring-1 ring-border-secondary ring-inset"}`,
      ),
    ],
    [
      ...(fill
        ? [
            h.div([
              h.AriaValuemax(100),
              h.AriaValuemin(0),
              h.AriaValuenow(props.progress),
              h.Class(
                `absolute inset-0 size-full bg-bg-secondary transition duration-75 ease-linear ${complete ? "opacity-0" : ""}`,
              ),
              h.Role("progressbar"),
              h.Style({ transform: `translateX(-${String(100 - props.progress)}%)` }),
            ]),
            h.div([
              h.Class(
                `absolute inset-0 size-full rounded-[inherit] ring-inset ${failed ? "ring-2 ring-border-error" : "ring-1 ring-border-secondary"}`,
              ),
            ]),
          ]
        : []),
      fileIcon(fill, props.type, h),
      fill
        ? h.div(
            [h.Class("relative flex min-w-0 flex-1")],
            [
              h.div(
                [h.Class("flex min-w-0 flex-1 flex-col items-start")],
                [details, ...(failed ? [retryButton(props.onRetry, h)] : [])],
              ),
              deleteButton(props.onDelete, h),
            ],
          )
        : h.div(
            [h.Class("flex min-w-0 flex-1 flex-col items-start")],
            [
              h.div(
                [h.Class("flex w-full max-w-full min-w-0 flex-1")],
                [details, deleteButton(props.onDelete, h)],
              ),
              ...(failed ? [retryButton(props.onRetry, h)] : [progress]),
            ],
          ),
    ],
  );
};

export const fileUpload = <Message>(
  props: FileUploadDropZoneProps<Message> & {
    readonly items?: readonly FileUploadItemProps<Message>[];
  },
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("flex flex-col gap-4")],
    [
      fileUploadDropZone(props, h),
      ...(props.items === undefined
        ? []
        : [
            h.ul(
              [h.Class("flex flex-col gap-3")],
              props.items.map((item) => fileUploadItem(item, h)),
            ),
          ]),
    ],
  );
