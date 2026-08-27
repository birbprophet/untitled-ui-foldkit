/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { footerSmall02 } from "../../../../../packages/ui/src/marketing/footer-small-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({});
const Model = Args;
type Model = typeof Model.Type;

type Message = never;

const definition = {
  Args,
  Model,
  init: (args: Model): Model => args,
  view: (model: Model, h: Parameters<typeof footerSmall02>[1]) =>
    h.div([h.Class("-m-8")], [footerSmall02({ ...model }, h)]),
} as const;

const args = { copyright: "© 2026 Siglata. All rights reserved." } as const;

export default {
  ...componentMeta("footer-small-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Footers/Footer Small 02",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof footerSmall02>[1]) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args,
};
export const Responsive = { ...liveStory(definition), args };

export const Interactions = { ...liveStory(definition), args };
