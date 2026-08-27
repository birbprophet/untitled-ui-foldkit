/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Disclosure, account, and modal state remain in the FoldKit Model. */
import * as S from "effect/Schema";
import { sidebarNavigationBase } from "../../../src/application.ts";
import { userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory } from "../story.ts";
import { agentFace, demoBrand } from "../../fixtures/brand.ts";

const Args = S.Struct({ activeUrl: S.String });
const Model = S.Struct({
  ...Args.fields,
  expandedHrefs: S.Array(S.String),
  isAccountOpen: S.Boolean,
  isMobileOpen: S.Boolean,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "AccountToggled" }>
  | Readonly<{ _tag: "Expanded"; href: string }>
  | Readonly<{ _tag: "MobileClosed" }>
  | Readonly<{ _tag: "MobileOpened" }>
  | Readonly<{ _tag: "Navigated"; href: string }>;

const accountToggled: Message = { _tag: "AccountToggled" };
const mobileClosed: Message = { _tag: "MobileClosed" };
const mobileOpened: Message = { _tag: "MobileOpened" };
const expanded = (href: string): Message => ({ _tag: "Expanded", href });
const navigated = (href: string): Message => ({ _tag: "Navigated", href });
const items = [
  { href: "/", icon: "home", label: "Home" },
  {
    href: "/dashboard",
    icon: "dashboard",
    items: [
      { href: "/dashboard/overview", label: "Overview" },
      { badge: "10", href: "/dashboard/notifications", label: "Notifications" },
      { href: "/dashboard/analytics", label: "Analytics" },
    ],
    label: "Dashboard",
  },
] as const;

const update = (model: Model, message: Message): Model => {
  if (message._tag === "AccountToggled") {
    return { ...model, isAccountOpen: !model.isAccountOpen };
  }
  if (message._tag === "Expanded") {
    return {
      ...model,
      expandedHrefs: model.expandedHrefs.includes(message.href)
        ? model.expandedHrefs.filter((href) => href !== message.href)
        : [...model.expandedHrefs, message.href],
    };
  }
  if (message._tag === "MobileClosed") {
    return { ...model, isMobileOpen: false };
  }
  if (message._tag === "MobileOpened") {
    return { ...model, isMobileOpen: true };
  }
  return { ...model, activeUrl: message.href, isMobileOpen: false };
};
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    expandedHrefs: [],
    isAccountOpen: false,
    isMobileOpen: false,
  }),
  update,
  view: (model: Model, h: Parameters<typeof sidebarNavigationBase<Message>>[1]) =>
    sidebarNavigationBase(
      {
        accountAvatarUrl: agentFace("Olivia Rhye"),
        activeUrl: model.activeUrl,
        brand: demoBrand(),
        expandedHrefs: model.expandedHrefs,
        isAccountOpen: model.isAccountOpen,
        isMobileOpen: model.isMobileOpen,
        items,
        onAccountToggle: accountToggled,
        onExpand: expanded,
        onMobileClose: mobileClosed,
        onMobileOpen: mobileOpened,
        onNavigate: navigated,
      },
      h,
    ),
} as const;
const args: typeof Args.Type = { activeUrl: "" };
const renderFixture = (model: Model, h: Parameters<typeof sidebarNavigationBase<Message>>[1]) =>
  h.div([h.Class("fixed inset-0 overflow-auto bg-bg-primary")], [definition.view(model, h)]);
const states = {
  ...definition,
  init: (storyArgs: typeof Args.Type): Model => ({
    ...definition.init(storyArgs),
    expandedHrefs: ["/dashboard"],
  }),
  view: renderFixture,
} as const;

export default {
  ...componentMeta("sidebar-navigation-base"),
  argTypes: {
    activeUrl: {
      control: "select",
      options: ["", "/dashboard", "/dashboard/notifications"],
    },
  },
  title: "Untitled UI/Application/Sidebar Navigation Base",
};
export const AllVariants = { ...liveStory({ ...definition, view: renderFixture }), args };
export const States = { ...liveStory(states), args: { activeUrl: "/dashboard/notifications" } };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) => h.div([h.DataAttribute("theme", "dark")], [renderFixture(model, h)]),
  }),
  args,
};
export const Responsive = { ...liveStory({ ...definition, view: renderFixture }), args };
export const Interactions = {
  ...liveStory({
    ...definition,
    init: (storyArgs: typeof Args.Type): Model => ({
      ...definition.init(storyArgs),
      expandedHrefs: ["/dashboard"],
      isMobileOpen: true,
    }),
    view: renderFixture,
  }),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const current = () => within(canvasElement.ownerDocument.body);
    await current().findAllByAltText("Siglata logo");
    const notificationLinks = await current().findAllByRole("link", { name: /Notifications/u });
    await userEvent.click(notificationLinks[0]);
    if (current().queryByRole("button", { name: "Expand navigation menu" }) !== null) {
      return;
    }
    await userEvent.click(await current().findByRole("button", { name: "Open account menu" }));
    await current().findByRole("menuitem", { name: "View profile" });
  },
};
