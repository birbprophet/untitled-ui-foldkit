/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noTernary -- Input placeholder text and the responsive article branches directly mirror the authenticated source. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { pagination } from "../application/pagination.ts";

export interface BlogHeaderSidebar01Article {
  readonly author: { readonly href: string; readonly name: string };
  readonly category: { readonly href: string; readonly name: string };
  readonly href: string;
  readonly id: string;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly summary: string;
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogHeaderSidebar01Category {
  readonly href: string;
  readonly id: string;
  readonly label: string;
}

export interface BlogHeaderSidebar01Props<Message> {
  readonly activeCategoryId: string;
  readonly articles: readonly BlogHeaderSidebar01Article[];
  readonly categories: readonly BlogHeaderSidebar01Category[];
  readonly description: string;
  readonly email: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly onArticle: (id: string) => NoInfer<Message>;
  readonly onAuthor: (id: string) => NoInfer<Message>;
  readonly onCategorySelect: (id: string) => NoInfer<Message>;
  readonly onEmailInput: (email: string) => NoInfer<Message>;
  readonly onPageChange: (page: number) => NoInfer<Message>;
  readonly onSearchInput: (query: string) => NoInfer<Message>;
  readonly onSubscribe: NoInfer<Message>;
  readonly page: number;
  readonly privacyHref: string;
  readonly privacyLabel: string;
  readonly query: string;
  readonly searchLabel: string;
  readonly subscribeLabel: string;
}

const searchIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 20 20"),
    ],
    [
      h.circle([h.Cx("9"), h.Cy("9"), h.R("5.75"), h.Stroke("currentColor"), h.StrokeWidth("1.5")]),
      h.path([
        h.D("m13.25 13.25 3.5 3.5"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeWidth("1.5"),
      ]),
    ],
  );

