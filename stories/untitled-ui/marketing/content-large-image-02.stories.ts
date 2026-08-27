/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises FoldKit in Chromium. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { contentLargeImage02 } from "../../../../../packages/ui/src/marketing/content-large-image-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({ authorAvatarSrc: S.String,
  authorDate: S.String,
  authorName: S.String,
  authorRole: S.String,
  copyLabel: S.String,
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  heroAlt: S.String,
  heroSrc: S.String });
const Model = Args;
type Model = typeof Model.Type;
const CopyLink = m("ContentLargeImage02CopyLink");
type Message = typeof CopyLink.Type;
const actions = { onCopyLink: CopyLink() };

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof contentLargeImage02<Message>>[1]) =>
    h.div([h.Class("-m-8")], [contentLargeImage02({ ...model, ...actions }, h)]),
} as const;

import { contentLargeImage02Defaults } from "../../../../../packages/ui/src/marketing/content-large-image-02.ts";

const args = { ...contentLargeImage02Defaults } as const;

export default { ...componentMeta("content-large-image-02"), parameters: { layout: "fullscreen" }, title: "Untitled UI/Marketing/Content/Content Large Image 02" };
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = { ...liveStory({ ...definition, view: (model, h) => h.div([h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")], [definition.view(model, h)]) }), args };
export const Responsive = { ...liveStory(definition), args };
export const Interactions = { ...liveStory(definition), args, play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => { await waitForStoryReady(canvasElement); const canvas = within(canvasElement); const button = canvas.queryByRole("button"); if (button !== null) { await userEvent.click(button); await waitFor(() => expect(button).toBeInTheDocument()); } } };
