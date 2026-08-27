/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { contactSimpleIcons02 } from "../../../src/marketing/contact-simple-icons-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Method = S.Struct({
  cta: S.String,
  href: S.String,
  icon: S.Union([S.Literal("mail"), S.Literal("phone"), S.Literal("pin")]),
  id: S.String,
  subtitle: S.String,
  title: S.String,
});
const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  methods: S.Array(Method),
});
type Model = typeof Args.Type;
const ContactSelected = m("ContactSimpleIcons02ContactSelected", { id: S.String });
type Message = typeof ContactSelected.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => ({
    ...model,
    methods: model.methods.map((method) =>
      method.id === message.id ? { ...method, href: `#${method.id}-opened` } : method,
    ),
  }),
  view: (model: Model, h: Parameters<typeof contactSimpleIcons02<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [contactSimpleIcons02({ ...model, onContact: (id) => ContactSelected({ id }) }, h)],
    ),
} as const;

const args = {
  description: "Our friendly team is always here to chat.",
  eyebrow: "Contact us",
  heading: "Get in touch",
  methods: [
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
} as const;

export default {
  ...componentMeta("contact-simple-icons-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Simple Icons 02",
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
    const email = canvas.getByRole("link", { name: "hi@siglata.com" });
    await expect(email).toHaveAttribute("href", "mailto:hi@siglata.com");
    email.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(email).toHaveAttribute("href", "#email-opened"));
  },
};
