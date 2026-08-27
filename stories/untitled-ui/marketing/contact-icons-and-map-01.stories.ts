/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { contactIconsAndMap01 } from "../../../../../packages/ui/src/marketing/contact-icons-and-map-01.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const ContactMethod = S.Struct({
  cta: S.String,
  href: S.String,
  icon: S.Union([S.Literal("mail"), S.Literal("phone"), S.Literal("pin")]),
  id: S.String,
  subtitle: S.String,
  title: S.String,
});
const Args = S.Struct({
  contactMethods: S.Array(ContactMethod),
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  mapSrc: S.String,
  mapTitle: S.String,
});
type Model = typeof Args.Type;
type Message = Readonly<{ _tag: "Contact"; id: string }>;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => ({
    ...model,
    contactMethods: model.contactMethods.map((method) =>
      method.id === message.id ? { ...method, href: "#contact-opened" } : method,
    ),
  }),
  view: (model: Model, h: Parameters<typeof contactIconsAndMap01<Message>>[1]) =>
    contactIconsAndMap01({ ...model, onContact: (id): Message => ({ _tag: "Contact", id }) }, h),
} as const;

const args = {
  contactMethods: [
    {
      cta: "hi@siglata.com",
      href: "mailto:hi@siglata.com",
      icon: "mail",
      id: "email",
      subtitle: "Our friendly team is here to help.",
      title: "Email",
    },
    {
      cta: "100 Smith Street\nCollingwood VIC 3066 AU",
      href: "https://goo.gl/maps/zTXmPKVdUvCQH9Wd6",
      icon: "pin",
      id: "office",
      subtitle: "Come say hello at our office HQ.",
      title: "Office",
    },
    {
      cta: "+1 (555) 000-0000",
      href: "tel:+1 (555) 000-0000",
      icon: "phone",
      id: "phone",
      subtitle: "Mon-Fri from 8am to 5pm.",
      title: "Phone",
    },
  ],
  description: "Our friendly team would love to hear from you.",
  eyebrow: "Contact us",
  heading: "Get in touch",
  mapSrc: "https://snazzymaps.com/embed/451894",
  mapTitle: "Our address",
} as const;

export default {
  ...componentMeta("contact-icons-and-map-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Icons And Map 01",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
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
    const canvas = within(canvasElement);
    await expect(canvas.getByTitle("Our address")).toHaveAttribute(
      "src",
      "https://snazzymaps.com/embed/451894",
    );
    const email = canvas.getByRole("link", { name: "hi@siglata.com" });
    email.focus();
    await expect(email).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(email).toHaveAttribute("href", "#contact-opened"));
  },
};
