/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { orderSummaryMenu } from "../../../src/application.ts";
import type { ShippingMethodId } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, liveCommandStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({ locale: S.Literals(["en-US", "pt-BR"]) });
const Model = S.Struct({
  focusedShippingId: S.String,
  isCopied: S.Boolean,
  isOpen: S.Boolean,
  isShippingOpen: S.Boolean,
  locale: S.Literals(["en-US", "pt-BR"]),
  selectedShippingId: S.Literals(["express-post", "standard-post", "pickup"]),
});
type Model = typeof Model.Type;
const Shown = m("OrderSummaryShown");
const ShowFailed = m("OrderSummaryShowFailed");
const Closed = m("OrderSummaryClosed");
const CloseFailed = m("OrderSummaryCloseFailed");
type Message =
  | Readonly<{ _tag: "Checkout" | "Copy" | "Dismiss" | "Open" }>
  | Readonly<{ _tag: "ShippingFocus" | "ShippingSelect"; shippingId: ShippingMethodId }>
  | Readonly<{ _tag: "ShippingOpenChanged"; isOpen: boolean }>
  | typeof Shown.Type
  | typeof ShowFailed.Type
  | typeof Closed.Type
  | typeof CloseFailed.Type;

const ShowOrderSummaryMenu = Command.define("ShowOrderSummaryMenu", {
  args: { returnFocusSelector: S.String, selector: S.String },
  execute: ({ returnFocusSelector, selector }) =>
    Dom.focus(returnFocusSelector).pipe(
      Effect.andThen(
        Dom.showDialog(selector, { focusSelector: "[aria-label='Close slideout menu']" }),
      ),
      Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() }),
    ),
  messages: [Shown, ShowFailed],
});
const CloseOrderSummaryMenu = Command.define("CloseOrderSummaryMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed, CloseFailed],
});
const action = (tag: "Checkout" | "Copy" | "Dismiss" | "Open"): Message => ({ _tag: tag });
const shippingFocus = (shippingId: ShippingMethodId): Message => ({
  _tag: "ShippingFocus",
  shippingId,
});
const shippingOpenChanged = (isOpen: boolean): Message => ({
  _tag: "ShippingOpenChanged",
  isOpen,
});
const shippingSelect = (shippingId: ShippingMethodId): Message => ({
  _tag: "ShippingSelect",
  shippingId,
});

const definition = (initiallyOpen = true, initiallyCopied = false) => ({
  Args,
  Model,
  init: (args: typeof Args.Type) =>
    [
      {
        focusedShippingId: "express-post",
        isCopied: initiallyCopied,
        isOpen: initiallyOpen,
        isShippingOpen: false,
        locale: args.locale,
        selectedShippingId: "express-post",
      },
      initiallyOpen
        ? [
            ShowOrderSummaryMenu({
              returnFocusSelector: "#order-summary-trigger",
              selector: "#order-summary-story",
            }),
          ]
        : [],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "Copy") {
      return [{ ...model, isCopied: true }, []] as const;
    }
    if (next._tag === "ShippingFocus") {
      return [{ ...model, focusedShippingId: next.shippingId }, []] as const;
    }
    if (next._tag === "ShippingOpenChanged") {
      return [{ ...model, isShippingOpen: next.isOpen }, []] as const;
    }
    if (next._tag === "ShippingSelect") {
      return [{ ...model, selectedShippingId: next.shippingId }, []] as const;
    }
    if (next._tag === "Open") {
      return [
        { ...model, isOpen: true },
        [
          ShowOrderSummaryMenu({
            returnFocusSelector: "#order-summary-trigger",
            selector: "#order-summary-story",
          }),
        ],
      ] as const;
    }
    if (next._tag === "Dismiss" || next._tag === "Checkout") {
      return [model, [CloseOrderSummaryMenu({ selector: "#order-summary-story" })]] as const;
    }
    if (next._tag === "OrderSummaryClosed") {
      return [{ ...model, isOpen: false }, []] as const;
    }
    if (next._tag === "OrderSummaryShowFailed" || next._tag === "OrderSummaryCloseFailed") {
      return [{ ...model, isOpen: false }, []] as const;
    }
    return [model, []] as const;
  },
  view: (model: Model, h: Parameters<typeof orderSummaryMenu<Message>>[1]) =>
    h.div(
      [],
      [
        h.button(
          [
            h.Class(
              model.isOpen
                ? "sr-only"
                : "rounded-lg bg-bg-brand-solid px-3 py-2 text-sm font-semibold text-text-primary-on-brand",
            ),
            h.Id("order-summary-trigger"),
            h.OnClick(action("Open")),
            h.Type("button"),
          ],
          ["Open order summary"],
        ),
        orderSummaryMenu(
          {
            copied: model.isCopied,
            discountCode: "FRIENDS",
            id: "order-summary-story",
            isOpen: model.isOpen,
            locale: model.locale,
            onCheckout: action("Checkout"),
            onCopyDiscount: action("Copy"),
            onDismiss: action("Dismiss"),
            onShippingFocus: shippingFocus,
            onShippingOpenChanged: shippingOpenChanged,
            onShippingSelect: shippingSelect,
            selectedShippingId: model.selectedShippingId,
          },
          h,
        ),
      ],
    ),
});

const defaultDefinition = definition();
const meta = componentMeta("order-summary-menu");
export default {
  ...meta,
  argTypes: { locale: { control: "inline-radio", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/Order Summary Menu",
};
export const AllVariants = { ...liveCommandStory(defaultDefinition), args: { locale: "en-US" } };
export const States = { ...liveCommandStory(definition(true, true)), args: { locale: "en-US" } };
export const Dark = {
  ...liveCommandStory({
    ...defaultDefinition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [defaultDefinition.view(model, h)],
      ),
  }),
  args: { locale: "en-US" },
};
export const Responsive = { ...liveCommandStory(defaultDefinition), args: { locale: "en-US" } };
export const Interactions = {
  ...liveCommandStory(definition(false)),
  args: { locale: "en-US" },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = page.getByRole("button", { name: "Open order summary" });
    await userEvent.click(trigger);
    let dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    const close = within(dialog).getByRole("button", { name: "Close slideout menu" });
    await expect(close).toHaveFocus();
    await userEvent.click(within(dialog).getByRole("button", { name: /Shipping method/u }));
    await userEvent.tab();
    await expect(await page.findByRole("option", { name: /Express post/u })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await expect(within(dialog).getByRole("button", { name: "Shipping method" })).toHaveTextContent(
      "Standard post",
    );
    await userEvent.click(within(dialog).getByRole("button", { name: "Copy discount code" }));
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await expect(
      await within(dialog).findByRole(
        "button",
        { name: "Discount code copied" },
        { timeout: 5000 },
      ),
    ).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument(), {
      timeout: 5000,
    });
    await expect(trigger).toHaveFocus();
  },
};
