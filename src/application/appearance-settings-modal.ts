/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noNew, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Vite resolves the authenticated appearance SVG fixtures through import.meta.url; native radio and dialog state stays explicit. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { checkbox } from "../base/controls.ts";

export type AppearanceMode = "system" | "light" | "dark";
export type AppearanceBrandColor =
  | "#535862"
  | "#099250"
  | "#1570EF"
  | "#444CE7"
  | "#0B7D74"
  | "#BA24D5"
  | "#DD2590"
  | "#E04F16"
  | "custom";

export interface AppearanceSettingsModalProps<Message> {
  readonly isApplyToAllTeams: boolean;
  readonly brandColor: AppearanceBrandColor;
  readonly customColor: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly mode: AppearanceMode;
  readonly onApplyToAllTeams: NoInfer<Message>;
  readonly onBrandColor: (color: AppearanceBrandColor) => NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onCustomColor: (color: string) => NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onMode: (mode: AppearanceMode) => NoInfer<Message>;
  readonly onSave: NoInfer<Message>;
}

const appearanceImages: Record<AppearanceMode, string> = {
  dark: new URL("appearance-settings-assets/dark.svg", import.meta.url).href,
  light: new URL("appearance-settings-assets/light.svg", import.meta.url).href,
  system: new URL("appearance-settings-assets/system.svg", import.meta.url).href,
};

const swatches: readonly {
  readonly color: Exclude<AppearanceBrandColor, "custom">;
  readonly label: string;
}[] = [
  { color: "#535862", label: "Gray" },
  { color: "#099250", label: "Green" },
  { color: "#1570EF", label: "Blue" },
  { color: "#444CE7", label: "Indigo" },
  { color: "#0B7D74", label: "Siglata teal" },
  { color: "#BA24D5", label: "Fuchsia" },
  { color: "#DD2590", label: "Pink" },
  { color: "#E04F16", label: "Orange" },
];

const contrastIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D(
          "M12 2c.592 0 1.171.051 1.735.15M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10m0-20v20m5.738-18.191c.954.67 1.786 1.502 2.455 2.456m1.657 4a10.064 10.064 0 0 1 0 3.47m-1.66 4.006c-.67.952-1.5 1.782-2.453 2.45m-4.004 1.66A10.21 10.21 0 0 1 12 22",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

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

const colorSwatch = <Message>(
  props: AppearanceSettingsModalProps<Message>,
  color: Exclude<AppearanceBrandColor, "custom">,
  label: string,
  h: HtmlBuilder<Message>,
): Html => {
  const selected = props.brandColor === color;
  return h.label(
    [h.Class("relative flex cursor-pointer rounded-full outline-focus-ring")],
    [
      h.input([
        h.AriaLabel(label),
        h.Checked(selected),
        h.Class("peer sr-only"),
        h.Name(`${props.id}-brand-color`),
        h.OnChange(() => props.onBrandColor(color)),
        h.Type("radio"),
        h.Value(color),
      ]),
      h.span([
        h.Class(
          `size-7 rounded-full outline-1 -outline-offset-1 outline-black/10 peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg-primary ${selected ? "ring-2 ring-focus-ring ring-offset-2 ring-offset-bg-primary" : ""}`,
        ),
        h.Style({ "background-color": color }),
      ]),
    ],
  );
};

const customColorInput = <Message>(
  props: AppearanceSettingsModalProps<Message>,
  className: string,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        `relative w-24 items-center rounded-lg bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset ${className}`,
      ),
    ],
    [
      h.input([
        h.AriaLabel("Custom color hex value"),
        h.Class(
          "w-full rounded-[inherit] bg-transparent px-3 py-2 text-md text-text-primary outline-hidden placeholder:text-text-placeholder focus:ring-2 focus:ring-focus-ring focus:ring-offset-2",
        ),
        h.OnFocus(props.onBrandColor("custom")),
        h.OnInput(props.onCustomColor),
        h.Type("text"),
        h.Value(props.customColor),
      ]),
    ],
  );

const customSwatch = <Message>(
  props: AppearanceSettingsModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const selected = props.brandColor === "custom" || props.brandColor === props.customColor;
  return h.div(
    [h.Class("flex shrink-0 items-center gap-3")],
    [
      h.label(
        [h.Class("flex cursor-pointer items-center gap-3")],
        [
          h.input([
            h.AriaLabel("Custom brand color"),
            h.Checked(selected),
            h.Class("peer sr-only"),
            h.Name(`${props.id}-brand-color`),
            h.OnChange(() => props.onBrandColor("custom")),
            h.Type("radio"),
            h.Value("custom"),
          ]),
          h.span([h.Class("text-sm font-semibold text-text-secondary")], ["Custom"]),
          h.span([
            h.Class(
              `size-7 shrink-0 rounded-full outline-1 -outline-offset-1 outline-black/10 peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg-primary ${selected ? "ring-2 ring-focus-ring ring-offset-2 ring-offset-bg-primary" : ""}`,
            ),
            h.Style({ "background-color": props.customColor }),
          ]),
        ],
      ),
      customColorInput(props, "md:hidden", h),
    ],
  );
};

const selectedMark = <Message>(h: HtmlBuilder<Message>): Html =>
  h.span(
    [
      h.AriaHidden(true),
      h.Class(
        "absolute bottom-2 left-2 flex size-5 items-center justify-center rounded-full bg-bg-brand-solid shadow-xs ring-1 ring-transparent",
      ),
    ],
    [h.span([h.Class("size-2 rounded-full bg-fg-white")])],
  );

