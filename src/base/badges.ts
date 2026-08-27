/* oxlint-disable effect/noReturnInArrow, effect/noTernary, effect/noSpread, eslint/complexity, eslint/no-nested-ternary, unicorn/no-nested-ternary -- Badge anatomy follows the upstream closed variant tables. */
import type { Html, HtmlBuilder } from "foldkit/html";

export type BadgeType = "pill-color" | "color" | "modern";
export type BadgeSize = "sm" | "md" | "lg";
export type BadgeColor =
  | "gray"
  | "brand"
  | "error"
  | "warning"
  | "success"
  | "slate"
  | "sky"
  | "blue"
  | "indigo"
  | "purple"
  | "pink"
  | "orange";
export type BadgeAdornment =
  | "none"
  | "dot"
  | "leading-icon"
  | "trailing-icon"
  | "image"
  | "action"
  | "icon-only";

export interface BadgeProps<Message> {
  readonly actionLabel?: string;
  readonly adornment?: BadgeAdornment;
  readonly color?: BadgeColor;
  readonly imageAlt?: string;
  readonly imageSrc?: string;
  readonly iconElement?: Html;
  readonly label: string;
  readonly onAction?: NoInfer<Message>;
  readonly size?: BadgeSize;
  readonly type?: BadgeType;
}

const colors: Record<
  BadgeColor,
  { readonly addon: string; readonly action: string; readonly root: string }
> = {
  blue: {
    action: "text-utility-blue-400 hover:bg-utility-blue-100 hover:text-utility-blue-500",
    addon: "text-utility-blue-500",
    root: "bg-utility-blue-50 text-utility-blue-700 ring-utility-blue-200",
  },
  brand: {
    action: "text-utility-brand-400 hover:bg-utility-brand-100 hover:text-utility-brand-500",
    addon: "text-utility-brand-500",
    root: "bg-utility-brand-50 text-utility-brand-700 ring-utility-brand-200",
  },
  error: {
    action: "text-utility-red-400 hover:bg-utility-red-100 hover:text-utility-red-500",
    addon: "text-utility-red-500",
    root: "bg-utility-red-50 text-utility-red-700 ring-utility-red-200",
  },
  gray: {
    action: "text-utility-neutral-400 hover:bg-utility-neutral-100 hover:text-utility-neutral-500",
    addon: "text-utility-neutral-500",
    root: "bg-utility-neutral-50 text-utility-neutral-700 ring-utility-neutral-200",
  },
  indigo: {
    action: "text-utility-indigo-400 hover:bg-utility-indigo-100 hover:text-utility-indigo-500",
    addon: "text-utility-indigo-500",
    root: "bg-utility-indigo-50 text-utility-indigo-700 ring-utility-indigo-200",
  },
  orange: {
    action: "text-utility-orange-400 hover:bg-utility-orange-100 hover:text-utility-orange-500",
    addon: "text-utility-orange-500",
    root: "bg-utility-orange-50 text-utility-orange-700 ring-utility-orange-200",
  },
  pink: {
    action: "text-utility-pink-400 hover:bg-utility-pink-100 hover:text-utility-pink-500",
    addon: "text-utility-pink-500",
    root: "bg-utility-pink-50 text-utility-pink-700 ring-utility-pink-200",
  },
  purple: {
    action: "text-utility-purple-400 hover:bg-utility-purple-100 hover:text-utility-purple-500",
    addon: "text-utility-purple-500",
    root: "bg-utility-purple-50 text-utility-purple-700 ring-utility-purple-200",
  },
  sky: {
    action: "text-utility-sky-400 hover:bg-utility-sky-100 hover:text-utility-sky-500",
    addon: "text-utility-sky-500",
    root: "bg-utility-sky-50 text-utility-sky-700 ring-utility-sky-200",
  },
  slate: {
    action: "text-utility-slate-400 hover:bg-utility-slate-100 hover:text-utility-slate-500",
    addon: "text-utility-slate-500",
    root: "bg-utility-slate-50 text-utility-slate-700 ring-utility-slate-200",
  },
  success: {
    action: "text-utility-green-400 hover:bg-utility-green-100 hover:text-utility-green-500",
    addon: "text-utility-green-500",
    root: "bg-utility-green-50 text-utility-green-700 ring-utility-green-200",
  },
  warning: {
    action: "text-utility-yellow-400 hover:bg-utility-yellow-100 hover:text-utility-yellow-500",
    addon: "text-utility-yellow-500",
    root: "bg-utility-yellow-50 text-utility-yellow-700 ring-utility-yellow-200",
  },
};

