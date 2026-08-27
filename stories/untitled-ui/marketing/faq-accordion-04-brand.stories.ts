/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises FoldKit in Chromium. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  faqAccordion04Brand,
  faqAccordion04BrandDefaultItems,
} from "../../../src/marketing/faq-accordion-04-brand.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  ctaDescription: S.String,
  ctaHeading: S.String,
  ctaLabel: S.String,
  description: S.String,
  heading: S.String,
  items: S.Array(S.Struct({ answer: S.String, id: S.String, question: S.String })),
});
const Model = S.Struct({ ...Args.fields, openIds: S.Array(S.String) });
type Model = typeof Model.Type;
const Cta = m("FaqAccordion04BrandCta");
const Toggle = m("FaqAccordion04BrandToggle", { id: S.String });
type Message = typeof Cta.Type | typeof Toggle.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    openIds: args.items.map((item) => item.id).slice(0, 1),
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "FaqAccordion04BrandToggle") {
      const open = model.openIds.includes(message.id);
      return {
        ...model,
        openIds: open
          ? model.openIds.filter((id) => id !== message.id)
          : [...model.openIds, message.id],
      };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof faqAccordion04Brand<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        faqAccordion04Brand(
          {
            ...model,
            onCta: Cta(),
            onToggle: (id) => Toggle({ id }),
            openIds: model.openIds,
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
  items: [...faqAccordion04BrandDefaultItems],
} as const;

export default {
  ...componentMeta("faq-accordion-04-brand"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Faq/Faq Accordion 04 Brand",
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
    const button = await canvas.findByRole("button", { name: /free trial/u });
    await userEvent.click(button);
    await waitFor(() => expect(button).toHaveAttribute("aria-expanded", "false"));
  },
};
