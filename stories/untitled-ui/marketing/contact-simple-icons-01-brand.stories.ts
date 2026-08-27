/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit contact links in Chromium. */
import * as S from "effect/Schema";
import { expect, within } from "storybook/test";

import {
  contactSimpleIcons01Brand,
  contactSimpleIcons01BrandItems,
} from "../../../src/marketing/contact-simple-icons-01-brand.ts";
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
const Args = S.Struct({ items: S.Array(Item) });
type Args = typeof Args.Type;
const Model = S.Struct({ ...Args.fields, activatedId: S.optional(S.String) });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "ContactOpened"; id: string }>;

const definition = {
  Args,
  Model,
  init: (args: Args): Model => args,
  update: (model: Model, message: Message): Model => ({
    ...model,
    activatedId: message.id,
    items: model.items.map((item) =>
      item.id === message.id ? { ...item, href: "#contact-opened" } : item,
    ),
  }),
  view: (model: Model, h: Parameters<typeof contactSimpleIcons01Brand<Message>>[1]) =>
    contactSimpleIcons01Brand(
      {
        items: model.items,
        onContact: (id): Message => ({ _tag: "ContactOpened", id }),
      },
      h,
    ),
} as const;

const args = { items: [...contactSimpleIcons01BrandItems] } satisfies Args;

export default {
  ...componentMeta("contact-simple-icons-01-brand"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Simple Icons 01 Brand",
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
    await expect(canvas.getByRole("link", { name: /100 Smith Street/u })).toHaveAttribute(
      "href",
      "https://goo.gl/maps/zTXmPKVdUvCQH9Wd6",
    );
    email.blur();
  },
};
