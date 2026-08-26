/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, mps/no-length-comparison, mps/prefer-arr-match -- The renderer keeps the upstream plain, modern, collapsible, and bounded roving-tab anatomies explicit. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export type CodeSnippetVariant = "plain" | "modern" | "tabs";

export interface CodeSnippetTab {
  readonly code: string;
  readonly id: string;
  readonly label: string;
}

export interface CodeSnippetProps<Message> {
  readonly code: string;
  readonly copied?: boolean;
  readonly expanded?: boolean;
  readonly focusedTab?: string;
  readonly language: string;
  readonly maxHeight?: number;
  readonly onCopy?: NoInfer<Message>;
  readonly onExpand?: NoInfer<Message>;
  readonly onFocusTab?: (id: string) => NoInfer<Message>;
  readonly onSelectTab?: (id: string) => NoInfer<Message>;
  readonly onToggleExpanded?: NoInfer<Message>;
  readonly selectedTab?: string;
  readonly showLineNumbers?: boolean;
  readonly tabs?: readonly CodeSnippetTab[];
  readonly variant?: CodeSnippetVariant;
}

const copyIcon = <Message>(copied: boolean, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-4"), h.Fill("none"), h.ViewBox("0 0 16 16")],
    [
      h.path([
        h.D(
          copied
            ? "m3.5 8 3 3 6-6"
            : "M5.5 5.5V4A1.5 1.5 0 0 1 7 2.5h5A1.5 1.5 0 0 1 13.5 4v5A1.5 1.5 0 0 1 12 10.5h-1.5m-6 3h5A1.5 1.5 0 0 0 11 12V7A1.5 1.5 0 0 0 9.5 5.5h-5A1.5 1.5 0 0 0 3 7v5a1.5 1.5 0 0 0 1.5 1.5Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.33"),
      ]),
    ],
  );

const expandIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-4"), h.Fill("none"), h.ViewBox("0 0 16 16")],
    [
      h.path([
        h.D("M6 2.5H2.5V6M10 2.5h3.5V6M6 13.5H2.5V10m7.5 3.5h3.5V10"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.33"),
      ]),
    ],
  );

const collapseGradient =
  "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.02) 4.7%, rgba(255,255,255,0.04) 8.9%, rgba(255,255,255,0.07) 12.8%, rgba(255,255,255,0.10) 16.56%, rgba(255,255,255,0.14) 20.37%, rgba(255,255,255,0.18) 24.4%, rgba(255,255,255,0.23) 28.83%, rgba(255,255,255,0.29) 33.84%, rgba(255,255,255,0.35) 39.6%, rgba(255,255,255,0.43) 46.3%, rgba(255,255,255,0.52) 54.1%, rgba(255,255,255,0.62) 63.2%, rgba(255,255,255,0.73) 73.76%, rgba(255,255,255,0.86) 85.97%, #fff 100%)";

const utilityButton = <Message>(
  label: string,
  message: NoInfer<Message>,
  icon: Html,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.AriaLabel(label),
      h.Class(
        "flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.OnClick(message),
      h.Title(label),
      h.Type("button"),
    ],
    [icon],
  );

const codeRows = <Message>(
  code: string,
  showLineNumbers: boolean,
  h: HtmlBuilder<Message>,
): readonly Html[] =>
  code
    .split("\n")
    .map((line, index, lines) =>
      h.span(
        [h.Class("block min-h-[22px] min-w-max")],
        [
          ...(showLineNumbers
            ? [
                h.span(
                  [
                    h.AriaHidden(true),
                    h.Class(
                      `${index === 0 ? "pt-4 md:pt-5" : ""} ${index === lines.length - 1 ? "pb-6 md:pb-5" : ""} sticky left-0 mr-4 inline-block w-12 border-r border-border-secondary bg-bg-secondary pr-4 text-right font-bold text-text-quaternary md:mr-5 md:w-[49px]`,
                    ),
                  ],
                  [String(index + 1)],
                ),
              ]
            : []),
          h.span([], [h.span([], [line])]),
        ],
      ),
    );

