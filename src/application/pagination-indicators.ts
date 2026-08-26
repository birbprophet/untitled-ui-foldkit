/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary -- The two upstream indicator variants are a closed visual table and event attributes remain local. */
import type { Html, HtmlBuilder } from "foldkit/html";

interface PaginationIndicatorProps<Message> {
  readonly framed?: boolean;
  readonly messageForPage: (page: number) => NoInfer<Message>;
  readonly page: number;
  readonly siblingCount?: number;
  readonly size?: "md" | "lg";
  readonly total: number;
}

export type PaginationLineProps<Message> = PaginationIndicatorProps<Message>;

export interface PaginationDotProps<Message> extends PaginationIndicatorProps<Message> {
  readonly isBrand?: boolean;
}

type PageItem =
  | Readonly<{ isCurrent: boolean; type: "page"; value: number }>
  | Readonly<{ key: number; type: "ellipsis" }>;

const range = (start: number, end: number): readonly number[] =>
  Array.from({ length: end - start + 1 }, (_, index) => index + start);

const pageItem = (pageNumber: number, current: number): PageItem => ({
  isCurrent: pageNumber === current,
  type: "page",
  value: pageNumber,
});

const paginationItems = (
  page: number,
  total: number,
  siblingCount: number,
): readonly PageItem[] => {
  const totalPageNumbers = siblingCount * 2 + 5;
  if (totalPageNumbers >= total) {
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

const renderIndicator = <Message>(
  props: PaginationIndicatorProps<Message> &
    Readonly<{ isBrand?: boolean; variant: "dot" | "line" }>,
  h: HtmlBuilder<Message>,
): Html => {
  const size = props.size ?? "md";
  const framed = props.framed ?? false;
  const dot = props.variant === "dot";
  const rootGap = dot ? (size === "md" ? "gap-3" : "gap-4") : size === "md" ? "gap-2" : "gap-3";
  const padding = framed ? (size === "md" ? "p-2" : "p-3") : "";
  const buttonSize = dot
    ? size === "md"
      ? "h-2 w-2 after:-inset-x-1.5 after:-inset-y-2"
      : "h-2.5 w-2.5 after:-inset-x-2 after:-inset-y-3"
    : size === "md"
      ? "h-1.5 w-full after:-inset-x-1.5 after:-inset-y-2"
      : "h-2 w-full after:-inset-x-2 after:-inset-y-3";
  const width = dot ? "" : size === "md" ? "w-10" : "w-14";
  return h.nav(
    [
      h.AriaLabel("Pagination Navigation"),
      h.Class(
        `flex h-max w-max ${rootGap} ${padding} ${framed ? "rounded-full bg-alpha-white/90 backdrop-blur" : ""}`,
      ),
    ],
    paginationItems(props.page, props.total, props.siblingCount ?? 1).map((item) =>
      item.type === "ellipsis"
        ? h.span([h.AriaHidden(true)])
        : h.button([
            h.AriaCurrent(item.isCurrent ? "page" : "false"),
            h.AriaLabel(`Page ${String(item.value)}`),
            h.Class(
              `relative cursor-pointer rounded-full bg-bg-quaternary outline-focus-ring after:absolute focus-visible:outline-2 focus-visible:outline-offset-2 ${buttonSize} ${width} ${item.isCurrent ? "bg-fg-brand-primary_alt" : ""} ${dot && props.isBrand === true ? "bg-fg-brand-secondary" : ""} ${dot && props.isBrand === true && item.isCurrent ? "bg-fg-white" : ""}`,
            ),
            h.OnClick(props.messageForPage(item.value)),
            h.Type("button"),
          ]),
    ),
  );
};

export const paginationLine = <Message>(
  props: PaginationLineProps<Message>,
  h: HtmlBuilder<Message>,
): Html => renderIndicator({ ...props, variant: "line" }, h);

export const paginationDot = <Message>(
  props: PaginationDotProps<Message>,
  h: HtmlBuilder<Message>,
): Html => renderIndicator({ ...props, variant: "dot" }, h);
