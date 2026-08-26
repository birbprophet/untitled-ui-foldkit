/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The upstream placement table and optional event attributes stay explicit. */
import type { Html, HtmlBuilder } from "foldkit/html";

export type TooltipPlacement =
  | "top"
  | "top left"
  | "top right"
  | "top start"
  | "top end"
  | "bottom"
  | "bottom left"
  | "bottom right"
  | "bottom start"
  | "bottom end"
  | "left"
  | "right";

export interface TooltipProps<Message> {
  readonly arrow?: boolean;
  readonly description?: string;
  readonly id: string;
  readonly isDisabled?: boolean;
  readonly isOpen: boolean;
  readonly onClose: NoInfer<Message>;
  readonly onOpen: NoInfer<Message>;
  readonly placement?: TooltipPlacement;
  readonly title: string;
  readonly triggerLabel: string;
}

const positionClasses: Record<TooltipPlacement, string> = {
  bottom: "top-[calc(100%+6px)] right-[-0.125px] left-[0.125px] justify-center",
  "bottom end": "top-[calc(100%+6px)] right-[22.375px] left-[-22.375px] justify-center",
  "bottom left": "top-[calc(100%+6px)] right-[1.3125px] left-[-1.3125px] justify-center",
  "bottom right": "top-[calc(100%+6px)] right-[-1.625px] left-[1.625px] justify-center",
  "bottom start": "top-[calc(100%+6px)] right-[-22.6875px] left-[22.6875px] justify-center",
  left: "top-0 right-[calc(100%+5.53125px)] bottom-0 items-center justify-end",
  right: "top-0 bottom-0 left-[calc(100%+5.5px)] items-center justify-start",
  top: "right-[-0.125px] bottom-[calc(100%+6px)] left-[0.125px] justify-center",
  "top end": "right-[22.375px] bottom-[calc(100%+6px)] left-[-22.375px] justify-center",
  "top left": "right-[1.3125px] bottom-[calc(100%+6px)] left-[-1.3125px] justify-center",
  "top right": "right-[-1.625px] bottom-[calc(100%+6px)] left-[1.625px] justify-center",
  "top start": "right-[-22.6875px] bottom-[calc(100%+6px)] left-[22.6875px] justify-center",
};

const arrowClasses: Record<TooltipPlacement, string> = {
  bottom: "-top-2.5 left-[calc(50%-0.125px)] -translate-x-1/2 rotate-180",
  "bottom end": "-top-2.5 left-[calc(50%+22.375px)] -translate-x-1/2 rotate-180",
  "bottom left": "-top-2.5 left-[calc(50%+1.3125px)] -translate-x-1/2 rotate-180",
  "bottom right": "-top-2.5 left-[calc(50%-1.625px)] -translate-x-1/2 rotate-180",
  "bottom start": "-top-2.5 left-[calc(50%-22.6875px)] -translate-x-1/2 rotate-180",
  left: "top-1/2 -right-2.5 -translate-y-1/2 -rotate-90",
  right: "top-1/2 -left-2.5 -translate-y-1/2 rotate-90",
  top: "-bottom-2.5 left-[calc(50%-0.125px)] -translate-x-1/2",
  "top end": "-bottom-2.5 left-[calc(50%+22.375px)] -translate-x-1/2",
  "top left": "-bottom-2.5 left-[calc(50%+1.3125px)] -translate-x-1/2",
  "top right": "-bottom-2.5 left-[calc(50%-1.625px)] -translate-x-1/2",
  "top start": "-bottom-2.5 left-[calc(50%-22.6875px)] -translate-x-1/2",
};

const arrow = <Message>(placement: TooltipPlacement, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(`absolute size-2.5 fill-bg-primary-solid ${arrowClasses[placement]}`),
      h.ViewBox("0 0 100 100"),
    ],
    [h.path([h.D("M0,0 L35.858,35.858 Q50,50 64.142,35.858 L100,0 Z")])],
  );

export const tooltip = <Message>(props: TooltipProps<Message>, h: HtmlBuilder<Message>): Html => {
  const placement = props.placement ?? "top";
  const tooltipId = `${props.id}-tooltip`;
  const disabled = props.isDisabled === true;
  return h.div(
    [
      h.Class("relative inline-flex h-max w-max"),
      ...(disabled ? [] : [h.OnMouseEnter(props.onOpen), h.OnMouseLeave(props.onClose)]),
    ],
    [
      h.button(
        [
          h.Class(
            "group relative inline-flex h-max cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-bg-primary px-3 py-2 text-sm font-semibold text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary outline-border-brand transition duration-100 ease-linear before:absolute before:rounded-[7px] focus-visible:outline-2 focus-visible:outline-offset-2 ring-inset hover:bg-bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50",
          ),
          h.Disabled(disabled),
          h.Id(props.id),
          h.Type("button"),
          ...(props.isOpen ? [h.AriaDescribedBy(tooltipId)] : []),
          ...(disabled ? [] : [h.OnFocus(props.onOpen), h.OnBlur(props.onClose)]),
        ],
        [
          h.span(
            [h.Class("px-0.5 transition-inherit-all"), h.DataAttribute("text", "true")],
            [props.triggerLabel],
          ),
        ],
      ),
      ...(props.isOpen && !disabled
        ? [
            h.div(
              [h.Class(`absolute z-50 flex ${positionClasses[placement]}`)],
              [
                h.div(
                  [
                    h.Class(
                      `relative flex max-w-xs flex-col items-start gap-1 whitespace-nowrap rounded-lg bg-bg-primary-solid px-3 shadow-lg ${props.description === undefined ? "-ml-[0.1875px] py-2" : "py-3"}`,
                    ),
                    h.Id(tooltipId),
                    h.Role("tooltip"),
                  ],
                  [
                    h.span([h.Class("text-xs font-semibold text-white")], [props.title]),
                    ...(props.description === undefined
                      ? []
                      : [
                          h.span(
                            [h.Class("text-xs font-medium text-tooltip-supporting-text")],
                            [props.description],
                          ),
                        ]),
                    ...(props.arrow === true ? [arrow(placement, h)] : []),
                  ],
                ),
              ],
            ),
          ]
        : []),
    ],
  );
};
