/* oxlint-disable @rikalabs/no-low-signal-variable-names, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary -- Six authenticated radio-card variants share the upstream native radio seam. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "./avatar.ts";
import { badge } from "./badges.ts";

export type RadioGroupVariant =
  | "icon-simple"
  | "icon-card"
  | "avatar"
  | "payment-icon"
  | "radio-button"
  | "checkbox";

export interface RadioGroupItem<Message> {
  readonly avatarUrl?: string;
  readonly badge?: string;
  readonly description: string;
  readonly disabled?: boolean;
  readonly editMessage?: NoInfer<Message>;
  readonly featuredIcon?: "layers-three" | "layers-two" | "zap";
  readonly message: NoInfer<Message>;
  readonly paymentBrand?: "mastercard" | "visa";
  readonly setDefaultMessage?: NoInfer<Message>;
  readonly price?: string;
  readonly secondaryTitle?: string;
  readonly title: string;
  readonly value: string;
}

export interface RadioGroupsProps<Message> {
  readonly ariaLabel: string;
  readonly items: readonly RadioGroupItem<Message>[];
  readonly name: string;
  readonly selectedValue?: string;
  readonly size?: "sm" | "md";
  readonly variant: RadioGroupVariant;
}

const radioMark = <Message>(
  selected: boolean,
  size: "sm" | "md",
  checkbox: boolean,
  h: HtmlBuilder<Message>,
): Html =>
  checkbox
    ? h.span(
        [
          h.Class(
            `mt-0.5 flex shrink-0 items-center justify-center ring-1 ring-inset ${size === "md" ? "size-5 rounded-md" : "size-4 rounded"} ${selected ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"}`,
          ),
        ],
        selected
          ? [
              h.svg(
                [
                  h.AriaHidden(true),
                  h.Class("size-3.5 text-fg-white"),
                  h.Fill("none"),
                  h.ViewBox("0 0 14 14"),
                ],
                [
                  h.path([
                    h.D("M11.6666 3.5 5.24992 9.91667 2.33325 7"),
                    h.Stroke("currentColor"),
                    h.StrokeLinecap("round"),
                    h.StrokeLinejoin("round"),
                    h.StrokeWidth("2"),
                  ]),
                ],
              ),
            ]
          : [],
      )
    : h.span(
        [
          h.Class(
            `mt-0.5 flex shrink-0 items-center justify-center rounded-full ring-1 ring-inset ${size === "md" ? "size-5" : "size-4"} ${selected ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"}`,
          ),
        ],
        [
          h.span([
            h.Class(
              `${size === "md" ? "size-2" : "size-1.5"} rounded-full bg-fg-white ${selected ? "opacity-100" : "opacity-0"}`,
            ),
          ]),
        ],
      );

const featuredIconPath = (kind?: RadioGroupItem<unknown>["featuredIcon"]): string => {
  if (kind === "layers-two") {
    return "m2 14.5 9.642 4.821c.131.066.197.099.266.111.06.012.123.012.184 0 .069-.012.135-.045.266-.11L22 14.5m-20-5 9.642-4.821c.131-.066.197-.098.266-.111a.5.5 0 0 1 .184 0c.069.013.135.045.266.111L22 9.5l-9.642 4.821a1.028 1.028 0 0 1-.266.111.501.501 0 0 1-.184 0c-.069-.012-.135-.045-.266-.11L2 9.5Z";
  }
  if (kind === "layers-three") {
    return "m2 12 9.642 4.821c.131.066.197.099.266.111.06.012.123.012.184 0 .069-.012.135-.045.266-.11L22 12M2 17l9.642 4.821c.131.066.197.099.266.111.06.012.123.012.184 0 .069-.012.135-.045.266-.11L22 17M2 7l9.642-4.821c.131-.066.197-.098.266-.111a.5.5 0 0 1 .184 0c.069.013.135.045.266.11L22 7l-9.642 4.821a1.028 1.028 0 0 1-.266.111.501.501 0 0 1-.184 0c-.069-.012-.135-.045-.266-.11L2 7Z";
  }
  if (kind === "zap") {
    return "M13 2 4.093 12.688c-.348.418-.523.628-.525.804a.5.5 0 0 0 .185.397c.138.111.41.111.955.111H12l-1 8 8.907-10.688c.348-.418.523-.628.525-.804a.5.5 0 0 0-.185-.397c-.138-.111-.41-.111-.955-.111H12l1-8Z";
  }
  return "m2 7 8.165 5.715c.661.463.992.695 1.351.784a2 2 0 0 0 .968 0c.36-.09.69-.32 1.351-.784L22 7M6.8 20h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 17.72 22 16.88 22 15.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 4 18.88 4 17.2 4H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 6.28 2 7.12 2 8.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 20 5.12 20 6.8 20Z";
};

const featuredIcon = <Message>(
  size: "sm" | "md",
  kind: RadioGroupItem<unknown>["featuredIcon"],
  h: HtmlBuilder<Message>,
): Html =>
  h.span(
    [
      h.Class(
        `relative flex shrink-0 items-center justify-center bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset ${size === "md" ? "size-10 rounded-lg" : "size-8 rounded-md"}`,
      ),
    ],
    [
      h.svg(
        [
          h.AriaHidden(true),
          h.Class(size === "md" ? "size-5" : "size-4"),
          h.Fill("none"),
          h.ViewBox("0 0 24 24"),
        ],
        [
          h.path([
            h.D(featuredIconPath(kind)),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeLinejoin("round"),
            h.StrokeWidth("2"),
          ]),
        ],
      ),
    ],
  );

const paymentIcon = <Message>(brand: "mastercard" | "visa", h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("h-8 w-11.5 shrink-0"), h.Fill("none"), h.ViewBox("0 0 34 24")],
    [
      h.path([
        h.D(
          "M.5 4A3.5 3.5 0 0 1 4 .5h26A3.5 3.5 0 0 1 33.5 4v16a3.5 3.5 0 0 1-3.5 3.5H4A3.5 3.5 0 0 1 .5 20V4Z",
        ),
        h.Fill("white"),
      ]),
      h.path([
        h.D(
          "M.5 4A3.5 3.5 0 0 1 4 .5h26A3.5 3.5 0 0 1 33.5 4v16a3.5 3.5 0 0 1-3.5 3.5H4A3.5 3.5 0 0 1 .5 20V4Z",
        ),
        h.Class("stroke-border-secondary"),
        h.StrokeWidth(".75"),
      ]),
      ...(brand === "visa"
        ? [
            h.path([
              h.ClipRule("evenodd"),
              h.D(
                "M10.75 15.858H8.69L7.146 9.792c-.073-.279-.229-.525-.458-.642A6.6 6.6 0 0 0 4.8 8.508v-.233h3.318c.458 0 .801.35.859.758l.801 4.376 2.059-5.134h2.002l-3.089 7.583Zm4.234 0h-1.945l1.602-7.583h1.945l-1.602 7.583Zm4.119-5.482c.057-.409.4-.642.801-.642.63-.059 1.316.058 1.888.35l.343-1.633a4.9 4.9 0 0 0-1.773-.351c-1.888 0-3.262 1.05-3.262 2.508 0 1.11.973 1.692 1.66 2.042.743.35 1.03.584.972.934 0 .525-.572.758-1.144.758a4.8 4.8 0 0 1-2.002-.467l-.344 1.633c.687.292 1.43.409 2.117.409 2.117.057 3.433-.992 3.433-2.567 0-1.984-2.689-2.1-2.689-2.974Zm9.497 5.482-1.545-7.583h-1.659c-.343 0-.687.233-.801.583l-2.86 7h2.002l.4-1.108h2.46l.229 1.108H28.6Zm-2.918-5.541.572 2.858h-1.602l1.03-2.858Z",
              ),
              h.Fill("#172B85"),
              h.FillRule("evenodd"),
            ]),
          ]
        : [
            h.path([
              h.ClipRule("evenodd"),
              h.D("M17.179 16.829A6.8 6.8 0 1 1 17.18 6.63a6.8 6.8 0 1 1 0 10.199Z"),
              h.Fill("#ED0006"),
              h.FillRule("evenodd"),
            ]),
            h.path([
              h.ClipRule("evenodd"),
              h.D(
                "M17.179 16.829a6.67 6.67 0 0 0 2.382-5.099 6.67 6.67 0 0 0-2.382-5.1 6.8 6.8 0 1 1 0 10.2Z",
              ),
              h.Fill("#F9A000"),
              h.FillRule("evenodd"),
            ]),
            h.path([
              h.ClipRule("evenodd"),
              h.D(
                "M17.179 16.829a6.67 6.67 0 0 0 2.383-5.099 6.67 6.67 0 0 0-2.383-5.1 6.67 6.67 0 0 0-2.382 5.1 6.67 6.67 0 0 0 2.382 5.099Z",
              ),
              h.Fill("#FF5E00"),
              h.FillRule("evenodd"),
            ]),
          ]),
    ],
  );

const itemMain = <Message>(
  item: RadioGroupItem<Message>,
  variant: RadioGroupVariant,
  size: "sm" | "md",
  labelId: string,
  descriptionId: string,
  h: HtmlBuilder<Message>,
): readonly Html[] => {
  const prefix =
    variant === "avatar"
      ? [
          avatar(
            {
              alt: item.title,
              size: size === "md" ? "md" : "sm",
              src: item.avatarUrl,
            },
            h,
          ),
        ]
      : variant === "icon-simple" || variant === "icon-card"
        ? [featuredIcon(size, item.featuredIcon, h)]
        : [];
  const details = h.span(
    [h.Class(`flex min-w-0 flex-1 flex-col ${size === "md" ? "gap-0.5" : ""}`)],
    [
      h.span(
        [h.Id(labelId), h.Class(`flex flex-wrap ${size === "md" ? "gap-1.5" : "gap-1"}`)],
        [
          h.span(
            [h.Class(`${size === "md" ? "text-md" : "text-sm"} font-medium text-text-secondary`)],
            [item.title],
          ),
          ...(item.secondaryTitle === undefined
            ? []
            : [
                h.span(
                  [h.Class(`${size === "md" ? "text-md" : "text-sm"} text-text-tertiary`)],
                  [item.secondaryTitle],
                ),
              ]),
        ],
      ),
      h.span(
        [
          h.Id(descriptionId),
          h.Class(`${size === "md" ? "text-md" : "text-sm"} text-text-tertiary`),
        ],
        [item.description],
      ),
      ...(variant === "payment-icon"
        ? [
            h.span(
              [h.Class(`flex gap-3 ${size === "md" ? "mt-3" : "mt-2"}`)],
              [
                h.button(
                  [
                    h.Class(
                      `${size === "md" ? "text-md" : "text-sm"} font-semibold text-text-tertiary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2`,
                    ),
                    h.Type("button"),
                    h.Disabled(item.disabled === true),
                    ...(item.setDefaultMessage === undefined
                      ? []
                      : [h.OnClick(item.setDefaultMessage)]),
                  ],
                  ["Set as default"],
                ),
                h.button(
                  [
                    h.Class(
                      `${size === "md" ? "text-md" : "text-sm"} font-semibold text-text-brand-secondary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2`,
                    ),
                    h.Type("button"),
                    h.Disabled(item.disabled === true),
                    ...(item.editMessage === undefined ? [] : [h.OnClick(item.editMessage)]),
                  ],
                  ["Edit"],
                ),
              ],
            ),
          ]
        : []),
    ],
  );
  return variant === "payment-icon" || variant === "icon-simple"
    ? [
        h.span(
          [h.Class("flex min-w-0 flex-1 gap-3")],
          [
            variant === "payment-icon"
              ? paymentIcon(item.paymentBrand ?? "visa", h)
              : featuredIcon(size, item.featuredIcon, h),
            details,
          ],
        ),
      ]
    : [...prefix, details];
};

const pricePanel = <Message>(
  item: RadioGroupItem<Message>,
  size: "sm" | "md",
  descriptionId: string,
  h: HtmlBuilder<Message>,
): Html =>
  h.span(
    [h.Class(`flex flex-col rounded-b-lg p-4 ${size === "md" ? "gap-2" : "gap-1"}`)],
    [
      h.span(
        [
          h.Class(
            "flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-1",
          ),
        ],
        [
          h.span(
            [h.Class("flex items-baseline gap-1")],
            [
              h.span(
                [
                  h.Class(
                    `${size === "md" ? "text-display-md" : "text-display-sm"} font-semibold text-text-secondary`,
                  ),
                ],
                [item.price ?? "$10"],
              ),
              ...(item.secondaryTitle === undefined
                ? []
                : [
                    h.span(
                      [h.Class(`${size === "md" ? "text-md" : "text-sm"} text-text-tertiary`)],
                      [item.secondaryTitle],
                    ),
                  ]),
            ],
          ),
          ...(item.badge === undefined
            ? []
            : [
                badge(
                  {
                    adornment: "dot",
                    color: "success",
                    label: item.badge,
                    size: "sm",
                    type: "modern",
                  },
                  h,
                ),
              ]),
        ],
      ),
      h.span(
        [
          h.Id(descriptionId),
          h.Class(`${size === "md" ? "text-md" : "text-sm"} text-text-tertiary`),
        ],
        [item.description],
      ),
    ],
  );

export const radioGroups = <Message>(
  props: RadioGroupsProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const size = props.size ?? "sm";
  return h.fieldset(
    [h.Class("flex flex-col gap-3")],
    [
      h.legend([h.Class("sr-only")], [props.ariaLabel]),
      ...props.items.map((item) => {
        const selected = item.value === props.selectedValue;
        const itemId = `${props.name}-${item.value}`.toLowerCase().replaceAll(/[^a-z0-9]+/gu, "-");
        const labelId = `${itemId}-label`;
        const descriptionId = `${itemId}-description`;
        const card = props.variant === "icon-card";
        const checkboxMark = props.variant !== "radio-button";
        const classes = `relative block cursor-pointer rounded-xl bg-bg-primary outline-focus-ring ring-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 ${selected ? "ring-2 ring-border-brand" : "ring-1 ring-border-secondary"} ${item.disabled === true ? "cursor-not-allowed bg-bg-disabled-subtle opacity-50" : ""}`;
        return h.label(
          [h.Class(classes)],
          [
            h.input([
              h.Class("peer sr-only"),
              h.Type("radio"),
              h.Name(props.name),
              h.Value(item.value),
              h.Checked(selected),
              h.Disabled(item.disabled === true),
              h.Attribute("aria-labelledby", labelId),
              h.AriaDescribedBy(descriptionId),
              h.OnChange(() => item.message),
            ]),
            ...(card
              ? [
                  h.span(
                    [
                      h.Class(
                        `flex items-center gap-3 rounded-t-xl p-3 pr-5 ring-inset ${selected ? "ring-2 ring-border-brand" : "ring-1 ring-border-secondary"}`,
                      ),
                    ],
                    [
                      featuredIcon(size, item.featuredIcon, h),
                      h.span(
                        [
                          h.Class(
                            `${size === "md" ? "text-lg" : "text-md"} mr-1 font-semibold text-text-secondary`,
                          ),
                          h.Id(labelId),
                        ],
                        [item.title],
                      ),
                      h.span([h.Class("ml-auto")], [radioMark(selected, size, true, h)]),
                    ],
                  ),
                  pricePanel(item, size, descriptionId, h),
                ]
              : [
                  h.span(
                    [
                      h.Class(
                        `flex items-start p-4 ${props.variant === "payment-icon" || props.variant === "icon-simple" ? "gap-1" : props.variant === "radio-button" || props.variant === "checkbox" ? (size === "md" ? "gap-3" : "gap-2") : "gap-3"}`,
                      ),
                    ],
                    [
                      ...(props.variant === "radio-button" || props.variant === "checkbox"
                        ? [radioMark(selected, size, checkboxMark, h)]
                        : []),
                      ...itemMain(item, props.variant, size, labelId, descriptionId, h),
                      ...(props.variant === "radio-button" || props.variant === "checkbox"
                        ? []
                        : [radioMark(selected, size, true, h)]),
                    ],
                  ),
                ]),
          ],
        );
      }),
    ],
  );
};
