/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noGlobals, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- The certification story exercises the controlled native slideout lifecycle. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { paymentMethodMenu } from "../../../src/application/payment-method-menu.ts";
import type { PaymentMethodMenuCard } from "../../../src/application/payment-method-menu.ts";

import { componentMeta, liveCommandStory, waitForStoryReady } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Card = S.Literals(["card-1", "card-2", "card-3", "card-4"]);
const Args = S.Struct({ billingEmail: S.String, locale: Locale, selectedCard: Card });
const Model = S.Struct({
  billingEmail: S.String,
  isOpen: S.Boolean,
  locale: Locale,
  selectedCard: Card,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;

const Shown = m("PaymentMethodMenuShown");
const ShowFailed = m("PaymentMethodMenuShowFailed");
const Closed = m("PaymentMethodMenuClosed");
const CloseFailed = m("PaymentMethodMenuCloseFailed");
const CloseFinished = m("PaymentMethodMenuCloseFinished");
const CloseFinishFailed = m("PaymentMethodMenuCloseFinishFailed");
const Released = m("PaymentMethodMenuReleased");
type Message =
  | Readonly<{
      _tag: "AddPaymentMethod" | "Cancel" | "Confirm" | "Dismiss" | "Open" | "Unmount";
    }>
  | Readonly<{ _tag: "BillingEmailInput"; value: string }>
  | Readonly<{ _tag: "Edit" | "Select" | "SetDefault"; card: PaymentMethodMenuCard }>
  | typeof Shown.Type
  | typeof ShowFailed.Type
  | typeof Closed.Type
  | typeof CloseFailed.Type
  | typeof CloseFinished.Type
  | typeof CloseFinishFailed.Type
  | typeof Released.Type;

const ShowPaymentMethodMenu = Command.define("ShowPaymentMethodMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Effect.gen(function* execute() {
      yield* Dom.showDialog(selector, { focusSelector: "[data-payment-method-menu-close]" });
      yield* Effect.sync(() => {
        const dialog = document.querySelector<HTMLDialogElement>(selector);
        if (dialog !== null) {
          dialog.style.inset = "0 0 0 auto";
        }
      });
      yield* Dom.lockScroll;
      yield* Dom.inertOthers("payment-method-menu-story", [selector]);
    }).pipe(Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() })),
  messages: [Shown, ShowFailed],
});

const ClosePaymentMethodMenu = Command.define("ClosePaymentMethodMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed, CloseFailed],
});

const FinishPaymentMethodMenuClose = Command.define("FinishPaymentMethodMenuClose", {
  args: { focusSelector: S.String, restoreFocus: S.Boolean },
  execute: ({ focusSelector, restoreFocus }) =>
    Effect.gen(function* execute() {
      yield* Dom.restoreInert("payment-method-menu-story");
      yield* Dom.unlockScroll;
      if (restoreFocus) {
        yield* Dom.focus(focusSelector);
      }
    }).pipe(
      Effect.match({ onFailure: () => CloseFinishFailed(), onSuccess: () => CloseFinished() }),
    ),
  messages: [CloseFinished, CloseFinishFailed],
});

const ReleasePaymentMethodMenu = Command.define("ReleasePaymentMethodMenu", {
  args: { id: S.String },
  execute: ({ id }) =>
    Effect.all([Dom.releaseDialogResources(id), Dom.restoreInert(id)], { concurrency: 1 }).pipe(
      Effect.map(() => Released()),
    ),
  messages: [Released],
});

const action = (
  tag: "AddPaymentMethod" | "Cancel" | "Confirm" | "Dismiss" | "Open" | "Unmount",
): Message => ({ _tag: tag });
const cardAction = (
  tag: "Edit" | "Select" | "SetDefault",
  card: PaymentMethodMenuCard,
): Message => ({ _tag: tag, card });
const billingEmailInput = (billingEmail: string): Message => ({
  _tag: "BillingEmailInput",
  value: billingEmail,
});

