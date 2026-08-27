/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Controls expose the upstream activeUrl prop; interaction state remains in the FoldKit Model. */
import * as S from "effect/Schema";
import { sidebarSectionsSubheadings } from "../../../src/application.ts";
import { userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory } from "../story.ts";
import { agentFace, demoBrand, robotFace } from "../../fixtures/brand.ts";

const Args = S.Struct({ activeUrl: S.String });
const Model = S.Struct({
  ...Args.fields,
  isAccountOpen: S.Boolean,
  isMobileOpen: S.Boolean,
  searchRequests: S.Number,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "AccountToggled" }>
  | Readonly<{ _tag: "MobileClosed" }>
  | Readonly<{ _tag: "MobileOpened" }>
  | Readonly<{ _tag: "Navigated"; href: string }>
  | Readonly<{ _tag: "SearchRequested" }>;

const accountToggled: Message = { _tag: "AccountToggled" };
const mobileClosed: Message = { _tag: "MobileClosed" };
const mobileOpened: Message = { _tag: "MobileOpened" };
const navigated = (href: string): Message => ({ _tag: "Navigated", href });
const searchRequested: Message = { _tag: "SearchRequested" };

const groups = [
  {
    items: [
      { href: "/", icon: "dashboard", label: "Dashboard" },
      { href: "/projects", icon: "rows", label: "Projects" },
      { href: "/documents", icon: "document", label: "Documents" },
      { href: "/calendar", icon: "calendar", label: "Calendar" },
    ],
    label: "General",
  },
  {
    items: [
      { href: "#", icon: "reporting", label: "Reporting" },
      { badge: "8", href: "#", icon: "tasks", label: "Tasks" },
      { href: "#", icon: "users", label: "Users" },
    ],
    label: "Siglata",
  },
  {
    items: [
      { avatarUrl: robotFace("Catalog Team"), href: "#", label: "Catalog", shortcut: "⌘1" },
      { avatarUrl: robotFace("Warpspeed Team"), href: "#", label: "Warpspeed", shortcut: "⌘2" },
      { avatarUrl: robotFace("Boltshift Team"), href: "#", label: "Boltshift", shortcut: "⌘3" },
      { avatarUrl: robotFace("Sisyphus Team"), href: "#", label: "Sisyphus", shortcut: "⌘4" },
    ],
    label: "Your teams",
  },
] as const;

const update = (model: Model, message: Message): Model => {
  if (message._tag === "AccountToggled") {
    return { ...model, isAccountOpen: !model.isAccountOpen };
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
  return { ...model, searchRequests: model.searchRequests + 1 };
};

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    isAccountOpen: false,
    isMobileOpen: false,
    searchRequests: 0,
  }),
  update,
  view: (model: Model, h: Parameters<typeof sidebarSectionsSubheadings<Message>>[1]) =>
    sidebarSectionsSubheadings(
      {
        accountAvatarUrl: agentFace("Olivia Rhye"),
        activeUrl: model.activeUrl,
        brand: demoBrand(),
        groups,
        isAccountOpen: model.isAccountOpen,
        isMobileOpen: model.isMobileOpen,
        onAccountToggle: accountToggled,
        onMobileClose: mobileClosed,
        onMobileOpen: mobileOpened,
        onNavigate: navigated,
        onSearch: searchRequested,
      },
      h,
    ),
} as const;

const args: typeof Args.Type = { activeUrl: "/" };
const renderFixture = (
  model: Model,
  h: Parameters<typeof sidebarSectionsSubheadings<Message>>[1],
) => h.div([h.Class("fixed inset-0 bg-bg-primary")], [definition.view(model, h)]);

export default {
  ...componentMeta("sidebar-sections-subheadings"),
  argTypes: {
    activeUrl: {
      control: "select",
      options: ["/", "/projects", "/documents", "/calendar"],
    },
  },
  title: "Untitled UI/Application/Sidebar Sections Subheadings",
};

export const AllVariants = { ...liveStory({ ...definition, view: renderFixture }), args };
export const States = {
  ...liveStory({ ...definition, view: renderFixture }),
  args: { activeUrl: "/documents" },
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
    await userEvent.click(await current().findByRole("button", { name: "Search" }));
    await userEvent.click(await current().findByRole("link", { name: "Calendar" }));
    const mobileToggle = current().queryByRole("button", { name: "Expand navigation menu" });
    if (mobileToggle !== null) {
      return;
    }
    await current().findByRole("link", { current: "page", name: "Calendar" });
    await userEvent.click(await current().findByRole("button", { name: "Open account menu" }));
    await current().findByRole("menuitem", { name: "View profile" });
  },
};
