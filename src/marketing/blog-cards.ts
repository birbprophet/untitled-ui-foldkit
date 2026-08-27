/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, mps/prefer-option-over-null -- The sixteen variants directly transcribe the authenticated Untitled UI blog-cards source. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import { badge, badgeGroup } from "../base/badges.ts";
import type { BadgeColor } from "../base/badges.ts";

export type BlogCardsVariant =
  | "simple-01-vertical"
  | "simple-02-vertical"
  | "simple-03-vertical"
  | "simple-04-vertical"
  | "simple-01-horizontal"
  | "simple-02-horizontal"
  | "simple-03-horizontal"
  | "simple-04-horizontal"
  | "card-full-width-image-01-vertical"
  | "card-full-width-image-02-vertical"
  | "card-full-width-image-03-vertical"
  | "card-full-width-image-04-vertical"
  | "card-full-width-image-01-horizontal"
  | "card-full-width-image-02-horizontal"
  | "card-full-width-image-03-horizontal"
  | "card-full-width-image-04-horizontal";

export interface BlogCardsTag {
  readonly color: BadgeColor;
  readonly href: string;
  readonly name: string;
}

export interface BlogCardsArticle {
  readonly author: {
    readonly avatarUrl: string;
    readonly href: string;
    readonly name: string;
  };
  readonly category: {
    readonly href: string;
    readonly name: string;
  };
  readonly href: string;
  readonly id: string;
  readonly isFeatured?: boolean;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly summary: string;
  readonly tags: readonly BlogCardsTag[];
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogCardsProps<Message> {
  readonly article: BlogCardsArticle;
  readonly badgeTheme?: "light" | "modern";
  readonly className?: string;
  readonly imageClassName?: string;
  readonly onArticle?: NoInfer<Message>;
  readonly onAuthor?: NoInfer<Message>;
  readonly onCategory?: NoInfer<Message>;
  readonly onTag?: (tag: BlogCardsTag) => NoInfer<Message>;
  readonly readPostLabel?: string;
  readonly titleClassName?: string;
  readonly variant: BlogCardsVariant;
}

const click = <Message>(message: NoInfer<Message> | undefined, h: HtmlBuilder<Message>) =>
  message === undefined ? [] : [h.OnClick(message)];

const arrowUpRight = <Message>(className: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(className),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("M7 17 17 7M7 7h10v10")])],
  );

const authorRow = <Message>(props: BlogCardsProps<Message>, h: HtmlBuilder<Message>): Html => {
  const { article } = props;
  return h.div(
    [h.Class("flex gap-2")],
    [
      h.a(
        [h.Class("flex"), h.Href(article.author.href), h.Tabindex(-1), ...click(props.onAuthor, h)],
        [
          avatar(
            {
              alt: article.author.name,
              border: true,
              focusable: true,
              size: "md",
              src: article.author.avatarUrl,
            },
            h,
          ),
        ],
      ),
      h.div(
        [],
        [
          h.a(
            [
              h.Class(
                "block rounded-xs text-sm font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
              ),
              h.Href(article.author.href),
              ...click(props.onAuthor, h),
            ],
            [article.author.name],
          ),
          h.time([h.Class("block text-sm text-text-tertiary")], [article.publishedAt]),
        ],
      ),
    ],
  );
};

const tags = <Message>(props: BlogCardsProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class("flex gap-2")],
    props.article.tags.map((tag) =>
      h.a(
        [
          h.Class(
            "rounded-xl outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.Href(tag.href),
          ...click(props.onTag?.(tag), h),
        ],
        [badge({ color: tag.color, label: tag.name, size: "md", type: "color" }, h)],
      ),
    ),
  );

const image = <Message>(
  props: BlogCardsProps<Message>,
  anchorClassName: string,
  imageClassName: string,
  h: HtmlBuilder<Message>,
): Html =>
  h.a(
    [
      h.Class(anchorClassName),
      h.Href(props.article.href),
      h.Tabindex(-1),
      ...click(props.onArticle, h),
    ],
    [
      h.img([
        h.Alt(props.article.title),
        h.Class(`${imageClassName} ${props.imageClassName ?? ""}`),
        h.Src(props.article.thumbnailUrl),
      ]),
    ],
  );

