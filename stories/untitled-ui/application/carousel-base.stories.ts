/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook exercises the controlled FoldKit carousel through exact public props. */
import * as S from "effect/Schema";
import type { HtmlBuilder } from "foldkit/html";
import { carouselBase, nextCarouselIndex } from "ui/application";
import type { CarouselBaseProps, CarouselOrientation, CarouselSlide } from "ui/application";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Orientation = S.Union([S.Literal("horizontal"), S.Literal("vertical")]);
const Args = S.Struct({ orientation: Orientation });
const Model = S.Struct({ orientation: Orientation, selectedIndex: S.Number });
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Next" }>
  | Readonly<{ _tag: "Previous" }>
  | Readonly<{ _tag: "SlideSelected"; index: number }>;

const next: Message = { _tag: "Next" };
const previous: Message = { _tag: "Previous" };
const slideSelected = (index: number): Message => ({ _tag: "SlideSelected", index });

const slides: readonly CarouselSlide[] = [
  {
    description: "A controlled primitive with accessible navigation and exact boundaries.",
    eyebrow: "Featured",
    id: "one",
    title: "Build with confidence",
  },
  {
    description: "Arrow keys, triggers, and indicators all update the same FoldKit model.",
    eyebrow: "Interaction",
    id: "two",
    title: "Move between slides",
  },
  {
    description: "Motion respects the system preference while structure remains unchanged.",
    eyebrow: "Accessibility",
    id: "three",
    title: "Designed for everyone",
  },
];

const props = (
  model: Model,
  extra: Partial<CarouselBaseProps<Message>> = {},
): CarouselBaseProps<Message> => ({
  ariaLabel: "Product highlights",
  messageForSlide: slideSelected,
  onNext: next,
  onPrevious: previous,
  orientation: model.orientation,
  selectedIndex: model.selectedIndex,
  slides,
  ...extra,
});

const update = (model: Model, message: Message): Model => {
  if (message._tag === "SlideSelected") {
    return { ...model, selectedIndex: message.index };
  }
  return {
    ...model,
    selectedIndex: nextCarouselIndex(
      model.selectedIndex,
      slides.length,
      message._tag === "Previous" ? "previous" : "next",
    ),
  };
};

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, selectedIndex: 0 }),
  update,
  view: (model: Model, h: Parameters<typeof carouselBase<Message>>[1]) =>
    carouselBase(props(model), h),
} as const;

const defaultArgs = { orientation: "horizontal" } as const;
const specimen = (
  model: Model,
  h: HtmlBuilder<Message>,
  orientation: CarouselOrientation,
  selectedIndex = 0,
) =>
  h.div(
    [h.Class("uui-carousel-base-specimen w-[42rem] max-w-full")],
    [carouselBase(props(model, { orientation, selectedIndex }), h)],
  );

export default {
  ...componentMeta("carousel-base"),
  argTypes: { orientation: { control: "select", options: ["horizontal", "vertical"] } },
  title: "Untitled UI/Application/Carousel Base",
};

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          ["Horizontal", [specimen(model, h, "horizontal")]],
          ["Vertical", [specimen(model, h, "vertical")]],
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
          ["First slide", [specimen(model, h, "horizontal", 0)]],
          ["Middle slide", [specimen(model, h, "horizontal", 1)]],
          ["Last slide", [specimen(model, h, "horizontal", 2)]],
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
        [specimen(model, h, "horizontal")],
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
    const region = await canvas.findByRole("region", { name: "Product highlights" });
    await userEvent.click(await canvas.findByRole("button", { name: "Next slide" }));
    await expect(await canvas.findByRole("group", { name: "Move between slides" })).toBeVisible();
    region.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(await canvas.findByRole("group", { name: "Designed for everyone" })).toBeVisible();
    await expect(await canvas.findByRole("button", { name: "Next slide" })).toBeDisabled();
    await userEvent.click(
      await canvas.findByRole("button", { name: "Go to slide 1: Build with confidence" }),
    );
    await expect(await canvas.findByRole("group", { name: "Build with confidence" })).toBeVisible();
  },
};
