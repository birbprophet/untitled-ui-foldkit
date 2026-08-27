/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-hardcoded-secrets, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions use inert upstream card fixtures and native dialog commands. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { paymentDetailsWithImageModal } from "../../../src/application.ts";
import type { PaymentDetailsField } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

/** Stable demo card lockup: png-free inline SVG a host swaps for its own brand. */
const demoWordmark =
  "data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20100%2020'%3E%3Crect%20width%3D'20'%20height%3D'20'%20rx%3D'6'%20fill%3D'%23C7CEDA'%2F%3E%3Crect%20x%3D'28'%20y%3D'7'%20width%3D'72'%20height%3D'6'%20rx%3D'3'%20fill%3D'%23DDE2EA'%2F%3E%3C%2Fsvg%3E";

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
const Shown = m("PaymentDetailsWithImageModalShown");
const Closed = m("PaymentDetailsWithImageModalClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "CvvBlur" | "CvvFocus" | "Dismiss" | "Update" }>
  | Readonly<{ _tag: "FieldInput"; field: PaymentDetailsField; value: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowPaymentDetailsWithImageModal = Command.define("ShowPaymentDetailsWithImageModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: `${selector}-focus` }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const ClosePaymentDetailsWithImageModal = Command.define("ClosePaymentDetailsWithImageModal", {
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
      [ShowPaymentDetailsWithImageModal({ selector: "#payment-details-with-image-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "FieldInput") {
      return [{ ...model, [next.field]: formatField(next.field, next.value) }, []] as const;
    }
    if (next._tag === "CvvFocus") {
      return [{ ...model, isCvvFocused: true }, []] as const;
    }
    if (next._tag === "CvvBlur") {
      return [{ ...model, isCvvFocused: false }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "PaymentDetailsWithImageModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Cancel" || next._tag === "Dismiss" || next._tag === "Update"
      ? ([
          updated,
          [
            ClosePaymentDetailsWithImageModal({
              selector: "#payment-details-with-image-modal-story",
            }),
          ],
        ] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof paymentDetailsWithImageModal<Message>>[1]) =>
    paymentDetailsWithImageModal(
      {
        card: model.card,
        cvv: model.cvv,
        expiry: model.expiry,
        id: "payment-details-with-image-modal-story",
        isCvvFocused: model.isCvvFocused,
        isOpen: model.isOpen,
        name: model.name,
        onCancel: action("Cancel"),
        onCvvBlur: action("CvvBlur"),
        onCvvFocus: action("CvvFocus"),
        onDismiss: action("Dismiss"),
        onFieldInput: fieldInput,
        onUpdate: action("Update"),
        wordmarkSrc: demoWordmark,
      },
      h,
    ),
};

const meta = componentMeta("payment-details-with-image-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Payment Details With Image Modal",
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
    const name = within(dialog).getByRole("textbox", { name: "Name on card" });
    await userEvent.clear(name);
    await userEvent.type(name, "Maya Chen");
    dialog = await page.findByRole("dialog", { name: "Update payment method" });
    await expect(within(dialog).getByDisplayValue("Maya Chen")).toBeVisible();
    const cvv = within(dialog).getByLabelText("CVV");
    await userEvent.click(cvv);
    await waitFor(() => expect(page.getByLabelText("CVV")).toHaveAttribute("type", "tel"));
    await userEvent.click(page.getByRole("button", { name: "Update" }));
    await waitFor(() =>
      expect(
        canvasElement.ownerDocument.querySelector("#payment-details-with-image-modal-story"),
      ).toBeNull(),
    );
  },
};
