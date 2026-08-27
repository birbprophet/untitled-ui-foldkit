/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises FoldKit in Chromium. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { contentSectionRichText01 } from "../../../src/marketing/content-section-rich-text-01.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  authorAvatarSrc: S.String,
  authorName: S.String,
  authorRole: S.String,
  copyLabel: S.String,
});
const Model = Args;
type Model = typeof Model.Type;
const CopyLink = m("ContentSectionRichText01CopyLink");
type Message = typeof CopyLink.Type;
const actions = { onCopyLink: CopyLink() };

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof contentSectionRichText01<Message>>[1]) =>
    h.div([h.Class("-m-8")], [contentSectionRichText01({ ...model, ...actions }, h)]),
} as const;

const args = {
  authorAvatarSrc: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80",
  authorName: "Olivia Rhye",
  authorRole: "Product Designer, Untitled",
  copyLabel: "Copy link",
} as const;

export default {
  ...componentMeta("content-section-rich-text-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Content/Content Section Rich Text 01",
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
