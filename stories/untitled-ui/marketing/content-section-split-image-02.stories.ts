/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises FoldKit in Chromium. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { contentSectionSplitImage02 } from "../../../src/marketing/content-section-split-image-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  imageAlt: S.String,
  imageSrc: S.String,
  primaryLabel: S.String,
  secondaryLabel: S.String,
});
const Model = Args;
type Model = typeof Model.Type;
const Primary = m("ContentSectionSplitImage02Primary");
const Secondary = m("ContentSectionSplitImage02Secondary");
type Message = typeof Primary.Type | typeof Secondary.Type;
const actions = { onPrimary: Primary(), onSecondary: Secondary() };

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof contentSectionSplitImage02<Message>>[1]) =>
    h.div([h.Class("-m-8")], [contentSectionSplitImage02({ ...model, ...actions }, h)]),
} as const;

const args = {
  imageAlt: "Marketing image",
  imageSrc: "https://www.untitledui.com/marketing/content-section-03.webp",
  primaryLabel: "Read case study",
  secondaryLabel: "Chat to us",
} as const;

export default {
  ...componentMeta("content-section-split-image-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Content/Content Section Split Image 02",
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
