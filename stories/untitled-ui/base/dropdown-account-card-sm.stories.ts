/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions use the browser promise API directly. */
import * as S from "effect/Schema";
import { dropdownAccountCardSM } from "ui/base";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const AccountId = S.Literals(["olivia", "sienna"]);
const Args = S.Struct({});
const Model = S.Struct({
  focusedId: S.String,
  isDarkMode: S.Boolean,
  isOpen: S.Boolean,
  isSignOutOpen: S.Boolean,
  isSupportOpen: S.Boolean,
  selectedAccountId: AccountId,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "AccountSelected"; id: typeof AccountId.Type }>
  | Readonly<{ _tag: "Action" | "Focused"; id: string }>
  | Readonly<{
      _tag: "Closed" | "SignOutToggled" | "SupportToggled" | "ThemeToggled" | "Toggled";
    }>;

const specimen = (model: Model, h: Parameters<typeof dropdownAccountCardSM<Message>>[1]) =>
  dropdownAccountCardSM(
    {
      focusedId: model.focusedId,
      isDarkMode: model.isDarkMode,
      isOpen: model.isOpen,
      isSignOutOpen: model.isSignOutOpen,
      isSupportOpen: model.isSupportOpen,
      onAccountSelect: (id): Message => ({ _tag: "AccountSelected", id }),
      onAction: (id): Message => ({ _tag: "Action", id }),
      onClose: { _tag: "Closed" },
      onFocus: (id): Message => ({ _tag: "Focused", id }),
      onSignOutToggle: { _tag: "SignOutToggled" },
      onSupportToggle: { _tag: "SupportToggled" },
      onThemeToggle: { _tag: "ThemeToggled" },
      onToggle: { _tag: "Toggled" },
      selectedAccountId: model.selectedAccountId,
    },
    h,
  );

const definition = (initiallyOpen: boolean) => ({
  Args,
  Model,
  init: (_args: typeof Args.Type): Model => ({
    focusedId: "profile",
    isDarkMode: false,
    isOpen: initiallyOpen,
    isSignOutOpen: false,
    isSupportOpen: false,
    selectedAccountId: "olivia",
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "Toggled") {
      return { ...model, isOpen: !model.isOpen, isSignOutOpen: false, isSupportOpen: false };
    }
    if (message._tag === "Closed") {
      return { ...model, isOpen: false, isSignOutOpen: false, isSupportOpen: false };
    }
    if (message._tag === "Focused") {
      return { ...model, focusedId: message.id };
    }
    if (message._tag === "ThemeToggled") {
      return { ...model, isDarkMode: !model.isDarkMode };
    }
    if (message._tag === "SignOutToggled") {
      return { ...model, isSignOutOpen: !model.isSignOutOpen, isSupportOpen: false };
    }
    if (message._tag === "SupportToggled") {
      return { ...model, isSignOutOpen: false, isSupportOpen: !model.isSupportOpen };
    }
    if (message._tag === "AccountSelected") {
      return { ...model, selectedAccountId: message.id };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof dropdownAccountCardSM<Message>>[1]) =>
    h.div([h.Class("min-h-[36rem]")], [specimen(model, h)]),
});

export default {
  ...componentMeta("dropdown-account-card-sm"),
  title: "Untitled UI/Base/Dropdown Account Card SM",
};
export const AllVariants = {
  ...liveStory({
    ...definition(false),
    view: (model, h) => matrix([["Trigger", [specimen(model, h)]]], h),
  }),
  args: {},
};
export const States = {
  ...liveStory({
    ...definition(true),
    view: (model, h) => matrix([["Open", [specimen(model, h)]]], h),
  }),
  args: {},
};
export const Dark = {
  ...liveStory({
    ...definition(false),
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [specimen(model, h)],
      ),
  }),
  args: {},
};
export const Interactions = {
  ...liveStory(definition(false)),
  args: {},
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Online Olivia Rhye" }));
    await userEvent.click(await canvas.findByRole("menuitemradio", { name: "Sienna Hewitt" }));
    await expect(
      await canvas.findByRole("menuitemradio", { checked: true, name: "Sienna Hewitt" }),
    ).toBeInTheDocument();
    await userEvent.click(await canvas.findByRole("menuitem", { name: "Support" }));
    await expect(await canvas.findByRole("menuitem", { name: "Send feedback" })).toBeVisible();
    await userEvent.click(await canvas.findByRole("menuitem", { name: "Send feedback" }));
    await userEvent.click(await canvas.findByRole("menuitem", { name: "Sign out" }));
    await userEvent.click(await canvas.findByRole("menuitem", { name: "All devices" }));
    await userEvent.keyboard("{Escape}");
  },
};
