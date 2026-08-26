/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Native radio and dialog state stays controlled by the consuming FoldKit program. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export type BannerAppearance = "default" | "simplified" | "none" | "custom";

export interface BannerAppearanceModalProps<Message> {
  readonly appearance: BannerAppearance;
  readonly id: string;
  readonly isOpen: boolean;
  readonly onAppearance: (appearance: BannerAppearance) => NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onEditCss: NoInfer<Message>;
  readonly onHelp: NoInfer<Message>;
  readonly onSave: NoInfer<Message>;
}

type BannerAsset = "default" | "default-sm" | "simplified" | "none" | "none-sm";

const lightAssets: Record<BannerAsset, string> = {
  default: new URL("banner-appearance-assets/default.light.svg", import.meta.url).href,
  "default-sm": new URL("banner-appearance-assets/default-sm.light.svg", import.meta.url).href,
  none: new URL("banner-appearance-assets/none.light.svg", import.meta.url).href,
  "none-sm": new URL("banner-appearance-assets/none-sm.light.svg", import.meta.url).href,
  simplified: new URL("banner-appearance-assets/simplified.light.svg", import.meta.url).href,
};

const darkAssets: Record<BannerAsset, string> = {
  default: new URL("banner-appearance-assets/default.dark.svg", import.meta.url).href,
  "default-sm": new URL("banner-appearance-assets/default-sm.dark.svg", import.meta.url).href,
  none: new URL("banner-appearance-assets/none.dark.svg", import.meta.url).href,
  "none-sm": new URL("banner-appearance-assets/none-sm.dark.svg", import.meta.url).href,
  simplified: new URL("banner-appearance-assets/simplified.dark.svg", import.meta.url).href,
};

