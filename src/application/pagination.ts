/* oxlint-disable effect/noReturnInArrow, effect/noTernary, effect/noSpread, eslint/no-nested-ternary, eslint/complexity -- Upstream exposes six visual arrangements and a closed pagination item algorithm. */
import type { Html, HtmlBuilder } from "foldkit/html";

export type PaginationVariant =
  | "page-default"
  | "page-minimal-center"
  | "card-default"
  | "card-minimal"
  | "button-group"
  | "card-advanced";
export type PaginationAlign = "left" | "center" | "right" | "space-between";

export interface PaginationProps<Message> {
  readonly align?: PaginationAlign;
  readonly messageForPage: (page: number) => NoInfer<Message>;
  readonly messageForPageSize?: (pageSize: number) => NoInfer<Message>;
  readonly page?: number;
  readonly pageSize?: number;
  readonly rounded?: boolean;
  readonly siblingCount?: number;
  readonly total?: number;
  readonly variant?: PaginationVariant;
}

type PageItem =
  | Readonly<{ isCurrent: boolean; type: "page"; value: number }>
  | Readonly<{ key: number; type: "ellipsis" }>;

const range = (start: number, end: number): readonly number[] =>
  Array.from({ length: end - start + 1 }, (_, index) => index + start);
const pageItem = (pageNumber: number, page: number): PageItem => ({
  isCurrent: pageNumber === page,
  type: "page",
  value: pageNumber,
});
const items = (page: number, total: number, siblingCount: number): readonly PageItem[] => {
  const visible = siblingCount * 2 + 5;
  if (visible >= total) {
    return range(1, total).map((value) => pageItem(value, page));
  }
  const left = Math.max(page - siblingCount, 1);
  const right = Math.min(page + siblingCount, total);
  const showLeft = left > 2;
  const showRight = right < total - 1;
  if (!showLeft && showRight) {
    const count = siblingCount * 2 + 3;
    return [
      ...range(1, count).map((value) => pageItem(value, page)),
      { key: count + 1, type: "ellipsis" },
      pageItem(total, page),
    ];
  }
  if (showLeft && !showRight) {
    const count = siblingCount * 2 + 3;
    return [
      pageItem(1, page),
      { key: total - count, type: "ellipsis" },
      ...range(total - count + 1, total).map((value) => pageItem(value, page)),
    ];
  }
  return [
    pageItem(1, page),
    { key: left - 1, type: "ellipsis" },
    ...range(left, right).map((value) => pageItem(value, page)),
    { key: right + 1, type: "ellipsis" },
    pageItem(total, page),
  ];
};

const arrow = <Message>(
  direction: "left" | "right" | "first" | "last",
  h: HtmlBuilder<Message>,
): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0"),
      h.Fill("none"),
      h.ViewBox(direction === "first" || direction === "last" ? "0 0 24 24" : "0 0 20 20"),
    ],
    [
      h.path([
        h.D(
          direction === "left"
            ? "M15.833 10H4.167m0 0L10 15.833M4.167 10 10 4.167"
            : direction === "right"
              ? "M4.167 10h11.666m0 0L10 4.167M15.833 10 10 15.833"
              : direction === "first"
                ? "m18 17-5-5 5-5m-7 10-5-5 5-5"
                : "m6 17 5-5-5-5m7 10 5-5-5-5",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth(direction === "first" || direction === "last" ? "2" : "1.67"),
      ]),
    ],
  );