const titleLink = <Message>(
  props: BlogCardsProps<Message>,
  href: "article" | "category",
  className: string,
  arrowClassName: string | undefined,
  h: HtmlBuilder<Message>,
): Html =>
  h.a(
    [
      h.Class(`${className} ${props.titleClassName ?? ""}`),
      h.Href(href === "article" ? props.article.href : props.article.category.href),
      ...click(href === "article" ? props.onArticle : props.onCategory, h),
    ],
    [
      props.article.title,
      ...(arrowClassName === undefined ? [] : [arrowUpRight(arrowClassName, h)]),
    ],
  );

const categoryBadge = <Message>(props: BlogCardsProps<Message>, h: HtmlBuilder<Message>): Html =>
  badgeGroup(
    {
      addonText: props.article.category.name,
      color: "brand",
      label: props.article.readingTime,
      size: "md",
      theme: props.badgeTheme ?? "light",
    },
    h,
  );

const readPost = <Message>(props: BlogCardsProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.a(
    [
      h.Class(
        "group relative inline-flex h-max cursor-pointer items-center justify-normal gap-1.5 whitespace-nowrap rounded p-0 text-md font-semibold text-text-brand-secondary outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2 hover:text-text-brand-secondary-hover",
      ),
      h.Href(props.article.href),
      ...click(props.onArticle, h),
    ],
    [
      h.span(
        [
          h.Class(
            "px-0.5 underline decoration-transparent underline-offset-4 hover:decoration-fg-brand-secondary-alt",
          ),
        ],
        [props.readPostLabel ?? "Read post"],
      ),
      arrowUpRight(
        "size-5 shrink-0 text-fg-brand-secondary-alt transition-inherit-all group-hover:text-fg-brand-secondary-hover",
        h,
      ),
    ],
  );

const overlayMetadata = <Message>(
  props: BlogCardsProps<Message>,
  mediumPadding: "md:p-5" | "md:p-6",
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "absolute inset-x-0 bottom-0 overflow-hidden bg-linear-to-b from-transparent to-black/40",
      ),
    ],
    [
      h.div(
        [
          h.Class(
            `relative flex items-start justify-between bg-alpha-white/30 p-4 backdrop-blur-md before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-alpha-white/30 ${mediumPadding}`,
          ),
        ],
        [
          h.div(
            [],
            [
              h.a(
                [
                  h.Class(
                    "block rounded-xs text-sm font-semibold text-white outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Href(props.article.author.href),
                  ...click(props.onAuthor, h),
                ],
                [props.article.author.name],
              ),
              h.time([h.Class("block text-sm text-white")], [props.article.publishedAt]),
            ],
          ),
          h.a(
            [
              h.Class(
                "rounded-xs text-sm font-semibold text-white outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
              ),
              h.Href(props.article.category.href),
              ...click(props.onCategory, h),
            ],
            [props.article.category.name],
          ),
        ],
      ),
    ],
  );

const simple01Vertical = <Message>(props: BlogCardsProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.article(
    [h.Class("flex flex-col gap-4")],
    [
      image(
        props,
        "relative overflow-hidden rounded-2xl before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
        "aspect-[1.5] w-full object-cover transition duration-100 ease-linear hover:scale-105",
        h,
      ),
      h.div(
        [h.Class("flex flex-col gap-5")],
        [
          h.div(
            [h.Class("flex flex-col gap-2")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-text-brand-secondary")],
                [props.article.category.name],
              ),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  titleLink(
                    props,
                    "article",
                    "group/title flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                    "mt-0.5 size-6 shrink-0 text-fg-quaternary transition duration-100 ease-linear group-hover/title:text-fg-quaternary-hover",
                    h,
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary")],
                    [props.article.summary],
                  ),
                ],
              ),
            ],
          ),
          authorRow(props, h),
        ],
      ),
    ],
  );

