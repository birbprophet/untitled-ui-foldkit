/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary -- The controlled renderer keeps the upstream size and media-state branches explicit. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export type VideoPlayerSize = "sm" | "md" | "lg";

export interface VideoPlayerProps<Message> {
  readonly bufferedPercent?: number;
  readonly currentTime: number;
  readonly duration: number;
  readonly isFullscreen?: boolean;
  readonly isMuted?: boolean;
  readonly isPlaying?: boolean;
  readonly onCyclePlaybackRate: NoInfer<Message>;
  readonly onSeek: (seconds: number) => NoInfer<Message>;
  readonly onToggleFullscreen: NoInfer<Message>;
  readonly onToggleMute: NoInfer<Message>;
  readonly onTogglePlay: NoInfer<Message>;
  readonly onVolumeChange: (volume: number) => NoInfer<Message>;
  readonly playbackRate?: number;
  readonly showThumbnail?: boolean;
  readonly showThumbnailOverlay?: boolean;
  readonly size?: VideoPlayerSize;
  readonly src: string;
  readonly thumbnailAlt?: string;
  readonly thumbnailUrl?: string;
  readonly type?: string;
  readonly volume?: number;
}

const formatTime = (time: number): string => {
  const bounded = Math.max(time, 0);
  const minutes = Math.floor(bounded / 60);
  const seconds = Math.floor(bounded % 60);
  return `${String(minutes)}:${String(seconds).padStart(2, "0")}`;
};

const playIcon = <Message>(isPlaying: boolean, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-4"), h.Fill("none"), h.ViewBox("0 0 16 16")],
    isPlaying
      ? [
          h.path([
            h.D(
              "M2.2 2.5A.5.5 0 0 1 2.7 2h2.5a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5H2.7a.5.5 0 0 1-.5-.5v-11Z",
            ),
            h.Fill("currentColor"),
          ]),
          h.path([
            h.D(
              "M10.2 2.5a.5.5 0 0 1 .5-.5h2.5a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-2.5a.5.5 0 0 1-.5-.5v-11Z",
            ),
            h.Fill("currentColor"),
          ]),
        ]
      : [
          h.path([
            h.D(
              "M2.2 2.863c0-1.251 1.372-2.018 2.438-1.362l8.348 5.136c1.015.625 1.015 2.101 0 2.726l-8.348 5.136C3.572 15.155 2.2 14.388 2.2 13.137V2.863Z",
            ),
            h.Fill("currentColor"),
          ]),
        ],
  );

const volumeIcon = <Message>(muted: boolean, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-4"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          muted
            ? "m22 9-6 6m0-6 6 6M9.634 5.366 6.47 8.53c-.173.173-.26.26-.36.322a1 1 0 0 1-.29.12C5.704 9 5.582 9 5.337 9H3.6c-.56 0-.84 0-1.054.109a1 1 0 0 0-.437.437C2 9.76 2 10.04 2 10.6v2.8c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437C2.76 15 3.04 15 3.6 15h1.737c.245 0 .367 0 .482.028a1 1 0 0 1 .29.12c.1.061.187.148.36.32l3.165 3.166c.429.429.643.643.827.657a.5.5 0 0 0 .42-.174c.119-.14.119-.443.119-1.048V5.93c0-.606 0-.908-.12-1.049a.5.5 0 0 0-.42-.173c-.183.014-.397.228-.826.657Z"
            : "M19.748 5A11.946 11.946 0 0 1 22 12c0 2.612-.835 5.03-2.252 7M15.745 8A6.968 6.968 0 0 1 17 12a6.967 6.967 0 0 1-1.255 4M9.635 5.366 6.468 8.53c-.173.173-.26.26-.36.322a1 1 0 0 1-.29.12C5.704 9 5.582 9 5.337 9H3.6c-.56 0-.84 0-1.054.109a1 1 0 0 0-.437.437C2 9.76 2 10.04 2 10.6v2.8c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437C2.76 15 3.04 15 3.6 15h1.737c.245 0 .367 0 .482.028a1 1 0 0 1 .29.12c.1.061.187.148.36.32l3.165 3.166c.429.429.643.643.827.657a.5.5 0 0 0 .42-.174c.119-.14.119-.443.119-1.048V5.93c0-.606 0-.908-.12-1.049a.5.5 0 0 0-.42-.173c-.183.014-.397.228-.826.657Z",
        ),
      ]),
    ],
  );

const fullscreenIcon = <Message>(fullscreen: boolean, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-4"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          fullscreen
            ? "M4 14h6m0 0v6m0-6-7 7m17-11h-6m0 0V4m0 6 7-7"
            : "m14 10 7-7m0 0h-6m6 0v6m-11 5-7 7m0 0h6m-6 0v-6",
        ),
      ]),
    ],
  );

