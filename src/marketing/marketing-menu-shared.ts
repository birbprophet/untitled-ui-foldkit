/* oxlint-disable effect/noReturnInArrow, effect/noSpread -- Shared mega-menu primitives for Untitled UI marketing header navigation. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import {
  marketingDropdownMenuFeaturedCard,
  marketingDropdownMenuItemLink,
  type MarketingDropdownMenuColumn,
  type MarketingDropdownMenuItem,
} from "./marketing-dropdown-shared.ts";

export interface MarketingMenuVideoTutorial<Message> {
  readonly description: string;
  readonly href: string;
  readonly id: string;
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly onWatch: NoInfer<Message>;
  readonly title: string;
  readonly watchLabel: string;
}

export interface MarketingMenuFooterAction {
  readonly href: string;
  readonly iconPath?: string;
  readonly id: string;
  readonly label: string;
}

export interface MarketingMenuBlogPost {
  readonly href: string;
  readonly id: string;
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly subtitle: string;
  readonly title: string;
}

export interface MarketingMenuCategoryItem {
  readonly href: string;
  readonly id: string;
  readonly title: string;
}

const menuIcon = <Message>(path: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D(path)])],
  );

const playIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 16 16")],
    [
      h.path([
        h.D(
          "M2.2 2.863A1.2 1.2 0 0 1 4.639 1.5l8.347 5.137a1.2 1.2 0 0 1 0 2.04L4.639 14.5A1.2 1.2 0 0 1 2.2 13.137V2.863Z",
        ),
        h.Fill("currentColor"),
      ]),
    ],
  );

const chevronRight = <Message>(h: HtmlBuilder<Message>): Html => menuIcon("m9 18 6-6-6-6", h);

export const marketingMenuBlogPostHorizontal = <Message>(
  post: MarketingMenuBlogPost,
  h: HtmlBuilder<Message>,
): Html =>
  h.a(
    [
      h.Class(
        "flex flex-col gap-4 rounded-lg px-4 py-3 outline-focus-ring transition hover:bg-bg-primary_hover focus-visible:outline-2 sm:flex-row md:gap-3 md:px-3",
      ),
      h.Href(post.href),
    ],
    [
      h.img([
        h.Alt(post.imageAlt),
        h.Class("h-50 w-full shrink-0 rounded-md bg-bg-secondary object-cover sm:h-22 sm:w-36"),
        h.Src(post.imageSrc),
      ]),
      h.div([h.Class("flex flex-col gap-3")], [
        h.div([h.Class("flex flex-col gap-1")], [
          h.h4([h.Class("line-clamp-2 text-sm font-semibold text-text-primary")], [post.title]),
          h.p([h.Class("line-clamp-2 text-sm text-text-tertiary")], [post.subtitle]),
        ]),
      ]),
    ],
  );

export const marketingMenuColumnList = <Message>(
  columns: readonly MarketingDropdownMenuColumn[],
  onItem: (id: string) => Message,
  h: HtmlBuilder<Message>,
  gridClass = "grid grid-cols-1 gap-5 pt-4 pb-5 md:grid-cols-2 md:px-8 md:py-6 xl:grid-cols-4",
): Html =>
  h.div(
    [h.Class(gridClass)],
    columns.map((column) =>
      h.div([
        h.keyed("div")(
          column.id,
          [],
          [
            h.h3([h.Class("mb-3 px-4 text-sm font-semibold text-text-brand-tertiary md:px-0")], [column.title]),
            h.ul(
              [h.Class("flex flex-col gap-0.5")],
              column.items.map((item) =>
                h.li([h.keyed("li")(item.id, [], [marketingDropdownMenuItemLink(item, onItem, h)])]),
              ),
            ),
          ],
        ),
      ]),
    ),
  );

export const marketingMenuVideoCard = <Message>(
  tutorial: MarketingMenuVideoTutorial<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.a(
    [
      h.Class(
        "flex flex-col gap-4 rounded-lg px-4 py-3 outline-focus-ring transition hover:bg-bg-primary_hover focus-visible:outline-2 sm:flex-row md:gap-3 md:px-3",
      ),
      h.Href(tutorial.href),
    ],
    [
      h.div([h.Class("relative w-60 shrink-0 overflow-hidden sm:w-44")], [
        h.img([h.Alt(tutorial.imageAlt), h.Class("aspect-video w-full rounded-md object-cover"), h.Src(tutorial.imageSrc)]),
        h.div(
          [h.Class("absolute inset-0 flex items-center justify-center rounded-md bg-black/10 ring-[0.5px] ring-black/10 ring-inset")],
          [h.span([h.Class("text-fg-white")], [playIcon(h)])],
        ),
      ]),
      h.div([h.Class("flex flex-col gap-3")], [
        h.div([h.Class("flex flex-col gap-1")], [
          h.h4([h.Class("line-clamp-2 text-sm font-semibold text-text-primary")], [tutorial.title]),
          h.p([h.Class("line-clamp-2 text-sm text-text-tertiary")], [tutorial.description]),
        ]),
        button(
          {
            color: "link-color",
            iconLeadingElement: playIcon(h),
            label: tutorial.watchLabel,
            onPress: tutorial.onWatch,
            size: "sm",
          },
          h,
        ),
      ]),
    ],
  );

export const marketingMenuFeatureCardVertical = <Message>(
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
  h.div([h.Class("w-full bg-bg-secondary px-1 pt-2 pb-3 md:max-w-70 md:rounded-2xl md:p-2")], [
    marketingDropdownMenuFeaturedCard(props, h),
  ]);

export const marketingMenuReadyFooter = <Message>(
  props: {
    readonly actions: readonly MarketingMenuFooterAction[];
    readonly ctaLabel: string;
    readonly onAction: (id: string) => Message;
    readonly onCta: NoInfer<Message>;
    readonly prompt: string;
    readonly visibleOnMobile?: boolean;
  },
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        `bg-bg-secondary ${props.visibleOnMobile === true ? "" : "hidden md:block"} md:mx-2 md:mb-2 md:rounded-lg`,
      ),
    ],
    [
      h.div(
        [
          h.Class(
            "mx-auto flex max-w-container flex-col items-center justify-center gap-4 rounded-xl bg-bg-secondary px-6 py-6 md:flex-row md:justify-between md:px-8 md:py-5",
          ),
        ],
        [
          h.div([h.Class("flex gap-2")], [
            h.p([h.Class("text-sm font-medium text-text-tertiary")], [props.prompt]),
            button({ color: "link-color", label: props.ctaLabel, onPress: props.onCta, size: "md" }, h),
          ]),
          h.ul(
            [h.Class("flex flex-col gap-3 md:flex-row md:gap-4")],
            props.actions.map((action) =>
              h.li([
                h.keyed("li")(
                  action.id,
                  [],
                  [
                    button(
                      {
                        color: "link-color",
                        href: action.href,
                        iconLeadingElement:
                          action.iconPath === undefined ? undefined : menuIcon(action.iconPath, h),
                        label: action.label,
                        onPress: props.onAction(action.id),
                        size: "md",
                      },
                      h,
                    ),
                  ],
                ),
              ]),
            ),
          ),
        ],
      ),
    ],
  );

export const marketingMenuBlogPostsGrid = <Message>(
  props: {
    readonly allPostsLabel: string;
    readonly items: readonly MarketingDropdownMenuItem[];
    readonly onAllPosts: NoInfer<Message>;
    readonly onItem: (id: string) => Message;
    readonly posts: readonly {
      readonly id: string;
      readonly imageAlt: string;
      readonly imageSrc: string;
      readonly subtitle: string;
      readonly title: string;
    }[];
    readonly postsTitle: string;
  },
  h: HtmlBuilder<Message>,
): Html =>
  h.section([h.Class("relative overflow-hidden bg-bg-primary md:shadow-lg"), h.Dir("ltr")], [
    h.div([h.Class("mx-auto flex max-w-container flex-col xl:flex-row")], [
      h.div([h.Class("flex flex-1 flex-col gap-5 px-4 pt-4 pb-5 md:px-8 md:py-6")], [
        h.h3([h.Class("text-sm font-semibold text-text-brand-tertiary")], [props.postsTitle]),
        h.ul(
          [h.Class("grid grid-cols-1 gap-2 md:grid-cols-2")],
          props.posts.map((post) =>
            h.li([
              h.keyed("li")(
                post.id,
                [],
                [
                  h.a(
                    [
                      h.Class(
                        "flex gap-3 rounded-lg p-3 outline-focus-ring transition hover:bg-bg-primary_hover focus-visible:outline-2",
                      ),
                      h.Href("#"),
                    ],
                    [
                      h.img([h.Alt(post.imageAlt), h.Class("size-16 shrink-0 rounded-lg object-cover"), h.Src(post.imageSrc)]),
                      h.div([h.Class("flex flex-col gap-1")], [
                        h.p([h.Class("text-sm font-semibold text-text-secondary")], [post.title]),
                        h.p([h.Class("text-sm text-text-tertiary")], [post.subtitle]),
                      ]),
                    ],
                  ),
                ],
              ),
            ]),
          ),
        ),
        h.a(
          [
            h.Class(
              "inline-flex items-center gap-1 text-md font-semibold text-text-brand-secondary outline-focus-ring focus-visible:outline-2",
            ),
            h.Href("#"),
            h.OnClick(props.onAllPosts),
          ],
          [props.allPostsLabel, chevronRight(h)],
        ),
      ]),
      h.div(
        [h.Class("w-full shrink-0 border-t border-border-secondary px-4 py-5 md:max-w-80 md:border-t-0 md:px-8 md:py-6 xl:border-l")],
        [
          h.h3([h.Class("mb-3 text-sm font-semibold text-text-brand-tertiary")], ["Company"]),
          h.ul(
            [h.Class("flex flex-col gap-0.5")],
            props.items.map((item) =>
              h.li([h.keyed("li")(item.id, [], [marketingDropdownMenuItemLink(item, props.onItem, h)])]),
            ),
          ),
        ],
      ),
    ]),
  ]);