const control = <Message>(
  direction: "left" | "right" | "first" | "last",
  label: string,
  page: number,
  disabled: boolean,
  appearance: "link" | "secondary" | "group",
  message: Message,
  h: HtmlBuilder<Message>,
): Html => {
  const secondary =
    "bg-bg-primary text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset hover:bg-bg-primary-hover";
  return h.button(
    [
      h.AriaLabel(
        label === ""
          ? `${direction === "left" || direction === "first" ? "Previous" : "Next"} Page`
          : label,
      ),
      h.Class(
        `flex h-9 cursor-pointer items-center justify-center gap-1 text-sm font-semibold outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:text-text-disabled ${appearance === "link" ? "rounded px-0 text-text-tertiary hover:text-text-tertiary-hover" : appearance === "group" ? "-mr-px -ml-px min-w-9 border border-border-primary bg-bg-primary px-3.5 first:ml-0 first:rounded-l-lg last:rounded-r-lg hover:bg-bg-primary-hover" : `rounded-lg px-3.5 ${secondary}`} ${label === "" ? "w-9 px-0" : ""}`,
      ),
      h.Disabled(disabled),
      h.OnClick(message),
      h.Type("button"),
      h.Value(String(page)),
    ],
    direction === "left" || direction === "first"
      ? [arrow(direction, h), ...(label === "" ? [] : [label])]
      : [...(label === "" ? [] : [label]), arrow(direction, h)],
  );
};

const pageButtons = <Message>(
  props: PaginationProps<Message>,
  page: number,
  total: number,
  grouped: boolean,
  h: HtmlBuilder<Message>,
): readonly Html[] =>
  items(page, total, props.siblingCount ?? 1).map((item) =>
    item.type === "ellipsis"
      ? h.span(
          [
            h.AriaHidden(true),
            h.Class(
              grouped
                ? "-ml-px flex size-9 items-center justify-center border border-border-primary bg-bg-primary text-text-tertiary"
                : "flex size-9 shrink-0 items-center justify-center text-text-tertiary",
            ),
          ],
          ["…"],
        )
      : h.button(
          [
            h.AriaCurrent(item.isCurrent ? "page" : "false"),
            h.AriaLabel(`Page ${String(item.value)}`),
            h.Class(
              grouped
                ? `-ml-px flex size-9 cursor-pointer items-center justify-center border border-border-primary bg-bg-primary text-sm font-semibold text-text-secondary outline-focus-ring hover:bg-bg-primary-hover focus-visible:z-10 focus-visible:outline-2 ${item.isCurrent ? "bg-bg-active" : ""}`
                : `flex size-9 cursor-pointer items-center justify-center p-3 text-sm font-medium text-text-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-text-secondary focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 ${props.rounded === true ? "rounded-full" : "rounded-lg"} ${item.isCurrent ? "bg-bg-primary-hover text-text-secondary" : ""}`,
            ),
            h.OnClick(props.messageForPage(item.value)),
            h.Type("button"),
          ],
          [String(item.value)],
        ),
  );

const pageText = <Message>(page: number, total: number, h: HtmlBuilder<Message>): Html =>
  h.span(
    [h.Class("flex justify-center text-sm whitespace-pre text-fg-secondary")],
    [
      "Page ",
      h.span([h.Class("font-medium")], [String(page)]),
      " of ",
      h.span([h.Class("font-medium")], [String(total)]),
    ],
  );

const plainControl = <Message>(
  label: "Next" | "Previous",
  disabled: boolean,
  message: Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.Class(
        "flex h-9 cursor-pointer items-center justify-center rounded-lg bg-bg-primary px-3.5 text-sm font-semibold text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:text-text-disabled",
      ),
      h.Disabled(disabled),
      h.OnClick(message),
      h.Type("button"),
    ],
    [label],
  );

