/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit hero in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { headerNavigation } from "ui/application";
import { expect, userEvent, within } from "storybook/test";

import { heroAbstractAngles02 } from "../../../../../packages/ui/src/marketing/hero-abstract-angles-02.ts";
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
const Primary = m("HeroAbstractAngles02Primary");
const Secondary = m("HeroAbstractAngles02Secondary");
const Navigated = m("HeroAbstractAngles02Navigated", { href: S.String });
const MobileOpened = m("HeroAbstractAngles02MobileOpened");
const MobileClosed = m("HeroAbstractAngles02MobileClosed");
const AccountPressed = m("HeroAbstractAngles02AccountPressed");
const SearchChanged = m("HeroAbstractAngles02SearchChanged", { value: S.String });
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
    if (message._tag === "HeroAbstractAngles02MobileOpened") {
      return { ...model, isMobileOpen: true };
    }
    if (message._tag === "HeroAbstractAngles02MobileClosed") {
      return { ...model, isMobileOpen: false };
    }
    if (message._tag === "HeroAbstractAngles02SearchChanged") {
      return { ...model, searchValue: message.value };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof heroAbstractAngles02<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        heroAbstractAngles02(
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
  ...componentMeta("hero-abstract-angles-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Section/Hero Abstract Angles 02",
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
