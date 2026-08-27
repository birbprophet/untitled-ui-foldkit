/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF and browser interactions use promise APIs. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { contactIconCards03 } from "../../../src/marketing/contact-icon-cards-03.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Card = S.Struct({
  cta: S.String,
  href: S.String,
  icon: S.Union([S.Literal("chat"), S.Literal("pin"), S.Literal("phone")]),
  id: S.String,
  subtitle: S.String,
  title: S.String,
});
const Args = S.Struct({
  badgeLabel: S.String,
  cards: S.Array(Card),
  description: S.String,
  heading: S.String,
  imageAlt: S.String,
  imageSrc: S.String,
});
type Model = typeof Args.Type;
const ContactSelected = m("ContactIconCards03ContactSelected", { id: S.String });
type Message = typeof ContactSelected.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => ({
    ...model,
    cards: model.cards.map((card) =>
      card.id === message.id ? { ...card, href: "#contact-opened" } : card,
    ),
  }),
  view: (model: Model, h: Parameters<typeof contactIconCards03<Message>>[1]) =>
    contactIconCards03({ ...model, onContact: (id) => ContactSelected({ id }) }, h),
} as const;

const cards = [
  {
    cta: "sales@siglata.com",
    href: "mailto:sales@siglata.com",
    icon: "chat",
    id: "sales",
    subtitle: "Speak to our friendly team.",
    title: "Chat to sales",
  },
  {
    cta: "100 Smith Street\nCollingwood VIC 3066 AU",
    href: "https://goo.gl/maps/zTXmPKVdUvCQH9Wd6",
    icon: "pin",
    id: "visit",
    subtitle: "Visit our office HQ.",
    title: "Visit us",
  },
  {
    cta: "+1 (555) 000-0000",
    href: "tel:+1 (555) 000-0000",
    icon: "phone",
    id: "call",
    subtitle: "Mon-Fri from 8am to 5pm.",
    title: "Call us",
  },
] as const;

const args = {
  badgeLabel: "Contact us",
  cards,
  description: "Chat to our friendly team.",
  heading: "We'd love to hear from you",
  imageAlt: "People discussion a topic",
  imageSrc: "https://www.untitledui.com/marketing/smiling-girl-11.webp",
} as const;

export default {
  ...componentMeta("contact-icon-cards-03"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Icon Cards 03",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory(definition),
  args: {
    ...args,
    cards: cards.map((card) => (card.id === "sales" ? { ...card, href: "#contact-opened" } : card)),
  },
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) => h.div([h.DataAttribute("theme", "dark")], [definition.view(model, h)]),
  }),
  args,
};
export const Responsive = { ...liveStory(definition), args };
export const Interactions = {
  ...liveStory(definition),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const sales = within(canvasElement).getByRole("link", { name: "sales@siglata.com" });
    sales.focus();
    await expect(sales).toHaveAttribute("href", "mailto:sales@siglata.com");
    const office = within(canvasElement).getByRole("link", { name: /100 Smith Street/u });
    await userEvent.click(office);
    await waitFor(() => expect(office).toHaveAttribute("href", "#contact-opened"));
  },
};
