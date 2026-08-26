/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary -- Direct FoldKit transcription; the authenticated inputs use Tailwind placeholder variants. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { pagination } from "../application/pagination.ts";

export interface BlogHeaderSimple01Article {
  readonly authorHref: string;
  readonly authorName: string;
  readonly avatarUrl: string;
  readonly category: string;
  readonly href: string;
  readonly id: string;
  readonly publishedAt: string;
  readonly summary: string;
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogHeaderSimple01Option {
  readonly id: string;
  readonly label: string;
}

export interface BlogHeaderSimple01Props<Message> {
  readonly articles: readonly BlogHeaderSimple01Article[];
  readonly categories: readonly BlogHeaderSimple01Option[];
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly newsletterDescription: string;
  readonly newsletterEmail: string;
  readonly newsletterPrivacyHref: string;
  readonly newsletterTitle: string;
  readonly onArticle: (id: string) => NoInfer<Message>;
  readonly onAuthor: (id: string) => NoInfer<Message>;
  readonly onCategory: (id: string) => NoInfer<Message>;
  readonly onNewsletterEmail: (email: string) => NoInfer<Message>;
  readonly onNewsletterSubscribe: NoInfer<Message>;
  readonly onPage: (page: number) => NoInfer<Message>;
  readonly onSearch: (query: string) => NoInfer<Message>;
  readonly onSort: (id: string) => NoInfer<Message>;
  readonly page: number;
  readonly pageCount: number;
  readonly query: string;
  readonly selectedCategory: string;
  readonly sortBy: string;
  readonly sortOptions: readonly BlogHeaderSimple01Option[];
}

const icon = <Message>(kind: "arrow" | "search" | "send", h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(
        kind === "send"
          ? "size-6 text-fg-secondary"
          : kind === "search"
            ? "size-5 text-fg-quaternary"
            : "mt-0.5 size-6 shrink-0 text-fg-quaternary transition duration-100 ease-linear group-hover/title:text-fg-quaternary-hover",
      ),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          kind === "search"
            ? "m21 21-3.5-3.5m2.5-6a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z"
            : kind === "send"
              ? "M10.5 13.5 21 3M10.627 13.828l2.628 6.758c.232.596.347.893.514.98a.5.5 0 0 0 .462 0c.167-.086.283-.384.515-.979l6.59-16.888c.21-.537.315-.806.258-.977a.5.5 0 0 0-.316-.316c-.172-.057-.44.048-.978.257L3.413 9.253c-.595.233-.893.349-.98.516a.5.5 0 0 0 0 .461c.087.167.385.283.98.514l6.758 2.629c.121.046.182.07.233.106a.5.5 0 0 1 .116.117c.037.05.06.111.107.232Z"
              : "M7 17 17 7m0 0H7m10 0v10",
        ),
      ]),
    ],
  );