const banners: readonly {
  readonly value: BannerAppearance;
  readonly label: string;
  readonly description: string;
  readonly desktop: BannerAsset;
  readonly mobile: BannerAsset;
}[] = [
  {
    description: "Default solid brand color.",
    desktop: "default",
    label: "Default",
    mobile: "default-sm",
    value: "default",
  },
  {
    description: "Minimal and simplified.",
    desktop: "simplified",
    label: "Simplified",
    mobile: "none-sm",
    value: "simplified",
  },
  {
    description: "Hide all banners.",
    desktop: "none",
    label: "None",
    mobile: "none-sm",
    value: "none",
  },
  {
    description: "Manage styling with CSS.",
    desktop: "none",
    label: "Custom styling",
    mobile: "none-sm",
    value: "custom",
  },
];

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("M18 6 6 18M6 6l12 12"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const codeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5"),
      h.DataAttribute("icon", "leading"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("m17 17 5-5-5-5M7 7l-5 5 5 5m7-14-4 18"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const helpIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5"),
      h.DataAttribute("icon", "leading"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const previewImage = <Message>(
  name: BannerAsset,
  className: string,
  h: HtmlBuilder<Message>,
): Html =>
  h.span(
    [h.Class(className)],
    [
      h.img([
        h.Alt(""),
        h.AriaHidden(true),
        h.Class("size-full object-cover object-center in-data-[theme=dark]:hidden"),
        h.Src(lightAssets[name]),
      ]),
      h.img([
        h.Alt(""),
        h.AriaHidden(true),
        h.Class("hidden size-full object-cover object-center in-data-[theme=dark]:block"),
        h.Src(darkAssets[name]),
      ]),
    ],
  );

const radioMark = <Message>(selected: boolean, h: HtmlBuilder<Message>): Html =>
  h.span(
    [
      h.Class(
        `flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full ring-1 ring-inset ${selected ? "bg-bg-brand-solid ring-brand-600" : "bg-bg-primary ring-border-primary"}`,
      ),
    ],
    [
      h.span([
        h.Class(`size-1.5 rounded-full bg-fg-white ${selected ? "opacity-100" : "opacity-0"}`),
      ]),
    ],
  );

const bannerOption = <Message>(
  props: BannerAppearanceModalProps<Message>,
  banner: (typeof banners)[number],
  h: HtmlBuilder<Message>,
): Html => {
  const selected = props.appearance === banner.value;
  const labelId = `${props.id}-${banner.value}-label`;
  const descriptionId = `${props.id}-${banner.value}-description`;
  return h.label(
    [h.Class("flex h-max w-full cursor-pointer flex-row gap-3 sm:flex-col")],
    [
      h.input([
        h.AriaDescribedBy(descriptionId),
        h.Attribute("aria-labelledby", labelId),
        h.Checked(selected),
        h.Class("peer sr-only"),
        h.Name(`${props.id}-appearance`),
        h.OnChange(() => props.onAppearance(banner.value)),
        h.Type("radio"),
        h.Value(banner.value),
      ]),
      h.section(
        [
          h.Class(
            "relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-utility-neutral-100 outline-focus-ring peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 sm:h-40 sm:w-60 sm:rounded-[10px]",
          ),
        ],
        [
          previewImage(banner.desktop, "hidden size-full sm:block", h),
          previewImage(banner.mobile, "block size-full sm:hidden", h),
          h.span([
            h.Class(
              `pointer-events-none absolute top-0 left-0 z-1 size-full rounded-md ring-inset sm:rounded-[10px] ${selected ? "ring-2 ring-border-brand" : "ring-1 ring-border-primary"}`,
            ),
          ]),
          ...(banner.value === "custom"
            ? [
                h.div(
                  [h.Class("absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2")],
                  [
                    h.div(
                      [h.Class("hidden sm:block")],
                      [
                        button(
                          {
                            color: "secondary",
                            iconLeadingElement: codeIcon(h),
                            label: "Edit CSS",
                            onPress: props.onEditCss,
                            size: "sm",
                          },
                          h,
                        ),
                      ],
                    ),
                    h.button(
                      [
                        h.AriaLabel("Edit CSS"),
                        h.Class(
                          "flex size-9 items-center justify-center rounded-lg bg-bg-primary text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset sm:hidden",
                        ),
                        h.OnClick(props.onEditCss),
                        h.Type("button"),
                      ],
                      [codeIcon(h)],
                    ),
                  ],
                ),
                h.span([
                  h.Class(
                    "absolute top-0 left-0 size-full rounded-md bg-linear-to-b from-black/2 to-black/17 to-90% backdrop-blur-[2.14px] sm:rounded-[10px]",
                  ),
                ]),
              ]
            : []),
        ],
      ),
      h.section(
        [h.Class("flex w-full gap-3")],
        [
          h.span(
            [h.Class("w-full")],
            [
              h.p(
                [h.Class("text-sm font-semibold text-text-primary"), h.Id(labelId)],
                [banner.label],
              ),
              h.p(
                [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                [banner.description],
              ),
            ],
          ),
          radioMark(selected, h),
        ],
      ),
    ],
  );
};

export const bannerAppearanceModal = <Message>(
  props: BannerAppearanceModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-end justify-center bg-overlay/70 px-4 pt-4 pb-[clamp(16px,8vh,64px)] outline-hidden backdrop-blur-[6px] sm:items-center sm:px-8 sm:py-8",
              ),
              h.DataAttribute("modal-overlay", props.id),
            ],
            [
              h.div([h.AriaHidden(true), h.Class("absolute inset-0"), h.OnClick(props.onDismiss)]),
              h.dialog(
                [
                  h.AriaDescribedBy(descriptionId),
                  h.AriaLabelledBy(titleId),
                  h.Class(
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-[336.953px] max-w-[calc(100%-32px)] overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:w-full sm:max-w-137 sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.button(
                    [
                      h.AriaLabel("Close dialog"),
                      h.Autofocus(true),
                      h.Class(
                        "absolute top-3 right-3 z-20 flex size-9 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2 sm:top-4 sm:right-4",
                      ),
                      h.OnClick(props.onDismiss),
                      h.Type("button"),
                    ],
                    [closeIcon(h)],
                  ),
                  h.header(
                    [h.Class("flex flex-col gap-0.5 px-4 pt-5 sm:px-6 sm:pt-6")],
                    [
                      h.h2(
                        [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                        ["Banner appearance"],
                      ),
                      h.p(
                        [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                        ["Change how banners appear to visitors."],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.fieldset(
                    [h.Class("grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:gap-5 sm:px-6")],
                    [
                      h.legend([h.Class("sr-only")], ["Banner appearances"]),
                      ...banners.map((item) => bannerOption(props, item, h)),
                    ],
                  ),
                  h.footer(
                    [
                      h.Class(
                        "z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 sm:flex-row sm:items-center sm:justify-end sm:px-6 sm:pt-8 sm:pb-6",
                      ),
                    ],
                    [
                      h.div(
                        [h.Class("relative top-[3px] mr-auto hidden sm:block")],
                        [
                          button(
                            {
                              color: "link-gray",
                              iconLeadingElement: helpIcon(h),
                              label: "Need help?",
                              onPress: props.onHelp,
                              size: "md",
                            },
                            h,
                          ),
                        ],
                      ),
                      button(
                        {
                          color: "secondary",
                          label: "Cancel",
                          onPress: props.onCancel,
                          size: "md",
                        },
                        h,
                      ),
                      button(
                        {
                          color: "primary",
                          label: "Save changes",
                          onPress: props.onSave,
                          size: "md",
                        },
                        h,
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ]
      : [],
  );
};
