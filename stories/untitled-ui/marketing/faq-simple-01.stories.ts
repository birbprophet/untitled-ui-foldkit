/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises FoldKit in Chromium. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { faqSimple01, faqSimple01DefaultItems } from "../../../src/marketing/faq-simple-01.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";
import { agentFace } from "../../fixtures/brand.ts";

const marcoKelly = agentFace("Marco Kelly");
const amelieLaurent = agentFace("Amelie Laurent");
const jayaWillis = agentFace("Jaya Willis");

const Args = S.Struct({
  avatars: S.Array(
    S.Struct({
      alt: S.String,
      emphasis: S.optional(S.Boolean),
      id: S.String,
      size: S.Union([S.Literal("lg"), S.Literal("xl")]),
      src: S.String,
    }),
  ),
  ctaDescription: S.String,
  ctaHeading: S.String,
  ctaLabel: S.String,
  description: S.String,
  heading: S.String,
  items: S.Array(
    S.Struct({
      answer: S.String,
      icon: S.Union([
        S.Literal("credit-card"),
        S.Literal("file"),
        S.Literal("heart"),
        S.Literal("mail"),
        S.Literal("slash"),
        S.Literal("switch"),
      ]),
      id: S.String,
      question: S.String,
    }),
  ),
});
type Model = typeof Args.Type;
const Cta = m("FaqSimple01Cta");
type Message = typeof Cta.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof faqSimple01<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        faqSimple01(
          {
            ...model,
            onCta: Cta(),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  avatars: [
    {
      alt: "Marco Kelly",
      id: "marco",
      size: "lg",
      src: marcoKelly,
    },
    {
      alt: "Amelie Laurent",
      emphasis: true,
      id: "amelie",
      size: "xl",
      src: amelieLaurent,
    },
    {
      alt: "Jaya Willis",
      id: "jaya",
      size: "lg",
      src: jayaWillis,
    },
  ],
  ctaDescription: "Can't find the answer you're looking for? Please chat to our friendly team.",
  ctaHeading: "Still have questions?",
  ctaLabel: "Get in touch",
  description: "Everything you need to know about the product and billing.",
  heading: "Frequently asked questions",
  items: [...faqSimple01DefaultItems],
} as const;

export default {
  ...componentMeta("faq-simple-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Faq/Faq Simple 01",
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