const articleCard = <Message>(
  article: BlogHeaderSimple01Article,
  props: BlogHeaderSimple01Props<Message>,
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
            [h.Class("flex flex-col gap-2")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-text-brand-secondary")],
                [article.category],
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
                      h.OnClick(props.onArticle(article.id)),
                    ],
                    [article.title, icon("arrow", h)],
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
                [
                  h.Class("flex"),
                  h.Href(article.authorHref),
                  h.OnClick(props.onAuthor(article.id)),
                  h.Tabindex(-1),
                ],
                [
                  h.img([
                    h.Alt(article.authorName),
                    h.Class("size-10 rounded-full object-cover ring-1 ring-border-secondary-alt"),
                    h.Src(article.avatarUrl),
                  ]),
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

const newsletter = <Message>(
  props: BlogHeaderSimple01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.form(
    [
      h.Class(
        "flex flex-col gap-8 self-start rounded-2xl bg-bg-secondary p-6 shadow-xs ring-1 ring-border-secondary ring-inset md:p-8",
      ),
      h.OnSubmit(props.onNewsletterSubscribe),
    ],
    [
      h.div(
        [
          h.Class(
            "flex size-14 items-center justify-center rounded-xl bg-bg-primary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
          ),
        ],
        [icon("send", h)],
      ),
      h.div(
        [h.Class("flex flex-col gap-6")],
        [
          h.div(
            [h.Class("flex flex-col gap-1")],
            [
              h.h2([h.Class("text-xl font-semibold text-text-primary")], [props.newsletterTitle]),
              h.p([h.Class("text-md text-text-tertiary")], [props.newsletterDescription]),
            ],
          ),
          h.div(
            [h.Class("flex flex-col gap-4")],
            [
              h.div(
                [h.Class("flex flex-col gap-1.5")],
                [
                  h.input([
                    h.AriaLabel("Newsletter email address"),
                    h.Class(
                      "h-11 rounded-lg bg-bg-primary px-3.5 py-2.5 text-md text-text-primary shadow-xs ring-1 ring-border-primary outline-focus-ring placeholder:text-text-placeholder focus-visible:outline-2",
                    ),
                    h.Name("email"),
                    h.OnInput(props.onNewsletterEmail),
                    h.Placeholder("Enter your email"),
                    h.Required(true),
                    h.Type("email"),
                    h.Value(props.newsletterEmail),
                  ]),
                  h.span(
                    [h.Class("text-sm text-text-tertiary")],
                    [
                      "Read about our ",
                      h.a(
                        [
                          h.Class(
                            "rounded-xs underline decoration-utility-neutral-300 underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                          ),
                          h.Href(props.newsletterPrivacyHref),
                        ],
                        ["privacy policy"],
                      ),
                      ".",
                    ],
                  ),
                ],
              ),
              h.button(
                [
                  h.Class(
                    "inline-flex h-11 items-center justify-center rounded-lg bg-bg-brand-solid px-4 py-2.5 text-md font-semibold text-white shadow-xs outline-focus-ring hover:bg-bg-brand-solid-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Type("submit"),
                ],
                ["Subscribe"],
              ),
            ],
          ),
        ],
      ),
    ],
  );

export const blogHeaderSimple01 = <Message>(
  props: BlogHeaderSimple01Props<Message>,
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
                [h.Class("mx-auto flex w-full max-w-3xl flex-col items-center text-center")],
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
                  h.div(
                    [h.Class("relative mt-8 grid self-stretch sm:mt-12 sm:w-80 sm:self-center")],
                    [
                      h.div(
                        [h.Class("pointer-events-none absolute top-3 left-3.5")],
                        [icon("search", h)],
                      ),
                      h.input([
                        h.AriaLabel("Search"),
                        h.Class(
                          "h-11 rounded-lg bg-bg-primary py-2.5 pr-3.5 pl-10.5 text-md text-text-primary shadow-xs ring-1 ring-border-primary outline-focus-ring placeholder:text-text-placeholder focus-visible:outline-2",
                        ),
                        h.OnInput(props.onSearch),
                        h.Placeholder("Search"),
                        h.Required(true),
                        h.Type("search"),
                        h.Value(props.query),
                      ]),
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
            "mx-auto flex w-full max-w-container flex-col gap-12 px-4 pb-16 md:gap-16 md:px-8 md:pb-24",
          ),
        ],
        [
          h.div(
            [h.Class("flex flex-col gap-8 md:flex-row md:items-end md:justify-between")],
            [
              h.div(
                [h.Class("-mx-4 -my-1 flex gap-1 overflow-auto px-4 py-1 md:-ml-8 md:pl-8")],
                props.categories.map((category) =>
                  h.keyed("button")(
                    category.id,
                    [
                      h.AriaPressed(String(category.id === props.selectedCategory)),
                      h.Class(
                        `whitespace-nowrap rounded-md px-3 py-2 text-md font-semibold outline-focus-ring hover:text-text-secondary-hover focus-visible:outline-2 ${category.id === props.selectedCategory ? "bg-bg-active text-text-brand-secondary" : "text-text-quaternary"}`,
                      ),
                      h.OnClick(props.onCategory(category.id)),
                      h.Type("button"),
                    ],
                    [category.label],
                  ),
                ),
              ),
              h.select(
                [
                  h.AriaLabel("Sort by"),
                  h.Class(
                    "h-10 w-full rounded-lg bg-bg-primary px-3 text-sm font-semibold text-text-secondary shadow-xs ring-1 ring-border-primary outline-focus-ring md:max-w-44",
                  ),
                  h.OnChange(props.onSort),
                  h.Value(props.sortBy),
                ],
                props.sortOptions.map((option) =>
                  h.keyed("option")(option.id, [h.Value(option.id)], [option.label]),
                ),
              ),
            ],
          ),
          h.ul(
            [
              h.Class(
                "grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-12 lg:grid-cols-3",
              ),
            ],
            props.articles.flatMap((article, index) => [
              ...(index === 3 ? [h.keyed("li")("newsletter", [], [newsletter(props, h)])] : []),
              h.keyed("li")(
                article.id,
                [h.Class(index > 4 ? "max-lg:hidden" : "")],
                [articleCard(article, props, h)],
              ),
            ]),
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
