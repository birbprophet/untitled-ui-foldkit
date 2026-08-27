/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook exercises the source map pins and controlled contact links in Chromium. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { contactMap02 } from "../../../../../packages/ui/src/marketing/contact-map-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Pin = S.Struct({
  address: S.String,
  flagSrc: S.String,
  id: S.String,
  location: S.String,
  x: S.Number,
  y: S.Number,
});
const Contact = S.Struct({
  cta: S.String,
  href: S.String,
  id: S.String,
  subtitle: S.String,
  title: S.String,
});
const Args = S.Struct({
  contacts: S.Array(Contact),
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  mapDarkSrc: S.String,
  mapLightSrc: S.String,
  pins: S.Array(Pin),
});
const Model = S.Struct({ ...Args.fields, selectedPinId: S.String });
type Model = typeof Model.Type;
const ContactOpened = m("ContactMap02ContactOpened", { id: S.String });
const PinActivated = m("ContactMap02PinActivated", { id: S.String });
type Message = typeof ContactOpened.Type | typeof PinActivated.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, selectedPinId: "" }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "ContactMap02PinActivated") {
      return { ...model, selectedPinId: message.id };
    }
    return {
      ...model,
      contacts: model.contacts.map((contact) =>
        contact.id === message.id ? { ...contact, href: "#contact-opened" } : contact,
      ),
    };
  },
  view: (model: Model, h: Parameters<typeof contactMap02<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        contactMap02(
          {
            ...model,
            onContact: (id) => ContactOpened({ id }),
            onPinActivate: (id) => PinActivated({ id }),
          },
          h,
        ),
      ],
    ),
} as const;

const pins = [
  {
    address: "911 E Pike Street, Capitol Hill, Seattle, WA 98122",
    flagSrc: "https://www.untitledui.com/images/flags/US.svg",
    id: "seattle",
    location: "Seattle, USA",
    x: 130,
    y: 157,
  },
  {
    address: "2201 Valencia Street, Mission District, San Francisco, CA 94110",
    flagSrc: "https://www.untitledui.com/images/flags/US.svg",
    id: "san-francisco",
    location: "San Francisco, USA",
    x: 158,
    y: 204,
  },
  {
    address: "85 Redchurch Street, Shoreditch, London E2 7DJ",
    flagSrc: "https://www.untitledui.com/images/flags/GB.svg",
    id: "london",
    location: "London, GB",
    x: 521,
    y: 97,
  },
  {
    address: "17 Weserstraße, Neukölln, 12045 Berlin",
    flagSrc: "https://www.untitledui.com/images/flags/DE.svg",
    id: "berlin",
    location: "Berlin, DE",
    x: 581,
    y: 73,
  },
  {
    address: "12 Via del Pigneto, Pigneto, 00176 Roma RM",
    flagSrc: "https://www.untitledui.com/images/flags/IT.svg",
    id: "rome",
    location: "Rome, IT",
    x: 513,
    y: 176,
  },
  {
    address: "21 Pali Hill Road, Bandra West, Mumbai, Maharashtra 400050",
    flagSrc: "https://www.untitledui.com/images/flags/IN.svg",
    id: "mumbai",
    location: "Mumbai, IN",
    x: 678,
    y: 224,
  },
  {
    address: "3-15-7 Jingumae, Shibuya-ku, Tokyo 150-0001",
    flagSrc: "https://www.untitledui.com/images/flags/JP.svg",
    id: "tokyo",
    location: "Tokyo, JP",
    x: 843,
    y: 199,
  },
  {
    address: "100 Smith Street Collingwood VIC 3066 AU",
    flagSrc: "https://www.untitledui.com/images/flags/AU.svg",
    id: "melbourne",
    location: "Melbourne, AUS",
    x: 885,
    y: 406,
  },
  {
    address: "42 Ponsonby Road, Ponsonby, Auckland 1011",
    flagSrc: "https://www.untitledui.com/images/flags/NZ.svg",
    id: "auckland",
    location: "Auckland, NZ",
    x: 958,
    y: 424,
  },
] as const;
const contacts = [
  {
    cta: "support@siglata.com",
    href: "mailto:support@siglata.com",
    id: "support",
    subtitle: "Our friendly team is here to help.",
    title: "Support",
  },
  {
    cta: "sales@siglata.com",
    href: "mailto:sales@siglata.com",
    id: "sales",
    subtitle: "Questions or queries? Get in touch!",
    title: "Sales",
  },
  {
    cta: "+1 (555) 000-0000",
    href: "tel:+1 (555) 000-0000",
    id: "phone",
    subtitle: "Mon-Fri from 8am to 5pm.",
    title: "Phone",
  },
] as const;
const args = {
  contacts,
  description: "We have offices and teams all around the world.",
  eyebrow: "Contact us",
  heading: "We'd love to hear from you",
  mapDarkSrc: "https://www.untitledui.com/marketing/world-map-dark-mode.svg",
  mapLightSrc: "https://www.untitledui.com/marketing/world-map-light-mode.svg",
  pins,
} as const;

export default {
  ...componentMeta("contact-map-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Map 02",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs): Model => ({ ...storyArgs, selectedPinId: "london" }),
  }),
  args,
};
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
    const pin = await canvas.findByRole("button", { name: "View Seattle, USA" });
    pin.focus();
    await expect(pin).toHaveFocus();
    await expect(pin).toHaveAttribute("aria-describedby", "vector-map-pin-0");
    await userEvent.click(pin);
    await waitFor(() => expect(pin).toHaveAttribute("aria-pressed", "true"));
    const support = canvas.getByRole("link", { name: "support@siglata.com" });
    support.focus();
    await expect(support).toHaveFocus();
    await expect(support).toHaveAttribute("href", "mailto:support@siglata.com");
  },
};