const simple02Vertical = <Message>(props: BlogCardsProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.article(
    [h.Class("flex flex-col gap-4")],
    [
      image(
        props,
        "relative overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:z-10 before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
        "aspect-[1.5] w-full object-cover transition duration-100 ease-linear hover:scale-105",
        h,
      ),
      h.div(
        [h.Class("flex flex-col gap-5")],
        [
          h.div(
            [h.Class("flex flex-col items-start gap-3")],
            [
              categoryBadge(props, h),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  titleLink(
                    props,
                    "category",
                    "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                    "mt-0.5 size-6 shrink-0 text-fg-quaternary",
                    h,
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary md:line-clamp-none")],
                    [props.article.summary],
                  ),
                ],
              ),
            ],
          ),
          authorRow(props, h),
        ],
      ),
    ],
  );

const simple03Vertical = <Message>(props: BlogCardsProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.article(
    [h.Class(`flex flex-col gap-4 ${props.className ?? ""}`)],
    [
      image(
        props,
        "relative overflow-hidden rounded-2xl before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
        "aspect-[1.5] w-full object-cover transition duration-100 ease-linear hover:scale-105",
        h,
      ),
      h.div(
        [h.Class("flex flex-col gap-6")],
        [
          h.div(
            [h.Class("flex flex-col items-start gap-2")],
            [
              h.p(
                [h.Class("text-sm font-semibold text-text-brand-secondary")],
                [`${props.article.author.name} • `, h.time([], [props.article.publishedAt])],
              ),
              h.div(
                [h.Class("flex w-full flex-col gap-1")],
                [
                  titleLink(
                    props,
                    "category",
                    "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                    "mt-0.5 size-5 shrink-0 text-fg-quaternary",
                    h,
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary")],
                    [props.article.summary],
                  ),
                ],
              ),
            ],
          ),
          tags(props, h),
        ],
      ),
    ],
  );

const simple04Vertical = <Message>(props: BlogCardsProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.article(
    [h.Class(`flex flex-col gap-4 ${props.className ?? ""}`)],
    [
      h.div(
        [h.Class("relative overflow-hidden")],
        [
          image(
            props,
            "relative w-full overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:z-10 before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
            "aspect-[1.5] w-full object-cover transition duration-100 ease-linear hover:scale-105",
            h,
          ),
          overlayMetadata(props, "md:p-5", h),
        ],
      ),
      h.div(
        [h.Class("flex flex-col items-start gap-5")],
        [
          h.div(
            [h.Class("flex flex-col gap-1")],
            [
              titleLink(
                props,
                "category",
                "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                undefined,
                h,
              ),
              h.p([h.Class("line-clamp-2 text-md text-text-tertiary")], [props.article.summary]),
            ],
          ),
          readPost(props, h),
        ],
      ),
    ],
  );

const simple01Horizontal = <Message>(
  props: BlogCardsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-4 xl:flex-row xl:items-start")],
    [
      image(
        props,
        "relative shrink-0 overflow-hidden rounded-2xl before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
        "aspect-[1.5] w-full object-cover transition duration-100 ease-linear hover:scale-105 xl:w-80",
        h,
      ),
      h.div(
        [h.Class("flex flex-col gap-5")],
        [
          h.div(
            [h.Class("flex flex-col gap-2")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-text-brand-secondary")],
                [props.article.category.name],
              ),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  titleLink(
                    props,
                    "category",
                    "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                    undefined,
                    h,
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary")],
                    [props.article.summary],
                  ),
                ],
              ),
            ],
          ),
          authorRow(props, h),
        ],
      ),
    ],
  );

const simple02Horizontal = <Message>(
  props: BlogCardsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-4 lg:flex-row lg:items-start")],
    [
      image(
        props,
        "relative shrink-0 overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:z-10 before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
        "aspect-[1.5] w-full object-cover transition duration-100 ease-linear hover:scale-105 lg:w-80",
        h,
      ),
      h.div(
        [h.Class("flex flex-col gap-5")],
        [
          h.div(
            [h.Class("flex flex-col gap-2")],
            [
              categoryBadge(props, h),
              h.div(
                [h.Class("flex flex-col gap-2")],
                [
                  titleLink(
                    props,
                    "article",
                    "rounded-xs text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                    undefined,
                    h,
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary")],
                    [props.article.summary],
                  ),
                ],
              ),
            ],
          ),
          authorRow(props, h),
        ],
      ),
    ],
  );

