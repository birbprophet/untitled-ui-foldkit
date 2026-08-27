/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { header } from "../../../src/marketing/header.ts";
import { demoBrand } from "../../fixtures/brand.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const NavItem = S.Struct({
  hasMenu: S.optional(S.Boolean),
  href: S.optional(S.String),
  id: S.String,
  label: S.String,
});
const FooterLink = S.Struct({ href: S.String, id: S.String, label: S.String });
const Args = S.Struct({
  footerLinks: S.Array(FooterLink),
  isFloating: S.optional(S.Boolean),
  isFullWidth: S.optional(S.Boolean),
  items: S.Array(NavItem),
});
const Model = S.Struct({
  ...Args.fields,
  isMobileOpen: S.Boolean,
  mobileExpandedItemId: S.Union([S.Null, S.String]),
  openMenuId: S.Union([S.Null, S.String]),
});
type Model = typeof Model.Type;

const FooterLinkPressed = m("HeaderFooterLinkPressed", { id: S.String });
const LoginPressed = m("HeaderLoginPressed");
const MenuToggled = m("HeaderMenuToggled", { id: S.String });
const MobileClosed = m("HeaderMobileClosed");
const MobileExpanded = m("HeaderMobileExpanded", { id: S.String });
const MobileOpened = m("HeaderMobileOpened");
const NavItemPressed = m("HeaderNavItemPressed", { id: S.String });
const SignupPressed = m("HeaderSignupPressed");
type Message =
  | typeof FooterLinkPressed.Type
  | typeof LoginPressed.Type
  | typeof MenuToggled.Type
  | typeof MobileClosed.Type
  | typeof MobileExpanded.Type
  | typeof MobileOpened.Type
  | typeof NavItemPressed.Type
  | typeof SignupPressed.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    isMobileOpen: false,
    mobileExpandedItemId: null,
    openMenuId: null,
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "HeaderMenuToggled") {
      return { ...model, openMenuId: model.openMenuId === message.id ? null : message.id };
    }
    if (message._tag === "HeaderMobileExpanded") {
      return {
        ...model,
        mobileExpandedItemId: model.mobileExpandedItemId === message.id ? null : message.id,
      };
    }
    if (message._tag === "HeaderMobileOpened") {
      return { ...model, isMobileOpen: true };
    }
    if (message._tag === "HeaderMobileClosed") {
      return { ...model, isMobileOpen: false };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof header<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        header(
          {
            ...model,
            brand: demoBrand(),
            onFooterLink: (id) => FooterLinkPressed({ id }),
            onItem: (id) => NavItemPressed({ id }),
            onLogin: LoginPressed(),
            onMenuToggle: (id) => MenuToggled({ id }),
            onMobileClose: MobileClosed(),
            onMobileExpand: (id) => MobileExpanded({ id }),
            onMobileOpen: MobileOpened(),
            onSignup: SignupPressed(),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  footerLinks: [
    { href: "#", id: "overview", label: "Overview" },
    { href: "#", id: "features", label: "Features" },
    { href: "#", id: "pricing", label: "Pricing" },
    { href: "#", id: "careers", label: "Careers" },
    { href: "#", id: "help", label: "Help" },
    { href: "#", id: "privacy", label: "Privacy" },
  ],
  items: [
    { hasMenu: true, id: "products", label: "Products" },
    { hasMenu: true, id: "solutions", label: "Solutions" },
    { hasMenu: true, id: "resources", label: "Resources" },
    { href: "#pricing", id: "pricing-nav", label: "Pricing" },
    { href: "#docs", id: "docs", label: "Docs" },
  ],
} as const;

export default {
  ...componentMeta("header"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Navigation/Header",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args: { ...args, isFloating: true } };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof header<Message>>[1]) =>
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
    await expect(canvas.getByRole("link", { name: "Pricing" })).toBeVisible();
    const menuButton = canvas.getByRole("button", { name: "Toggle navigation menu" });
    menuButton.focus();
    await expect(menuButton).toHaveFocus();
    await userEvent.click(menuButton);
    await waitFor(() => expect(menuButton).toHaveAttribute("aria-expanded", "true"));
  },
};
