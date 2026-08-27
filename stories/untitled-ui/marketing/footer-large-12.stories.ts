/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { footerLarge12 } from "../../../../../packages/ui/src/marketing/footer-large-12.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({});
const Model = Args;
type Model = typeof Model.Type;

const Action = m("FooterLarge12Action", { id: S.String });
type Message = typeof Action.Type;

const definition = {
  Args,
  Model,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof footerLarge12<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        footerLarge12(
          {
            ...model,
            onEmailInput: (email) => Action({ id: `email:${email}` }),
            onLink: (linkId) => Action({ id: linkId }),
            onSocial: (socialId) => Action({ id: socialId }),
            onSocialProof: Action({ id: "social-proof" }),
            onSubscribe: Action({ id: "subscribe" }),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  copyright: "© 2026 Siglata. All rights reserved.",
  description: "Design amazing digital experiences that create more happy in the world.",
  email: "",
  emailHint: "newsletter-hint",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  formId: "footer-large-12-form",
  newsletterDescription: "Stay up to date with the latest news, announcements, and articles.",
  newsletterTitle: "Get notified when we launch",
  socialProofAvatars: [
    {
      alt: "Kintsugi",
      id: "kintsugi",
      src: "https://www.untitledui.com/logos/images/Kintsugi.jpg",
    },
    {
      alt: "Refractional",
      id: "refractional",
      src: "https://www.untitledui.com/logos/images/Refractional.jpg",
    },
  ],
  socialProofLabel: "Join 2,000+ companies",
  subscribeLabel: "Subscribe",
} as const;

export default {
  ...componentMeta("footer-large-12"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Footers/Footer Large 12",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof footerLarge12<Message>>[1]) =>
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
