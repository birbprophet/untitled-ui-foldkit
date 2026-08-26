/* oxlint-disable @rikalabs/no-identical-branches, @rikalabs/no-low-signal-variable-names, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer keeps the upstream horizontal and vertical branches explicit. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export type CarouselOrientation = "horizontal" | "vertical";

export interface CarouselSlide {
  readonly description?: string;
  readonly eyebrow?: string;
  readonly id: string;
  readonly imageAlt?: string;
  readonly imageUrl?: string;
  readonly title: string;
}

export interface CarouselBaseProps<Message> {
  readonly ariaLabel?: string;
  readonly messageForSlide: (index: number) => NoInfer<Message>;
  readonly onNext: NoInfer<Message>;
  readonly onPrevious: NoInfer<Message>;
  readonly orientation?: CarouselOrientation;
  readonly selectedIndex: number;
  readonly slides: readonly CarouselSlide[];
}

export const nextCarouselIndex = (
  selectedIndex: number,
  slideCount: number,
  direction: "previous" | "next",
): number =>
  Math.max(
    0,
    Math.min(
      direction === "previous" ? selectedIndex - 1 : selectedIndex + 1,
      Math.max(0, slideCount - 1),
    ),
  );

const arrow = <Message>(direction: "previous" | "next", h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 20 20")],
    [
      h.path([
        h.D(direction === "previous" ? "m12.5 15-5-5 5-5" : "m7.5 5 5 5-5 5"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const trigger = <Message>(
  direction: "previous" | "next",
  disabled: boolean,
  message: Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.AriaLabel(direction === "previous" ? "Previous slide" : "Next slide"),
      h.Class(
        "inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:text-fg-disabled_subtle",
      ),
      h.Disabled(disabled),
      h.OnClick(message),
      h.Type("button"),
    ],
    [arrow(direction, h)],
  );

const slide = <Message>(
  slideValue: CarouselSlide,
  selected: boolean,
  orientation: CarouselOrientation,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.AriaHidden(!selected),
      h.Attribute("aria-roledescription", "slide"),
      h.AriaLabel(slideValue.title),
      h.Class(`min-w-0 shrink-0 grow-0 basis-full ${orientation === "vertical" ? "h-full" : ""}`),
      h.Role("group"),
    ],
    [
      h.article(
        [
          h.Class(
            "relative flex h-72 overflow-hidden rounded-xl bg-bg-secondary ring-1 ring-border-secondary ring-inset",
          ),
        ],
        [
          ...(slideValue.imageUrl === undefined
            ? []
            : [
                h.img([
                  h.Alt(slideValue.imageAlt ?? ""),
                  h.Class("absolute inset-0 size-full object-cover"),
                  h.Src(slideValue.imageUrl),
                ]),
                h.div([
                  h.AriaHidden(true),
                  h.Class(
                    "absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent",
                  ),
                ]),
              ]),
          h.div(
            [
              h.Class(
                `relative mt-auto flex w-full flex-col gap-2 p-6 ${slideValue.imageUrl === undefined ? "text-text-primary" : "text-white"}`,
              ),
            ],
            [
              ...(slideValue.eyebrow === undefined
                ? []
                : [h.p([h.Class("text-sm font-semibold")], [slideValue.eyebrow])]),
              h.h3([h.Class("text-xl font-semibold")], [slideValue.title]),
              ...(slideValue.description === undefined
                ? []
                : [
                    h.p(
                      [
                        h.Class(
                          `text-sm ${slideValue.imageUrl === undefined ? "text-text-tertiary" : "text-white/80"}`,
                        ),
                      ],
                      [slideValue.description],
                    ),
                  ]),
            ],
          ),
        ],
      ),
    ],
  );

const keyboardMessage = <Message>(
  props: CarouselBaseProps<Message>,
  key: string,
): Option.Option<Message> => {
  const orientation = props.orientation ?? "horizontal";
  if (
    (key === "ArrowLeft" && orientation === "horizontal") ||
    (key === "ArrowUp" && orientation === "vertical")
  ) {
    return props.selectedIndex > 0 ? Option.some(props.onPrevious) : Option.none();
  }
  if (
    (key === "ArrowRight" && orientation === "horizontal") ||
    (key === "ArrowDown" && orientation === "vertical")
  ) {
    return props.selectedIndex < props.slides.length - 1
      ? Option.some(props.onNext)
      : Option.none();
  }
  return Option.none();
};

export const carouselBase = <Message>(
  props: CarouselBaseProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const orientation = props.orientation ?? "horizontal";
  const index = Math.max(0, Math.min(props.selectedIndex, props.slides.length - 1));
  const offset = index * -100;
  return h.section(
    [
      h.AriaLabel(props.ariaLabel ?? "Featured content"),
      h.Attribute("aria-roledescription", "carousel"),
      h.Class("relative flex w-full max-w-2xl flex-col gap-4 outline-none"),
      h.OnKeyDownPreventDefault((key) => keyboardMessage(props, key)),
      h.Role("region"),
      h.Tabindex(0),
    ],
    [
      h.div(
        [h.Class("h-full w-full overflow-hidden rounded-xl")],
        [
          h.div(
            [
              h.Class(
                `flex max-h-full transition-transform duration-300 ease-out motion-reduce:transition-none ${orientation === "vertical" ? "h-72 flex-col" : ""}`,
              ),
              h.Style({
                transform:
                  orientation === "horizontal"
                    ? `translateX(${String(offset)}%)`
                    : `translateY(${String(offset)}%)`,
              }),
            ],
            props.slides.map((slideValue, slideIndex) =>
              slide(slideValue, slideIndex === index, orientation, h),
            ),
          ),
        ],
      ),
      h.div(
        [h.Class("flex items-center justify-between gap-4")],
        [
          trigger("previous", index === 0, props.onPrevious, h),
          h.nav(
            [h.AriaLabel("Choose slide"), h.Class("flex items-center gap-2")],
            props.slides.map((slideValue, slideIndex) =>
              h.button([
                h.AriaLabel(`Go to slide ${String(slideIndex + 1)}: ${slideValue.title}`),
                h.AriaCurrent(slideIndex === index ? "true" : "false"),
                h.Class(
                  `size-2.5 cursor-pointer rounded-full outline-focus-ring transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${slideIndex === index ? "bg-bg-brand-solid" : "bg-bg-quaternary hover:bg-bg-quaternary_hover"}`,
                ),
                h.OnClick(props.messageForSlide(slideIndex)),
                h.Type("button"),
              ]),
            ),
          ),
          trigger("next", index === props.slides.length - 1, props.onNext, h),
        ],
      ),
    ],
  );
};