const baseByType: Record<BadgeType, string> = {
  color: "size-max flex items-center whitespace-nowrap rounded-md ring-1 ring-inset",
  modern:
    "size-max flex items-center whitespace-nowrap rounded-md bg-bg-primary text-text-secondary shadow-xs ring-1 ring-border-primary ring-inset",
  "pill-color": "size-max flex items-center whitespace-nowrap rounded-full ring-1 ring-inset",
};

const plainSizes: Record<BadgeType, Record<BadgeSize, string>> = {
  color: {
    lg: "rounded-lg px-2.5 py-1 text-sm font-medium",
    md: "px-2 py-0.5 text-sm font-medium",
    sm: "px-1.5 py-0.5 text-xs font-medium",
  },
  modern: {
    lg: "rounded-lg px-2.5 py-1 text-sm font-medium",
    md: "px-2 py-0.5 text-sm font-medium",
    sm: "px-1.5 py-0.5 text-xs font-medium",
  },
  "pill-color": {
    lg: "px-3 py-1 text-sm font-medium",
    md: "px-2.5 py-0.5 text-sm font-medium",
    sm: "px-2 py-0.5 text-xs font-medium",
  },
};

const adornedSize = (type: BadgeType, size: BadgeSize, adornment: BadgeAdornment): string => {
  const round = type === "pill-color";
  if (adornment === "icon-only") {
    return size === "lg" ? "p-2" : size === "md" ? "p-1.5" : "p-1.25";
  }
  if (adornment === "dot") {
    return round
      ? size === "lg"
        ? "gap-1.5 py-1 pl-2.5 pr-3 text-sm font-medium"
        : size === "md"
          ? "gap-1.5 py-0.5 pl-2 pr-2.5 text-sm font-medium"
          : "gap-1 py-0.5 pl-1.5 pr-2 text-xs font-medium"
      : size === "lg"
        ? "gap-1.5 rounded-lg px-2.5 py-1 text-sm font-medium"
        : size === "md"
          ? "gap-1.5 px-2 py-0.5 text-sm font-medium"
          : "gap-1 px-1.5 py-0.5 text-xs font-medium";
  }
  if (adornment === "action") {
    return round
      ? size === "lg"
        ? "gap-0.5 py-1 pl-3 pr-1.5 text-sm font-medium"
        : size === "md"
          ? "gap-0.5 py-0.5 pl-2.5 pr-1 text-sm font-medium"
          : "gap-0.5 py-0.5 pl-2 pr-0.75 text-xs font-medium"
      : size === "lg"
        ? "gap-0.5 rounded-lg py-1 pl-2.5 pr-1.5 text-sm font-medium"
        : size === "md"
          ? "gap-0.5 py-0.5 pl-2 pr-1 text-sm font-medium"
          : "gap-0.5 py-0.5 pl-1.5 pr-0.75 text-xs font-medium";
  }
  if (adornment === "leading-icon") {
    return round
      ? size === "lg"
        ? "gap-1 py-1 pr-3 pl-2.5 text-sm font-medium"
        : size === "md"
          ? "gap-1 py-0.5 pr-2.5 pl-2 text-sm font-medium"
          : "gap-0.5 py-0.5 pr-2 pl-1.5 text-xs font-medium"
      : size === "lg"
        ? "gap-1 rounded-lg py-1 pr-2.5 pl-2 text-sm font-medium"
        : size === "md"
          ? "gap-1 py-0.5 pr-2 pl-1.5 text-sm font-medium"
          : "gap-0.5 py-0.5 pr-2 pl-1.5 text-xs font-medium";
  }
  if (adornment === "trailing-icon") {
    return round
      ? size === "lg"
        ? "gap-1 py-1 pr-2.5 pl-3 text-sm font-medium"
        : size === "md"
          ? "gap-1 py-0.5 pr-2 pl-2.5 text-sm font-medium"
          : "gap-0.5 py-0.5 pr-1.5 pl-2 text-xs font-medium"
      : size === "lg"
        ? "gap-1 rounded-lg py-1 pr-2 pl-2.5 text-sm font-medium"
        : size === "md"
          ? "gap-1 py-0.5 pr-1.5 pl-2 text-sm font-medium"
          : "gap-0.5 py-0.5 pr-1.5 pl-2 text-xs font-medium";
  }
  return round
    ? size === "lg"
      ? "gap-1 py-1 px-2.5 text-sm font-medium"
      : size === "md"
        ? "gap-1 py-0.5 px-2 text-sm font-medium"
        : "gap-0.5 py-0.5 px-1.5 text-xs font-medium"
    : size === "lg"
      ? "gap-1 rounded-lg py-1 px-2 text-sm font-medium"
      : size === "md"
        ? "gap-1 py-0.5 px-1.5 text-sm font-medium"
        : "gap-0.5 py-0.5 px-1.5 text-xs font-medium";
};

