/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook's browser interaction API is promise based. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  contactSimpleIcons03,
  contactSimpleIcons03Methods,
} from "../../../../../packages/ui/src/marketing/contact-simple-icons-03.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Method = S.Struct({
  cta: S.String,
  href: S.String,
  icon: S.Literals(["mail", "phone", "pin"]),
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
type Message = Readonly<{ _tag: "ContactSelected"; id: string }>;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => ({
    ...model,
    methods: model.methods.map((method) =>
      method.id === message.id ? { ...method, href: "#contact-opened" } : method,
    ),
  }),
  view: (model: Model, h: Parameters<typeof contactSimpleIcons03<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        contactSimpleIcons03(
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
  description: "Our friendly team is always here to chat.",
  eyebrow: "Contact us",
  heading: "Get in touch",
  methods: [...contactSimpleIcons03Methods],
} satisfies typeof Args.Type;

export default {
  ...componentMeta("contact-simple-icons-03"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Simple Icons 03",
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
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(email).toHaveAttribute("href", "#contact-opened"));
    email.blur();
  },
};