const tooltip = <Message>(
  id: string,
  title: string,
  shortcut: string,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-20 flex -translate-x-1/2 gap-1.5 rounded-lg bg-alpha-white/20 p-1 pl-2 opacity-0 shadow-lg ring-1 ring-alpha-white/10 backdrop-blur-sm transition delay-0 duration-100 group-hover/control:opacity-100 group-hover/control:delay-[350ms] group-focus-visible/control:opacity-100 ring-inset",
      ),
      h.Id(id),
      h.Role("tooltip"),
    ],
    [
      h.span([h.Class("text-sm font-semibold whitespace-nowrap text-white")], [title]),
      h.span(
        [
          h.Class(
            "rounded bg-alpha-white/30 px-[3px] py-px font-sans text-xs font-semibold whitespace-nowrap text-white shadow-xs ring-1 ring-alpha-white/10 ring-inset",
          ),
        ],
        [shortcut],
      ),
    ],
  );

const controlButton = <Message>(
  id: string,
  label: string,
  shortcut: string,
  message: NoInfer<Message>,
  icon: Html,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("relative flex")],
    [
      h.button(
        [
          h.AriaDescribedBy(`${id}-tooltip`),
          h.AriaLabel(label),
          h.Class(
            "group/control relative flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md p-2 text-white outline-hidden transition duration-100 ease-linear hover:bg-alpha-white/20 hover:backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
          ),
          h.OnClick(message),
          h.Type("button"),
        ],
        [icon, tooltip(`${id}-tooltip`, label, shortcut, h)],
      ),
    ],
  );

const keyboardMessage = <Message>(props: VideoPlayerProps<Message>, key: string) => {
  if (key === " " || key === "k") {
    return Option.some(props.onTogglePlay);
  }
  if (key === "m") {
    return Option.some(props.onToggleMute);
  }
  if (key === "f") {
    return Option.some(props.onToggleFullscreen);
  }
  if (key === "ArrowLeft") {
    return Option.some(props.onSeek(Math.max(props.currentTime - 10, 0)));
  }
  if (key === "ArrowRight") {
    return Option.some(props.onSeek(Math.min(props.currentTime + 10, props.duration)));
  }
  return Option.none();
};

