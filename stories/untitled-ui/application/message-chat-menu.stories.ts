/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { messageChatMenu } from "ui/application";
import type { MessagingAction } from "ui/application";

import { componentMeta, liveCommandStory, waitForStoryReady } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Tab = S.Literals(["archive", "groups", "recent"]);
const Action = S.Literals(["ai", "copy", "download", "edit", "play", "reply"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({
  draft: S.String,
  focusedTab: Tab,
  isOpen: S.Boolean,
  lastAction: S.String,
  lastActionId: S.String,
  locale: Locale,
  selectedTab: Tab,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
type Tab = typeof Tab.Type;
const Shown = m("MessageChatMenuShown");
const ShowFailed = m("MessageChatMenuShowFailed");
const Closed = m("MessageChatMenuClosed");
const CloseFailed = m("MessageChatMenuCloseFailed");
const DraftChanged = m("MessageChatMenuDraftChanged", { value: S.String });
const MessageAction = m("MessageChatMenuAction", { action: Action, id: S.String });
const TabFocused = m("MessageChatMenuTabFocused", { tab: Tab });
const TabSelected = m("MessageChatMenuTabSelected", { tab: Tab });
type Message =
  | Readonly<{ _tag: "Dismiss" | "Open" | "Submit" }>
  | typeof Shown.Type
  | typeof ShowFailed.Type
  | typeof Closed.Type
  | typeof CloseFailed.Type
  | typeof DraftChanged.Type
  | typeof MessageAction.Type
  | typeof TabFocused.Type
  | typeof TabSelected.Type;

const action = (tag: "Dismiss" | "Open" | "Submit"): Message => ({ _tag: tag });

const triggerClassName = (initiallyOpen: boolean, isOpen: boolean): string => {
  if (initiallyOpen) {
    return "sr-only";
  }
  return isOpen
    ? "pointer-events-none opacity-0"
    : "rounded-lg bg-bg-brand-solid px-3 py-2 text-sm font-semibold text-text-primary-on-brand outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2";
};

const ShowMessageChatMenu = Command.define("ShowMessageChatMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[data-message-chat-menu-close]" }).pipe(
      Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() }),
    ),
  messages: [Shown, ShowFailed],
});

const CloseMessageChatMenu = Command.define("CloseMessageChatMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed, CloseFailed],
});

const definitionWith = (state: "empty" | "filled", initiallyOpen = true) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      {
        draft: state === "filled" ? "I’ll review the requirements today." : "",
        focusedTab: state === "filled" ? "groups" : "recent",
        isOpen: initiallyOpen,
        lastAction: "",
        lastActionId: "",
        locale: args.locale,
        selectedTab: state === "filled" ? "groups" : "recent",
      } satisfies Model,
      initiallyOpen ? [ShowMessageChatMenu({ selector: "#message-chat-menu-story" })] : [],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "MessageChatMenuDraftChanged") {
      return [{ ...model, draft: message.value }, []] as const;
    }
    if (message._tag === "MessageChatMenuTabFocused") {
      return [{ ...model, focusedTab: message.tab, selectedTab: message.tab }, []] as const;
    }
    if (message._tag === "MessageChatMenuTabSelected") {
      return [{ ...model, focusedTab: message.tab, selectedTab: message.tab }, []] as const;
    }
    if (message._tag === "MessageChatMenuAction") {
      return [{ ...model, lastAction: message.action, lastActionId: message.id }, []] as const;
    }
    if (message._tag === "Submit") {
      return [{ ...model, draft: "" }, []] as const;
    }
    if (message._tag === "Open") {
      return [
        { ...model, isOpen: true },
        [ShowMessageChatMenu({ selector: "#message-chat-menu-story" })],
      ] as const;
    }
    if (message._tag === "Dismiss") {
      return [model, [CloseMessageChatMenu({ selector: "#message-chat-menu-story" })]] as const;
    }
    if (message._tag === "MessageChatMenuClosed") {
      return [{ ...model, isOpen: false }, []] as const;
    }
    if (
      message._tag === "MessageChatMenuShowFailed" ||
      message._tag === "MessageChatMenuCloseFailed"
    ) {
      return [{ ...model, isOpen: false }, []] as const;
    }
    return [model, []] as const;
  },
  view: (model: Model, h: Parameters<typeof messageChatMenu<Message>>[1]) =>
    h.div(
      [],
      [
        h.button(
          [
            h.Class(triggerClassName(initiallyOpen, model.isOpen)),
            h.DataAttribute("message-chat-menu-trigger", ""),
            h.OnClick(action("Open")),
            h.Type("button"),
          ],
          [model.locale === "pt-BR" ? "Abrir chat em grupo" : "Open group chat"],
        ),
        messageChatMenu(
          {
            draft: model.draft,
            focusedTab: model.focusedTab,
            id: "message-chat-menu-story",
            isOpen: model.isOpen,
            locale: model.locale,
            messageForDraft: (value: string) => DraftChanged({ value }),
            messageForTabFocus: (tab: Tab) => TabFocused({ tab }),
            messageForTabSelection: (tab: Tab) => TabSelected({ tab }),
            onDismiss: action("Dismiss"),
            onMessageAction: (id: string, messageAction: MessagingAction) =>
              MessageAction({ action: messageAction, id }),
            onSubmit: action("Submit"),
            selectedTab: model.selectedTab,
          },
          h,
        ),
      ],
    ),
});

