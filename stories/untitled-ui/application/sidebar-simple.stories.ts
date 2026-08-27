/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/require-is-prefix-for-boolean-schema-field -- Controls expose only authenticated component props; navigation, disclosure, search, and overlays remain in the FoldKit Model. */
import * as S from "effect/Schema";
import { sidebarSimple } from "../../../src/application.ts";
import { userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory } from "../story.ts";

import { agentFace, demoBrand } from "../../fixtures/brand.ts";

const Args = S.Struct({ hideBorder: S.Boolean, showAccountCard: S.Boolean });
const Model = S.Struct({
  ...Args.fields,
  activeUrl: S.String,
  expandedHrefs: S.Array(S.String),
  isAccountOpen: S.Boolean,
  isMobileOpen: S.Boolean,
  searchValue: S.String,
  showFeatureCard: S.Boolean,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "AccountToggled" }>
  | Readonly<{ _tag: "Expanded"; href: string }>
  | Readonly<{ _tag: "FeatureDismissed" }>
  | Readonly<{ _tag: "MobileClosed" }>
  | Readonly<{ _tag: "MobileOpened" }>
  | Readonly<{ _tag: "Navigated"; href: string }>
  | Readonly<{ _tag: "SearchChanged"; value: string }>;

const accountToggled: Message = { _tag: "AccountToggled" };
const mobileClosed: Message = { _tag: "MobileClosed" };
const mobileOpened: Message = { _tag: "MobileOpened" };
const expanded = (href: string): Message => ({ _tag: "Expanded", href });
const featureDismissed: Message = { _tag: "FeatureDismissed" };
const navigated = (href: string): Message => ({ _tag: "Navigated", href });
const searchChanged = (searchValue: string): Message => ({
  _tag: "SearchChanged",
  value: searchValue,
});

const items = [
  {
    href: "#home",
    icon: "home",
    items: [
      { href: "#overview", label: "Overview" },
      { href: "#products", label: "Products" },
      { href: "#orders", label: "Orders" },
      { href: "#customers", label: "Customers" },
    ],
    label: "Home",
  },
  {
    href: "#dashboard",
    icon: "dashboard",
    items: [
      { href: "#dashboard-overview", label: "Overview" },
      { badge: "10", href: "#notifications", label: "Notifications" },
      { href: "#analytics", label: "Analytics" },
      { href: "#saved-reports", label: "Saved reports" },
    ],
    label: "Dashboard",
  },
  {
    href: "#projects",
    icon: "rows",
    items: [
      { href: "#view-all", label: "View all" },
      { href: "#personal", label: "Personal" },
      { href: "#team", label: "Team" },
      { href: "#shared", label: "Shared with me" },
      { href: "#archive", label: "Archive" },
    ],
    label: "Projects",
  },
  { badge: "10", href: "#tasks", icon: "tasks", label: "Tasks" },
  { href: "#reporting", icon: "reporting", label: "Reporting" },
  { href: "#users", icon: "users", label: "Users" },
] as const;
const footerItems = [
  { href: "#settings", icon: "settings", label: "Settings" },
  { badge: "Online", href: "#support", icon: "support", label: "Support" },
  { href: "https://www.untitledui.com/", icon: "browser", label: "Open in browser" },
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
  if (message._tag === "FeatureDismissed") {
    return { ...model, showFeatureCard: false };
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
  return { ...model, searchValue: message.value };
};

const view = (model: Model, h: Parameters<typeof sidebarSimple<Message>>[1]) =>
  sidebarSimple(
    {
      accountAvatarUrl: agentFace("Olivia Rhye"),
      activeUrl: model.activeUrl,
      brand: demoBrand(),
      expandedHrefs: model.expandedHrefs,
      featureCard: model.showFeatureCard
        ? h.div(
            [h.Class("relative flex flex-col rounded-xl bg-bg-secondary p-4")],
            [
              h.p([h.Class("text-sm font-semibold text-text-primary")], ["Used space"]),
              h.p(
                [h.Class("mt-1 pr-4 text-sm text-text-tertiary")],
                ["Your team has used 80% of your available space. Need more?"],
              ),
              h.button(
                [
                  h.AriaLabel("Dismiss used space notice"),
                  h.Class(
                    "absolute top-1 right-1 flex size-9 items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.OnClick(featureDismissed),
                  h.Type("button"),
                ],
                [
                  h.svg(
                    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 20 20")],
                    [
                      h.path([
                        h.D("m5 5 10 10M15 5 5 15"),
                        h.Stroke("currentColor"),
                        h.StrokeLinecap("round"),
                        h.StrokeWidth("1.67"),
                      ]),
                    ],
                  ),
                ],
              ),
              h.div(
                [h.Class("mt-4 flex")],
                [
                  h.div(
                    [
                      h.AriaLabel("Used space"),
                      h.AriaValuemax(100),
                      h.AriaValuemin(0),
                      h.AriaValuenow(80),
                      h.Class("h-2 w-full overflow-hidden rounded-full bg-bg-quaternary"),
                      h.Role("progressbar"),
                    ],
                    [h.div([h.Class("h-full w-4/5 rounded-full bg-fg-brand-primary")])],
                  ),
                ],
              ),
              h.div(
                [h.Class("mt-4 flex gap-3")],
                [
                  h.button(
                    [
                      h.Class("text-sm font-semibold text-text-tertiary"),
                      h.OnClick(featureDismissed),
                      h.Type("button"),
                    ],
                    ["Dismiss"],
                  ),
                  h.button(
                    [h.Class("text-sm font-semibold text-text-brand-secondary"), h.Type("button")],
                    ["Upgrade plan"],
                  ),
                ],
              ),
            ],
          )
        : undefined,
      footerItems,
      hideBorder: model.hideBorder,
      isAccountOpen: model.isAccountOpen,
      isMobileOpen: model.isMobileOpen,
      items,
      onAccountToggle: accountToggled,
      onExpand: expanded,
      onMobileClose: mobileClosed,
      onMobileOpen: mobileOpened,
      onNavigate: navigated,
      onSearch: searchChanged,
      searchValue: model.searchValue,
      showAccountCard: model.showAccountCard,
    },
    h,
  );

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    activeUrl: "",
    expandedHrefs: [],
    isAccountOpen: false,
    isMobileOpen: false,
    searchValue: "",
    showFeatureCard: true,
  }),
  update,
  view,
} as const;
const args: typeof Args.Type = { hideBorder: false, showAccountCard: true };

