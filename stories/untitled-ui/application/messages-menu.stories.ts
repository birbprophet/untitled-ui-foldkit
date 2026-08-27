/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Pending Storybook interactions exercise the controlled native-dialog and tab lifecycle. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { messagesMenu, messagesMenuFixture } from "../../../src/application/messages-menu.ts";
import type { MessagesMenuTabId } from "../../../src/application/messages-menu.ts";
import { agentFace } from "../../fixtures/brand.ts";
import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const faces = {
  "@andi": agentFace("Andi Lane"),
  "@ava": agentFace("Ava Wright"),
  "@candice": agentFace("Candice Wu"),
  "@demi": agentFace("Demi Wilkinson"),
  "@drew": agentFace("Drew Cano"),
  "@eve": agentFace("Eve Leroy"),
  "@joshua": agentFace("Joshua Wilson"),
  "@kate": agentFace("Kate Morrison"),
  "@koray": agentFace("Koray Okumus"),
  "@lana": agentFace("Lana Steiner"),
  "@natali": agentFace("Natali Craig"),
  "@orlando": agentFace("Orlando Diggs"),
  "@phoenix": agentFace("Phoenix Baker"),
  "@rene": agentFace("Rene Wells"),
  "@zahir": agentFace("Zahir Mays"),
} as const;

const Locale = S.Literals(["en-US", "pt-BR"]);
const TabId = S.Literals(["archive", "groups", "recent"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({
  focusedTabId: S.optional(TabId),
  isOpen: S.Boolean,
  locale: Locale,
  selectedTabId: TabId,
  shouldReopen: S.Boolean,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const Shown = m("MessagesMenuShown");
const ShowFailed = m("MessagesMenuShowFailed");
const Closed = m("MessagesMenuClosed");
const CloseFailed = m("MessagesMenuCloseFailed");
type Message =
  | Readonly<{ _tag: "Dismiss" }>
  | Readonly<{ _tag: "TabFocus" | "TabSelect"; tabId: MessagesMenuTabId }>
  | typeof Shown.Type
  | typeof ShowFailed.Type
  | typeof Closed.Type
  | typeof CloseFailed.Type;

const dismiss: Message = { _tag: "Dismiss" };
const tabMessage = (tag: "TabFocus" | "TabSelect", tabId: MessagesMenuTabId): Message => ({
  _tag: tag,
  tabId,
});

const ShowMessagesMenu = Command.define("ShowMessagesMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[data-messages-menu-close]" }).pipe(
      Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() }),
    ),
  messages: [Shown, ShowFailed],
});

const CloseMessagesMenu = Command.define("CloseMessagesMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed, CloseFailed],
});

const definition = (initialTabId: MessagesMenuTabId, shouldReopen = false) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      {
        isOpen: true,
        locale: args.locale,
        selectedTabId: initialTabId,
        shouldReopen,
      } satisfies Model,
      [ShowMessagesMenu({ selector: "#messages-menu-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "TabFocus") {
      return [{ ...model, focusedTabId: message.tabId }, []] as const;
    }
    if (message._tag === "TabSelect") {
      return [{ ...model, focusedTabId: message.tabId, selectedTabId: message.tabId }, []] as const;
    }
    if (message._tag === "Dismiss") {
      return [model, [CloseMessagesMenu({ selector: "#messages-menu-story" })]] as const;
    }
    if (message._tag === "MessagesMenuClosed") {
      return model.shouldReopen
        ? ([model, [ShowMessagesMenu({ selector: "#messages-menu-story" })]] as const)
        : ([{ ...model, isOpen: false }, []] as const);
    }
    if (message._tag === "MessagesMenuShowFailed" || message._tag === "MessagesMenuCloseFailed") {
      return [{ ...model, isOpen: false }, []] as const;
    }
    return [model, []] as const;
  },
  view: (model: Model, h: Parameters<typeof messagesMenu<Message>>[1]) =>
    messagesMenu(
      {
        focusedTabId: model.focusedTabId,
        id: "messages-menu-story",
        isOpen: model.isOpen,
        locale: model.locale,
        messages: messagesMenuFixture(model.locale, faces),
        onDismiss: dismiss,
        onTabFocus: (tabId) => tabMessage("TabFocus", tabId),
        onTabSelect: (tabId) => tabMessage("TabSelect", tabId),
        selectedTabId: model.selectedTabId,
      },
      h,
    ),
});

const recent = definition("recent");
const groups = definition("groups");
const archive = definition("archive");
const interactive = definition("recent", true);
const fixture = { locale: "en-US" } satisfies Args;

export default {
  ...componentMeta("messages-menu"),
  argTypes: { locale: { control: "select", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/Messages Menu",
};

export const AllVariants = { ...liveCommandStory(recent), args: fixture };
export const States = { ...liveCommandStory(groups), args: fixture };
export const Dark = {
  ...liveCommandStory({
    ...archive,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [archive.view(model, h)],
      ),
  }),
  args: fixture,
};
export const Responsive = {
  ...liveCommandStory(recent),
  args: fixture,
};
export const Interactions = {
  ...liveCommandStory(interactive),
  args: fixture,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    let dialog = await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 5000 });
    await expect(within(dialog).getByRole("button", { name: "Close slideout menu" })).toHaveFocus();
    await expect(within(dialog).getAllByRole("listitem")).toHaveLength(15);
    await expect(within(dialog).getAllByLabelText("Unseen")).toHaveLength(3);

    await userEvent.click(within(dialog).getByRole("tab", { name: "Groups" }));
    await userEvent.keyboard("{Escape}");
    await waitFor(
      () =>
        expect(
          within(page.getByRole("dialog", { name: "Slideout menu" })).getByRole("button", {
            name: "Close slideout menu",
          }),
        ).toHaveFocus(),
      { timeout: 5000 },
    );
    dialog = page.getByRole("dialog", { name: "Slideout menu" });

    await userEvent.click(within(dialog).getByRole("tab", { name: "Groups" }));
    await waitFor(
      () =>
        expect(
          within(page.getByRole("dialog", { name: "Slideout menu" })).getByRole("tab", {
            name: "Groups",
          }),
        ).toHaveAttribute("aria-selected", "true"),
      { timeout: 5000 },
    );
    dialog = page.getByRole("dialog", { name: "Slideout menu" });
    await userEvent.keyboard("{ArrowRight}");
    await expect(within(dialog).getByRole("tab", { name: "Archive" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(
      () =>
        expect(
          within(page.getByRole("dialog", { name: "Slideout menu" })).getByRole("tab", {
            name: "Archive",
          }),
        ).toHaveAttribute("aria-selected", "true"),
      { timeout: 5000 },
    );
    dialog = page.getByRole("dialog", { name: "Slideout menu" });
    await expect(within(dialog).getByRole("tab", { name: "Archive" })).toHaveFocus();
  },
};
