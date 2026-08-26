/* oxlint-disable @rikalabs/no-low-signal-variable-names, @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, mps/prefer-option-over-null -- The toolbar keeps the authenticated upstream anatomy and its controlled state branches visible. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { observeTextEditor } from "../internal/text-editor-runtime.ts";
import type {
  TextEditorChange,
  TextEditorCommandRequest,
  TextEditorSelection,
} from "../internal/text-editor-runtime.ts";

export type TextEditorToolbarType = "advanced" | "simple";

export interface TextEditorProps<Message> {
  readonly appearance?: "default" | "bare-compose";
  readonly editorId: string;
  readonly hint?: string;
  readonly html: string;
  readonly isDisabled?: boolean;
  readonly isInvalid?: boolean;
  readonly label?: string;
  readonly limit?: number;
  readonly onChange: (change: TextEditorChange) => NoInfer<Message>;
  readonly onCommand: (request: TextEditorCommandRequest) => NoInfer<Message>;
  readonly onGenerate?: NoInfer<Message>;
  readonly onImageChange?: (files: readonly File[]) => NoInfer<Message>;
  readonly onSelectionChange: (selection: TextEditorSelection) => NoInfer<Message>;
  readonly placeholder?: string;
  readonly selection: TextEditorSelection;
  readonly text: string;
  readonly toolbar?: TextEditorToolbarType;
}

const icon = <Message>(path: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D(path)])],
  );

const paths = {
  alignCenter: "M4 6h16M7 10h10M4 14h16M7 18h10",
  alignLeft: "M4 6h16M4 10h10M4 14h16M4 18h10",
  bold: "M7 4h7a4 4 0 0 1 0 8H7V4Zm0 8h8a4 4 0 0 1 0 8H7v-8Z",
  bullet: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01",
  generate:
    "m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3Zm6 10 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13ZM6 14l1 2.8L10 18l-3 1.2L6 22l-1-2.8L2 18l3-1.2L6 14Z",
  image: "M4 4h16v16H4V4Zm0 12 4-4 3 3 2-2 7 7M15 8h.01",
  italic: "M10 4h8M6 20h8M14 4 10 20",
  link: "m10 13 4-4m-5.5 7.5-1 1a3.536 3.536 0 0 1-5-5l3-3a3.536 3.536 0 0 1 5 0m5-2 1-1a3.536 3.536 0 0 1 5 5l-3 3a3.536 3.536 0 0 1-5 0",
  underline: "M7 4v6a5 5 0 0 0 10 0V4M5 20h14",
} as const;

const toolbarButton = <Message>(
  label: string,
  path: string,
  active: boolean,
  message: NoInfer<Message> | undefined,
  h: HtmlBuilder<Message>,
): Html => {
  const tooltipId = `text-editor-${label.toLowerCase().replaceAll(/[^a-z]+/gu, "-")}-tooltip`;
  return h.div(
    [h.Class("group/editor-control relative flex")],
    [
      h.button(
        [
          h.AriaDescribedBy(tooltipId),
          h.AriaLabel(label),
          h.AriaPressed(String(active)),
          h.Class(
            `flex size-8 cursor-pointer items-center justify-center rounded-md p-0 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 active:bg-bg-primary-hover ${active ? "bg-bg-primary-hover text-fg-secondary" : ""}`,
          ),
          ...(message === undefined ? [] : [h.OnClick(message)]),
          h.Type("button"),
        ],
        [icon(path, h)],
      ),
      h.span(
        [
          h.Class(
            "pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-30 -translate-x-1/2 rounded-lg bg-bg-primary px-2 py-1 text-xs font-semibold whitespace-nowrap text-text-primary opacity-0 shadow-lg ring-1 ring-border-secondary-alt transition duration-100 group-hover/editor-control:opacity-100 group-focus-within/editor-control:opacity-100",
          ),
          h.Id(tooltipId),
          h.Role("tooltip"),
        ],
        [label],
      ),
    ],
  );
};

const divider = <Message>(h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.AriaHidden(true), h.Class("p-1.5")],
    [h.div([h.Class("h-full w-px rounded-full bg-border-primary")])],
  );

const fontSelect = <Message>(
  label: string,
  value: string,
  values: readonly string[],
  command: "fontFamily" | "fontSize",
  onCommand: TextEditorProps<Message>["onCommand"],
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        `${command === "fontFamily" ? "w-full md:w-38" : "w-full md:w-22"} relative flex h-9 items-center gap-2 rounded-lg bg-bg-primary py-2 pr-2.5 pl-3 text-sm font-medium text-text-primary shadow-xs ring-1 ring-border-primary ring-inset focus-within:ring-2 focus-within:ring-focus-ring`,
      ),
    ],
    [
      ...(command === "fontFamily"
        ? [
            h.span(
              [h.AriaHidden(true), h.Class("text-fg-quaternary [&_svg]:size-4")],
              [
                icon(
                  "M4 7c0-.932 0-1.398.152-1.765a2 2 0 0 1 1.083-1.083C5.602 4 6.068 4 7 4h10c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C20 5.602 20 6.068 20 7M9 20h6M12 4v16",
                  h,
                ),
              ],
            ),
          ]
        : []),
      h.span([h.Class("truncate")], [value.replace(", Comic Sans", "")]),
      h.span(
        [h.AriaHidden(true), h.Class("ml-auto text-fg-quaternary [&_svg]:size-4")],
        [icon("m6 9 6 6 6-6", h)],
      ),
      h.select(
        [
          h.AriaLabel(label),
          h.Class("absolute inset-0 cursor-pointer opacity-0"),
          h.OnChange((next) => onCommand({ command, value: next })),
          h.Value(value),
        ],
        values.map((item) => h.option([h.Value(item)], [item.replace(", Comic Sans", "")])),
      ),
    ],
  );

const colors = [
  ["bg-fg-primary", "--color-fg-primary"],
  ["bg-fg-secondary", "--color-fg-secondary"],
  ["bg-fg-tertiary", "--color-fg-tertiary"],
  ["bg-fg-quaternary", "--color-fg-quaternary"],
  ["bg-fg-disabled", "--color-fg-disabled"],
  ["bg-border-primary", "--color-border-primary"],
  ["bg-bg-primary", "--color-bg-primary"],
  ["bg-green-600", "--color-green-600"],
  ["bg-blue-600", "--color-blue-600"],
  ["bg-indigo-600", "--color-indigo-600"],
  ["bg-brand-600", "--color-brand-600"],
  ["bg-purple-600", "--color-purple-600"],
  ["bg-pink-600", "--color-pink-600"],
  ["bg-red-600", "--color-red-600"],
  ["bg-orange-600", "--color-orange-600"],
] as const;

const colorPicker = <Message>(props: TextEditorProps<Message>, h: HtmlBuilder<Message>): Html => {
  const popoverId = `${props.editorId}-color-picker`;
  return h.div(
    [h.Class("relative flex")],
    [
      h.button(
        [
          h.AriaLabel("Text color"),
          h.Class(
            "flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.Popovertarget(popoverId),
          h.Type("button"),
        ],
        [
          h.span([
            h.AriaHidden(true),
            h.Class("size-4 rounded-full bg-fg-primary ring-1 ring-black/10 ring-inset"),
          ]),
        ],
      ),
      h.div(
        [
          h.Class(
            "mt-2 rounded-xl bg-bg-primary-alt p-3 shadow-lg ring-1 ring-border-secondary-alt outline-hidden backdrop:bg-black/20",
          ),
          h.Id(popoverId),
          h.Popover("auto"),
        ],
        [
          h.div(
            [h.AriaLabel("Text colors"), h.Class("grid grid-cols-8 gap-1"), h.Role("group")],
            colors.map(([className, color], index) =>
              h.button([
                h.AriaLabel(`Text color ${String(index + 1)}`),
                h.Class(
                  `size-5 rounded-full ${className} ring-1 ring-black/10 ring-inset outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2`,
                ),
                h.OnClick(props.onCommand({ command: "color", value: color })),
                h.Popovertarget(popoverId),
                h.Popovertargetaction("hide"),
                h.Type("button"),
              ]),
            ),
          ),
        ],
      ),
    ],
  );
};

const toolbar = <Message>(props: TextEditorProps<Message>, h: HtmlBuilder<Message>): Html => {
  const advanced = (props.toolbar ?? "simple") === "advanced";
  const { selection } = props;
  const command = (request: TextEditorCommandRequest) => props.onCommand(request);
  return h.div(
    [
      h.AriaLabel("Text formatting"),
      h.Class(
        advanced
          ? "flex w-max flex-col items-start justify-center gap-2 md:flex-row md:items-center md:justify-start md:gap-3"
          : "flex w-max flex-wrap gap-0.5 md:flex-nowrap",
      ),
      h.Role("toolbar"),
    ],
    [
      ...(advanced
        ? [
            h.div(
              [h.Class("flex gap-2")],
              [
                fontSelect(
                  "Font family",
                  selection.fontFamily,
                  ["Inter", "Comic Sans MS, Comic Sans", "serif", "monospace", "cursive"],
                  "fontFamily",
                  props.onCommand,
                  h,
                ),
                fontSelect(
                  "Font size",
                  selection.fontSize,
                  [
                    "12px",
                    "14px",
                    "16px",
                    "18px",
                    "20px",
                    "22px",
                    "24px",
                    "26px",
                    "28px",
                    "30px",
                    "32px",
                  ],
                  "fontSize",
                  props.onCommand,
                  h,
                ),
              ],
            ),
          ]
        : []),
      h.div(
        [h.Class("flex flex-wrap gap-0.5 md:flex-nowrap")],
        [
          toolbarButton("Bold ⌘B", paths.bold, selection.bold, command({ command: "bold" }), h),
          toolbarButton(
            "Italic ⌘I",
            paths.italic,
            selection.italic,
            command({ command: "italic" }),
            h,
          ),
          toolbarButton(
            "Underline ⌘U",
            paths.underline,
            selection.underline,
            command({ command: "underline" }),
            h,
          ),
          divider(h),
          colorPicker(props, h),
          divider(h),
          toolbarButton(
            "Left align",
            paths.alignLeft,
            selection.align === "left",
            command({ command: "left" }),
            h,
          ),
          toolbarButton(
            "Center align",
            paths.alignCenter,
            selection.align === "center",
            command({ command: "center" }),
            h,
          ),
          toolbarButton(
            "Bullet list",
            paths.bullet,
            selection.bulletList,
            command({ command: "bulletList" }),
            h,
          ),
          ...(advanced
            ? [
                divider(h),
                toolbarButton(
                  "Link ⌘K",
                  paths.link,
                  selection.link,
                  command({ command: "link", value: "https://siglata.com" }),
                  h,
                ),
                h.label(
                  [
                    h.AriaLabel("Insert image"),
                    h.Class(
                      "flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover focus-within:outline-2 focus-within:outline-offset-2",
                    ),
                    h.For(`${props.editorId}-image`),
                  ],
                  [
                    icon(paths.image, h),
                    h.input([
                      h.Accept("image/*"),
                      h.Class("sr-only"),
                      h.Id(`${props.editorId}-image`),
                      ...(props.onImageChange === undefined
                        ? []
                        : [h.OnFileChange(props.onImageChange)]),
                      h.Type("file"),
                    ]),
                  ],
                ),
                divider(h),
                toolbarButton("Generate", paths.generate, false, props.onGenerate, h),
              ]
            : []),
        ],
      ),
    ],
  );
};

export const textEditor = <Message>(
  props: TextEditorProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const labelId = `${props.editorId}-label`;
  const hintId = `${props.editorId}-hint`;
  const count = props.limit === undefined ? undefined : props.limit - props.text.length;
  const exceedsLimit = count !== undefined && count < 0;
  const isBareCompose = props.appearance === "bare-compose";
  const normalizedHtml = props.html.replaceAll("<p></p>", "<p><br></p>");
  return h.div(
    [h.Class("flex w-full flex-col gap-3")],
    [
      ...(props.label === undefined
        ? []
        : [
            h.label(
              [
                h.Class("text-sm font-medium text-text-secondary"),
                h.For(props.editorId),
                h.Id(labelId),
              ],
              [props.label],
            ),
          ]),
      ...(isBareCompose ? [] : [toolbar(props, h)]),
      h.div([
        h.AriaDescribedBy(props.hint !== undefined || count !== undefined ? hintId : ""),
        h.AriaInvalid(props.isInvalid === true || exceedsLimit),
        h.AriaLabelledBy(props.label === undefined ? "" : labelId),
        h.Attribute("aria-multiline", "true"),
        h.Class(
          isBareCompose
            ? "h-86 w-full resize-y space-y-4 overflow-auto whitespace-break-spaces bg-transparent p-0 text-md leading-[1.5] text-text-primary caret-fg-brand-primary outline-hidden selection:bg-fg-brand-primary/10 before:pointer-events-none before:text-text-placeholder empty:before:content-[attr(data-editor-placeholder)] sm:h-66"
            : `w-full resize-y scroll-py-3 overflow-auto whitespace-break-spaces rounded-lg bg-bg-primary p-5 text-md leading-[1.5] text-text-primary caret-fg-brand-primary shadow-xs ring-1 ring-border-primary transition duration-100 ease-linear ring-inset selection:bg-fg-brand-primary/10 before:pointer-events-none before:text-text-placeholder empty:before:content-[attr(data-editor-placeholder)] focus:ring-2 focus:ring-focus-ring focus:outline-hidden ${props.isDisabled === true ? "cursor-not-allowed opacity-50" : ""} ${props.isInvalid === true || exceedsLimit ? "ring-border-error-subtle focus:ring-border-error-subtle" : ""}`,
        ),
        h.Contenteditable(props.isDisabled === true ? "false" : "true"),
        h.DataAttribute("editor-placeholder", props.placeholder ?? "Write something..."),
        h.Id(props.editorId),
        h.InnerHTML(normalizedHtml),
        h.Key(props.editorId),
        h.OnMount(observeTextEditor(props.onChange, props.onSelectionChange)),
        h.Role("textbox"),
        h.Spellcheck(true),
        h.Tabindex(props.isDisabled === true ? -1 : 0),
      ]),
      ...(props.hint === undefined && count === undefined
        ? []
        : [
            h.p(
              [
                h.Class(
                  `${props.isInvalid === true || exceedsLimit ? "text-text-error-primary" : "text-text-tertiary"} text-sm ${count === undefined ? "" : "tabular-nums"}`,
                ),
                h.Id(hintId),
              ],
              [props.hint ?? `${String(count)} character${count === 1 ? "" : "s"} left`],
            ),
          ]),
    ],
  );
};

export { runTextEditorCommand } from "../internal/text-editor-runtime.ts";
export type {
  TextEditorChange,
  TextEditorCommandCompleted,
  TextEditorCommandName,
  TextEditorCommandRequest,
  TextEditorSelection,
} from "../internal/text-editor-runtime.ts";
