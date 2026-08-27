/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook's browser interaction API is promise based. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  contactIconCards02,
  contactIconCards02Cards,
} from "../../../../../packages/ui/src/marketing/contact-icon-cards-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Card = S.Struct({
  cta: S.String,
  href: S.String,
  icon: S.Literals(["chat", "location", "phone"]),
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
type Model = typeof Args.Type;
type Message = Readonly<{ _tag: "ContactSelected"; id: string }>;

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
  view: (model: Model, h: Parameters<typeof contactIconCards02<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        contactIconCards02(
          {
            ...model,
            onContact: (id): Message => ({ _tag: "ContactSelected", id }),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  cards: [...contactIconCards02Cards],
  description: "Chat to our friendly team.",
  eyebrow: "Contact us",
  heading: "Get in touch",
} satisfies typeof Args.Type;

export default {
  ...componentMeta("contact-icon-cards-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Icon Cards 02",
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
    await expect(sales).toHaveAttribute("href", "mailto:sales@siglata.com");
    const office = canvas.getByRole("link", { name: /100 Smith Street/u });
    await userEvent.click(office);
    await waitFor(() => expect(office).toHaveAttribute("href", "#contact-opened"));
    sales.blur();
  },
};