const modeOption = <Message>(
  props: AppearanceSettingsModalProps<Message>,
  mode: AppearanceMode,
  label: string,
  h: HtmlBuilder<Message>,
): Html => {
  const selected = props.mode === mode;
  return h.label(
    [h.Class("flex cursor-pointer flex-col gap-3")],
    [
      h.input([
        h.AriaLabel(label),
        h.Checked(selected),
        h.Class("peer sr-only"),
        h.Name(`${props.id}-display-preference`),
        h.OnChange(() => props.onMode(mode)),
        h.Type("radio"),
        h.Value(mode),
      ]),
      h.span(
        [
          h.Class(
            "relative rounded-[10px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring",
          ),
        ],
        [
          h.img([
            h.Alt(""),
            h.AriaHidden(true),
            h.Class(
              `block w-50 max-w-none rounded-[10px] ${selected ? "outline-2 outline-offset-2 outline-focus-ring" : ""}`,
            ),
            h.Height(mode === "system" ? "132" : "133"),
            h.Src(appearanceImages[mode]),
            h.Width("200"),
          ]),
          ...(selected ? [selectedMark(h)] : []),
        ],
      ),
      h.span([h.Class("text-sm font-semibold text-text-primary")], [label]),
    ],
  );
};

export const appearanceSettingsModal = <Message>(
  props: AppearanceSettingsModalProps<Message>,
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
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-[calc(100%-32px)] max-w-172 overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:w-full sm:rounded-2xl",
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
                    [
                      h.Class(
                        "flex flex-col gap-4 border-b border-border-secondary px-4 pt-5 pb-5 sm:px-6 sm:pt-6",
                      ),
                    ],
                    [
                      h.div(
                        [
                          h.Class(
                            "hidden size-10 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset sm:flex",
                          ),
                        ],
                        [contrastIcon(h)],
                      ),
                      h.div(
                        [h.Class("z-10 flex flex-col gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            ["Appearance"],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            [
                              h.span(
                                [h.Class("hidden sm:inline")],
                                ["Change how your dashboard looks and feels in your browser."],
                              ),
                              h.span(
                                [h.Class("sm:hidden")],
                                ["How your dashboard looks in your browser."],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div(
                    [h.Class("flex flex-col gap-5 px-4 pt-5 sm:px-6")],
                    [
                      h.section(
                        [h.AriaLabel("Brand color"), h.Class("flex flex-col gap-4")],
                        [
                          h.div(
                            [h.Class("flex flex-col")],
                            [
                              h.p(
                                [h.Class("text-sm font-semibold text-text-primary")],
                                ["Brand color"],
                              ),
                              h.p(
                                [h.Class("text-sm text-text-tertiary")],
                                ["Update your dashboard to your brand color."],
                              ),
                            ],
                          ),
                          h.div(
                            [h.Class("flex flex-col gap-3 lg:flex-row lg:items-center")],
                            [
                              h.div(
                                [
                                  h.Class(
                                    "flex flex-col items-start gap-4 md:flex-row md:items-center",
                                  ),
                                ],
                                [
                                  h.div(
                                    [h.Class("flex gap-2")],
                                    swatches.map((item) =>
                                      colorSwatch(props, item.color, item.label, h),
                                    ),
                                  ),
                                  customSwatch(props, h),
                                ],
                              ),
                              customColorInput(props, "hidden md:flex", h),
                            ],
                          ),
                        ],
                      ),
                      h.div([h.Class("w-full border-t border-border-secondary")]),
                      h.section(
                        [h.AriaLabel("Display preference"), h.Class("flex flex-col")],
                        [
                          h.div(
                            [h.Class("flex flex-col")],
                            [
                              h.p(
                                [h.Class("text-sm font-semibold text-text-primary")],
                                ["Display preference"],
                              ),
                              h.p(
                                [h.Class("text-sm text-text-tertiary")],
                                ["Switch between light and dark modes."],
                              ),
                            ],
                          ),
                          h.div(
                            [
                              h.Class(
                                "-mx-4 flex flex-row gap-5 overflow-x-auto px-4 pt-5 sm:pt-6",
                              ),
                            ],
                            [
                              modeOption(props, "system", "System preference", h),
                              modeOption(props, "light", "Light mode", h),
                              modeOption(props, "dark", "Dark mode", h),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.footer(
                    [h.Class("z-10 flex flex-col pt-6 pb-4 sm:pt-8 sm:pb-6")],
                    [
                      h.div([h.Class("w-full border-t border-border-secondary")]),
                      h.div([h.Class("h-4 w-full sm:h-6")]),
                      h.div(
                        [
                          h.Class(
                            "flex flex-1 flex-col-reverse gap-3 px-4 sm:flex-row sm:items-center sm:px-6",
                          ),
                        ],
                        [
                          h.div(
                            [h.Class("mr-auto hidden sm:block")],
                            [
                              checkbox(
                                {
                                  isSelected: props.isApplyToAllTeams,
                                  label: "Apply to all teams",
                                  name: `${props.id}-apply-to-all-teams`,
                                  onToggle: props.onApplyToAllTeams,
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
            ],
          ),
        ]
      : [],
  );
};
