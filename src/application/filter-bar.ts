/* oxlint-disable effect/noReturnInArrow, effect/noTernary, effect/noSpread -- The upstream compound accepts renderer-owned child slots and optional row actions. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface FilterBarRow<Message> {
  readonly content: readonly Html[];
  readonly id: string;
  readonly onRemove?: NoInfer<Message>;
}

export interface FilterBarProps<Message> {
  readonly actions?: readonly Html[];
  readonly ariaLabel: string;
  readonly content?: readonly Html[];
  readonly iconAction?: Readonly<{ label: string; onPress: NoInfer<Message> }>;
  readonly rows?: readonly FilterBarRow<Message>[];
}

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 20 20")],
    [
      h.path([
        h.D("m5 5 10 10M15 5 5 15"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const filterIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 20 20"),
    ],
    [
      h.path([
        h.D("M3 5h14M5.5 10h9M8 15h4"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

export const filterBar = <Message>(props: FilterBarProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.AriaLabel(props.ariaLabel), h.Class("flex flex-wrap items-end gap-3"), h.Role("group")],
    [
      h.div(
        [h.Class("flex min-w-0 flex-1 flex-wrap items-end gap-3")],
        [
          ...(props.content ?? []),
          ...(props.rows ?? []).map((row) =>
            h.keyed("div")(
              row.id,
              [h.Class("flex items-start gap-1"), h.DataAttribute("filter-id", row.id)],
              [
                h.div([h.Class("flex items-center gap-3")], row.content),
                ...(row.onRemove === undefined
                  ? []
                  : [
                      h.button(
                        [
                          h.AriaLabel("Remove filter"),
                          h.Class(
                            "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary transition duration-100 ease-linear hover:text-fg-quaternary-hover",
                          ),
                          h.OnClick(row.onRemove),
                          h.Type("button"),
                        ],
                        [closeIcon(h)],
                      ),
                    ]),
              ],
            ),
          ),
        ],
      ),
      ...((props.actions?.length ?? 0) === 0 && props.iconAction === undefined
        ? []
        : [
            h.div(
              [h.Class("flex shrink-0 items-center gap-3")],
              [
                ...(props.actions ?? []),
                ...(props.iconAction === undefined
                  ? []
                  : [
                      h.button(
                        [
                          h.AriaLabel(props.iconAction.label),
                          h.Class(
                            "flex size-9 cursor-pointer items-center justify-center rounded-lg border border-border-primary bg-bg-primary shadow-xs transition duration-100 ease-linear hover:bg-bg-primary-hover",
                          ),
                          h.OnClick(props.iconAction.onPress),
                          h.Type("button"),
                        ],
                        [filterIcon(h)],
                      ),
                    ]),
              ],
            ),
          ]),
    ],
  );
