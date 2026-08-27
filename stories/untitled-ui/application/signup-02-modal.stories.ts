/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { signup02Modal } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

/** Stable demo identity slot: png-free inline SVG rounded square a host swaps for its own mark. */
const demoMark =
  "data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2048%2048'%3E%3Crect%20width%3D'48'%20height%3D'48'%20rx%3D'12'%20fill%3D'%23C7CEDA'%2F%3E%3C%2Fsvg%3E";
const demoMarkAlt = "Product logo";

const Args = S.Struct({});
const Model = S.Struct({ email: S.String, isOpen: S.Boolean });
type Model = typeof Model.Type;
const Shown = m("Signup02ModalShown");
const Closed = m("Signup02ModalClosed");
type Message =
  | Readonly<{
      _tag: "AppleSignup" | "Dismiss" | "FacebookSignup" | "GoogleSignup" | "Submit";
    }>
  | Readonly<{ _tag: "EmailInput"; value: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowSignup02Modal = Command.define("ShowSignup02Modal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseSignup02Modal = Command.define("CloseSignup02Modal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (
  tag: "AppleSignup" | "Dismiss" | "FacebookSignup" | "GoogleSignup" | "Submit",
): Message => ({ _tag: tag });
const emailInput = (email: string): Message => ({ _tag: "EmailInput", value: email });

const makeDefinition = (email: string) => ({
  Args,
  Model,
  init: () =>
    [
      { email, isOpen: true } satisfies Model,
      [ShowSignup02Modal({ selector: "#signup-02-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "EmailInput") {
      return [{ ...model, email: next.value }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "Signup02ModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Dismiss" || next._tag === "Submit"
      ? ([updated, [CloseSignup02Modal({ selector: "#signup-02-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof signup02Modal<Message>>[1]) =>
    signup02Modal(
      {
        email: model.email,
        id: "signup-02-modal-story",
        isOpen: model.isOpen,
        onAppleSignup: action("AppleSignup"),
        onDismiss: action("Dismiss"),
        onEmailInput: emailInput,
        onFacebookSignup: action("FacebookSignup"),
        onGoogleSignup: action("GoogleSignup"),
        onSubmit: action("Submit"),
        wordmarkAlt: demoMarkAlt,
        wordmarkSrc: demoMark,
      },
      h,
    ),
});

const definition = makeDefinition("");
const meta = componentMeta("signup-02-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Signup 02 Modal",
};
export const AllVariants = { ...liveCommandStory(definition), args: {} };
export const States = {
  ...liveCommandStory(makeDefinition("operator@siglata.com")),
  args: {},
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
  args: {},
};
export const Responsive = { ...liveCommandStory(definition), args: {} };
export const Interactions = {
  ...liveCommandStory(makeDefinition("operator@siglata.com")),
  args: {},
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    let dialog = await page.findByRole("dialog", { name: "Create an account" });
    const email = within(dialog).getByRole("textbox", { name: "Email" });
    await expect(email).toHaveValue("operator@siglata.com");
    await expect(email).toBeValid();

    dialog = await page.findByRole("dialog", { name: "Create an account" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Sign up with Google" }));
    await userEvent.click(within(dialog).getByRole("button", { name: "Get started" }));
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#signup-02-modal-story")).toBeNull(),
    );
  },
};