const smallIcon = <Message>(kind: "check" | "close", h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.Class("size-3 stroke-[3px]"),
      h.DataAttribute("icon", kind),
      h.Fill("none"),
      h.ViewBox("0 0 12 12"),
    ],
    [
      h.path([
        h.D(kind === "check" ? "m2.5 6 2.2 2.2L9.5 3.5" : "m3 3 6 6m0-6L3 9"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
      ]),
    ],
  );

export const badge = <Message>(props: BadgeProps<Message>, h: HtmlBuilder<Message>): Html => {
  const type = props.type ?? "pill-color";
  const size = props.size ?? "md";
  const color = props.color ?? "gray";
  const adornment = props.adornment ?? "none";
  const palette = colors[color];
  const root = `${baseByType[type]} ${adornment === "none" ? plainSizes[type][size] : adornedSize(type, size, adornment)} ${type === "modern" ? "" : palette.root}`;
  const label = adornment === "icon-only" ? [] : [props.label];
  const leading: Html[] = [];
  const trailing: Html[] = [];
  if (adornment === "dot") {
    leading.push(
      h.svg(
        [
          h.AriaHidden(true),
          h.Class(`size-2 shrink-0 ${palette.addon}`),
          h.Fill("none"),
          h.ViewBox("0 0 8 8"),
        ],
        [
          h.circle([
            h.Cx("4"),
            h.Cy("4"),
            h.Fill("currentColor"),
            h.R("2.5"),
            h.Stroke("currentColor"),
          ]),
        ],
      ),
    );
  }
  if (adornment === "leading-icon" || adornment === "icon-only") {
    leading.push(props.iconElement ?? smallIcon("check", h));
  }
  if (adornment === "trailing-icon") {
    trailing.push(smallIcon("check", h));
  }
  if (adornment === "image" && props.imageSrc !== undefined) {
    leading.push(
      h.img([
        h.Class("size-4 max-w-none rounded-full"),
        h.Src(props.imageSrc),
        h.Alt(props.imageAlt ?? ""),
      ]),
    );
  }
  if (adornment === "action") {
    trailing.push(
      h.button(
        [
          h.Class(
            `flex cursor-pointer items-center justify-center p-0.5 outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 ${type === "pill-color" ? "rounded-full" : "rounded-[3px]"} ${palette.action}`,
          ),
          h.Type("button"),
          h.AriaLabel(props.actionLabel ?? `Remove ${props.label}`),
          ...(props.onAction === undefined ? [] : [h.OnClick(props.onAction)]),
        ],
        [smallIcon("close", h)],
      ),
    );
  }
  return h.span(
    [h.Class(root), ...(adornment === "icon-only" ? [h.AriaLabel(props.label)] : [])],
    [...leading, ...label, ...trailing],
  );
};

export type BadgeGroupSize = "md" | "lg";
export type BadgeGroupColor = "brand" | "warning" | "error" | "gray" | "success";
export interface BadgeGroupProps {
  readonly addonText: string;
  readonly align?: "leading" | "trailing";
  readonly color?: BadgeGroupColor;
  readonly iconTrailing?: boolean;
  readonly label?: string;
  readonly size?: BadgeGroupSize;
  readonly theme?: "light" | "modern";
}

