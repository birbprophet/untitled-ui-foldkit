/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the authenticated input-field dialog anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { input } from "../base/fields.ts";

export interface InputFieldModalProps<Message> {
  readonly id: string;
  readonly isOpen: boolean;
  readonly name: string;
  readonly onCancel: NoInfer<Message>;
  readonly onConfirm: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onNameInput: (value: string) => NoInfer<Message>;
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

const folderIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-12"), h.Fill("none"), h.ViewBox("0 0 48 48")],
    [
      h.path([
        h.D(
          "M8 3C3.582 3 0 6.582 0 11v21.2c0 4.48 0 6.72.872 8.432a8 8 0 0 0 3.496 3.496C6.08 45 8.32 45 12.8 45h22.4c4.48 0 6.72 0 8.432-.872a8 8 0 0 0 3.496-3.496C48 38.92 48 36.68 48 32.2V19.8c0-4.48 0-6.72-.872-8.432a8 8 0 0 0-3.496-3.496C41.92 7 39.68 7 35.2 7h-8.628C22.798 7 19.205 3 15.431 3H8Z",
        ),
        h.Fill("var(--color-brand-700)"),
      ]),
      h.rect([h.Fill("white"), h.Height("32"), h.Rx("8"), h.Width("48"), h.X("0"), h.Y("13")]),
      h.rect([
        h.Fill("var(--color-brand-600)"),
        h.Height("31"),
        h.Rx("7.5"),
        h.Width("47"),
        h.X("0.5"),
        h.Y("13.5"),
      ]),
      h.rect([
        h.Fill("white"),
        h.FillOpacity("0.12"),
        h.Height("32"),
        h.Rx("8"),
        h.Width("48"),
        h.X("0"),
        h.Y("13"),
      ]),
    ],
  );

export const inputFieldModal = <Message>(
  props: InputFieldModalProps<Message>,
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
                      h.div([h.Class("relative w-max")], [folderIcon(h)]),
                      h.div(
                        [h.Class("z-10 flex flex-col gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            ["Project created"],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            ["Please enter a name for this project."],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div(
                    [h.Class("relative flex flex-col px-4 sm:px-6")],
                    [
                      input(
                        {
                          label: "Project name",
                          name: `${props.id}-project-name`,
                          onInput: props.onNameInput,
                          placeholder: "e.g. Website design",
                          size: "md",
                          value: props.name,
                        },
                        h,
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
                          label: "Confirm",
                          onPress: props.onConfirm,
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