const simple03Horizontal = <Message>(
  props: BlogCardsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-4 xl:flex-row xl:items-start")],
    [
      image(
        props,
        "relative shrink-0 overflow-hidden rounded-2xl before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
        "aspect-[1.5] w-full object-cover transition duration-100 ease-linear hover:scale-105 xl:w-80",
        h,
      ),
      h.div(
        [h.Class("flex flex-col gap-5")],
        [
          h.div(
            [h.Class("flex flex-col gap-2")],
            [
              h.p(
                [h.Class("text-sm font-semibold text-text-brand-secondary")],
                [
                  h.a(
                    [
                      h.Class(
                        "rounded-xs outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(props.article.author.href),
                      ...click(props.onAuthor, h),
                    ],
                    [props.article.author.name],
                  ),
                  " • ",
                  h.time([], [props.article.publishedAt]),
                ],
              ),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  titleLink(
                    props,
                    "article",
                    "rounded-xs text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                    undefined,
                    h,
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary")],
                    [props.article.summary],
                  ),
                ],
              ),
            ],
          ),
          tags(props, h),
        ],
      ),
    ],
  );

const simple04Horizontal = <Message>(
  props: BlogCardsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-5 lg:flex-row lg:items-start")],
    [
      h.div(
        [h.Class("relative shrink-0 overflow-hidden")],
        [
          image(
            props,
            "relative w-full overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:z-10 before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
            "h-60 w-full object-cover transition duration-100 ease-linear hover:scale-105 lg:h-50 lg:w-80",
            h,
          ),
          overlayMetadata(props, "md:p-5", h),
        ],
      ),
      h.div(
        [h.Class("flex flex-col items-start gap-5")],
        [
          h.div(
            [h.Class("flex flex-col gap-2")],
            [
              titleLink(
                props,
                "category",
                "block rounded-xs text-xl font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 md:text-lg",
                undefined,
                h,
              ),
              h.p(
                [h.Class("line-clamp-2 text-md text-text-tertiary lg:line-clamp-3")],
                [props.article.summary],
              ),
            ],
          ),
          readPost(props, h),
        ],
      ),
    ],
  );

const cardVerticalImage = <Message>(
  props: BlogCardsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  image(
    props,
    "",
    "aspect-[1.5] w-full rounded-t-2xl object-cover outline-[0.5px] -outline-offset-[0.5px] outline-alpha-black/10 md:h-64",
    h,
  );

const cardFullWidthImage01Vertical = <Message>(
  props: BlogCardsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [
      h.Class(
        "flex flex-col overflow-hidden rounded-2xl outline-1 -outline-offset-1 outline-border-secondary-alt",
      ),
    ],
    [
      cardVerticalImage(props, h),
      h.div(
        [h.Class("flex flex-col gap-5 px-5 pt-5 pb-6 md:p-6")],
        [
          h.div(
            [h.Class("flex flex-col gap-2")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-text-brand-secondary")],
                [props.article.category.name],
              ),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  titleLink(
                    props,
                    "article",
                    "flex justify-between gap-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                    "mt-1 size-5 shrink-0 text-fg-quaternary",
                    h,
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary md:line-clamp-3")],
                    [props.article.summary],
                  ),
                ],
              ),
            ],
          ),
          authorRow(props, h),
        ],
      ),
    ],
  );

const cardFullWidthImage02Vertical = <Message>(
  props: BlogCardsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [
      h.Class(
        "flex flex-col overflow-hidden rounded-2xl outline-1 -outline-offset-1 outline-border-secondary-alt",
      ),
    ],
    [
      cardVerticalImage(props, h),
      h.div(
        [h.Class("flex flex-col gap-5 px-5 pt-5 pb-6 md:p-6")],
        [
          h.div(
            [h.Class("flex flex-col gap-3")],
            [
              categoryBadge(props, h),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  titleLink(
                    props,
                    "article",
                    "flex justify-between gap-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                    "mt-1 size-5 shrink-0 text-fg-quaternary",
                    h,
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary md:line-clamp-3")],
                    [props.article.summary],
                  ),
                ],
              ),
            ],
          ),
          authorRow(props, h),
        ],
      ),
    ],
  );

