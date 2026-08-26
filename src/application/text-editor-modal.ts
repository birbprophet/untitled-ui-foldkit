/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the authenticated text-editor dialog anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { textEditor } from "../base/text-editor.ts";
import type {
  TextEditorChange,
  TextEditorCommandRequest,
  TextEditorSelection,
} from "../internal/text-editor-runtime.ts";

export type TextEditorModalEditor = "desktop" | "mobile";

export interface TextEditorModalProps<Message> {
  readonly contentHtml: string;
  readonly contentText: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly onAskAi: NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onEditorChange: (
    editor: TextEditorModalEditor,
    change: TextEditorChange,
  ) => NoInfer<Message>;
  readonly onEditorCommand: (
    editor: TextEditorModalEditor,
    request: TextEditorCommandRequest,
  ) => NoInfer<Message>;
  readonly onEditorGenerate: (editor: TextEditorModalEditor) => NoInfer<Message>;
  readonly onEditorImageChange: (
    editor: TextEditorModalEditor,
    files: readonly File[],
  ) => NoInfer<Message>;
  readonly onEditorSelectionChange: (
    editor: TextEditorModalEditor,
    selection: TextEditorSelection,
  ) => NoInfer<Message>;
  readonly onSave: NoInfer<Message>;
  readonly selection: TextEditorSelection;
}

const pathIcon = <Message>(path: string, className: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(className),
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

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon("M18 6 6 18M6 6l12 12", "size-6", h);
const editIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "m21 18-1 1.094A2.71 2.71 0 0 1 18 20c-.75 0-1.47-.326-2-.906a2.716 2.716 0 0 0-2-.904c-.75 0-1.469.325-2 .904M3 20h1.675c.489 0 .733 0 .964-.055.204-.05.399-.13.578-.24.201-.123.374-.296.72-.642L19.5 6.5a2.121 2.121 0 0 0-3-3L3.937 16.063c-.346.346-.519.519-.642.72a2 2 0 0 0-.24.578c-.055.23-.055.475-.055.965V20Z",
    "z-1 size-6",
    h,
  );
const starsIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M4.5 22v-5m0-10V2M2 4.5h5m-5 15h5M13 3l-1.734 4.509c-.282.733-.423 1.1-.643 1.408a3 3 0 0 1-.706.707c-.308.219-.675.36-1.408.642L4 12l4.509 1.734c.733.282 1.1.423 1.408.643.273.194.512.433.707.706.219.308.36.675.642 1.408L13 21l1.734-4.509c.282-.733.423-1.1.643-1.408.194-.273.433-.512.706-.707.308-.219.675-.36 1.408-.642L22 12l-4.509-1.734c-.733-.282-1.1-.423-1.408-.642a3 3 0 0 1-.706-.707c-.22-.308-.36-.675-.643-1.408L13 3Z",
    "size-5",
    h,
  );

const circlePattern = <Message>(id: string, h: HtmlBuilder<Message>): Html => {
  const maskId = `${id}-header-pattern-mask`;
  const gradientId = `${id}-header-pattern-gradient`;
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class(
        "pointer-events-none absolute top-1/2 left-1/2 size-84 -translate-x-1/2 -translate-y-1/2 text-border-secondary",
      ),
      h.Fill("none"),
      h.ViewBox("0 0 336 336"),
    ],
    [
      h.mask(
        [
          h.Id(maskId),
          h.Attribute("maskUnits", "userSpaceOnUse"),
          h.X("0"),
          h.Y("0"),
          h.Width("336"),
          h.Height("336"),
        ],
        [h.rect([h.Width("336"), h.Height("336"), h.Fill(`url(#${gradientId})`)])],
      ),
      h.g(
        [h.Attribute("mask", `url(#${maskId})`)],
        [47.5, 47.5, 71.5, 95.5, 119.5, 143.5, 167.5].map((radius) =>
          h.circle([h.Cx("168"), h.Cy("168"), h.R(String(radius)), h.Stroke("currentColor")]),
        ),
      ),
      h.defs(
        [],
        [
          h.radialGradient(
            [
              h.Id(gradientId),
              h.Cx("0"),
              h.Cy("0"),
              h.R("1"),
              h.Attribute("gradientUnits", "userSpaceOnUse"),
              h.Attribute("gradientTransform", "translate(168 168) rotate(90) scale(168 168)"),
            ],
            [
              h.stop([h.StopColor("black")]),
              h.stop([h.Offset("1"), h.StopColor("black"), h.StopOpacity("0")]),
            ],
          ),
        ],
      ),
    ],
  );
};

