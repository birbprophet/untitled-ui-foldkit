/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit hero in the browser. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { headerNavigation } from "../../../src/application.ts";
import { expect, userEvent, within } from "storybook/test";

import { heroGeometricShapes04 } from "../../../src/marketing/hero-geometric-shapes-04.ts";
import { demoBrand } from "../../fixtures/brand.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  badgeAddon: S.String,
  badgeHref: S.String,
  badgeLabel: S.String,
  description: S.String,
  heading: S.String,
  imageAlt: S.String,
  imageUrl: S.String,
  primaryLabel: S.String,
  secondaryLabel: S.String,
});
const Model = S.Struct({ ...Args.fields, isMobileOpen: S.Boolean, searchValue: S.String });
type Model = typeof Model.Type;
const Primary = m("HeroGeometricShapes04Primary");
const Secondary = m("HeroGeometricShapes04Secondary");
const Navigated = m("HeroGeometricShapes04Navigated", { href: S.String });
const MobileOpened = m("HeroGeometricShapes04MobileOpened");
const MobileClosed = m("HeroGeometricShapes04MobileClosed");
const AccountPressed = m("HeroGeometricShapes04AccountPressed");
const SearchChanged = m("HeroGeometricShapes04SearchChanged", { value: S.String });
const Badge = m("HeroGeometricShapes04Badge");
type Message =
  | typeof Primary.Type
  | typeof Secondary.Type
  | typeof Navigated.Type
  | typeof MobileOpened.Type
  | typeof MobileClosed.Type
  | typeof AccountPressed.Type
  | typeof Badge.Type
  | typeof SearchChanged.Type;

const navItems = [
  { href: "#products", label: "Products" },
  { href: "#pricing", label: "Pricing" },
  { href: "#resources", label: "Resources" },
  { href: "#about", label: "About" },
] as const;

const navigation = (model: Model, h: Parameters<typeof headerNavigation<Message>>[1]) =>
  headerNavigation(
    {
      activeUrl: "#pricing",
      brand: demoBrand(),
      hideBorder: false,
      isMobileOpen: model.isMobileOpen,
      items: navItems,
      onAccountPress: AccountPressed(),
      onMobileClose: MobileClosed(),
      onMobileOpen: MobileOpened(),
      onNavigate: (href) => Navigated({ href }),
      onSearch: (value) => SearchChanged({ value }),
      searchValue: model.searchValue,
    },
    h,
  );

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isMobileOpen: false, searchValue: "" }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "HeroGeometricShapes04MobileOpened") {
      return { ...model, isMobileOpen: true };
    }
    if (message._tag === "HeroGeometricShapes04MobileClosed") {
      return { ...model, isMobileOpen: false };
    }
    if (message._tag === "HeroGeometricShapes04SearchChanged") {
      return { ...model, searchValue: message.value };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof heroGeometricShapes04<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        heroGeometricShapes04(
          {
            ...model,
            navigation: navigation(model, h),
            onBadge: Badge(),
            onPrimary: Primary(),
            onSecondary: Secondary(),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  badgeAddon: "New",
  badgeHref: "#",
  badgeLabel: "Real-time analytics without the busywork",
  description:
    "Powerful, self-serve product and growth analytics to help you convert, engage, and retain more users.",
  heading: "Beautiful analytics to grow smarter",
  imageAlt: "Hero image",
  imageUrl: "https://www.untitledui.com/marketing/smiling-girl-3.webp",
  primaryLabel: "Sign up",
  secondaryLabel: "Demo",
} as const;

export default {
  ...componentMeta("hero-geometric-shapes-04"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Section/Hero Geometric Shapes 04",
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
    await userEvent.click(canvas.getByRole("button", { name: "Sign up" }));
    await expect(canvas.getByRole("heading", { level: 1 })).toBeInTheDocument();
  },
};
