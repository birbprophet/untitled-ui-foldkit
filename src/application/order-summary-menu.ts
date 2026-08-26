/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the upstream order-summary anatomy and native selection behavior. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";
import { button } from "../base/button.ts";
import { input } from "../base/fields.ts";
import { select } from "../base/select.ts";
import { slideoutMenu } from "./slideout-menu.ts";

export type OrderSummaryLocale = "en-US" | "pt-BR";
export type ShippingMethodId = "express-post" | "standard-post" | "pickup";

export interface OrderSummaryMenuProps<Message> {
  readonly copied: boolean;
  readonly discountCode: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale: OrderSummaryLocale;
  readonly onCheckout: NoInfer<Message>;
  readonly onCopyDiscount: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onShippingFocus: (shippingId: ShippingMethodId) => NoInfer<Message>;
  readonly onShippingOpenChanged: (isOpen: boolean) => NoInfer<Message>;
  readonly onShippingSelect: (shippingId: ShippingMethodId) => NoInfer<Message>;
  readonly selectedShippingId: ShippingMethodId;
}

const copy = {
  "en-US": {
    checkout: "Continue to checkout",
    copied: "Discount code copied",
    copyDiscount: "Copy discount code",
    discount: "Discount",
    discountCode: "Discount code",
    express: "Express post",
    expressShipping: "Express shipping",
    items: "4 items",
    orderSummary: "Order summary",
    pickup: "Pickup",
    shipping: "Shipping method",
    standard: "Standard post",
    subtotal: "Subtotal",
  },
  "pt-BR": {
    checkout: "Continuar para o pagamento",
    copied: "Código de desconto copiado",
    copyDiscount: "Copiar código de desconto",
    discount: "Desconto",
    discountCode: "Código de desconto",
    express: "Entrega expressa",
    expressShipping: "Frete expresso",
    items: "4 itens",
    orderSummary: "Resumo do pedido",
    pickup: "Retirada",
    shipping: "Forma de entrega",
    standard: "Entrega padrão",
    subtotal: "Subtotal",
  },
} as const;

const actionIcon = <Message>(copied: boolean, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 20 20")],
    [
      h.path([
        h.D(
          copied
            ? "m4.5 10 3.5 3.5 7.5-7.5"
            : "M6.667 6.667V5A1.667 1.667 0 0 1 8.333 3.333H15A1.667 1.667 0 0 1 16.667 5v6.667A1.667 1.667 0 0 1 15 13.333h-1.667M5 6.667h6.667a1.667 1.667 0 0 1 1.666 1.666V15a1.667 1.667 0 0 1-1.666 1.667H5A1.667 1.667 0 0 1 3.333 15V8.333A1.667 1.667 0 0 1 5 6.667Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const shippingMethods = (
  labels: (typeof copy)[OrderSummaryLocale],
): readonly (readonly [ShippingMethodId, string, string])[] => [
  ["express-post", labels.express, "+$3.99"],
  ["standard-post", labels.standard, "+$1.99"],
  ["pickup", labels.pickup, "Free"],
];

export const orderSummaryMenu = <Message>(
  props: OrderSummaryMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const labels = copy[props.locale];
  const content = [
    h.section(
      [h.Class("flex items-center justify-between")],
      [
        badge(
          {
            adornment: "dot",
            color: "brand",
            label: labels.items,
            size: "md",
            type: "modern",
          },
          h,
        ),
        h.p([h.Class("text-xl font-semibold text-text-primary")], ["$49.00"]),
      ],
    ),
    h.span([h.AriaHidden(true), h.Class("h-px w-full bg-border-secondary")]),
    h.section(
      [h.Class("flex flex-col gap-4")],
      [
        select(
          {
            items: shippingMethods(labels).map(([id, label, supportingText]) => ({
              id,
              label,
              onFocus: props.onShippingFocus(id),
              onSelect: props.onShippingSelect(id),
              supportingText,
            })),
            label: labels.shipping,
            name: `${props.id}-shipping`,
            onOpenChanged: props.onShippingOpenChanged,
            selectedId: props.selectedShippingId,
            size: "md",
          },
          h,
        ),
        h.span(
          [h.Class("flex items-end gap-3")],
          [
            input(
              {
                isReadOnly: true,
                label: labels.discountCode,
                name: `${props.id}-discount`,
                onInput: () => props.onCopyDiscount,
                size: "md",
                value: props.discountCode,
              },
              h,
            ),
            h.button(
              [
                h.AriaLabel(props.copied ? labels.copied : labels.copyDiscount),
                h.Class(
                  "relative inline-flex cursor-pointer items-center justify-center rounded-lg bg-bg-primary p-2.5 text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                ),
                h.DataAttribute("order-summary-copy", props.copied ? "copied" : "ready"),
                h.OnClick(props.onCopyDiscount),
                h.Type("button"),
              ],
              [actionIcon(props.copied, h)],
            ),
          ],
        ),
      ],
    ),
    h.span([h.AriaHidden(true), h.Class("w-full border-t border-border-secondary")]),
    h.section(
      [h.Class("flex flex-col gap-4")],
      [
        h.span(
          [h.Class("flex items-center justify-between")],
          [
            h.span(
              [h.Class("flex items-center gap-2")],
              [
                h.p([h.Class("text-sm font-medium text-text-secondary")], [labels.discount]),
                badge({ color: "gray", label: props.discountCode, size: "md", type: "modern" }, h),
              ],
            ),
            h.p([h.Class("text-sm text-text-tertiary")], ["10% ($4.90)"]),
          ],
        ),
        h.span(
          [h.Class("flex items-center justify-between")],
          [
            h.p([h.Class("text-sm font-medium text-text-secondary")], [labels.expressShipping]),
            h.p([h.Class("text-sm text-text-tertiary")], ["$3.99"]),
          ],
        ),
        h.span(
          [h.Class("flex items-center justify-between")],
          [
            h.p([h.Class("text-sm font-medium text-text-secondary")], [labels.subtotal]),
            h.p([h.Class("text-sm text-text-tertiary")], ["$48.09"]),
          ],
        ),
      ],
    ),
    h.span([h.AriaHidden(true), h.Class("w-full border-t border-border-secondary")]),
    button({ label: labels.checkout, onPress: props.onCheckout, size: "md" }, h),
  ];
  return slideoutMenu(
    {
      content,
      id: props.id,
      isOpen: props.isOpen,
      nativeTopLayer: true,
      onCancel: props.onDismiss,
      responsiveTitle: true,
      title: labels.orderSummary,
    },
    h,
  );
};
