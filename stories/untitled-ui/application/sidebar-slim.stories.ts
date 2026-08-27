/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/require-is-prefix-for-boolean-schema-field -- Controls preserve the exact upstream hideBorder and hideRightBorder prop names; hover, disclosure, account, and mobile state stay in the FoldKit Model. */
import * as S from "effect/Schema";
import { sidebarSlim } from "../../../src/application.ts";
import { userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory } from "../story.ts";
import { agentFace, demoBrand } from "../../fixtures/brand.ts";

const Args = S.Struct({
  activeUrl: S.String,
  hideBorder: S.Boolean,
  hideRightBorder: S.Boolean,
});
const Model = S.Struct({
  ...Args.fields,
  currentHref: S.String,
  expandedHrefs: S.Array(S.String),
  isAccountOpen: S.Boolean,
  isHovering: S.Boolean,
  isMobileOpen: S.Boolean,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "AccountToggled" }>
  | Readonly<{ _tag: "Expanded"; href: string }>
  | Readonly<{ _tag: "HoverEnded" }>
  | Readonly<{ _tag: "HoverStarted" }>
  | Readonly<{ _tag: "MobileClosed" }>
  | Readonly<{ _tag: "MobileOpened" }>
  | Readonly<{ _tag: "Navigated"; href: string }>
  | Readonly<{ _tag: "Selected"; href: string }>;

const accountToggled: Message = { _tag: "AccountToggled" };
const hoverEnded: Message = { _tag: "HoverEnded" };
const hoverStarted: Message = { _tag: "HoverStarted" };
const mobileClosed: Message = { _tag: "MobileClosed" };
const mobileOpened: Message = { _tag: "MobileOpened" };
const expanded = (href: string): Message => ({ _tag: "Expanded", href });
const navigated = (href: string): Message => ({ _tag: "Navigated", href });
const selected = (href: string): Message => ({ _tag: "Selected", href });

const items = [
  {
    href: "/",
    icon: "home",
    items: [
      { href: "/overview", icon: "grid", label: "Overview" },
      { href: "/products", icon: "layers", label: "Products" },
      { href: "/orders", icon: "reporting", label: "Orders" },
      { href: "/customers", icon: "users", label: "Customers" },
      { badge: "4", href: "/inbox", icon: "notification", label: "Inbox" },
      { href: "/whats-new", icon: "star", label: "What's new?" },
    ],
    label: "Home",
  },
  {
    href: "/dashboard",
    icon: "dashboard",
    items: [
      { href: "/dashboard/overview", icon: "grid", label: "Overview" },
      {
        badge: "10",
        href: "/dashboard/notifications",
        icon: "notification",
        label: "Notifications",
      },
      { href: "/dashboard/analytics", icon: "line-chart", label: "Analytics" },
      { href: "/dashboard/saved-reports", icon: "star", label: "Saved reports" },
      { href: "/dashboard/scheduled-reports", icon: "clock", label: "Scheduled reports" },
      { href: "/dashboard/user-reports", icon: "user-square", label: "User reports" },
      {
        href: "/dashboard/manage-notifications",
        icon: "settings-sliders",
        label: "Manage notifications",
      },
    ],
    label: "Dashboard",
  },
  {
    href: "/projects",
    icon: "rows",
    items: [
      { href: "/projects/all", icon: "rows", label: "View all" },
      { href: "/projects/personal", icon: "user-square", label: "Personal" },
      { href: "/projects/team", icon: "users", label: "Team" },
      { href: "/projects/shared-with-me", icon: "users", label: "Shared with me" },
      { href: "/projects/archive", icon: "folder", label: "Archive" },
    ],
    label: "Projects",
  },
  { badge: "10", href: "/tasks", icon: "tasks", label: "Tasks" },
  { href: "/reporting", icon: "reporting", label: "Reporting" },
  { href: "/users", icon: "users", label: "Users" },
] as const;

const footerItems = [
  { href: "/support", icon: "lifebuoy", label: "Support" },
  { href: "/settings", icon: "settings", label: "Settings" },
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
  if (message._tag === "HoverEnded") {
    return { ...model, isHovering: false };
  }
  if (message._tag === "HoverStarted") {
    return { ...model, isHovering: true };
  }
  if (message._tag === "MobileClosed") {
    return { ...model, isMobileOpen: false };
  }
  if (message._tag === "MobileOpened") {
    return { ...model, isMobileOpen: true };
  }
  if (message._tag === "Navigated") {
    return { ...model, activeUrl: message.href, isMobileOpen: false };
  }
  return { ...model, currentHref: message.href };
};

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    currentHref: "/dashboard",
    expandedHrefs: [],
    isAccountOpen: false,
    isHovering: false,
    isMobileOpen: false,
  }),
  update,
  view: (model: Model, h: Parameters<typeof sidebarSlim<Message>>[1]) =>
    sidebarSlim(
      {
        accountAvatarUrl: agentFace("Olivia Rhye"),
        activeUrl: model.activeUrl,
        brand: demoBrand(),
        currentHref: model.currentHref,
        expandedHrefs: model.expandedHrefs,
        footerItems,
        hideBorder: model.hideBorder,
        hideRightBorder: model.hideRightBorder,
        isAccountOpen: model.isAccountOpen,
        isHovering: model.isHovering,
        isMobileOpen: model.isMobileOpen,
        items,
        onAccountToggle: accountToggled,
        onExpand: expanded,
        onHoverEnd: hoverEnded,
        onHoverStart: hoverStarted,
        onMobileClose: mobileClosed,
        onMobileOpen: mobileOpened,
        onNavigate: navigated,
        onSelect: selected,
      },
      h,
    ),
} as const;

const args: typeof Args.Type = { activeUrl: "", hideBorder: false, hideRightBorder: false };
const renderFixture = (model: Model, h: Parameters<typeof sidebarSlim<Message>>[1]) =>
  h.div([h.Class("fixed inset-0 bg-bg-primary")], [definition.view(model, h)]);
const withHover = {
  ...definition,
  init: (storyArgs: typeof Args.Type): Model => ({
    ...definition.init(storyArgs),
    isHovering: true,
  }),
  view: renderFixture,
} as const;

export default {
  ...componentMeta("sidebar-slim"),
  argTypes: {
    activeUrl: {
      control: "select",
      options: ["", "/dashboard/overview", "/dashboard/notifications", "/support"],
    },
    hideBorder: { control: "boolean" },
    hideRightBorder: { control: "boolean" },
  },
  title: "Untitled UI/Application/Sidebar Slim",
};

export const AllVariants = { ...liveStory({ ...definition, view: renderFixture }), args };
export const States = {
  ...liveStory(withHover),
  args: { ...args, activeUrl: "/dashboard/notifications" },
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args,
};
export const Responsive = { ...liveStory({ ...definition, view: renderFixture }), args };
export const Interactions = {
  ...liveStory({
    ...withHover,
    init: (storyArgs: typeof Args.Type): Model => ({
      ...withHover.init(storyArgs),
      expandedHrefs: ["/dashboard"],
      isMobileOpen: true,
    }),
  }),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const current = () => within(canvasElement.ownerDocument.body);
    await current().findAllByAltText("Siglata logo");
    await userEvent.click(await current().findByRole("link", { name: "Notifications" }));
    const mobileToggle = current().queryByRole("button", { name: "Expand navigation menu" });
    if (mobileToggle !== null) {
      return;
    }
    await current().findByRole("link", { current: "page", name: "Notifications" });
    await userEvent.click(await current().findByRole("button", { name: "Open account menu" }));
    await current().findByRole("menuitem", { name: "View profile" });
  },
};
