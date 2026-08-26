/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/imperative-loops, mps/no-length-comparison, mps/prefer-arr-match -- The authenticated breadcrumb source has a bounded collapsed-path algorithm and three direct style branches. */
import type { Html, HtmlBuilder } from "foldkit/html";

export type BreadcrumbType = "text" | "text-line" | "button";

export interface BreadcrumbItem<Message> {
  readonly avatar?: Html;
  readonly href?: string;
  readonly icon?: Html;
  readonly id: string;
  readonly label: string;
  readonly selectMessage?: NoInfer<Message>;
}

export interface BreadcrumbsProps<Message> {
  readonly ariaLabel?: string;
  readonly divider?: "chevron" | "slash";
  readonly expandMessage: NoInfer<Message>;
  readonly isExpanded?: boolean;
  readonly items: readonly BreadcrumbItem<NoInfer<Message>>[];
  readonly maxVisibleItems?: number;
  readonly type?: BreadcrumbType;
}

const dividerIcon = <Message>(divider: "chevron" | "slash", h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-4 shrink-0 text-utility-neutral-300"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    divider === "slash"
      ? [
          h.path([
            h.D("M16 3 8 21"),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeWidth("2.25"),
          ]),
        ]
      : [
          h.path([
            h.D("m9 18 6-6-6-6"),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeLinejoin("round"),
            h.StrokeWidth("2.25"),
          ]),
        ],
  );

const rootClass = (type: BreadcrumbType, current: boolean): string => {
  const base =
    "group inline-flex items-center justify-center gap-1 rounded-md text-sm font-semibold whitespace-nowrap outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2";
  const button = type === "button" ? "p-1 hover:bg-bg-primary-hover" : "";
  let color = "text-text-quaternary hover:text-text-tertiary-hover";
  if (current) {
    color =
      type === "button"
        ? "bg-bg-primary-hover text-text-tertiary-hover"
        : "text-text-brand-secondary";
  }
  return `${base} ${button} ${color}`;
};

const visibleItems = <Message>(
  props: BreadcrumbsProps<Message>,
): readonly (BreadcrumbItem<Message> | "ellipsis")[] => {
  const max = props.maxVisibleItems ?? 4;
  if (max === 0 || props.items.length <= max || props.isExpanded === true) {
    return props.items;
  }
  const first = props.items.slice(0, Math.ceil(max / 2));
  const last = props.items.slice(-Math.floor((max - 1) / 2));
  return [...first, "ellipsis", ...last];
};

export const breadcrumbs = <Message>(
  props: BreadcrumbsProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const divider = props.divider ?? "chevron";
  const type = props.type ?? "text";
  const visible = visibleItems(props);
  const renderContent = (
    breadcrumbItem: BreadcrumbItem<Message> | "ellipsis",
    current: boolean,
  ): Html => {
    if (breadcrumbItem === "ellipsis") {
      return h.button(
        [
          h.AriaLabel("See all breadcrumb items"),
          h.Class(rootClass(type === "text-line" ? "text" : type, false)),
          h.OnClick(props.expandMessage),
          h.Type("button"),
        ],
        ["..."],
      );
    }
    if (breadcrumbItem.avatar !== undefined) {
      return h.a(
        [
          ...(current ? [h.AriaCurrent("page")] : []),
          h.Class(
            "flex items-center gap-1.5 rounded-lg text-sm font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.Href(breadcrumbItem.href ?? "#"),
        ],
        [
          h.div(
            [
              h.Class(
                "flex rounded-lg bg-bg-primary p-0.5 ring-[0.5px] ring-border-secondary ring-inset",
              ),
            ],
            [breadcrumbItem.avatar],
          ),
          breadcrumbItem.label,
        ],
      );
    }
    const content = [
      ...(breadcrumbItem.icon === undefined ? [] : [breadcrumbItem.icon]),
      h.span(
        [h.Class(`${current ? "max-w-full truncate" : ""} ${type === "button" ? "px-1" : ""}`)],
        [breadcrumbItem.label],
      ),
    ];
    const contentClass = rootClass(type === "text-line" ? "text" : type, current);
    if (current) {
      return h.span([h.AriaCurrent("page"), h.Class(contentClass)], content);
    }
    return h.a(
      [
        h.Class(contentClass),
        h.Href(breadcrumbItem.href ?? "#"),
        ...(breadcrumbItem.selectMessage === undefined
          ? []
          : [h.OnClick(breadcrumbItem.selectMessage)]),
      ],
      content,
    );
  };
  return h.nav(
    [h.AriaLabel(props.ariaLabel ?? "Breadcrumbs"), h.Class("min-w-0")],
    [
      h.ol(
        [
          h.Class(
            `relative flex ${type === "button" ? "gap-0.5 md:gap-1" : "gap-1.5 md:gap-2"} ${type === "text-line" ? "py-2 pl-2 after:pointer-events-none after:absolute after:inset-0 after:border-y after:border-border-secondary" : ""}`,
          ),
        ],
        visible.map((item, index) => {
          const current = index === visible.length - 1;
          return h.li(
            [
              h.Class(
                `flex items-center ${current ? "min-w-0 overflow-hidden" : ""} ${type === "button" ? "gap-0.5 md:gap-1" : "gap-1.5 md:gap-2"}`,
              ),
            ],
            [renderContent(item, current), ...(current ? [] : [dividerIcon(divider, h)])],
          );
        }),
      ),
    ],
  );
};
