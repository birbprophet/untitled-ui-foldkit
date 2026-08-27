/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook play functions and native dialog commands use promise-based browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { centeredPhotoCarouselModal } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({ isOpen: S.Boolean, selectedIndex: S.Number });
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const DialogShown = m("CenteredPhotoCarouselDialogShown");
const DialogClosed = m("CenteredPhotoCarouselDialogClosed");
type Message =
  | Readonly<{ _tag: "Dismiss" | "Finish" | "Skip" }>
  | Readonly<{ _tag: "SelectSlide"; index: number }>
  | typeof DialogShown.Type
  | typeof DialogClosed.Type;

const ShowCenteredPhotoCarouselDialog = Command.define("ShowCenteredPhotoCarouselDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "button" }).pipe(
      Effect.match({ onFailure: () => DialogShown(), onSuccess: () => DialogShown() }),
    ),
  messages: [DialogShown],
});

const CloseCenteredPhotoCarouselDialog = Command.define("CloseCenteredPhotoCarouselDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => DialogClosed(), onSuccess: () => DialogClosed() }),
    ),
  messages: [DialogClosed],
});

const selectSlide = (index: number): Message => ({ _tag: "SelectSlide", index });
const simple = (tag: "Dismiss" | "Finish" | "Skip"): Message => ({ _tag: tag });

const definitionAt = (initialIndex: number) => ({
  Args,
  Model,
  init: (_args: Args) =>
    [
      { isOpen: true, selectedIndex: initialIndex } satisfies Model,
      [ShowCenteredPhotoCarouselDialog({ selector: "#centered-photo-carousel-modal-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "SelectSlide") {
      return [{ ...model, selectedIndex: message.index }, []] as const;
    }
    const next = {
      ...model,
      isOpen: message._tag === "CenteredPhotoCarouselDialogClosed" ? false : model.isOpen,
    } satisfies Model;
    return message._tag === "Dismiss" || message._tag === "Finish" || message._tag === "Skip"
      ? ([
          next,
          [CloseCenteredPhotoCarouselDialog({ selector: "#centered-photo-carousel-modal-story" })],
        ] as const)
      : ([next, []] as const);
  },
  view: (model: Model, h: Parameters<typeof centeredPhotoCarouselModal<Message>>[1]) =>
    centeredPhotoCarouselModal(
      {
        id: "centered-photo-carousel-modal-story",
        isOpen: model.isOpen,
        messageForSlide: selectSlide,
        onDismiss: simple("Dismiss"),
        onFinish: simple("Finish"),
        onSkip: simple("Skip"),
        selectedIndex: model.selectedIndex,
      },
      h,
    ),
});

const definition = definitionAt(0);
const fixture = {} satisfies Args;

export default {
  ...componentMeta("centered-photo-carousel-modal"),
  title: "Untitled UI/Application/Centered Photo Carousel Modal",
};

export const AllVariants = { ...liveCommandStory(definition), args: fixture };

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
    await userEvent.click(await canvas.findByRole("button", { name: "Next" }));
    await expect(await canvas.findByRole("button", { name: "Back" })).toBeVisible();
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.click(await canvas.findByRole("button", { name: "Next" }));
    await expect(await canvas.findByRole("button", { name: "Finish" })).toBeVisible();
    await userEvent.click(await canvas.findByRole("button", { name: "Finish" }));
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
  },
};
