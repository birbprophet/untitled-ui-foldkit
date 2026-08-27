/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/require-is-prefix-for-boolean-schema-field -- Controls expose only authenticated component props; navigation, search, and disclosure remain in the FoldKit Model. */
import * as S from "effect/Schema";
import { headerNavigation } from "../../../src/application.ts";
import { userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory } from "../story.ts";
import { demoBrand } from "../../fixtures/brand.ts";

const Args = S.Struct({
  centered: S.Boolean,
  hideBorder: S.Boolean,
  secondaryType: S.Literals(["buttons", "tabs"]),
});
const Model = S.Struct({
  ...Args.fields,
  activeUrl: S.String,
  isMobileOpen: S.Boolean,
  searchValue: S.String,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "AccountPressed" }>
  | Readonly<{ _tag: "MobileClosed" }>
  | Readonly<{ _tag: "MobileOpened" }>
  | Readonly<{ _tag: "Navigated"; href: string }>
  | Readonly<{ _tag: "SearchChanged"; value: string }>;

const accountPressed: Message = { _tag: "AccountPressed" };
const mobileClosed: Message = { _tag: "MobileClosed" };
const mobileOpened: Message = { _tag: "MobileOpened" };
const navigated = (href: string): Message => ({ _tag: "Navigated", href });
const searchChanged = (searchValue: string): Message => ({
  _tag: "SearchChanged",
  value: searchValue,
});

const items = [
  { href: "#home", label: "Home" },
  {
    href: "#dashboard",
    items: [
      { href: "#overview", label: "Overview" },
      { href: "#activity", label: "Activity" },
      { href: "#reports", label: "Reports" },
      { href: "#notifications", label: "Notifications" },
    ],
    label: "Dashboard",
  },
  { href: "#projects", label: "Projects" },
  { href: "#tasks", label: "Tasks" },
  { href: "#reporting", label: "Reporting" },
  { href: "#users", label: "Users" },
] as const;

const update = (model: Model, message: Message): Model => {
  if (message._tag === "Navigated") {
    return { ...model, activeUrl: message.href, isMobileOpen: false };
  }
  if (message._tag === "MobileOpened") {
    return { ...model, isMobileOpen: true };
  }
  if (message._tag === "MobileClosed") {
    return { ...model, isMobileOpen: false };
  }
  if (message._tag === "SearchChanged") {
    return { ...model, searchValue: message.value };
  }
  return model;
};

const view = (model: Model, h: Parameters<typeof headerNavigation<Message>>[1]) =>
  headerNavigation(
    {
      activeUrl: model.activeUrl,
      brand: demoBrand(),
      centered: model.centered,
      hideBorder: model.hideBorder,
      isMobileOpen: model.isMobileOpen,
      items,
      onAccountPress: accountPressed,
      onMobileClose: mobileClosed,
      onMobileOpen: mobileOpened,
      onNavigate: navigated,
      onSearch: searchChanged,
      searchValue: model.searchValue,
      secondaryType: model.secondaryType,
    },
    h,
  );

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    activeUrl: "#reports",
    isMobileOpen: false,
    searchValue: "",
  }),
  update,
  view,
} as const;
const args: typeof Args.Type = { centered: false, hideBorder: false, secondaryType: "buttons" };

export default {
  ...componentMeta("header-navigation"),
  argTypes: {
    centered: { control: "boolean" },
    hideBorder: { control: "boolean" },
    secondaryType: { control: "select", options: ["buttons", "tabs"] },
  },
  title: "Untitled UI/Application/Header Navigation",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs: typeof Args.Type): Model => ({
      ...storyArgs,
      activeUrl: "#activity",
      isMobileOpen: false,
      searchValue: "Quarterly report",
    }),
  }),
  args: { ...args, centered: true, secondaryType: "tabs" },
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
      ...storyArgs,
      activeUrl: "#reports",
      isMobileOpen: true,
      searchValue: "",
    }),
  }),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const current = () => within(canvasElement.ownerDocument.body);
    const mobileClose = current().queryByRole("button", {
      expanded: true,
      name: "Close navigation menu",
    });
    await userEvent.click(await current().findByRole("link", { name: "Projects" }));
    if (mobileClose !== null) {
      await current().findByRole("button", { name: "Expand navigation menu" });
      return;
    }
    await current().findByRole("link", { current: "page", name: "Projects" });
    await userEvent.click(await current().findByRole("link", { name: "Search" }));
    await current().findByRole("link", { current: "page", name: "Search" });
  },
};
