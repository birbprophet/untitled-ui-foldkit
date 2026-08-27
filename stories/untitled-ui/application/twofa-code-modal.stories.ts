/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { twofaCodeModal } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({
  code: S.String,
  isCodeFocused: S.Boolean,
  isOpen: S.Boolean,
  isResent: S.Boolean,
  locale: Locale,
});
type Model = typeof Model.Type;
const Shown = m("TwofaCodeModalShown");
const Closed = m("TwofaCodeModalClosed");
type Message =
  | Readonly<{ _tag: "Blurred" | "Cancel" | "Confirm" | "Dismiss" | "Focused" | "Resend" }>
  | Readonly<{ _tag: "CodeInput"; code: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowTwofaCodeModal = Command.define("ShowTwofaCodeModal", {
  args: { focusSelector: S.String, selector: S.String },
  execute: ({ focusSelector, selector }) =>
    Dom.showDialog(selector, { focusSelector }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseTwofaCodeModal = Command.define("CloseTwofaCodeModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});

const action = (
  tag: "Blurred" | "Cancel" | "Confirm" | "Dismiss" | "Focused" | "Resend",
): Message => ({ _tag: tag });
const codeInput = (code: string): Message => ({ _tag: "CodeInput", code });

const definition = (initialCode: string, focusSelector: string) => ({
  Args,
  Model,
  init: (args: typeof Args.Type) =>
    [
      {
        code: initialCode,
        isCodeFocused: focusSelector.includes("-code"),
        isOpen: true,
        isResent: false,
        locale: args.locale,
      } satisfies Model,
      [
        ShowTwofaCodeModal({
          focusSelector,
          selector: "#twofa-code-modal-story",
        }),
      ],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "CodeInput") {
      return [{ ...model, code: next.code }, []] as const;
    }
    if (next._tag === "Focused") {
      return [{ ...model, isCodeFocused: true }, []] as const;
    }
    if (next._tag === "Blurred") {
      return [{ ...model, isCodeFocused: false }, []] as const;
    }
    if (next._tag === "Resend") {
      return [{ ...model, isResent: true }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "TwofaCodeModalClosed" ? false : model.isOpen,
    } satisfies Model;
    return next._tag === "Cancel" || next._tag === "Confirm" || next._tag === "Dismiss"
      ? ([updated, [CloseTwofaCodeModal({ selector: "#twofa-code-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof twofaCodeModal<Message>>[1]) =>
    twofaCodeModal(
      {
        code: model.code,
        id: "twofa-code-modal-story",
        isCodeFocused: model.isCodeFocused,
        isOpen: model.isOpen,
        locale: model.locale,
        onCancel: action("Cancel"),
        onCodeBlur: action("Blurred"),
        onCodeFocus: action("Focused"),
        onCodeInput: codeInput,
        onConfirm: action("Confirm"),
        onDismiss: action("Dismiss"),
        onResend: action("Resend"),
      },
      h,
    ),
});

const emptyDefinition = definition("", "[data-twofa-close]");
const partialDefinition = definition("128", "#twofa-code-modal-story-code");
const meta = componentMeta("twofa-code-modal");
export default {
  ...meta,
  argTypes: { locale: { control: "select", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/Two-factor Code Modal",
};
const fixture = { locale: "en-US" } as const;
export const AllVariants = { ...liveCommandStory(emptyDefinition), args: fixture };
export const States = { ...liveCommandStory(partialDefinition), args: fixture };
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
export const Responsive = { ...liveCommandStory(emptyDefinition), args: fixture };
export const Portuguese = {
  ...liveCommandStory(emptyDefinition),
  args: { locale: "pt-BR" } as const,
};
export const Interactions = {
  ...liveCommandStory(emptyDefinition),
  args: fixture,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const currentDialog = () =>
      page.findByRole("dialog", { name: "Set up two-factor authentication" });
    const currentCode = async () =>
      await within(await currentDialog()).findByRole("textbox", { name: "Verification code" });

    await userEvent.click(await currentCode());
    await expect(await currentCode()).toHaveFocus();
    await userEvent.type(await currentCode(), "1");
    await waitFor(async () => {
      await expect(await currentCode()).toHaveValue("1");
    });
    await userEvent.type(await currentCode(), "2");
    await waitFor(async () => {
      await expect(await currentCode()).toHaveValue("12");
    });
    await userEvent.type(await currentCode(), "a");
    await waitFor(async () => {
      await expect(await currentCode()).toHaveValue("12");
    });
    await userEvent.type(await currentCode(), "8");
    await waitFor(async () => {
      await expect(await currentCode()).toHaveValue("128");
    });

    await userEvent.clear(await currentCode());
    await userEvent.click(await currentCode());
    await expect(await currentCode()).toHaveFocus();
    await userEvent.paste("987654");
    await waitFor(async () => {
      await expect(await currentCode()).toHaveValue("987654");
    });

    let dialog = await currentDialog();
    await userEvent.click(within(dialog).getByRole("button", { name: "Click to resend" }));
    dialog = await currentDialog();
    await expect(within(dialog).getByRole("button", { name: "Confirm" })).toBeVisible();
    await expect(await currentCode()).toHaveValue("987654");
    await userEvent.click(await currentCode());
    await expect(await currentCode()).toHaveFocus();
  },
};
