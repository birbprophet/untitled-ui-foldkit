/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noGlobals, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- The certification story exercises the controlled authenticated slideout lifecycle. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { paymentDetailsMenu } from "../../../../../packages/ui/src/application/payment-details-menu.ts";
import type { PaymentDetailsMenuField } from "../../../../../packages/ui/src/application/payment-details-menu.ts";

import { componentMeta, liveCommandStory, waitForStoryReady } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({
  billingEmail: S.String,
  card: S.String,
  cvv: S.String,
  expiry: S.String,
  locale: Locale,
  name: S.String,
});
const Model = S.Struct({
  billingEmail: S.String,
  card: S.String,
  cvv: S.String,
  expiry: S.String,
  isCvvVisible: S.Boolean,
  isOpen: S.Boolean,
  locale: Locale,
  name: S.String,
  shouldRestoreFocus: S.Boolean,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;

const Shown = m("PaymentDetailsMenuShown");
const ShowFailed = m("PaymentDetailsMenuShowFailed");
const Closed = m("PaymentDetailsMenuClosed");
const CloseFailed = m("PaymentDetailsMenuCloseFailed");
const CloseFinished = m("PaymentDetailsMenuCloseFinished");
const CloseFinishFailed = m("PaymentDetailsMenuCloseFinishFailed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Confirm" | "Dismiss" | "Open" | "ToggleCvv" }>
  | Readonly<{ _tag: "FieldInput"; field: PaymentDetailsMenuField; value: string }>
  | typeof Shown.Type
  | typeof ShowFailed.Type
  | typeof Closed.Type
  | typeof CloseFailed.Type
  | typeof CloseFinished.Type
  | typeof CloseFinishFailed.Type;

const ShowPaymentDetailsMenu = Command.define("ShowPaymentDetailsMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Effect.gen(function* execute() {
      yield* Dom.showDialog(selector, { focusSelector: "[data-payment-details-menu-close]" });
      yield* Effect.sync(() => {
        const dialog = document.querySelector<HTMLDialogElement>(selector);
        if (dialog !== null) {
          dialog.style.inset = "0 0 0 auto";
        }
      });
      yield* Dom.lockScroll;
      yield* Dom.inertOthers("payment-details-menu-story", [selector]);
    }).pipe(Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() })),
  messages: [Shown, ShowFailed],
});

const ClosePaymentDetailsMenu = Command.define("ClosePaymentDetailsMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed, CloseFailed],
});

const FinishPaymentDetailsMenuClose = Command.define("FinishPaymentDetailsMenuClose", {
  args: { shouldRestoreFocus: S.Boolean },
  execute: ({ shouldRestoreFocus }) =>
    Effect.gen(function* execute() {
      yield* Dom.restoreInert("payment-details-menu-story");
      yield* Dom.unlockScroll;
      if (shouldRestoreFocus) {
        yield* Dom.focus("[data-payment-details-menu-trigger]");
      }
    }).pipe(
      Effect.match({ onFailure: () => CloseFinishFailed(), onSuccess: () => CloseFinished() }),
    ),
  messages: [CloseFinished, CloseFinishFailed],
});

const action = (tag: "Cancel" | "Confirm" | "Dismiss" | "Open" | "ToggleCvv"): Message => ({
  _tag: tag,
});
const fieldInput = (field: PaymentDetailsMenuField, fieldValue: string): Message => ({
  _tag: "FieldInput",
  field,
  value: fieldValue,
});

