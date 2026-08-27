/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { contactSimpleIcons01 } from "../../../src/marketing/contact-simple-icons-01.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Item = S.Struct({
  cta: S.String,
  href: S.String,
  icon: S.Union([S.Literal("email"), S.Literal("office"), S.Literal("phone")]),
  id: S.String,
  subtitle: S.String,
  title: S.String,
});
const Args = S.Struct({ items: S.Array(Item) });
type Model = typeof Args.Type;
const ContactSelected = m("ContactSimpleIcons01ContactSelected", { id: S.String });
type Message = typeof ContactSelected.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => ({
    ...model,
    items: model.items.map((item) =>
      item.id === message.id ? { ...item, href: `#${item.id}-opened` } : item,
    ),
  }),
  view: (model: Model, h: Parameters<typeof contactSimpleIcons01<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [contactSimpleIcons01({ ...model, onContact: (id) => ContactSelected({ id }) }, h)],
    ),
} as const;

const args = {
  items: [
    {
      cta: "hi@untitledui.com",
      href: "mailto:hi@untitledui.com",
      icon: "email",
      id: "email",
      subtitle: "Our friendly team is here to help.",
      title: "Email",
    },
    {
      cta: "100 Smith Street\nCollingwood VIC 3066 AU",
      href: "https://goo.gl/maps/zTXmPKVdUvCQH9Wd6",
      icon: "office",
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
  ...componentMeta("contact-simple-icons-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Simple Icons 01",
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
    const email = canvas.getByRole("link", { name: "hi@untitledui.com" });
    email.focus();
    await expect(email).toHaveAttribute("href", "mailto:hi@untitledui.com");
    const office = canvas.getByRole("link", { name: /100 Smith Street/u });
    await userEvent.click(office);
    await waitFor(() => expect(office).toHaveAttribute("href", "#office-opened"));
    const phone = canvas.getByRole("link", { name: "+1 (555) 000-0000" });
    phone.focus();
    await expect(phone).toHaveAttribute("href", "tel:+1 (555) 000-0000");
  },
};
