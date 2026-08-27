/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit contact section in Chromium. */
import * as S from "effect/Schema";
import { expect, within } from "storybook/test";

import {
  contactIconsAndMap01Brand,
  contactIconsAndMap01BrandItems,
} from "../../../src/marketing/contact-icons-and-map-01-brand.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Icon = S.Union([S.Literal("email"), S.Literal("office"), S.Literal("phone")]);
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
  mapSrc: S.String,
  mapTitle: S.String,
});
type Args = typeof Args.Type;
type Message = Readonly<{ _tag: "ContactOpened"; id: string }>;

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
  view: (model: Args, h: Parameters<typeof contactIconsAndMap01Brand<Message>>[1]) =>
    contactIconsAndMap01Brand(
      {
        ...model,
        onContact: (id): Message => ({ _tag: "ContactOpened", id }),
      },
      h,
    ),
} as const;

const args = {
  description: "Our friendly team would love to hear from you.",
  eyebrow: "Contact us",
  heading: "Get in touch",
  items: [...contactIconsAndMap01BrandItems],
  mapSrc: "https://snazzymaps.com/embed/451894",
  mapTitle: "Our address",
} satisfies Args;

export default {
  ...componentMeta("contact-icons-and-map-01-brand"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Icons And Map 01 Brand",
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
    await expect(canvas.getByTitle(args.mapTitle)).toHaveAttribute("src", args.mapSrc);
    email.blur();
  },
};
