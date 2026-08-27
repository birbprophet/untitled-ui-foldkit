/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises FoldKit in Chromium. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  faqSimple03,
  faqSimple03DefaultItems,
} from "../../../../../packages/ui/src/marketing/faq-simple-03.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  avatars: S.Array(
    S.Struct({
      alt: S.String,
      emphasis: S.optional(S.Boolean),
      id: S.String,
      size: S.Union(S.Literal("lg"), S.Literal("xl")),
      src: S.String,
    }),
  ),
  ctaDescription: S.String,
  ctaHeading: S.String,
  ctaLabel: S.String,
  description: S.String,
  heading: S.String,
  imageAlt: S.String,
  imageSrc: S.String,
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
});
type Model = typeof Args.Type;
const Cta = m("FaqSimple03Cta");
type Message = typeof Cta.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof faqSimple03<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        faqSimple03(
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
      src: "https://www.untitledui.com/images/avatars/marco-kelly?fm=webp&q=80",
    },
    {
      alt: "Amelie Laurent",
      emphasis: true,
      id: "amelie",
      size: "xl",
      src: "https://www.untitledui.com/images/avatars/amelie-laurent?fm=webp&q=80",
    },
    {
      alt: "Jaya Willis",
      id: "jaya",
      size: "lg",
      src: "https://www.untitledui.com/images/avatars/jaya-willis?fm=webp&q=80",
    },
  ],
  ctaDescription: "Can't find the answer you're looking for? Please chat to our friendly team.",
  ctaHeading: "Still have questions?",
  ctaLabel: "Get in touch",
  description: "Everything you need to know about the product and billing.",
  heading: "Frequently asked questions",
  imageAlt: "Team collaborating",
  imageSrc: "https://www.untitledui.com/marketing/photographer-girl.webp",
  items: [...faqSimple03DefaultItems],
} as const;

export default {
  ...componentMeta("faq-simple-03"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Faq/Faq Simple 03",
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
