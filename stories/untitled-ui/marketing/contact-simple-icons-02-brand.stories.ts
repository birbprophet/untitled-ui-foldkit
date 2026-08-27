/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit contact section in Chromium. */
import * as S from "effect/Schema";
import { expect, within } from "storybook/test";

import {
  contactSimpleIcons02Brand,
  contactSimpleIcons02BrandItems,
} from "../../../src/marketing/contact-simple-icons-02-brand.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Item = S.Struct({
  cta: S.String,
  href: S.String,
  icon: S.Union([S.Literal("email"), S.Literal("office"), S.Literal("phone")]),
  id: S.String,
  subtitle: S.String,
  title: S.String,
});
const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  items: S.Array(Item),
});
type Model = typeof Args.Type;
type Message = Readonly<{ _tag: "ContactSimpleIcons02BrandOpened"; id: string }>;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => ({
    ...model,
    items: model.items.map((item) =>
      item.id === message.id ? { ...item, href: "#contact-opened" } : item,
    ),
  }),
  view: (model: Model, h: Parameters<typeof contactSimpleIcons02Brand<Message>>[1]) =>
    contactSimpleIcons02Brand(
      {
        ...model,
        onContact: (id): Message => ({ _tag: "ContactSimpleIcons02BrandOpened", id }),
      },
      h,
    ),
} as const;

const args = {
  description: "Our friendly team is always here to chat.",
  eyebrow: "Contact us",
  heading: "Get in touch",
  items: [...contactSimpleIcons02BrandItems],
} satisfies Model;

export default {
  ...componentMeta("contact-simple-icons-02-brand"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Simple Icons 02 Brand",
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
    const email = await within(canvasElement).findByRole("link", { name: "hi@siglata.com" });
    await expect(email).toHaveAttribute("href", "mailto:hi@siglata.com");
    email.focus();
    await expect(email).toHaveFocus();
    email.blur();
  },
};
