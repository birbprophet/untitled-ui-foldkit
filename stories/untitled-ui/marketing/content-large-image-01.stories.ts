/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises FoldKit in Chromium. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  contentLargeImage01,
  contentLargeImage01Defaults,
} from "../../../src/marketing/content-large-image-01.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  authorAvatarSrc: S.String,
  authorDate: S.String,
  authorName: S.String,
  authorRole: S.String,
  copyLabel: S.String,
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  heroAlt: S.String,
  heroSrc: S.String,
});
const Model = Args;
type Model = typeof Model.Type;
const CopyLink = m("ContentLargeImage01CopyLink");
type Message = typeof CopyLink.Type;
const actions = { onCopyLink: CopyLink() };

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof contentLargeImage01<Message>>[1]) =>
    h.div([h.Class("-m-8")], [contentLargeImage01({ ...model, ...actions }, h)]),
} as const;

const args = { ...contentLargeImage01Defaults } as const;

export default {
  ...componentMeta("content-large-image-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Content/Content Large Image 01",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args,
};
export const Responsive = { ...liveStory(definition), args };
export const Interactions = {
  ...liveStory(definition),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.click(button);
    await waitFor(() => expect(button).toBeInTheDocument());
  },
};
