/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook exercises the controlled FoldKit model through real component props. */
import * as S from "effect/Schema";
import type { Html, HtmlBuilder } from "foldkit/html";
import { colorPicker } from "../../../src/application.ts";
import type { ColorPickerFormat, ColorPickerProps } from "../../../src/application.ts";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Format = S.Union([
  S.Literal("hex"),
  S.Literal("rgb"),
  S.Literal("css"),
  S.Literal("hsl"),
  S.Literal("hsb"),
]);
const Args = S.Struct({
  alpha: S.Number,
  color: S.String,
  format: Format,
  isDialog: S.Boolean,
  isDisabled: S.Boolean,
  savedColors: S.Array(S.String),
  savedLabel: S.String,
});
const Model = Args;
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "AddSaved" }>
  | Readonly<{ _tag: "AlphaChanged"; alpha: number }>
  | Readonly<{ _tag: "ColorChanged"; color: string }>
  | Readonly<{ _tag: "FormatChanged"; format: ColorPickerFormat }>;

const alphaChanged = (alpha: number): Message => ({ _tag: "AlphaChanged", alpha });
const colorChanged = (color: string): Message => ({ _tag: "ColorChanged", color });
const formatChanged = (format: ColorPickerFormat): Message => ({ _tag: "FormatChanged", format });
const addSaved: Message = { _tag: "AddSaved" };

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model, message: Message): Model => {
    if (message._tag === "ColorChanged") {
      return { ...model, color: message.color };
    }
    if (message._tag === "AlphaChanged") {
      return { ...model, alpha: message.alpha };
    }
    if (message._tag === "FormatChanged") {
      return { ...model, format: message.format };
    }
    return { ...model, savedColors: [...model.savedColors, model.color] };
  },
  view: (model: Model, h: Parameters<typeof colorPicker<Message>>[1]) =>
    colorPicker(
      {
        ...model,
        messageForAlpha: alphaChanged,
        messageForColor: colorChanged,
        messageForFormat: formatChanged,
        onAddSaved: addSaved,
      },
      h,
    ),
} as const;

const defaultArgs = {
  alpha: 1,
  color: "#7F56D9",
  format: "hex",
  isDialog: false,
  isDisabled: false,
  savedColors: ["#7F56D9", "#444CE7", "#079455", "#DC6803", "#D92D20"],
  savedLabel: "Saved",
} as const;

const specimen = (child: Html, h: HtmlBuilder<Message>) =>
  h.div([h.Class("uui-color-picker-specimen w-80 shrink-0")], [child]);

const render = (
  model: Model,
  h: HtmlBuilder<Message>,
  extra: Partial<ColorPickerProps<Message>> = {},
) =>
  colorPicker(
    {
      ...model,
      ...extra,
      messageForAlpha: alphaChanged,
      messageForColor: colorChanged,
      messageForFormat: formatChanged,
      onAddSaved: addSaved,
    },
    h,
  );

export default {
  ...componentMeta("color-picker"),
  title: "Untitled UI/Application/Color Picker",
};

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          ["Solid", [specimen(render(model, h, { savedColors: undefined }), h)]],
          ["Dialog", [specimen(render(model, h, { isDialog: true, savedColors: undefined }), h)]],
          ["Saved colors", [specimen(render(model, h), h)]],
        ],
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
        [
          ["Opaque", [specimen(render(model, h, { alpha: 1, savedColors: undefined }), h)]],
          ["Translucent", [specimen(render(model, h, { alpha: 0.4, savedColors: undefined }), h)]],
        ],
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
        [specimen(render(model, h, { isDialog: true }), h)],
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
    const format = await canvas.findByRole("combobox", { name: "Color format" });
    await userEvent.selectOptions(format, "rgb");
    await expect(await canvas.findByDisplayValue("127")).toBeVisible();
    await userEvent.click(await canvas.findByRole("option", { name: "Select #079455" }));
    await expect(await canvas.findByDisplayValue("7")).toBeVisible();
    const hue = await canvas.findByRole("slider", { name: "Hue" });
    hue.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(hue).toHaveFocus();
  },
};
