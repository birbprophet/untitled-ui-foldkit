/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { footerLarge03Brand } from "../../../src/marketing/footer-large-03-brand.ts";
import { demoBrand } from "../../fixtures/brand.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const NavItem = S.Struct({
  badge: S.optional(S.String),
  href: S.String,
  id: S.String,
  label: S.String,
});
const NavGroup = S.Struct({
  id: S.String,
  items: S.Array(NavItem),
  label: S.String,
});
const Social = S.Struct({ href: S.String, id: S.String, label: S.String });
const Args = S.Struct({
  copyright: S.String,
  description: S.String,
  homeHref: S.String,
  navGroups: S.Array(NavGroup),
  socials: S.Array(Social),
});
type Model = typeof Args.Type;
const HomePressed = m("FooterLarge03BrandHomePressed");
const LinkPressed = m("FooterLarge03BrandLinkPressed", { id: S.String });
const SocialPressed = m("FooterLarge03BrandSocialPressed", { id: S.String });
type Message = typeof HomePressed.Type | typeof LinkPressed.Type | typeof SocialPressed.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => {
    if (message._tag === "FooterLarge03BrandLinkPressed") {
      return {
        ...model,
        navGroups: model.navGroups.map((group) => ({
          ...group,
          items: group.items.map((item) =>
            item.id === message.id ? { ...item, href: `#${item.id}-opened` } : item,
          ),
        })),
      };
    }
    if (message._tag === "FooterLarge03BrandSocialPressed") {
      return {
        ...model,
        socials: model.socials.map((social) =>
          social.id === message.id ? { ...social, href: `#${social.id}-opened` } : social,
        ),
      };
    }
    return { ...model, homeHref: "#home-opened" };
  },
  view: (model: Model, h: Parameters<typeof footerLarge03Brand<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        footerLarge03Brand(
          {
            ...model,
            logo: demoBrand(),
            onHome: HomePressed(),
            onLink: (id) => LinkPressed({ id }),
            onSocial: (id) => SocialPressed({ id }),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  copyright: "© 2077 Siglata. All rights reserved.",
  description: "Design amazing digital experiences that create more happy in the world.",
  homeHref: "#",
  navGroups: [
    {
      id: "product",
      items: [
        {
          href: "#",
          id: "overview",
          label: "Overview",
        },
        {
          href: "#",
          id: "features",
          label: "Features",
        },
        {
          badge: "New",
          href: "#",
          id: "solutions",
          label: "Solutions",
        },
        {
          href: "#",
          id: "pricing",
          label: "Pricing",
        },
      ],
      label: "Product",
    },
    {
      id: "company",
      items: [
        {
          href: "#",
          id: "about",
          label: "About us",
        },
        {
          href: "#",
          id: "careers",
          label: "Careers",
        },
        {
          href: "#",
          id: "contact",
          label: "Contact",
        },
      ],
      label: "Company",
    },
    {
      id: "resources",
      items: [
        {
          href: "#",
          id: "blog",
          label: "Blog",
        },
        {
          href: "#",
          id: "newsletter",
          label: "Newsletter",
        },
        {
          href: "#",
          id: "help",
          label: "Help centre",
        },
      ],
      label: "Resources",
    },
  ],
  socials: [
    {
      href: "https://x.com/",
      id: "x",
      label: "X",
    },
    {
      href: "https://www.linkedin.com/",
      id: "linkedin",
      label: "LinkedIn",
    },
    {
      href: "https://github.com/",
      id: "github",
      label: "GitHub",
    },
  ],
} as const;

export default {
  ...componentMeta("footer-large-03-brand"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Footers/Footer Large 03 Brand",
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
    const overview = canvas.getByRole("link", { name: "Overview" });
    await userEvent.click(overview);
    await waitFor(() => expect(overview).toHaveAttribute("href", "#overview-opened"));
  },
};
