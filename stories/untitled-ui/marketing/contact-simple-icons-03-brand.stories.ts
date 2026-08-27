/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled LTR FoldKit contact links in Chromium. */
import * as S from "effect/Schema";
import { expect, within } from "storybook/test";

import {
  contactSimpleIcons03Brand,
  contactSimpleIcons03BrandItems,
} from "../../../src/marketing/contact-simple-icons-03-brand.ts";

import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Icon = S.Union([S.Literal("email"), S.Literal("location"), S.Literal("phone")]);
const Item = S.Struct({
  cta: S.String,
  href: S.String,
  icon: Icon,
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
type Args = typeof Args.Type;
type Message = Readonly<{ _tag: "Activated"; id: string }>;

const definition = {
  Args,
  Model: Args,
  init: (args: Args): Args => args,
  update: (model: Args, message: Message): Args => ({
    ...model,
    items: model.items.map((item) =>
      item.id === message.id ? { ...item, href: "#contact-opened" } : item,
    ),
  }),
  view: (model: Args, h: Parameters<typeof contactSimpleIcons03Brand<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        contactSimpleIcons03Brand(
          { ...model, onActivate: (id): Message => ({ _tag: "Activated", id }) },
          h,
        ),
      ],
    ),
} as const;

const args = {
  description: "Our friendly team is always here to chat.",
  eyebrow: "Contact us",
  heading: "Get in touch",
  items: [...contactSimpleIcons03BrandItems],
} satisfies Args;

export default {
  ...componentMeta("contact-simple-icons-03-brand"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Simple Icons 03 Brand",
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
    const email = await canvas.findByRole("link", { name: "hi@siglata.com" });
    email.focus();
    await expect(email).toHaveFocus();
    await expect(email).toHaveAttribute("href", "mailto:hi@siglata.com");
    email.blur();
  },
};
