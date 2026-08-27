/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { footerSmall04Brand } from "../../../src/marketing/footer-small-04-brand.ts";
import { demoBrand } from "../../fixtures/brand.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Link = S.Struct({ href: S.String, id: S.String, label: S.String });
const Args = S.Struct({
  copyright: S.String,
  homeHref: S.String,
  links: S.Array(Link),
});
const Model = Args;
type Model = typeof Model.Type;
const HomePressed = m("FooterSmall04BrandHomePressed");
const LinkPressed = m("FooterSmall04BrandLinkPressed", { id: S.String });
type Message = typeof HomePressed.Type | typeof LinkPressed.Type;

const definition = {
  Args,
  Model,
  init: (args: Model): Model => args,
  update: (model: Model): Model => model,
  view: (model: Model, h: Parameters<typeof footerSmall04Brand<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        footerSmall04Brand(
          {
            ...model,
            logo: demoBrand(),
            onHome: HomePressed(),
            onLink: (id) => LinkPressed({ id }),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  copyright: "© 2026 Siglata. All rights reserved.",
  homeHref: "#",
  links: [
    { href: "#", id: "overview", label: "Overview" },
    { href: "#", id: "features", label: "Features" },
    { href: "#", id: "pricing", label: "Pricing" },
    { href: "#", id: "careers", label: "Careers" },
    { href: "#", id: "help", label: "Help" },
    { href: "#", id: "privacy", label: "Privacy" },
  ],
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
    const link = canvas.getByRole("link");
    await userEvent.click(link);
    await waitFor(() => expect(link).toBeVisible());
  },
};
