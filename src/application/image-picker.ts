/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity -- The renderer keeps the seven upstream controlled adjustment channels and native upload branches explicit. */
import type { Html, HtmlBuilder } from "foldkit/html";

export type ImageFillMode = "fill" | "fit" | "crop" | "tile";

export interface ImageAdjustments {
  readonly exposure: number;
  readonly contrast: number;
  readonly saturation: number;
  readonly temperature: number;
  readonly tint: number;
  readonly highlights: number;
  readonly shadows: number;
}

export interface ImagePickerProps<Message> {
  readonly adjustments: ImageAdjustments;
  readonly fillMode: ImageFillMode;
  readonly id?: string;
  readonly imageAlt?: string;
  readonly imageUrl?: string;
  readonly isDraggingOver?: boolean;
  readonly messageForAdjustment?: (key: keyof ImageAdjustments, value: number) => NoInfer<Message>;
  readonly messageForDragState?: (isDraggingOver: boolean) => NoInfer<Message>;
  readonly messageForFiles?: (files: readonly File[]) => NoInfer<Message>;
  readonly messageForFillMode?: (mode: ImageFillMode) => NoInfer<Message>;
  readonly onRotate?: NoInfer<Message>;
  readonly rotation?: number;
}

export const defaultImageAdjustments: ImageAdjustments = {
  contrast: 0,
  exposure: 0,
  highlights: 0,
  saturation: 0,
  shadows: 0,
  temperature: 0,
  tint: 0,
};

const adjustmentLabels: readonly Readonly<{
  key: keyof ImageAdjustments;
  label: string;
}>[] = [
  { key: "exposure", label: "Exposure" },
  { key: "contrast", label: "Contrast" },
  { key: "saturation", label: "Saturation" },
  { key: "temperature", label: "Temperature" },
  { key: "tint", label: "Tint" },
  { key: "highlights", label: "Highlights" },
  { key: "shadows", label: "Shadows" },
];

const fillModes: readonly Readonly<{ id: ImageFillMode; label: string }>[] = [
  { id: "fill", label: "Fill" },
  { id: "fit", label: "Fit" },
  { id: "crop", label: "Crop" },
  { id: "tile", label: "Tile" },
];

const imageFillModeFrom = (candidate: string): ImageFillMode => {
  if (candidate === "fit" || candidate === "crop" || candidate === "tile") {
    return candidate;
  }
  return "fill";
};

const uploadIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 20 20")],
    [
      h.path([
        h.D(
          "M10 13.5V3m0 0L6 7m4-4 4 4M4.5 10.5H4A2.5 2.5 0 0 0 1.5 13v2.5A2.5 2.5 0 0 0 4 18h12a2.5 2.5 0 0 0 2.5-2.5V13a2.5 2.5 0 0 0-2.5-2.5h-.5",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const rotateIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 20 20")],
    [
      h.path([
        h.D(
          "M2.5 5.833h3.333M17.5 14.167h-3.333M4.056 13.333A6.667 6.667 0 0 0 15.61 15.5l1.89-1.333M2.5 5.833 4.39 4.5A6.667 6.667 0 0 1 15.944 6.667",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const adjustmentFilter = (adjustments: ImageAdjustments): string => {
  const brightness = 100 + adjustments.exposure / 2;
  const contrast = 100 + adjustments.contrast;
  const saturation = 100 + adjustments.saturation;
  const temperature = adjustments.temperature / 10;
  const tint = adjustments.tint / 18;
  return `brightness(${String(brightness)}%) contrast(${String(contrast)}%) saturate(${String(saturation)}%) sepia(${String(Math.abs(temperature))}%) hue-rotate(${String(tint)}deg)`;
};

const selectedImage = <Message>(
  props: ImagePickerProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const rotation = props.rotation ?? 0;
  if (props.fillMode === "tile") {
    return h.div([
      h.AriaLabel(props.imageAlt ?? "Selected image"),
      h.Class("absolute inset-0 size-full bg-repeat"),
      h.Role("img"),
      h.Style({
        backgroundImage: `url(${props.imageUrl ?? ""})`,
        backgroundSize: "50% 50%",
        filter: adjustmentFilter(props.adjustments),
        transform: `rotate(${String(rotation)}deg)`,
      }),
    ]);
  }
  return h.img([
    h.Alt(props.imageAlt ?? "Selected image"),
    h.Class(
      `absolute inset-0 size-full ${props.fillMode === "fit" ? "bg-black object-contain" : "object-cover"}`,
    ),
    h.Src(props.imageUrl ?? ""),
    h.Style({
      filter: adjustmentFilter(props.adjustments),
      transform: `rotate(${String(rotation)}deg)`,
    }),
  ]);
};

const imageCanvas = <Message>(props: ImagePickerProps<Message>, h: HtmlBuilder<Message>): Html => {
  const inputId = props.id ?? "image-picker-upload";
  const filesMessage = props.messageForFiles;
  const dragMessage = props.messageForDragState;
  return h.div(
    [
      h.AriaLabel("Drop image to upload"),
      h.Class(
        `relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-[0.5px] border-black/10 outline-hidden ${props.isDraggingOver === true ? "ring-2 ring-brand" : ""}`,
      ),
      h.Role("group"),
      h.AllowDrop(),
      ...(dragMessage === undefined
        ? []
        : [
            h.OnDragEnter(dragMessage(true)),
            h.OnDragOver(dragMessage(true)),
            h.OnDragLeave(dragMessage(false)),
          ]),
      ...(filesMessage === undefined ? [] : [h.OnDropFiles((files) => filesMessage(files))]),
    ],
    props.imageUrl === undefined
      ? [
          h.div([
            h.AriaHidden(true),
            h.Class("absolute inset-0 rounded-lg opacity-15"),
            h.Style({
              backgroundImage: "repeating-conic-gradient(#ccc 0% 25%,white 0% 50%)",
              backgroundSize: "32px 32px",
            }),
          ]),
          h.div([h.AriaHidden(true), h.Class("absolute inset-0 rounded-lg bg-black/40")]),
          h.div(
            [h.Class("relative flex flex-col items-center gap-2")],
            [
              h.label(
                [h.Class("relative inline-flex")],
                [
                  h.input([
                    h.Accept("image/*"),
                    h.AriaLabel("Click to upload"),
                    h.Class("peer absolute inset-0 z-10 size-full cursor-pointer opacity-0"),
                    h.Id(inputId),
                    h.Type("file"),
                    ...(filesMessage === undefined
                      ? []
                      : [h.OnFileChange((files) => filesMessage(files))]),
                  ]),
                  h.span(
                    [
                      h.Class(
                        "relative inline-flex items-center justify-center gap-1 rounded-lg bg-bg-primary px-3 py-2 text-sm font-semibold text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary outline-1 outline-offset-0 outline-secondary_alt ring-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2",
                      ),
                    ],
                    [uploadIcon(h), h.span([h.Class("px-0.5")], ["Click to upload"])],
                  ),
                ],
              ),
              h.p([h.Class("text-sm font-semibold text-white")], ["or drag and drop"]),
            ],
          ),
        ]
      : [selectedImage(props, h)],
  );
};

const fillModeSelect = <Message>(
  props: ImagePickerProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const emit = props.messageForFillMode;
  return h.label(
    [h.Class("relative inline-flex items-center text-sm font-semibold text-text-tertiary")],
    [
      h.select(
        [
          h.AriaLabel("Image fill mode"),
          h.Class("appearance-none bg-transparent pr-5 outline-focus-ring"),
          h.Value(props.fillMode),
          ...(emit === undefined ? [] : [h.OnChange((mode) => emit(imageFillModeFrom(mode)))]),
        ],
        fillModes.map((mode) => h.option([h.Value(mode.id)], [mode.label])),
      ),
      h.svg(
        [
          h.AriaHidden(true),
          h.Class("pointer-events-none absolute right-0 size-3"),
          h.Fill("none"),
          h.ViewBox("0 0 12 12"),
        ],
        [
          h.path([
            h.D("m3 4.5 3 3 3-3"),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeLinejoin("round"),
            h.StrokeWidth("1.5"),
          ]),
        ],
      ),
    ],
  );
};

const adjustmentSlider = <Message>(
  props: ImagePickerProps<Message>,
  key: keyof ImageAdjustments,
  label: string,
  h: HtmlBuilder<Message>,
): Html => {
  const emit = props.messageForAdjustment;
  return h.label(
    [h.Class("flex items-center gap-3")],
    [
      h.span([h.Class("w-[88px] shrink-0 text-sm font-semibold text-text-secondary")], [label]),
      h.input([
        h.AriaLabel(label),
        h.Class(
          "h-3 flex-1 cursor-pointer appearance-none rounded-full border border-border-primary bg-bg-tertiary accent-fg-white outline-focus-ring [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-fg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-border-secondary-alt focus-visible:outline-2 focus-visible:outline-offset-2",
        ),
        h.Max("100"),
        h.Min("-100"),
        h.Type("range"),
        h.Value(String(props.adjustments[key])),
        ...(emit === undefined ? [] : [h.OnInput((value) => emit(key, Number(value)))]),
      ]),
    ],
  );
};

export const imagePicker = <Message>(
  props: ImagePickerProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("flex flex-col gap-4")],
    [
      imageCanvas(props, h),
      h.div(
        [h.Class("flex flex-col gap-3")],
        [
          h.div(
            [h.Class("flex items-center justify-between")],
            [
              fillModeSelect(props, h),
              h.button(
                [
                  h.AriaLabel("Rotate image"),
                  h.Class(
                    "inline-flex items-center justify-center rounded-md p-1.5 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-primary focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Type("button"),
                  ...(props.onRotate === undefined ? [] : [h.OnClick(props.onRotate)]),
                ],
                [rotateIcon(h)],
              ),
            ],
          ),
          h.div(
            [h.Class("flex flex-col gap-4")],
            adjustmentLabels.map(({ key, label }) => adjustmentSlider(props, key, label, h)),
          ),
        ],
      ),
    ],
  );