const definition = (showTrigger = false) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      {
        ...args,
        isCvvVisible: false,
        isOpen: !showTrigger,
        shouldRestoreFocus: showTrigger,
      } satisfies Model,
      showTrigger ? [] : [ShowPaymentDetailsMenu({ selector: "#payment-details-menu-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "Open") {
      return [
        { ...model, isOpen: true },
        [ShowPaymentDetailsMenu({ selector: "#payment-details-menu-story" })],
      ] as const;
    }
    if (message._tag === "FieldInput") {
      return [{ ...model, [message.field]: message.value }, []] as const;
    }
    if (message._tag === "ToggleCvv") {
      return [{ ...model, isCvvVisible: !model.isCvvVisible }, []] as const;
    }
    if (message._tag === "Cancel" || message._tag === "Confirm" || message._tag === "Dismiss") {
      return [
        model,
        [ClosePaymentDetailsMenu({ selector: "#payment-details-menu-story" })],
      ] as const;
    }
    if (
      message._tag === "PaymentDetailsMenuClosed" ||
      message._tag === "PaymentDetailsMenuCloseFailed"
    ) {
      return [
        { ...model, isOpen: false },
        [FinishPaymentDetailsMenuClose({ shouldRestoreFocus: model.shouldRestoreFocus })],
      ] as const;
    }
    if (message._tag === "PaymentDetailsMenuShowFailed") {
      return [{ ...model, isOpen: false }, []] as const;
    }
    return [model, []] as const;
  },
  view: (model: Model, h: Parameters<typeof paymentDetailsMenu<Message>>[1]) =>
    h.div(
      [h.Class("min-h-24")],
      [
        ...(showTrigger
          ? [
              h.button(
                [
                  h.Class(
                    model.isOpen
                      ? "pointer-events-none opacity-0"
                      : "rounded-lg bg-brand-solid px-4 py-2.5 text-sm font-semibold text-white shadow-xs outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.DataAttribute("payment-details-menu-trigger", ""),
                  h.OnClick(action("Open")),
                  h.Type("button"),
                ],
                [model.locale === "pt-BR" ? "Abrir detalhes do pagamento" : "Open payment details"],
              ),
            ]
          : []),
        paymentDetailsMenu(
          {
            billingEmail: model.billingEmail,
            card: model.card,
            cvv: model.cvv,
            expiry: model.expiry,
            id: "payment-details-menu-story",
            isCvvVisible: model.isCvvVisible,
            isOpen: model.isOpen,
            locale: model.locale,
            name: model.name,
            onCancel: action("Cancel"),
            onConfirm: action("Confirm"),
            onDismiss: action("Dismiss"),
            onFieldInput: fieldInput,
            onToggleCvv: action("ToggleCvv"),
          },
          h,
        ),
      ],
    ),
});

const upstreamFixture = {
  billingEmail: "accounts@siglata.com",
  card: "1234 1234 1234 1234",
  cvv: "123",
  expiry: "06 / 2028",
  locale: "en-US",
  name: "Olivia Rhye",
} as const satisfies Args;
const discoverFixture = {
  ...upstreamFixture,
  card: "6011 1111 1111 1117",
} as const satisfies Args;
const mastercardFixture = {
  ...upstreamFixture,
  card: "5555 5555 5555 4444",
} as const satisfies Args;
const amexFixture = {
  ...upstreamFixture,
  card: "3782 8224 6310 005",
} as const satisfies Args;
const interactionFixture = {
  ...upstreamFixture,
  card: "4242 4242 4242 4242",
} as const satisfies Args;

export default {
  ...componentMeta("payment-details-menu"),
  argTypes: {
    billingEmail: { control: "text" },
    card: { control: "text" },
    cvv: { control: "text" },
    expiry: { control: "text" },
    locale: { control: "select", options: ["en-US", "pt-BR"] },
    name: { control: "text" },
  },
  title: "Untitled UI/Application/Payment Details Menu",
};

