/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-hardcoded-secrets, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions use inert upstream card fixtures and native dialog commands. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { paymentDetailsModal } from "../../../src/application.ts";
import type { PaymentDetailsField } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({
  card: S.String,
  cvv: S.String,
  expiry: S.String,
  isCvvFocused: S.Boolean,
  isOpen: S.Boolean,
  name: S.String,
});
type Model = typeof Model.Type;
const Shown = m("PaymentDetailsModalShown");
const Closed = m("PaymentDetailsModalClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "CvvBlur" | "CvvFocus" | "Dismiss" | "Update" }>
  | Readonly<{ _tag: "FieldInput"; field: PaymentDetailsField; value: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowPaymentDetailsModal = Command.define("ShowPaymentDetailsModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const ClosePaymentDetailsModal = Command.define("ClosePaymentDetailsModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "Cancel" | "CvvBlur" | "CvvFocus" | "Dismiss" | "Update"): Message => ({
  _tag: tag,
});
const fieldInput = (field: PaymentDetailsField, fieldValue: string): Message => ({
  _tag: "FieldInput",
  field,
  value: fieldValue,
});
const digits = (fieldValue: string): string => fieldValue.replaceAll(/\D/gu, "");
const formatCard = (fieldValue: string): string =>
  (
    digits(fieldValue)
      .slice(0, 16)
      .match(/\d{1,4}/gu) ?? []
  ).join(" ");
const formatExpiry = (fieldValue: string): string => {
  const compact = digits(fieldValue).slice(0, 6);
  return compact.length > 2 ? `${compact.slice(0, 2)} / ${compact.slice(2)}` : compact;
};
const formatField = (field: PaymentDetailsField, fieldValue: string): string => {
  if (field === "card") {
    return formatCard(fieldValue);
  }
  if (field === "expiry") {
    return formatExpiry(fieldValue);
  }
  if (field === "cvv") {
    return digits(fieldValue).slice(0, 3);
  }
  return fieldValue;
};

const definition = {
  Args,
  Model,
  init: () =>
    [
      {
        card: "1234 1234 1234 1234",
        cvv: "123",
        expiry: "06 / 2028",
        isCvvFocused: false,
        isOpen: true,
        name: "Olivia Rhye",
      } satisfies Model,
      [ShowPaymentDetailsModal({ selector: "#payment-details-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "FieldInput") {
      const value = formatField(next.field, next.value);
      return [{ ...model, [next.field]: value }, []] as const;
    }
    if (next._tag === "CvvFocus") {
      return [{ ...model, isCvvFocused: true }, []] as const;
    }
    if (next._tag === "CvvBlur") {
      return [{ ...model, isCvvFocused: false }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "PaymentDetailsModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Cancel" || next._tag === "Dismiss" || next._tag === "Update"
      ? ([
          updated,
          [ClosePaymentDetailsModal({ selector: "#payment-details-modal-story" })],
        ] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof paymentDetailsModal<Message>>[1]) =>
    paymentDetailsModal(
      {
        card: model.card,
        cvv: model.cvv,
        expiry: model.expiry,
        id: "payment-details-modal-story",
        isCvvFocused: model.isCvvFocused,
        isOpen: model.isOpen,
        name: model.name,
        onCancel: action("Cancel"),
        onCvvBlur: action("CvvBlur"),
        onCvvFocus: action("CvvFocus"),
        onDismiss: action("Dismiss"),
        onFieldInput: fieldInput,
        onUpdate: action("Update"),
      },
      h,
    ),
};

const meta = componentMeta("payment-details-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Payment Details Modal",
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
    let dialog = await page.findByRole("dialog", { name: "Update payment method" });
    const card = within(dialog).getByRole("textbox", { name: "Card number" });
    await userEvent.clear(card);
    await userEvent.type(card, "4242424242424242");
    dialog = await page.findByRole("dialog", { name: "Update payment method" });
    await expect(within(dialog).getByDisplayValue("4242 4242 4242 4242")).toBeVisible();
    const cvv = within(dialog).getByLabelText("CVV");
    await userEvent.click(cvv);
    await waitFor(() => expect(page.getByLabelText("CVV")).toHaveAttribute("type", "tel"));
    await userEvent.tab();
    await waitFor(() => expect(page.getByLabelText("CVV")).toHaveAttribute("type", "password"));
    await userEvent.click(page.getByRole("button", { name: "Update" }));
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#payment-details-modal-story")).toBeNull(),
    );
  },
};
