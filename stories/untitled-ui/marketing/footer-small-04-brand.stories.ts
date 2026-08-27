/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { footerSmall04Brand } from "../../../../../packages/ui/src/marketing/footer-small-04-brand.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({});
const Model = Args;
type Model = typeof Model.Type;

const Action = m("FooterSmall04BrandAction", { id: S.String });
type Message = typeof Action.Type;

const definition = {
  Args,
  Model,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof footerSmall04Brand<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        footerSmall04Brand(
          {
            ...model,
            onEmailInput: (email) => Action({ id: `email:${email}` }),
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
  formId: "footer-small-04-brand-form",
  subscribeLabel: "Subscribe",
} as const;

export default {
  ...componentMeta("footer-small-04-brand"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Footers/Footer Small 04 Brand",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof footerSmall04Brand<Message>>[1]) =>
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
    const link = canvas.queryByRole("link");
    if (link !== null) {
      await userEvent.click(link);
      await waitFor(() => expect(link).toBeVisible());
    }
  },
};
