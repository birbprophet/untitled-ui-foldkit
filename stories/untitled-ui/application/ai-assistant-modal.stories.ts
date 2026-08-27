/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook play functions and native dialog commands use promise-based browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import type { AssistantPrompt } from "ui/application";
import { aiAssistantModal } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({
  accountName: S.String,
  accountSeed: S.String,
  userName: S.String,
});
const Model = S.Struct({
  accountName: S.String,
  accountSeed: S.String,
  inputValue: S.String,
  isOpen: S.Boolean,
  selectedPrompt: S.optional(S.String),
  userName: S.String,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const DialogShown = m("AIAssistantDialogShown");
const DialogClosed = m("AIAssistantDialogClosed");
const InputChanged = m("AIAssistantInputChanged", { value: S.String });
const PromptChosen = m("AIAssistantPromptChosen", { prompt: S.String });
type Message =
  | Readonly<{
      _tag: "Account" | "Attach" | "Dismiss" | "Microphone" | "Shortcuts" | "Submit";
    }>
  | typeof DialogShown.Type
  | typeof DialogClosed.Type
  | typeof InputChanged.Type
  | typeof PromptChosen.Type;
const simple = (
  tag: "Account" | "Attach" | "Dismiss" | "Microphone" | "Shortcuts" | "Submit",
): Message => ({ _tag: tag });

const ShowAIAssistantDialog = Command.define("ShowAIAssistantDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[alt="Siglata logo"]' }).pipe(
      Effect.match({ onFailure: () => DialogShown(), onSuccess: () => DialogShown() }),
    ),
  messages: [DialogShown],
});

const CloseAIAssistantDialog = Command.define("CloseAIAssistantDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => DialogClosed(), onSuccess: () => DialogClosed() }),
    ),
  messages: [DialogClosed],
});

const fixture = {
  accountName: "Olivia",
  accountSeed: "olivia-ai-assistant",
  userName: "Olivia",
} satisfies Args;

const definition = {
  Args,
  Model,
  init: (args: Args) =>
    [
      { ...args, inputValue: "", isOpen: true } satisfies Model,
      [ShowAIAssistantDialog({ selector: "#ai-assistant-modal-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    const next: Model = {
      ...model,
      inputValue: message._tag === "AIAssistantInputChanged" ? message.value : model.inputValue,
      isOpen: message._tag === "AIAssistantDialogClosed" ? false : model.isOpen,
      selectedPrompt:
        message._tag === "AIAssistantPromptChosen" ? message.prompt : model.selectedPrompt,
    };
    return message._tag === "Dismiss"
      ? ([next, [CloseAIAssistantDialog({ selector: "#ai-assistant-modal-story" })]] as const)
      : ([next, []] as const);
  },
  view: (model: Model, h: Parameters<typeof aiAssistantModal<Message>>[1]) =>
    aiAssistantModal(
      {
        accountName: model.accountName,
        accountSeed: model.accountSeed,
        id: "ai-assistant-modal-story",
        inputValue: model.inputValue,
        isOpen: model.isOpen,
        onAccount: simple("Account"),
        onAttach: simple("Attach"),
        onDismiss: simple("Dismiss"),
        onInput: (value) => InputChanged({ value }),
        onMicrophone: simple("Microphone"),
        onPrompt: (prompt: AssistantPrompt) => PromptChosen({ prompt }),
        onShortcuts: simple("Shortcuts"),
        onSubmit: simple("Submit"),
        userName: model.userName,
      },
      h,
    ),
};

export default {
  ...componentMeta("ai-assistant-modal"),
  title: "Untitled UI/Application/AI Assistant Modal",
};

export const AllVariants = { ...liveCommandStory(definition), args: fixture };

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
  ...liveCommandStory(definition),
  args: fixture,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const dialog = await canvas.findByRole("dialog", {
      name: "Welcome back! How can I help?",
    });
    await expect(dialog).toBeVisible();
    await expect(await canvas.findByAltText("Siglata logo")).toHaveFocus();
    await userEvent.click(await canvas.findByRole("button", { name: "Make a plan" }));
    const message = await canvas.findByRole("textbox", { name: "Message" });
    await userEvent.type(message, "Build a launch checklist");
    await expect(message).toHaveValue("Build a launch checklist");
    await userEvent.click(await canvas.findByRole("button", { name: "Use microphone" }));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
  },
};
