/* oxlint-disable @rikalabs/no-low-signal-variable-names, @rikalabs/no-vague-verbs, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, mps/prefer-option-over-null, unicorn/no-nested-ternary -- The port keeps the upstream channel branches explicit and exposes optional controlled native inputs. */
import type { Html, HtmlBuilder } from "foldkit/html";

export type ColorPickerFormat = "hex" | "rgb" | "css" | "hsl" | "hsb";

export interface ColorPickerProps<Message> {
  readonly alpha?: number;
  readonly color: string;
  readonly format?: ColorPickerFormat;
  readonly isDisabled?: boolean;
  readonly isDialog?: boolean;
  readonly messageForAlpha?: (alpha: number) => NoInfer<Message>;
  readonly messageForColor?: (color: string) => NoInfer<Message>;
  readonly messageForFormat?: (format: ColorPickerFormat) => NoInfer<Message>;
  readonly onAddSaved?: NoInfer<Message>;
  readonly onEyeDropper?: NoInfer<Message>;
  readonly savedColors?: readonly string[];
  readonly savedLabel?: string;
}

export interface ColorChannels {
  readonly blue: number;
  readonly brightness: number;
  readonly green: number;
  readonly hue: number;
  readonly lightness: number;
  readonly lightnessSaturation: number;
  readonly red: number;
  readonly saturation: number;
}

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value));

const byte = (value: string): number => Number.parseInt(value, 16);