export const AllVariants = { ...liveCommandStory(definition()), args: upstreamFixture };
export const States = { ...liveCommandStory(definition()), args: discoverFixture };
export const Dark = {
  ...liveCommandStory({
    ...definition(),
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition().view(model, h)],
      ),
  }),
  args: mastercardFixture,
};
export const Responsive = { ...liveCommandStory(definition()), args: amexFixture };
export const Interactions = {
  ...liveCommandStory(definition(true)),
  args: interactionFixture,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = await page.findByRole("button", { name: "Open payment details" });
    const existingDialog = page.queryByRole("dialog", { name: "Payment details" });
    if (existingDialog !== null) {
      await userEvent.click(
        within(existingDialog).getByRole("button", { name: "Close slideout menu" }),
      );
    }
    await waitFor(
      () => expect(page.queryByRole("dialog", { name: "Payment details" })).toBeNull(),
      { timeout: 15_000 },
    );
    await waitFor(() => expect(trigger).not.toHaveClass("pointer-events-none"), {
      timeout: 15_000,
    });

    await userEvent.click(trigger);
    let dialog = await page.findByRole("dialog", { name: "Payment details" }, { timeout: 15_000 });
    await expect(dialog).toHaveAttribute("dir", "ltr");
    await expect(dialog).toHaveAttribute("lang", "en-US");
    await expect(within(dialog).getByRole("button", { name: "Close slideout menu" })).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await waitFor(
      () => expect(page.queryByRole("dialog", { name: "Payment details" })).toBeNull(),
      { timeout: 15_000 },
    );
    await waitFor(() => expect(trigger).not.toHaveClass("pointer-events-none"), {
      timeout: 15_000,
    });
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    dialog = await page.findByRole("dialog", { name: "Payment details" }, { timeout: 15_000 });
    const backdrop = canvasElement.ownerDocument.querySelector<HTMLElement>(
      "[data-payment-details-menu-backdrop]",
    );
    await expect(backdrop).not.toBeNull();
    if (backdrop !== null) {
      await userEvent.click(backdrop);
    }
    await waitFor(
      () => expect(page.queryByRole("dialog", { name: "Payment details" })).toBeNull(),
      { timeout: 15_000 },
    );
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    dialog = await page.findByRole("dialog", { name: "Payment details" }, { timeout: 15_000 });
    const card = within(dialog).getByRole("textbox", { name: "Card number" });
    await userEvent.clear(card);
    await userEvent.type(card, "4242424242424242");
    await waitFor(() =>
      expect(within(dialog).getByDisplayValue("4242 4242 4242 4242")).toBeVisible(),
    );
    await waitFor(() =>
      expect(dialog.querySelector('[data-payment-card-brand="visa"]')).toBeVisible(),
    );

    await userEvent.clear(within(dialog).getByRole("textbox", { name: "Card number" }));
    await userEvent.type(
      within(dialog).getByRole("textbox", { name: "Card number" }),
      "378282246310005",
    );
    await waitFor(() =>
      expect(dialog.querySelector('[data-payment-card-brand="amex"]')).toBeVisible(),
    );

    await userEvent.clear(within(dialog).getByRole("textbox", { name: "Card number" }));
    await userEvent.type(
      within(dialog).getByRole("textbox", { name: "Card number" }),
      "6011111111111117",
    );
    await waitFor(() =>
      expect(dialog.querySelector('[data-payment-card-brand="discover"]')).toBeVisible(),
    );

    await userEvent.clear(within(dialog).getByRole("textbox", { name: "Card number" }));
    await userEvent.type(
      within(dialog).getByRole("textbox", { name: "Card number" }),
      "6212345678901234",
    );
    await waitFor(() =>
      expect(dialog.querySelector('[data-payment-card-brand="unionpay"]')).toBeVisible(),
    );

    const email = within(dialog).getByRole("textbox", { name: "Email address" });
    await userEvent.clear(email);
    await userEvent.type(email, "finance@siglata.com");
    await waitFor(() =>
      expect(within(dialog).getByDisplayValue("finance@siglata.com")).toBeVisible(),
    );

    const cvv = within(dialog).getByLabelText("CVV");
    await expect(cvv).toHaveAttribute("type", "password");
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Toggle password visibility" }),
    );
    await waitFor(() =>
      expect(within(dialog).getByLabelText("CVV")).toHaveAttribute("type", "text"),
    );
  },
};