const cardFullWidthImage03Vertical = <Message>(
  props: BlogCardsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [
      h.Class(
        "flex flex-col overflow-hidden rounded-2xl outline-1 -outline-offset-1 outline-border-secondary-alt",
      ),
    ],
    [
      cardVerticalImage(props, h),
      h.div(
        [h.Class("flex flex-col gap-6 px-5 pt-5 pb-6 md:p-6")],
        [
          h.div(
            [h.Class("flex flex-col gap-2")],
            [
              h.p(
                [h.Class("text-sm font-semibold text-text-brand-secondary")],
                [`${props.article.author.name} • `, h.time([], [props.article.publishedAt])],
              ),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  titleLink(
                    props,
                    "article",
                    "flex justify-between gap-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                    "mt-1 size-5 shrink-0 text-fg-quaternary",
                    h,
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary md:line-clamp-3")],
                    [props.article.summary],
                  ),
                ],
              ),
            ],
          ),
          tags(props, h),
        ],
      ),
    ],
  );

const cardFullWidthImage04Vertical = <Message>(
  props: BlogCardsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [
      h.Class(
        "flex flex-col overflow-hidden rounded-2xl outline-1 -outline-offset-1 outline-border-secondary-alt",
      ),
    ],
    [
      h.div(
        [h.Class("relative shrink-0")],
        [
          image(
            props,
            "w-full",
            "aspect-[1.5] w-full rounded-t-2xl object-cover outline-[0.5px] -outline-offset-[0.5px] outline-alpha-black/10 md:h-64",
            h,
          ),
          overlayMetadata(props, "md:p-6", h),
        ],
      ),
      h.div(
        [h.Class("flex flex-col gap-6 px-5 pt-5 pb-6 md:p-6")],
        [
          h.div(
            [h.Class("flex flex-col gap-1")],
            [
              titleLink(
                props,
                "article",
                "flex justify-between gap-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                "mt-1 size-5 shrink-0 text-fg-quaternary",
                h,
              ),
              h.p(
                [h.Class("line-clamp-2 text-md text-text-tertiary md:line-clamp-3")],
                [props.article.summary],
              ),
            ],
          ),
          readPost(props, h),
        ],
      ),
    ],
  );

const cardHorizontalImage = <Message>(
  props: BlogCardsProps<Message>,
  height: "md:h-60" | "md:h-60.5",
  h: HtmlBuilder<Message>,
): Html =>
  image(
    props,
    "shrink-0",
    `h-60 w-full rounded-t-2xl object-cover outline-[0.5px] -outline-offset-[0.5px] outline-alpha-black/10 ${height} md:w-80 md:rounded-t-none md:rounded-l-2xl`,
    h,
  );

const cardFullWidthImage01Horizontal = <Message>(
  props: BlogCardsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [
      h.Class(
        "flex flex-col overflow-hidden rounded-2xl outline-1 -outline-offset-1 outline-border-secondary-alt md:flex-row md:items-start",
      ),
    ],
    [
      cardHorizontalImage(props, "md:h-60", h),
      h.div(
        [h.Class("flex flex-col gap-5 px-5 pt-5 pb-6 md:p-6")],
        [
          h.div(
            [h.Class("flex flex-col gap-2")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-text-brand-secondary")],
                [props.article.category.name],
              ),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  titleLink(
                    props,
                    "article",
                    "rounded-xs text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                    undefined,
                    h,
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary")],
                    [props.article.summary],
                  ),
                ],
              ),
            ],
          ),
          authorRow(props, h),
        ],
      ),
    ],
  );

