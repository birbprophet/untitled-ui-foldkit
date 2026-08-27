/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-await-in-loop, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/imperative-loops -- Storybook interactions and native dialog commands use browser APIs; controlled typing reacquires the textarea after each render. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { aiAssistantMessageMenu } from "ui/application";
import type { AIAssistantMessageMenuDecision } from "ui/application";

import { componentMeta, liveCommandStory, waitForStoryReady } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({
  inputValue: S.String,
  isOpen: S.Boolean,
  locale: Locale,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
type FixturePhase = "inactive" | "partial";
type MessageAction = "ai" | "copy" | "download" | "edit" | "play" | "reply";
const Shown = m("AIAssistantMessageMenuShown");
const ShowFailed = m("AIAssistantMessageMenuShowFailed");
const Closed = m("AIAssistantMessageMenuClosed");
const CloseFailed = m("AIAssistantMessageMenuCloseFailed");
const InputChanged = m("AIAssistantMessageMenuInputChanged", { value: S.String });
type Message =
  | Readonly<{
      _tag: "Account" | "Attach" | "Dismiss" | "Microphone" | "Open" | "Shortcuts" | "Submit";
    }>
  | Readonly<{ _tag: "Decision"; decision: AIAssistantMessageMenuDecision }>
  | Readonly<{ _tag: "MessageAction"; action: MessageAction; messageId: string }>
  | typeof Shown.Type
  | typeof ShowFailed.Type
  | typeof Closed.Type
  | typeof CloseFailed.Type
  | typeof InputChanged.Type;

const action = (
  tag: "Account" | "Attach" | "Dismiss" | "Microphone" | "Open" | "Shortcuts" | "Submit",
): Message => ({ _tag: tag });
const decision = (selectedDecision: AIAssistantMessageMenuDecision): Message => ({
  _tag: "Decision",
  decision: selectedDecision,
});
const messageAction = (messageId: string, actionValue: MessageAction): Message => ({
  _tag: "MessageAction",
  action: actionValue,
  messageId,
});

const ShowAIAssistantMessageMenu = Command.define("ShowAIAssistantMessageMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[data-ai-assistant-message-menu-close]" }).pipe(
      Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() }),
    ),
  messages: [Shown, ShowFailed],
});

const CloseAIAssistantMessageMenu = Command.define("CloseAIAssistantMessageMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed, CloseFailed],
});

const triggerClassName = (initiallyOpen: boolean, isOpen: boolean): string => {
  if (initiallyOpen) {
    return "sr-only";
  }
  return isOpen
    ? "pointer-events-none opacity-0"
    : "rounded-lg bg-bg-brand-solid px-3 py-2 text-sm font-semibold text-text-primary-on-brand outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2";
};

const fixtureInput: Record<"en-US" | "pt-BR", Record<FixturePhase, string>> = {
  "en-US": { inactive: "", partial: "Move the strategy session" },
  "pt-BR": { inactive: "", partial: "Mover a sessão de estratégia" },
};

const definitionWith = (phase: FixturePhase, initiallyOpen = true) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      {
        inputValue: fixtureInput[args.locale][phase],
        isOpen: initiallyOpen,
        locale: args.locale,
      } satisfies Model,
      initiallyOpen
        ? [ShowAIAssistantMessageMenu({ selector: "#ai-assistant-message-menu-story" })]
        : [],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "AIAssistantMessageMenuInputChanged") {
      return [{ ...model, inputValue: message.value }, []] as const;
    }
    if (message._tag === "Open") {
      return [
        { ...model, isOpen: true },
        [ShowAIAssistantMessageMenu({ selector: "#ai-assistant-message-menu-story" })],
      ] as const;
    }
    if (message._tag === "Dismiss") {
      return [
        model,
        [CloseAIAssistantMessageMenu({ selector: "#ai-assistant-message-menu-story" })],
      ] as const;
    }
    if (message._tag === "AIAssistantMessageMenuClosed") {
      return [{ ...model, isOpen: false }, []] as const;
    }
    if (
      message._tag === "AIAssistantMessageMenuShowFailed" ||
      message._tag === "AIAssistantMessageMenuCloseFailed"
    ) {
      return [{ ...model, isOpen: false }, []] as const;
    }
    return [model, []] as const;
  },
  view: (model: Model, h: Parameters<typeof aiAssistantMessageMenu<Message>>[1]) =>
    h.div(
      [],
      [
        h.button(
          [
            h.Class(triggerClassName(initiallyOpen, model.isOpen)),
            h.DataAttribute("ai-assistant-message-menu-trigger", ""),
            h.OnClick(action("Open")),
            h.Type("button"),
          ],
          [model.locale === "pt-BR" ? "Abrir assistente de IA" : "Open AI assistant"],
        ),
        aiAssistantMessageMenu(
          {
            id: "ai-assistant-message-menu-story",
            inputValue: model.inputValue,
            isOpen: model.isOpen,
            locale: model.locale,
            onAccount: action("Account"),
            onAttach: action("Attach"),
            onDecision: decision,
            onDismiss: action("Dismiss"),
            onInput: (value: string) => InputChanged({ value }),
            onMessageAction: messageAction,
            onMicrophone: action("Microphone"),
            onShortcuts: action("Shortcuts"),
            onSubmit: action("Submit"),
          },
          h,
        ),
      ],
    ),
});

const emptyDefinition = definitionWith("inactive");
const partialDefinition = definitionWith("partial");
const interactiveDefinition = definitionWith("inactive", false);

export default {
  ...componentMeta("ai-assistant-message-menu"),
  argTypes: { locale: { control: "select", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/AI Assistant Message Menu",
};

export const AllVariants = { ...liveCommandStory(emptyDefinition), args: { locale: "en-US" } };
export const States = { ...liveCommandStory(partialDefinition), args: { locale: "en-US" } };
export const Dark = {
  ...liveCommandStory({
    ...emptyDefinition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [emptyDefinition.view(model, h)],
      ),
  }),
  args: { locale: "en-US" },
};
export const Responsive = { ...liveCommandStory(emptyDefinition), args: { locale: "en-US" } };
export const Interactions = {
  ...liveCommandStory(interactiveDefinition),
  args: { locale: "en-US" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const currentMenu = async () => await page.findByRole("dialog", { name: "Slideout menu" });
    const currentComposer = async () =>
      await within(await currentMenu()).findByRole("textbox", { name: "Message" });

    const trigger = await page.findByRole("button", { name: "Open AI assistant" });
    await userEvent.click(trigger);
    let menu = await currentMenu();
    await expect(within(menu).getByRole("button", { name: "Close" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(
      () => expect(page.queryByRole("dialog", { name: "Slideout menu" })).not.toBeInTheDocument(),
      { timeout: 5000 },
    );
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    menu = await currentMenu();
    const backdrop = canvasElement.ownerDocument.querySelector<HTMLButtonElement>(
      '[data-slideout-overlay="ai-assistant-message-menu-story"] > button',
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
    menu = await currentMenu();
    await userEvent.click(within(menu).getByRole("button", { name: "Yes, update" }));
    menu = await currentMenu();
    await userEvent.click(within(menu).getByRole("button", { name: "Play audio message" }));
    await userEvent.click(await currentComposer());
    for (const character of "Move it to Friday at 3 PM") {
      await userEvent.type(await currentComposer(), character);
    }
    await waitFor(async () => {
      await expect(await currentComposer()).toHaveValue("Move it to Friday at 3 PM");
    });
    await expect(await currentComposer()).toHaveFocus();
  },
};
