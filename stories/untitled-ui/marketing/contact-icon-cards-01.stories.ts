/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  contactIconCards01,
  contactIconCards01Cards,
} from "../../../src/marketing/contact-icon-cards-01.ts";

import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Icon = S.Union([
  S.Literal("chat"),
  S.Literal("location"),
  S.Literal("phone"),
  S.Literal("smile"),
]);
const Card = S.Struct({
  cta: S.String,
  href: S.String,
  icon: Icon,
  id: S.String,
  subtitle: S.String,
  title: S.String,
});
const Args = S.Struct({
  cards: S.Array(Card),
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
});
type Args = typeof Args.Type;
type Message = Readonly<{ _tag: "Activated"; id: string }>;

const definition = {
  Args,
  Model: Args,
  init: (args: Args): Args => args,
  update: (model: Args, message: Message): Args => ({
    ...model,
    cards: model.cards.map((card) =>
      card.id === message.id ? { ...card, href: "#contact-opened" } : card,
    ),
  }),
  view: (model: Args, h: Parameters<typeof contactIconCards01<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        contactIconCards01(
          { ...model, onActivate: (id): Message => ({ _tag: "Activated", id }) },
          h,
        ),
      ],
    ),
} as const;

const args = {
  cards: [...contactIconCards01Cards],
  description: "Our friendly team is always here to chat.",
  eyebrow: "Contact us",
  heading: "We'd love to hear from you",
} satisfies Args;

export default {
  ...componentMeta("contact-icon-cards-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Icon Cards 01",
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
    const sales = await canvas.findByRole("link", { name: "sales@siglata.com" });
    sales.focus();
    await expect(sales).toHaveFocus();
    await expect(sales).toHaveAttribute("href", "mailto:sales@siglata.com");
    const office = canvas.getByRole("link", { name: /100 Smith Street/u });
    await userEvent.click(office);
    await waitFor(() => expect(office).toHaveAttribute("href", "#contact-opened"));
    sales.blur();
  },
};
