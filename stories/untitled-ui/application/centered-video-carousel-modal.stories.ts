/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/require-is-prefix-for-boolean-schema-field -- Storybook play functions and native dialog commands use promise-based browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import type { CenteredVideoAction } from "../../../src/application.ts";
import { centeredVideoCarouselModal } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({
  currentTime: S.Number,
  duration: S.Number,
  isFullscreen: S.Boolean,
  isMuted: S.Boolean,
  isOpen: S.Boolean,
  isPlaying: S.Boolean,
  playbackRate: S.Number,
  selectedIndex: S.Number,
  showThumbnail: S.Boolean,
  volume: S.Number,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const DialogShown = m("CenteredVideoCarouselDialogShown");
const DialogClosed = m("CenteredVideoCarouselDialogClosed");
type Message =
  | Readonly<{ _tag: "Dismiss" | "Finish" | "Skip" }>
  | Readonly<{ _tag: "SelectSlide"; index: number }>
  | Readonly<{ _tag: "VideoAction"; action: CenteredVideoAction; index: number }>
  | typeof DialogShown.Type
  | typeof DialogClosed.Type;

const ShowCenteredVideoCarouselDialog = Command.define("ShowCenteredVideoCarouselDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "button" }).pipe(
      Effect.match({ onFailure: () => DialogShown(), onSuccess: () => DialogShown() }),
    ),
  messages: [DialogShown],
});

const CloseCenteredVideoCarouselDialog = Command.define("CloseCenteredVideoCarouselDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => DialogClosed(), onSuccess: () => DialogClosed() }),
    ),
  messages: [DialogClosed],
});

const selectSlide = (index: number): Message => ({ _tag: "SelectSlide", index });
const videoAction = (index: number, action: CenteredVideoAction): Message => ({
  _tag: "VideoAction",
  action,
  index,
});
const simple = (tag: "Dismiss" | "Finish" | "Skip"): Message => ({ _tag: tag });
const playbackRates = [1, 1.25, 1.5, 1.75, 2] as const;

const initialModel = (playing: boolean): Model => ({
  currentTime: 0,
  duration: 3,
  isFullscreen: false,
  isMuted: false,
  isOpen: true,
  isPlaying: playing,
  playbackRate: 1,
  selectedIndex: 0,
  showThumbnail: !playing,
  volume: 1,
});

const updateVideo = (model: Model, action: CenteredVideoAction): Model => {
  if (action.type === "toggle-play") {
    return { ...model, isPlaying: !model.isPlaying, showThumbnail: false };
  }
  if (action.type === "toggle-mute") {
    return { ...model, isMuted: !model.isMuted };
  }
  if (action.type === "toggle-fullscreen") {
    return { ...model, isFullscreen: !model.isFullscreen };
  }
  if (action.type === "seek") {
    return { ...model, currentTime: action.seconds };
  }
  if (action.type === "volume-change") {
    return { ...model, isMuted: action.volume === 0, volume: action.volume };
  }
  const current = playbackRates.map(Number).indexOf(model.playbackRate);
  return { ...model, playbackRate: playbackRates[(current + 1) % playbackRates.length] ?? 1 };
};

const definitionWith = (playing: boolean) => ({
  Args,
  Model,
  init: (_args: Args) =>
    [
      initialModel(playing),
      [ShowCenteredVideoCarouselDialog({ selector: "#centered-video-carousel-modal-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "SelectSlide") {
      return [
        { ...model, isPlaying: false, selectedIndex: message.index, showThumbnail: true },
        [],
      ] as const;
    }
    if (message._tag === "VideoAction") {
      return [updateVideo(model, message.action), []] as const;
    }
    const next = {
      ...model,
      isOpen: message._tag === "CenteredVideoCarouselDialogClosed" ? false : model.isOpen,
    } satisfies Model;
    return message._tag === "Dismiss" || message._tag === "Finish" || message._tag === "Skip"
      ? ([
          next,
          [CloseCenteredVideoCarouselDialog({ selector: "#centered-video-carousel-modal-story" })],
        ] as const)
      : ([next, []] as const);
  },
  view: (model: Model, h: Parameters<typeof centeredVideoCarouselModal<Message>>[1]) =>
    centeredVideoCarouselModal(
      {
        id: "centered-video-carousel-modal-story",
        isOpen: model.isOpen,
        messageForSlide: selectSlide,
        messageForVideoAction: videoAction,
        onDismiss: simple("Dismiss"),
        onFinish: simple("Finish"),
        onSkip: simple("Skip"),
        selectedIndex: model.selectedIndex,
        videoState: model,
      },
      h,
    ),
});

const definition = definitionWith(false);
const fixture = {} satisfies Args;

export default {
  ...componentMeta("centered-video-carousel-modal"),
  title: "Untitled UI/Application/Centered Video Carousel Modal",
};

export const AllVariants = { ...liveCommandStory(definition), args: fixture };

export const States = {
  ...liveCommandStory(definition),
  args: fixture,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Play video" }));
    await expect(await canvas.findByRole("button", { name: "Pause" })).toBeInTheDocument();
  },
};

export const Dark = {
  ...liveCommandStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: fixture,
};

export const Responsive = { ...liveCommandStory(definition), args: fixture };

export const Interactions = {
  ...liveCommandStory(definition),
  args: fixture,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const dialog = await canvas.findByRole("dialog", { name: "Welcome to your dashboard" });
    await expect(dialog).toBeVisible();
    await userEvent.click(await canvas.findByRole("button", { name: "Play video" }));
    await expect(await canvas.findByRole("button", { name: "Pause" })).toBeInTheDocument();
    await userEvent.click(await canvas.findByRole("button", { name: "Continue" }));
    await expect(await canvas.findByRole("button", { name: "Play video" })).toBeVisible();
    await userEvent.click(await canvas.findByRole("button", { name: "Continue" }));
    await userEvent.click(await canvas.findByRole("button", { name: "Continue" }));
    await expect(await canvas.findByRole("button", { name: "Finish" })).toBeVisible();
    await userEvent.click(await canvas.findByRole("button", { name: "Finish" }));
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
  },
};
