/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity -- The port preserves the upstream controlled stop anatomy, native inputs, and pointer branches without a framework runtime. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

import { angleToGradientPoints, gradientCss, gradientPointAt } from "./gradient-picker-utils.ts";
import type { GradientStop, GradientType } from "./gradient-picker-utils.ts";

export interface GradientDrag {
  readonly startPosition: number;
  readonly startScreenX: number;
  readonly stopId: string;
}

export interface GradientPickerProps<Message> {
  readonly angle: number;
  readonly drag?: GradientDrag;
  readonly messageForAddStop?: NoInfer<Message>;
  readonly messageForDragEnd?: NoInfer<Message>;
  readonly messageForDragMove?: (screenX: number, screenY: number) => NoInfer<Message>;
  readonly messageForDragStart?: (
    stopId: string,
    position: number,
    screenX: number,
    screenY: number,
  ) => NoInfer<Message>;
  readonly messageForRemoveStop?: (stopId: string) => NoInfer<Message>;
  readonly messageForReverse?: NoInfer<Message>;
  readonly messageForSelectStop?: (stopId: string) => NoInfer<Message>;
  readonly messageForStopAlpha?: (stopId: string, alpha: number) => NoInfer<Message>;
  readonly messageForStopColor?: (stopId: string, color: string) => NoInfer<Message>;
  readonly messageForStopPosition?: (stopId: string, position: number) => NoInfer<Message>;
  readonly messageForType?: (type: GradientType) => NoInfer<Message>;
  readonly selectedStopId?: string;
  readonly stops: readonly GradientStop[];
  readonly type: GradientType;
}

export const defaultGradientStops: readonly GradientStop[] = [
  { alpha: 100, color: "#0B7D74", id: "teal-1", position: 0 },
  { alpha: 100, color: "#054F4A", id: "teal-2", position: 100 },
];

const gradientTypes: readonly Readonly<{ id: GradientType; label: string }>[] = [
  { id: "linear", label: "Linear" },
  { id: "radial", label: "Radial" },
  { id: "angular", label: "Angular" },
  { id: "diamond", label: "Diamond" },
];

const gradientTypeFrom = (candidate: string): GradientType => {
  if (candidate === "radial" || candidate === "angular" || candidate === "diamond") {
    return candidate;
  }
  return "linear";
};

const moveMessage = <Message>(
  props: GradientPickerProps<Message>,
  stop: GradientStop,
  key: string,
): Option.Option<Message> => {
  const emit = props.messageForStopPosition;
  if (emit === undefined) {
    return Option.none();
  }
  if (key === "ArrowRight" || key === "ArrowUp") {
    return Option.some(emit(stop.id, Math.min(100, stop.position + 1)));
  }
  if (key === "ArrowLeft" || key === "ArrowDown") {
    return Option.some(emit(stop.id, Math.max(0, stop.position - 1)));
  }
  const remove = props.messageForRemoveStop;
  if ((key === "Delete" || key === "Backspace") && props.stops.length > 2 && remove !== undefined) {
    return Option.some(remove(stop.id));
  }
  return Option.none();
};

const stopThumb = <Message>(
  props: GradientPickerProps<Message>,
  stop: GradientStop,
  classes: string,
  style: Readonly<Record<string, string>>,
  h: HtmlBuilder<Message>,
): Html => {
  const select = props.messageForSelectStop;
  const start = props.messageForDragStart;
  return h.button([
    h.AriaLabel(`Gradient stop at ${String(Math.round(stop.position))}%`),
    h.AriaValuemax(100),
    h.AriaValuemin(0),
    h.AriaValuenow(Math.round(stop.position)),
    h.Class(classes),
    h.Role("slider"),
    h.Style({ ...style, background: stop.color }),
    h.Type("button"),
    ...(select === undefined ? [] : [h.OnFocus(select(stop.id))]),
    h.OnKeyDownPreventDefault((key) => moveMessage(props, stop, key)),
    ...(start === undefined
      ? []
      : [
          h.OnPointerDown((_pointerType, button, screenX, screenY) =>
            button === 0
              ? Option.some(start(stop.id, stop.position, screenX, screenY))
              : Option.none(),
          ),
        ]),
  ]);
};

const dragAttributes = <Message>(props: GradientPickerProps<Message>, h: HtmlBuilder<Message>) => {
  const move = props.messageForDragMove;
  const end = props.messageForDragEnd;
  return [
    ...(move === undefined
      ? []
      : [h.OnPointerMove((screenX, screenY) => Option.some(move(screenX, screenY)))]),
    ...(end === undefined
      ? []
      : [
          h.OnPointerUp(() => Option.some(end)),
          h.OnPointerLeave(() => (props.drag === undefined ? Option.none() : Option.some(end))),
        ]),
  ];
};

