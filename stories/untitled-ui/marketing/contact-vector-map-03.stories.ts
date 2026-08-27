/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises FoldKit in Chromium. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  contactVectorMap03,
  contactVectorMap03Pins,
} from "../../../src/marketing/contact-vector-map-03.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  badgeLabel: S.String,
  contacts: S.Array(
    S.Struct({ cta: S.String, href: S.String, id: S.String, subtitle: S.String, title: S.String }),
  ),
  description: S.String,
  heading: S.String,
  mapDarkSrc: S.String,
  mapLightSrc: S.String,
  pins: S.Array(
    S.Struct({
      address: S.String,
      flagSrc: S.String,
      id: S.String,
      location: S.String,
      x: S.Number,
      y: S.Number,
    }),
  ),
});
const Model = Args;
type Model = typeof Model.Type;
const ContactOpened = m("ContactVectorMap03ContactOpened", { id: S.String });
const PinActivated = m("ContactVectorMap03PinActivated", { id: S.String });
type Message = typeof ContactOpened.Type | typeof PinActivated.Type;
const actions = {
  onContact: (id: string) => ContactOpened({ id }),
  onPinActivate: (id: string) => PinActivated({ id }),
};

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof contactVectorMap03<Message>>[1]) =>
    h.div([h.Class("-m-8")], [contactVectorMap03({ ...model, ...actions }, h)]),
} as const;

const args = {
  badgeLabel: "Stores",
  contacts: [
    {
      cta: "support@untitledui.com",
      href: "mailto:support@untitledui.com",
      id: "support",
      subtitle: "Our friendly team is here to help.",
      title: "Support",
    },
    {
      cta: "sales@untitledui.com",
      href: "mailto:sales@untitledui.com",
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
  ],
  description: "Say hello to our friendly team at one of these locations.",
  heading: "Our locations",
  mapDarkSrc: "https://www.untitledui.com/marketing/world-map-dark-mode.svg",
  mapLightSrc: "https://www.untitledui.com/marketing/world-map-light-mode.svg",
  pins: [...contactVectorMap03Pins],
} as const;

export default {
  ...componentMeta("contact-vector-map-03"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Vector Map 03",
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
    const button = canvas.getByRole("button");
    await userEvent.click(button);
    await waitFor(() => expect(button).toBeInTheDocument());
  },
};
