/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noTernary -- The placeholder is a real input attribute; the renderer directly transcribes the authenticated Untitled UI blog header sidebar. */
import { blobatarDataUri } from "avatar";
import type { Html, HtmlBuilder } from "foldkit/html";

import { pagination } from "../application/pagination.ts";

export interface BlogHeaderSidebar02Category {
  readonly id: string;
  readonly label: string;
}

export interface BlogHeaderSidebar02Article {
  readonly authorHref: string;
  readonly authorName: string;
  readonly authorSeed: string;
  readonly categoryHref: string;
  readonly categoryName: string;
  readonly href: string;
  readonly id: string;
  readonly isFeatured?: boolean;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly summary: string;
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogHeaderSidebar02Props<Message> {
  readonly articles: readonly BlogHeaderSidebar02Article[];
  readonly categories: readonly BlogHeaderSidebar02Category[];
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly onArticle: (id: string) => NoInfer<Message>;
  readonly onAuthor: (id: string) => NoInfer<Message>;
  readonly onCategory: (id: string) => NoInfer<Message>;
  readonly onPage: (page: number) => NoInfer<Message>;
  readonly onSearch: (query: string) => NoInfer<Message>;
  readonly page: number;
  readonly pageCount: number;
  readonly searchLabel: string;
  readonly searchPlaceholder: string;
  readonly searchQuery: string;
  readonly selectedCategoryId: string;
}

const searchIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const arrowUpRight = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("mt-0.5 size-6 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("M7 17 17 7m0 0H7m10 0v10"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const badgeGroup = <Message>(article: BlogHeaderSidebar02Article, h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Class(
        "inline-flex rounded-full bg-utility-brand-50 p-1 pr-3 text-sm font-medium text-utility-brand-700 ring-1 ring-inset ring-utility-brand-200",
      ),
    ],
    [
      h.span(
        [
          h.Class(
            "rounded-full bg-bg-primary px-2 py-0.5 shadow-xs ring-1 ring-inset ring-utility-brand-200",
          ),
        ],
        [article.readingTime],
      ),
      h.span([h.Class("px-1 py-0.5")], [article.categoryName]),
    ],
  );

const avatar = <Message>(article: BlogHeaderSidebar02Article, h: HtmlBuilder<Message>): Html =>
  h.img([
    h.Alt(article.authorName),
    h.Class("size-10 rounded-full object-cover ring-1 ring-border-secondary_alt"),
    h.Src(
      blobatarDataUri(article.authorSeed, {
        kind: "agent",
        size: 40,
        title: article.authorName,
      }),
    ),
  ]);

