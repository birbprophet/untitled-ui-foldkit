/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Controls expose the upstream activeUrl prop; interaction state remains in the FoldKit Model. */
import * as S from "effect/Schema";
import { sidebarSectionDividers } from "ui/application";
import { userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory } from "../story.ts";

const Args = S.Struct({ activeUrl: S.String });
const Model = S.Struct({
  ...Args.fields,
  expandedHrefs: S.Array(S.String),
  isAccountOpen: S.Boolean,
  isMobileOpen: S.Boolean,
  searchValue: S.String,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "AccountToggled" }>
  | Readonly<{ _tag: "Expanded"; href: string }>
  | Readonly<{ _tag: "MobileClosed" }>
  | Readonly<{ _tag: "MobileOpened" }>
  | Readonly<{ _tag: "Navigated"; href: string }>
  | Readonly<{ _tag: "SearchChanged"; value: string }>;

const accountToggled: Message = { _tag: "AccountToggled" };
const mobileClosed: Message = { _tag: "MobileClosed" };
const mobileOpened: Message = { _tag: "MobileOpened" };
const expanded = (href: string): Message => ({ _tag: "Expanded", href });
const navigated = (href: string): Message => ({ _tag: "Navigated", href });
const searchChanged = (searchValue: string): Message => ({
  _tag: "SearchChanged",
  value: searchValue,
});

const items = [
  { href: "#home", icon: "home", label: "Home" },
  { href: "#dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "#projects", icon: "rows", label: "Projects" },
  { divider: true },
  {
    href: "#folders",
    icon: "folder",
    items: [
      { badge: "18", href: "#folders-view-all", label: "View all" },
      { badge: "8", href: "#folders-recent", label: "Recent" },
      { badge: "6", href: "#folders-favorites", label: "Favorites" },
      { badge: "4", href: "#folders-shared", label: "Shared" },
    ],
    label: "Folders",
  },
  { divider: true },
  { href: "#reporting", icon: "reporting", label: "Reporting" },
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

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    expandedHrefs: [],
    isAccountOpen: false,
    isMobileOpen: false,
    searchValue: "",
  }),
  update,
  view: (model: Model, h: Parameters<typeof sidebarSectionDividers<Message>>[1]) =>
    sidebarSectionDividers(
      {
        activeUrl: model.activeUrl,
        expandedHrefs: model.expandedHrefs,
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
      },
      h,
    ),
} as const;

const args: typeof Args.Type = { activeUrl: "#home" };

const renderFixture = (model: Model, h: Parameters<typeof sidebarSectionDividers<Message>>[1]) =>
  h.div([h.Class("fixed inset-0 bg-bg-primary")], [definition.view(model, h)]);

export default {
  ...componentMeta("sidebar-section-dividers"),
  argTypes: {
    activeUrl: {
      control: "select",
      options: ["#home", "#dashboard", "#projects", "#folders-view-all", "#reporting"],
    },
  },
  title: "Untitled UI/Application/Sidebar Section Dividers",
};

export const AllVariants = { ...liveStory({ ...definition, view: renderFixture }), args };
export const States = {
  ...liveStory({ ...definition, view: renderFixture }),
  args: { activeUrl: "#folders-view-all" },
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
    ...definition,
    init: (storyArgs: typeof Args.Type): Model => ({
      ...definition.init(storyArgs),
      isMobileOpen: true,
    }),
    view: renderFixture,
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
    await userEvent.click(await current().findByRole("link", { name: "Reporting" }));
    const mobileToggle = current().queryByRole("button", { name: "Expand navigation menu" });
    if (mobileToggle !== null) {
      return;
    }
    await current().findByRole("link", { current: "page", name: "Reporting" });
    await userEvent.click(await current().findByRole("button", { name: "Open account menu" }));
    await current().findByRole("menuitem", { name: "View profile" });
  },
};