const arrowUpRight = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0"),
      h.DataAttribute("icon", "trailing"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("M7 17 17 7M7 7h10v10"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const articleCard = <Message>(
  article: BlogHeaderSidebar01Article,
  props: BlogHeaderSidebar01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-4")],
    [
      h.div(
        [h.Class("relative overflow-hidden")],
        [
          h.a(
            [
              h.Class(
                "relative block w-full overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:z-10 before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
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
            [
              h.Class(
                "absolute inset-x-0 bottom-0 overflow-hidden bg-linear-to-b from-transparent to-black/40",
              ),
            ],
            [
              h.div(
                [
                  h.Class(
                    "relative flex items-start justify-between bg-alpha-white/30 p-4 backdrop-blur-md before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-alpha-white/30 md:p-5",
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
                          h.Href(article.author.href),
                          h.OnClick(props.onAuthor(article.id)),
                        ],
                        [article.author.name],
                      ),
                      h.time([h.Class("block text-sm text-white")], [article.publishedAt]),
                    ],
                  ),
                  h.a(
                    [
                      h.Class(
                        "rounded-xs text-sm font-semibold text-white outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(article.category.href),
                      h.OnClick(props.onCategorySelect(article.category.name)),
                    ],
                    [article.category.name],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
      h.div(
        [h.Class("flex flex-col items-start gap-5")],
        [
          h.div(
            [h.Class("flex flex-col gap-1")],
            [
              h.a(
                [
                  h.Class(
                    "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Href(article.category.href),
                  h.OnClick(props.onCategorySelect(article.category.name)),
                ],
                [article.title],
              ),
              h.p([h.Class("line-clamp-2 text-md text-text-tertiary")], [article.summary]),
            ],
          ),
          h.a(
            [
              h.Class(
                "group relative inline-flex h-max cursor-pointer items-center justify-normal gap-1.5 whitespace-nowrap rounded p-0 text-md font-semibold text-text-brand-secondary outline-focus-ring transition duration-100 ease-linear hover:text-text-brand-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
              ),
              h.Href(article.href),
              h.OnClick(props.onArticle(article.id)),
            ],
            [
              h.span(
                [
                  h.Class(
                    "px-0.5 underline decoration-transparent underline-offset-4 hover:decoration-fg-brand-secondary-alt",
                  ),
                ],
                ["Read post"],
              ),
              arrowUpRight(h),
            ],
          ),
        ],
      ),
    ],
  );

export const blogHeaderSidebar01 = <Message>(
  props: BlogHeaderSidebar01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("bg-bg-primary"), h.Dir("ltr")],
    [
      h.section(
        [h.Class("bg-bg-secondary py-16 md:py-24")],
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
                  h.form(
                    [
                      h.Class(
                        "mt-8 grid grid-cols-1 items-start gap-4 self-stretch sm:mt-12 sm:grid-cols-[335px_max-content]",
                      ),
                      h.OnSubmit(props.onSubscribe),
                    ],
                    [
                      h.div(
                        [h.Class("flex flex-col gap-1.5")],
                        [
                          h.div(
                            [
                              h.Class(
                                "flex rounded-lg bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset focus-within:ring-2 focus-within:ring-border-brand",
                              ),
                            ],
                            [
                              h.input([
                                h.AriaLabel(props.emailLabel),
                                h.Class(
                                  "w-full bg-transparent px-3.5 py-3 text-md text-text-primary outline-hidden placeholder:text-text-placeholder",
                                ),
                                h.Name("email"),
                                h.OnInput(props.onEmailInput),
                                h.Placeholder(props.emailPlaceholder),
                                h.Required(true),
                                h.Type("email"),
                                h.Value(props.email),
                              ]),
                            ],
                          ),
                          h.span(
                            [h.Class("self-start text-sm text-text-tertiary")],
                            [
                              "We care about your data in our ",
                              h.a(
                                [
                                  h.Class(
                                    "rounded-xs underline underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                                  ),
                                  h.Href(props.privacyHref),
                                ],
                                [props.privacyLabel],
                              ),
                              ".",
                            ],
                          ),
                        ],
                      ),
                      button(
                        {
                          color: "primary",
                          label: props.subscribeLabel,
                          size: "xl",
                          type: "submit",
                        },
                        h,
                      ),
                    ],
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
            "mx-auto flex w-full max-w-container flex-col gap-12 px-4 py-16 md:gap-16 md:px-8 md:py-24",
          ),
        ],
        [
          h.div(
            [h.Class("flex flex-col gap-12 md:flex-row md:gap-16")],
            [
              h.div(
                [h.Class("flex w-full flex-col items-stretch md:max-w-70 md:gap-8")],
                [
                  h.div(
                    [
                      h.Class(
                        "hidden items-center gap-2 rounded-lg bg-bg-primary px-3.5 py-3 shadow-xs ring-1 ring-border-primary ring-inset focus-within:ring-2 focus-within:ring-border-brand md:flex",
                      ),
                    ],
                    [
                      searchIcon(h),
                      h.input([
                        h.AriaLabel(props.searchLabel),
                        h.Class(
                          "min-w-0 flex-1 bg-transparent text-md text-text-primary outline-hidden placeholder:text-text-placeholder",
                        ),
                        h.OnInput(props.onSearchInput),
                        h.Placeholder("Search"),
                        h.Type("search"),
                        h.Value(props.query),
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
                      h.nav(
                        [
                          h.AriaLabel("Blog categories"),
                          h.Class("flex w-full flex-1 self-start overflow-auto md:self-auto"),
                        ],
                        [
                          h.div(
                            [h.Class("flex min-w-max gap-1 md:w-full md:min-w-0 md:flex-col")],
                            props.categories.map((category) =>
                              h.a(
                                [
                                  h.AriaCurrent(
                                    category.id === props.activeCategoryId ? "page" : "false",
                                  ),
                                  h.Class(
                                    category.id === props.activeCategoryId
                                      ? "rounded-md bg-bg-active px-3 py-2.5 text-md font-semibold text-text-secondary"
                                      : "rounded-md px-3 py-2.5 text-md font-semibold text-text-tertiary hover:bg-bg-primary-hover hover:text-text-secondary",
                                  ),
                                  h.Href(category.href),
                                  h.OnClick(props.onCategorySelect(category.id)),
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
                  .slice(0, 8)
                  .map((article, index) =>
                    h.keyed("li")(
                      article.id,
                      [
                        h.Class(
                          `flex flex-col gap-6 md:gap-8 ${index >= 6 ? "max-lg:hidden" : ""}`,
                        ),
                      ],
                      [articleCard(article, props, h)],
                    ),
                  ),
              ),
            ],
          ),
          pagination(
            {
              align: "center",
              messageForPage: props.onPageChange,
              page: props.page,
              total: 10,
              variant: "page-minimal-center",
            },
            h,
          ),
        ],
      ),
    ],
  );
