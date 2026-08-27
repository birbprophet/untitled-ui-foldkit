/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-hardcoded-secrets, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions use inert fixtures and native dialog commands. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { signup01Modal } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

/** Stable demo identity slot: png-free inline SVG rounded square a host swaps for its own mark. */
const demoMark =
  "data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2048%2048'%3E%3Crect%20width%3D'48'%20height%3D'48'%20rx%3D'12'%20fill%3D'%23C7CEDA'%2F%3E%3C%2Fsvg%3E";
const demoMarkAlt = "Product logo";

const Args = S.Struct({});
const Model = S.Struct({
  email: S.String,
  invalidFields: S.Array(S.Union([S.Literal("email"), S.Literal("name"), S.Literal("password")])),
  isOpen: S.Boolean,
  isPasswordVisible: S.Boolean,
  name: S.String,
  password: S.String,
});
type Model = typeof Model.Type;
type Signup01ModalField = Parameters<typeof signup01Modal<never>>[0]["invalidFields"][number];
const Shown = m("Signup01ModalShown");
const Closed = m("Signup01ModalClosed");
type Message =
  | Readonly<{ _tag: "Dismiss" | "GoogleSignIn" | "Submit" | "TogglePassword" }>
  | Readonly<{ _tag: "FieldInput"; field: Signup01ModalField; value: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowSignup01Modal = Command.define("ShowSignup01Modal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseSignup01Modal = Command.define("CloseSignup01Modal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "Dismiss" | "GoogleSignIn" | "Submit" | "TogglePassword"): Message => ({
  _tag: tag,
});
const fieldInput = (field: Signup01ModalField, fieldValue: string): Message => ({
  _tag: "FieldInput",
  field,
  value: fieldValue,
});
const invalidFields = (model: Model): readonly Signup01ModalField[] => [
  ...(model.name.trim() === "" ? (["name"] as const) : []),
  ...(model.email.includes("@") ? [] : (["email"] as const)),
  ...(model.password.length < 8 ? (["password"] as const) : []),
];
const isFormValid = (model: Model): boolean =>
  model.name.trim() !== "" && model.email.includes("@") && model.password.length >= 8;

const makeDefinition = (state: "empty" | "partial") => ({
  Args,
  Model,
  init: () => {
    const partial = state === "partial";
    return [
      {
        email: partial ? "olivia@siglata.com" : "",
        invalidFields: [],
        isOpen: true,
        isPasswordVisible: false,
        name: partial ? "Olivia Rhye" : "",
        password: partial ? "short" : "",
      },
      [ShowSignup01Modal({ selector: "#signup-01-modal-story" })],
    ] as const;
  },
  update: (model: Model, next: Message) => {
    if (next._tag === "FieldInput") {
      return [
        {
          ...model,
          [next.field]: next.value,
          invalidFields: model.invalidFields.filter((field) => field !== next.field),
        },
        [],
      ] as const;
    }
    if (next._tag === "TogglePassword") {
      return [{ ...model, isPasswordVisible: !model.isPasswordVisible }, []] as const;
    }
    if (next._tag === "Submit") {
      const invalid = invalidFields(model);
      return isFormValid(model)
        ? ([model, [CloseSignup01Modal({ selector: "#signup-01-modal-story" })]] as const)
        : ([{ ...model, invalidFields: invalid }, []] as const);
    }
    const updated = {
      ...model,
      isOpen: next._tag === "Signup01ModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Dismiss"
      ? ([updated, [CloseSignup01Modal({ selector: "#signup-01-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof signup01Modal<Message>>[1]) =>
    signup01Modal(
      {
        email: model.email,
        id: "signup-01-modal-story",
        invalidFields: model.invalidFields,
        isOpen: model.isOpen,
        isPasswordVisible: model.isPasswordVisible,
        name: model.name,
        onDismiss: action("Dismiss"),
        onFieldInput: fieldInput,
        onGoogleSignIn: action("GoogleSignIn"),
        onPasswordVisibilityToggle: action("TogglePassword"),
        onSubmit: action("Submit"),
        password: model.password,
        wordmarkAlt: demoMarkAlt,
        wordmarkSrc: demoMark,
      },
      h,
    ),
});

const definition = makeDefinition("empty");
const meta = componentMeta("signup-01-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Signup 01 Modal",
};
export const AllVariants = { ...liveCommandStory(definition), args: {} };
export const States = { ...liveCommandStory(makeDefinition("partial")), args: {} };
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
  ...liveCommandStory(makeDefinition("partial")),
  args: {},
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    let dialog = await page.findByRole("dialog", { name: "Sign up" });
    await expect(within(dialog).getByRole("textbox", { name: "Name" })).toHaveValue("Olivia Rhye");
    await expect(within(dialog).getByRole("textbox", { name: "Email" })).toHaveValue(
      "olivia@siglata.com",
    );
    dialog = await page.findByRole("dialog", { name: "Sign up" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Sign in" }));
    await waitFor(async () => {
      const invalidDialog = await page.findByRole("dialog", { name: "Sign up" });
      await expect(within(invalidDialog).getByText("Must be at least 8 characters.")).toHaveClass(
        "text-text-error-primary",
      );
    });
    dialog = await page.findByRole("dialog", { name: "Sign up" });
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Toggle password visibility" }),
    );
    await waitFor(async () => {
      const visiblePasswordDialog = await page.findByRole("dialog", { name: "Sign up" });
      await expect(within(visiblePasswordDialog).getByLabelText("Password")).toHaveAttribute(
        "type",
        "text",
      );
    });
    dialog = await page.findByRole("dialog", { name: "Sign up" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#signup-01-modal-story")).toBeNull(),
    );
  },
};
