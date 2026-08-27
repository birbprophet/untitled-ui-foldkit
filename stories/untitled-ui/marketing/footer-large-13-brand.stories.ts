/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { footerLarge13Brand } from "../../../../../packages/ui/src/marketing/footer-large-13-brand.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({});
const Model = Args;
type Model = typeof Model.Type;

const Action = m("FooterLarge13BrandAction", { id: S.String });
type Message = typeof Action.Type;

const definition = {
  Args,
  Model,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof footerLarge13Brand<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        footerLarge13Brand(
          {
            ...model,
            onLink: (linkId) => Action({ id: linkId }),
            onPrimary: Action({ id: "primary" }),
            onSecondary: Action({ id: "secondary" }),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  copyright: "© 2026 Siglata. All rights reserved.",
  ctaDescription: "Join over 4,000+ startups already growing with Siglata.",
  ctaHeading: "Let's get started on something great",
  primaryLabel: "Get started",
  secondaryLabel: "View demo",
} as const;

export default {
  ...componentMeta("footer-large-13-brand"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Footers/Footer Large 13 Brand",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof footerLarge13Brand<Message>>[1]) =>
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
