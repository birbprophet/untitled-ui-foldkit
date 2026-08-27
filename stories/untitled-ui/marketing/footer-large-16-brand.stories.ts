/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { footerLarge16Brand } from "../../../src/marketing/footer-large-16-brand.ts";
import { demoBrand } from "../../fixtures/brand.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  copyright: S.String,
  email: S.String,
  emailLabel: S.String,
  emailPlaceholder: S.String,
  formId: S.String,
  subscribeLabel: S.String,
});
type Model = typeof Args.Type;

const Action = m("FooterLarge16BrandAction", { id: S.String });
type Message = typeof Action.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof footerLarge16Brand<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        footerLarge16Brand(
          {
            ...model,
            logo: demoBrand(),
            onEmailInput: (email) => Action({ id: `email:${email}` }),
            onLink: (linkId) => Action({ id: linkId }),
            onSubscribe: Action({ id: "subscribe" }),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  copyright: "© 2026 Siglata. All rights reserved.",
  email: "",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  formId: "footer-large-16-brand-form",
  subscribeLabel: "Subscribe",
} as const;

export default {
  ...componentMeta("footer-large-16-brand"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Footers/Footer Large 16 Brand",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof footerLarge16Brand<Message>>[1]) =>
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
    const link = canvas.getByRole("link");
    await userEvent.click(link);
    await waitFor(() => expect(link).toBeVisible());
  },
};