export default {
  ...componentMeta("sidebar-simple"),
  argTypes: {
    hideBorder: { control: "boolean" },
    showAccountCard: { control: "boolean" },
  },
  title: "Untitled UI/Application/Sidebar Simple",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs: typeof Args.Type): Model => ({
      ...definition.init(storyArgs),
      activeUrl: "#notifications",
      expandedHrefs: ["#dashboard"],
    }),
  }),
  args,
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.DataAttribute("theme", "dark")],
        [
          h.div([h.Class("fixed inset-0 bg-bg-primary")]),
          h.div([h.Class("relative")], [view(model, h)]),
        ],
      ),
  }),
  args,
};
export const Responsive = { ...liveStory(definition), args };
export const Interactions = {
  ...liveStory({
    ...definition,
    init: (storyArgs: typeof Args.Type): Model => ({
      ...definition.init(storyArgs),
      isMobileOpen: true,
    }),
  }),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const current = () => within(canvasElement.ownerDocument.body);
    await current().findAllByAltText("Siglata logo");
    const closedMobileToggle = current().queryByRole("button", {
      name: "Expand navigation menu",
    });
    if (closedMobileToggle !== null) {
      await userEvent.click(closedMobileToggle);
    }
    await userEvent.click(await current().findByRole("link", { name: "Users" }));
    const mobileToggle = current().queryByRole("button", { name: "Expand navigation menu" });
    if (mobileToggle !== null) {
      return;
    }
    await current().findByRole("link", { current: "page", name: "Users" });
    await userEvent.click(await current().findByRole("button", { name: "Open account menu" }));
    await current().findByRole("menuitem", { name: "View profile" });
  },
};
