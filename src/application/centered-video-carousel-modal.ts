/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the authenticated video carousel modal branches. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { videoPlayer } from "../base/video-player.ts";

const thumbnailUrl = new URL("../../../brand/social/og-1200x630.png", import.meta.url).href;
const videoUrl = new URL("centered-video-assets/siglata-overview.mp4", import.meta.url).href;

export interface CenteredVideoState {
  readonly currentTime: number;
  readonly duration: number;
  readonly isFullscreen: boolean;
  readonly isMuted: boolean;
  readonly isPlaying: boolean;
  readonly playbackRate: number;
  readonly showThumbnail: boolean;
  readonly volume: number;
}

export type CenteredVideoAction =
  | Readonly<{ type: "cycle-playback-rate" }>
  | Readonly<{ seconds: number; type: "seek" }>
  | Readonly<{ type: "toggle-fullscreen" }>
  | Readonly<{ type: "toggle-mute" }>
  | Readonly<{ type: "toggle-play" }>
  | Readonly<{ type: "volume-change"; volume: number }>;

export interface CenteredVideoCarouselModalProps<Message> {
  readonly id: string;
  readonly isOpen: boolean;
  readonly messageForSlide: (index: number) => NoInfer<Message>;
  readonly messageForVideoAction: (index: number, action: CenteredVideoAction) => NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onFinish: NoInfer<Message>;
  readonly onSkip: NoInfer<Message>;
  readonly selectedIndex: number;
  readonly videoState: CenteredVideoState;
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
  props: CenteredVideoCarouselModalProps<Message>,
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

const videoSlide = <Message>(
  props: CenteredVideoCarouselModalProps<Message>,
  slideIndex: number,
  selected: boolean,
  h: HtmlBuilder<Message>,
): Html => {
  const action = (videoAction: CenteredVideoAction): Message =>
    props.messageForVideoAction(slideIndex, videoAction);
  return h.div(
    [
      h.AriaHidden(!selected),
      h.Attribute("aria-roledescription", "slide"),
      h.Class("min-w-0 shrink-0 grow-0 basis-full"),
      h.Role("group"),
    ],
    [
      h.div(
        [
          h.Class(
            "aspect-[40/21] w-full max-w-148 overflow-hidden rounded-lg text-white [&>div]:h-full max-md:[&>div>button>span>span]:bg-transparent max-md:[&>div>button>span>span]:backdrop-blur-none",
          ),
        ],
        [
          videoPlayer(
            {
              ...props.videoState,
              bufferedPercent: 0,
              onCyclePlaybackRate: action({ type: "cycle-playback-rate" }),
              onSeek: (seconds) => action({ seconds, type: "seek" }),
              onToggleFullscreen: action({ type: "toggle-fullscreen" }),
              onToggleMute: action({ type: "toggle-mute" }),
              onTogglePlay: action({ type: "toggle-play" }),
              onVolumeChange: (volume) => action({ type: "volume-change", volume }),
              showThumbnailOverlay: false,
              size: "md",
              src: videoUrl,
              thumbnailAlt: "Siglata product overview",
              thumbnailUrl,
            },
            h,
          ),
        ],
      ),
    ],
  );
};

export const centeredVideoCarouselModal = <Message>(
  props: CenteredVideoCarouselModalProps<Message>,
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
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-[calc(100%-32px)] max-w-152 overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:w-152 sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                  h.OnKeyDownPreventDefault((key) => keyboardMessage(props, selectedIndex, key)),
                ],
                [
                  h.section(
                    [
                      h.Attribute("aria-roledescription", "carousel"),
                      h.Class("relative sm:max-w-152"),
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
                                  videoSlide(props, index, index === selectedIndex, h),
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
                            [
                              h.Class(
                                "z-10 flex w-full flex-col items-center justify-center gap-0.5",
                              ),
                            ],
                            [
                              h.h2(
                                [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                                ["Welcome to your dashboard"],
                              ),
                              h.p(
                                [
                                  h.Class("self-stretch text-center text-sm text-text-tertiary"),
                                  h.Id(descriptionId),
                                ],
                                ["Here are some tips to get you up and running."],
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
                              label: selectedIndex < slideCount - 1 ? "Continue" : "Finish",
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
