/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, within } from "storybook/test";

import { aiAssistantIntroMenu } from "../../../src/application.ts";
import type { AIAssistantIntroLocale, AIAssistantIntroPrompt } from "../../../src/application.ts";

import { componentMeta, liveCommandStory, waitForStoryReady } from "../story.ts";

import { demoBrand, agentFace } from "../../fixtures/brand.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Prompt = S.Literals([
  "create-image",
  "analyze-data",
  "make-plan",
  "summarize-text",
  "help-write",
  "more",
]);
const Args = S.Struct({
  accountAvatarUrl: S.String,
  accountName: S.String,
  locale: Locale,
  userName: S.String,
});
const Model = S.Struct({
  accountAvatarUrl: S.String,
  accountName: S.String,
  inputValue: S.String,
  isOpen: S.Boolean,
  locale: Locale,
  selectedPrompt: S.optional(Prompt),
  userName: S.String,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
type FixturePhase = "inactive" | "partial";
const Shown = m("AIAssistantIntroShown");
const ShowFailed = m("AIAssistantIntroShowFailed");
const Closed = m("AIAssistantIntroClosed");
const CloseFailed = m("AIAssistantIntroCloseFailed");
type Message =
  | Readonly<{
      _tag: "Account" | "Attach" | "Dismiss" | "Microphone" | "Open" | "Shortcuts" | "Submit";
    }>
  | Readonly<{ _tag: "Input"; value: string }>
  | Readonly<{ _tag: "Prompt"; prompt: AIAssistantIntroPrompt }>
  | typeof Shown.Type
  | typeof ShowFailed.Type
  | typeof Closed.Type
  | typeof CloseFailed.Type;

const ShowAIAssistantIntro = Command.define("ShowAIAssistantIntro", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector).pipe(
      Effect.tap(() =>
        Effect.sync(() => {
          document.querySelector<HTMLElement>(selector)?.focus();
        }),
      ),
      Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() }),
    ),
  messages: [Shown, ShowFailed],
});

const CloseAIAssistantIntro = Command.define("CloseAIAssistantIntro", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed, CloseFailed],
});

const action = (
  tag: "Account" | "Attach" | "Dismiss" | "Microphone" | "Open" | "Shortcuts" | "Submit",
): Message => ({ _tag: tag });
const input = (inputValue: string): Message => ({ _tag: "Input", value: inputValue });
const prompt = (selectedPrompt: AIAssistantIntroPrompt): Message => ({
  _tag: "Prompt",
  prompt: selectedPrompt,
});

const promptValue: Record<AIAssistantIntroLocale, Record<AIAssistantIntroPrompt, string>> = {
  "en-US": {
    "analyze-data": "Help me analyze this data.",
    "create-image": "Help me create an image.",
    "help-write": "Help me write.",
    "make-plan": "Help me make a plan.",
    more: "Show me more ways you can help.",
    "summarize-text": "Help me summarize this text.",
  },
  "pt-BR": {
    "analyze-data": "Ajude-me a analisar estes dados.",
    "create-image": "Ajude-me a criar uma imagem.",
    "help-write": "Ajude-me a escrever.",
    "make-plan": "Ajude-me a criar um plano.",
    more: "Mostre outras formas de ajudar.",
    "summarize-text": "Ajude-me a resumir este texto.",
  },
};

const fixtureInput: Record<AIAssistantIntroLocale, Record<FixturePhase, string>> = {
  "en-US": { inactive: "", partial: "Help me make a plan." },
  "pt-BR": { inactive: "", partial: "Ajude-me a criar um plano." },
};

const initial = (args: Args, phase: FixturePhase): Model => ({
  ...args,
  inputValue: fixtureInput[args.locale][phase],
  isOpen: true,
});

const definitionWith = (phase: FixturePhase) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      initial(args, phase),
      [ShowAIAssistantIntro({ selector: "#ai-assistant-intro-menu-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "Input") {
      return [{ ...model, inputValue: message.value }, []] as const;
    }
    if (message._tag === "Prompt") {
      return [
        {
          ...model,
          inputValue: promptValue[model.locale][message.prompt],
          selectedPrompt: message.prompt,
        },
        [],
      ] as const;
    }
    if (message._tag === "Open") {
      return [
        { ...model, isOpen: true },
        [ShowAIAssistantIntro({ selector: "#ai-assistant-intro-menu-story" })],
      ] as const;
    }
    const next = {
      ...model,
      isOpen:
        message._tag === "AIAssistantIntroClosed" ||
        message._tag === "AIAssistantIntroCloseFailed" ||
        message._tag === "AIAssistantIntroShowFailed"
          ? false
          : model.isOpen,
    } satisfies Model;
    return message._tag === "Dismiss"
      ? ([next, [CloseAIAssistantIntro({ selector: "#ai-assistant-intro-menu-story" })]] as const)
      : ([next, []] as const);
  },
  view: (model: Model, h: Parameters<typeof aiAssistantIntroMenu<Message>>[1]) =>
    aiAssistantIntroMenu(
      {
        accountAvatarUrl: model.accountAvatarUrl,
        accountName: model.accountName,
        brandMark: demoBrand().mark,
        id: "ai-assistant-intro-menu-story",
        inputValue: model.inputValue,
        isOpen: model.isOpen,
        locale: model.locale,
        onAccount: action("Account"),
        onAttach: action("Attach"),
        onDismiss: action("Dismiss"),
        onInput: input,
        onMicrophone: action("Microphone"),
        onPrompt: prompt,
        onShortcuts: action("Shortcuts"),
        onSubmit: action("Submit"),
        userName: model.userName,
      },
      h,
    ),
});

