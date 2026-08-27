/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF and focus checks use the browser promise API directly. */
import * as S from "effect/Schema";
import { appStoreButtons } from "ui/base";
import type { AppStoreButtonStore } from "ui/base";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({
  href: S.String,
  size: S.Literals(["md", "lg"]),
  store: S.Literals([
    "google-play",
    "google-play-white",
    "app-store",
    "galaxy-store",
    "app-gallery",
  ]),
});
type Model = typeof Args.Type;
type Message = Readonly<{ _tag: "Noop" }>;

const stores: readonly AppStoreButtonStore[] = [
  "google-play",
  "google-play-white",
  "app-store",
  "galaxy-store",
  "app-gallery",
];

const specimen = (
  store: AppStoreButtonStore,
  size: "md" | "lg",
  href: string,
  h: Parameters<typeof appStoreButtons<Message>>[1],
) => appStoreButtons({ href, size, store }, h);

const definition = {
  Args,
  Model: Args,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof appStoreButtons<Message>>[1]) =>
    specimen(model.store, model.size, model.href, h),
};

const variants = (model: Model, h: Parameters<typeof appStoreButtons<Message>>[1]) =>
  matrix(
    [
      ["Medium", stores.map((store) => specimen(store, "md", model.href, h))],
      ["Large", stores.map((store) => specimen(store, "lg", model.href, h))],
    ],
    h,
  );

export default {
  ...componentMeta("app-store-buttons"),
  title: "Untitled UI/Base/App Store Buttons",
};

export const AllVariants = {
  ...liveStory({ ...definition, view: variants }),
  args: { href: "#", size: "md", store: "google-play" },
};

export const States = {
  ...liveStory({
    ...definition,
    view: (model, h) => matrix([["Focus", [specimen(model.store, model.size, model.href, h)]]], h),
  }),
  args: { href: "#", size: "md", store: "google-play" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const link = await within(canvasElement).findByRole("link", { name: "Get it on Google Play" });
    link.focus();
    await expect(link).toHaveFocus();
  },
};

export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [variants(model, h)],
      ),
  }),
  args: { href: "#", size: "md", store: "google-play" },
};

export const Interactions = {
  ...liveStory(definition),
  args: { href: "#", size: "md", store: "app-store" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(
      await canvas.findByRole("link", { name: "Download on the App Store" }),
    ).toHaveFocus();
  },
};