const pageSizeSelect = <Message>(
  props: PaginationProps<Message>,
  longLabel: boolean,
  h: HtmlBuilder<Message>,
): Html => {
  const { messageForPageSize } = props;
  return h.div(
    [h.Class("relative")],
    [
      h.select(
        [
          h.AriaLabel("Page Size"),
          h.Class(
            `h-9 appearance-none rounded-lg bg-bg-primary py-2 pr-8 pl-3 text-sm font-semibold text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary outline-focus-ring focus-visible:outline-2 ${longLabel ? "w-31" : "w-15"}`,
          ),
          ...(messageForPageSize === undefined
            ? []
            : [h.OnChange((pageSize: string) => messageForPageSize(Number(pageSize)))]),
          h.Value(String(props.pageSize ?? 10)),
        ],
        [10, 25, 50, 100].map((size) =>
          h.option(
            [h.Value(String(size))],
            [longLabel ? `${String(size)} per page` : String(size)],
          ),
        ),
      ),
      h.svg(
        [
          h.AriaHidden(true),
          h.Class("pointer-events-none absolute top-2.5 right-2.5 size-4 text-fg-quaternary"),
          h.Fill("none"),
          h.ViewBox("0 0 16 16"),
        ],
        [
          h.path([
            h.D("m4 6 4 4 4-4"),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeLinejoin("round"),
            h.StrokeWidth("1.33"),
          ]),
        ],
      ),
    ],
  );
};

