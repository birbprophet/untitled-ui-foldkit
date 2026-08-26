/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the authenticated labels dialog, combobox, and removable badge anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";
import type { BadgeColor } from "../base/badges.ts";
import { button } from "../base/button.ts";
import { combobox } from "../base/combobox.ts";

export interface LabelsModalOption {
  readonly color: BadgeColor;
  readonly id: string;
  readonly label: string;
}

export interface LabelsModalProps<Message> {
  readonly focusedId?: string;
  readonly id: string;
  readonly inputValue: string;
  readonly isOpen: boolean;
  readonly isPickerOpen: boolean;
  readonly onAdd: NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onFocusOption: (id: string) => NoInfer<Message>;
  readonly onInput: (value: string) => NoInfer<Message>;
  readonly onOpenPicker: NoInfer<Message>;
  readonly onRemove: (id: string) => NoInfer<Message>;
  readonly onSelect: (id: string) => NoInfer<Message>;
  readonly onClosePicker: NoInfer<Message>;
  readonly options: readonly LabelsModalOption[];
  readonly selectedIds: readonly string[];
}

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

const tagIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D(
          "m20.59 13.41-7.17 7.17a2 2 0 0 1-2.83 0L3.41 13.4A2 2 0 0 1 3 12V5a2 2 0 0 1 2-2h7a2 2 0 0 1 1.41.59l7.18 7.17a2 2 0 0 1 0 2.83ZM8 8h.01",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

export const labelsModal = <Message>(
  props: LabelsModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  const selected = props.options.filter((option) => props.selectedIds.includes(option.id));
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
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-max max-w-[calc(100%-32px)] overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 shadow-xl outline-hidden sm:m-auto sm:max-w-100 sm:rounded-2xl",
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
                        "absolute top-3 right-3 z-20 flex size-9 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 sm:top-4 sm:right-4",
                      ),
                      h.OnClick(props.onDismiss),
                      h.Type("button"),
                    ],
                    [closeIcon(h)],
                  ),
                  h.header(
                    [h.Class("flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6")],
                    [
                      h.div(
                        [
                          h.Class(
                            "relative flex size-10 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
                          ),
                        ],
                        [tagIcon(h)],
                      ),
                      h.div(
                        [h.Class("z-10 flex flex-col gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            ["Add labels to project"],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            ["Labels help organize projects."],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div(
                    [h.Class("relative z-20 flex flex-col gap-3 px-4 sm:px-6")],
                    [
                      combobox(
                        {
                          ariaLabel: "Labels",
                          focusedId: props.focusedId,
                          inputValue: props.inputValue,
                          isOpen: props.isPickerOpen,
                          items: props.options.map((option) => ({
                            id: option.id,
                            label: option.label,
                            onFocus: props.onFocusOption(option.id),
                            onSelect: props.onSelect(option.id),
                          })),
                          name: `${props.id}-labels`,
                          onClose: props.onClosePicker,
                          onInput: props.onInput,
                          onOpen: props.onOpenPicker,
                          placeholder: "Search for label",
                          size: "md",
                        },
                        h,
                      ),
                      h.div(
                        [h.Class("flex flex-row gap-2")],
                        selected.map((label) =>
                          badge(
                            {
                              actionLabel: `Remove ${label.label}`,
                              adornment: "action",
                              color: label.color,
                              label: label.label,
                              onAction: props.onRemove(label.id),
                              size: "md",
                              type: "pill-color",
                            },
                            h,
                          ),
                        ),
                      ),
                    ],
                  ),
                  h.footer(
                    [
                      h.Class(
                        "z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 sm:grid sm:grid-cols-2 sm:px-6 sm:pt-8 sm:pb-6 [&>*]:grow",
                      ),
                    ],
                    [
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
                          label: "Add labels",
                          onPress: props.onAdd,
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
