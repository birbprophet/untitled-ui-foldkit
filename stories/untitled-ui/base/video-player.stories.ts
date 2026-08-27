/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, foldkit/prefer-callable-message-constructor, mps/require-is-prefix-for-boolean-schema-field -- Storybook CSF exposes the exact upstream boolean prop and its play function is promise-based. */
import * as Match from "effect/Match";
import * as S from "effect/Schema";
import { videoPlayer } from "ui/base";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({
  showThumbnailOverlay: S.Boolean,
  size: S.Literals(["sm", "md", "lg"]),
  src: S.String,
  thumbnailAlt: S.String,
  thumbnailUrl: S.String,
});
const Model = S.Struct({
  ...Args.fields,
  bufferedPercent: S.Number,
  currentTime: S.Number,
  duration: S.Number,
  isFullscreen: S.Boolean,
  isMuted: S.Boolean,
  isPlaying: S.Boolean,
  playbackRate: S.Number,
  showThumbnail: S.Boolean,
  volume: S.Number,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "CyclePlaybackRate" }>
  | Readonly<{ _tag: "Seek"; seconds: number }>
  | Readonly<{ _tag: "ToggleFullscreen" }>
  | Readonly<{ _tag: "ToggleMute" }>
  | Readonly<{ _tag: "TogglePlay" }>
  | Readonly<{ _tag: "VolumeChanged"; volume: number }>;

const cyclePlaybackRate: Message = { _tag: "CyclePlaybackRate" };
const toggleFullscreen: Message = { _tag: "ToggleFullscreen" };
const toggleMute: Message = { _tag: "ToggleMute" };
const togglePlay: Message = { _tag: "TogglePlay" };
const seek = (seconds: number): Message => ({ _tag: "Seek", seconds });
const volumeChanged = (volume: number): Message => ({ _tag: "VolumeChanged", volume });
const playbackRates = [1, 1.25, 1.5, 1.75, 2] as const;
const source = "https://www.untitledui.com/videos/untitled-ui-demo.mp4";
const emptySource = "data:video/mp4;base64,";
const thumbnail = new URL("../../../../../packages/brand/social/og-1200x630.png", import.meta.url)
  .href;

const init = (args: Args): Model => ({
  ...args,
  bufferedPercent: 62,
  currentTime: 0,
  duration: 148,
  isFullscreen: false,
  isMuted: false,
  isPlaying: false,
  playbackRate: 1,
  showThumbnail: true,
  volume: 1,
});

const update = (model: Model, message: Message): Model =>
  Match.value(message).pipe(
    Match.when({ _tag: "TogglePlay" }, () => ({
      ...model,
      isPlaying: !model.isPlaying,
      showThumbnail: false,
    })),
    Match.when({ _tag: "ToggleMute" }, () => ({ ...model, isMuted: !model.isMuted })),
    Match.when({ _tag: "ToggleFullscreen" }, () => ({
      ...model,
      isFullscreen: !model.isFullscreen,
    })),
    Match.when({ _tag: "Seek" }, ({ seconds }) => ({ ...model, currentTime: seconds })),
    Match.when({ _tag: "VolumeChanged" }, ({ volume }) => ({
      ...model,
      isMuted: volume === 0,
      volume,
    })),
    Match.when({ _tag: "CyclePlaybackRate" }, () => {
      const current = playbackRates.map(Number).indexOf(model.playbackRate);
      return {
        ...model,
        playbackRate: playbackRates[(current + 1) % playbackRates.length] ?? 1,
      };
    }),
    Match.exhaustive,
  );

const specimen = (model: Model, h: Parameters<typeof videoPlayer<Message>>[1]) =>
  videoPlayer(
    {
      ...model,
      onCyclePlaybackRate: cyclePlaybackRate,
      onSeek: seek,
      onToggleFullscreen: toggleFullscreen,
      onToggleMute: toggleMute,
      onTogglePlay: togglePlay,
      onVolumeChange: volumeChanged,
    },
    h,
  );

const definition = {
  Args,
  Model,
  init,
  update,
  view: (model: Model, h: Parameters<typeof videoPlayer<Message>>[1]) => specimen(model, h),
} as const;

export default {
  ...componentMeta("video-player"),
  title: "Untitled UI/Base/Video Player",
};

export const AllVariants = {
  ...liveStory<typeof Args.Type, Model, Message>({
    ...definition,
    view: (model, h) =>
      matrix(
        [
          ["Small", [h.div([h.Class("w-80")], [specimen({ ...model, size: "sm" }, h)])]],
          ["Medium", [h.div([h.Class("w-96")], [specimen({ ...model, size: "md" }, h)])]],
          [
            "Large",
            [
              h.div(
                [h.Class("w-112")],
                [specimen({ ...model, showThumbnailOverlay: true, size: "lg" }, h)],
              ),
            ],
          ],
        ],
        h,
      ),
  }),
  args: {
    showThumbnailOverlay: false,
    size: "md",
    src: source,
    thumbnailAlt: "Siglata product overview",
    thumbnailUrl: thumbnail,
  },
};

export const States = {
  ...liveStory<typeof Args.Type, Model, Message>({
    ...definition,
    init: (args) => ({
      ...init(args),
      bufferedPercent: 0,
      currentTime: 0,
      duration: 0,
      showThumbnail: false,
    }),
    view: (model, h) =>
      matrix([["Controls", [h.div([h.Class("w-160")], [specimen(model, h)])]]], h),
  }),
  args: {
    showThumbnailOverlay: false,
    size: "lg",
    src: emptySource,
    thumbnailAlt: "",
    thumbnailUrl: "",
  },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const video = await canvas.findByLabelText("Video player");
    video.focus();
  },
};

export const Dark = {
  ...liveStory<typeof Args.Type, Model, Message>({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
        [h.div([h.Class("w-96")], [specimen(model, h)])],
      ),
  }),
  args: {
    showThumbnailOverlay: false,
    size: "md",
    src: source,
    thumbnailAlt: "Siglata product overview",
    thumbnailUrl: thumbnail,
  },
};

export const Interactions = {
  ...liveStory<typeof Args.Type, Model, Message>({
    ...definition,
    view: (model, h) => h.div([h.Class("w-160")], [specimen({ ...model, size: "lg" }, h)]),
  }),
  args: {
    showThumbnailOverlay: true,
    size: "lg",
    src: source,
    thumbnailAlt: "Siglata product overview",
    thumbnailUrl: thumbnail,
  },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Play video" }));
    const video = await canvas.findByLabelText("Video player");
    await expect(await canvas.findByRole("button", { name: "Pause" })).toBeInTheDocument();
    video.focus();
    await userEvent.keyboard("m");
    await waitFor(
      () => expect(canvas.getByRole("button", { name: "Unmute" })).toBeInTheDocument(),
      { timeout: 3000 },
    );
    await userEvent.click(await canvas.findByRole("button", { name: "Playback speed" }));
    await expect(await canvas.findByText("1.25×")).toBeVisible();
    video.focus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(
      () => expect(canvas.getByRole("slider", { name: "Video progress" })).toHaveValue("10"),
      { timeout: 3000 },
    );
  },
};
