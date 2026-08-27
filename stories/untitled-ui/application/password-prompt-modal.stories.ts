/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-hardcoded-secrets, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions use inert upstream demo credentials and native dialog commands. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { passwordPromptModal } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({
  email: S.String,
  isOpen: S.Boolean,
  isPasswordVisible: S.Boolean,
  password: S.String,
});
type Model = typeof Model.Type;
const Shown = m("PasswordPromptModalShown");
const Closed = m("PasswordPromptModalClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Dismiss" | "ToggleVisibility" | "Verify" }>
  | Readonly<{ _tag: "EmailInput" | "PasswordInput"; value: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowPasswordPromptModal = Command.define("ShowPasswordPromptModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const ClosePasswordPromptModal = Command.define("ClosePasswordPromptModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "Cancel" | "Dismiss" | "ToggleVisibility" | "Verify"): Message => ({
  _tag: tag,
});
const fieldInput = (tag: "EmailInput" | "PasswordInput", fieldValue: string): Message => ({
  _tag: tag,
  value: fieldValue,
});

const definition = {
  Args,
  Model,
  init: () =>
    [
      {
        email: "olivia@siglata.com",
        isOpen: true,
        isPasswordVisible: false,
        password: "12345678",
      } satisfies Model,
      [ShowPasswordPromptModal({ selector: "#password-prompt-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "EmailInput") {
      return [{ ...model, email: next.value }, []] as const;
    }
    if (next._tag === "PasswordInput") {
      return [{ ...model, password: next.value }, []] as const;
    }
    if (next._tag === "ToggleVisibility") {
      return [{ ...model, isPasswordVisible: !model.isPasswordVisible }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "PasswordPromptModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Cancel" || next._tag === "Dismiss" || next._tag === "Verify"
      ? ([
          updated,
          [ClosePasswordPromptModal({ selector: "#password-prompt-modal-story" })],
        ] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof passwordPromptModal<Message>>[1]) =>
    passwordPromptModal(
      {
        email: model.email,
        id: "password-prompt-modal-story",
        isOpen: model.isOpen,
        isPasswordVisible: model.isPasswordVisible,
        onCancel: action("Cancel"),
        onDismiss: action("Dismiss"),
        onEmailInput: (value) => fieldInput("EmailInput", value),
        onPasswordInput: (value) => fieldInput("PasswordInput", value),
        onPasswordVisibilityToggle: action("ToggleVisibility"),
        onVerify: action("Verify"),
        password: model.password,
      },
      h,
    ),
};

const meta = componentMeta("password-prompt-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Password Prompt Modal",
};
export const AllVariants = { ...liveCommandStory(definition), args: {} };
export const Dark = {
  ...liveCommandStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: {},
};
export const Responsive = { ...liveCommandStory(definition), args: {} };
export const Interactions = {
  ...liveCommandStory(definition),
  args: {},
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    let dialog = await page.findByRole("dialog", { name: "Please enter your password" });
    const email = within(dialog).getByRole("textbox", { name: "Email or username" });
    await userEvent.clear(email);
    await userEvent.type(email, "operator@siglata.com");
    dialog = await page.findByRole("dialog", { name: "Please enter your password" });
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Toggle password visibility" }),
    );
    dialog = await page.findByRole("dialog", { name: "Please enter your password" });
    await expect(within(dialog).getByLabelText("Password")).toHaveAttribute("type", "text");
    await userEvent.click(within(dialog).getByRole("button", { name: "Verify" }));
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#password-prompt-modal-story")).toBeNull(),
    );
  },
};