const gradientArea = <Message>(
  props: GradientPickerProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const line = angleToGradientPoints(props.angle);
  const sorted = [...props.stops].toSorted((left, right) => left.position - right.position);
  const first = sorted.at(0);
  const last = sorted.at(-1);
  const start = gradientPointAt(line.start, line.end, first?.position ?? 0);
  const end = gradientPointAt(line.start, line.end, last?.position ?? 100);
  return h.div(
    [
      h.AriaLabel("Gradient direction and stops"),
      h.Class("relative aspect-square w-full rounded-lg"),
      h.Role("group"),
      ...dragAttributes(props, h),
    ],
    [
      h.div([
        h.Class(
          "absolute inset-0 overflow-hidden rounded-lg ring-[0.5px] ring-alpha-black/10 ring-inset",
        ),
        h.Style({ background: gradientCss(props.stops, props.type, props.angle) }),
      ]),
      h.svg(
        [
          h.AriaHidden(true),
          h.Class("pointer-events-none absolute inset-0 size-full overflow-visible"),
          h.ViewBox("0 0 100 100"),
        ],
        [
          h.line([
            h.Stroke("rgba(255,255,255,0.5)"),
            h.StrokeDasharray("0.9375 1.5625"),
            h.StrokeLinecap("round"),
            h.StrokeWidth("0.625"),
            h.X1(String(start.x)),
            h.X2(String(end.x)),
            h.Y1(String(start.y)),
            h.Y2(String(end.y)),
          ]),
        ],
      ),
      ...sorted.map((stop, index) => {
        const point = gradientPointAt(line.start, line.end, stop.position);
        const endpoint = index === 0 || index === sorted.length - 1;
        return stopThumb(
          props,
          stop,
          `absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-[3px] border-white shadow-md outline-0 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 active:cursor-grabbing ${endpoint ? "size-5" : "size-4"}`,
          { left: `${String(point.x)}%`, top: `${String(point.y)}%` },
          h,
        );
      }),
    ],
  );
};