const definition = definitionWith("inactive");
const interactionDefinition = {
  ...definition,
  init: (args: Args) => [{ ...initial(args, "inactive"), isOpen: false }, []] as const,
  view: (model: Model, h: Parameters<typeof aiAssistantIntroMenu<Message>>[1]) =>
    h.div(
      [h.Class("fixed inset-0 bg-bg-primary")],
      [
        h.button(
          [
            h.AriaControls("ai-assistant-intro-menu-story"),
            h.AriaExpanded(model.isOpen),
            h.Class(
              "fixed top-4 right-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-bg-primary px-4 text-sm font-semibold text-text-secondary shadow-xs ring-1 ring-border-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
            ),
            h.OnClick(action("Open")),
            h.Type("button"),
          ],
          ["Open AI assistant"],
        ),
        definition.view(model, h),
      ],
    ),
};
const fixture = {
  accountAvatarUrl: agentFace("Olivia"),
  accountName: "Olivia",
  locale: "en-US",
  userName: "Olivia",
} satisfies Args;

const meta = componentMeta("ai-assistant-intro-menu");
export default {
  ...meta,
  argTypes: { locale: { control: "select", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/AI Assistant Intro Menu",
};

export const AllVariants = { ...liveCommandStory(definition), args: fixture };
export const States = {
  ...liveCommandStory(definitionWith("partial")),
  args: fixture,
};
export const Dark = {
  ...liveCommandStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: fixture,
};
export const Responsive = { ...liveCommandStory(definition), args: fixture };
export const Interactions = {
  ...liveCommandStory(interactionDefinition),
  args: fixture,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const currentOpener = () => page.getByRole("button", { name: "Open AI assistant" });
    const currentDialog = () => page.getByRole("dialog", { name: "Slideout menu" });
    const currentComposer = () => within(currentDialog()).getByRole("textbox", { name: "Message" });

    const opener = await page.findByRole(
      "button",
      { expanded: false, name: "Open AI assistant" },
      { timeout: 10_000 },
    );
    await userEvent.click(opener);
    await page.findByRole(
      "button",
      { expanded: true, name: "Open AI assistant" },
      { timeout: 10_000 },
    );
    await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 10_000 });
    let dialog = currentDialog();
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await page.findByRole(
      "button",
      { expanded: false, name: "Open AI assistant" },
      { timeout: 10_000 },
    );
    await expect(page.queryByRole("dialog", { name: "Slideout menu" })).not.toBeInTheDocument();
    await expect(currentOpener()).toHaveFocus();

    await userEvent.click(currentOpener());
    await page.findByRole(
      "button",
      { expanded: true, name: "Open AI assistant" },
      { timeout: 10_000 },
    );
    await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 10_000 });
    const outsideTarget = canvasElement.ownerDocument.querySelector<HTMLButtonElement>(
      '[data-ai-assistant-intro-overlay="ai-assistant-intro-menu-story"] > button',
    );
    await expect(outsideTarget).not.toBeNull();
    if (outsideTarget !== null) {
      await userEvent.click(outsideTarget);
    }
    await page.findByRole(
      "button",
      { expanded: false, name: "Open AI assistant" },
      { timeout: 10_000 },
    );
    await expect(page.queryByRole("dialog", { name: "Slideout menu" })).not.toBeInTheDocument();
    await expect(currentOpener()).toHaveFocus();

    await userEvent.click(currentOpener());
    await page.findByRole(
      "button",
      { expanded: true, name: "Open AI assistant" },
      { timeout: 10_000 },
    );
    await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 10_000 });
    dialog = currentDialog();
    await expect(dialog).toHaveFocus();

    await expect(currentComposer()).toHaveValue("");
    await userEvent.click(within(dialog).getByRole("button", { name: "Make a plan" }));
    await within(currentDialog()).findByDisplayValue("Help me make a plan.");
    await expect(currentComposer()).toHaveValue("Help me make a plan.");

    await userEvent.type(currentComposer(), " Start with dependencies.");
    await within(currentDialog()).findByDisplayValue(
      "Help me make a plan. Start with dependencies.",
    );
    await expect(currentComposer()).toHaveValue("Help me make a plan. Start with dependencies.");

    dialog = currentDialog();
    await expect(dialog).toBeVisible();
    await expect(currentComposer()).toHaveFocus();
  },
};
