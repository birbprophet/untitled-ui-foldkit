/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-low-signal-variable-names, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook exercises the exact controlled stop model without exposing interaction state as Args. */
import * as S from "effect/Schema";
import type { Html, HtmlBuilder } from "foldkit/html";
import {
  defaultGradientStops,
  gradientPicker,
  moveGradientStop,
  reverseGradientStops,
} from "../../../src/application.ts";
import type { GradientPickerProps, GradientStop, GradientType } from "../../../src/application.ts";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Type = S.Union([
  S.Literal("linear"),
  S.Literal("radial"),
  S.Literal("angular"),
  S.Literal("diamond"),
]);
const Stop = S.Struct({ alpha: S.Number, color: S.String, id: S.String, position: S.Number });
const Args = S.Struct({ angle: S.Number, stops: S.Array(Stop), type: Type });
const Model = S.Struct({
  ...Args.fields,
  dragStartPosition: S.Number,
  dragStartScreenX: S.Number,
  dragStopId: S.String,
  selectedStopId: S.String,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "AddStop" }>
  | Readonly<{ _tag: "DragEnded" }>
  | Readonly<{ _tag: "DragMoved"; screenX: number; screenY: number }>
  | Readonly<{
      _tag: "DragStarted";
      position: number;
      screenX: number;
      screenY: number;
      stopId: string;
    }>
  | Readonly<{ _tag: "RemoveStop"; stopId: string }>
  | Readonly<{ _tag: "Reverse" }>
  | Readonly<{ _tag: "SelectStop"; stopId: string }>
  | Readonly<{ _tag: "StopAlphaChanged"; alpha: number; stopId: string }>
  | Readonly<{ _tag: "StopColorChanged"; color: string; stopId: string }>
  | Readonly<{ _tag: "StopMoved"; position: number; stopId: string }>
  | Readonly<{ _tag: "TypeChanged"; type: GradientType }>;

const addStop: Message = { _tag: "AddStop" };
const dragEnded: Message = { _tag: "DragEnded" };
const reverse: Message = { _tag: "Reverse" };
const dragMoved = (screenX: number, screenY: number): Message => ({
  _tag: "DragMoved",
  screenX,
  screenY,
});
const dragStarted = (
  stopId: string,
  position: number,
  screenX: number,
  screenY: number,
): Message => ({
  _tag: "DragStarted",
  position,
  screenX,
  screenY,
  stopId,
});
const removeStop = (stopId: string): Message => ({ _tag: "RemoveStop", stopId });
const selectStop = (stopId: string): Message => ({ _tag: "SelectStop", stopId });
const stopAlphaChanged = (stopId: string, alpha: number): Message => ({
  _tag: "StopAlphaChanged",
  alpha,
  stopId,
});
const stopColorChanged = (stopId: string, color: string): Message => ({
  _tag: "StopColorChanged",
  color,
  stopId,
});
const stopMoved = (stopId: string, position: number): Message => ({
  _tag: "StopMoved",
  position,
  stopId,
});
const typeChanged = (type: GradientType): Message => ({ _tag: "TypeChanged", type });

const updateStop = (
  stops: readonly GradientStop[],
  stopId: string,
  change: Partial<GradientStop>,
): readonly GradientStop[] =>
  stops.map((stop) => (stop.id === stopId ? { ...stop, ...change } : stop));

const addedStops = (stops: readonly GradientStop[]): readonly GradientStop[] => {
  const sorted = [...stops].toSorted((left, right) => left.position - right.position);
  const last = sorted.at(-1);
  const previous = sorted.at(-2) ?? last;
  if (last === undefined || previous === undefined) {
    return stops;
  }
  const position = Math.round((previous.position + last.position) / 2);
  const next = {
    alpha: 100,
    color: previous.color,
    id: `stop-${String(stops.length + 1)}`,
    position,
  };
  return [...stops.slice(0, -1), next, ...stops.slice(-1)];
};

const update = (model: Model, message: Message): Model => {
  if (message._tag === "TypeChanged") {
    return { ...model, type: message.type };
  }
  if (message._tag === "SelectStop") {
    return { ...model, selectedStopId: message.stopId };
  }
  if (message._tag === "StopMoved") {
    return { ...model, stops: moveGradientStop(model.stops, message.stopId, message.position) };
  }
  if (message._tag === "StopColorChanged") {
    return { ...model, stops: updateStop(model.stops, message.stopId, { color: message.color }) };
  }
  if (message._tag === "StopAlphaChanged") {
    return { ...model, stops: updateStop(model.stops, message.stopId, { alpha: message.alpha }) };
  }
  if (message._tag === "Reverse") {
    return { ...model, stops: reverseGradientStops(model.stops) };
  }
  if (message._tag === "AddStop") {
    return { ...model, stops: addedStops(model.stops) };
  }
  if (message._tag === "RemoveStop") {
    return {
      ...model,
      stops:
        model.stops.length <= 2
          ? model.stops
          : model.stops.filter((stop) => stop.id !== message.stopId),
    };
  }
  if (message._tag === "DragStarted") {
    return {
      ...model,
      dragStartPosition: message.position,
      dragStartScreenX: message.screenX,
      dragStopId: message.stopId,
      selectedStopId: message.stopId,
    };
  }
  if (message._tag === "DragEnded") {
    return { ...model, dragStopId: "" };
  }
  if (model.dragStopId === "") {
    return model;
  }
  const position = model.dragStartPosition + (message.screenX - model.dragStartScreenX) / 3.2;
  return { ...model, stops: moveGradientStop(model.stops, model.dragStopId, position) };
};

const props = (
  model: Model,
  extra: Partial<GradientPickerProps<Message>> = {},
): GradientPickerProps<Message> => ({
  angle: model.angle,
  drag:
    model.dragStopId === ""
      ? undefined
      : {
          startPosition: model.dragStartPosition,
          startScreenX: model.dragStartScreenX,
          stopId: model.dragStopId,
        },
  messageForAddStop: addStop,
  messageForDragEnd: dragEnded,
  messageForDragMove: dragMoved,
  messageForDragStart: dragStarted,
  messageForRemoveStop: removeStop,
  messageForReverse: reverse,
  messageForSelectStop: selectStop,
  messageForStopAlpha: stopAlphaChanged,
  messageForStopColor: stopColorChanged,
  messageForStopPosition: stopMoved,
  messageForType: typeChanged,
  selectedStopId: model.selectedStopId,
  stops: model.stops,
  type: model.type,
  ...extra,
});

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    dragStartPosition: 0,
    dragStartScreenX: 0,
    dragStopId: "",
    selectedStopId: args.stops.at(0)?.id ?? "",
  }),
  update,
  view: (model: Model, h: Parameters<typeof gradientPicker<Message>>[1]) =>
    gradientPicker(props(model), h),
} as const;

