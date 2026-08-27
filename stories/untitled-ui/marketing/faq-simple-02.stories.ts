/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises FoldKit in Chromium. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  faqSimple02,
  faqSimple02DefaultItems,
} from "../../../../../packages/ui/src/marketing/faq-simple-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  ctaDescription: S.String,
  ctaHeading: S.String,
  ctaLabel: S.String,
  description: S.String,
  heading: S.String,
  items: S.Array(
    S.Struct({
      answer: S.String,
      icon: S.Union(
        S.Literal("credit-card"),
        S.Literal("file"),
        S.Literal("heart"),
        S.Literal("mail"),
        S.Literal("slash"),
        S.Literal("switch"),
      ),
      id: S.String,
      question: S.String,
    }),
  ),
  supportHref: S.String,
  supportLabel: S.String,
});
type Model = typeof Args.Type;
const Cta = m("FaqSimple02Cta");
const Support = m("FaqSimple02Support");
type Message = typeof Cta.Type | typeof Support.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof faqSimple02<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        faqSimple02(
          {
            ...model,
            onCta: Cta(),
            onSupport: Support(),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  ctaDescription: "Can't find the answer you're looking for? Please chat to our friendly team.",
  ctaHeading: "Still have questions?",
  ctaLabel: "Get in touch",
  description: "Everything you need to know about the product and billing.",
  heading: "Frequently asked questions",
  items: [...faqSimple02DefaultItems],
  supportHref: "#",
  supportLabel: "chat to our friendly team",
} as const;

export default {
  ...componentMeta("faq-simple-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Faq/Faq Simple 02",
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
    const cta = await canvas.findByRole("button", { name: /Get in touch/u });
    await userEvent.click(cta);
    await waitFor(() => expect(cta).toBeInTheDocument());
  },
};