export const pagination = <Message>(
  props: PaginationProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const page = props.page ?? 1;
  const total = props.total ?? 10;
  const variant = props.variant ?? "page-default";
  const previous = props.messageForPage(Math.max(1, page - 1));
  const next = props.messageForPage(Math.min(total, page + 1));
  const previousButton = (appearance: "link" | "secondary", text = true) =>
    control("left", text ? "Previous" : "", page - 1, page <= 1, appearance, previous, h);
  const nextButton = (appearance: "link" | "secondary", text = true) =>
    control("right", text ? "Next" : "", page + 1, page >= total, appearance, next, h);
  if (variant === "card-minimal") {
    const align = props.align === "center" || props.align === "right" ? props.align : "left";
    return h.div(
      [h.Class("border-t border-border-secondary px-4 py-3 md:px-6 md:pt-3 md:pb-4")],
      [
        h.nav(
          [h.AriaLabel("Pagination"), h.Class("flex items-center justify-between md:hidden")],
          [
            plainControl("Previous", page <= 1, previous, h),
            pageText(page, total, h),
            plainControl("Next", page >= total, next, h),
          ],
        ),
        h.nav(
          [
            h.AriaLabel("Pagination"),
            h.Class(
              `hidden items-center gap-3 md:flex ${align === "center" ? "justify-between" : ""}`,
            ),
          ],
          [
            h.div(
              [h.Class(align === "center" ? "flex flex-1 justify-start" : "")],
              [plainControl("Previous", page <= 1, previous, h)],
            ),
            h.div(
              [
                h.Class(
                  `flex items-center gap-3 ${align === "right" ? "order-first mr-auto" : ""} ${align === "left" ? "order-last ml-auto flex-row-reverse" : ""}`,
                ),
              ],
              [
                h.span(
                  [h.Class("text-sm font-medium text-fg-secondary")],
                  [`Page ${String(page)} of ${String(total)}`],
                ),
                pageSizeSelect(props, true, h),
              ],
            ),
            h.div(
              [h.Class(align === "center" ? "flex flex-1 justify-end" : "")],
              [plainControl("Next", page >= total, next, h)],
            ),
          ],
        ),
      ],
    );
  }
  if (variant === "button-group") {
    const align = props.align === "center" || props.align === "right" ? props.align : "left";
    return h.div(
      [
        h.Class(
          `flex border-t border-border-secondary px-4 py-3 md:px-6 md:pt-3 md:pb-4 ${align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"}`,
        ),
      ],
      [
        h.nav(
          [h.AriaLabel("Pagination Navigation"), h.Class("flex")],
          [
            control("left", "Previous", page - 1, page <= 1, "group", previous, h),
            ...pageButtons(props, page, total, true, h),
            control("right", "Next", page + 1, page >= total, "group", next, h),
          ],
        ),
      ],
    );
  }
  if (variant === "card-advanced") {
    const centered = props.align === "center";
    return h.div(
      [h.Class("border-t border-border-secondary px-4 py-3 md:px-6 md:pt-3 md:pb-4")],
      [
        h.nav(
          [
            h.AriaLabel("Pagination Navigation"),
            h.Class(`flex items-center gap-3 ${centered ? "justify-between" : ""}`),
          ],
          [
            h.div(
              [
                h.Class(
                  "hidden items-center gap-2 text-sm font-medium whitespace-nowrap text-fg-secondary md:flex",
                ),
              ],
              [
                "Page",
                h.input([
                  h.AriaLabel("Page"),
                  h.Class(
                    "h-9 w-9 rounded-lg bg-bg-primary px-2 text-center shadow-xs-skeuomorphic ring-1 ring-border-primary",
                  ),
                  h.Value(String(page)),
                ]),
                `of ${String(total)}`,
              ],
            ),
            h.hr([
              h.Class(
                `mx-1 hidden h-4 w-px border-l border-border-primary md:block ${centered ? "md:hidden" : ""}`,
              ),
            ]),
            h.div(
              [h.Class(`hidden items-center gap-2 md:flex ${centered ? "order-last" : ""}`)],
              [
                h.span(
                  [h.Class("text-sm font-medium whitespace-nowrap text-text-secondary")],
                  ["Rows per page"],
                ),
                pageSizeSelect(props, false, h),
              ],
            ),
            h.div(
              [
                h.Class(
                  `flex flex-1 items-center gap-4 md:ml-auto md:justify-end ${centered ? "md:justify-center" : ""}`,
                ),
              ],
              [
                h.div(
                  [h.Class("flex gap-2")],
                  [
                    control("first", "", 1, page <= 1, "secondary", props.messageForPage(1), h),
                    previousButton("secondary", false),
                  ],
                ),
                h.div(
                  [h.Class("hidden justify-center gap-0.5 md:flex")],
                  pageButtons(props, page, total, false, h),
                ),
                h.div(
                  [h.Class("flex flex-1 justify-center md:hidden")],
                  [pageText(page, total, h)],
                ),
                h.div(
                  [h.Class("flex gap-2")],
                  [
                    control(
                      "last",
                      "",
                      total,
                      page >= total,
                      "secondary",
                      props.messageForPage(total),
                      h,
                    ),
                    nextButton("secondary", false),
                  ],
                ),
              ],
            ),
          ],
        ),
      ],
    );
  }
  if (variant === "page-default") {
    return h.nav(
      [
        h.AriaLabel("Pagination Navigation"),
        h.Class(
          "flex w-full items-center justify-between gap-3 border-t border-border-secondary pt-4 md:pt-5",
        ),
      ],
      [
        h.div([h.Class("hidden flex-1 justify-start md:flex")], [previousButton("link")]),
        h.div([h.Class("md:hidden")], [previousButton("secondary", false)]),
        h.div(
          [h.Class("hidden justify-center gap-0.5 md:flex")],
          pageButtons(props, page, total, false, h),
        ),
        h.div([h.Class("md:hidden")], [pageText(page, total, h)]),
        h.div([h.Class("hidden flex-1 justify-end md:flex")], [nextButton("link")]),
        h.div([h.Class("md:hidden")], [nextButton("secondary", false)]),
      ],
    );
  }
  const minimal = variant === "page-minimal-center";
  const card = variant === "card-default";
  return h.nav(
    [
      h.AriaLabel("Pagination Navigation"),
      h.Class(
        `flex w-full items-center justify-between gap-3 border-t border-border-secondary ${card ? "px-4 py-3 md:px-6 md:pt-3 md:pb-4" : "pt-4 md:pt-5"}`,
      ),
    ],
    [
      h.div(
        [h.Class("flex flex-1 justify-start")],
        [previousButton(minimal || card ? "secondary" : "link")],
      ),
      h.div(
        [h.Class("hidden justify-center gap-0.5 md:flex")],
        pageButtons(props, page, total, false, h),
      ),
      h.div([h.Class("md:hidden")], [pageText(page, total, h)]),
      h.div(
        [h.Class("flex flex-1 justify-end")],
        [nextButton(minimal || card ? "secondary" : "link")],
      ),
    ],
  );
};
