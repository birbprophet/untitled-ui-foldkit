/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/prefer-option-over-null -- Shared dropdown menu primitives for Untitled UI marketing header navigation. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";
import { button } from "../base/button.ts";

export interface MarketingDropdownMenuItem {
  readonly badgeLabel?: string;
  readonly href: string;
  readonly iconPath: string;
  readonly id: string;
  readonly subtitle?: string;
  readonly title: string;
}

export interface MarketingDropdownMenuColumn {
  readonly id: string;
  readonly items: readonly MarketingDropdownMenuItem[];
  readonly title: string;
}

export interface MarketingDropdownMenuPost {
  readonly id: string;
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly subtitle: string;
  readonly title: string;
}

const menuIcon = <Message>(path: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D(path)])],
  );

export const marketingDropdownMenuItemLink = <Message>(
  menuItem: MarketingDropdownMenuItem,
  onItem: ((id: string) => Message) | undefined,
  h: HtmlBuilder<Message>,
): Html =>
  h.a(
    [
      h.Class(
        "flex gap-3 rounded-lg p-3 outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.Href(menuItem.href),
      ...(onItem === undefined ? [] : [h.OnClick(onItem(menuItem.id))]),
    ],
    [
      menuIcon(menuItem.iconPath, h),
      h.div(
        [h.Class("flex flex-col gap-0.5")],
        [
          h.span(
            [h.Class("flex items-center gap-2 text-sm font-semibold text-text-secondary")],
            [
              menuItem.title,
              ...(menuItem.badgeLabel === undefined
                ? []
                : [
                    badge(
                      { color: "gray", label: menuItem.badgeLabel, size: "sm", type: "modern" },
                      h,
                    ),
                  ]),
            ],
          ),
          ...(menuItem.subtitle === undefined
            ? []
            : [h.span([h.Class("text-sm text-text-tertiary")], [menuItem.subtitle])]),
        ],
      ),
    ],
  );

export const marketingDropdownMenuFeaturedCard = <Message>(
  props: {
    readonly description: string;
    readonly dismissLabel: string;
    readonly href: string;
    readonly imageAlt: string;
    readonly imageSrc: string;
    readonly onChangelog: NoInfer<Message>;
    readonly onDismiss: NoInfer<Message>;
    readonly title: string;
  },
  h: HtmlBuilder<Message>,
): Html =>
  h.a(
    [
      h.Class(
        "flex flex-col gap-4 rounded-xl p-4 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.Href(props.href),
    ],
    [
      h.img([
        h.Alt(props.imageAlt),
        h.Class("aspect-[4/3] w-full rounded-lg object-cover"),
        h.Src(props.imageSrc),
      ]),
      h.div(
        [h.Class("flex flex-col gap-1")],
        [
          h.p([h.Class("text-sm font-semibold text-text-primary")], [props.title]),
          h.p([h.Class("text-sm text-text-tertiary")], [props.description]),
        ],
      ),
      h.div(
        [h.Class("inline-flex gap-3")],
        [
          button(
            { color: "link-gray", label: props.dismissLabel, onPress: props.onDismiss, size: "sm" },
            h,
          ),
          button(
            { color: "link-color", label: "Changelog", onPress: props.onChangelog, size: "sm" },
            h,
          ),
        ],
      ),
    ],
  );

export const marketingDropdownMenuHorizontalPost = <Message>(
  post: MarketingDropdownMenuPost,
  onPost: ((id: string) => Message) | undefined,
  h: HtmlBuilder<Message>,
): Html =>
  h.a(
    [
      h.Class(
        "flex gap-3 rounded-lg p-3 outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.Href("#"),
      ...(onPost === undefined ? [] : [h.OnClick(onPost(post.id))]),
    ],
    [
      h.img([
        h.Alt(post.imageAlt),
        h.Class("size-16 shrink-0 rounded-lg object-cover"),
        h.Src(post.imageSrc),
      ]),
      h.div(
        [h.Class("flex flex-col gap-1")],
        [
          h.p([h.Class("text-sm font-semibold text-text-secondary")], [post.title]),
          h.p([h.Class("text-sm text-text-tertiary")], [post.subtitle]),
        ],
      ),
    ],
  );

export const marketingDropdownMenuFooterActions = <Message>(
  actions: readonly {
    readonly href: string;
    readonly iconPath?: string;
    readonly id: string;
    readonly label: string;
  }[],
  onAction: ((id: string) => Message) | undefined,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "flex flex-col items-start gap-5 bg-bg-secondary px-4 py-4 md:flex-row md:items-center md:gap-4 md:rounded-lg md:px-6",
      ),
    ],
    actions.map((action, index) => {
      let className = "";
      if (index !== actions.length - 1 && index === 1) {
        className = "md:ml-auto";
      }
      return button(
        {
          className,
          color: "link-color",
          href: action.href,
          iconLeadingElement:
            action.iconPath === undefined ? undefined : menuIcon(action.iconPath, h),
          label: action.label,
          onPress: onAction?.(action.id),
          size: "md",
        },
        h,
      );
    }),
  );

export const marketingDropdownMenuShell = <Message>(
  children: readonly Html[],
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("px-3 pb-2 md:p-0")],
    [
      h.nav(
        [
          h.Class(
            "flex flex-col overflow-hidden rounded-xl bg-bg-primary shadow-xs ring-1 ring-border-secondary_alt md:rounded-2xl md:shadow-lg",
          ),
        ],
        children,
      ),
    ],
  );
