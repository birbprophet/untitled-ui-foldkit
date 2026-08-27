/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { paymentMethodModal } from "ui/application";
import type { PaymentMethod } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Method = S.Literals(["mastercard", "visa-primary", "visa-secondary"]);
const Args = S.Struct({});
const Model = S.Struct({ isOpen: S.Boolean, selectedMethod: Method });
type Model = typeof Model.Type;
const Shown = m("PaymentMethodModalShown");
const Closed = m("PaymentMethodModalClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Confirm" | "Dismiss" }>
  | Readonly<{ _tag: "Edit" | "Select" | "SetDefault"; method: PaymentMethod }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowPaymentMethodModal = Command.define("ShowPaymentMethodModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const ClosePaymentMethodModal = Command.define("ClosePaymentMethodModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "Cancel" | "Confirm" | "Dismiss"): Message => ({ _tag: tag });
const methodAction = (tag: "Edit" | "Select" | "SetDefault", method: PaymentMethod): Message => ({
  _tag: tag,
  method,
});

const definition = {
  Args,
  Model,
  init: () =>
    [
      { isOpen: true, selectedMethod: "visa-primary" } satisfies Model,
      [ShowPaymentMethodModal({ selector: "#payment-method-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "Select" || next._tag === "SetDefault") {
      return [{ ...model, selectedMethod: next.method }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "PaymentMethodModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Cancel" || next._tag === "Confirm" || next._tag === "Dismiss"
      ? ([updated, [ClosePaymentMethodModal({ selector: "#payment-method-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof paymentMethodModal<Message>>[1]) =>
    paymentMethodModal(
      {
        id: "payment-method-modal-story",
        isOpen: model.isOpen,
        onCancel: action("Cancel"),
        onConfirm: action("Confirm"),
        onDismiss: action("Dismiss"),
        onEdit: (method) => methodAction("Edit", method),
        onSelect: (method) => methodAction("Select", method),
        onSetDefault: (method) => methodAction("SetDefault", method),
        selectedMethod: model.selectedMethod,
      },
      h,
    ),
};

const meta = componentMeta("payment-method-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Payment Method Modal",
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
    let dialog = await page.findByRole("dialog", { name: "Change your payment method" });
    const mastercard = within(dialog).getByRole("radio", { name: /Mastercard ending in 1234/u });
    await userEvent.click(mastercard);
    dialog = await page.findByRole("dialog", { name: "Change your payment method" });
    await expect(
      within(dialog).getByRole("radio", { name: /Mastercard ending in 1234/u }),
    ).toBeChecked();
    await userEvent.click(within(dialog).getByRole("button", { name: "Confirm" }));
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#payment-method-modal-story")).toBeNull(),
    );
  },
};
