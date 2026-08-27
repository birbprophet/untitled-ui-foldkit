/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { loginModal } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({
  email: S.String,
  isOpen: S.Boolean,
  isRemembered: S.Boolean,
  password: S.String,
});
type Model = typeof Model.Type;
const Shown = m("LoginModalShown");
const Closed = m("LoginModalClosed");
type Message =
  | Readonly<{ _tag: "Dismiss" | "ForgotPassword" | "GoogleSignIn" | "RememberToggle" | "Submit" }>
  | Readonly<{ _tag: "EmailInput" | "PasswordInput"; value: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowLoginModal = Command.define("ShowLoginModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseLoginModal = Command.define("CloseLoginModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (
  tag: "Dismiss" | "ForgotPassword" | "GoogleSignIn" | "RememberToggle" | "Submit",
): Message => ({ _tag: tag });
const emailInput = (email: string): Message => ({ _tag: "EmailInput", value: email });
const passwordInput = (password: string): Message => ({ _tag: "PasswordInput", value: password });

const makeDefinition = (prefilled: boolean) => ({
  Args,
  Model,
  init: () =>
    [
      {
        email: prefilled ? "operator@siglata.com" : "",
        isOpen: true,
        isRemembered: prefilled,
        password: prefilled ? "correct-horse-battery-staple" : "",
      },
      [ShowLoginModal({ selector: "#login-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "EmailInput") {
      return [{ ...model, email: next.value }, []] as const;
    }
    if (next._tag === "PasswordInput") {
      return [{ ...model, password: next.value }, []] as const;
    }
    if (next._tag === "RememberToggle") {
      return [{ ...model, isRemembered: !model.isRemembered }, []] as const;
    }
    const updated = { ...model, isOpen: next._tag === "LoginModalClosed" ? false : model.isOpen };
    return next._tag === "Dismiss" || next._tag === "Submit"
      ? ([updated, [CloseLoginModal({ selector: "#login-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof loginModal<Message>>[1]) =>
    loginModal(
      {
        email: model.email,
        id: "login-modal-story",
        isOpen: model.isOpen,
        isRemembered: model.isRemembered,
        onDismiss: action("Dismiss"),
        onEmailInput: emailInput,
        onForgotPassword: action("ForgotPassword"),
        onGoogleSignIn: action("GoogleSignIn"),
        onPasswordInput: passwordInput,
        onRememberToggle: action("RememberToggle"),
        onSubmit: action("Submit"),
        password: model.password,
      },
      h,
    ),
});

const definition = makeDefinition(false);
const meta = componentMeta("login-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Login Modal",
};
export const AllVariants = { ...liveCommandStory(definition), args: {} };
export const States = { ...liveCommandStory(makeDefinition(true)), args: {} };
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
    const canvas = within(canvasElement.ownerDocument.body);
    const dialog = await canvas.findByRole("dialog", { name: "Log in to your account" });
    await userEvent.type(
      within(dialog).getByRole("textbox", { name: "Email" }),
      "operator@siglata.com",
    );
    await userEvent.type(within(dialog).getByLabelText("Password"), "not-a-real-password");
    await userEvent.click(within(dialog).getByRole("checkbox", { name: "Remember for 30 days" }));
    await expect(
      within(dialog).getByRole("checkbox", { name: "Remember for 30 days" }),
    ).toBeChecked();
    await userEvent.click(within(dialog).getByRole("button", { name: "Sign in" }));
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#login-modal-story")).toBeNull(),
    );
  },
};