const groupPalette: Record<BadgeGroupColor, { readonly dot: string; readonly light: string }> = {
  brand: {
    dot: "bg-utility-brand-500 outline-utility-brand-100",
    light:
      "bg-utility-brand-50 text-utility-brand-700 ring-utility-brand-200 hover:bg-utility-brand-100",
  },
  error: {
    dot: "bg-utility-red-500 outline-utility-red-100",
    light: "bg-utility-red-50 text-utility-red-700 ring-utility-red-200 hover:bg-utility-red-100",
  },
  gray: {
    dot: "bg-utility-neutral-500 outline-utility-neutral-100",
    light:
      "bg-utility-neutral-50 text-utility-neutral-700 ring-utility-neutral-200 hover:bg-utility-neutral-100",
  },
  success: {
    dot: "bg-utility-green-500 outline-utility-green-100",
    light:
      "bg-utility-green-50 text-utility-green-700 ring-utility-green-200 hover:bg-utility-green-100",
  },
  warning: {
    dot: "bg-utility-yellow-500 outline-utility-yellow-100",
    light:
      "bg-utility-yellow-50 text-utility-yellow-700 ring-utility-yellow-200 hover:bg-utility-yellow-100",
  },
};

const arrow = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.Class("size-4"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
      h.Stroke("currentColor"),
      h.StrokeWidth("2"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.AriaHidden(true),
    ],
    [h.path([h.D("M5 12h14m0 0-7-7m7 7-7 7")])],
  );

export const badgeGroup = <Message>(props: BadgeGroupProps, h: HtmlBuilder<Message>): Html => {
  const size = props.size ?? "md";
  const color = props.color ?? "brand";
  const theme = props.theme ?? "light";
  const align = props.align ?? "leading";
  const showIcon = props.iconTrailing ?? true;
  const palette = groupPalette[color];
  const root =
    theme === "modern"
      ? "rounded-[10px] bg-bg-primary text-text-secondary shadow-xs ring-1 ring-border-primary ring-inset hover:bg-bg-secondary"
      : `rounded-full ring-1 ring-inset ${palette.light}`;
  const addon =
    theme === "modern"
      ? "rounded-md bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset"
      : "rounded-full bg-bg-primary text-current ring-1 ring-inset";
  const labelSpacing = props.label === undefined ? "" : align === "leading" ? "mr-2" : "ml-2";
  const addonSize =
    align === "leading"
      ? size === "lg"
        ? `${theme === "modern" ? "gap-1.5 px-2" : "px-2.5"} py-0.5 ${labelSpacing}`
        : `${theme === "modern" ? "gap-1 px-1.5" : "px-2"} py-0.5 ${labelSpacing}`
      : size === "lg"
        ? `${theme === "modern" ? "pr-1.5 pl-2" : "pr-2 pl-2.5"} py-0.5 ${labelSpacing}`
        : `py-0.5 pr-1.5 pl-2 ${labelSpacing}`;
  const rootSize =
    align === "leading"
      ? "pr-2 pl-1"
      : size === "lg"
        ? "pr-1 pl-3"
        : `pr-1 ${theme === "modern" ? "pl-2.5" : "pl-3"}`;
  const dot = h.span([
    h.Class(`inline-block size-2 shrink-0 rounded-full outline-3 -outline-offset-1 ${palette.dot}`),
    h.AriaHidden(true),
  ]);
  const addonNode = h.span(
    [h.Class(`inline-flex items-center ${addon} ${addonSize}`)],
    [
      ...(theme === "modern" && align === "leading" ? [dot] : []),
      props.addonText,
      ...(align === "trailing" && showIcon ? [arrow(h)] : []),
    ],
  );
  return h.div(
    [
      h.Class(
        `inline-flex w-max cursor-pointer items-center transition duration-100 ease-linear ${root} ${size === "lg" ? "py-1 text-sm font-medium" : "py-1 text-xs font-medium"} ${rootSize}`,
      ),
    ],
    align === "leading"
      ? [
          addonNode,
          ...(props.label === undefined ? [] : [h.span([], [props.label])]),
          ...(showIcon ? [h.span([h.Class("ml-1")], [arrow(h)])] : []),
        ]
      : [
          ...(theme === "modern" ? [dot] : []),
          ...(props.label === undefined ? [] : [h.span([], [props.label])]),
          addonNode,
        ],
  );
};
