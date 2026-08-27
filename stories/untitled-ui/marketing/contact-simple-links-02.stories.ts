/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises FoldKit in Chromium. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { contactSimpleLinks02,contactSimpleLinks02Cards } from "../../../../../packages/ui/src/marketing/contact-simple-links-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  cards: S.Array(
    S.Struct({
      cta: S.String,
      href: S.String,
      icon: S.String,
      id: S.String,
      subtitle: S.String,
      title: S.String,
    }),
  ),
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
});
const Model = Args;
type Model = typeof Model.Type;
const Activated = m("ContactSimpleLinks02Activated", { id: S.String });
type Message = typeof Activated.Type;
const actions = { onActivate: (id: string) => Activated({ id }) };

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof contactSimpleLinks02<Message>>[1]) =>
    h.div([h.Class("-m-8")], [contactSimpleLinks02({ ...model, ...actions }, h)]),
} as const;


const args = {
  cards: [...contactSimpleLinks02Cards],
  description: "Our friendly team is always here to chat.",
  eyebrow: "Contact us",
  heading: "We'd love to hear from you",
} as const;

export default {
  ...componentMeta("contact-simple-links-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Simple Links 02",
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
    const button = canvas.queryByRole("button");
    if (button !== null) {
      await userEvent.click(button);
      await waitFor(() => expect(button).toBeInTheDocument());
    }
  },
};