const defaultArgs = { angle: 135, stops: defaultGradientStops, type: "linear" } as const;
const stateStops: readonly GradientStop[] = [
  { alpha: 100, color: "#0B7D74", id: "teal-1", position: 0 },
  { alpha: 65, color: "#FFFFFF", id: "white", position: 48 },
  { alpha: 100, color: "#054F4A", id: "teal-2", position: 100 },
];
const gradientTypes: readonly [string, GradientType][] = [
  ["Linear", "linear"],
  ["Radial", "radial"],
  ["Angular", "angular"],
  ["Diamond", "diamond"],
];
const specimen = (child: Html, h: HtmlBuilder<Message>) =>
  h.div([h.Class("uui-gradient-picker-specimen w-80 shrink-0")], [child]);

export default {
  ...componentMeta("gradient-picker"),
  title: "Untitled UI/Application/Gradient Picker",
};

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        gradientTypes.map(([label, type]) => [
          label,
          [specimen(gradientPicker(props(model, { type }), h), h)],
        ]),
        h,
      ),
  }),
  args: defaultArgs,
};

export const States = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [["Three stops", [specimen(gradientPicker(props(model, { stops: stateStops }), h), h)]]],
        h,
      ),
  }),
  args: defaultArgs,
};

export const Dark = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      h.div(
        [
          h.Class("min-h-screen bg-bg-primary p-8 outline-[100vmax] outline-bg-primary"),
          h.DataAttribute("theme", "dark"),
        ],
        [specimen(gradientPicker(props(model), h), h)],
      ),
  }),
  args: defaultArgs,
};

export const Interactions = {
  ...liveStory(definition),
  args: defaultArgs,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement.ownerDocument.body);
    const type = await canvas.findByRole("combobox", { name: "Gradient type" });
    await userEvent.selectOptions(type, "radial");
    await expect(type).toHaveValue("radial");
    const stops = await canvas.findAllByRole("slider", { name: "Gradient stop at 0%" });
    await userEvent.click(stops.at(0) ?? canvasElement);
    await userEvent.keyboard("{ArrowRight}");
    const movedStops = await canvas.findAllByRole("slider", { name: "Gradient stop at 1%" });
    await expect(movedStops.at(0)).toBeVisible();
    await userEvent.click(await canvas.findByRole("button", { name: "Add" }));
    await expect(await canvas.findAllByRole("button", { name: "Remove stop" })).toHaveLength(3);
    await userEvent.click(await canvas.findByRole("button", { name: "Reverse gradient" }));
  },
};