const definition = (showTrigger = false) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      { ...args, isOpen: !showTrigger } satisfies Model,
      showTrigger ? [] : [ShowPaymentMethodMenu({ selector: "#payment-method-menu-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "Open") {
      return [
        { ...model, isOpen: true },
        [ShowPaymentMethodMenu({ selector: "#payment-method-menu-story" })],
      ] as const;
    }
    if (message._tag === "BillingEmailInput") {
      return [{ ...model, billingEmail: message.value }, []] as const;
    }
    if (message._tag === "Select") {
      return [{ ...model, selectedCard: message.card }, []] as const;
    }
    if (message._tag === "Cancel" || message._tag === "Confirm" || message._tag === "Dismiss") {
      return [model, [ClosePaymentMethodMenu({ selector: "#payment-method-menu-story" })]] as const;
    }
    if (message._tag === "Unmount") {
      return [model, [ReleasePaymentMethodMenu({ id: "payment-method-menu-story" })]] as const;
    }
    if (
      message._tag === "PaymentMethodMenuClosed" ||
      message._tag === "PaymentMethodMenuCloseFailed"
    ) {
      return [
        { ...model, isOpen: false },
        [
          FinishPaymentMethodMenuClose({
            focusSelector: "[data-payment-method-menu-trigger]",
            restoreFocus: showTrigger,
          }),
        ],
      ] as const;
    }
    if (message._tag === "PaymentMethodMenuShowFailed") {
      return [{ ...model, isOpen: false }, []] as const;
    }
    return [model, []] as const;
  },
  view: (model: Model, h: Parameters<typeof paymentMethodMenu<Message>>[1]) =>
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
                  h.DataAttribute("payment-method-menu-trigger", ""),
                  h.OnClick(action("Open")),
                  h.Type("button"),
                ],
                [model.locale === "pt-BR" ? "Abrir forma de pagamento" : "Open payment method"],
              ),
            ]
          : []),
        paymentMethodMenu(
          {
            billingEmail: model.billingEmail,
            id: "payment-method-menu-story",
            isOpen: model.isOpen,
            locale: model.locale,
            onAddPaymentMethod: action("AddPaymentMethod"),
            onBillingEmailInput: billingEmailInput,
            onCancel: action("Cancel"),
            onConfirm: action("Confirm"),
            onDismiss: action("Dismiss"),
            onEdit: (card) => cardAction("Edit", card),
            onSelect: (card) => cardAction("Select", card),
            onSetDefault: (card) => cardAction("SetDefault", card),
            onUnmount: action("Unmount"),
            selectedCard: model.selectedCard,
          },
          h,
        ),
      ],
    ),
});

const allVariants = {
  billingEmail: "accounts@siglata.com",
  locale: "en-US",
  selectedCard: "card-1",
} as const satisfies Args;
const states = { ...allVariants, selectedCard: "card-3" } as const satisfies Args;
const interaction = {
  billingEmail: "accounts@siglata.com",
  locale: "en-US",
  selectedCard: "card-1",
} as const satisfies Args;

export default {
  ...componentMeta("payment-method-menu"),
  argTypes: {
    billingEmail: { control: "text" },
    locale: { control: "select", options: ["en-US", "pt-BR"] },
    selectedCard: {
      control: "select",
      options: ["card-1", "card-2", "card-3", "card-4"],
    },
  },
  title: "Untitled UI/Application/Payment Method Menu",
};

export const AllVariants = { ...liveCommandStory(definition()), args: allVariants };
export const States = { ...liveCommandStory(definition()), args: states };
export const Dark = {
  ...liveCommandStory({
    ...definition(),
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition().view(model, h)],
      ),
  }),
  args: states,
};
export const Responsive = { ...liveCommandStory(definition()), args: allVariants };
export const Interactions = {
  ...liveCommandStory(definition(true)),
  args: interaction,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = await page.findByRole("button", { name: "Open payment method" });
    await userEvent.click(trigger);
    const dialog = await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 15_000 });
    await expect(dialog).toHaveAttribute("dir", "ltr");
    await expect(dialog).toHaveAttribute("lang", "en-US");
    await expect(within(dialog).getByRole("button", { name: "Close" })).toHaveFocus();

    const mastercard = within(dialog).getByRole("radio", { name: /Mastercard ending in 1234/u });
    mastercard.focus();
    await userEvent.keyboard(" ");
    await waitFor(() => expect(mastercard).toBeChecked());

    const email = within(dialog).getByRole("textbox", { name: /Email address/u });
    await userEvent.clear(email);
    await userEvent.type(email, "financeiro@siglata.com");
    await expect(email).toHaveValue("financeiro@siglata.com");

    await userEvent.click(within(dialog).getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(page.queryByRole("dialog", { name: "Slideout menu" })).toBeNull(), {
      timeout: 15_000,
    });
    await waitFor(() => expect(trigger).not.toHaveClass("pointer-events-none"), {
      timeout: 15_000,
    });
    await expect(trigger).toHaveFocus();
  },
};
