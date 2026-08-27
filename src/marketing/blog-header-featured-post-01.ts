/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- Direct FoldKit transcription of the authenticated Untitled UI blog header. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { pagination } from "../application/pagination.ts";
import { avatar } from "../base/avatar.ts";

export interface BlogHeaderFeaturedPost01Article {
  readonly author: { readonly avatarUrl: string; readonly href: string; readonly name: string };
  readonly category: { readonly href: string; readonly name: string };
  readonly href: string;
  readonly id: string;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly summary: string;
  readonly tags: readonly { readonly href: string; readonly name: string }[];
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogHeaderFeaturedPost01Option {
  readonly id: string;
  readonly label: string;
}

export interface BlogHeaderFeaturedPost01Props<Message> {
  readonly articles: readonly BlogHeaderFeaturedPost01Article[];
  readonly description: string;
  readonly eyebrow: string;
  readonly featuredArticle: BlogHeaderFeaturedPost01Article;
  readonly heading: string;
  readonly onArticle: (id: string) => NoInfer<Message>;
  readonly onPage: (page: number) => NoInfer<Message>;
  readonly onSort: (id: string) => NoInfer<Message>;
  readonly onTab: (id: string) => NoInfer<Message>;
  readonly page: number;
  readonly pageCount: number;
  readonly selectedSort: string;
  readonly selectedTab: string;
  readonly sortLabel: string;
  readonly sortOptions: readonly BlogHeaderFeaturedPost01Option[];
  readonly tabs: readonly BlogHeaderFeaturedPost01Option[];
}

const arrow = <Message>(className: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class(className), h.Fill("none"), h.ViewBox("0 0 24 24")],
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

const articleCard = <Message>(
  article: BlogHeaderFeaturedPost01Article,
  onArticle: (id: string) => Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-4")],
    [
      h.a(
        [
          h.Class(
            "relative overflow-hidden rounded-2xl before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
          ),
          h.Href(article.href),
          h.OnClick(onArticle(article.id)),
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
            [h.Class("flex flex-col gap-2")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-brand-secondary")],
                [article.category.name],
              ),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  h.a(
                    [
                      h.Class(
                        "group/title flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(article.href),
                      h.OnClick(onArticle(article.id)),
                    ],
                    [
                      article.title,
                      arrow(
                        "mt-0.5 size-6 shrink-0 text-fg-quaternary transition duration-100 ease-linear group-hover/title:text-fg-quaternary-hover",
                        h,
                      ),
                    ],
                  ),
                  h.p([h.Class("line-clamp-2 text-md text-text-tertiary")], [article.summary]),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("flex gap-2")],
            [
              h.a(
                [h.Class("flex"), h.Href(article.author.href)],
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
                    ],
                    [article.author.name],
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

const featured = <Message>(
  article: BlogHeaderFeaturedPost01Article,
  onArticle: (id: string) => Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.a(
    [
      h.Class(
        "relative hidden w-full overflow-hidden rounded-2xl outline-focus-ring select-none focus-visible:outline-2 focus-visible:outline-offset-4 md:block md:h-145 lg:h-180",
      ),
      h.Href(article.href),
      h.OnClick(onArticle(article.id)),
    ],
    [
      h.img([
        h.Alt(article.title),
        h.Class(
          "absolute inset-0 size-full rounded-[inherit] object-cover outline-[0.5px] -outline-offset-[0.5px] outline-alpha-black/10",
        ),
        h.Src(article.thumbnailUrl),
      ]),
      h.div(
        [
          h.Class(
            "absolute inset-x-0 bottom-0 w-full bg-linear-to-t from-black/40 to-transparent pt-24",
          ),
        ],
        [
          h.div(
            [h.Class("flex w-full flex-col gap-6 p-8")],
            [
              h.div(
                [h.Class("flex flex-col gap-2")],
                [
                  h.div(
                    [h.Class("flex gap-4")],
                    [
                      h.p(
                        [h.Class("flex-1 text-display-xs font-semibold text-white")],
                        [article.title],
                      ),
                      arrow("size-6 shrink-0 text-fg-white", h),
                    ],
                  ),
                  h.p([h.Class("line-clamp-2 text-md text-white/80")], [article.summary]),
                ],
              ),
              h.div(
                [h.Class("flex gap-6")],
                [
                  h.div(
                    [h.Class("flex flex-1 gap-8")],
                    [
                      h.div(
                        [h.Class("flex flex-col gap-2")],
                        [
                          h.p([h.Class("text-sm font-semibold text-white")], ["Written by"]),
                          h.div(
                            [h.Class("flex items-center gap-2")],
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
                              h.p(
                                [h.Class("text-sm font-semibold text-white")],
                                [article.author.name],
                              ),
                            ],
                          ),
                        ],
                      ),
                      h.div(
                        [h.Class("flex flex-col gap-2")],
                        [
                          h.p([h.Class("text-sm font-semibold text-white")], ["Published on"]),
                          h.div(
                            [h.Class("flex h-10 items-center")],
                            [
                              h.p(
                                [h.Class("text-md font-semibold text-white")],
                                [article.publishedAt],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div(
                    [h.Class("flex flex-col gap-2")],
                    [
                      h.p([h.Class("text-sm font-semibold text-white")], ["File under"]),
                      h.ul(
                        [h.Class("flex h-10 items-center gap-2")],
                        article.tags.map((tag) =>
                          h.keyed("li")(
                            tag.name,
                            [
                              h.Class(
                                "rounded-full bg-transparent px-2 py-0.5 text-xs font-medium text-fg-white ring-1 ring-white/30 ring-inset",
                              ),
                            ],
                            [tag.name],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );

export const blogHeaderFeaturedPost01 = <Message>(
  props: BlogHeaderFeaturedPost01Props<Message>,
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
                    [h.Class("text-sm font-semibold text-brand-secondary md:text-md")],
                    [props.eyebrow],
                  ),
                  h.h2(
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
          featured(props.featuredArticle, props.onArticle, h),
          h.div([h.Class("md:hidden")], [articleCard(props.featuredArticle, props.onArticle, h)]),
          h.div(
            [h.Class("flex flex-col items-end gap-8 md:flex-row")],
            [
              h.div(
                [h.Class("flex w-full overflow-auto border-b border-border-secondary")],
                props.tabs.map((tab) =>
                  h.button(
                    [
                      h.AriaPressed(String(tab.id === props.selectedTab)),
                      h.Class(
                        `shrink-0 border-b-2 px-3 py-3 text-sm font-semibold outline-focus-ring focus-visible:outline-2 ${tab.id === props.selectedTab ? "border-brand text-brand-secondary" : "border-transparent text-text-quaternary hover:text-text-secondary"}`,
                      ),
                      h.OnClick(props.onTab(tab.id)),
                      h.Type("button"),
                    ],
                    [tab.label],
                  ),
                ),
              ),
              h.div(
                [h.Class("relative w-full md:max-w-44")],
                [
                  h.select(
                    [
                      h.AriaLabel(props.sortLabel),
                      h.Class(
                        "w-full appearance-none rounded-lg bg-bg-primary px-3 py-2.5 pr-9 text-md text-text-primary shadow-xs ring-1 ring-border-primary outline-focus-ring focus-visible:outline-2",
                      ),
                      h.OnChange(props.onSort),
                      h.Value(props.selectedSort),
                    ],
                    props.sortOptions.map((option) =>
                      h.option([h.Value(option.id)], [option.label]),
                    ),
                  ),
                ],
              ),
            ],
          ),
          h.ul(
            [
              h.Class(
                "grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-12 lg:grid-cols-3",
              ),
            ],
            props.articles.map((article, index) =>
              h.keyed("li")(
                article.id,
                [h.Class(index >= 6 ? "max-lg:hidden" : "")],
                [articleCard(article, props.onArticle, h)],
              ),
            ),
          ),
          pagination(
            {
              messageForPage: props.onPage,
              page: props.page,
              rounded: true,
              total: props.pageCount,
              variant: "page-default",
            },
            h,
          ),
        ],
      ),
    ],
  );