export const videoPlayer = <Message>(
  props: VideoPlayerProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const size = props.size ?? "md";
  const playing = props.isPlaying === true;
  const muted = props.isMuted === true || props.volume === 0;
  const fullscreen = props.isFullscreen === true;
  const volume = props.volume ?? 1;
  const duration = Math.max(props.duration, 0);
  const currentTime = Math.min(Math.max(props.currentTime, 0), duration);
  const progress = duration === 0 ? 0 : (currentTime / duration) * 100;
  const buffered = Math.min(Math.max(props.bufferedPercent ?? 0, 0), 100);
  const showThumbnail = props.showThumbnail !== false && props.thumbnailUrl !== undefined;
  return h.div(
    [
      h.Class(
        "group group/video relative overflow-hidden rounded-lg bg-black outline-focus-ring has-[video:focus-visible]:outline-2 has-[video:focus-visible]:outline-offset-4",
      ),
    ],
    [
      h.video(
        [
          h.AriaLabel("Video player"),
          h.Autoplay(playing),
          h.Class(
            "h-full w-full cursor-pointer rounded-[inherit] bg-black outline-1 -outline-offset-1 outline-black/10",
          ),
          h.Muted(muted),
          h.OnClick(props.onTogglePlay),
          h.OnDoubleClick(props.onToggleFullscreen),
          h.OnKeyDownPreventDefault((key) => keyboardMessage(props, key)),
          h.Playsinline(true),
          h.Preload("metadata"),
          h.Tabindex(0),
        ],
        [
          h.source([h.Src(props.src), h.Type(props.type ?? "video/mp4")]),
          "Your browser does not support the video tag.",
        ],
      ),
      ...(showThumbnail
        ? [
            h.button(
              [
                h.AriaLabel("Play video"),
                h.Class(
                  "group absolute inset-0 z-10 cursor-pointer rounded-[inherit] transition-all duration-300 ease-in",
                ),
                h.OnClick(props.onTogglePlay),
                h.Type("button"),
              ],
              [
                h.img([
                  h.Alt(props.thumbnailAlt ?? ""),
                  h.Class("size-full object-cover"),
                  h.Src(props.thumbnailUrl ?? ""),
                ]),
                h.span(
                  [h.Class("absolute inset-0 flex items-center justify-center")],
                  [
                    h.span(
                      [
                        h.Class(
                          `${size === "sm" ? "" : "rounded-full bg-alpha-white/30 backdrop-blur transition duration-100 ease-linear group-hover:bg-alpha-white/40"} flex size-16 items-center justify-center`,
                        ),
                      ],
                      [playIcon(false, h)],
                    ),
                  ],
                ),
                ...(props.showThumbnailOverlay === true
                  ? [
                      h.span([
                        h.AriaHidden(true),
                        h.Class(
                          "absolute inset-0 rounded-[inherit] bg-black/10 outline-2 -outline-offset-1 outline-black/10",
                        ),
                      ]),
                    ]
                  : []),
              ],
            ),
          ]
        : []),
      h.div(
        [
          h.Class(
            `${size === "sm" ? "px-1 pt-6 pb-1" : size === "md" ? "px-5 pt-10 pb-4" : "px-8 pt-12 pb-6"} absolute right-0 bottom-0 left-0 translate-y-4 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition duration-150 ease-in will-change-transform group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100`,
          ),
        ],
        [
          h.div(
            [h.Class(`flex items-center ${size === "lg" ? "gap-1" : "gap-0.5"}`)],
            [
              controlButton(
                "video-play",
                playing ? "Pause" : "Play",
                "Space",
                props.onTogglePlay,
                playIcon(playing, h),
                h,
              ),
              ...(size === "lg"
                ? [
                    h.div(
                      [
                        h.Class(
                          "flex items-center rounded-md pr-2 outline-hidden transition duration-100 ease-linear hover:bg-alpha-white/20 hover:backdrop-blur-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white",
                        ),
                      ],
                      [
                        h.button(
                          [
                            h.AriaLabel(muted ? "Unmute" : "Mute"),
                            h.Class("flex size-8 cursor-pointer items-center justify-center"),
                            h.OnClick(props.onToggleMute),
                            h.Type("button"),
                          ],
                          [volumeIcon(muted, h)],
                        ),
                        h.input([
                          h.AriaLabel("Volume"),
                          h.Class(
                            "h-1 w-11 cursor-pointer appearance-none rounded-full bg-alpha-white/30 accent-white",
                          ),
                          h.Max("1"),
                          h.Min("0"),
                          h.OnInput((value) => props.onVolumeChange(Number(value))),
                          h.Step("0.1"),
                          h.Type("range"),
                          h.Value(String(volume)),
                        ]),
                      ],
                    ),
                  ]
                : [
                    controlButton(
                      "video-volume",
                      muted ? "Unmute" : "Mute",
                      "M",
                      props.onToggleMute,
                      volumeIcon(muted, h),
                      h,
                    ),
                  ]),
              h.div(
                [
                  h.Class(
                    `${size === "sm" ? "pointer-events-none invisible opacity-0" : ""} flex min-w-0 flex-1 items-center gap-2 px-2`,
                  ),
                ],
                [
                  h.span(
                    [h.Class("pointer-events-none text-xs font-semibold text-white tabular-nums")],
                    [formatTime(currentTime)],
                  ),
                  h.div(
                    [h.Class("relative flex-1")],
                    [
                      h.div(
                        [
                          h.AriaHidden(true),
                          h.Class(
                            "absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-fg-white/30",
                          ),
                        ],
                        [
                          h.span([
                            h.Class("absolute h-full min-w-2 rounded-full bg-fg-white/50"),
                            h.Style({ width: `${String(buffered)}%` }),
                          ]),
                          h.span([
                            h.Class("absolute h-full min-w-2 rounded-full bg-fg-white"),
                            h.Style({ width: `${String(progress)}%` }),
                          ]),
                        ],
                      ),
                      h.input([
                        h.AriaLabel("Video progress"),
                        h.Class(
                          "relative h-8 w-full cursor-pointer appearance-none bg-transparent opacity-0",
                        ),
                        h.Max(String(duration)),
                        h.Min("0"),
                        h.OnInput((value) => props.onSeek(Number(value))),
                        h.Step("0.1"),
                        h.Type("range"),
                        h.Value(String(currentTime)),
                      ]),
                    ],
                  ),
                  h.span(
                    [h.Class("pointer-events-none text-xs font-semibold text-white tabular-nums")],
                    [`-${formatTime(duration - currentTime)}`],
                  ),
                ],
              ),
              ...(size === "lg"
                ? [
                    controlButton(
                      "video-speed",
                      "Playback speed",
                      "← →",
                      props.onCyclePlaybackRate,
                      h.span(
                        [h.Class("text-xs font-semibold")],
                        [`${String(props.playbackRate ?? 1)}×`],
                      ),
                      h,
                    ),
                  ]
                : []),
              controlButton(
                "video-fullscreen",
                fullscreen ? "Exit fullscreen" : "Enter fullscreen",
                fullscreen ? "Escape" : "F",
                props.onToggleFullscreen,
                fullscreenIcon(fullscreen, h),
                h,
              ),
            ],
          ),
        ],
      ),
    ],
  );
};
