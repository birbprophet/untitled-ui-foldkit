/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit hero in the browser. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { headerNavigation } from "../../../src/application.ts";
import { expect, userEvent, within } from "storybook/test";

import { heroCardMockup07 } from "../../../src/marketing/hero-card-mockup-07.ts";
import { demoBrand } from "../../fixtures/brand.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  description: S.String,
  heading: S.String,
  imageAlt: S.String,
  imageUrl: S.String,
  primaryLabel: S.String,
  secondaryLabel: S.String,
});
const Model = S.Struct({ ...Args.fields, isMobileOpen: S.Boolean, searchValue: S.String });
type Model = typeof Model.Type;
const Primary = m("HeroCardMockup07Primary");
const Secondary = m("HeroCardMockup07Secondary");
const Navigated = m("HeroCardMockup07Navigated", { href: S.String });
const MobileOpened = m("HeroCardMockup07MobileOpened");
const MobileClosed = m("HeroCardMockup07MobileClosed");
const AccountPressed = m("HeroCardMockup07AccountPressed");
const SearchChanged = m("HeroCardMockup07SearchChanged", { value: S.String });
type Message =
  | typeof Primary.Type
  | typeof Secondary.Type
  | typeof Navigated.Type
  | typeof MobileOpened.Type
  | typeof MobileClosed.Type
  | typeof AccountPressed.Type
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
    if (message._tag === "HeroCardMockup07MobileOpened") {
      return { ...model, isMobileOpen: true };
    }
    if (message._tag === "HeroCardMockup07MobileClosed") {
      return { ...model, isMobileOpen: false };
    }
    if (message._tag === "HeroCardMockup07SearchChanged") {
      return { ...model, searchValue: message.value };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof heroCardMockup07<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        heroCardMockup07(
          {
            ...model,
            navigation: navigation(model, h),
            onPrimary: Primary(),
            onSecondary: Secondary(),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  description:
    "Powerful, self-serve product and growth analytics to help you convert, engage, and retain more users.",
  heading: "Beautiful analytics to grow smarter",
  imageAlt: "Hero image",
  imageUrl: "https://www.untitledui.com/marketing/smiling-girl-3.webp",
  primaryLabel: "Sign up",
  secondaryLabel: "Demo",
} as const;

export default {
  ...componentMeta("hero-card-mockup-07"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Section/Hero Card Mockup 07",
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
