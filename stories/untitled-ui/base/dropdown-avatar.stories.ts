/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions use the browser promise API directly. */
import * as S from "effect/Schema";
import { dropdownAvatar } from "../../../src/base.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";
import { agentFace } from "../../fixtures/brand.ts";

const Args = S.Struct({});
const Model = S.Struct({
  focusedId: S.String,
  isDarkMode: S.Boolean,
  isOpen: S.Boolean,
  isSupportOpen: S.Boolean,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Action" | "Focused"; id: string }>
  | Readonly<{
      _tag: "Closed" | "SupportToggled" | "ThemeToggled" | "Toggled";
    }>;

const specimen = (model: Model, h: Parameters<typeof dropdownAvatar<Message>>[1]) =>
  dropdownAvatar(
    {
      avatarUrl: agentFace("Olivia Rhye"),
      focusedId: model.focusedId,
      isDarkMode: model.isDarkMode,
      isOpen: model.isOpen,
      isSupportOpen: model.isSupportOpen,
      onAction: (id): Message => ({ _tag: "Action", id }),
      onClose: { _tag: "Closed" },
      onFocus: (id): Message => ({ _tag: "Focused", id }),
      onSupportToggle: { _tag: "SupportToggled" },
      onThemeToggle: { _tag: "ThemeToggled" },
      onToggle: { _tag: "Toggled" },
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
    isSupportOpen: false,
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "Toggled") {
      return { ...model, isOpen: !model.isOpen, isSupportOpen: false };
    }
    if (message._tag === "Closed") {
      return { ...model, isOpen: false, isSupportOpen: false };
    }
    if (message._tag === "Focused") {
      return { ...model, focusedId: message.id };
    }
    if (message._tag === "ThemeToggled") {
      return { ...model, isDarkMode: !model.isDarkMode };
    }
    if (message._tag === "SupportToggled") {
      return { ...model, isSupportOpen: !model.isSupportOpen };
    }
    if (message._tag === "Action") {
      return { ...model, isOpen: false, isSupportOpen: false };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof dropdownAvatar<Message>>[1]) =>
    h.div([h.Class("min-h-[36rem]")], [specimen(model, h)]),
});

export default {
  ...componentMeta("dropdown-avatar"),
  title: "Untitled UI/Base/Dropdown Avatar",
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
    await userEvent.click(await canvas.findByRole("button", { name: "Olivia Rhye" }));
    await userEvent.click(await canvas.findByRole("menuitem", { name: "Support" }));
    await expect(await canvas.findByRole("menuitem", { name: "Send feedback" })).toBeVisible();
    await userEvent.click(await canvas.findByRole("menuitem", { name: "Send feedback" }));
    await userEvent.click(await canvas.findByRole("button", { name: "Olivia Rhye" }));
    await userEvent.click(await canvas.findByRole("button", { name: "Sign out" }));
    await waitFor(async () => {
      await expect(await canvas.findByRole("button", { name: "Olivia Rhye" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });
  },
};