const snippetSurface = <Message>(
  props: CodeSnippetProps<Message>,
  code: string,
  insideTabs: boolean,
  h: HtmlBuilder<Message>,
): Html => {
  const showLineNumbers = props.showLineNumbers ?? true;
  const collapsible = props.maxHeight !== undefined;
  const expanded = props.expanded === true;
  const modern = insideTabs || props.variant === "modern";
  const surface = h.div(
    [
      h.Class(
        `group/code-snippet relative max-w-full overflow-clip rounded-xl bg-bg-primary ring-1 ${modern ? "shadow-lg ring-border-secondary-alt" : "ring-border-secondary"}`,
      ),
    ],
    [
      h.pre(
        [
          h.Class(
            `${showLineNumbers ? "" : "p-4"} ${collapsible && !expanded ? "overflow-y-hidden" : ""} ${collapsible ? "pb-12" : ""} m-0 overflow-x-auto font-mono text-sm leading-[22px] tracking-[0.028px] whitespace-pre text-text-primary`,
          ),
          ...(props.maxHeight === undefined || expanded
            ? []
            : [h.Style({ "max-height": `${String(props.maxHeight)}px` })]),
        ],
        [h.code([], [...codeRows(code, showLineNumbers, h)])],
      ),
      ...(collapsible && props.onToggleExpanded !== undefined
        ? [
            h.div(
              [
                h.Class(
                  `${expanded ? "sticky h-17" : "absolute h-47"} inset-x-0 bottom-0 flex items-end justify-center pb-6`,
                ),
                h.Style({ "background-image": collapseGradient }),
              ],
              [
                h.button(
                  [
                    h.Class(
                      "rounded-lg bg-bg-primary px-3.5 py-2 text-sm font-semibold text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                    ),
                    h.OnClick(props.onToggleExpanded),
                    h.Type("button"),
                  ],
                  [expanded ? "Show less" : "Show more"],
                ),
              ],
            ),
          ]
        : []),
      ...(props.onCopy === undefined && props.onExpand === undefined
        ? []
        : [
            h.div(
              [
                h.Class(
                  "absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 transition duration-100 ease-linear group-hover/code-snippet:opacity-100 focus-within:opacity-100",
                ),
              ],
              [
                ...(props.onExpand === undefined
                  ? []
                  : [utilityButton("Expand", props.onExpand, expandIcon(h), h)]),
                ...(props.onCopy === undefined
                  ? []
                  : [
                      utilityButton(
                        props.copied === true ? "Copied" : "Copy",
                        props.onCopy,
                        copyIcon(props.copied === true, h),
                        h,
                      ),
                    ]),
              ],
            ),
          ]),
    ],
  );
  return modern && !insideTabs
    ? h.div(
        [h.Class("rounded-[20px] bg-bg-secondary-alt p-2 ring-1 ring-border-secondary ring-inset")],
        [surface],
      )
    : surface;
};

export const codeSnippet = <Message>(
  props: CodeSnippetProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  if (props.variant !== "tabs") {
    return snippetSurface(props, props.code, false, h);
  }
  const tabs = props.tabs ?? [];
  const selected = tabs.find((tab) => tab.id === props.selectedTab) ?? tabs.at(0);
  const focused = tabs.find((tab) => tab.id === props.focusedTab) ?? selected;
  const focusMessage = props.onFocusTab;
  const code = selected?.code ?? props.code;
  return h.div(
    [
      h.Class(
        "group/code-tabs rounded-t-xl rounded-b-[20px] bg-bg-secondary-alt shadow-xs ring-1 ring-border-secondary ring-inset",
      ),
    ],
    [
      h.div(
        [h.Class("relative flex items-start")],
        [
          h.div(
            [
              h.AriaLabel("Code examples"),
              h.Class("flex flex-1 items-center overflow-auto px-3 py-2"),
              h.Role("tablist"),
            ],
            tabs.map((tab, index) =>
              h.button(
                [
                  h.AriaSelected(tab.id === selected?.id),
                  h.Class(
                    `z-10 flex cursor-pointer items-center justify-center rounded-md px-2 py-1 text-sm font-semibold whitespace-nowrap outline-focus-ring transition duration-100 ease-linear ${tab.id === selected?.id ? "text-text-primary" : "text-text-quaternary hover:text-text-primary"}`,
                  ),
                  h.DataAttribute("code-tab-id", tab.id),
                  h.Id(`code-tab-${tab.id}`),
                  ...(props.onSelectTab === undefined
                    ? []
                    : [h.OnClick(props.onSelectTab(tab.id))]),
                  ...(focusMessage === undefined
                    ? []
                    : [
                        h.OnFocus(focusMessage(tab.id)),
                        h.OnKeyDownFocus((key) => {
                          const delta = key === "ArrowRight" ? 1 : key === "ArrowLeft" ? -1 : 0;
                          if (delta === 0 || tabs.length === 0) {
                            return Option.none();
                          }
                          const next = tabs[(index + delta + tabs.length) % tabs.length];
                          return next === undefined
                            ? Option.none()
                            : Option.some({
                                focusSelector: `[data-code-tab-id="${next.id}"]`,
                                message: focusMessage(next.id),
                              });
                        }),
                      ]),
                  h.Role("tab"),
                  h.Tabindex(tab.id === focused?.id ? 0 : -1),
                  h.Type("button"),
                ],
                [tab.label],
              ),
            ),
          ),
          ...(props.onCopy === undefined
            ? []
            : [
                h.div(
                  [h.Class("flex shrink-0 items-center pt-2 pr-2")],
                  [
                    utilityButton(
                      props.copied === true ? "Copied" : "Copy",
                      props.onCopy,
                      copyIcon(props.copied === true, h),
                      h,
                    ),
                  ],
                ),
              ]),
        ],
      ),
      h.div(
        [
          h.AriaLabelledBy(selected === undefined ? "" : `code-tab-${selected.id}`),
          h.Class("px-2 pb-2"),
          h.Role("tabpanel"),
        ],
        [snippetSurface({ ...props, variant: "plain" }, code, true, h)],
      ),
    ],
  );
};