const typeSelect = <Message>(
  props: GradientPickerProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const emit = props.messageForType;
  return h.label(
    [h.Class("relative inline-flex items-center text-sm font-semibold text-text-tertiary")],
    [
      h.select(
        [
          h.AriaLabel("Gradient type"),
          h.Class("appearance-none bg-transparent pr-5 outline-focus-ring"),
          h.Value(props.type),
          ...(emit === undefined ? [] : [h.OnChange((next) => emit(gradientTypeFrom(next)))]),
        ],
        gradientTypes.map((type) => h.option([h.Value(type.id)], [type.label])),
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

const reverseIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 20 20")],
    [
      h.path([
        h.D("M16.667 5H3.333m0 0 3-3m-3 3 3 3m-3 7h13.334m0 0-3-3m3 3-3 3"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const gradientSlider = <Message>(
  props: GradientPickerProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "relative h-3 w-full cursor-pointer rounded-full ring-[0.5px] ring-alpha-black/10 ring-inset",
      ),
      h.Style({ background: gradientCss(props.stops, "linear", 90) }),
      ...dragAttributes(props, h),
    ],
    props.stops.map((stop) =>
      stopThumb(
        props,
        stop,
        "absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-[3px] border-white shadow-md outline-0 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 active:cursor-grabbing",
        { left: `${String(stop.position)}%` },
        h,
      ),
    ),
  );

const minusIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-4"), h.Fill("none"), h.ViewBox("0 0 16 16")],
    [
      h.path([
        h.D("M3.333 8h9.334"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeWidth("1.5"),
      ]),
    ],
  );

const stopRow = <Message>(
  props: GradientPickerProps<Message>,
  stop: GradientStop,
  h: HtmlBuilder<Message>,
): Html => {
  const position = props.messageForStopPosition;
  const color = props.messageForStopColor;
  const alpha = props.messageForStopAlpha;
  const remove = props.messageForRemoveStop;
  return h.div(
    [h.Class("flex items-center gap-3")],
    [
      h.div(
        [
          h.Class(
            "w-14 shrink-0 overflow-hidden rounded-lg bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset focus-within:ring-2 focus-within:ring-border-brand",
          ),
        ],
        [
          h.input([
            h.AriaLabel(`Position for stop ${stop.id}`),
            h.Class("w-full bg-transparent px-2.5 py-2 text-sm text-text-primary outline-hidden"),
            h.Type("text"),
            h.Value(`${String(Math.round(stop.position))}%`),
            ...(position === undefined
              ? []
              : [h.OnInput((next) => position(stop.id, Math.trunc(Number(next))))]),
          ]),
        ],
      ),
      h.div(
        [h.Class("flex flex-1 items-center gap-1")],
        [
          h.div(
            [h.Class("flex flex-1 shadow-xs")],
            [
              h.div(
                [
                  h.Class(
                    "flex flex-1 items-center gap-2 rounded-l-lg bg-bg-primary px-2.5 py-2 ring-1 ring-border-primary ring-inset focus-within:z-10 focus-within:ring-2 focus-within:ring-border-brand",
                  ),
                ],
                [
                  h.span([
                    h.AriaHidden(true),
                    h.Class("size-4 shrink-0 rounded-full ring-1 ring-alpha-black/10 ring-inset"),
                    h.Style({ background: stop.color }),
                  ]),
                  h.input([
                    h.AriaLabel("Stop color"),
                    h.Class(
                      "w-0 min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-hidden",
                    ),
                    h.Value(stop.color),
                    ...(color === undefined ? [] : [h.OnInput((next) => color(stop.id, next))]),
                  ]),
                ],
              ),
              h.input([
                h.AriaLabel("Stop alpha"),
                h.Class(
                  "-ml-px w-14 shrink-0 rounded-r-lg bg-bg-primary px-2.5 py-2 text-sm text-text-primary outline-focus-ring ring-1 ring-border-primary ring-inset focus:z-10 focus:ring-2 focus:ring-border-brand",
                ),
                h.Type("text"),
                h.Value(`${String(stop.alpha)}%`),
                ...(alpha === undefined
                  ? []
                  : [h.OnInput((next) => alpha(stop.id, Math.trunc(Number(next))))]),
              ]),
            ],
          ),
          h.button(
            [
              h.AriaLabel("Remove stop"),
              h.Class(
                "inline-flex items-center justify-center rounded-md p-1.5 text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-primary focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-50",
              ),
              h.Disabled(props.stops.length <= 2),
              h.Type("button"),
              ...(remove === undefined || props.stops.length <= 2
                ? []
                : [h.OnClick(remove(stop.id))]),
            ],
            [minusIcon(h)],
          ),
        ],
      ),
    ],
  );
};

const stopList = <Message>(props: GradientPickerProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class("flex flex-col gap-3")],
    [
      h.div(
        [h.Class("flex items-center gap-3")],
        [
          h.p([h.Class("flex-1 text-sm font-semibold text-text-secondary")], ["Stops"]),
          h.button(
            [
              h.Class(
                "inline-flex items-center gap-1 rounded text-sm font-semibold text-text-tertiary outline-focus-ring hover:text-text-tertiary-hover focus-visible:outline-2",
              ),
              h.Type("button"),
              ...(props.messageForAddStop === undefined
                ? []
                : [h.OnClick(props.messageForAddStop)]),
            ],
            [
              h.span([h.AriaHidden(true), h.Class("text-lg leading-none")], ["+"]),
              h.span([h.Class("px-0.5")], ["Add"]),
            ],
          ),
        ],
      ),
      h.div(
        [h.Class("flex flex-col gap-3")],
        props.stops.map((stop) => stopRow(props, stop, h)),
      ),
    ],
  );

export const gradientPicker = <Message>(
  props: GradientPickerProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("flex flex-col gap-4")],
    [
      gradientArea(props, h),
      h.div(
        [h.Class("flex flex-col gap-3")],
        [
          h.div(
            [h.Class("flex items-center justify-between")],
            [
              typeSelect(props, h),
              h.button(
                [
                  h.AriaLabel("Reverse gradient"),
                  h.Class(
                    "inline-flex items-center justify-center rounded-md p-1.5 text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-primary focus-visible:outline-2",
                  ),
                  h.Type("button"),
                  ...(props.messageForReverse === undefined
                    ? []
                    : [h.OnClick(props.messageForReverse)]),
                ],
                [reverseIcon(h)],
              ),
            ],
          ),
          gradientSlider(props, h),
        ],
      ),
      stopList(props, h),
    ],
  );

export type { GradientStop, GradientType } from "./gradient-picker-utils.ts";
export { gradientCss, moveGradientStop, reverseGradientStops } from "./gradient-picker-utils.ts";
