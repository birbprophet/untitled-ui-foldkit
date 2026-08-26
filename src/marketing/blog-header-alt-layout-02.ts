/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noTernary -- The authenticated input uses Tailwind's placeholder variant. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { pagination } from "../application/pagination.ts";
import { badge } from "../base/badges.ts";
import type { BadgeColor } from "../base/badges.ts";

export interface BlogHeaderAltLayout02Tag {
  readonly color: BadgeColor;
  readonly href: string;
  readonly name: string;
}

export interface BlogHeaderAltLayout02Article {
  readonly authorHref: string;
  readonly authorName: string;
  readonly categoryHref: string;
  readonly href: string;
  readonly id: string;
  readonly isFeatured?: boolean;
  readonly publishedAt: string;
  readonly summary: string;
  readonly tags: readonly BlogHeaderAltLayout02Tag[];
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogHeaderAltLayout02Props<Message> {
  readonly articles: readonly BlogHeaderAltLayout02Article[];
  readonly description: string;
  readonly email: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly onArticle: (id: string) => NoInfer<Message>;
  readonly onAuthor: (id: string) => NoInfer<Message>;
  readonly onEmail: (email: string) => NoInfer<Message>;
  readonly onPage: (page: number) => NoInfer<Message>;
  readonly onSubscribe: NoInfer<Message>;
  readonly onTag: (articleId: string, tagName: string) => NoInfer<Message>;
  readonly page: number;
  readonly pageCount: number;
  readonly privacyHref: string;
}

const arrow = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("mt-0.5 size-5 shrink-0 text-fg-quaternary"),
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

const tags = <Message>(
  article: BlogHeaderAltLayout02Article,
  onTag: (articleId: string, tagName: string) => Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("flex flex-wrap gap-2")],
    article.tags.map((tag) =>
      h.keyed("a")(
        tag.name,
        [
          h.Class(
            "rounded-xl outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.Href(tag.href),
          h.OnClick(onTag(article.id, tag.name)),
        ],
        [badge({ color: tag.color, label: tag.name, size: "md", type: "color" }, h)],
      ),
    ),
  );

const articleText = <Message>(
  article: BlogHeaderAltLayout02Article,
  props: BlogHeaderAltLayout02Props<Message>,
  h: HtmlBuilder<Message>,
  horizontal: boolean,
): Html =>
  h.div(
    [h.Class(horizontal ? "flex flex-col gap-5" : "flex flex-col gap-6")],
    [
      h.div(
        [h.Class("flex flex-col items-start gap-2")],
        [
          h.p(
            [h.Class("text-sm font-semibold text-text-brand-secondary")],
            [
              h.a(
                [
                  h.Class(
                    "rounded-xs outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Href(article.authorHref),
                  h.OnClick(props.onAuthor(article.id)),
                ],
                [article.authorName],
              ),
              " • ",
              h.time([], [article.publishedAt]),
            ],
          ),
          h.div(
            [h.Class("flex w-full flex-col gap-1")],
            [
              h.a(
                [
                  h.Class(
                    "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Href(horizontal ? article.href : article.categoryHref),
                  h.OnClick(props.onArticle(article.id)),
                ],
                horizontal ? [article.title] : [article.title, arrow(h)],
              ),
              h.p([h.Class("line-clamp-2 text-md text-text-tertiary")], [article.summary]),
            ],
          ),
        ],
      ),
      tags(article, props.onTag, h),
    ],
  );

const articleCard = <Message>(
  article: BlogHeaderAltLayout02Article,
  props: BlogHeaderAltLayout02Props<Message>,
  h: HtmlBuilder<Message>,
  horizontal: boolean,
): Html =>
  h.article(
    [
      h.Class(
        horizontal ? "flex flex-col gap-4 xl:flex-row xl:items-start" : "flex flex-col gap-4",
      ),
    ],
    [
      h.a(
        [
          h.Class(
            "relative shrink-0 overflow-hidden rounded-2xl before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
          ),
          h.Href(article.href),
          h.OnClick(props.onArticle(article.id)),
          h.Tabindex(-1),
        ],
        [
          h.img([
            h.Alt(article.title),
            h.Class(
              `aspect-[1.5] w-full object-cover transition duration-100 ease-linear hover:scale-105 ${horizontal ? "xl:w-80" : ""}`,
            ),
            h.Src(article.thumbnailUrl),
          ]),
        ],
      ),
      articleText(article, props, h, horizontal),
    ],
  );

export const blogHeaderAltLayout02 = <Message>(
  props: BlogHeaderAltLayout02Props<Message>,
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
                  h.form(
                    [
                      h.Class(
                        "mt-8 grid w-full grid-cols-1 items-start gap-4 sm:mt-12 sm:w-auto sm:grid-cols-[335px_max-content]",
                      ),
                      h.OnSubmit(props.onSubscribe),
                    ],
                    [
                      h.div(
                        [h.Class("flex flex-col gap-1.5")],
                        [
                          h.input([
                            h.AriaLabel("Email address"),
                            h.Class(
                              "h-11 rounded-lg bg-bg-primary px-3.5 py-2.5 text-md text-text-primary shadow-xs ring-1 ring-border-primary outline-focus-ring placeholder:text-text-placeholder focus-visible:outline-2",
                            ),
                            h.Name("email"),
                            h.OnInput(props.onEmail),
                            h.Placeholder("Enter your email"),
                            h.Required(true),
                            h.Type("email"),
                            h.Value(props.email),
                          ]),
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
                            "inline-flex h-12 items-center justify-center rounded-lg bg-bg-brand-solid px-5 py-3 text-md font-semibold text-white shadow-xs outline-focus-ring hover:bg-bg-brand-solid-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                          ),
                          h.Type("submit"),
                        ],
                        ["Get started"],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
      h.section(
        [
          h.Class(
            "mx-auto flex w-full max-w-container flex-col gap-8 bg-bg-primary px-4 pb-16 md:px-8 md:pb-24",
          ),
        ],
        [
          h.h2(
            [h.Class("text-xl font-semibold text-text-primary md:text-display-xs")],
            ["Recent blog posts"],
          ),
          h.ul(
            [h.Class("grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-8")],
            props.articles
              .slice(0, 3)
              .map((article, index) =>
                h.keyed("li")(
                  article.id,
                  [
                    h.Class(
                      `${article.isFeatured === true ? "xl:row-span-2" : "xl:flex-row xl:gap-6"} flex flex-col gap-6 md:gap-8`,
                    ),
                  ],
                  [articleCard(article, props, h, index !== 0)],
                ),
              ),
          ),
        ],
      ),
      h.section(
        [
          h.Class(
            "mx-auto flex w-full max-w-container flex-col gap-8 bg-bg-primary px-4 pb-16 md:px-8 md:pb-24 lg:gap-16",
          ),
        ],
        [
          h.div(
            [h.Class("flex flex-col gap-8")],
            [
              h.h2(
                [h.Class("text-xl font-semibold text-text-primary md:text-display-xs")],
                ["All blog posts"],
              ),
              h.ul(
                [h.Class("grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3")],
                props.articles
                  .slice(3)
                  .map((article, index) =>
                    h.keyed("li")(
                      article.id,
                      [h.Class(index > 2 ? "max-lg:hidden" : "")],
                      [articleCard(article, props, h, false)],
                    ),
                  ),
              ),
            ],
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
