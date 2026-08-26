/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary -- The controlled renderer preserves the authenticated cropper anatomy and native image input. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import type { FileUploadResult } from "./file-upload-base.ts";
import { classifyUploadFiles } from "./file-upload-base.ts";

export interface ImageCropOption {
  readonly alt: string;
  readonly src: string;
}

export interface ImageCropModalProps<Message> {
  readonly cropHeightPercent: number;
  readonly cropTopPercent: number;
  readonly id: string;
  readonly images: readonly ImageCropOption[];
  readonly isOpen: boolean;
  readonly onCancel: NoInfer<Message>;
  readonly onCropKeyboardMove: (deltaPercent: number) => NoInfer<Message>;
  readonly onCropPointerDown: (screenY: number) => NoInfer<Message>;
  readonly onCropPointerMove: (screenY: number) => NoInfer<Message>;
  readonly onCropPointerUp: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onImageSelected: (src: string) => NoInfer<Message>;
  readonly onSave: NoInfer<Message>;
  readonly onUpload: (result: FileUploadResult) => NoInfer<Message>;
  readonly selectedSrc: string;
}

const icon = <Message>(kind: "close" | "crop" | "plus", h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D(
          kind === "close"
            ? "M18 6 6 18M6 6l12 12"
            : kind === "plus"
              ? "M12 5v14m-7-7h14"
              : "M2 6h12.8c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C18 7.52 18 8.08 18 9.2V22m4-4H9.2c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C6 16.48 6 15.92 6 14.8V2",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const cropHandle = <Message>(position: "ne" | "nw" | "se" | "sw", h: HtmlBuilder<Message>): Html =>
  h.span([
    h.AriaHidden(true),
    h.Class(
      `absolute z-10 size-3 border-2 border-border-brand bg-white ${position.includes("n") ? "top-0 -translate-y-1/2" : "bottom-0 translate-y-1/2"} ${position.includes("w") ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"}`,
    ),
  ]);

const cropper = <Message>(props: ImageCropModalProps<Message>, h: HtmlBuilder<Message>): Html => {
  const selected =
    props.images.find((image) => image.src === props.selectedSrc) ?? props.images.at(0);
  return h.div(
    [
      h.Class(
        "relative h-50 w-full self-stretch rounded-lg bg-transparent backdrop-brightness-70 sm:h-78",
      ),
      h.DataAttribute("cropper", ""),
      h.Style({
        "background-image":
          "linear-gradient(45deg,#808080 25%,transparent 25%),linear-gradient(-45deg,#808080 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#808080 75%),linear-gradient(-45deg,transparent 75%,#808080 75%)",
        "background-position": "0 0,0 15px,15px -15px,-15px 0",
        "background-size": "30px 30px",
      }),
      h.OnPointerMove((_screenX, screenY) => Option.some(props.onCropPointerMove(screenY))),
      h.OnPointerUp(() => Option.some(props.onCropPointerUp)),
      h.OnPointerLeave(() => Option.some(props.onCropPointerUp)),
    ],
    selected === undefined
      ? []
      : [
          h.img([
            h.Alt(selected.alt),
            h.Class("size-full rounded-lg object-contain object-center"),
            h.Src(selected.src),
          ]),
          h.div([
            h.AriaHidden(true),
            h.Class("pointer-events-none absolute top-0 right-0 left-0 rounded-t-lg bg-black/50"),
            h.Style({ height: `${String(props.cropTopPercent)}%` }),
          ]),
          h.div([
            h.AriaHidden(true),
            h.Class(
              "pointer-events-none absolute right-0 bottom-0 left-0 rounded-b-lg bg-black/50",
            ),
            h.Style({
              height: `${String(100 - props.cropTopPercent - props.cropHeightPercent)}%`,
            }),
          ]),
          h.div(
            [
              h.AriaLabel("Crop area"),
              h.AriaValuemax(100),
              h.AriaValuemin(0),
              h.AriaValuenow(Math.round(props.cropTopPercent)),
              h.Class(
                "absolute right-0 left-0 cursor-move border border-border-brand bg-transparent shadow-[inset_0_0_0_1px_var(--color-border-brand)] outline-none",
              ),
              h.OnPointerDown((_pointerType, buttonNumber, _screenX, screenY) =>
                buttonNumber === 0 ? Option.some(props.onCropPointerDown(screenY)) : Option.none(),
              ),
              h.OnKeyDownPreventDefault((key) =>
                key === "ArrowUp"
                  ? Option.some(props.onCropKeyboardMove(-1))
                  : key === "ArrowDown"
                    ? Option.some(props.onCropKeyboardMove(1))
                    : Option.none(),
              ),
              h.Role("slider"),
              h.Style({
                height: `${String(props.cropHeightPercent)}%`,
                top: `${String(props.cropTopPercent)}%`,
              }),
              h.Tabindex(0),
            ],
            [
              h.div([
                h.AriaHidden(true),
                h.Class("pointer-events-none absolute inset-0 bg-transparent"),
              ]),
              cropHandle("nw", h),
              cropHandle("ne", h),
              cropHandle("sw", h),
              cropHandle("se", h),
            ],
          ),
        ],
  );
};

const thumbnailPicker = <Message>(
  props: ImageCropModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const uploadId = `${props.id}-upload`;
  return h.div(
    [h.Class("flex flex-wrap items-center justify-start gap-y-2")],
    [
      ...props.images.map((image) =>
        h.button(
          [
            h.AriaLabel(`Select image ${image.alt}`),
            h.Class(
              `flex size-10 cursor-pointer items-center justify-center rounded-full p-1.5 outline-hidden transition duration-150 ease-linear ring-inset focus-visible:ring-3 focus-visible:ring-border-brand ${image.src === props.selectedSrc ? "ring-3 ring-border-brand" : ""}`,
            ),
            h.OnClick(props.onImageSelected(image.src)),
            h.Type("button"),
          ],
          [
            h.img([
              h.Alt(image.alt),
              h.Class("size-full rounded-full object-cover object-center"),
              h.Src(image.src),
            ]),
          ],
        ),
      ),
      h.div([h.AriaHidden(true), h.Class("h-px w-2")]),
      h.div(
        [h.Class("relative mr-2")],
        [
          h.input([
            h.Accept("image/*"),
            h.Class("peer sr-only"),
            h.Id(uploadId),
            h.OnFileChange((files) =>
              props.onUpload(
                classifyUploadFiles(files, { accept: "image/*", allowsMultiple: false }),
              ),
            ),
            h.Type("file"),
          ]),
          h.label(
            [
              h.AriaLabel("Add image"),
              h.Class(
                "flex size-9 cursor-pointer items-center justify-center rounded-lg bg-bg-primary text-fg-quaternary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring peer-focus-visible:outline-2",
              ),
              h.For(uploadId),
            ],
            [icon("plus", h)],
          ),
        ],
      ),
    ],
  );
};

export const imageCropModal = <Message>(
  props: ImageCropModalProps<Message>,
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
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-[361px] max-w-[calc(100%-32px)] overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 shadow-xl outline-hidden sm:m-auto sm:w-140 sm:max-w-[calc(100%-64px)] sm:rounded-2xl",
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
                    [icon("close", h)],
                  ),
                  h.header(
                    [h.Class("flex gap-4 px-4 pt-5 sm:px-6 sm:pt-6")],
                    [
                      h.div(
                        [
                          h.Class(
                            "hidden size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset sm:flex",
                          ),
                        ],
                        [icon("crop", h)],
                      ),
                      h.div(
                        [h.Class("z-10 flex flex-col gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            ["Crop header image"],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            ["Upload a 1600 × 480px image for best results."],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div(
                    [h.Class("flex flex-col gap-4 px-4 sm:px-6 md:gap-5")],
                    [cropper(props, h), thumbnailPicker(props, h)],
                  ),
                  h.footer(
                    [h.Class("z-10 flex flex-col pt-6 pb-4 sm:pt-8 sm:pb-6")],
                    [
                      h.div([h.Class("hidden w-full border-t border-border-secondary md:block")]),
                      h.div([h.Class("hidden h-4 w-full sm:h-6 md:block")]),
                      h.div(
                        [
                          h.Class(
                            "flex flex-1 flex-col-reverse gap-3 px-4 sm:flex-row sm:justify-end sm:px-6",
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
                              label: "Save changes",
                              onPress: props.onSave,
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
