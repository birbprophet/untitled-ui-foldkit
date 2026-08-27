/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-placeholder-implementation, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- placeholder-menu is the authenticated component ID; Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { placeholderMenu } from "../../../src/application/placeholder-menu.ts";

import { componentMeta, liveCommandStory, waitForStoryReady } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({ isOpen: S.Boolean, locale: Locale });
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const Shown = m("PlaceholderMenuShown");
const Closed = m("PlaceholderMenuClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Dismiss" | "Save" }>
  | typeof Shown.Type
  | typeof Closed.Type;

const action = (tag: "Cancel" | "Dismiss" | "Save"): Message => ({ _tag: tag });

const ShowPlaceholderMenu = Command.define("ShowPlaceholderMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[data-placeholder-menu-close]" }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});

const ClosePlaceholderMenu = Command.define("ClosePlaceholderMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});

const definition = {
  Args,
  Model,
  init: (args: Args) =>
    [
      { isOpen: true, locale: args.locale } satisfies Model,
      [ShowPlaceholderMenu({ selector: "#placeholder-menu-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "PlaceholderMenuClosed") {
      return [
        { ...model, isOpen: true },
        [ShowPlaceholderMenu({ selector: "#placeholder-menu-story" })],
      ] as const;
    }
    return message._tag === "Cancel" || message._tag === "Dismiss" || message._tag === "Save"
      ? ([model, [ClosePlaceholderMenu({ selector: "#placeholder-menu-story" })]] as const)
      : ([model, []] as const);
  },
  view: (model: Model, h: Parameters<typeof placeholderMenu<Message>>[1]) =>
    placeholderMenu(
      {
        id: "placeholder-menu-story",
        isOpen: model.isOpen,
        locale: model.locale,
        onCancel: action("Cancel"),
        onDismiss: action("Dismiss"),
        onSave: action("Save"),
      },
      h,
    ),
};

export default {
  ...componentMeta("placeholder-menu"),
  argTypes: { locale: { control: "inline-radio", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/Placeholder Menu",
};

export const AllVariants = { ...liveCommandStory(definition), args: { locale: "en-US" } };
export const Dark = {
  ...liveCommandStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: { locale: "en-US" },
};
export const Responsive = { ...liveCommandStory(definition), args: { locale: "en-US" } };
export const Interactions = {
  ...liveCommandStory(definition),
  args: { locale: "en-US" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const currentMenu = async () => await page.findByRole("dialog", { name: "Slideout menu" });

    let menu = await currentMenu();
    await expect(within(menu).getByRole("button", { name: "Close" })).toHaveFocus();
    await expect(within(menu).getByText("Project settings")).toBeVisible();
    await userEvent.click(within(menu).getByRole("button", { name: "Cancel" }));
    await waitFor(async () => {
      menu = await currentMenu();
      await expect(within(menu).getByRole("button", { name: "Close" })).toHaveFocus();
    });
    await userEvent.click(within(menu).getByRole("button", { name: "Save" }));
    await waitFor(async () => {
      menu = await currentMenu();
      await expect(within(menu).getByRole("button", { name: "Close" })).toHaveFocus();
    });
    await userEvent.keyboard("{Escape}");
    await waitFor(async () => {
      menu = await currentMenu();
      await expect(within(menu).getByRole("button", { name: "Close" })).toHaveFocus();
    });
  },
};