export const normalizeHexColor = (value: string): string => {
  const normalized = value.trim().replace(/^#/u, "");
  if (/^[\da-f]{3}$/iu.test(normalized)) {
    return `#${normalized
      .split("")
      .map((part) => `${part}${part}`)
      .join("")}`.toUpperCase();
  }
  return /^[\da-f]{6}$/iu.test(normalized) ? `#${normalized.toUpperCase()}` : "#7F56D9";
};

export const colorChannels = (value: string): ColorChannels => {
  const hex = normalizeHexColor(value);
  const red = byte(hex.slice(1, 3));
  const green = byte(hex.slice(3, 5));
  const blue = byte(hex.slice(5, 7));
  const high = Math.max(red, green, blue) / 255;
  const low = Math.min(red, green, blue) / 255;
  const delta = high - low;
  const redUnit = red / 255;
  const greenUnit = green / 255;
  const blueUnit = blue / 255;
  let hue = 0;
  if (delta !== 0 && high === redUnit) {
    hue = 60 * (((greenUnit - blueUnit) / delta) % 6);
  } else if (delta !== 0 && high === greenUnit) {
    hue = 60 * ((blueUnit - redUnit) / delta + 2);
  } else if (delta !== 0) {
    hue = 60 * ((redUnit - greenUnit) / delta + 4);
  }
  const lightness = (high + low) / 2;
  const lightnessSaturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  return {
    blue,
    brightness: high * 100,
    green,
    hue: hue < 0 ? hue + 360 : hue,
    lightness: lightness * 100,
    lightnessSaturation: lightnessSaturation * 100,
    red,
    saturation: (high === 0 ? 0 : delta / high) * 100,
  };
};

const channelHex = (value: number): string =>
  clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0");

export const hsbToHex = (hue: number, saturation: number, brightness: number): string => {
  const h = ((hue % 360) + 360) % 360;
  const s = clamp(saturation, 0, 100) / 100;
  const v = clamp(brightness, 0, 100) / 100;
  const chroma = v * s;
  const segment = h / 60;
  const x = chroma * (1 - Math.abs((segment % 2) - 1));
  const pair =
    segment < 1
      ? [chroma, x, 0]
      : segment < 2
        ? [x, chroma, 0]
        : segment < 3
          ? [0, chroma, x]
          : segment < 4
            ? [0, x, chroma]
            : segment < 5
              ? [x, 0, chroma]
              : [chroma, 0, x];
  const offset = v - chroma;
  return `#${channelHex((pair[0] + offset) * 255)}${channelHex((pair[1] + offset) * 255)}${channelHex((pair[2] + offset) * 255)}`.toUpperCase();
};

const colorFormatFrom = (format: string): ColorPickerFormat => {
  if (format === "rgb" || format === "css" || format === "hsl" || format === "hsb") {
    return format;
  }
  return "hex";
};

const thumb = <Message>(left: number, top: number, color: string, h: HtmlBuilder<Message>) =>
  h.span([
    h.AriaHidden(true),
    h.Class(
      "pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-fg-white shadow-md",
    ),
    h.Style({ background: color, left: `${String(left)}%`, top: `${String(top)}%` }),
  ]);

const range = <Message>(
  label: string,
  value: number,
  maximum: number,
  step: number,
  message: ((value: number) => Message) | undefined,
  h: HtmlBuilder<Message>,
) =>
  h.input([
    h.AriaLabel(label),
    h.Class("absolute inset-0 size-full cursor-pointer opacity-0"),
    h.Max(String(maximum)),
    h.Min("0"),
    h.Step(String(step)),
    h.Type("range"),
    h.Value(String(value)),
    ...(message === undefined ? [] : [h.OnInput((next) => message(Number(next)))]),
  ]);

const colorArea = <Message>(
  props: ColorPickerProps<Message>,
  channels: ColorChannels,
  h: HtmlBuilder<Message>,
) => {
  const emit = props.messageForColor;
  const color = normalizeHexColor(props.color);
  return h.div(
    [
      h.AriaLabel("Color picker"),
      h.Class(
        "relative aspect-square w-full shrink-0 overflow-hidden rounded-lg ring-[0.5px] ring-alpha-black/10 ring-inset",
      ),
      h.Role("group"),
      h.Style({
        background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), ${hsbToHex(channels.hue, 100, 100)}`,
      }),
    ],
    [
      range(
        "Saturation",
        channels.saturation,
        100,
        1,
        emit === undefined
          ? undefined
          : (value) => emit(hsbToHex(channels.hue, value, channels.brightness)),
        h,
      ),
      h.input([
        h.AriaLabel("Brightness"),
        h.Class("sr-only"),
        h.Max("100"),
        h.Min("0"),
        h.Type("range"),
        h.Value(String(channels.brightness)),
        ...(emit === undefined
          ? []
          : [h.OnInput((next) => emit(hsbToHex(channels.hue, channels.saturation, Number(next))))]),
      ]),
      thumb(channels.saturation, 100 - channels.brightness, color, h),
    ],
  );
};

const track = <Message>(
  label: "Alpha" | "Hue",
  value: number,
  maximum: number,
  step: number,
  color: string,
  message: ((value: number) => Message) | undefined,
  h: HtmlBuilder<Message>,
) =>
  h.div(
    [
      h.Class("relative h-3 w-full rounded-full ring-[0.5px] ring-alpha-black/10 ring-inset"),
      h.Style({
        background:
          label === "Hue"
            ? "linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)"
            : `linear-gradient(to right,transparent,${color}),repeating-conic-gradient(#ccc 0% 25%,white 0% 50%) 50% / 8px 8px`,
      }),
    ],
    [range(label, value, maximum, step, message, h), thumb((value / maximum) * 100, 50, color, h)],
  );

const valueInputs = <Message>(
  props: ColorPickerProps<Message>,
  channels: ColorChannels,
  h: HtmlBuilder<Message>,
) => {
  const format = props.format ?? "hex";
  const alpha = clamp(props.alpha ?? 1, 0, 1);
  const color = normalizeHexColor(props.color);
  if (format === "hex") {
    return h.div(
      [h.Class("flex w-0 flex-1 overflow-hidden shadow-xs")],
      [
        h.div(
          [
            h.Class(
              "flex min-w-0 flex-1 items-center gap-2 rounded-l-lg bg-bg-primary px-2.5 py-2 ring-1 ring-border-primary ring-inset focus-within:z-10 focus-within:ring-2 focus-within:ring-border-brand",
            ),
          ],
          [
            h.span([
              h.AriaHidden(true),
              h.Class("size-4 shrink-0 rounded-full ring-1 ring-alpha-black/10 ring-inset"),
              h.Style({ background: color }),
            ]),
            h.input([
              h.AriaLabel("Hex color"),
              h.Class("w-0 min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-hidden"),
              h.Readonly(true),
              h.Value(color),
            ]),
          ],
        ),
        h.input([
          h.AriaLabel("Alpha"),
          h.Class(
            "-ml-px w-14 shrink-0 rounded-r-lg bg-bg-primary px-2.5 py-2 text-sm text-text-primary outline-focus-ring ring-1 ring-border-primary ring-inset focus:z-10 focus:ring-2 focus:ring-border-brand",
          ),
          h.Readonly(true),
          h.Value(`${String(Math.round(alpha * 100))}%`),
        ]),
      ],
    );
  }
  const values =
    format === "css"
      ? [
          `rgba(${String(channels.red)}, ${String(channels.green)}, ${String(channels.blue)}, ${String(alpha)})`,
        ]
      : format === "rgb"
        ? [
            String(channels.red),
            String(channels.green),
            String(channels.blue),
            `${String(Math.round(alpha * 100))}%`,
          ]
        : format === "hsl"
          ? [
              String(Math.round(channels.hue)),
              String(Math.round(channels.lightnessSaturation)),
              String(Math.round(channels.lightness)),
              `${String(Math.round(alpha * 100))}%`,
            ]
          : [
              String(Math.round(channels.hue)),
              String(Math.round(channels.saturation)),
              String(Math.round(channels.brightness)),
              `${String(Math.round(alpha * 100))}%`,
            ];
  return h.div(
    [h.Class("flex w-0 flex-1 overflow-hidden shadow-xs")],
    values.map((value, index) =>
      h.input([
        h.AriaLabel(
          index === values.length - 1 && values.length > 1
            ? "Alpha"
            : `${format.toUpperCase()} value ${String(index + 1)}`,
        ),
        h.Class(
          `w-0 min-w-0 flex-1 bg-bg-primary px-2.5 py-2 text-sm text-text-primary outline-focus-ring ring-1 ring-border-primary ring-inset focus:z-10 focus:ring-2 focus:ring-border-brand ${index === 0 ? "rounded-l-lg" : "-ml-px"} ${index === values.length - 1 ? "rounded-r-lg" : ""}`,
        ),
        h.Readonly(true),
        h.Value(value),
      ]),
    ),
  );
};

const savedColors = <Message>(
  props: ColorPickerProps<Message>,
  h: HtmlBuilder<Message>,
): Html[] => {
  if (props.savedColors === undefined) {
    return [];
  }
  const emit = props.messageForColor;
  return [
    h.div(
      [h.Class("flex flex-col gap-3")],
      [
        h.div(
          [h.Class("flex items-center gap-3")],
          [
            h.p(
              [h.Class("flex-1 text-sm font-semibold text-text-secondary")],
              [props.savedLabel ?? "Saved"],
            ),
            ...(props.onAddSaved === undefined
              ? []
              : [
                  h.button(
                    [
                      h.Class(
                        "text-sm font-semibold text-text-tertiary outline-focus-ring focus-visible:outline-2",
                      ),
                      h.OnClick(props.onAddSaved),
                      h.Type("button"),
                    ],
                    ["+ Add"],
                  ),
                ]),
          ],
        ),
        h.div(
          [
            h.AriaLabel(props.savedLabel ?? "Saved"),
            h.Class("flex flex-wrap gap-2"),
            h.Role("listbox"),
          ],
          props.savedColors.map((saved) =>
            h.button([
              h.AriaLabel(`Select ${saved}`),
              h.Class(
                "size-5 cursor-pointer rounded-full ring-1 ring-alpha-black/10 ring-inset outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
              ),
              h.Role("option"),
              h.Style({ background: saved }),
              h.Type("button"),
              ...(emit === undefined ? [] : [h.OnClick(emit(saved))]),
            ]),
          ),
        ),
      ],
    ),
  ];
};

export const colorPicker = <Message>(
  props: ColorPickerProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const channels = colorChannels(props.color);
  const alpha = clamp(props.alpha ?? 1, 0, 1);
  const color = normalizeHexColor(props.color);
  const emit = props.messageForColor;
  const emitAlpha = props.messageForAlpha;
  const emitFormat = props.messageForFormat;
  const content = h.div(
    [h.Class("flex flex-col gap-4")],
    [
      colorArea(props, channels, h),
      h.div(
        [h.Class("flex flex-col gap-4")],
        [
          h.div(
            [h.Class("flex items-start gap-3")],
            [
              h.button(
                [
                  h.AriaLabel("Pick a color from the screen"),
                  h.Class(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Disabled(props.isDisabled === true),
                  h.Type("button"),
                  ...(props.onEyeDropper === undefined ? [] : [h.OnClick(props.onEyeDropper)]),
                ],
                [
                  h.svg(
                    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
                    [
                      h.path([
                        h.D(
                          "m10.5 6.5 7 7M2 22s4.5-.5 7-3L21 7a2.828 2.828 0 1 0-4-4L5 15c-2.5 2.5-3 7-3 7Z",
                        ),
                        h.Stroke("currentColor"),
                        h.StrokeLinecap("round"),
                        h.StrokeLinejoin("round"),
                        h.StrokeWidth("2"),
                      ]),
                    ],
                  ),
                ],
              ),
              h.div(
                [h.Class("flex flex-1 flex-col gap-3")],
                [
                  track(
                    "Hue",
                    channels.hue,
                    360,
                    1,
                    color,
                    emit === undefined
                      ? undefined
                      : (value) => emit(hsbToHex(value, channels.saturation, channels.brightness)),
                    h,
                  ),
                  track("Alpha", alpha, 1, 0.01, color, emitAlpha, h),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("flex items-center gap-3")],
            [
              h.select(
                [
                  h.AriaLabel("Color format"),
                  h.Class(
                    "w-20 shrink-0 rounded-lg bg-bg-primary px-3 py-2 text-sm text-text-primary shadow-xs ring-1 ring-border-primary outline-focus-ring focus:ring-2 focus:ring-border-brand",
                  ),
                  h.Disabled(props.isDisabled === true),
                  h.Value(props.format ?? "hex"),
                  ...(emitFormat === undefined
                    ? []
                    : [h.OnChange((next) => emitFormat(colorFormatFrom(next)))]),
                ],
                (["hex", "rgb", "css", "hsl", "hsb"] as const).map((format) =>
                  h.option([h.Value(format)], [format === "hex" ? "Hex" : format.toUpperCase()]),
                ),
              ),
              valueInputs(props, channels, h),
            ],
          ),
        ],
      ),
      ...savedColors(props, h),
    ],
  );
  return props.isDialog === true
    ? h.div(
        [
          h.Class(
            "relative flex w-80 flex-col overflow-clip rounded-2xl bg-bg-primary p-4 shadow-xl ring-1 ring-border-secondary",
          ),
        ],
        [content],
      )
    : content;
};