const fixture = { locale: "en-US" } satisfies Args;
const emptyDefinition = definitionWith("empty");
const interactiveDefinition = definitionWith("empty", false);
export default {
  ...componentMeta("message-chat-menu"),
  argTypes: { locale: { control: "select", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/Message Chat Menu",
};
export const AllVariants = { ...liveCommandStory(emptyDefinition), args: fixture };
export const States = { ...liveCommandStory(definitionWith("filled")), args: fixture };
export const Dark = {
  ...liveCommandStory({
    ...emptyDefinition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [emptyDefinition.view(model, h)],
      ),
  }),
  args: fixture,
};
export const Responsive = {
  ...liveCommandStory(emptyDefinition),
  args: fixture,
};
export const Interactions = {
  ...liveCommandStory(interactiveDefinition),
  args: fixture,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = await page.findByRole("button", { name: "Open group chat" });
    await userEvent.click(trigger);
    let menu = await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 5000 });
    await expect(within(menu).getByRole("button", { name: "Close" })).toHaveFocus();
    await expect(within(menu).getByRole("heading", { name: "Group chat" })).toBeVisible();
    await expect(within(menu).getByRole("list", { name: "Conversation" })).toHaveTextContent(
      "Tech requirements.pdf",
    );

    await userEvent.keyboard("{Escape}");
    await waitFor(
      () => expect(page.queryByRole("dialog", { name: "Slideout menu" })).not.toBeInTheDocument(),
      { timeout: 5000 },
    );
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    menu = await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 5000 });
    const backdrop = canvasElement.ownerDocument.querySelector<HTMLElement>(
      '[data-slideout-overlay="message-chat-menu-story"] > div[aria-hidden="true"]',
    );
    await expect(backdrop).not.toBeNull();
    if (backdrop !== null) {
      await userEvent.click(backdrop);
    }
    await waitFor(
      () => expect(page.queryByRole("dialog", { name: "Slideout menu" })).not.toBeInTheDocument(),
      { timeout: 5000 },
    );
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    menu = await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 5000 });
    await expect(within(menu).getByRole("button", { name: "Close" })).toHaveFocus();

    const recentTab = within(menu).getByRole("tab", { name: "Recent" });
    recentTab.focus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(
      () =>
        expect(
          within(page.getByRole("dialog", { name: "Slideout menu" })).getByRole("tab", {
            name: "Groups",
          }),
        ).toHaveAttribute("aria-selected", "true"),
      { timeout: 5000 },
    );
    menu = page.getByRole("dialog", { name: "Slideout menu" });
    let composer = within(menu).getByRole("textbox", { name: "Message" });
    await userEvent.type(composer, "I'll review today.");
    await expect(composer).toHaveValue("I'll review today.");
    await userEvent.keyboard("{Enter}");
    menu = page.getByRole("dialog", { name: "Slideout menu" });
    await expect(within(menu).getByRole("textbox", { name: "Message" })).toHaveValue("");
    composer = within(menu).getByRole("textbox", { name: "Message" });
    await userEvent.type(composer, "I'll review today.");
    await userEvent.click(within(menu).getByRole("button", { name: "Download" }));
    menu = page.getByRole("dialog", { name: "Slideout menu" });
    const editActions = within(menu).getAllByRole("button", { name: "Edit message" });
    editActions[0]?.focus();
    await expect(editActions[0]).toHaveFocus();
  },
};