const cardFullWidthImage02Horizontal = <Message>(
  props: BlogCardsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [
      h.Class(
        "flex flex-col overflow-hidden rounded-2xl outline-1 -outline-offset-1 outline-border-secondary-alt md:flex-row md:items-start",
      ),
    ],
    [
      cardHorizontalImage(props, "md:h-60.5", h),
      h.div(
        [h.Class("flex flex-col gap-6 px-5 pt-5 pb-6 md:p-6")],
        [
          h.div(
            [h.Class("flex flex-col gap-3")],
            [
              categoryBadge(props, h),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  titleLink(
                    props,
                    "article",
                    "rounded-xs text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                    undefined,
                    h,
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary")],
                    [props.article.summary],
                  ),
                ],
              ),
            ],
          ),
          authorRow(props, h),
        ],
      ),
    ],
  );

const cardFullWidthImage03Horizontal = <Message>(
  props: BlogCardsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [
      h.Class(
        "flex flex-col overflow-hidden rounded-2xl outline-1 -outline-offset-1 outline-border-secondary-alt md:flex-row md:items-start",
      ),
    ],
    [
      cardHorizontalImage(props, "md:h-60", h),
      h.div(
        [h.Class("flex flex-col gap-6 px-5 pt-5 pb-6 md:p-6")],
        [
          h.div(
            [h.Class("flex flex-col gap-2")],
            [
              h.p(
                [h.Class("text-sm font-semibold text-text-brand-secondary")],
                [`${props.article.author.name} • `, h.time([], [props.article.publishedAt])],
              ),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  titleLink(
                    props,
                    "article",
                    "rounded-xs text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                    undefined,
                    h,
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary")],
                    [props.article.summary],
                  ),
                ],
              ),
            ],
          ),
          tags(props, h),
        ],
      ),
    ],
  );

const cardFullWidthImage04Horizontal = <Message>(
  props: BlogCardsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [
      h.Class(
        "flex flex-col overflow-hidden rounded-2xl outline-1 -outline-offset-1 outline-border-secondary-alt md:flex-row md:items-start",
      ),
    ],
    [
      h.div(
        [h.Class("relative shrink-0")],
        [
          image(
            props,
            "w-full",
            "h-60 w-full rounded-t-2xl object-cover outline-[0.5px] -outline-offset-[0.5px] outline-alpha-black/10 md:h-60 md:w-80 md:rounded-t-none md:rounded-l-2xl",
            h,
          ),
          overlayMetadata(props, "md:p-6", h),
        ],
      ),
      h.div(
        [h.Class("flex flex-col gap-6 px-5 pt-5 pb-6 md:p-6")],
        [
          h.div(
            [h.Class("flex flex-col gap-1")],
            [
              titleLink(
                props,
                "article",
                "rounded-xs text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                undefined,
                h,
              ),
              h.p(
                [h.Class("line-clamp-2 text-md text-text-tertiary md:line-clamp-3")],
                [props.article.summary],
              ),
            ],
          ),
          readPost(props, h),
        ],
      ),
    ],
  );

const variants: Readonly<
  Record<
    BlogCardsVariant,
    <Message>(props: BlogCardsProps<Message>, h: HtmlBuilder<Message>) => Html
  >
> = {
  "card-full-width-image-01-horizontal": cardFullWidthImage01Horizontal,
  "card-full-width-image-01-vertical": cardFullWidthImage01Vertical,
  "card-full-width-image-02-horizontal": cardFullWidthImage02Horizontal,
  "card-full-width-image-02-vertical": cardFullWidthImage02Vertical,
  "card-full-width-image-03-horizontal": cardFullWidthImage03Horizontal,
  "card-full-width-image-03-vertical": cardFullWidthImage03Vertical,
  "card-full-width-image-04-horizontal": cardFullWidthImage04Horizontal,
  "card-full-width-image-04-vertical": cardFullWidthImage04Vertical,
  "simple-01-horizontal": simple01Horizontal,
  "simple-01-vertical": simple01Vertical,
  "simple-02-horizontal": simple02Horizontal,
  "simple-02-vertical": simple02Vertical,
  "simple-03-horizontal": simple03Horizontal,
  "simple-03-vertical": simple03Vertical,
  "simple-04-horizontal": simple04Horizontal,
  "simple-04-vertical": simple04Vertical,
};

export const blogCards = <Message>(props: BlogCardsProps<Message>, h: HtmlBuilder<Message>): Html =>
  variants[props.variant](props, h);
