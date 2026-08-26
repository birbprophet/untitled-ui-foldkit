/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The three upstream section primitives have direct optional-content branches. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface SectionFooterProps {
  readonly actions?: readonly Html[];
  readonly isCard?: boolean;
  readonly leading?: Html;
}

export interface SectionHeadersProps {
  readonly actions?: readonly Html[];
  readonly heading: string;
  readonly leading?: Html;
  readonly subheading?: string;
}

export interface SectionLabelProps {
  readonly actions?: readonly Html[];
  readonly description?: string;
  readonly isRequired?: boolean;
  readonly size?: "sm" | "md";
  readonly title: string;
  readonly tooltip?: string;
}

export const sectionFooter = <Message>(props: SectionFooterProps, h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Class(
        `flex items-center border-t border-border-secondary ${props.isCard === true ? "gap-4 px-4 py-3 md:py-4 lg:px-6" : "gap-5 pt-4 md:pt-5"}`,
      ),
    ],
    [
      ...(props.leading === undefined ? [] : [props.leading]),
      ...(props.actions === undefined
        ? []
        : [h.div([h.Class("flex flex-1 justify-end gap-3")], props.actions)]),
    ],
  );

export const sectionHeaders = <Message>(
  props: SectionHeadersProps,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("flex flex-col gap-5 border-b border-border-secondary pb-5")],
    [
      h.div(
        [h.Class("relative flex flex-col items-start gap-4 md:flex-row")],
        [
          ...(props.leading === undefined ? [] : [props.leading]),
          h.div(
            [h.Class("flex flex-1 flex-col")],
            [
              h.h2([h.Class("text-md font-semibold text-text-primary")], [props.heading]),
              ...(props.subheading === undefined
                ? []
                : [h.p([h.Class("text-sm text-text-tertiary")], [props.subheading])]),
            ],
          ),
          ...(props.actions === undefined ? [] : [h.div([h.Class("flex gap-3")], props.actions)]),
        ],
      ),
    ],
  );

const helpIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-4"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D(
          "M9.09 9a3 3 0 1 1 5.83 1c0 2-3 2-3 4m.08 4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

export const sectionLabel = <Message>(props: SectionLabelProps, h: HtmlBuilder<Message>): Html => {
  const size = props.size ?? "sm";
  return h.div(
    [],
    [
      h.h3(
        [
          h.Class(
            `flex items-center text-text-secondary ${size === "sm" ? "gap-0.5 text-sm font-semibold" : "gap-1 text-md font-semibold"}`,
          ),
        ],
        [
          props.title,
          ...(props.isRequired === true
            ? [h.span([h.Class("block text-text-brand-tertiary")], ["*"])]
            : []),
          ...(props.tooltip === undefined
            ? []
            : [
                h.button(
                  [
                    h.AriaLabel(props.tooltip),
                    h.Class(
                      "text-fg-quaternary outline-focus-ring transition duration-200 hover:text-fg-quaternary focus-visible:outline-2",
                    ),
                    h.Title(props.tooltip),
                    h.Type("button"),
                  ],
                  [helpIcon(h)],
                ),
              ]),
        ],
      ),
      ...(props.description === undefined
        ? []
        : [
            h.p(
              [h.Class(`text-text-tertiary ${size === "sm" ? "text-sm" : "text-md"}`)],
              [props.description],
            ),
          ]),
      ...(props.actions === undefined ? [] : [h.div([h.Class("mt-3 flex gap-2")], props.actions)]),
    ],
  );
};
