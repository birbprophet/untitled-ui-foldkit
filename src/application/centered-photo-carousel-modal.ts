/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the authenticated carousel modal branches. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

const metricItemsUrl = new URL("centered-photo-carousel-assets/metric-items.svg", import.meta.url)
  .href;

export interface CenteredPhotoCarouselModalProps<Message> {
  readonly id: string;
  readonly isOpen: boolean;
  readonly messageForSlide: (index: number) => NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onFinish: NoInfer<Message>;
  readonly onSkip: NoInfer<Message>;
  readonly selectedIndex: number;
}

const slideCount = 4;

const indicator = <Message>(
  selectedIndex: number,
  messageForSlide: (index: number) => Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.nav(
    [h.AriaLabel("Choose slide"), h.Class("mx-auto flex h-max w-max gap-4")],
    Array.from({ length: slideCount }, (_, index) =>
      h.button([
        h.AriaCurrent(index === selectedIndex ? "true" : "false"),
        h.AriaLabel(`Go to slide ${String(index + 1)}`),
        h.Class(
          `relative h-2.5 w-2.5 cursor-pointer rounded-full outline-focus-ring after:absolute after:-inset-x-2 after:-inset-y-3 focus-visible:outline-2 focus-visible:outline-offset-2 ${index === selectedIndex ? "bg-fg-brand-primary_alt" : "bg-bg-quaternary"}`,
        ),
        h.OnClick(messageForSlide(index)),
        h.Type("button"),
      ]),
    ),
  );

const keyboardMessage = <Message>(
  props: CenteredPhotoCarouselModalProps<Message>,
  selectedIndex: number,
  key: string,
): Option.Option<Message> => {
  if (key === "ArrowLeft" && selectedIndex > 0) {
    return Option.some(props.messageForSlide(selectedIndex - 1));
  }
  if (key === "ArrowRight" && selectedIndex < slideCount - 1) {
    return Option.some(props.messageForSlide(selectedIndex + 1));
  }
  return Option.none();
};

export const centeredPhotoCarouselModal = <Message>(
  props: CenteredPhotoCarouselModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const selectedIndex = Math.max(0, Math.min(props.selectedIndex, slideCount - 1));
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
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-[calc(100%-32px)] max-w-100 overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:w-100 sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                  h.OnKeyDownPreventDefault((key) => keyboardMessage(props, selectedIndex, key)),
                ],
                [
                  h.section(
                    [
                      h.Attribute("aria-roledescription", "carousel"),
                      h.Class("relative sm:max-w-100"),
                      h.Role("region"),
                    ],
                    [
                      h.div(
                        [h.Class("px-4 pt-4 sm:px-6 sm:pt-6")],
                        [
                          h.div(
                            [h.Class("h-full w-full overflow-hidden rounded-lg")],
                            [
                              h.div(
                                [
                                  h.Class(
                                    "flex max-h-full gap-2 transition-transform duration-300 ease-out motion-reduce:transition-none",
                                  ),
                                  h.Style({
                                    transform: `translateX(calc(${String(selectedIndex * -100)}% - ${String(selectedIndex * 8)}px))`,
                                  }),
                                ],
                                Array.from({ length: slideCount }, (_, index) =>
                                  h.div(
                                    [
                                      h.AriaHidden(index !== selectedIndex),
                                      h.Attribute("aria-roledescription", "slide"),
                                      h.Class(
                                        "min-w-0 shrink-0 grow-0 basis-full rounded-lg bg-bg-tertiary",
                                      ),
                                      h.Role("group"),
                                    ],
                                    [
                                      h.img([
                                        h.Alt(""),
                                        h.Class("block h-52 w-full"),
                                        h.Src(metricItemsUrl),
                                      ]),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      h.div(
                        [
                          h.Class(
                            "flex flex-col items-center justify-center gap-4 px-4 pt-5 sm:px-6 sm:pt-6",
                          ),
                        ],
                        [
                          h.div(
                            [h.Class("z-10 flex flex-col items-center justify-center gap-0.5")],
                            [
                              h.h2(
                                [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                                ["Welcome to your dashboard"],
                              ),
                              h.p(
                                [
                                  h.Class("text-center text-sm text-text-tertiary"),
                                  h.Id(descriptionId),
                                ],
                                [
                                  "We're glad to have you onboard. Here are some quick tips to get you up and running.",
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                      h.div([h.Class("h-5 w-full")]),
                      indicator(selectedIndex, props.messageForSlide, h),
                      h.footer(
                        [
                          h.Class(
                            "z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pt-8 sm:pb-6",
                          ),
                        ],
                        [
                          button(
                            {
                              color: "secondary",
                              label: selectedIndex > 0 ? "Back" : "Skip",
                              onPress:
                                selectedIndex > 0
                                  ? props.messageForSlide(selectedIndex - 1)
                                  : props.onSkip,
                              size: "md",
                            },
                            h,
                          ),
                          button(
                            {
                              color: "primary",
                              label: selectedIndex < slideCount - 1 ? "Next" : "Finish",
                              onPress:
                                selectedIndex < slideCount - 1
                                  ? props.messageForSlide(selectedIndex + 1)
                                  : props.onFinish,
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
