/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-await-in-loop, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/imperative-loops -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { verificationCodeModal } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({
  code: S.String,
  isCodeFocused: S.Boolean,
  isCodeInvalid: S.Boolean,
  isOpen: S.Boolean,
  locale: Locale,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const Shown = m("VerificationCodeModalShown");
const Closed = m("VerificationCodeModalClosed");
type Message =
  | Readonly<{ _tag: "Blurred" | "Cancel" | "Dismiss" | "Focused" | "Resend" | "Verify" }>
  | Readonly<{ _tag: "CodeInput"; code: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowVerificationCodeModal = Command.define("ShowVerificationCodeModal", {
  args: { focusSelector: S.String, selector: S.String },
  execute: ({ focusSelector, selector }) =>
    Dom.showDialog(selector, { focusSelector }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseVerificationCodeModal = Command.define("CloseVerificationCodeModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (
  tag: "Blurred" | "Cancel" | "Dismiss" | "Focused" | "Resend" | "Verify",
): Message => ({ _tag: tag });
const codeInput = (code: string): Message => ({ _tag: "CodeInput", code });

const definitionWith = (
  initialCode: string,
  focusSelector: string,
  isCodeInvalid = false,
  acceptsCodeFocus = false,
) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      {
        code: initialCode,
        isCodeFocused: false,
        isCodeInvalid,
        isOpen: true,
        locale: args.locale,
      } satisfies Model,
      [
        ShowVerificationCodeModal({
          focusSelector,
          selector: "#verification-code-modal-story",
        }),
      ],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "CodeInput") {
      return [{ ...model, code: next.code }, []] as const;
    }
    if (next._tag === "Focused") {
      return [{ ...model, isCodeFocused: acceptsCodeFocus }, []] as const;
    }
    if (next._tag === "Blurred") {
      return [{ ...model, isCodeFocused: false }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "VerificationCodeModalClosed" ? false : model.isOpen,
    } satisfies Model;
    return next._tag === "Cancel" || next._tag === "Dismiss" || next._tag === "Verify"
      ? ([
          updated,
          [CloseVerificationCodeModal({ selector: "#verification-code-modal-story" })],
        ] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof verificationCodeModal<Message>>[1]) =>
    verificationCodeModal(
      {
        code: model.code,
        id: "verification-code-modal-story",
        isCodeFocused: model.isCodeFocused,
        isCodeInvalid: model.isCodeInvalid,
        isOpen: model.isOpen,
        locale: model.locale,
        onCancel: action("Cancel"),
        onCodeBlur: action("Blurred"),
        onCodeFocus: action("Focused"),
        onCodeInput: codeInput,
        onDismiss: action("Dismiss"),
        onResend: action("Resend"),
        onVerify: action("Verify"),
      },
      h,
    ),
});

const emptyDefinition = definitionWith("", "[data-verification-code-close]");
const partialDefinition = definitionWith("12", "[data-verification-code-close]");
const completeDefinition = definitionWith("1289", "[data-verification-code-close]");
const interactiveDefinition = definitionWith("", "[data-verification-code-close]", false, true);
const meta = componentMeta("verification-code-modal");
export default {
  ...meta,
  title: "Untitled UI/Application/Verification Code Modal",
};
export const AllVariants = { ...liveCommandStory(emptyDefinition), args: { locale: "en-US" } };
export const States = { ...liveCommandStory(partialDefinition), args: { locale: "en-US" } };
export const Dark = {
  ...liveCommandStory({
    ...completeDefinition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [completeDefinition.view(model, h)],
      ),
  }),
  args: { locale: "en-US" },
};
export const Responsive = { ...liveCommandStory(emptyDefinition), args: { locale: "pt-BR" } };
export const Interactions = {
  ...liveCommandStory(interactiveDefinition),
  args: { locale: "en-US" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const currentDialog = async () =>
      await page.findByRole("dialog", { name: "Please check your email." });
    const currentCode = async () =>
      await within(await currentDialog()).findByRole("textbox", { name: "Enter your pin" });

    await userEvent.click(await currentCode());
    await expect(await currentCode()).toHaveFocus();
    await userEvent.type(await currentCode(), "9876");
    await waitFor(async () => {
      await expect(await currentCode()).toHaveValue("9876");
    });

    let dialog = await currentDialog();
    await userEvent.click(within(dialog).getByRole("button", { name: "Click to resend" }));
    dialog = await currentDialog();
    await expect(await currentCode()).toHaveValue("9876");
    await expect(within(dialog).getByRole("button", { name: "Verify" })).toBeVisible();
    await userEvent.click(await currentCode());
    await expect(await currentCode()).toHaveFocus();
  },
};
