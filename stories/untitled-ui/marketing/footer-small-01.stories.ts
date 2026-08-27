/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { footerSmall01 } from "../../../../../packages/ui/src/marketing/footer-small-01.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({});
const Model = Args;
type Model = typeof Model.Type;

const Action = m("FooterSmall01Action", { id: S.String });
type Message = typeof Action.Type;

const definition = {
  Args,
  Model,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof footerSmall01<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [footerSmall01({ ...model, onLink: (linkId) => Action({ id: linkId }) }, h)],
    ),
} as const;

const args = {
  copyright: "© 2026 Siglata",
  copyrightMobileSuffix: "All rights reserved.",
} as const;

export default {
  ...componentMeta("footer-small-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Footers/Footer Small 01",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof footerSmall01<Message>>[1]) =>
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
    const link = canvas.queryByRole("link");
    if (link !== null) {
      await userEvent.click(link);
      await waitFor(() => expect(link).toBeVisible());
    }
  },
};