const featuredIcon = <Message>(id: string, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class("relative w-max max-sm:hidden")],
    [
      h.div(
        [
          h.Class(
            "relative z-1 flex size-12 shrink-0 items-center justify-center rounded-[10px] bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
          ),
        ],
        [editIcon(h)],
      ),
      circlePattern(id, h),
    ],
  );

const editor = <Message>(
  kind: TextEditorModalEditor,
  props: TextEditorModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const mobile = kind === "mobile";
  return h.div(
    [
      h.Class(
        mobile
          ? "md:hidden max-md:[&>div]:gap-2 [&>div>label]:sr-only [&_[role=textbox]]:h-90 [&_[role=textbox]]:p-4"
          : "hidden md:block [&>div>label]:sr-only [&_[role=textbox]]:h-101 [&_[role=toolbar]>div:first-child>div:nth-child(2)]:hidden",
      ),
    ],
    [
      textEditor(
        {
          editorId: `${props.id}-editor-${kind}`,
          html: props.contentHtml,
          label: "Featured excerpt",
          onChange: (change) => props.onEditorChange(kind, change),
          onCommand: (request) => props.onEditorCommand(kind, request),
          onGenerate: props.onEditorGenerate(kind),
          onImageChange: (files) => props.onEditorImageChange(kind, files),
          onSelectionChange: (selection) => props.onEditorSelectionChange(kind, selection),
          selection: props.selection,
          text: props.contentText,
          toolbar: mobile ? "simple" : "advanced",
        },
        h,
      ),
    ],
  );
};

export const textEditorModal = <Message>(
  props: TextEditorModalProps<Message>,
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
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-[calc(100%-32px)] overflow-y-auto border-0 bg-transparent p-0 outline-hidden sm:m-auto sm:w-[calc(100%-64px)] sm:max-w-180",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.div(
                    [
                      h.Class(
                        "relative w-full overflow-hidden rounded-2xl bg-bg-primary shadow-xl transition-all sm:max-w-180",
                      ),
                    ],
                    [
                      h.button(
                        [
                          h.AriaLabel("Close"),
                          h.Autofocus(true),
                          h.Class(
                            "absolute top-3 right-3 z-20 flex size-11 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                          ),
                          h.OnClick(props.onDismiss),
                          h.Type("button"),
                        ],
                        [closeIcon(h)],
                      ),
                      h.header(
                        [h.Class("flex flex-col gap-4 px-4 pt-5 pb-5 sm:px-6 sm:pt-6")],
                        [
                          featuredIcon(props.id, h),
                          h.div(
                            [h.Class("z-10 flex flex-col gap-0.5")],
                            [
                              h.h2(
                                [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                                ["Edit featured excerpt"],
                              ),
                              h.p(
                                [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                                ["This will be displayed on your profile."],
                              ),
                            ],
                          ),
                        ],
                      ),
                      h.div(
                        [h.Class("px-4 sm:px-6")],
                        [editor("mobile", props, h), editor("desktop", props, h)],
                      ),
                      h.footer(
                        [
                          h.Class(
                            "z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 sm:flex-row sm:items-center sm:px-6 sm:pt-8 sm:pb-6",
                          ),
                        ],
                        [
                          h.div(
                            [h.Class("mr-auto hidden md:block")],
                            [
                              button(
                                {
                                  color: "link-gray",
                                  iconLeadingElement: starsIcon(h),
                                  label: "Ask AI",
                                  onPress: props.onAskAi,
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
                              size: "lg",
                            },
                            h,
                          ),
                          button(
                            {
                              color: "primary",
                              label: "Save changes",
                              onPress: props.onSave,
                              size: "lg",
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