const featuredArticle = <Message>(
  article: BlogHeaderSidebar02Article,
  props: BlogHeaderSidebar02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-4 lg:flex-row lg:items-start xl:gap-8")],
    [
      h.a(
        [
          h.Class("shrink-0 overflow-hidden"),
          h.Href(article.href),
          h.OnClick(props.onArticle(article.id)),
          h.Tabindex(-1),
        ],
        [
          h.img([
            h.Alt(article.title),
            h.Class("aspect-[1.5] w-full object-cover lg:w-105 xl:w-140"),
            h.Src(article.thumbnailUrl),
          ]),
        ],
      ),
      h.div(
        [h.Class("flex flex-col gap-5 lg:gap-6")],
        [
          h.div(
            [h.Class("flex flex-col items-start gap-3 lg:gap-4")],
            [
              badgeGroup(article, h),
              h.div(
                [h.Class("flex flex-col gap-1 xl:gap-3")],
                [
                  h.a(
                    [
                      h.Class(
                        "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 md:text-display-xs",
                      ),
                      h.Href(article.categoryHref),
                      h.OnClick(props.onArticle(article.id)),
                    ],
                    [article.title],
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary xl:line-clamp-4")],
                    [article.summary],
                  ),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("flex max-h-10 gap-2")],
            [
              h.a(
                [
                  h.Class("flex"),
                  h.Href(article.authorHref),
                  h.OnClick(props.onAuthor(article.id)),
                  h.Tabindex(-1),
                ],
                [avatar(article, h)],
              ),
              h.div(
                [],
                [
                  h.a(
                    [
                      h.Class(
                        "block rounded-xs text-sm font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(article.authorHref),
                      h.OnClick(props.onAuthor(article.id)),
                    ],
                    [article.authorName],
                  ),
                  h.time([h.Class("block text-sm text-text-tertiary")], [article.publishedAt]),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );

const standardArticle = <Message>(
  article: BlogHeaderSidebar02Article,
  props: BlogHeaderSidebar02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-4")],
    [
      h.a(
        [
          h.Class(
            "relative overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:z-10 before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
          ),
          h.Href(article.href),
          h.OnClick(props.onArticle(article.id)),
          h.Tabindex(-1),
        ],
        [
          h.img([
            h.Alt(article.title),
            h.Class(
              "aspect-[1.5] w-full object-cover transition duration-100 ease-linear hover:scale-105",
            ),
            h.Src(article.thumbnailUrl),
          ]),
        ],
      ),
      h.div(
        [h.Class("flex flex-col gap-5")],
        [
          h.div(
            [h.Class("flex flex-col items-start gap-3")],
            [
              badgeGroup(article, h),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  h.a(
                    [
                      h.Class(
                        "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(article.categoryHref),
                      h.OnClick(props.onArticle(article.id)),
                    ],
                    [article.title, arrowUpRight(h)],
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary md:line-clamp-none")],
                    [article.summary],
                  ),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("flex gap-2")],
            [
              h.a(
                [
                  h.Class("flex"),
                  h.Href(article.authorHref),
                  h.OnClick(props.onAuthor(article.id)),
                  h.Tabindex(-1),
                ],
                [avatar(article, h)],
              ),
              h.div(
                [],
                [
                  h.a(
                    [
                      h.Class(
                        "block rounded-xs text-sm font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(article.authorHref),
                      h.OnClick(props.onAuthor(article.id)),
                    ],
                    [article.authorName],
                  ),
                  h.time([h.Class("block text-sm text-text-tertiary")], [article.publishedAt]),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );

export const blogHeaderSidebar02 = <Message>(
  props: BlogHeaderSidebar02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("bg-bg-primary"), h.Dir("ltr")],
    [
      h.section(
        [h.Class("bg-bg-primary py-16 md:py-24")],
        [
          h.div(
            [h.Class("mx-auto max-w-container px-4 md:px-8")],
            [
              h.div(
                [h.Class("flex w-full max-w-3xl flex-col")],
                [
                  h.span(
                    [h.Class("text-sm font-semibold text-text-brand-secondary md:text-md")],
                    [props.eyebrow],
                  ),
                  h.h1(
                    [
                      h.Class(
                        "mt-3 text-display-md font-semibold text-text-primary md:text-display-lg",
                      ),
                    ],
                    [props.heading],
                  ),
                  h.p(
                    [h.Class("mt-4 text-lg text-text-tertiary md:mt-6 md:text-xl")],
                    [props.description],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
      h.main(
        [
          h.Class(
            "mx-auto flex w-full max-w-container flex-col gap-12 px-4 pb-16 md:gap-16 md:px-8 md:pb-24",
          ),
        ],
        [
          h.div(
            [h.Class("flex flex-col gap-12 md:flex-row md:gap-16")],
            [
              h.aside(
                [h.Class("flex w-full flex-col items-stretch md:max-w-70 md:gap-8")],
                [
                  h.label(
                    [h.Class("relative hidden md:flex")],
                    [
                      h.span([h.Class("sr-only")], [props.searchLabel]),
                      h.span(
                        [h.Class("pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2")],
                        [searchIcon(h)],
                      ),
                      h.input([
                        h.AriaLabel(props.searchLabel),
                        h.Class(
                          "h-12 w-full rounded-lg bg-bg-primary py-3 pr-3.5 pl-10.5 text-md text-text-primary shadow-xs ring-1 ring-border-primary outline-focus-ring placeholder:text-text-placeholder focus-visible:outline-2",
                        ),
                        h.OnInput(props.onSearch),
                        h.Placeholder(props.searchPlaceholder),
                        h.Type("search"),
                        h.Value(props.searchQuery),
                      ]),
                    ],
                  ),
                  h.div(
                    [h.Class("flex flex-col gap-5")],
                    [
                      h.p(
                        [
                          h.Class(
                            "hidden text-sm font-semibold text-text-brand-secondary md:block",
                          ),
                        ],
                        ["Blog categories"],
                      ),
                      h.select(
                        [
                          h.AriaLabel("Categories"),
                          h.Class(
                            "h-11 rounded-lg bg-bg-primary px-3.5 text-md text-text-primary shadow-xs ring-1 ring-border-primary outline-focus-ring md:hidden",
                          ),
                          h.OnChange(props.onCategory),
                          h.Value(props.selectedCategoryId),
                        ],
                        props.categories.map((category) =>
                          h.option([h.Value(category.id)], [category.label]),
                        ),
                      ),
                      h.nav(
                        [
                          h.AriaLabel("Blog categories"),
                          h.Class(
                            "hidden w-full flex-1 self-start overflow-auto md:flex md:self-auto",
                          ),
                        ],
                        [
                          h.div(
                            [h.Class("flex w-full flex-col")],
                            props.categories.map((category) =>
                              h.button(
                                [
                                  h.AriaCurrent(
                                    category.id === props.selectedCategoryId ? "page" : "false",
                                  ),
                                  h.Class(
                                    `flex w-full rounded-md px-3 py-2.5 text-left text-md font-semibold outline-focus-ring focus-visible:outline-2 ${category.id === props.selectedCategoryId ? "bg-bg-active text-text-secondary" : "text-text-tertiary hover:bg-bg-primary-hover hover:text-text-tertiary-hover"}`,
                                  ),
                                  h.OnClick(props.onCategory(category.id)),
                                  h.Type("button"),
                                ],
                                [category.label],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
              h.ul(
                [h.Class("grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-2")],
                props.articles
                  .slice(0, 9)
                  .map((article, index) =>
                    h.keyed("li")(
                      article.id,
                      [
                        h.Class(
                          `${article.isFeatured === true ? "lg:col-span-2" : ""} ${index >= 6 ? "hidden lg:flex" : "flex"} flex-col gap-6 md:gap-8`,
                        ),
                      ],
                      [
                        article.isFeatured === true
                          ? featuredArticle(article, props, h)
                          : standardArticle(article, props, h),
                      ],
                    ),
                  ),
              ),
            ],
          ),
          pagination(
            {
              align: "center",
              messageForPage: props.onPage,
              page: props.page,
              total: props.pageCount,
              variant: "page-minimal-center",
            },
            h,
          ),
        ],
      ),
    ],
  );
