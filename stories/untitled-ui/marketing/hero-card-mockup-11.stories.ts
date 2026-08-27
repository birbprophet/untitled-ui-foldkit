/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit hero in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { headerNavigation } from "ui/application";
import { expect, userEvent, within } from "storybook/test";

import { heroCardMockup11 } from "../../../../../packages/ui/src/marketing/hero-card-mockup-11.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  badgeAddon: S.String,
  badgeHref: S.String,
  badgeLabel: S.String,
  description: S.String,
  email: S.String,
  emailLabel: S.String,
  emailPlaceholder: S.String,
  heading: S.String,
  hintPrefix: S.String,
  imageAlt: S.String,
  imageUrl: S.String,
  policyHref: S.String,
  policyLabel: S.String,
  primaryLabel: S.String,
  secondaryLabel: S.String,
  submitLabel: S.String,
});
const Model = S.Struct({ ...Args.fields, isMobileOpen: S.Boolean, searchValue: S.String });
type Model = typeof Model.Type;
const Primary = m("HeroCardMockup11Primary");
const EmailInput = m("HeroCardMockup11EmailInput", { email: S.String });
const Submit = m("HeroCardMockup11Submit");
const Badge = m("HeroCardMockup11Badge");
const Secondary = m("HeroCardMockup11Secondary");
const Navigated = m("HeroCardMockup11Navigated", { href: S.String });
const MobileOpened = m("HeroCardMockup11MobileOpened");
const MobileClosed = m("HeroCardMockup11MobileClosed");
const AccountPressed = m("HeroCardMockup11AccountPressed");
const SearchChanged = m("HeroCardMockup11SearchChanged", { value: S.String });
type Message =
  | typeof EmailInput.Type
  | typeof Submit.Type
  | typeof Badge.Type
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
    if (message._tag === "HeroCardMockup11MobileOpened") {
      return { ...model, isMobileOpen: true };
    }
    if (message._tag === "HeroCardMockup11MobileClosed") {
      return { ...model, isMobileOpen: false };
    }
    if (message._tag === "HeroCardMockup11SearchChanged") {
      return { ...model, searchValue: message.value };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof heroCardMockup11<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        heroCardMockup11(
          {
            ...model,
            navigation: navigation(model, h),
            onBadge: Badge(),
            onEmailInput: (email) => EmailInput({ email }),
            onPrimary: Primary(),
            onSecondary: Secondary(),
            onSubmit: Submit(),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  badgeAddon: "What's new?",
  badgeHref: "#",
  badgeLabel: "Instantly issue virtual cards",
  description: "Powerful analytics to grow smarter.",
  email: "",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  heading: "Beautiful analytics to grow smarter",
  hintPrefix: "We care about your data in our",
  imageAlt: "Hero image",
  imageUrl: "https://www.untitledui.com/marketing/smiling-girl-3.webp",
  policyHref: "#privacy",
  policyLabel: "privacy policy",
  primaryLabel: "Sign up",
  secondaryLabel: "Demo",
  submitLabel: "Get started",
} as const;

export default {
  ...componentMeta("hero-card-mockup-11"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Section/Hero Card Mockup 11",
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
