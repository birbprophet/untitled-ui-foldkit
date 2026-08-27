/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, within } from "storybook/test";

import { headerSpaceBetweenEmail } from "../../../src/marketing/header-space-between-email.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  description: S.String,
  email: S.String,
  emailLabel: S.String,
  emailPlaceholder: S.String,
  eyebrow: S.String,
  heading: S.String,
  hintPrefix: S.String,
  policyHref: S.String,
  policyLabel: S.String,
  submitLabel: S.String,
});
type Model = typeof Args.Type;
const EmailInput = m("HeaderSpaceBetweenEmailEmailInput", { email: S.String });
const Submit = m("HeaderSpaceBetweenEmailSubmit");
type Message = typeof EmailInput.Type | typeof Submit.Type;
const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model =>
    message._tag === "HeaderSpaceBetweenEmailEmailInput"
      ? { ...model, email: message.email }
      : model,
  view: (model: Model, h: Parameters<typeof headerSpaceBetweenEmail<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        headerSpaceBetweenEmail(
          { ...model, onEmailInput: (email) => EmailInput({ email }), onSubmit: Submit() },
          h,
        ),
      ],
    ),
} as const;

const args = {
  description: "The latest industry news and resources from the Siglata team.",
  email: "",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  eyebrow: "Resources",
  heading: "Siglata blog",
  hintPrefix: "We care about your data in our",
  policyHref: "#privacy",
  policyLabel: "privacy policy",
  submitLabel: "Get started",
} as const;

export default {
  ...componentMeta("header-space-between-email"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Section/Header Space Between Email",
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
    await expect(canvas.getByRole("heading", { level: 1 })).toBeInTheDocument();
    const email = canvas.getByLabelText("Email");
    await userEvent.type(email, "reader@siglata.com");
  },
};
